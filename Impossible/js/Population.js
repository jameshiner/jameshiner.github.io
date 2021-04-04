class Population {
	constructor() {
		this.agents = [];
		this.matingPool = [];
		this.generation = 0;
		this.sumOfAllFitness = 0.0;
		this.generationBest;
		this.generationWorst;

		for (let i = 0; i < populationSize; i++) {
			this.agents.push(new Agent());
		}	
	}

	run() {
		let agent;
		for (let i = 0; i < populationSize; i++) {
			agent = this.agents[i];
			agent.update();
			agent.show();
		}

		if (dnaIndex === lifeSpan) {
			this.generation += 1;
			
			if (generationP) {
				generationP.html('Generation: ' + this.generation);
			}

			if (this.generation % incrementalLearningGeneration == 0) {
				lifeSpan += incrementalLearningRate;
				lifespanP.html('Lifespan: ' + lifeSpan);
			}

			dnaIndex = 0;
			this.evaluate()
			this.selection();
			resetLevel();
		}
	}
	
	evaluate() {
		let currentAgent;
		let maxFitness = 0;
		let minFitness;
		let sumFitness = 0;
		let avgFitness;
		let n;
		const { agents } = this;
		
		for(let i = 0; i < populationSize; i++) {
			currentAgent = agents[i];
			currentAgent.calculateFitness();
			sumFitness += currentAgent.fitness;
			if (!minFitness || minFitness > currentAgent.fitness) {
				minFitness = currentAgent.fitness;
				this.generationWorst = new Agent(false, currentAgent.dna);
				this.generationWorst.isWorst = true;
			}
			if (currentAgent.fitness > maxFitness) {
				maxFitness = currentAgent.fitness;
				this.generationBest = new Agent(false, currentAgent.dna);
				// console.log(maxFitness);
			}
		}
		this.generationBest.isBest = true;
		this.sumOfAllFitness = sumFitness;
		avgFitness = sumFitness / populationSize;
		
		if (maxFitnessP) {
			maxFitnessP.html('Max Fitness: ' + Math.round(maxFitness * 100) / 100);
		}
		if (minFitnessP) {
			minFitnessP.html('Min Fitness: ' + Math.round(minFitness * 100) / 100);
		}

		if (avgFitness != 0 && avgFitnessP) {
			avgFitnessP.html('Average Fitness: ' + Math.round(avgFitness * 100) / 100);
		}

		for (let i = 0; i < agents.length; i++) {
			this.agents[i].fitness /= maxFitness;
		}

		this.matingPool = [];
		for (let i = 0; i < agents.length; i++) {
			if (agents[i].fitness > cullPercentage) {
				n = agents[i].fitness * 100;
				n *= n;
				for (let j = 0; j < floor(n); j++) {
					this.matingPool.push(agents[i]);
				}
			}
		}
	}

	// getParent() {
	// 	var rand = random(this.sumOfAllFitness);
		
	// 		var runningSum = 0;

	// 		for (let i = 0; i < this.agents.length; i++) {
	// 			runningSum += this.agents[i].fitness;
	// 			if (runningSum > rand) {
	// 				return this.agents[i];
	// 			}
	// 		}
	// 		return null;
	// }

	selection() {
		// let newAgents = [];
		// let newAgent;

		// for (let i = 0; i < populationSize - 1; i++) {
		// 	newAgent = new Agent(false, this.getParent().dna)
		// 	if (newAgent.dna.genes.length < lifeSpan) {
		// 		newAgent.dna.addRandomMoves(incrementalLearningRate);
		// 	}
		// 	newAgent.dna.mutate();
		// 	newAgents.push(newAgent);
		// }
		// if (this.generationBest.dna.genes.length < lifeSpan) {
		// 	this.generationBest.dna.addRandomMoves(incrementalLearningRate);
		// }
		// newAgents.push(this.generationBest);
		// this.agents = newAgents;



		// use the mating pool to reset this.agents
		let newAgents = [];
		const { matingPool } = this;

		for (let i = 0; i < populationSize - 2; i++) {
			const mom = random(matingPool);
			const dad = random(matingPool);
			const { dna: momDna } = mom;
			const { dna: dadDna } = dad;
			const childDna = momDna.crossover(dadDna).mutate();
			newAgents.push(new Agent(false, childDna));
		}
		if (this.generationBest.dna.genes.length < lifeSpan) {
			this.generationBest.dna.addRandomMoves(incrementalLearningRate);
			this.generationWorst.dna.addRandomMoves(incrementalLearningRate);
		}
		newAgents.push(this.generationBest);
		newAgents.push(this.generationWorst);
		this.agents = newAgents;
	}
}