import * as d3 from "d3";

export class RoadmapStyle {
  barHeight = 20;
  topPadding = 20;
  timeFormat = d3.timeFormat("%b %d");
  tickInterval = d3.timeMonday;
  gap;

  /**
   * @param {object} style
   */
  constructor(style) {
    if (style.barHeight !== undefined) {
      this.barHeight = parseInt(style.barHeight);
    }
    if (style.timeFormat !== undefined) {
      this.timeFormat = d3.timeFormat(style.timeFormat);
    }
    if (style.tickInterval !== undefined && d3.hasOwnProperty(style.tickInterval)) {
      this.tickInterval = d3[style.tickInterval];
    }
    this.gap = this.barHeight + 4;
  }
}