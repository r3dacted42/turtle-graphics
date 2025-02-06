export class Vertex {
    constructor(x, y, color, lineMode, fillMode) {
        this.x = x;
        this.y = y;
        // z managed by primitive
        this.fillColor = color;
        this.lineColor = [0.25, 0.25, 0.25, 1];
        this.lineMode = lineMode;
        this.fillMode = fillMode;
    }
}