import { vec2, mat3 } from "gl-matrix";
import Transform from "./transform";

export default class Scene {
	constructor(turle) {
		this.primitives = []
		this.turtle = turle;
		this.transform = new Transform();
		this.groups = [];
	}

	add(primitive) {
		if (primitive) {
			this.primitives.push(primitive);
		}
	}

	addGroup(group) {
		if (group) {
			this.groups.push(group);
		}
	}

	remove(primOrGroup) {
		if (primOrGroup) {
			let index = this.primitives.indexOf(primOrGroup);
			if (index > -1) {
				this.primitives.splice(index, 1);
			}
			index = this.groups.indexOf(primOrGroup);
			if (index > -1) {
				this.groups.splice(index, 1);
			}
		}
	}

	getPrimitives() {
		return [...this.primitives, this.turtle];
	}

	getSelectables() {
		return [...this.primitives, ...this.groups];
	}

	movePrimitive(index, delta) {
		const destIdx = index + delta;
		if (destIdx < 0 || destIdx >= this.primitives.length) {
			return 0;
		}
		const moving = this.primitives.splice(index, 1);
		this.primitives.splice(destIdx, 0, ...moving);
		return destIdx;
	}

	activate() {
		for (const p of this.primitives) {
			p.activate();
		}
	}

	deactivate() {
		for (const p of this.primitives) {
			p.deactivate();
		}
	}

	getTransformedCentroid(primitive, group) {
		const tfm = mat3.create();
		mat3.multiply(tfm, primitive.transform.transformMatrix, tfm);
		for (const g of this.groups) {
			if (g.hasPrimitive(primitive) && g !== group)
				mat3.multiply(tfm, g.transform.transformMatrix, tfm);
		}
		return vec2.transformMat3([0, 0], primitive.centroid, tfm);
	}

	getSceneCentroid() {
		const centroid = [0, 0];
		for (const prim of this.primitives) {
			const tc = this.getTransformedCentroid(prim, null);
			centroid[0] += tc[0];
			centroid[1] += tc[1];
		}
		centroid[0] /= this.primitives.length;
		centroid[1] /= this.primitives.length;
		return centroid;
	}

	updateTransformMatrix() {
		this.transform.updateTransformMatrix(this.getSceneCentroid());
	}
}
