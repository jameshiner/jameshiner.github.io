const canvasHeight = 400;
const canvasWidth = canvasHeight;
const cellHeight = 20;
const cellWidth = cellHeight;
let rows;
let cols;
const cells = [];
let current;
const stack = [];

const index = (x, y) => {
  if (x < 0 || y < 0 || x > cols - 1 || y > rows - 1) {
    return -1;
  }
  return x + y * cols;
};

const removeWalls = (a, b) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  if (x === 1) {
    // a to the right of b
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    // a to the left of b
    a.walls[1] = false;
    b.walls[3] = false;
  }
  if (y === 1) {
    // a under b
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    // a on top of b
    a.walls[2] = false;
    b.walls[0] = false;
  }
};

const checkNeighbors = (cell) => {
  const { floor, random } = this;
  const { x, y } = cell;
  const neighbors = [];
  const top = cells[index(x, y - 1)];
  const right = cells[index(x + 1, y)];
  const bottom = cells[index(x, y + 1)];
  const left = cells[index(x - 1, y)];

  if (top && !top.visited) neighbors.push(top);
  if (right && !right.visited) neighbors.push(right);
  if (bottom && !bottom.visited) neighbors.push(bottom);
  if (left && !left.visited) neighbors.push(left);

  if (neighbors.length > 0) {
    return neighbors[floor(random(0, neighbors.length))];
  }
  return undefined;
};

this.setup = () => {
  this.createCanvas(canvasWidth, canvasHeight);
  cols = canvasWidth / cellWidth;
  rows = canvasHeight / cellHeight;
  this.frameRate(20);
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      cells.push(new Cell(x, y, cellHeight, cellWidth));
    }
  }
  [current] = cells;
};

this.draw = () => {
  this.background(51);
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].show();
  }
  current.visited = true;
  current.highlight();
  const next = checkNeighbors(current);
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
};
