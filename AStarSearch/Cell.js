class Cell {
  constructor(x, y, h, w, percentWall) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    // heuristic
    this.h = 0;
    // travel distance
    this.g = 0;
    this.f = 0;
    this.previous = undefined;
    this.neighbors = [];
    this.wall = random(1) < percentWall / 100;
  }

  show(color) {
    fill(color);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(
      this.x * this.width,
      this.y * this.height,
      this.width - 1,
      this.height - 1,
    );
  }

  addNeighbors(inputGrid, diagonals) {
    const { x, y } = this;
    const left = x + 1;
    const right = x - 1;
    const up = y - 1;
    const down = y + 1;
    const rows = inputGrid.length;
    const cols = inputGrid[0].length;

    this.neighbors = [];
    if (y < cols - 1) {
      this.neighbors.push(inputGrid[down][x]);
    }
    if (y > 0) {
      this.neighbors.push(inputGrid[up][x]);
    }
    if (x < rows - 1) {
      this.neighbors.push(inputGrid[y][left]);
    }
    if (x > 0) {
      this.neighbors.push(inputGrid[y][right]);
    }
    if (diagonals) {
      if (x > 0 && y > 0) {
        this.neighbors.push(inputGrid[up][right]);
      }
      if (x < cols - 1 && y > 0) {
        this.neighbors.push(inputGrid[up][left]);
      }
      if (x > 0 && y < rows - 1) {
        this.neighbors.push(inputGrid[down][right]);
      }
      if (x < cols - 1 && y < rows - 1) {
        this.neighbors.push(inputGrid[down][left]);
      }
    }
  }
}
