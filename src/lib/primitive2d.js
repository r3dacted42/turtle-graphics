import { vec2 } from "gl-matrix";
import { Transform } from "./transform";

export class Primitive2D {
    constructor(name, vertices, color) {
        this.name = name;
        this.jsverts = vertices;
        this.z = 1;
        const temp = [];
        for (const v of vertices) {
            temp.push(v[0]);
            temp.push(v[1]);
            temp.push(this.z);
        }
        this.vertices = new Float32Array(temp);
        this.fillColor = color;
        this.lineColor = [0.25, 0.25, 0.25, 1];
        this.transform = new Transform();
        this.fill = false;
        this.lineDrawMode = window['glContext'].LINE_STRIP;
        this.fillDrawMode = window['glContext'].TRIANGLE_FAN;
        this.updateCentroid();
    }

    addVertex(x, y) {
        this.jsverts = [...this.jsverts, [x, y]];
        const temp = [];
        for (const v of this.jsverts) {
            temp.push(v[0]);
            temp.push(v[1]);
            temp.push(this.z);
        }
        this.vertices = new Float32Array(temp);
        this.updateCentroid();
    }

    rotate(angleDegrees) {
        this.transform.rotationAngle += angleDegrees;
    }

    setScale(x, y) {
        this.transform.scale[0] = x;
        this.transform.scale[1] = y;
    }

    translate(x, y) {
        this.transform.translate[0] += x;
        this.transform.translate[1] += y;
    }

    getModes() {
        const modes = [{
            drawMode: this.lineDrawMode,
            color: this.lineColor,
        }];
        if (this.fill) {
            modes.push({
                drawMode: this.fillDrawMode,
                color: this.fillColor,
            });
        }
        return modes;
    }

    updateCentroid() {
        const centroid = [0, 0];
        for (const v of this.jsverts) {
            centroid[0] += v[0];
            centroid[1] += v[1];
        }
        centroid[0] /= this.jsverts.length;
        centroid[1] /= this.jsverts.length;
        this.centroid = vec2.fromValues(centroid[0], centroid[1]);
    }

    updateTransformMatrix(resMat) {
        this.transform.updateTransformMatrix(resMat, this.centroid);
    }
}