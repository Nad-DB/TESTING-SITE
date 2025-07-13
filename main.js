import * as THREE from 'https://cdn.skypack.dev/three'
import gsap from 'https://cdn.skypack.dev/gsap'
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Setup scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshStandardMaterial({ color: 0x00ff99 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(2, 2, 5)
scene.add(light)

// Scroll-linked animation
gsap.to(cube.rotation, {
  x: Math.PI * 2,
  scrollTrigger: {
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    markers: true, // Remove when done testing
  }
})

// Animate loop
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
