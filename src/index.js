class Buffer {
  constructor(size) {
    this.size = size;
    this.container = new Array(size).fill(null);
    this.counter = 0;
  }

  push(value) {
    if (this.counter < this.size) {
      this.container[this.counter++] = value;
      return;
    }

    this.container.shift();
    this.container.push(value);
  }
}

const ScaleFactor = 4;
const FrameTimelineOffestY = 75;
const FrameTimelineScaleY = 20;

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
    this.canvas.style.height = "350px";
    this.canvas.width = 500;
    this.canvas.height = 350;
    this.ctx.scale(ScaleFactor, ScaleFactor);
    this.ctx.fillStyle = "#1e8de8";

    this.metrics.forEach((metric, i) => {
      this.ctx.fillText(metric, 0, 18 * i + 9);
    });

    this.frameTimeBuffer = new Buffer(~~(this.canvas.width / ScaleFactor));

    const frameTimelineGradient = this.ctx.createLinearGradient(0, 75, 0, 100);

    frameTimelineGradient.addColorStop(0, "red");
    frameTimelineGradient.addColorStop(1, "yellow");
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = frameTimelineGradient;

    this.prevFrameTimestamp = performance.now();
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

  updateFrameTimeline() {
    this.ctx.clearRect(0, 70, 125, 17.5);

    for (let i = 0; i < this.frameTimeBuffer.counter; ++i) {
      if (i === 0) {
        continue;
      }

      const frameTime = Math.min(this.frameTimeBuffer.container[i], 250);

      this.ctx.beginPath();
      this.ctx.moveTo(
        i - 1,
        this.frameTimeBuffer.container[i - 1] / FrameTimelineScaleY +
          FrameTimelineOffestY
      );
      this.ctx.lineTo(
        i,
        frameTime / FrameTimelineScaleY + FrameTimelineOffestY
      );
      this.ctx.stroke();
    }
  }

  update() {
    const t = performance.now();
    const d = t - this.timestamp;

    this.frameTimeBuffer.push(t - this.prevFrameTimestamp);
    this.prevFrameTimestamp = t;
    this.frameCounter++;

    this.updateFrameTimeline();

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
    this.ctx.clearRect(
      100,
      0,
      this.canvas.width / ScaleFactor,
      this.canvas.height / ScaleFactor
    );
    this.ctx.fillStyle = "orange";

    this.metrics.forEach((metric, i) => {
      this.ctx.fillText(metricMap[metric], 100, 18 * i + 9);
    });
  }
}
