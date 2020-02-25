class Cell {
  constructor(x, y, h, w) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.walls = [true, true, true, true];
    this.visited = false;
  }

  show() {
    const { walls, x, y, height, width } = this;
    const xPos = x * width;
    const yPos = y * height;
    stroke(255);
    // top line
    if (walls[0]) {
      line(xPos, yPos, xPos + width, yPos);
    } // right line
    if (walls[1]) {
      line(xPos + width, yPos, xPos + width, yPos + width);
    } // bottom line
    if (walls[2]) {
      line(xPos + width, yPos + width, xPos, yPos + width);
    } // left line
    if (walls[3]) {
      line(xPos, yPos + width, xPos, yPos);
    }

    if (this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(xPos, yPos, width, height);
    }
  }

  highlight() {
    const xpos = this.x * this.width;
    const ypos = this.y * this.height;
    if (this.visited) {
      noStroke();
      fill(0, 255, 0, 100);
      rect(xpos, ypos, this.width, this.height);
    }
  }
}
