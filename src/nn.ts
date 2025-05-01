import Matrix from "./matrix";


export enum LayerType {
    DENSE,
    RELU,
    SIGMOID
}
class Layer {
    type: LayerType;
    constructor() {
        this.type = LayerType.DENSE;
    }
    forward(x: Matrix) {
        return x;
    }
    mutate(mutationRate: number) { }
    clone() {
        return this as Layer;
    }
    cross(other: Layer) {
        return this as Layer;
    }
}

class Dense implements Layer {
    weights: Matrix;
    biases: Matrix;
    n_inputs: number;
    n_outputs: number;
    type: LayerType;
    constructor(n_inputs: number, n_outputs: number) {
        this.type = LayerType.DENSE
        this.n_inputs = n_inputs;
        this.n_outputs = n_outputs;
        this.weights = new Matrix(n_outputs, n_inputs, true);
        this.biases = new Matrix(n_outputs, 1, true);
    }
    mutate(mutationRate: number) {
        this.weights.apply((x) => {
            let randomValue = Math.random();
            if (randomValue > mutationRate) {
                return x + Math.random() * 2 - 1;
            }
            return x;
        })

        this.biases.apply((x) => {
            let randomValue = Math.random();
            if (randomValue > mutationRate) {
                return x + Math.random() * 2 - 1;
            }
            return x;
        })
    }
    cross(other: Dense) {
        let new_cross_weights = this.weights.clone();
        new_cross_weights.apply((_, i, j) => this.weights.data[i][j] * 0.5 + other.weights.data[i][j] * 0.5);

        let new_cross_biases = this.biases.clone();
        new_cross_biases.apply((_, i, j) => this.biases.data[i][j] * 0.5 + other.biases.data[i][j] * 0.5);

        let new_layer = new Dense(this.n_inputs, this.n_outputs);
        new_layer.weights = new_cross_weights;
        new_layer.biases = new_cross_biases;
        return new_layer;

    }
    clone() {
        let new_layer = new Dense(this.n_inputs, this.n_outputs);
        new_layer.weights = this.weights.clone();
        new_layer.biases = this.biases.clone();
        return new_layer;
    }
    forward(x: Matrix) {
        return this.weights.matmul(x).add(this.biases);
    }
}



class ReLU implements Layer {
    type: LayerType;
    constructor() {
        this.type = LayerType.RELU
    }
    mutate(mutationRate: number) {
        // Do nothing
    }
    cross() {
        return this;
    }
    clone() {
        return this; // Don't really need clone
    }
    forward(x: Matrix) {
        let clone = x.clone();
        clone.apply((val) => this.relu(val));
        return clone;
    }
    relu(x: number) {
        return Math.max(0, x);
    }
}

class Sigmoid implements Layer {
    type: LayerType;
    constructor() {
        this.type = LayerType.SIGMOID
    }
    clone() {
        return this; // Don't really need clone
    }
    cross() {
        return this;
    }
    mutate(mutationRate: number) {
        // Do nothing
    }
    forward(x: Matrix) {
        let clone = x.clone();
        clone.apply((val) => this.sigmoid(val));
        return clone;
    }
    sigmoid(x: number) {
        return 1 / (1 + Math.exp(-x));
    }
}



export class NeuralNetwork {

    layers: Layer[];
    constructor() {
        this.layers = []
    }
    addLayer(layer_type: LayerType, n_inputs: number = 0, n_outputs: number = 0) {
        if (layer_type == LayerType.DENSE) {
            let layer = new Dense(n_inputs, n_outputs);
            this.layers.push(layer);
        }
        else if (layer_type == LayerType.RELU) {
            let layer = new ReLU();
            this.layers.push(layer);
        }
        else if (layer_type == LayerType.SIGMOID) {
            let layer = new Sigmoid();
            this.layers.push(layer);
        }
        else {
            throw new Error("Layer not implemented");
        }
    }
    mutate(mutationRate: number) {
        for (let layer of this.layers) {
            layer.mutate(mutationRate);
        }
    }
    clone() {
        let new_network = new NeuralNetwork();
        for (let layer of this.layers) {
            let new_layer = layer.clone();
            new_network.layers.push(new_layer);
        }
        return new_network;
    }
    cross(other: NeuralNetwork): NeuralNetwork {
        let new_network = new NeuralNetwork();
        for (let i = 0; i < this.layers.length; i++) {
            let cross_layer = this.layers[i].cross(other.layers[i]);
            new_network.layers.push(cross_layer);
        }
        return new_network;
    }
    forward(x: Matrix) {
        let output = x;
        for (let layer of this.layers) {
            output = layer.forward(output);
        }
        return output;
    }
}