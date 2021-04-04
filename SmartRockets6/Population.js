class Population {
  constructor(
    populationSize,
    lifespan,
    incLearn,
    incLearnRate,
    incLearnGen,
    mutationRate,
    gameLifeSpan,
  ) {
    this.populationSize = populationSize;
    this.rockets = [];
    this.lifespan = lifespan;
    this.generation = 1;
    this.incLearn = incLearn;
    this.incLearnRate = incLearnRate;
    this.incLearnGen = incLearnGen;
    this.lifespan = lifespan;
    this.mutationRate = mutationRate;
    this.gameLifeSpan = gameLifeSpan;
    for (let i = 0; i < this.populationSize; i += 1) {
      this.rockets[i] = new Rocket();
    }
    if (debug) {
      console.log('population created with', populationSize, 'rockets');
    }
  }

  run(dnaIndex) {
    const {
      populationSize,
      rockets,
      incLearnGen,
      incLearn,
      incLearnRate,
      gameLifeSpan,
    } = this;
    let finished = 0;
    const oldLifespan = this.lifespan;
    for (let i = 0; i < populationSize; i += 1) {
      finished += rockets[i].update() ? 1 : 0;
      rockets[i].show();
    }
    const curDnaIndex = dnaIndex + 1;
    if (curDnaIndex === this.lifespan || finished === populationSize) {
      this.generation += 1;
      generationP.html(`Generation: ${this.generation}`);
      if (incLearn && this.generation % incLearnGen === 0) {
        this.lifespan =
          oldLifespan < gameLifeSpan
            ? oldLifespan + incLearnRate
            : gameLifeSpan;
        lifespanP.html(`Lifespan: ${this.lifespan}`);
        if (debug) {
          console.log('----generation', this.generation);
          console.log(
            'updating lifespan from',
            oldLifespan,
            'to',
            this.lifespan,
          );
        }
      }
      this.evaulate();
      this.selection();
      return 0;
    }
    return curDnaIndex;
  }

  evaulate() {
    this.matingPool = [];
    const { rockets } = this;
    let maxFitness = 0;
    let avgFitness = 0;
    let bestRocket;
    let fitness;
    let normalizedFitness;

    for (let i = 0; i < rockets.length; i += 1) {
      const rocket = rockets[i];
      fitness = rocket.calcFitness();
      avgFitness += fitness;
      if (fitness > maxFitness) {
        bestRocket = rocket;
        maxFitness = fitness;
      }
    }

    this.bestRocket = bestRocket;
    this.bestRocket.isBest = true;
    if (this.bestRocket.completeIndex) {
      fastestP.html(`Fastest finish: ${this.bestRocket.completeIndex}`);
    }

    avgFitness /= this.populationSize;
    maxFitnessP.html('Max Fitness: ' + Math.round(maxFitness * 100) / 100);
    avgFitnessP.html('Average Fitness: ' + Math.round(avgFitness * 100) / 100);

    for (let i = 0; i < rockets.length; i += 1) {
      const rocket = rockets[i];
      normalizedFitness = (rocket.fitness / maxFitness) * 100;
      for (let j = 0; j < normalizedFitness; j += 1) {
        this.matingPool.push(rocket);
      }
    }
    if (debug) {
      console.log(`${this.matingPool.length} rockets added to mating pool`);
    }
  }

  selection() {
    const {
      matingPool,
      incLearn,
      bestRocket: { dna },
    } = this;
    const bestRocketDNA = dna;
    const newRockets = [];
    let mom;
    let dad;
    let childDna;

    if (incLearn) {
      bestRocketDNA.addIncrementalGenes();
    }

    const bestRocket = new Rocket(bestRocketDNA);
    bestRocket.isBest = true;

    for (let i = 0; i < this.populationSize - 1; i += 1) {
      mom = random(matingPool);
      dad = random(matingPool);
      childDna = mom.dna.crossover(dad.dna);
      childDna.mutate(this.mutationRate);
      if (incLearn) {
        childDna.addIncrementalGenes();
      }
      newRockets[i] = new Rocket(childDna);
    }
    this.rockets = newRockets;
    this.rockets.push(bestRocket);
  }
}
