import { NeuralNetwork } from "./nn";

export class GeneticAgent {
    geneticExpression!: NeuralNetwork;
    getFitness(): number { return 0 }
    clone(): GeneticAgent { return this }
    mutate(mutationRate: number): void { }
    cross(other: GeneticAgent): GeneticAgent { return this }
}


function sampleProbability(probabilities: number[]) {
    // Make sure probabilities add up to 1!
    let randomNumber = Math.random(); // Between 0 and 1
    let runningProbability = 0;
    for (let i = 0; i < probabilities.length; i++) {
        runningProbability += probabilities[i];
        if (runningProbability > randomNumber) {
            return i;
        }
    }
    return -1; // Should not come here!
}



export class GeneticAlgorithm {
    population_size: number;
    population: GeneticAgent[];
    initializeAgent: () => GeneticAgent;
    generation: number;
    mutationRate: number;
    constructor(population_size: number, intializeAgent: () => GeneticAgent) {
        this.population_size = population_size
        this.population = []
        this.initializeAgent = intializeAgent;
        for (let i = 0; i < this.population_size; i++) {
            let agent = intializeAgent();
            this.population.push(agent);
        }
        this.generation = 0;
        this.mutationRate = 1e-4;
    }
    algorithm() {

        let all_fitnesses = this.population.map(item => item.getFitness());
        const ELITIST_AGENT_COUNT = 10;
        let elitist_agents = this.findKBestAgents(ELITIST_AGENT_COUNT);
        let averageFitness = 0;
        let minFitness = Infinity;
        let maxFitness = -Infinity;
        let fitnessSum = 0;
        for (let fitness of all_fitnesses) {
            fitnessSum += fitness;
            averageFitness += fitness / all_fitnesses.length;
            minFitness = Math.min(minFitness, fitness)
            maxFitness = Math.max(maxFitness, fitness)
        }

        let fitness_probabilities = all_fitnesses.map((item) => item / fitnessSum);
        let new_population: GeneticAgent[] = [...elitist_agents]
        for (let i = 0; i < this.population_size - ELITIST_AGENT_COUNT; i++) {
            let sampleIndex = sampleProbability(fitness_probabilities);
            let parent_1 = this.population[sampleIndex];

            let sampleIndex2 = sampleProbability(fitness_probabilities);
            let parent_2 = this.population[sampleIndex2];
            let crossed_baby = parent_1.cross(parent_2);
            crossed_baby.mutate(this.mutationRate)
            new_population.push(crossed_baby);
        }

        this.population = new_population;
        this.generation++;

        console.log(`------------ Generation - ${this.generation} ----------------`)
        console.log(`Best Fitness : ${maxFitness}`);
        console.log(`Average Fitness : ${averageFitness}`);
        console.log(`Worst Fitness : ${minFitness}`);
        console.log("---------------------------------------------")
    }
    findKBestAgents(K: number) {
        let fitness_index = this.population.map((item) => [item.getFitness(), item]) as [number, GeneticAgent][];
        let sorted_fitness_index = fitness_index.sort((a, b) => b[0] - a[0]);

        let best_agents = []
        for (let i = 0; i < K; i++) {
            let agent = sorted_fitness_index[i][1];
            let agent_clone = agent.clone();
            best_agents.push(agent_clone);
        }
        return best_agents;
    }
}