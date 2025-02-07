import { mat3 } from "gl-matrix";

export class WebGLRenderer {
	constructor(canvas) {
		this.domElement = canvas;
		this.gl =
			this.domElement.getContext("webgl", { preserveDrawingBuffer: true }) ||
			this.domElement.getContext("experimental-webgl");

		if (!this.gl) throw new Error("WebGL is not supported");
		window['glContext'] = this.gl;

		this.setSize(50, 50);
		this.clear(1.0, 1.0, 1.0, 1.0);
	}

	setSize(width, height) {
		this.domElement.width = width;
		this.domElement.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	}

	getSize() {
		return this.gl.canvas.width, this.gl.canvas.height;
	}

	clear(r, g, b, a) {
		this.gl.clearColor(r, g, b, a);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	setAnimationLoop(animation) {
		function renderLoop() {
			animation();
			window.requestAnimationFrame(renderLoop);
		}

		renderLoop();
	}

	resolutionMatrix() {
		const w = this.gl.canvas.width, h = this.gl.canvas.height;
		const out = mat3.fromValues(
			2 / w,		0,		0,
			0,		-2 / h,		0,
			-1, 		1,		1
		);
		return out;
	}

	// render function executes all the time
	// can be thought of as the main game loop
	// @param {scene} - Scene to render
	// @param {shader} - Shader to use
	// for each primitive in the scene, updates the transform matrix and renders the primitve
	render(scene, shader) {
		const resMat = this.resolutionMatrix();

		scene.getPrimitives().forEach(function (primitive) {
			primitive.updateTransformMatrix(resMat);
			for (const mode of primitive.getDrawModes()) {
				shader.bindArrayBuffer(
					shader.vertexAttributesBuffer,
					mode.vertices
				);
				shader.fillAttributeData("a_position", 3, 0, 0);
				shader.setUniformMatrix3fv("u_matrix", primitive.transform.transformMatrix);
				shader.setUniform4f("u_color", mode.color);
				shader.drawArrays(mode.vertices.length / 3, mode.drawMode);
			}
		});
	}


	glContext() {
		return this.gl;
	}

	getCanvas() {
		return this.domElement;
	}
}
