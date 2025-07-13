import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // dark gray background

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4); // You can tweak these
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

// Load HDR environment for reflections (optional, for glass/refraction)
new RGBELoader()
  .setPath('textures/env/') // change this to your HDR path
  .load('studio_small_03_1k.hdr', (hdrEquirect) => {
    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdrEquirect;
  });

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 0.6);
directional.position.set(5, 10, 7);
scene.add(directional);

// Load centerpiece model
const loader = new GLTFLoader();
let centerpiece;

loader.load('center.glb', (gltf) => {
  centerpiece = gltf.scene;
  centerpiece.position.set(0, 0, 0);
  scene.add(centerpiece);

  // Check materials for transparency / refraction support
  centerpiece.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      child.material.opacity = 0.6;
      child.material.roughness = 0;
      child.material.metalness = 1;
      child.material.envMapIntensity = 1;
    }
  });
}, undefined, (err) => {
  console.error('Error loading GLB:', err);
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
