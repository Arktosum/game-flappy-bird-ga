import Matrix from "./matrix";
import { Dense, Layer, ReLU, Softmax } from "./nn";





export class Brain {
    layers: Layer[];
    constructor() {
        this.layers = [
            new Dense(6 * 9, 10),
            new ReLU(),
            new Dense(10, 10),
            new ReLU(),
            new Dense(10, (6 * 2) + 1), // 6 colors and 2 orientations + 1 no move state
            new Softmax()
        ]
    }
    forward(x: Matrix) {
        let output = x;
        for (let layer of this.layers) {
            output = layer.forward(output);
        }
        return output;
    }
}




/* 
Genetic Expression - Brain - Fixed Topology NN
Fitness Function

Initialization 

Population
Selection
Crossover
Mutation*
*/


export interface GeneticAgent {
    geneticExpression: Brain
    getFitness(): number
}

function randomSample(pdf: number[]) {
    let runningSum = 0;
    const random_number = Math.random()
    for (let i = 0; i < pdf.length; i++) {
        runningSum += pdf[i]; // Cumulative probability
        if (random_number < runningSum) return i;
    }
    return -1; // Something went wrong. pdf is not normalized ( does not sum to give 1)
}




export class GeneticAlgorithm {
    population_size: number;
    population: GeneticAgent[]
    constructor(population_size: number, initializeAgent: () => GeneticAgent) {
        this.population = [];
        this.population_size = population_size;
        for (let i = 0; i < this.population_size; i++) {
            let agent = initializeAgent();
            this.population.push(agent);
        }
    }
    selection() {
        let K = Math.floor(this.population_size * 0.01);
        let all_fitness_scores = this.population.map((item) => item.getFitness());
        // Keep best k
        let best_k_brains = this.find_best_k(K, all_fitness_scores);
        let fitness_probabilities = Matrix.toArray(Softmax.softmax(Matrix.fromArray(all_fitness_scores)));
        // elitism + roulette wheel selection

        let selected_population = [...best_k_brains];
        for (let i = 0; i < this.population_size - K; i++) {
            let sample = randomSample(fitness_probabilities);
            selected_population.push([all_fitness_scores[sample], sample])
        }
        return selected_population;
    };
    find_best_k(k: number, all_fitness_scores: number[]) {
        let fitness_index: [number, number][] = [];
        all_fitness_scores.forEach((value, i) => {
            fitness_index.push([value, i]);
        })
        let sorted_fitness_index = fitness_index.sort((a, b) => -(a[0] - b[0]));

        return sorted_fitness_index.slice(k);

    }

}


