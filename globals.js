//global vars

// const colorList = {
//   red: "#ff0000",
//   green: "#00ff15",
//   blue: "#0004ff",
//   yellow: "#f0d826",
//   neonOrange: "#e34c32",
//   purple: "#4f04bf",
//   greenBlue: "#04b6bf",
//   white: "#ffffff",
//   black: "#000000",
// };

//----------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------
function getRandomHexColor() {
  return (
    "#" +
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  );
}

//----------------------------------------------------
//----------------------------------------------------

// const x = Math.random() * (maxX - minX) + minX;
const getRandomNum = (max, min) => {
  return Math.random() * (max - min) + min;
};

//----------------------------------------------------
//----------------------------------------------------
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//----------------------------------------------------
//----------------------------------------------------

function getRandomPosition() {
  const x = getRandomNum(entityMinMaxPlacement, -entityMinMaxPlacement);
  const y = getRandomNum(entityMinMaxPlacement, -entityMinMaxPlacement);
  const z = getRandomNum(entityMinMaxPlacement, -entityMinMaxPlacement);
  return { x, y, z };
}

//----------------------------------------------------
//----------------------------------------------------
function convertDegreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
//----------------------------------------------------
//----------------------------------------------------
function removeDecimals(fromNumber) {
  return Number.parseFloat(fromNumber).toFixed(7);
}
