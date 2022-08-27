export class SpeedMetrics {
  static AVG_METRIC: number;
  static FRAME_TIMELINE_METRIC: number;

  canvas: HTMLCanvasElement;

  update(): void;
  refresh(mask: number): void;
}
