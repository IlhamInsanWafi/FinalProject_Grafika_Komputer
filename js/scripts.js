import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'; //Tambah Camera

const trashUrl = new URL('../assets/trashcan.glb', import.meta.url);
const pingpongUrl = new URL('../assets/pingpong.glb', import.meta.url);
const rackUrl = new URL('../assets/rack.glb', import.meta.url);
const roomUrl = new URL('../assets/room2.glb', import.meta.url);
const shoerackUrl = new URL('../assets/shoerack.glb', import.meta.url);
const redboxUrl = new URL('../assets/redbox.glb', import.meta.url);
const plant1Url = new URL('../assets/plant1.glb', import.meta.url);
const plant2Url = new URL('../assets/plant2.glb', import.meta.url);
const plant3Url = new URL('../assets/plant3.glb', import.meta.url);
const woodbenchUrl = new URL('../assets/woodbench.glb', import.meta.url);
const blackboxUrl = new URL('../assets/blackbox.glb', import.meta.url);
const hmtcUrl = new URL('../assets/hmtc3.glb', import.meta.url);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const scene = new THREE.Scene();

// Variabel untuk mengontrol pergerakan kamera
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

//Camera
function initPointerLock() {
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');
  
    const havePointerLock =
      'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
  
    if (havePointerLock) {
      const element = document.body;
  
      const pointerlockchange = function () {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
          controls.enabled = true;
          blocker.style.display = 'none';
        } else {
          controls.enabled = false;
          blocker.style.display = '-webkit-box';
          blocker.style.display = '-moz-box';
          blocker.style.display = 'box';
          instructions.style.display = '';
        }
      };
  
      const pointerlockerror = function () {
        instructions.style.display = '';
      };
  
      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
  
      document.addEventListener('pointerlockerror', pointerlockerror, false);
      document.addEventListener('mozpointerlockerror', pointerlockerror, false);
      document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
  
      instructions.addEventListener('click', function () {
        instructions.style.display = 'none';
  
        // Minta browser mengunci pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
  
        if (/Firefox/i.test(navigator.userAgent)) {
          const fullscreenchange = function () {
            if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
              document.removeEventListener('fullscreenchange', fullscreenchange);
              document.removeEventListener('mozfullscreenchange', fullscreenchange);
              element.requestPointerLock();
            }
          };
  
          document.addEventListener('fullscreenchange', fullscreenchange, false);
          document.addEventListener('mozfullscreenchange', fullscreenchange, false);
  
          element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
  
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      });
    } else {
      instructions.innerHTML = 'Browser Anda tidak mendukung Pointer Lock API';
    }
  }

initPointerLock();

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

const onKeyDown = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;
    }
  };
  
  const onKeyUp = function (event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };
  
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const lightingParameters = {
  ambientIntensity: 1.0,
  directionalIntensity: 1.0,
  ambientColor: new THREE.Color(0xffffff),  // Warna cahaya ambient default putih
  directionalColor: new THREE.Color(0xffffff),  // Warna cahaya arah default putih
};

// Tambahkan directional light untuk pencahayaan arah tertentu
const directionalLight = new THREE.DirectionalLight(0xffffff, lightingParameters.directionalIntensity);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Buat antarmuka pengguna dengan dat.gui
const gui = new dat.GUI();
gui.add(lightingParameters, 'ambientIntensity', 0.1, 2.0).name('Ambient Intensity');
gui.addColor(lightingParameters, 'ambientColor').name('Ambient Color');
gui.add(lightingParameters, 'directionalIntensity', 0.1, 2.0).name('Directional Intensity');
gui.addColor(lightingParameters, 'directionalColor').name('Directional Color');
const directionalLightFolder = gui.addFolder('Directional Light');
directionalLightFolder.add(directionalLight.position, 'x', -1, 1).name('Light X Position');
directionalLightFolder.add(directionalLight.position, 'y', -1, 1).name('Light Y Position');
directionalLightFolder.add(directionalLight.position, 'z', -1, 1).name('Light Z Position');

// Tambahkan ambient light untuk memberikan pencahayaan umum
const ambientLight = new THREE.AmbientLight(0xffffff, lightingParameters.ambientIntensity);
scene.add(ambientLight);


renderer.setClearColor(0xA3A3A3);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const trashLoader = new GLTFLoader();

let mixer;
trashLoader.load(trashUrl.href, function(gltf) {
    const model = gltf.scene;

    // Atur skala objek agar tidak terlalu besar
    const scaleTrash = 0.75; // Sesuaikan sesuai kebutuhan
    model.scale.set(scaleTrash, scaleTrash, scaleTrash);

    model.position.set(11, 0.35, -18);
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

    model.rotation.y = Math.PI / -2; // 90 derajat dalam radian

}, undefined, function(error) {
    console.error(error);
});

const pingpongLoader = new GLTFLoader(); //scene

let pingpongMixer;  // Tambahkan baris ini
pingpongLoader.load(pingpongUrl.href, function(gltf) {
    const pingpongModel = gltf.scene;
    
    // Atur skala objek agar tidak terlalu besar
    const pingpongFactor = 0.035; // Sesuaikan sesuai kebutuhan
    pingpongModel.scale.set(pingpongFactor, pingpongFactor, pingpongFactor);
    
    pingpongModel.position.set(0, 0, -8);  // Atur posisi objek agar tidak tabrakan dengan objek sebelumnya
    scene.add(pingpongModel);
    pingpongMixer = new THREE.AnimationMixer(pingpongModel);
    const pingpongClips = gltf.animations;

    pingpongClips.forEach(function(clip) {
        const action = pingpongMixer.clipAction(clip);
        action.play();
    });

    // Memutar objek pong sebesar 90 derajat terhadap sumbu x
    pingpongModel.rotation.y = Math.PI / 2; // 90 derajat dalam radian

}, undefined, function(error) {
    console.error(error);
});

const rackLoader = new GLTFLoader();

let rackMixer;
rackLoader.load(rackUrl.href, function(gltf) {
    const rackModel = gltf.scene;

    // Atur skala objek agar tidak terlalu besar
    const scaleRack = 0.1; // Sesuaikan sesuai kebutuhan
    rackModel.scale.set(scaleRack, scaleRack, scaleRack);

    rackModel.position.set(6.8, 0, -18);  // Atur posisi objek agar tidak tabrakan dengan objek sebelumnya
    scene.add(rackModel);
    rackMixer = new THREE.AnimationMixer(rackModel);
    const rackClips = gltf.animations;

    rackClips.forEach(function(clip) {
        const action = rackMixer.clipAction(clip);
        action.play();
    });

    rackModel.rotation.y = Math.PI / 2; // 90 derajat dalam radian

}, undefined, function(error) {
    console.error(error);
});


const roomLoader = new GLTFLoader();

let roomMixer;
roomLoader.load(roomUrl.href, function(gltf) {
    const roomModel = gltf.scene;

    // Atur skala objek agar tidak terlalu besar
    const scaleRoom = 5; // Sesuaikan sesuai kebutuhan
    roomModel.scale.set(scaleRoom, scaleRoom, scaleRoom);

    roomModel.position.set(-5, 6, -5);  // Atur posisi objek agar tidak tabrakan dengan objek sebelumnya
    scene.add(roomModel);
    roomMixer = new THREE.AnimationMixer(roomModel);
    const roomClips = gltf.animations;

    roomClips.forEach(function(clip) {
        const action = roomMixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});

const shoerackLoader = new GLTFLoader();

let shoerackMixer;
shoerackLoader.load(shoerackUrl.href, function(gltf) {
    const shoerackModel = gltf.scene;

    // Adjust the scale of the object as needed
    const scaleShoerack = 0.12; // Adjust as needed
    shoerackModel.scale.set(scaleShoerack, scaleShoerack, scaleShoerack);

    shoerackModel.position.set(-13, 0, -18);  // Adjust the position to avoid collision with other objects
    scene.add(shoerackModel);
    shoerackMixer = new THREE.AnimationMixer(shoerackModel);
    const shoerackClips = gltf.animations;

    shoerackClips.forEach(function(clip) {
        const action = shoerackMixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the shoerack model if needed
    // shoerackModel.rotation.y = Math.PI / 2; // 90 degrees in radians

}, undefined, function(error) {
    console.error(error);
});

const redboxLoader = new GLTFLoader();

let redboxMixer;
redboxLoader.load(redboxUrl.href, function(gltf) {
    const redboxModel = gltf.scene;

    // Adjust the scale of the object as needed
   
    const scaleRedbox = 0.55; // Adjust as needed
    redboxModel.scale.set(scaleRedbox, scaleRedbox, scaleRedbox);

    redboxModel.position.set(-19, 4.6, -12.3);  // Adjust the position to avoid collision with other objects
    scene.add(redboxModel);
    redboxMixer = new THREE.AnimationMixer(redboxModel);
    const redboxClips = gltf.animations;

    redboxClips.forEach(function(clip) {
        const action = redboxMixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the redbox model if needed
    //redboxModel.rotation.y = Math.PI / 4; // 45 degrees in radians

}, undefined, function(error) {
    console.error(error);
});

const plant1Loader = new GLTFLoader();

let plant1Mixer;
plant1Loader.load(plant1Url.href, function(gltf) {
    const plant1Model = gltf.scene;

    // Adjust the scale of the object as needed
    const scalePlant1 = 0.065; // Adjust as needed
    plant1Model.scale.set(scalePlant1, scalePlant1, scalePlant1);

    plant1Model.position.set(3.35, 0, 8.9);  // Adjust the position to avoid collision with other objects
    scene.add(plant1Model);
    plant1Mixer = new THREE.AnimationMixer(plant1Model);
    const plant1Clips = gltf.animations;

    plant1Clips.forEach(function(clip) {
        const action = plant1Mixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the plant1 model if needed
    //plant1Model.rotation.y = Math.PI / -4; // -45 degrees in radians

}, undefined, function(error) {
    console.error(error);
});


const plant2Loader = new GLTFLoader();

let plant2Mixer;
plant2Loader.load(plant2Url.href, function(gltf) {
    const plant2Model = gltf.scene;

    // Adjust the scale of the object as needed
    const scalePlant2 = 0.07; // Adjust as needed
    plant2Model.scale.set(scalePlant2, scalePlant2, scalePlant2);

    plant2Model.position.set(-0.6, 0, 9.2);  // Adjust the position to avoid collision with other objects
    scene.add(plant2Model);
    plant2Mixer = new THREE.AnimationMixer(plant2Model);
    const plant2Clips = gltf.animations;

    plant2Clips.forEach(function(clip) {
        const action = plant2Mixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the plant2 model if needed
    //plant2Model.rotation.y = Math.PI / 6; // 30 degrees in radians

}, undefined, function(error) {
    console.error(error);
});

const plant3Loader = new GLTFLoader();

let plant3Mixer;
plant3Loader.load(plant3Url.href, function(gltf) {
    const plant3Model = gltf.scene;

    // Adjust the scale of the object as needed
    const scalePlant3 = 0.06; // Adjust as needed
    plant3Model.scale.set(scalePlant3, scalePlant3, scalePlant3);

    plant3Model.position.set(8, 0, 8.8);  // Adjust the position to avoid collision with other objects
    scene.add(plant3Model);
    plant3Mixer = new THREE.AnimationMixer(plant3Model);
    const plant3Clips = gltf.animations;

    plant3Clips.forEach(function(clip) {
        const action = plant3Mixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the plant3 model if needed
    // plant3Model.rotation.y = Math.PI / -3; // -60 degrees in radians

}, undefined, function(error) {
    console.error(error);
});

const woodbenchLoader = new GLTFLoader();

let woodbenchMixer;
woodbenchLoader.load(woodbenchUrl.href, function(gltf) {
    const woodbenchModel = gltf.scene;

    // Adjust the scale of the object as needed
    const scaleWoodbench = 0.5; // Adjust as needed
    woodbenchModel.scale.set(scaleWoodbench, scaleWoodbench, scaleWoodbench);

    woodbenchModel.position.set(-5, 0, -18);  // Adjust the position to avoid collision with other objects
    scene.add(woodbenchModel);
    woodbenchMixer = new THREE.AnimationMixer(woodbenchModel);
    const woodbenchClips = gltf.animations;

    woodbenchClips.forEach(function(clip) {
        const action = woodbenchMixer.clipAction(clip);
        action.play();
    });

    // Adjust the rotation of the woodbench model if needed
    //woodbenchModel.rotation.y = Math.PI / 4; // 45 degrees in radians

}, undefined, function(error) {
    console.error(error);
});

const blackboxLoader = new GLTFLoader();

let blackboxMixer;
blackboxLoader.load(blackboxUrl.href, function(gltf) {
    const blackboxModel = gltf.scene;

    // Sesuaikan skala objek jika diperlukan
    const scaleBlackbox = 0.25; // Sesuaikan sesuai kebutuhan
    blackboxModel.scale.set(scaleBlackbox, scaleBlackbox, scaleBlackbox);

    // Atur posisi objek agar tidak bertabrakan dengan objek sebelumnya
    blackboxModel.position.set(11, 5, -18.85);  // Sesuaikan posisi sesuai kebutuhan
    scene.add(blackboxModel);

    // Buat mixer dan mainkan animasinya jika ada
    blackboxMixer = new THREE.AnimationMixer(blackboxModel);
    const blackboxClips = gltf.animations;

    blackboxClips.forEach(function(clip) {
        const action = blackboxMixer.clipAction(clip);
        action.play();
    });

    // Sesuaikan rotasi objek jika diperlukan
      blackboxModel.rotation.y = Math.PI / -2; // Sesuaikan rotasi sesuai kebutuhan

}, undefined, function(error) {
    console.error(error);
});

const hmtcLoader = new GLTFLoader();

let hmtcMixer;
hmtcLoader.load(hmtcUrl.href, function(gltf) {
    const hmtcModel = gltf.scene;

    // Sesuaikan skala objek jika diperlukan
    const scaleHmtc = 0.2; // Sesuaikan sesuai kebutuhan
    hmtcModel.scale.set(scaleHmtc, scaleHmtc, scaleHmtc);

    // Atur posisi objek agar tidak bertabrakan dengan objek sebelumnya
    hmtcModel.position.set(14, 10.1, -19);  // Sesuaikan posisi sesuai kebutuhan
    scene.add(hmtcModel);

    // Buat mixer dan mainkan animasinya jika ada
    hmtcMixer = new THREE.AnimationMixer(hmtcModel);
    const hmtcClips = gltf.animations;

    hmtcClips.forEach(function(clip) {
        const action = hmtcMixer.clipAction(clip);
        action.play();
    });

    // Sesuaikan rotasi objek jika diperlukan
     hmtcModel.rotation.y = Math.PI / -2; // Sesuaikan rotasi sesuai kebutuhan

}, undefined, function(error) {
    console.error(error);
});


const clock = new THREE.Clock();
const moveSpeed = 10;
function animate() {

    ambientLight.intensity = lightingParameters.ambientIntensity;
    directionalLight.intensity = lightingParameters.directionalIntensity;

    // Atur warna cahaya ambient dan cahaya arah sesuai dengan nilai yang diatur oleh pengguna
    ambientLight.color.copy(lightingParameters.ambientColor);
    directionalLight.color.copy(lightingParameters.directionalColor);

    // Atur posisi cahaya arah sesuai dengan nilai yang diatur oleh pengguna
    directionalLight.position.x = directionalLightFolder.__controllers[0].object.x;
    directionalLight.position.y = directionalLightFolder.__controllers[1].object.y;
    directionalLight.position.z = directionalLightFolder.__controllers[2].object.z;

    const delta = clock.getDelta();

    if (controls.isLocked === true) {
    const moveDirection = new THREE.Vector3(0, 0, 0);

    if (moveForward) moveDirection.z -= 1;
    if (moveBackward) moveDirection.z += 1;
    if (moveLeft) moveDirection.x -= 1;
    if (moveRight) moveDirection.x += 1;

    moveDirection.normalize();

    const moveDistance = moveSpeed * delta;
    controls.moveForward(moveDirection.z * moveDistance);
    controls.moveRight(moveDirection.x * moveDistance);
  }

    if (mixer) mixer.update(clock.getDelta());
    if (pingpongMixer) pingpongMixer.update(clock.getDelta());
    if (rackMixer) rackMixer.update(clock.getDelta());
    if (roomMixer) roomMixer.update(clock.getDelta());
    if (shoerackMixer) shoerackMixer.update(clock.getDelta());
    if (redboxMixer) redboxMixer.update(clock.getDelta());
    if (plant1Mixer) plant1Mixer.update(clock.getDelta());
    if (plant2Mixer) plant2Mixer.update(clock.getDelta());
    if (plant3Mixer) plant3Mixer.update(clock.getDelta());
    if (woodbenchMixer) woodbenchMixer.update(clock.getDelta());
    if (blackboxMixer) blackboxMixer.update(clock.getDelta());
    if (hmtcMixer) hmtcMixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});