'use-strict';
const debug = true;
const clickChange = false;
const humanPlaying = false;
const aiPlaying = true;

const mapY = 14;
const mapX = 20;
const cellSize = 40;
let cells = [];
let startingCell;

const ballDiameter = 20;
const ballVelocity = 5;
let balls = [];


const coinDiameter = 12;
let coins = [];
let coinsNeeded = 0;
let coinsCollected = 0;

let humanAgent;
const agentMoveSpeed = cellSize / 15;

let population;
let populationSize = 500;
let lifeSpan = 300;
let dnaIndex = 0;
let mutationRate = .01;
let incrementalLearningGeneration = 5;
let incrementalLearningRate = 50;

let dnaIndexP;
let generationP;
let lifespanP;
let maxFitnessP;
let minFitnessP;
let avgFitnessP;

let level = 1;
let goals = [];

let cullPercentage = 0.25;

const addEventListener = () => {
	document.getElementById('start').addEventListener('click', function(e) {
    const popSize = document.getElementById('popSize');
    const initialLifeSpan = document.getElementById('initialLifeSpan');
    const mutationRateField = document.getElementById('mutationRate');
    const incLearnRate = document.getElementById('incLearnRate');
    const incLearnGen = document.getElementById('incLearnGen');
    const levelField = document.getElementById('level');
    
		dnaIndexP.remove();
		lifespanP.remove();
		generationP.remove();
		maxFitnessP.remove();
		minFitnessP.remove();
    avgFitnessP.remove();
    
    populationSize = parseInt(popSize.options[popSize.selectedIndex].value);
    lifeSpan = parseInt(initialLifeSpan.options[initialLifeSpan.selectedIndex].value);
    mutationRate = parseInt(mutationRateField.options[mutationRateField.selectedIndex].value) / 100;
    incrementalLearningRate = parseInt(incLearnRate.options[incLearnRate.selectedIndex].value);
    incrementalLearningGeneration = parseInt(incLearnGen.options[incLearnGen.selectedIndex].value);
    level = parseInt(levelField.options[levelField.selectedIndex].value);
		setup();
	});
}
addEventListener();

window.setup = () => {
  coinsNeeded = 0;
  coinsCollected = 0;
  balls = [];
  coins = [];
  cells = [];
  population = null;
  dnaIndex = 0;
  frameRate(60)

  const cvs = createCanvas(mapX * cellSize, mapY * cellSize);
  cvs.parent('sketch');
  
  for (let i = 0; i < mapX; i++) {
    cells[i] = [];
    for (let j = 0; j < mapY; j++) {
      cells[i].push(new Cell(i, j, cellSize, cellSize));
    }
  }

  if (level === 1) {
    startingCell = cells[3][9];
    goals = setLevel1();
  } else if (level === 2) {
    startingCell = cells[3][7];
    goals = setLevel2();
  } else if (level === 3) {
    startingCell = cells[9][6];
    goals = setLevel3();
  } else { // restart
    level = 1;
    startingCell = cells[5][10];
    goals = setLevel1();
  }

  if (aiPlaying) {
    dnaIndexP = createP();
    generationP = createP();
    lifespanP = createP();
    maxFitnessP = createP();
    minFitnessP = createP();
    avgFitnessP = createP();
    generationP.html('Generation: 1');
    lifespanP.html('Lifespan: ' + lifeSpan);
    maxFitnessP.html('Max Fitness: 0');
    minFitnessP.html('Min Fitness: 0');
    avgFitnessP.html('Average Fitness: 0');
    population = new Population();
  }

  spawnHumanAgent(startingCell);

};

window.draw = () => {
  background(0);
  dnaIndex += 1;
  
  if (dnaIndexP) {
    dnaIndexP.html('DNA: ' + dnaIndex);
  }

  let ctx = this.canvas.getContext('2d');

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j].show();
    }
  }

  for (let i = 0; i < balls.length; i++) {
    balls[i].show();
    balls[i].move(level);
  }

  if (aiPlaying) {
    population.run();
  }

  for (let i = 0; i < coins.length; i++) {
    coins[i].show();
  }

  ctx.font = "30px Arial";
  ctx.fillStyle = "black";

  if (humanPlaying && coinsNeeded) {
    ctx.fillText("Coins: " + coinsCollected + "/" + coinsNeeded, 10, 50);
  }

  if (humanAgent) {
    humanAgent.show();
    humanAgent.moveHuman();
    humanAgent.checkDeath();
    humanAgent.checkGoalReached()
    
    if (humanAgent.goalReached){
      console.log('Goal reached!');
      nextLevel(humanAgent);
    } else if (humanAgent.dead) {
      console.log('You Lose!');
      restart(humanAgent);
    }
  }
};

window.mousePressed = () => {
  const cell = getCell(mouseX, mouseY);
  if (cell) {
    const { position, gridPosition } = cell;
    if (debug) {
      console.log(cell);
      console.log(
        `CellX: ${position.x} (${gridPosition.x}) CellY: ${position.y} (${gridPosition.y})`,
      );
      console.log(`MouseX: ${mouseX} MouseY: ${mouseY}`);
    }

    if (clickChange) {
      if (cell.goal) {
        cell.goal = false;
        cell.wall = true;
      } else if (cell.wall) {
        cell.wall = false;
        cell.start = true;
      } else if (cell.start) {
        cell.start = false;
      } else {
        cell.goal = true;
      }
    }

    const distance = dist(mouseX, mouseY, goals[0].position.x, goals[0].position.y);
    console.log(`distance to goal: ${distance}`);
    console.log(`remapped: ${map(distance, 0, mapY*cellSize, mapX*cellSize, 0)}`);
  }
};

const getCell = (x, y) => {
  const gridX = Math.floor(x / cellSize);
  const gridY = Math.floor(y / cellSize);
  if (x >= 0 && y >= 0 && x < mapX * cellSize && y < mapY * cellSize) {
    return cells[gridX][gridY];
  }
};

const spawnHumanAgent = () => {
  if (humanPlaying) {
    humanAgent = new Agent(true);
  }
};

const restart = (agent) => {
  agent.goalReached = false;
  coinsCollected = 0;
  for (let i = 0; i < coins.length; i++) {
    coins[i].collected = false;
  }
  spawnHumanAgent();
};

const resetLevel = () => {
  for (let i = 0; i < balls.length; i++) {
    balls[i].position = balls[i].initialPosition.copy();
    balls[i].velocity = balls[i].initialVelocity.copy();
  }
}
