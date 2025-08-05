//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
import * as THREE from "three";
import * as globalsFile from "./globals.js";
import * as gameObjectsFile from "./gameObjectsCode.js";
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
const checkOverlapOnUpdate = (newObject, existingObjects) => {
  const raycaster = new THREE.Raycaster();
  const origin = new THREE.Vector3();
  newObject.mesh.getWorldPosition(origin); // Get the object's world position

  const direction = new THREE.Vector3(0, 0, -1); // Assuming the object's local forward is -Z
  newObject.mesh.getWorldDirection(direction); // Transform the local forward to world direction

  raycaster.set(origin, direction);

  let raycastArr = [];
  for (const existingObject of existingObjects) {
    raycastArr.push(existingObject.obstacle.mesh);
  }

  const intersects = raycaster.intersectObjects(raycastArr, true);
  // console.log("QQQ  intersects    ", intersects[0]);
  return intersects;
};

const checkOverlapOnSpawn = (newObject, existingObjects) => {
  const newBox = new THREE.Box3().setFromObject(newObject); // Or Sphere
  for (const existingObject of existingObjects) {
    const existingBox = new THREE.Box3().setFromObject(
      existingObject.obstacle.mesh
    );
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
  let obstaclesToSpawn = globalsFile.getRandomIntInclusive(30, 40);
  for (let c = 0; c < obstaclesToSpawn; c++) {
    let randomLat = globalsFile.getRandomNum(Math.PI, 1.0);

    let randomLon = globalsFile.getRandomNum(Math.PI * 2, 0.5);

    let obstacle = new gameObjectsFile.customGameObj(
      THREE,
      worldRadius,
      randomLat,
      randomLon,
      "obstacle"
    );

    if (!checkOverlapOnSpawn(obstacle.mesh, obstaclesArr)) {
      console.log("QQQ added ");
      const WireEdges = new THREE.EdgesGeometry(obstacle.mesh.geometry);
      const wireLine = new THREE.LineSegments(
        WireEdges,
        new THREE.LineBasicMaterial({ color: "white" })
      );
      obstacle.wireline = wireLine;

      worldGroup.add(obstacle.mesh);
      worldGroup.add(obstacle.wireline);
      obstaclesArr.push({ obstacle: obstacle, index: obstaclesArr.length });
      let cameraSphericalq = new THREE.Spherical();
      cameraSphericalq.set(obstacle.radius, randomLat, randomLon);
      let pointOnSphereq = new THREE.Vector3();
      pointOnSphereq.setFromSpherical(cameraSphericalq);
      //--------------
      // obstacle.mesh.position.set(pointOnSphereq.x, pointOnSphereq.y, pointOnSphereq.z);
      obstacle.wireline.position.set(
        pointOnSphereq.x,
        pointOnSphereq.y,
        pointOnSphereq.z
      );
      obstacle.wireline.lookAt(world.position);
      obstacle.wireline.rotateX(-1.5);
      obstacle.mesh.lookAt(world.position);
      obstacle.mesh.rotateX(-1.5);
    } else {
      console.log("QQQ NOT added ");
    }
  }
};

// spawnObstacles();
console.log("QQQ obs array  ", obstaclesArr.length);
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

  let start1 = globalsFile.getRandomIntInclusive(70, 40);
  let start2 = globalsFile.getRandomIntInclusive(-70, -40);
  let startObjectivesLat =
    globalsFile.getRandomIntInclusive(0, 1) > 0 ? start1 : start2;
  let loopLat = globalsFile.convertDegreesToRadians(startObjectivesLat);
  let spawnRows = 0;
  let latitudeStep = globalsFile.convertDegreesToRadians(40);
  let longitudeArc = globalsFile.convertDegreesToRadians(50); // vary for different square sizes
  let loopLonStep = globalsFile.convertDegreesToRadians(20);
  //pick a starting latitude
  //loop
  //sweep around that, increment lon by amount of spheres
  //increment longitude += step  (to go around latitude ring)
  //loop

  while (spawnRows < 6) {
    for (let lon = 0; lon < longitudeArc; lon += loopLonStep) {
      let obstacle = new gameObjectsFile.customGameObj(
        THREE,
        worldRadius,
        loopLat,
        lon,
        "objective"
      );

      if (!checkOverlapOnSpawn(obstacle.mesh, obstaclesArr)) {
        // const WireEdges = new THREE.EdgesGeometry(obstacle.mesh.geometry);
        // const wireLine = new THREE.LineSegments(
        //   WireEdges,
        //   new THREE.LineBasicMaterial({ color: "green" })
        // );
        // obstacle.wireline = wireLine;
        worldGroup.add(obstacle.mesh);
        // worldGroup.add(obstacle.wireline);
        objectivesArr.push({ obstacle: obstacle, index: objectivesArr.length });
        let cameraSphericalq = new THREE.Spherical();
        cameraSphericalq.set(obstacle.radius, loopLat, lon);
        let pointOnSphereq = new THREE.Vector3();
        pointOnSphereq.setFromSpherical(cameraSphericalq);
        // wireLine.position.set(
        //   pointOnSphereq.x,
        //   pointOnSphereq.y,
        //   pointOnSphereq.z
        // );
      }
    }

    loopLat += latitudeStep;
    spawnRows += 1;
  }
};

// spawnObjectives();
// spawnObjectives();
// spawnObjectives();
console.log("QQQ objectives size : ", objectivesArr.length);
let objectivesCompleted = 0;
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

//--------------
// instance a list of treasures
let treasureCollected = 0;
let randomTreasure = globalsFile.getRandomNum(50, 110);
let treasureArr = [];
for (let c = 0; c < randomTreasure; c++) {
  let randomLat = globalsFile.getRandomNum(0, 55);
  let randomLon = globalsFile.getRandomNum(0, 55);

  let obstacle = new gameObjectsFile.customGameObj(
    THREE,
    worldRadius,
    randomLat,
    randomLon,
    "treasure"
  );

  let overlapObstacles = checkOverlapOnSpawn(obstacle.mesh, obstaclesArr);
  let overlapObjectives = checkOverlapOnSpawn(obstacle.mesh, objectivesArr);
  if (!overlapObstacles && !overlapObjectives) {
    treasureArr.push({ obstacle: obstacle, index: treasureArr.length });
    worldGroup.add(obstacle.mesh);
    let cameraSphericalq = new THREE.Spherical();
    cameraSphericalq.set(obstacle.radius, randomLat, randomLon);
    let pointOnSphereq = new THREE.Vector3();
    pointOnSphereq.setFromSpherical(cameraSphericalq);

    obstacle.mesh.lookAt(world.position);
    obstacle.mesh.rotateX(-1.5);
  }
}

const totalTreasure = treasureArr.length;

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
let stopGame = false;
let stopUpdating = false;
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
  stopUpdating = true;

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
  camera.position.set(
    pointOnWorldSphere.x,
    pointOnWorldSphere.y,
    pointOnWorldSphere.z
  );

  //----------------------------
  //----------------------------
  // check if player collides with something

  //obstacles
  let playerCol = checkOverlapOnUpdate(playerData, obstaclesArr);
  if (playerCol.length > 0 && playerCol[0].distance <= 2) {
    console.log("QQQ UI GAME OVER");
    stopGame = true;
  }

  //objectives
  playerCol = undefined;
  playerCol = checkOverlapOnUpdate(playerData, objectivesArr);
  if (playerCol.length > 0 && playerCol[0].distance <= 1.5) {
    let currColor = playerCol[0].object.material.color;
    if (currColor.r === 1 && currColor.g === 0 && currColor.b === 0) {
      //the objective has already been completed before, so game over
      console.log("QQQ UI GAME OVER");
      stopGame = true;
    }
    playerCol[0].object.material.color.setRGB(1, 0, 0);
    objectivesCompleted += 1;
    console.log(
      `QQQ Objectives completed:  ${objectivesCompleted} / ${objectivesArr.length}`
    );
  }

  //treasure
  playerCol = undefined;
  let idToDelete = null;
  playerCol = checkOverlapOnUpdate(playerData, treasureArr);
  console.log("QQQ playerCol ", playerCol);
  if (playerCol.length > 0 && playerCol[0].distance <= 15) {
    treasureCollected += 1;
    console.log(`QQQ playerCol[0].distance`, playerCol[0].distance);
    console.log(
      `QQQ Treasure collected:  ${treasureCollected} / ${totalTreasure}`
    );
    idToDelete = playerCol[0].object.uuid;
    worldGroup.remove(playerCol[0].object);
    scene.remove(playerCol[0].object);

    let tmpLen = treasureArr.length;

    for (let i = 0; i < tmpLen; i++) {
      const element = treasureArr[i];
      if (element.obstacle.mesh.uuid === idToDelete) {
        treasureArr.splice(i, 1);
        i = 999999;
      }
    }
  }

  stopUpdating = false;
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
  worldGroup,
  world,
  worldRadius,
  stopGame,
  stopUpdating,
};
