import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // darker gray

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Centerpiece Model
const loader = new GLTFLoader();
let centerpiece;

loader.load('center.glb', (gltf) => {
  centerpiece = gltf.scene;
  centerpiece.position.set(0, 0, 0);
  scene.add(centerpiece);

  // Add lights AFTER model is added to scene
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const directional = new THREE.DirectionalLight(0xffffff, 0.7);
  directional.position.set(5, 10, 7);
  scene.add(ambient);
  scene.add(directional);

  // Scroll-triggered rotation
  gsap.to(centerpiece.rotation, {
    y: Math.PI * 4,
    scrollTrigger: {
      trigger: '.scroll-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });
}, undefined, (error) => {
  console.error('Failed to load GLB:', error);
});

// Resize Handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
