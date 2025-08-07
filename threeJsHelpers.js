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
renderer.setSize(window.innerWidth, window.innerHeight);

let cameraSpherical = new THREE.Spherical();

let gametitlediv = document.getElementById("game-title-div");
let objectivesLabel = document.getElementById("objectives-progress-label");
let treasureLabel = document.getElementById("treasure-progress-label");
let shieldLabel = document.getElementById("shield-progress-label");

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
let worldGroupHolder = null;
const worldRadius = 200;
let worldHolder = null;
let playerData = null;
let obstaclesArr = [];
let objectivesArr = [];
let treasureArr = [];
let treasureCollected = 0;
let objectivesCompleted = 0;
let hasGameStarted = false;
let stopGame = false;
let stopUpdating = false;
let totalTreasure = 0;
let cameraRadius = 245;
let cameraLatitude = 12.45; //   degrees north (camera coords in world sphere)
let cameraLongitude = 0; //   degrees east
let isShieldActive = false;
let currentShieldCnt = 0;
let shieldMax = 15;
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const setupWorldData = (worldRadius) => {
  //create a group to rotate all the objects in the world at the same time
  let worldGroup = new THREE.Group();

  //world sphere
  let gameWorldGeometry = new THREE.SphereGeometry(worldRadius, 32, 28); //(15, 24, 12)
  let world = new THREE.Mesh(
    gameWorldGeometry,
    new THREE.MeshBasicMaterial({ color: "black" })
  );
  world.rotation.x = 1.57;
  world.rotation.z = 1.57;

  let worldWireEdges = new THREE.EdgesGeometry(gameWorldGeometry);
  let worldwireLine = new THREE.LineSegments(
    worldWireEdges,
    new THREE.LineBasicMaterial({ color: 0x40ff00, linewidth: 50 })
  );

  worldGroup.add(world);
  worldGroup.add(worldwireLine);

  return { worldGroup: worldGroup, world: world };
};
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
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const spawnPlayer = () => {
  //instantiate player
  let playerData = new gameObjectsFile.PlayerClass(THREE, worldRadius, 0, 0);
  //------
  //add player to world
  scene.add(playerData.mesh);
  scene.add(playerData.wireLine);

  return playerData;
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const spawnObstacles = (worldGroup, world, obstaclesArr) => {
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
      obstacle.wireline.position.set(
        pointOnSphereq.x,
        pointOnSphereq.y,
        pointOnSphereq.z
      );
      obstacle.wireline.lookAt(world.position);
      obstacle.wireline.rotateX(-1.5);
      obstacle.mesh.lookAt(world.position);
      obstacle.mesh.rotateX(-1.5);
    }
  }
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const spawnObjectives = (worldGroup, objectivesArr, obstaclesArr) => {
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
  let latitudeStep = globalsFile.convertDegreesToRadians(20);
  let longitudeArc = globalsFile.convertDegreesToRadians(50); // vary for different square sizes
  let loopLonStep = globalsFile.convertDegreesToRadians(20);
  //pick a starting latitude
  //loop
  //sweep around that, increment lon by amount of spheres
  //increment longitude += step  (to go around latitude ring)
  //loop

  while (spawnRows < 7) {
    for (let lon = 0; lon < longitudeArc; lon += loopLonStep) {
      let obstacle = new gameObjectsFile.customGameObj(
        THREE,
        worldRadius,
        loopLat,
        lon,
        "objective"
      );

      if (
        !checkOverlapOnSpawn(obstacle.mesh, obstaclesArr) &&
        !checkOverlapOnSpawn(obstacle.mesh, objectivesArr)
      ) {
        worldGroup.add(obstacle.mesh);
        objectivesArr.push({ obstacle: obstacle, index: objectivesArr.length });
        let cameraSphericalq = new THREE.Spherical();
        cameraSphericalq.set(obstacle.radius, loopLat, lon);
        let pointOnSphereq = new THREE.Vector3();
        pointOnSphereq.setFromSpherical(cameraSphericalq);
      }
    }

    loopLat += latitudeStep;
    spawnRows += 1;
  }
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const spawnTreasure = (
  worldGroup,
  world,
  treasureArr,
  obstaclesArr,
  objectivesArr
) => {
  //--------------
  // instance a list of treasures

  let randomTreasure = globalsFile.getRandomNum(50, 110);

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
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const setCamera = (resetCamera) => {
  if (resetCamera) {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
  } else {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 350; //350
    camera.rotateX(0.5);
    camera.rotateY(22);
  }

  cameraSpherical = new THREE.Spherical();
  cameraSpherical.set(cameraRadius, cameraLatitude, cameraLongitude);
  const pointOnWorldSphere = new THREE.Vector3();
  pointOnWorldSphere.setFromSpherical(cameraSpherical);
  //--------------
  camera.position.set(
    pointOnWorldSphere.x,
    pointOnWorldSphere.y,
    pointOnWorldSphere.z
  );
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const startNewGame = () => {
  //spawns the world and all the elements in the scene, sets all values to 0, or default
  //create worldgroup and the main world
  let worldData = setupWorldData(worldRadius);
  worldGroupHolder = worldData.worldGroup;
  worldHolder = worldData.world;
  //-----
  playerData = spawnPlayer();
  //-----
  spawnObstacles(worldGroupHolder, worldHolder, obstaclesArr);
  //-----
  spawnObjectives(worldGroupHolder, objectivesArr, obstaclesArr);
  //-----
  spawnTreasure(
    worldGroupHolder,
    worldHolder,
    treasureArr,
    obstaclesArr,
    objectivesArr
  );
  //-----
  totalTreasure = treasureArr.length;
  //-----
  setCamera(false);
  //-----
  scene.add(worldGroupHolder);

  objectivesLabel.innerText = `${objectivesCompleted}/${objectivesArr.length}`;
  treasureLabel.innerText = `${treasureCollected}/${totalTreasure}`;
  shieldLabel.innerText = `${0}/${shieldMax}`;

  hasGameStarted = true;
  stopUpdating = false;
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const cleanMaterial = (material) => {
  material.dispose();

  // dispose textures
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value && typeof value === "object" && "minFilter" in value) {
      value.dispose();
    }
  }
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const clearScene = () => {
  renderer.dispose();

  scene.traverse((object) => {
    if (!object.isMesh) return;

    // console.log("QQQ dispose geometry!");
    object.geometry.dispose();

    if (object.material.isMaterial) {
      cleanMaterial(object.material);
    } else {
      // an array of materials
      for (const material of object.material) cleanMaterial(material);
    }
  });
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const resetPlayer = () => {
  playerData.radius = 0;
  playerData.latitude = 0;
  playerData.longitude = 0;
  playerData.spherical = null;
  playerData.mesh = null;
  playerData.wireLine = null;
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const clearGameData = () => {
  worldGroupHolder.remove(playerData.mesh);
  worldGroupHolder.remove(playerData.wireline);
  scene.remove(playerData.mesh);
  scene.remove(playerData.wireline);
  scene.remove(worldHolder);
  scene.remove(worldGroupHolder);
  clearScene();
  resetPlayer();
  setCamera(true);

  while (scene.children.length) {
    scene.remove(scene.children[0]);
  }

  gametitlediv.innerText = "SPHERE GAME";

  worldGroupHolder = null;
  worldHolder = null;
  playerData = null;
  obstaclesArr = [];
  objectivesArr = [];
  treasureArr = [];
  treasureCollected = 0;
  objectivesCompleted = 0;
  hasGameStarted = false;
  stopGame = false;
  stopUpdating = true;
  totalTreasure = 0;
  cameraRadius = 245;
  cameraLatitude = 12.45; //   degrees north (camera coords in world sphere)
  cameraLongitude = 0;
  isShieldActive = false;
  currentShieldCnt = 0;
  shieldMax = 15;
  //cleans everything so that new game can be called and spawn a new world
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
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

const updateWorld = () => {
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
  cameraLatitude += 0.01;
  camera.rotateX(-0.01);

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
    if (!isShieldActive) {
      gametitlediv.innerText = "GAME OVER";
      stopGame = true;
      hasGameStarted = false;
      stopUpdating = true;
    } else {
      isShieldActive = false;
      currentShieldCnt = 0;
      playerData.mesh.material.color.setHex(0x000000);
      playerData.wireLine.material.color.setHex(0xffffff);
      shieldLabel.innerText = `${currentShieldCnt}/${shieldMax}`;
    }
  }

  //objectives
  playerCol = undefined;
  playerCol = checkOverlapOnUpdate(playerData, objectivesArr);
  if (playerCol.length > 0 && playerCol[0].distance <= 1.5) {
    let currColor = playerCol[0].object.material.color;
    if (currColor.r === 1 && currColor.g === 0 && currColor.b === 0) {
      //the objective has already been completed before, so game over
      if (!isShieldActive) {
        gametitlediv.innerText = "GAME OVER";
        stopGame = true;
        hasGameStarted = false;
        stopUpdating = true;
      } else {
        isShieldActive = false;
        currentShieldCnt = 0;
        playerData.mesh.material.color.setHex(0x000000);
        playerData.wireLine.material.color.setHex(0xffffff);
        shieldLabel.innerText = `${currentShieldCnt}/${shieldMax}`;
      }
    }

    playerCol[0].object.material.color.setRGB(1, 0, 0);
    objectivesCompleted += 1;
    objectivesLabel.innerText = `${objectivesCompleted}/${objectivesArr.length}`;

    if (objectivesCompleted === objectivesArr.length) {
      gametitlediv.innerText = "YOU WIN!";
      stopGame = true;
      hasGameStarted = false;
      stopUpdating = true;
    }
  }

  //treasure
  playerCol = undefined;
  let idToDelete = null;
  playerCol = checkOverlapOnUpdate(playerData, treasureArr);

  if (playerCol.length > 0 && playerCol[0].distance <= 3) {
    treasureCollected += 1;
    currentShieldCnt += currentShieldCnt === shieldMax ? 0 : 1;
    if (currentShieldCnt === shieldMax) {
      isShieldActive = true;
      playerData.mesh.material.color.setHex(0xf7d705);
      playerData.wireLine.material.color.setHex(0x000000);
    }
    treasureLabel.innerText = `${treasureCollected}/${totalTreasure}`;
    shieldLabel.innerText = `${currentShieldCnt}/${shieldMax}`;
    idToDelete = playerCol[0].object.uuid;
    worldGroupHolder.remove(playerCol[0].object);
    scene.remove(playerCol[0].object);

    let tmpLen = treasureArr.length;

    for (let i = 0; i < tmpLen; i++) {
      const element = treasureArr[i];
      if (element.obstacle.mesh.uuid === idToDelete) {
        treasureArr.splice(i, 1);
        i = 9999;
      }
    }
  }

  stopUpdating = false;
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
export {
  THREE,
  camera,
  renderer,
  scene,
  startNewGame,
  clearGameData,
  updateWorld,
  playerData,
  worldGroupHolder,
  worldHolder,
  worldRadius,
  hasGameStarted,
  stopGame,
  stopUpdating,
  cameraRadius,
  cameraLatitude,
  cameraLongitude,
};
