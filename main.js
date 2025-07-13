import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// Load Centerpiece
const loader = new GLTFLoader();
let centerpiece;

loader.load('center.glb', (gltf) => {
  centerpiece = gltf.scene;
  centerpiece.position.set(0, 0, 0);
  scene.add(centerpiece);

  // Animate rotation with ScrollTrigger
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

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
