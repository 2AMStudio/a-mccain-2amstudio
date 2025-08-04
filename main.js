import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// Initialize area light support
RectAreaLightUniformsLib.init();

// ======================
// ASSET PATHS
// ======================
const ASSETS = {
  MODEL: 'assets/models/DeskOverview1.glb',
  BACKGROUND: 'assets/images/BackgroundRotating.png',
  DEFAULT_SCREEN_TEXTURE: 'assets/images/default-screen.png'
};

// ======================
// SCREEN ANCHOR POINTS (from your geometry data)
// ======================
const SCREEN_Y_OFFSET = -0.995; // 0.05 units above the original surface

const SCREEN_ANCHORS = [
  new THREE.Vector3(0.5218123197555542, 0.8660084009170532 + SCREEN_Y_OFFSET, -0.6475707292556763),  // top-right
  new THREE.Vector3(0.5218123197555542, 0.733871579170227 + SCREEN_Y_OFFSET, -0.0846579372882843),   // bottom-right
  new THREE.Vector3(-0.27778705954551697, 0.8660078048706055 + SCREEN_Y_OFFSET, -0.6475707292556763), // top-left
  new THREE.Vector3(-0.2777869999408722, 0.7338709831237793 + SCREEN_Y_OFFSET, -0.0846579372882843)  // bottom-left
];

// Calculate screen center point
const screenCenter = new THREE.Vector3();
SCREEN_ANCHORS.forEach(point => screenCenter.add(point));
screenCenter.divideScalar(SCREEN_ANCHORS.length);

// ======================
// GLOBAL VARIABLES
// ======================
let screenMesh = null;
let screenMaterial = null;
const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
let debugHelpers = [];
let screenFillLight;
let currentImageTexture = null;
let screenPlane = null;
let screenQuad = null;

// ======================
// CAMERA PRESETS
// ======================
const CAMERA_PRESETS = {
  INTRO: {
    position: new THREE.Vector3(0, 2.05, 3.9),
    target: new THREE.Vector3(0, -0.2, 0),
    fov: 35
  },
  OVERVIEW: {
    position: new THREE.Vector3(0, 0.43, -0.195),
    target: new THREE.Vector3(0, -2.5, -1.0),
    fov: 50
  },
  DETAIL_VIEW: {
    position: new THREE.Vector3(0, 0.2, 4.5),
    target: new THREE.Vector3(0, -1.2, -13),
    fov: 35
  },
  ORBIT: {
    radius: 5,
    height: -0.3,
    speed: 0.002
  }
};

// ======================
// CAMERA RIG SYSTEM
// ======================
class CameraRig {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.isOrbiting = false;
    this.orbitAngle = 0;
  }

  transitionTo(presetName, duration = 2) {
    const preset = CAMERA_PRESETS[presetName];
    if (!preset) {
      console.warn(`Camera preset "${presetName}" not found.`);
      return;
    }

    this.isOrbiting = false;
    this.controls.autoRotate = false;

    gsap.timeline()
      .to(this.camera.position, {
        x: preset.position.x,
        y: preset.position.y,
        z: preset.position.z,
        duration,
        ease: 'sine.inOut'
      })
      .to(this.controls.target, {
        x: preset.target.x,
        y: preset.target.y,
        z: preset.target.z,
        duration: duration * 0.9
      }, '<0.2')
      .to(this.camera, {
        fov: preset.fov || 50,
        duration: duration * 0.7,
        onUpdate: () => this.camera.updateProjectionMatrix()
      }, '<');
  }

  startOrbiting() {
    this.isOrbiting = true;
    this.orbitAngle = 0;
    const preset = CAMERA_PRESETS.ORBIT;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = preset.speed;
    this.controls.target.set(0, preset.height, 0);
  }

  update() {
    if (this.isOrbiting) {
      const preset = CAMERA_PRESETS.ORBIT;
      this.orbitAngle += preset.speed;
      this.camera.position.x = Math.sin(this.orbitAngle) * preset.radius;
      this.camera.position.z = Math.cos(this.orbitAngle) * preset.radius;
      this.camera.position.y = preset.height;
      this.controls.update();
    }
  }
}

// ======================
// SCENE SETUP
// ======================
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// ======================
// SCREEN QUAD SETUP (Updated for color accuracy)
// ======================
function createScreenQuad() {
  const geometry = new THREE.BufferGeometry();
  
  const vertices = new Float32Array([
    SCREEN_ANCHORS[2].x, SCREEN_ANCHORS[2].y, SCREEN_ANCHORS[2].z,
    SCREEN_ANCHORS[0].x, SCREEN_ANCHORS[0].y, SCREEN_ANCHORS[0].z,
    SCREEN_ANCHORS[3].x, SCREEN_ANCHORS[3].y, SCREEN_ANCHORS[3].z,
    SCREEN_ANCHORS[1].x, SCREEN_ANCHORS[1].y, SCREEN_ANCHORS[1].z
  ]);
  
  const uvs = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    1, 0
  ]);
  
  const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);
  
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  
  // Updated material for accurate color reproduction
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 1.0,
    toneMapped: false, // Disable tone mapping
    premultipliedAlpha: false // Ensure proper alpha handling
  });
  
  screenQuad = new THREE.Mesh(geometry, material);
  screenQuad.renderOrder = 999;
  scene.add(screenQuad);
}

// ======================
// LIGHTING
// ======================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

screenFillLight = new THREE.RectAreaLight(0xffffff, 0, 3, 3);
screenFillLight.position.set(0, 5, 0.2);
screenFillLight.rotation.x = -Math.PI / 2;
scene.add(screenFillLight);

const lightHelper = new RectAreaLightHelper(screenFillLight);
scene.add(lightHelper);

// ======================
// BACKGROUND
// ======================
const bgTexture = new THREE.TextureLoader().load(ASSETS.BACKGROUND);
bgTexture.encoding = THREE.sRGBEncoding; // Ensure proper background color
scene.background = bgTexture;

// ======================
// MODEL LOADING & SCREEN SETUP (Updated)
// ======================
const loader = new GLTFLoader();
let deskModel;

loader.load(ASSETS.MODEL, (gltf) => {
  deskModel = gltf.scene;
  console.log('Model loaded:', gltf);

  gltf.scene.traverse((child) => {
    if (child.isLight) {
      child.intensity *= 1.5;
      child.castShadow = true;
      console.log(`Light found: ${child.name}`, child);
    }
  });

  gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === 'PNGApplicationScreen') {
      screenMesh = child;
      
      screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.01,
        side: THREE.DoubleSide,
        toneMapped: false // Consistent with screen quad
      });
      
      screenMesh.material = screenMaterial;
      screenMesh.renderOrder = 998;
    }

    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      
      if (child.material.emissiveMap) {
        child.material.emissiveIntensity = 1.0;
        child.material.emissiveMap.encoding = THREE.sRGBEncoding;
      }
    }
  });

  deskModel.position.set(0, -1, 0);
  scene.add(deskModel);
  createScreenQuad();
  
  // Load default screen texture with correct color handling
  if (ASSETS.DEFAULT_SCREEN_TEXTURE) {
    currentImageTexture = new THREE.TextureLoader().load(ASSETS.DEFAULT_SCREEN_TEXTURE, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      tex.flipY = false;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      screenQuad.material.map = tex;
      screenQuad.material.toneMapped = false;
      screenQuad.material.needsUpdate = true;
    });
  }
}, undefined, (error) => {
  console.error('Error loading model:', error);
});

// ======================
// DRAG AND DROP (Updated for color accuracy)
// ======================
const dropZone = document.createElement('div');
dropZone.style.position = 'fixed';
dropZone.style.top = '0';
dropZone.style.left = '0';
dropZone.style.width = '100%';
dropZone.style.height = '100%';
dropZone.style.backgroundColor = 'rgba(0,0,0,0.7)';
dropZone.style.display = 'none';
dropZone.style.zIndex = '1000';
dropZone.style.pointerEvents = 'none';
dropZone.style.border = '4px dashed white';
dropZone.innerHTML = `
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
              color: white; font-size: 2em; text-align: center;">
    <div>Drop PNG Image Here</div>
    <div style="font-size: 0.6em; margin-top: 20px;">(PNG or JPG files only)</div>
  </div>`;
document.body.appendChild(dropZone);

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'copy';
  dropZone.style.display = 'block';
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.style.display = 'none';
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dropZone.style.display = 'none';
  
  if (!screenQuad) {
    console.warn('Screen quad not initialized yet');
    return;
  }

  const files = Array.from(e.dataTransfer.files).filter(file => 
    allowedImageTypes.includes(file.type)
  );

  if (files.length === 0) {
    console.warn('No valid image files dropped');
    return;
  }

  const file = files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      if (currentImageTexture) currentImageTexture.dispose();
      
      currentImageTexture = new THREE.Texture(img);
      currentImageTexture.encoding = THREE.sRGBEncoding;
      currentImageTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      currentImageTexture.minFilter = THREE.LinearFilter;
      currentImageTexture.magFilter = THREE.LinearFilter;
      currentImageTexture.needsUpdate = true;

      screenQuad.material.map = currentImageTexture;
      screenQuad.material.toneMapped = false;
      screenQuad.material.needsUpdate = true;
      
      cameraRig.transitionTo('OVERVIEW');
    };
    img.onerror = () => console.error('Failed to load dropped image');
    img.src = event.target.result;
  };

  reader.onerror = () => console.error('Failed to read dropped file');
  reader.readAsDataURL(file);
}

document.addEventListener('dragover', handleDragOver);
document.addEventListener('dragleave', handleDragLeave);
document.addEventListener('drop', handleDrop);

// ======================
// DEBUG HELPERS
// ======================
function setupScreenDebug() {
  if (!screenQuad) return;
  
  debugHelpers.forEach(helper => scene.remove(helper));
  debugHelpers = [];
  
  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(screenQuad.geometry),
    new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 })
  );
  wireframe.position.copy(screenQuad.position);
  scene.add(wireframe);
  debugHelpers.push(wireframe);
  
  SCREEN_ANCHORS.forEach((point, i) => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    sphere.position.copy(point);
    scene.add(sphere);
    debugHelpers.push(sphere);
  });
}

// ======================
// CONTROLS
// ======================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.screenSpacePanning = true;

const cameraRig = new CameraRig(camera, controls);
cameraRig.transitionTo('INTRO');

// ======================
// EVENT HANDLERS
// ======================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case '1': cameraRig.transitionTo('INTRO'); break;
    case '2': cameraRig.transitionTo('OVERVIEW'); break;
    case '3': cameraRig.transitionTo('DETAIL_VIEW'); break;
    case 'o': cameraRig.startOrbiting(); break;
    case 'r': // Reset screen texture
      if (screenQuad.material) {
        if (currentImageTexture) currentImageTexture.dispose();
        screenQuad.material.map = null;
        screenQuad.material.color.set(0x000000);
        screenQuad.material.needsUpdate = true;
      }
      break;
    case 'd': // Toggle debug helpers
      if (debugHelpers.length > 0) {
        debugHelpers.forEach(helper => scene.remove(helper));
        debugHelpers = [];
      } else {
        setupScreenDebug();
      }
      break;
    case 'l': // Toggle rectangle area light
      screenFillLight.intensity = screenFillLight.intensity > 0 ? 0 : 3
      console.log('Rectangle area light intensity:', screenFillLight.intensity);
      break;
  }
});

// ======================
// ANIMATION LOOP
// ======================
function animate() {
  requestAnimationFrame(animate);
  cameraRig.update();
  controls.update();
  renderer.render(scene, camera);
}

animate();