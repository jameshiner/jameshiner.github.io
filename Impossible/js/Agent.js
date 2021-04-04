class Agent {
  constructor(human, dna) {
    const { x, y } = { ...startingCell.position };
    this.startPosition = createVector(x + 6, y + 6);
    this.position = this.startPosition.copy();
    this.human = human || false;
    this.height = cellSize / 2;
    this.width = cellSize / 2;
    this.dead = false;
    this.dna = !human ? dna || new DNA() : null;
    // this.cells = [...cells]; // Clone of cells
    this.fitness = 0;
    this.moveCount = 0;
    this.goalReached = false; 
    this.isBest = false;
    this.isWorst = false;
    this.distances = [];
    this.lastPosition = this.startPosition.copy();
    this.deathIndex = null;
  }

  show() {
    const { dead, position, height, width, isBest, isWorst } = this;
    
      strokeWeight(3);
      stroke(127, 0, 0);
      if (isBest) {
        fill(0);
      } else if (isWorst) {
        fill(255,255,0);
      } else if (dead) {
        fill(100);
      } else {
        fill(255, 0, 0);
      }
      rect(position.x, position.y, height, width);
  }

  moveHuman(key) {
    const {
      position: { x, y },
    } = this;
    let left = false;
    let down = false;
    let right = false;
    let up = false;
    let leftWall = false;
    let downWall = false;
    let rightWall = false;
    let upWall = false;

    if (keyIsDown(RIGHT_ARROW) && keyIsDown(UP_ARROW)) {
      up = true;
      right = true;
    } else if (keyIsDown(RIGHT_ARROW) && keyIsDown(DOWN_ARROW)) {
      down = true;
      right = true;
    } else if (keyIsDown(LEFT_ARROW) && keyIsDown(UP_ARROW)) {
      up = true;
      left = true;
    } else if (keyIsDown(LEFT_ARROW) && keyIsDown(DOWN_ARROW)) {
      down = true;
      left = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      right = true;
    } else if (keyIsDown(LEFT_ARROW)) {
      left = true;
    } else if (keyIsDown(DOWN_ARROW)) {
      down = true;
    } else if (keyIsDown(UP_ARROW)) {
      up = true;
    }

    if (left || down || right || up) {
      upWall = this.humanMovingIntoWall(x, y - agentMoveSpeed, 'up');
      rightWall = this.humanMovingIntoWall(x + agentMoveSpeed, y, 'right');
      leftWall = this.humanMovingIntoWall(x - agentMoveSpeed, y, 'left');
      downWall = this.humanMovingIntoWall(x, y - agentMoveSpeed, 'down');

      if (up && !upWall) {
        this.position.y -= agentMoveSpeed;
      }
      if (right && !rightWall) {
        this.position.x += agentMoveSpeed;
      }
      if (left && !leftWall) {
        this.position.x -= agentMoveSpeed;
      }
      if (down && !downWall) {
        this.position.y += agentMoveSpeed;
      }

      if (coins.length) {
        for (let i = 0; i < coins.length; i++) {
          let coin = coins[i];

          if (coin.collidesWith(this) && !coin.collected) {
            coinsCollected += 1;
            coin.collected = true;
          }
        }
      }
    }
  }

  humanMovingIntoWall(x, y, direction) {
    const { width, height } = this;
    let cell;
    let cell2;
    if (direction === 'right') {
      cell = getCell(x + width, y);
      cell2 = getCell(x + width, y + height);
    }
    if (direction === 'left') {
      cell = getCell(x, y);
      cell2 = getCell(x, y + height);
    }
    if (direction === 'up') {
      cell = getCell(x, y);
      cell2 = getCell(x + width, y);
    }
    if (direction === 'down') {
      cell = getCell(x, y + height + 5);
      cell2 = getCell(x + width, y + height + 5);
    }
    return (cell && cell.wall) || (cell2 && cell2.wall);
  };



  checkDeath() {
    for (let i = 0; i < balls.length; i++) {
      if (balls[i].collidesWith(this)) {
        this.dead = true;
        this.deathIndex = dnaIndex;
        return true;
      }
    }
    return false;
  }

  // checkCellReached(checkGoal) {
  //   const { cells } = this;

  //   // remove if wall?

  //   for (let y = 0; y < cells.length; y++) {
  //     const cols = cells[y];

  //     for (let x = 0; x < cols.length; x++) {
  //       const cell = cols[x];

  //       if (cell.collidesWith(this)) {
  //         cell.reached = true;

  //         if (checkGoal && cell.goal) {
  //           this.goalReached = true;
  //         }
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  checkAICollision(walls, newPos) {
    const { height, width} = this;
    const topLeftX = walls ? newPos.x : this.position.x;
    const topLeftY = walls ? newPos.y : this.position.y;
    const topRightX = topLeftX + width;
    const topRightY = topLeftY;
    const bottomLeftX = topLeftX;
    const bottomLeftY = topLeftY + height;
    const bottomRightX = topRightX;
    const bottomRightY = bottomLeftY;
    if (walls) {
      return getCell(topLeftX, topLeftY).wall ||
        getCell(topRightX, topRightY).wall ||
        getCell(bottomLeftX, bottomLeftY).wall ||
        getCell(bottomRightX, bottomRightY).wall
    }
    const goalReached = (getCell(topLeftX, topLeftY).goal ||
      getCell(topRightX, topRightY).goal ||
      getCell(bottomLeftX, bottomLeftY).goal ||
      getCell(bottomRightX, bottomRightY).goal) && 
      (coinsNeeded ? coinsCollected === coinsNeeded : true);
      
    this.goalReached = goalReached;
    return goalReached;
  }

  checkGoalReached() {
    return this.checkAICollision();
  }

  update() {
    // check collision, only change position if allowed
    const gene = this.dna.genes[dnaIndex];
    const newPos = this.position.copy().add(gene);
    let distance;

    this.checkDeath();
    this.checkGoalReached();
      
    if (!this.dead && !this.goalReached && !this.checkAICollision(true, newPos)) {
      this.position.add(this.dna.genes[dnaIndex]);
      if (dnaIndex % 20 === 0) {
        distance = dist(this.lastPosition.x, this.lastPosition.y, this.position.x, this.position.y);
        this.lastPosition = this.position.copy()
        if (!this.dead) {
          this.distances.push(distance);
        }
      }
    }
  }

  resetPosition() {
    this.position = this.startPosition;
  }

  calculateFitness() {
    const {position: {x: posX, y: posY }} = this;
    let bestFitness = 0;
    let newFitness;
    let averageDistance;
    for (let i = 0; i < goals.length; i++) {
      const { position: { x: goalX, y: goalY }} = goals[i];

      const distance = dist(posX, posY, goalX, goalY);
      newFitness = 1/16 + 1000000 / (distance**2)
      // newFitness = map(distance, 0, 1000, 1000, 0)*2;

      // averageDistance = this.distances.reduce((acc, c) => acc + c, 0)/this.distances.length
      
      // newFitness *= averageDistance;
      // if (this.dead) {
      //   newFitness *= 0.9;
      // }
      if (this.goalReached) {
        newFitness *= 10;
      }
      
      if (!bestFitness || newFitness > bestFitness) {
        bestFitness = newFitness;
      }
    }

    this.fitness = bestFitness ** 2;
  }
  
}
