import { mat3 } from "gl-matrix";
import { Transform } from "./transform";

export class Scene
{
	constructor(turle)
	{
		this.primitives = []
		this.turtle = turle;
		this.transform = new Transform();
	}

	add(primitive)
	{
		if( this.primitives && primitive )
		{
			this.primitives.push(primitive)
            console.log(this.primitives)
		}
	}

    remove(primitive) 
	{
		if (this.primitives && primitive) {
			let index = this.primitives.indexOf(primitive);
			if (index > -1) {
				this.primitives.splice(index, 1);
			}
		}
	}

	getPrimitives() 
	{
		return [...this.primitives, this.turtle];
	}


	getPrimitive(index) 
	{
		return this.primitives[index];
	}


	getPrimitiveIndex(primitive) 
	{
		return this.primitives.indexOf(primitive);
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

	getSceneCentroid() {
		const centroid = [0, 0];
		for (const prim of this.primitives) {
			centroid[0] += prim.centroid[0];
			centroid[1] += prim.centroid[1];
		}
		centroid[0] /= this.primitives.length;
		centroid[1] /= this.primitives.length;
		return centroid;
	}

	updateTransformMatrix() {
		this.transform.updateTransformMatrix(this.getSceneCentroid());
	}
}
