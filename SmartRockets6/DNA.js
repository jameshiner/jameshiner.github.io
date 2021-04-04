class DNA {
  constructor(genes) {
    this.genes = genes || [];

    if (!this.genes.length) {
      for (var i = 0; i < lifespan; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxForce);
      }
    }
  }

  crossover(mate) {
    const { genes } = this;
    let newGenes = [];
    let mid = floor(random(genes.length));

    genes.forEach((gene, index) => {
      newGenes[index] = index > mid ? this.genes[index] : mate.genes[index];
    });
    return new DNA(newGenes);
  }

  mutate(rate) {
    let gene;
    this.genes = this.genes.map((oldGene) => {
      if (random(1) < rate) {
        gene = p5.Vector.random2D();
        gene.setMag(maxForce);
        return gene;
      }
      return oldGene;
    });
  }

  addIncrementalGenes() {
    let genes = this.genes;
    const numGenes = this.genes.length;
    const missingGenes = population.lifespan - numGenes;
    if (missingGenes > 0) {
      for (let i = numGenes; i < numGenes + missingGenes; i += 1) {
        genes[i] = p5.Vector.random2D();
        genes[i].setMag(maxForce);
      }
    }
  }
}
