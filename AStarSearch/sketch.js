const canvasHeight = 600;
const canvasWidth = canvasHeight;
let cols = 40;
let rows = cols;
let tmpCols = 40;
let tmpRows = 40;
let cellWidth = canvasWidth / cols;
let cellHeight = canvasHeight / rows;
let grid = [];
let openSet = [];
let closedSet = [];
let end;
let finalPath = [];
let percentWall = 30;

let diagonals = false;
let paused = true;
let pathCount;
let completed = false;

const removeFromArray = (arr, ele) => {
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === ele) arr.splice(i, 1);
  }
};

const heuristic = (a, b) => this.dist(a.x, a.y, b.x, b.y);

const addGridNeighbors = () => {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      grid[y][x].addNeighbors(grid, diagonals);
    }
  }
};

const createGrid = () => {
  cellWidth = canvasWidth / cols;
  cellHeight = canvasHeight / rows;
  finalPath = [];
  openSet = [];
  closedSet = [];
  grid = [];
  for (let y = 0; y < rows; y += 1) {
    grid.push([]);
    for (let x = 0; x < cols; x += 1) {
      grid[y].push(new Cell(x, y, cellHeight, cellWidth, percentWall));
    }
  }
  addGridNeighbors();

  const [[start]] = grid;
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
  return grid;
};

function addEventListeners() {
  const { document } = this;
  const wallPct = document.getElementById('wallPct');
  const cellSize = document.getElementById('cellSize');
  const diagonalsCheckbox = document.getElementById('diagonals');

  document.getElementById('start').addEventListener('click', () => {
    paused = false;
  });
  document.getElementById('newMap').addEventListener('click', () => {
    paused = true;
    rows = tmpRows;
    cols = tmpCols;
    createGrid();
    this.loop();
    completed = false;
    pathCount.html('');
  });
  diagonalsCheckbox.addEventListener('click', () => {
    diagonals = diagonalsCheckbox.checked;
    if (paused) {
      addGridNeighbors();
    }
  });
  cellSize.addEventListener('change', () => {
    const { value } = cellSize;
    tmpRows = value;
    tmpCols = value;
  });
  wallPct.addEventListener('change', () => {
    percentWall = parseInt(wallPct.value.slice(0, -1), 10);
  });
}

this.setup = () => {
  const cvs = this.createCanvas(canvasWidth, canvasHeight);

  cvs.parent('sketch');
  pathCount = this.createP('').parent('sketch');

  addEventListeners();
  createGrid();
};

this.draw = () => {
  let current;
  let neighbors;
  let neighbor;
  let tempg;
  let newPath;

  this.background(0);
  if (!paused) {
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i += 1) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      current = openSet[winner];

      if (current === end) {
        this.noLoop();
        completed = true;
        finalPath.push(grid[cols - 1][rows - 1]);
        paused = true;
        console.log('DONE!');
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      neighbors = current.neighbors;
      // loop through neighbors
      for (let i = 0; i < neighbors.length; i += 1) {
        neighbor = neighbors[i];
        // if neighbor not in closedset and its not a wall
        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          // set temporary g value
          tempg = current.g + 1;
          newPath = false;
          // if neighbor already in open set
          if (openSet.includes(neighbor)) {
            // if new g value less than old g value
            if (tempg < neighbor.g) {
              // set g value to new g, else nothing
              neighbor.g = tempg;
              newPath = true;
            }
            // if not in openset already, set g value and add to openset
          } else {
            neighbor.g = tempg;
            openSet.push(neighbor);
            newPath = true;
          }
          if (newPath) {
            neighbor.h = heuristic(neighbor, end);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.previous = current;
          }
        }
      }
    } else {
      console.log('No solution.');
      this.noLoop();
      paused = true;
      // return;
    }

    // find the path

    finalPath = [];
    let temp = current;
    while (temp && temp.previous) {
      finalPath.push(temp.previous);
      temp = temp.previous;
    }
    pathCount.html(`Final Path: ${finalPath.length}`);
  }
  // color nodes not in set
  for (let i = 0; i < cols; i += 1) {
    for (let j = 0; j < rows; j += 1) {
      grid[i][j].show(this.color(255));
    }
  }

  // color closed set nodes
  for (let i = 0; i < closedSet.length; i += 1) {
    closedSet[i].show(this.color(255, 0, 255));
  }
  // color open set nodes
  for (let i = 0; i < openSet.length; i += 1) {
    openSet[i].show(this.color(0, 0, 255));
  }
  // color finalpath
  for (let i = 0; i < finalPath.length; i += 1) {
    finalPath[i].show(this.color(255, 255, 0));
  }

  if (completed) grid[cols - 1][rows - 1].show(this.color(255, 255, 0));
};
