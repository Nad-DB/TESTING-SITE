import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5; // Boost brightness
document.body.appendChild(renderer.domElement);

// Optional: HDR environment
new RGBELoader()
  .setPath('textures/env/')
  .load('studio_small_03_1k.hdr', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
  });

// ✅ Boosted lighting setup
scene.add(new THREE.AmbientLight(0xffffff, 0.8)); // was 0.4

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2); // was 0.6
dirLight.position.set(5, 10, 10);
scene.add(dirLight);

// Add another light for contrast
const fillLight = new THREE.PointLight(0xffffff, 1);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// Load centerpiece model
const loader = new GLTFLoader();
let centerpiece;

loader.load('center.glb', (gltf) => {
  centerpiece = gltf.scene;
  centerpiece.position.set(0, 0, 0);
  scene.add(centerpiece);

  centerpiece.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      child.material.opacity = 0.6;
      child.material.roughness = 0;
      child.material.metalness = 1;
      child.material.envMapIntensity = 1.5;
    }
  });
}, undefined, (err) => {
  console.error('GLB load error:', err);
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
