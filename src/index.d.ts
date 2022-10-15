type RefreshConfigType = {
  avgFps: boolean;
  frameTimeline: boolean;
};

type FpsData = {
  avg: number;
  lov1: number;
};

export class SpeedMetrics {
  canvas: HTMLCanvasElement;

  constructor(config: { frameTimeline: boolean } = { frameTimeline: true }) {}

  update(): void;
  refresh(config: RefreshConfigType): void;
  getData(): FpsData;
}
