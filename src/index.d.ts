type RefreshConfigType = {
  avgFps: boolean;
  frameTimeline: boolean;
};

export class SpeedMetrics {
  canvas: HTMLCanvasElement;

  constructor(config: { frameTimeline: boolean } = { frameTimeline: true }) {}

  update(): void;
  refresh(config: RefreshConfigType): void;
}
