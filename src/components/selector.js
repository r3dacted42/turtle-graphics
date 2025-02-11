import { mat3, vec2 } from "gl-matrix";
import PrimitiveGroup from "../lib/primitiveGroup";

export default class Selector {
    constructor(canvas, scene, controls) {
        this.canvas = canvas;
        this.scene = scene;
        this.controls = controls;
        this.isDown = false;
        this.moved = false;
        this.selectionElem = document.getElementById("selection");
        this.downPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.topLeft = { x: 0, y: 0 };
        this.bottomRight = { x: 0, y: 0 };

        this.canvas.addEventListener('pointerdown', (e) => this.onSelectionBegin(e));
        this.canvas.addEventListener('pointermove', (e) => this.onSelectionMoved(e));
        this.canvas.addEventListener('pointerleave', (e) => this.onSelectionEnd(e));
        this.canvas.addEventListener('pointerup', (e) => this.onSelectionEnd(e));
    }

    onSelectionBegin(e) {
        if (e.currentTarget !== e.target) return;
        this.downPos.x = e.clientX;
        this.downPos.y = e.clientY;
        this.isDown = true;
    }

    onSelectionMoved(e) {
        if (!this.isDown || e.currentTarget !== e.target) return;
        this.lastPos.x = e.clientX;
        this.lastPos.y = e.clientY;
        this.moved = true;
        this.displaySelection();
    }

    onSelectionEnd(e) {
        if (!this.isDown || e.currentTarget !== e.target) return;
        this.isDown = false;
        this.endSelection();
    }

    displaySelection() {
        if (!(this.isDown && this.moved)) return;
        this.topLeft.x = Math.min(this.downPos.x, this.lastPos.x);
        this.topLeft.y = Math.min(this.downPos.y, this.lastPos.y);
        this.bottomRight.x = Math.max(this.downPos.x, this.lastPos.x);
        this.bottomRight.y = Math.max(this.downPos.y, this.lastPos.y);
        this.selectionElem.style.top = `${this.topLeft.y}px`;
        this.selectionElem.style.left = `${this.topLeft.x}px`;
        this.selectionElem.style.height = `${this.bottomRight.y - this.topLeft.y}px`;
        this.selectionElem.style.width = `${this.bottomRight.x - this.topLeft.x}px`;
    }
    
    endSelection() {
        this.selectionElem.style.top = 0;
        this.selectionElem.style.left = 0;
        this.selectionElem.style.height = 0;
        this.selectionElem.style.width = 0;
        const selectedPrims = [];
        for (const prim of this.scene.primitives) {
            if (this.isCovered(prim)) selectedPrims.push(prim);
        }
        console.log(selectedPrims);
        if (selectedPrims.length === 0) {
            this.controls.setSelection(null);
        } else if (selectedPrims.length === 1) {
            this.controls.setSelection(selectedPrims[0]);
        } else if (selectedPrims.length === this.scene.primitives.length) {
            this.controls.setSelection(this.scene);
        } else {
            var group = this.groupExists(selectedPrims);
            if (!group) {
                group = new PrimitiveGroup(
                    `group${this.scene.groups.length}`,
                    selectedPrims,
                    this.scene,
                );
                this.scene.addGroup(group);
            }
            this.controls.setSelection(group);
        }
    }

    groupExists(prims) {
        for (const group of this.scene.groups) {
            if (group.isEquivalent(prims)) return group;
        }
        return null;
    }

    isCovered(prim) {
        const grpTfmMat = mat3.create();
        for (const group of this.scene.groups) {
            if (group.hasPrimitive(prim)) {
                mat3.multiply(grpTfmMat, group.transform.transformMatrix, grpTfmMat);
            }
        }
        const sceneTfMat = this.scene.transform.transformMatrix;
        for (const mode of prim.modes) {
            for (const v of mode.vertices) {
                const vert = [0, 0];
                const tfm = mat3.create();
                mat3.multiply(tfm, grpTfmMat, prim.transform.transformMatrix);
                mat3.multiply(tfm, sceneTfMat, tfm);
                vec2.transformMat3(vert, [v.x, v.y], tfm);
                if (vert[0] < this.topLeft.x || vert[0] > this.bottomRight.x
                    || vert[1] < this.topLeft.y || vert[1] > this.bottomRight.y) {
                    return false;
                }
            }
        }
        return true;
    }
}