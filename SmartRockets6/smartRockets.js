const debug = false;

const canvasWidth = 400;
const canvasHeight = 300;
const rocketHeight = 35;
const rocketWidth = 10;

let target;
const targetHeight = 10;
const targetWidth = 10;

const maxForce = 0.2;

let level = 1;
let gameLevel;

let incLearn = true;
let incLearnRate = 10;
let incLearnGen = 5;

const mutationRate = 0.01;

const lifespan = 50;
const populationSize = 100;
let dnaIndex = 0;
let population;

const maxLifespan = level === 1 ? 400 : 600;
let gameLifeSpan = maxLifespan;

const obstacleX = 100;
const obstacleY = 150;
const obstacle1X = 0;
const obstacle1Y = canvasHeight - 75;
const obstacle2X = canvasWidth - canvasWidth * 0.75;
const obstacle2Y = canvasHeight - 200;
const obstacle1Width = canvasWidth * 0.5;
const obstacle2Width = canvasWidth * 0.75;
const obstacleHeight = 10;

let dnaIndexP;
let lifespanP;
let generationP;
let maxFitnessP;
let avgFitnessP;
let fastestP;

const addEventListeners = () => {
  this.document.getElementById('start').addEventListener('click', () => {
    dnaIndexP.remove();
    lifespanP.remove();
    generationP.remove();
    maxFitnessP.remove();
    avgFitnessP.remove();
    fastestP.remove();
    this.setup();
  });
};

this.setup = () => {
  const { createP, createCanvas, createVector } = this;
  const cvs = createCanvas(canvasWidth, canvasHeight);
  cvs.parent('sketch');
  population = new Population(
    populationSize,
    lifespan,
    incLearn,
    incLearnRate,
    incLearnGen,
    mutationRate,
    gameLifeSpan,
  );
  gameLevel = level;
  dnaIndex = 0;
  dnaIndexP = createP();
  lifespanP = createP();
  generationP = createP();
  maxFitnessP = createP();
  avgFitnessP = createP();
  fastestP = createP();
  generationP.html('Generation: 1');
  lifespanP.html(`Lifespan: ${lifespan}`);
  maxFitnessP.html('Max Fitness: 0');
  avgFitnessP.html('Average Fitness: 0');
  fastestP.html('Fastest Finish: 0');
  target = createVector(canvasWidth / 2, 50);
  addEventListeners();
};

this.draw = () => {
  const { background, fill, rect, ellipse } = this;
  background(0);
  dnaIndex = population.run(dnaIndex);
  dnaIndexP.html(`DNA Index: ${dnaIndex}`);
  fill(255);
  if (gameLevel === 1) {
    rect(obstacleX, obstacleY, obstacle1Width, obstacleHeight);
  } else if (gameLevel === 2) {
    rect(obstacle1X, obstacle1Y, obstacle2Width, obstacleHeight);
    rect(obstacle2X, obstacle2Y, obstacle2Width, obstacleHeight);
  }
  ellipse(target.x, target.y, targetWidth, targetHeight);
};
