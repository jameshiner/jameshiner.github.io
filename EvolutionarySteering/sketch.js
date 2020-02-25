const canvasHeight = 600;
const canvasWidth = 800;

const foodCount = 40;
const poisonCount = 20;

const percentNewFood = 20;
const percentNewPoison = 1;

const fHeight = 6;
const fWidth = fHeight;
const pHeight = 6;
const pWidth = pHeight;

const vCount = 50;
const vSize = 4;
const vMaxSpeed = 5;
const vMaxForce = 0.2;
const vHpStart = 1;
const vHpDegen = 0.01;
const vGoodHpInc = 0.3;
const vBadHpDec = -0.75;
const vMutationRate = 2;

const percRdmCopy = 0.5;

let debug = false;

const vehicles = [];
const food = [];
const poison = [];

const vehicleGenerator = ({
  x = 0,
  y = 0,
  size = vSize,
  maxSpeed = vMaxSpeed,
  maxForce = vMaxForce,
  hpStart = vHpStart,
  hpDegen = vHpDegen,
  goodHpInc = vGoodHpInc,
  badHpDec = vBadHpDec,
  mutationRate = vMutationRate,
  dna = null,
}) => {
  return new Vehicle({
    x,
    y,
    size,
    maxSpeed,
    maxForce,
    hpStart,
    hpDegen,
    goodHpInc,
    badHpDec,
    mutationRate,
    dna,
  });
};

this.setup = () => {
  const { document, createVector, createCanvas, random } = this;
  const debugCheckbox = document.getElementById('debug');
  const cvs = createCanvas(canvasWidth, canvasHeight);
  let x;
  let y;
  cvs.parent('sketch');
  for (let i = 0; i < vCount; i += 1) {
    x = random(canvasWidth);
    y = random(canvasHeight);
    vehicles.push(vehicleGenerator({ x, y }));
  }
  for (let i = 0; i < foodCount; i += 1) {
    x = random(canvasWidth);
    y = random(canvasHeight);
    food.push(createVector(x, y));
  }
  for (let i = 0; i < poisonCount; i += 1) {
    x = random(canvasWidth);
    y = random(canvasHeight);
    poison.push(createVector(x, y));
  }

  debugCheckbox.addEventListener('click', () => {
    debug = debugCheckbox.checked;
  });
};

this.mouseDragged = () => {
  const { mouseX: x, mouseY: y } = this;
  if (x < canvasWidth && y < canvasHeight) {
    vehicles.push(vehicleGenerator({ x, y }));
  }
};

this.draw = () => {
  const { random, background, createVector, fill, noStroke, ellipse } = this;
  let rx;
  let ry;
  background(51);

  if (random(1) < percentNewFood / 100) {
    rx = random(canvasWidth);
    ry = random(canvasHeight);
    food.push(createVector(rx, ry));
  }
  if (random(1) < percentNewPoison / 100) {
    rx = random(canvasWidth);
    ry = random(canvasHeight);
    poison.push(createVector(rx, ry));
  }

  for (let i = 0; i < food.length; i += 1) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, fWidth, fHeight);
  }
  for (let i = 0; i < poison.length; i += 1) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, pWidth, pHeight);
  }

  // Call the appropriate steering behaviors for our agents
  for (let i = vehicles.length - 1; i >= 0; i -= 1) {
    const currentVehicle = vehicles[i];
    currentVehicle.boundries();
    currentVehicle.behaviors(food, poison);
    currentVehicle.update();
    currentVehicle.display();

    if (random(1) < percRdmCopy / 100) {
      const {
        position: { x, y },
        dna,
      } = currentVehicle;
      vehicles.push(vehicleGenerator({ x, y, dna }));
    }

    if (vehicles[i].isDead()) {
      const { position } = vehicles[i];
      food.push(createVector(position.x, position.y));
      vehicles.splice(i, 1);
    }
  }
};
