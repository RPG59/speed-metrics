export class SpeedMetrics {
  metrics = ["FPS", "FPS Avg", "FPS 1% Low", "Memory Mb"];
  fpsMap = {};

  constructor() {
    this.timestamp = performance.now();
    this.frameCounter = 0;
    this.avgCalculations = 0;
    this.avgFps = 0;
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "speedMetricsCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.style.width = "500px";
    this.canvas.style.height = "300px";
    this.canvas.width = 500;
    this.canvas.height = 300;
    this.ctx.scale(4, 4);
    this.ctx.fillStyle = "#1e8de8";

    this.metrics.forEach((metric, i) => {
      this.ctx.fillText(metric, 0, 18 * i + 9);
    });
  }

  get1Low() {
    const sortedKeys = Object.keys(this.fpsMap);
    const index = (this.avgCalculations - 1) * 0.01;
    const lower = Math.floor(index);
    const w = index % 1;
    let arrCounter = 0;

    for (let i = 0; i < sortedKeys.length - 1; ++i) {
      arrCounter += this.fpsMap[sortedKeys[i]];

      if ((arrCounter === lower && !w) || arrCounter > lower) {
        return sortedKeys[i];
      }

      if (arrCounter === lower && w) {
        return sortedKeys[i] * (1 - w) + sortedKeys[i + 1] * w;
      }
    }

    return sortedKeys[0];
  }

  calculateAvgFps(fps) {
    this.avgCalculations++;

    this.avgFps =
      ((this.avgCalculations - 1) * this.avgFps + fps) / this.avgCalculations;
  }

  updateFpsMap(fps) {
    if (!this.fpsMap[fps]) {
      this.fpsMap[fps] = 1;

      return;
    }

    this.fpsMap[fps]++;
  }

  update() {
    const t = performance.now();
    const d = t - this.timestamp;

    this.frameCounter++;

    if (d < 1000) {
      return;
    }

    const fps = ~~((this.frameCounter * 1000) / d);

    this.updateFpsMap(fps);
    this.calculateAvgFps(fps);

    const metricMap = {
      FPS: fps,
      "FPS Avg": Math.round(this.avgFps),
      "Memory Mb":
        performance.memory &&
        (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      "FPS 1% Low": ~~this.get1Low(),
    };

    this.timestamp = t;
    this.frameCounter = 0;

    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(100, 0, 100, 100);
    this.ctx.fillStyle = "orange";

    this.metrics.forEach((metric, i) => {
      this.ctx.fillText(metricMap[metric], 100, 18 * i + 9);
    });
  }
}
