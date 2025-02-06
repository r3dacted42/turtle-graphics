import './style.css'
import { Scene, WebGLRenderer, Shader } from './lib/threeD.js';
import { vertexShaderSrc } from './shaders/vertex.js';
import { fragmentShaderSrc } from './shaders/fragment.js';
import Turtle from './components/turtle.js';
import CommandProcessor from './components/commandProcessor.js';
import { GUI } from 'dat.gui';

const canvas = document.getElementById('main-canvas');
const renderer = new WebGLRenderer(canvas);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const shader = new Shader(
  renderer.glContext(),
  vertexShaderSrc,
  fragmentShaderSrc
);

shader.use();

const scene = new Scene();

// const p1 = new Primitive2D('prim1', [
//   [600, 500], [700, 300], [300, 400]
// ], [0, 1, 0.5, 1]);
// const p2 = new Primitive2D('prim2', [
//   [610, 490], [710, 290], [310, 390]
// ], [0, 1, 0.75, 1]);

// scene.add(p1);
// scene.add(p2);

const turtle = new Turtle(canvas.clientWidth / 2, canvas.clientHeight / 2);
scene.add(turtle);

// p1.fill = true;
// p2.fill = true;

// p1.z = -2;

document.addEventListener("click",(event) => {
  console.log("clicked at ", event.clientX, event.clientY);
});

const commandProcessor = new CommandProcessor(turtle);

const resizeCanvasToDisplaySize = () => {
  const {width, height} = renderer.getSize();
  if (canvas.clientWidth != width ||
    canvas.clientHeight != height) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}

const animation = () => {
  renderer.clear(0.9, 0.9, 0.9, 1);
  renderer.render(scene, shader);
  resizeCanvasToDisplaySize();
}

renderer.setAnimationLoop(animation);

// const gui = new GUI();
