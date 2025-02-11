import { mat3 } from 'gl-matrix';

export class Transform
{
	constructor()
	{
		this.translate = {x: 0, y: 0};
		this.scale = {x: 1, y: 1};
		this.rotationAngle = 0; // degrees

		this.transformMatrix = mat3.create();
		mat3.identity(this.transformMatrix);
	}

	updateTransformMatrix(centroid)
	{
		mat3.identity(this.transformMatrix);
		const temp = mat3.create();
		// shift centroid to origin
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, [-centroid[0], -centroid[1]]), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromScaling(temp, [this.scale.x, this.scale.y]), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromRotation(temp, Math.PI * this.rotationAngle / 180), this.transformMatrix);
		// move back to original position
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, centroid), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, [this.translate.x, this.translate.y]), this.transformMatrix);
	}
}