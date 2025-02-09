import './style.css'
import { Scene, WebGLRenderer, Shader } from './lib/threeD.js';
import { vertexShaderSrc } from './shaders/vertex.js';
import { fragmentShaderSrc } from './shaders/fragment.js';
import Turtle from './components/turtle.js';
import { Primitive2D } from './lib/primitive2d.js';
import { drawModes } from './lib/drawModes.js';
import Controls from './components/controls.js';

const canvas = document.getElementById('main-canvas');
const renderer = new WebGLRenderer(canvas);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const shader = new Shader(
  renderer.glContext(),
  vertexShaderSrc,
  fragmentShaderSrc,
);

shader.use();

const turtle = new Turtle(canvas.clientWidth / 2, canvas.clientHeight / 2);
const scene = new Scene(turtle);

addDefaultPrimitives(scene);

document.addEventListener("click", (event) => {
  console.log("clicked at ", event.clientX, event.clientY);
});

const controls = new Controls(scene);

const resizeCanvasToDisplaySize = () => {
  const { width, height } = renderer.getSize();
  if (canvas.clientWidth != width ||
    canvas.clientHeight != height) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}


const animation = () => {
  renderer.clear(0.2, 0.2, 0.3, 1);
  renderer.render(scene, shader);
  resizeCanvasToDisplaySize();
}

renderer.setAnimationLoop(animation);

function addDefaultPrimitives(scene) {
  const p1 = new Primitive2D('prim0', "#3c953c");
  p1.addVertex(500, 500);
  p1.addVertex(500, 300);
  p1.addVertex(300, 300);
  p1.addVertex(300, 500);
  p1.addVertex(500, 500);
  p1.fill = true;
  scene.add(p1);
  p1.translate(-50, -50);
  p1.rotate(10);
  p1.setScale(0.75, 0.7);

  const p2 = new Primitive2D('prim1', "#c83232");
  p2.setMode(null, drawModes().triangles);
  p2.addVertex(557, 317);
  p2.addVertex(478, 411);
  p2.addVertex(568, 538);
  p2.addVertex(568, 538);
  p2.addVertex(671, 385);
  p2.addVertex(579, 391);
  p2.setMode(drawModes().lines, null);
  p2.addVertex(579, 391);
  p2.addVertex(557, 317);
  p2.addVertex(568, 538);
  p2.fill = true;
  scene.add(p2);
  p2.translate(-150, -50);
  p2.rotate(5);

  const p3 = new Primitive2D('prim2', "#7f51eb");
  p3.addVertex(449, 401);
  p3.addVertex(572, 394);
  p3.addVertex(567, 493);
  p3.addVertex(441, 466);
  p3.fill = true;
  p3.setScale(1, 1.5);
  p3.rotate(5);
  scene.add(p3);


  const p4 = new Primitive2D('prim3', "#d528d5");
  p4.setMode(null, drawModes().triangles);
  p4.addVertex(500, 300);
  p4.addVertex(570, 300);
  p4.addVertex(570, 250);
  p4.setMode(drawModes().lloop, drawModes().tfan);
  p4.addVertex(570, 300);
  p4.addVertex(570, 450);
  p4.addVertex(650, 300);
  p4.fill = true;
  scene.add(p4);
  p4.rotate(45);
  p4.translate(0, 220);
}
