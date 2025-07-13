<script type="module">
  import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
  import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new GLTFLoader();
  let model;

  loader.load(
    'text.glb',
    function (gltf) {
      model = gltf.scene;
      scene.add(model);
    },
    undefined,
    function (error) {
      console.error('An error occurred while loading the GLB file:', error);
    }
  );

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      model.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
  }

  animate();
</script>
