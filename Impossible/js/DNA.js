class DNA {
  constructor(genes) {
    this.genes = genes || [];
    this.vectors = [
      createVector(0, 0),
      createVector(0, 1),
      createVector(1, 1),
      createVector(1, 0),
      createVector(1, -1),
      createVector(0, -1),
      createVector(-1, -1),
      createVector(-1, 0),
      createVector(-1, 1),
    ];
    if (!genes) {
      for (let i = 0; i < lifeSpan/10; i++) {
        let newDirection = this.getRandomDirection()
        for (let j = 0; j < 10; j++) {
          this.genes.push(newDirection);
        } 
      }
    }
  }

  getRandomDirection() {
    return random(this.vectors).copy().mult(agentMoveSpeed);
  }

  crossover(mate) {
    const newGenes = [];
		const { genes } = this;
		const genesLength = genes.length;
		const mid = floor(random(genesLength));

		for (let i = 0; i < genesLength; i++) {
			if (i > mid) {
				newGenes.push(genes[i]);
			} else {
				newGenes.push(mate.genes[i]);
			}
		}
		return new DNA(newGenes);
  }
  mutate() {
    for (let i = 0; i < this.genes.length; i++) {
			if (random(1) < mutationRate) {
        // Just pick a new direction
				this.genes[i] = this.getRandomDirection();
			}
		}
  }

  addRandomMoves(x) {
    for (let i = 0; i < x/10; i++) {
      let newDirection = this.getRandomDirection()
        for (let j = 0; j < 10; j++) {
          this.genes.push(newDirection);
        } 
      // this.genes.push(this.getRandomDirection());
    }
  }
}
