class Vehicle {
  constructor({
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
  }) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.size = size;
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.hpDegen = hpDegen;
    this.goodHpInc = goodHpInc;
    this.badHpDec = badHpDec;
    this.mutationRate = mutationRate;
    this.hp = hpStart;

    this.dna = dna || [
      random(-2, 2),
      random(-2, 2),
      random(0, 100),
      random(0, 100),
    ];

    if (dna !== undefined) {
      if (random(1) < mutationRate / 100) this.dna[0] += random(-0.3, 0.3);
      if (random(1) < mutationRate / 100) this.dna[1] += random(-0.3, 0.3);
      if (random(1) < mutationRate / 100) this.dna[2] += random(-20, 20);
      if (random(1) < mutationRate / 100) this.dna[3] += random(-20, 20);
    }
  }

  update() {
    this.hp -= this.hpDegen;

    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  seek(target) {
    // A vector pointing from the location to the target
    const desired = p5.Vector.sub(target, this.position);

    // Scale to maximum speed
    desired.setMag(this.maxSpeed);

    // Steering = Desired minus velocity
    const steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce); // Limit to maximum steering force

    // this.applyForce(steer);
    return steer;
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    const { size, dna, velocity, position, hp } = this;
    const angle = velocity.heading() + PI / 2;

    push();
    translate(position.x, position.y);
    rotate(angle);

    if (debug) {
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -dna[0] * 20);
      ellipse(0, 0, dna[2] * 2);
      strokeWeight(2);
      stroke(255, 0, 0);
      line(0, 0, 0, -dna[1] * 20);
      ellipse(0, 0, dna[3] * 2);
    }
    const red = color(255, 0, 0);
    const white = color(255);
    // const green = color(0, 255, 0);
    // const blue = color(0, 0, 255);
    // const black = color(0);

    const clr = lerpColor(red, white, hp);
    fill(clr);
    stroke(clr);
    strokeWeight(1);
    beginShape();
    vertex(0, -size * 2);
    vertex(-size, size * 2);
    vertex(size, size * 2);
    endShape(CLOSE);
    pop();
  }

  eat(list, hpChange, perception) {
    let record = Infinity;
    let closest = null;
    for (let i = list.length - 1; i >= 0; i -= 1) {
      const d = this.position.dist(list[i]);
      if (d < this.maxSpeed) {
        list.splice(i, 1);
        this.hp += hpChange;
      } else if (d < record && d < perception) {
        record = d;
        closest = list[i];
      }
    }
    if (closest != null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  behaviors(good, bad) {
    const { goodHpInc, badHpDec, dna } = this;
    const steerG = this.eat(good, goodHpInc, dna[2]);
    const steerB = this.eat(bad, badHpDec, dna[3]);

    steerG.mult(dna[0]);
    steerB.mult(dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  isDead() {
    return this.hp <= 0;
  }

  boundries() {
    const {
      maxSpeed,
      maxForce,
      velocity,
      width,
      height,
      position: { x, y },
    } = this;
    const { x: vx, y: vy } = velocity;
    const d = 25;
    let desired = null;
    if (x < d) {
      desired = createVector(maxSpeed, vy);
    } else if (x > width - d) {
      desired = createVector(-maxSpeed, vy);
    }

    if (y < d) {
      desired = createVector(vx, maxSpeed);
    } else if (y > height - d) {
      desired = createVector(vx, -maxSpeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(maxSpeed);
      const steer = p5.Vector.sub(desired, velocity);
      steer.limit(maxForce);
      this.applyForce(steer);
    }
  }
}
