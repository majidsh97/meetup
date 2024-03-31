/*
  Johan Karlsson 2020
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
*/

let canvas;
let ctx;
let w, h;
let colors;
let colorSchemeIndex;

export function setup() {
  setupColors();
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  canvas.addEventListener("click", draw); 
  window.addEventListener("resize", reset);
}

function setupColors() {
  colors = [
    //https://coolors.co/45062e-7f055f-e5a4cb-1b5299-f2dfd7
    [
      "#45062e",
      "#7f055f",
      "#e5a4cb",
      "#1b5299",
      "#f2dfd7"
    ],
    //https://coolors.co/c17a43-825635-25646f-335a57-27302b
    [
      "#c17a43",
      "#825635",
      "#25646f",
      "#335a57",
      "#27302b"
    ],
    //https://coolors.co/ffb0a5-ffbc9b-ffd6bc-ffbc6b-ff8c70
    [
      "#ffb0a5",
      "#ffbc9b",
      "#ffd6bc",
      "#ffbc6b",
      "#ff8c70"
    ],
    //https://coolors.co/002649-709302-ffbe0b-fb6107-54234d
    [
      "#002649",
      "#709302",
      "#ffbe0b",
      "#fb6107",
      "#54234d"
    ],
    //https://coolors.co/4c5454-ff715b-ffffff-1ea896-523f38
    [
      "#4c5454",
      "#ff715b",
      "#ffffff",
      "#1ea896",
      "#523f38"
    ],
  ];
}

function getRandomColor() {
  let len = colors[colorSchemeIndex].length;
  let randomIndex = random(len);
  return colors[colorSchemeIndex][randomIndex];
}

function reset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  draw();
}

function drawNoise() {
  ctx.globalAlpha = 0.09;
  let color;
  let nrOfDots = w * h / 70;
  for(let i = 0; i < nrOfDots; i++) {
    if(Math.random() < 0.5) {
      color = "rgb(90, 90, 90)";
    } else {
      color = "rgb(200, 200, 200)";
    }
    ctx.fillStyle = color;
    let x = Math.random() * w;
    let y = Math.random() * h - 45;
    ctx.fillRect(x, y, 1, 90);
  }
}

function clear() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
}

function draw() {
  clear();
  drawCircles();
  drawNoise();
}

function drawCircles() {
  let nrOfColorSchemes = colors.length;
  colorSchemeIndex = random(nrOfColorSchemes);
  let size = 120;
  for(let row = Math.round(h / size * 2); row > -1; row -= 1) {
    let xOffset = row % 2 === 1 ? size/2 : 0;
    let y = row * size/2;
    for(let col = 0; col < w / size + size; col += 1) {
      let x = col * size;
      drawConcentricCircles(x + xOffset, y, size * 1.04);
    }
  }
}

function drawConcentricCircles(x, y, size) {
  drawCircle(x, y, size/2);
  drawCircle(x, y, size/3);
  drawCircle(x, y, size/7);
}

function drawCircle(x, y, size) {
  ctx.fillStyle = getRandomColor();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}

function random(max) {
  return Math.floor(Math.random() * max);
}
  
setup();
