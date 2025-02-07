import { glMatrix, mat3, vec2 } from "gl-matrix";
import { Transform } from "../lib/transform";

export default class Turtle {
    constructor(x, y) {
        this.name = 'turtle';
        // point position
        this.position = [x, y];
        // turn angle
        this.angle = 0;

        this.z = 1;
        this.updateVerts();
        this.fillColor = [0, 1, 0.15, 1];
        this.lineColor = [0, 0, 0, 1];
        this.fill = true;
        this.lineDrawMode = window['glContext'].LINE_STRIP;
        this.fillDrawMode = window['glContext'].TRIANGLE_FAN;
        this.transform = new Transform();
    }

    pointToVerts(x, y) {
        return [
            [x,      y - 25],
            [x - 15, y + 8],
            [x,      y],
            [x + 15, y + 8],
            [x,      y - 25],
        ];
    }

    forward(amount) {
        const rad = glMatrix.toRadian(this.angle);
        console.log(rad);
        const temp = mat3.create();
        mat3.fromTranslation(temp, [0, -amount]);
        // console.log("translation:", temp);
        mat3.multiply(temp, mat3.fromRotation(mat3.create(), rad), temp);
        // console.log("post rot:", temp);
        const delta = vec2.create();
        vec2.transformMat3(delta, delta, temp);
        this.position[0] += delta[0];
        this.position[1] += delta[1];
        // console.log("new position:", this.position);
        this.updateVerts();
    }

    turn(amount) {
        this.angle -= amount;
        this.updateVerts();
    }

    updateVerts() {
        const verts = this.pointToVerts(0, 0);
        const rad = this.angle * Math.PI / 180;
        const temp = mat3.create();
        mat3.fromRotation(temp, rad);
        mat3.multiply(temp, mat3.fromTranslation(mat3.create(), [...this.position, 1]), temp);
        for (let i = 0; i < verts.length; i ++) {
            vec2.transformMat3(verts[i], verts[i], temp);
        }
        const _p = [];
        for (const v of verts) {
            _p.push(v[0]);
            _p.push(v[1]);
            _p.push(this.z);
        }
        this.vertices = new Float32Array(_p);
    }

    getDrawModes() {
        const modes = [{
            vertices: this.vertices,
            drawMode: this.fillDrawMode,
            color: this.fillColor,
        },{
            vertices: this.vertices,
            drawMode: this.lineDrawMode,
            color: this.lineColor,
        }];
        return modes;
    }

    updateTransformMatrix(resMat) {
        // only needed to convert screen to clip coords
        this.transform.updateTransformMatrix(resMat, [0, 0]);
    }
}