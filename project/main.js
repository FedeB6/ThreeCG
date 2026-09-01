import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { Garden, setupDecorations } from "./Garden";
import { onWindowResize, raycasterSelect } from "./UserControls";

//Scene setup
export const scene = new THREE.Scene();
scene.backgroundColor = 0xffffff;
scene.background = new THREE.Color(0x95d3f5);
scene.fog = new THREE.Fog(0x95d3f5, 5, 100);


//Camera Setup
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = 5;
camera.position.z = -10;
camera.position.y = 5;

//Renderer Setup
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

//Lights Setup
scene.add(new THREE.AmbientLight(0x666666));
const dirLight = new THREE.DirectionalLight(0xaaaaaa);
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.intensity = 1;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.radius = 4;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

//Controls Setup (Orbit)
const controller = new OrbitControls(camera, renderer.domElement);
controller.enableDamping = true;
controller.dampingFactor = 0.05;
controller.minDistance = 3;
controller.maxDistance = 15;
controller.minPolarAngle = Math.PI / 4;
controller.maxPolarAngle = (2 * Math.PI) / 4;

//Gardens Setup
export var gardens = [];
var counter = 0;
for(var i = 0; i<3; i++){
  for(var j = 0; j<3; j++){
    var gcoord = {
      x: i*4 - 4,
      z: j*4 -4 
    };
    gardens[counter] = new Garden(counter, gcoord)
    counter++;
  }
}

//Raycaster Setup
export const raycaster = new THREE.Raycaster();
document.addEventListener('mousedown', raycasterSelect);
window.addEventListener('resize', onWindowResize, false);


//Floor Setup
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x1b8025,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.name = "floor";
groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

//Performance Metrics Setup
const stats = Stats();
document.body.appendChild(stats.dom);

//Gui Setup
const gui = new GUI();
export const actions = {
  Action: "Cut"
};
gui.add(actions, 'Action', ["Cut", "Plant Flower", "Plant Wheat"])

//Scene Decoration Setup
setupDecorations();

//Scene Rendering
renderer.render(scene, camera);
function animate() {
  requestAnimationFrame(animate);
  for(const g of gardens){
    g.grow();
  }
  renderer.render(scene, camera);
  stats.update();

  controller.update();
}
animate();
