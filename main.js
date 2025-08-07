import * as threeJsHelper from "./threeJsHelpers.js";
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const movePlayerAKey = () => {
  const startPoint = new threeJsHelper.THREE.Vector3(
    threeJsHelper.playerData.mesh.position.x,
    threeJsHelper.playerData.mesh.position.y,
    threeJsHelper.playerData.mesh.position.z
  );
  const angle = -0.2;
  threeJsHelper.worldGroupHolder.rotateOnWorldAxis(
    startPoint.normalize(),
    angle
  );
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const movePlayerDKey = () => {
  const startPoint = new threeJsHelper.THREE.Vector3(
    threeJsHelper.playerData.mesh.position.x,
    threeJsHelper.playerData.mesh.position.y,
    threeJsHelper.playerData.mesh.position.z
  );
  const angle = 0.2;
  threeJsHelper.worldGroupHolder.rotateOnWorldAxis(
    startPoint.normalize(),
    angle
  );
};
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
const el = document.getElementById("c");
el.addEventListener("touchstart", (event) => {
  event.preventDefault();
  const touches = event.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    const touch = touches[i];
    // mainmenudiv.innerText = `X: ${touch.clientX} --- Y: ${touch.clientY} `;
    if (touch.clientX < window.innerWidth / 2) {
      movePlayerAKey();
    } else if (touch.clientX > window.innerWidth / 2) {
      movePlayerDKey();
    }
  }
});
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

let mainmenudiv = document.getElementById("main-menu-div");
let gameStatsDiv = document.getElementById("game-stats-div");
gameStatsDiv.style.visibility = "hidden";
//set game UI
let startGameBtn = document.getElementById("start-game-btn");

startGameBtn.addEventListener("click", () => {
  if (threeJsHelper.stopGame) {
    //clear data and start new game
    threeJsHelper.clearGameData();
    mainmenudiv.style.visibility = "hidden";
    gameStatsDiv.style.visibility = "visible";
    threeJsHelper.startNewGame();
  } else {
    mainmenudiv.style.visibility = "hidden";
    gameStatsDiv.style.visibility = "visible";
    threeJsHelper.startNewGame();
  }
});
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
let intervalId = null;
//---------------------------------
//---------------------------------
//logic for events
document.addEventListener("keydown", (event) => {
  // console.log("QQQ  e ", event);
  //stop looping and generating data ("stops" the program)
  if (event.key === "l") {
    // clearInterval(intervalId);
    window.cancelAnimationFrame(intervalId);
    // release our intervalId from the variable
    intervalId = null;
    console.log("QQQ end of program.");
  }

  if (!threeJsHelper.hasGameStarted) return;

  //---------------------
  //---------------------
  //---------------------
  if (event.key === "a") {
    movePlayerAKey();
  }
  if (event.key === "d") {
    movePlayerDKey();
  }
});

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
function main() {
  function resizeRendererToDisplaySize(renderer) {
    const canvas = threeJsHelper.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      threeJsHelper.renderer.setSize(width, height, false);
    }

    return needResize;
  }

  //----------------------------------------------------
  //----------------------------------------------------
  //----------------------------------------------------
  //  RENDER LOOP
  function renderLoop() {
    if (resizeRendererToDisplaySize(threeJsHelper.renderer)) {
      const canvas = threeJsHelper.renderer.domElement;
      threeJsHelper.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      threeJsHelper.camera.updateProjectionMatrix();
    }

    if (threeJsHelper.stopGame) {
      // console.log("QQQ game ended ");
      //show main menu, clean world data
      mainmenudiv.style.visibility = "visible";
      gameStatsDiv.style.visibility = "hidden";
    } else if (!threeJsHelper.stopUpdating && threeJsHelper.hasGameStarted) {
      // console.log("QQQ game is running ");
      threeJsHelper.updateWorld();
    }
    //render game on screen
    threeJsHelper.renderer.render(threeJsHelper.scene, threeJsHelper.camera);

    intervalId = requestAnimationFrame(renderLoop);
  }

  intervalId = requestAnimationFrame(renderLoop);
}

main();
