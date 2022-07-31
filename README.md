## Speed-metrics

![metrics.png](https://raw.githubusercontent.com/rpg59/speed-metrics/master/screens/metrics.png)

### Installation

```sh
npm i @rpg59/speed-metrics
```

### Example

```js
const speedMetrics = new SpeedMetrics();
const render = () => {
  speedMetrics.update();
  requestAnimationFrame(render);
};

document.body.appendChild(speedMetrics.canvas);

render();
```
