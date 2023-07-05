import * as THREE from "three";
import "./style.css";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene
const scene = new THREE.Scene();

// Creating Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

// Ambient Light -- for lighting the entire sphere
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Timeline
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo("nav", { y: "-100%" }, { y: "0%" });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});

// Load texture for Earth
const loadedTexture = () => {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
      resolve,
      undefined,
      reject
    );
  });
};

// Load texture for Scorched Earth
const loadTexture = () => {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      './assets/earth-burning.jpg',
      resolve,
      undefined,
      reject
    );
  });
};

// Explore Link Click Event
document.addEventListener("DOMContentLoaded", function () {
  const exploreLink = document.querySelector(".explore");
  exploreLink.addEventListener("click", () => {
     // Animate the transition from the current mesh to the Scorched Earth
     gsap.to(mesh.scale, { duration: 1, x: 0, y: 0, z: 0, ease: "power2.in", onComplete: () => {
      // Remove the current mesh
      scene.remove(mesh);

      // Clean up the scene
      scene.children = [];

      // Create geometry for Scorched Earth
      const scorchedEarthGeometry = new THREE.SphereGeometry(3, 64, 64);

      // Create material for Scorched Earth
      const scorchedEarthMaterial = new THREE.MeshStandardMaterial({
        map: null, // Set the map to null initially to avoid artifacts
        color: 0xffffff, // Set a default color
      });

      // Create Scorched Earth mesh
      const scorchedEarth = new THREE.Mesh(scorchedEarthGeometry, scorchedEarthMaterial);
      scorchedEarth.scale.set(0, 0, 0);
      scene.add(scorchedEarth);

      // Load texture for Scorched Earth
      loadedTexture()
        .then(texture => {
          scorchedEarthMaterial.map = texture;
          scorchedEarthMaterial.needsUpdate = true;

          // Add lights to the scene
          const ambientLight = new THREE.AmbientLight(0xffffff, 1);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 1, 0);
          scene.add(directionalLight);

          // Position the camera
          camera.position.z = 20;

          // Animate the scale of the Scorched Earth
          gsap.to(scorchedEarth.scale, { duration: 1, x: 1, y: 1, z: 1, ease: "power2.out" });

          // Render loop
          function animate() {
            requestAnimationFrame(animate);
            // scorchedEarth.rotation.x += 0.01;
            // scorchedEarth.rotation.y += 0.01;
            renderer.render(scene, camera);
          }
          animate();
        })
        .catch(error => {
          console.error('Failed to load texture:', error);
        });
    }});
  });
});

// Create Link Click Event
document.addEventListener("DOMContentLoaded", function () {
  const createLink = document.querySelector(".create");
  createLink.addEventListener("click", () => {
    // Animate the transition from the current mesh to the Scorched Earth
    gsap.to(mesh.scale, { duration: 1, x: 0, y: 0, z: 0, ease: "power2.in", onComplete: () => {
      // Remove the current mesh
      scene.remove(mesh);

      // Clean up the scene
      scene.children = [];

      // Create geometry for Scorched Earth
      const scorchedEarthGeometry = new THREE.SphereGeometry(3, 64, 64);

      // Create material for Scorched Earth
      const scorchedEarthMaterial = new THREE.MeshStandardMaterial({
        map: null, // Set the map to null initially to avoid artifacts
        color: 0xffffff, // Set a default color
        transparent: true, // Enable transparency
        opacity: 1, // Set initial opacity to 1
        blending: THREE.AdditiveBlending // Use additive blending for smoother transition
      });

      // Create Scorched Earth mesh
      const scorchedEarth = new THREE.Mesh(scorchedEarthGeometry, scorchedEarthMaterial);
      scene.add(scorchedEarth);

      // Load texture for Scorched Earth
      loadedTexture()
        .then(texture => {
          scorchedEarthMaterial.map = texture;
          scorchedEarthMaterial.needsUpdate = true;

          // Add lights to the scene
          const ambientLight = new THREE.AmbientLight(0xffffff, 1);
          scene.add(ambientLight);

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(0, 1, 0);
          scene.add(directionalLight);

          // Position the camera
          camera.position.z = 20;

          // Rotate the Scorched Earth at max speed
          gsap.to(scorchedEarth.rotation, { duration: 7, y: Math.PI * 50, ease: "power0.none", repeat: -1 });

          // Animate the Scorched Earth to change color to bright red
          gsap.to(scorchedEarthMaterial.color, { duration: 5, r: 1, g: 0, b: 0 });

          // Animate the transition from Scorched Earth to Earth texture
          gsap.to(scorchedEarthMaterial, { duration: 2, opacity: 0, ease: "power2.out", delay: 5, onComplete: () => {
            // Remove Scorched Earth mesh
            scene.remove(scorchedEarth);

            // Load texture for Earth
            loadTexture()
              .then(earthTexture => {
                // Create material for Earth
                const earthMaterial = new THREE.MeshStandardMaterial({
                  map: earthTexture,
                  color: 0xffffff,
                });

                // Create Earth mesh
                const earth = new THREE.Mesh(scorchedEarthGeometry, earthMaterial);
                scene.add(earth);

                // Animate the opacity of the Earth material
                gsap.fromTo(earthMaterial, { opacity: 0 }, { duration: 1, opacity: 1, ease: "power2.out" });
              })
              .catch(error => {
                console.error('Failed to load texture:', error);
              });
          }});
        })
        .catch(error => {
          console.error('Failed to load texture:', error);
        });
    }});
  });
});
