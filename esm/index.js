function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

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

  clean() {
    this.container.fill(null);
    this.counter = 0;
  }

}

var ScaleFactor = 4;
var FrameTimelineOffestY = 75;
var FrameTimelineScaleY = 20;

var _get1Low = /*#__PURE__*/new WeakSet();

var _calculateAvgFps = /*#__PURE__*/new WeakSet();

var _updateFpsMap = /*#__PURE__*/new WeakSet();

var _updateFrameTimeline = /*#__PURE__*/new WeakSet();

export class SpeedMetrics {
  constructor() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      frameTimeline: true
    };

    _classPrivateMethodInitSpec(this, _updateFrameTimeline);

    _classPrivateMethodInitSpec(this, _updateFpsMap);

    _classPrivateMethodInitSpec(this, _calculateAvgFps);

    _classPrivateMethodInitSpec(this, _get1Low);

    _defineProperty(this, "metrics", ["FPS", "FPS Avg", "FPS 1% Low", "Memory Mb"]);

    _defineProperty(this, "fpsMap", {});

    this.config = config;
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
    var frameTimelineGradient = this.ctx.createLinearGradient(0, 75, 0, 100);
    frameTimelineGradient.addColorStop(0, "red");
    frameTimelineGradient.addColorStop(1, "yellow");
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = frameTimelineGradient;
    this.prevFrameTimestamp = performance.now();
  }

  update() {
    var t = performance.now();
    var d = t - this.timestamp;
    this.frameTimeBuffer.push(t - this.prevFrameTimestamp);
    this.prevFrameTimestamp = t;
    this.frameCounter++;

    if (this.config.frameTimeline) {
      _classPrivateMethodGet(this, _updateFrameTimeline, _updateFrameTimeline2).call(this);
    }

    if (d < 1000) {
      return;
    }

    var fps = ~~(this.frameCounter * 1000 / d);

    _classPrivateMethodGet(this, _updateFpsMap, _updateFpsMap2).call(this, fps);

    _classPrivateMethodGet(this, _calculateAvgFps, _calculateAvgFps2).call(this, fps);

    var metricMap = {
      FPS: fps,
      "FPS Avg": Math.round(this.avgFps),
      "Memory Mb": performance.memory && (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      "FPS 1% Low": ~~_classPrivateMethodGet(this, _get1Low, _get1Low2).call(this)
    };
    this.timestamp = t;
    this.frameCounter = 0;
    this.ctx.fillStyle = "#fff";
    this.ctx.clearRect(100, 0, this.canvas.width / ScaleFactor, this.canvas.height / ScaleFactor);
    this.ctx.fillStyle = "orange";
    this.metrics.forEach((metric, i) => {
      this.ctx.fillText(metricMap[metric], 100, 18 * i + 9);
    });
  }

  refresh(config) {
    if (config !== null && config !== void 0 && config.avgFps) {
      this.avgFps = 0;
      this.avgCalculations = 0;
      this.fpsMap = {};
    }

    if (config !== null && config !== void 0 && config.frameTimeline) {
      this.frameTimeBuffer.clean();
    }
  }

}

function _get1Low2() {
  var sortedKeys = Object.keys(this.fpsMap);
  var index = (this.avgCalculations - 1) * 0.01;
  var lower = Math.floor(index);
  var w = index % 1;
  var arrCounter = 0;

  for (var i = 0; i < sortedKeys.length - 1; ++i) {
    arrCounter += this.fpsMap[sortedKeys[i]];

    if (arrCounter === lower && !w || arrCounter > lower) {
      return sortedKeys[i];
    }

    if (arrCounter === lower && w) {
      return sortedKeys[i] * (1 - w) + sortedKeys[i + 1] * w;
    }
  }

  return sortedKeys[0];
}

function _calculateAvgFps2(fps) {
  this.avgCalculations++;
  this.avgFps = ((this.avgCalculations - 1) * this.avgFps + fps) / this.avgCalculations;
}

function _updateFpsMap2(fps) {
  if (!this.fpsMap[fps]) {
    this.fpsMap[fps] = 1;
    return;
  }

  this.fpsMap[fps]++;
}

function _updateFrameTimeline2() {
  this.ctx.clearRect(0, 70, 125, 17.5);

  for (var i = 0; i < this.frameTimeBuffer.counter; ++i) {
    if (i === 0) {
      continue;
    }

    var frameTime = Math.min(this.frameTimeBuffer.container[i], 250);
    this.ctx.beginPath();
    this.ctx.moveTo(i - 1, this.frameTimeBuffer.container[i - 1] / FrameTimelineScaleY + FrameTimelineOffestY);
    this.ctx.lineTo(i, frameTime / FrameTimelineScaleY + FrameTimelineOffestY);
    this.ctx.stroke();
  }
}