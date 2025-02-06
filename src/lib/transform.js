import { vec2, mat3 } from 'gl-matrix';

export class Transform
{
	constructor()
	{
		this.translate = vec2.create();
		vec2.set(this.translate, 0, 0);
		
		this.scale = vec2.create();
		vec2.set(this.scale, 1, 1);
		
		this.rotationAngle = 0; // degrees

		this.transformMatrix = mat3.create();
		mat3.identity(this.transformMatrix);
	}

	updateTransformMatrix(resMat, centroid)
	{
		mat3.identity(this.transformMatrix);
		const temp = mat3.create();
		// shift centroid to origin
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, [-centroid[0], -centroid[1]]), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromScaling(temp, this.scale), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromRotation(temp, Math.PI * this.rotationAngle / 180), this.transformMatrix);
		// move back to original position
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, centroid), this.transformMatrix);
		mat3.multiply(this.transformMatrix, mat3.fromTranslation(temp, this.translate), this.transformMatrix);
		// apply resolution matrix
		mat3.multiply(this.transformMatrix, resMat, this.transformMatrix);
	}
}