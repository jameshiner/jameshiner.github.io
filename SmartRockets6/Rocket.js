class Rocket {
  constructor(dna) {
    this.dna = dna || new DNA();
    this.position = createVector(canvasWidth / 2, canvasHeight);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.completeIndex = 0;
    this.crashIndex = 0;
    this.fitness;
    this.applyForce = (force) => {
      this.acceleration.add(force);
    };
  }

  update() {
    const d = dist(this.position.x, this.position.y, target.x, target.y);
    if (d < 10) {
      this.completeIndex = dnaIndex;
      this.position = target.copy();
    }

    // should pass in a list of obstacles to rocket maybe?
    if (!this.crashIndex) {
      if (
        // rocket hit outer wall
        this.position.x > canvasWidth ||
        this.position.x < 0 ||
        this.position.y > canvasHeight ||
        this.position.y < 0 ||
        // rocket hit obstacle
        (gameLevel === 1 &&
          this.position.x > obstacleX &&
          this.position.x < obstacleX + obstacle1Width &&
          this.position.y > obstacleY &&
          this.position.y < obstacleY + obstacleHeight) ||
        (gameLevel === 2 &&
          ((this.position.x > obstacle1X &&
            this.position.x < obstacle1X + obstacle2Width &&
            this.position.y > obstacle1Y &&
            this.position.y < obstacle1Y + obstacleHeight) ||
            (this.position.x > obstacle2X &&
              this.position.x < obstacle2X + obstacle2Width &&
              this.position.y > obstacle2Y &&
              this.position.y < obstacle2Y + obstacleHeight)))
      ) {
        this.crashIndex = dnaIndex;
      }
    }

    this.applyForce(this.dna.genes[dnaIndex]);
    if (!this.completeIndex && !this.crashIndex) {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      this.velocity.limit(4);
    }
    return this.crashIndex || this.completeIndex;
  }

  show() {
    push();
    noStroke();
    if (this.isBest) {
      fill(0, 255, 0, 150);
    } else {
      fill(255, 150);
    }
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());
    rectMode(CENTER);
    rect(0, 0, rocketHeight, rocketWidth);
    pop();
  }

  calcFitness() {
    const { x, y } = this.position;
    const toGoal = dist(x, y, target.x, target.y);
    const fromStart = dist(x, y, canvasWidth / 2, canvasHeight);
    const invToGoal = map(toGoal, 0, canvasWidth, canvasWidth, 0);
    const invHeight = map(y, 0, canvasHeight, canvasHeight, 0);
    let fitness = invToGoal * 6 + invHeight * 3 + fromStart * 2;
    const { completeIndex } = this;

    if (completeIndex) {
      fitness *= 10 + completeIndex * 3;
    }
    if (this.crashIndex) {
      fitness /= 10;
    }
    this.fitness = fitness;
    return fitness;
  }
}
