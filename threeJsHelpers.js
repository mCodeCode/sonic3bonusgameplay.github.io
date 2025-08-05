//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
import * as THREE from "three";
import * as globalsFile from "./globals.js";
import * as gameObjectsFile from "./gameObjectsCode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//camera and canvas setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("black");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight - 5);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 350; //350

const cameraSpherical = new THREE.Spherical();
camera.rotateX(0.5);
camera.rotateY(22);

//----------------------------------------------------
//----------------------------------------------------
//camera and scene setup  // QQQ remove later
// const controls = new OrbitControls(camera, canvas);
// controls.target.set(0, 5, 0);
// controls.update();

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

// // 1. Instantiate TextureLoader
const loader = new THREE.TextureLoader();

// // 2. Load the Texture
// const worldTextureFile = loader.load("./files/green_grid_1.png"); // Replace with your texture path

// // 3. Create MeshBasicMaterial and Apply Texture
// const worldMaterial = new THREE.MeshBasicMaterial({
//   map: worldTextureFile,
// });

//----------------------------------------------------
//----------------------------------------------------
//create a group to rotate all the objects in the world at the same time
const worldGroup = new THREE.Group();
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//world sphere
const worldRadius = 150;
const gameWorldGeometry = new THREE.SphereGeometry(worldRadius, 32, 28); //(15, 24, 12)
const world = new THREE.Mesh(
  gameWorldGeometry,
  new THREE.MeshBasicMaterial({ color: "black" })
);
// const world = new THREE.Mesh(gameWorldGeometry, worldMaterial);
world.rotation.x = 1.57;
world.rotation.z = 1.57;

const worldWireEdges = new THREE.EdgesGeometry(gameWorldGeometry);
const worldwireLine = new THREE.LineSegments(
  worldWireEdges,
  new THREE.LineBasicMaterial({ color: 0x40ff00, linewidth: 50 })
);

worldGroup.add(world);
worldGroup.add(worldwireLine);
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const checkOverlap = (newObject, existingObjects) => {
  const newBox = new THREE.Box3().setFromObject(newObject); // Or Sphere
  for (const existingObject of existingObjects) {
    const existingBox = new THREE.Box3().setFromObject(existingObject);
    if (newBox.intersectsBox(existingBox)) {
      // Or intersectsSphere
      return true; // Overlap detected
    }
  }
  return false; // No overlap
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
let obstaclesArr = [];
const spawnObstacles = () => {
  //--------------
  // instance a list of cones (obstacles)
  //store positions so that they dont repeat
  // let obstacleLats = [];
  // let obstacleLongs = [];

  let obstaclesToSpawn = globalsFile.getRandomIntInclusive(30, 120);
  for (let c = 0; c < obstaclesToSpawn; c++) {
    let randomLat = globalsFile.getRandomNum(-Math.PI, Math.PI);
    let randomLon = globalsFile.getRandomNum(0, Math.PI * 2);

    let obstacle = new gameObjectsFile.customGameObj(
      THREE,
      loader,
      worldRadius,
      randomLat,
      randomLon,
      "obstacle"
    );

    const WireEdges = new THREE.EdgesGeometry(obstacle.mesh.geometry);
    const wireLine = new THREE.LineSegments(
      WireEdges,
      new THREE.LineBasicMaterial({ color: "black" })
    );
    obstacle.wireline = wireLine;

    if (!checkOverlap(obstacle.mesh, obstaclesArr)) {
      worldGroup.add(obstacle.mesh);
      worldGroup.add(wireLine);
      obstaclesArr.push(obstacle.mesh);
      let cameraSphericalq = new THREE.Spherical();
      cameraSphericalq.set(obstacle.radius, randomLat, randomLon);
      let pointOnSphereq = new THREE.Vector3();
      pointOnSphereq.setFromSpherical(cameraSphericalq);
      //--------------
      // obstacle.mesh.position.set(pointOnSphereq.x, pointOnSphereq.y, pointOnSphereq.z);
      wireLine.position.set(
        pointOnSphereq.x,
        pointOnSphereq.y,
        pointOnSphereq.z
      );
      wireLine.lookAt(world.position);
      wireLine.rotateX(-1.5);
      obstacle.mesh.lookAt(world.position);
      obstacle.mesh.rotateX(-1.5);
    }
  }
};

spawnObstacles();
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
let objectivesArr = [];
const spawnObjectives = () => {
  //--------------
  // instance a list of objectives
  //latitude are the horizontal line, and goes from -90 to 90,
  // with 0 being the central ring of the sphere
  //
  //longitude are the vertical lines, and goes from 0 to 180
  //with 0 being the central ring of the sphere

  let start1 = globalsFile.getRandomIntInclusive(40, 60);
  let start2 = globalsFile.getRandomIntInclusive(-60, -40);
  let startObjectivesLat =
    globalsFile.getRandomIntInclusive(0, 1) > 0 ? start1 : start2;
  let loopLat = globalsFile.convertDegreesToRadians(startObjectivesLat);
  let spawnRows = 0;
  let latitudeStep = globalsFile.convertDegreesToRadians(12);
  let longitudeArc = globalsFile.convertDegreesToRadians(50); // vary for different square sizes
  let loopLonStep = globalsFile.convertDegreesToRadians(8.5);
  //pick a starting latitude
  //loop
  //sweep around that, increment lon by amount of spheres
  //increment longitude += step  (to go around latitude ring)
  //loop

  while (spawnRows < 4) {
    for (let lon = 0; lon < longitudeArc; lon += loopLonStep) {
      let obstacle = new gameObjectsFile.customGameObj(
        THREE,
        loader,
        worldRadius,
        loopLat,
        lon,
        "objective"
      );

      if (!checkOverlap(obstacle.mesh, obstaclesArr)) {
        const WireEdges = new THREE.EdgesGeometry(obstacle.mesh.geometry);
        const wireLine = new THREE.LineSegments(
          WireEdges,
          new THREE.LineBasicMaterial({ color: "green" })
        );
        obstacle.wireline = wireLine;
        worldGroup.add(obstacle.mesh);
        objectivesArr.push(obstacle.mesh);
        worldGroup.add(wireLine);
        let cameraSphericalq = new THREE.Spherical();
        cameraSphericalq.set(obstacle.radius, loopLat, lon);
        let pointOnSphereq = new THREE.Vector3();
        pointOnSphereq.setFromSpherical(cameraSphericalq);
        wireLine.position.set(
          pointOnSphereq.x,
          pointOnSphereq.y,
          pointOnSphereq.z
        );
      }
    }

    loopLat += latitudeStep;
    spawnRows += 1;
  }
};

spawnObjectives();
spawnObjectives();
spawnObjectives();
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//--------------
// instance a list of treasures
for (let c = 0; c < 25; c++) {
  let randomLat = globalsFile.getRandomNum(0, 55);
  let randomLon = globalsFile.getRandomNum(0, 55);

  let obstacle = new gameObjectsFile.customGameObj(
    THREE,
    loader,
    worldRadius,
    randomLat,
    randomLon,
    "treasure"
  );
  // const WireEdges = new THREE.EdgesGeometry(obstacle.mesh.geometry);
  // const wireLine = new THREE.LineSegments(
  //   WireEdges,
  //   new THREE.LineBasicMaterial({ color: "black" })
  // );
  // obstacle.wireline = wireLine;
  worldGroup.add(obstacle.mesh);
  // worldGroup.add(wireLine);
  let cameraSphericalq = new THREE.Spherical();
  cameraSphericalq.set(obstacle.radius, randomLat, randomLon);
  let pointOnSphereq = new THREE.Vector3();
  pointOnSphereq.setFromSpherical(cameraSphericalq);
  //--------------
  // obstacle.mesh.position.set(pointOnSphereq.x, pointOnSphereq.y, pointOnSphereq.z);
  // wireLine.position.set(pointOnSphereq.x, pointOnSphereq.y, pointOnSphereq.z);
  // wireLine.lookAt(world.position);
  // wireLine.rotateX(-1.5);
  obstacle.mesh.lookAt(world.position);
  obstacle.mesh.rotateX(-1.5);
}

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

scene.add(worldGroup);

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
// let latitude = 0; //   degrees north
// let longitude = 0; //   degrees east
// cone.rotateX(59.5);
// camera.rotateZ(150);
//shapes and lines functions
const updateWorld = (
  playerData,
  cameraRadius,
  cameraLatitude,
  cameraLongitude
) => {
  //this will happen every frame
  //------------------------------
  //------------------------------
  //------------------------------
  //------------------------------
  //update player position

  playerData.latitude += 0.01;
  playerData.mesh.rotateX(0.01);
  playerData.wireLine.rotateX(0.01);

  playerData.spherical.set(
    playerData.radius,
    playerData.latitude,
    playerData.longitude
  );

  const pointOnSphere = new THREE.Vector3();
  pointOnSphere.setFromSpherical(playerData.spherical);
  playerData.mesh.position.set(
    pointOnSphere.x,
    pointOnSphere.y,
    pointOnSphere.z
  );
  playerData.wireLine.position.set(
    pointOnSphere.x,
    pointOnSphere.y,
    pointOnSphere.z
  );

  //------------------------------
  //------------------------------
  //------------------------------
  //------------------------------
  //update camera position
  //--------------

  cameraSpherical.set(cameraRadius, cameraLatitude, cameraLongitude);
  const pointOnWorldSphere = new THREE.Vector3();
  pointOnWorldSphere.setFromSpherical(cameraSpherical);
  //--------------
  // cone.position.set(
  //   pointOnWorldSphere.x,
  //   pointOnWorldSphere.y,
  //   pointOnWorldSphere.z
  // );
  // cone.rotateX(0.1);

  //--------------
  camera.position.set(
    pointOnWorldSphere.x,
    pointOnWorldSphere.y,
    pointOnWorldSphere.z
  );
  // camera.rotateX(-0.1);
};

const testCamRotation = (direction) => {
  //x z c keys
  if (direction === "x") {
    camera.rotateX(-0.1);
  }
  if (direction === "c") {
    camera.rotateY(-0.1);
  }
  if (direction === "z") {
    camera.rotateZ(-0.1);
  }
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const addToScene = (mesh) => {
  scene.add(mesh); // draw mesh
};
//----------------------------------------------------
//----------------------------------------------------
const removeMeshAndGeomFromScene = (mesh) => {
  try {
    if (mesh && mesh.geometry && mesh.material) {
      // Remove from scene
      scene.remove(mesh);

      // Dispose of geometry and material
      mesh.geometry.dispose();
      mesh.material.dispose();

      // Optionally, dispose of textures used by the material
      if (mesh.material.map) {
        mesh.material.map.dispose();
      }
      if (mesh.material.normalMap) {
        mesh.material.normalMap.dispose();
      }
      if (mesh.material.bumpMap) {
        mesh.material.bumpMap.dispose();
      }

      // Null out properties to prevent holding references
      mesh.geometry = null;
      mesh.material = null;
      mesh = null;
    }
  } catch (error) {
    console.log("QQQ error deleting mesh.  ", error);
  }
};

//----------------------------------------------------
//----------------------------------------------------
export {
  THREE,
  addToScene,
  removeMeshAndGeomFromScene,
  updateWorld,
  testCamRotation,
  camera,
  renderer,
  scene,
  loader,
  worldGroup,
  world,
  worldRadius,
};
