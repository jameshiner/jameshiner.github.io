class Ball {
  constructor(startCell, diameter, velocity) {
    const { position } = startCell;
    this.startCell = startCell;
    this.position = createVector(position.x + cellSize / 2, position.y + cellSize / 2);
    this.diameter = diameter;
    this.velocity = velocity;
    this.initialPosition = this.position.copy();
    this.initialVelocity = this.velocity.copy();
  }

  show() {
    const {
      diameter,
      position: { x, y },
    } = this;
    fill(0, 0, 255);
    ellipse(x, y, diameter, diameter);
  }

  move(level) {
    const {
      velocity: { x:vx, y:vy},
      position: { x, y },
      diameter
    } = this;
    const newX = x + vx + (vx > 0 ? diameter / 2 : -(diameter / 2));
    const newY = y + vy + (vy > 0 ? diameter / 2 : -(diameter / 2));
    const newCell = getCell(newX, newY);
    if (newCell.wall) {
      if (level == 1 || level == 2){
        this.velocity.x = -vx;
        this.velocity.y = -vy;
      } else if (level == 3){
        if (vx == 0) {          // vertical to horizontal
          this.velocity.x = -vy;
          this.velocity.y = -vx;
        } else if (vy == 0) {   // horizontal to vertical
          this.velocity.x = vy;
          this.velocity.y = vx;
        }
      }
    }
    this.position.x += vx;
    this.position.y += vy;
  }

  collidesWith(agent) {
    const { position: { x: ballPosX, y: ballPosY }, diameter } = this;
    const { position: { x: agentPosX, y: agentPosY }, height: agentHeight, width: agentWidth } = agent;
    const radiusSquared = (diameter / 2) ** 2;
  
    const newX1 = Math.sqrt(radiusSquared - (agentPosY - ballPosY) ** 2) + ballPosX;
    const newX2 = Math.sqrt(radiusSquared - (agentPosY + agentHeight - ballPosY) ** 2) + ballPosX;
  
    const newY1 = Math.sqrt(radiusSquared - (agentPosX - ballPosX) ** 2) + ballPosY;
    const newY2 = Math.sqrt(radiusSquared - (agentPosX + agent.width - ballPosX) ** 2) + ballPosY;
  
    if (
      (newX1 > agentPosX && newX1 < agentPosX + agentWidth) ||
      (newX2 > agentPosX && newX2 < agentPosX + agentWidth) ||
      (newY1 > agentPosY && newY1 < agentPosY + agentHeight) ||
      (newY2 > agentPosY && newY2 < agentPosY + agentHeight)
    ) {
      return true;
    }
    return false;
  }
}
