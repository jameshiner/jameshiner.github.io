class Cell {
  constructor(x, y) {
    this.height = cellSize;
    this.width = cellSize;
    this.position = createVector(x * this.width, y * this.height);
    this.positionBR = createVector(x * this.width + this.width, y * this.height + this.height);
    this.gridPosition = createVector(x, y);
    this.y = y;
    this.goal = false;
    this.wall = false;
    this.start = false;
  }

  show() {
    const { x, y } = this.gridPosition;
    noStroke();
    if (this.goal) {
      fill(100, 242, 70);
    } else if (this.wall) {
      fill(170, 165, 255);
    } else if (this.start) {
      fill(158, 242, 155);
    } else if ((x + y) % 2 === 0) {
      fill(224, 218, 254);
    } else {
      fill(248, 247, 255);
    }

    rect(this.position.x, this.position.y, this.width, this.height);
  }

  collidesWith(agent) {
    const { 
      position: { x: cellPosX, y: cellPosY },
      positionBR: { x: cellPosXBR, y: cellPosYBR } 
    } = this;
    const { 
      position: { x: agentPosX, y: agentPosY }
    } = agent;

    const agentPosXBR = agentPosX + agent.width;
    const agentPosYBR = agentPosY + agent.height;

    if ((agentPosX < cellPosXBR && agentPosXBR > cellPosX) && 
      (agentPosY < cellPosYBR && agentPosYBR > cellPosY)) {
      this.reached = true;
      return true;
    }

    return false;
  }
}
