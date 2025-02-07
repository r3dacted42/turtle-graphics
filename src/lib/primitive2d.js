import { vec2 } from "gl-matrix";
import { Transform } from "./transform";
import { Vertex } from "./vertex";
import { drawModes as allDrawModes } from "./drawModes";
import { hexToRGBA } from "./utils";

export class Primitive2D {
    constructor(name, fillColor = null, lineColor = null) {
        this.name = name;
        this.verts = [];
        this.z = 1;
        this.fillColor = fillColor ?? "#fff";
        this.lineColor = lineColor ?? "#000",
        this.currentMode = {
            fillMode: allDrawModes().tfan,
            lineMode: allDrawModes().lstrip,
        };
        this.modes = [{
            ...this.currentMode,
            vertices: [],
        }];
        this.transform = new Transform();
        this.fill = false;
        this.updateCentroid();
    }

    setMode(lineMode = null, fillMode = null) {
        this.currentMode = {
            fillMode: fillMode ?? this.currentMode.fillMode,
            lineMode: lineMode ?? this.currentMode.lineMode,
        };
        this.modes = [...this.modes, {
            ...this.currentMode,
            vertices: [],
        }];
    }

    addVertex(x, y) {
        const newVert = new Vertex(x, y);
        this.modes[this.modes.length - 1].vertices.push(newVert);
        this.updateCentroid();
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setLineColor(color) {
        this.lineColor = color;
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

    rotate(angleDegrees) {
        this.transform.rotationAngle += angleDegrees;
    }

    setScale(x, y) {
        this.transform.scale.x = x;
        this.transform.scale.y = y;
    }

    translate(x, y) {
        this.transform.translate.x += x;
        this.transform.translate.y += y;
    }

    getDrawModes() {
        const drawModes = [];
        for (const mode of this.modes) {
            const vertices = new Float32Array(
                mode.vertices.reduce((acc, v) => [...acc, v.x, v.y, this.z], [])
            );
            if (this.fill) {
                drawModes.push({
                    vertices: vertices,
                    drawMode: mode.fillMode,
                    color: hexToRGBA(this.fillColor),
                });
            }
            drawModes.push({
                vertices: vertices,
                drawMode: mode.lineMode,
                color: hexToRGBA(this.lineColor),
            });
            if (this.active) {
                drawModes.push({
                    vertices: vertices,
                    drawMode: allDrawModes().lloop,
                    color: [1, 1, 1, 1],
                });
            }
        }
        return drawModes;
    }

    updateCentroid() {
        const centroid = [0, 0];
        let vertCount = 0;
        for (const mode of this.modes) {
            for (const v of mode.vertices) {
                centroid[0] += v.x;
                centroid[1] += v.y;
                vertCount++;
            }
        }
        centroid[0] /= vertCount;
        centroid[1] /= vertCount;
        this.centroid = vec2.fromValues(centroid[0], centroid[1]);
    }

    updateTransformMatrix(resMat) {
        this.transform.updateTransformMatrix(resMat, this.centroid);
    }
}