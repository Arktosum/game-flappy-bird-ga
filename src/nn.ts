import Matrix from "./matrix"


export class Layer {
    forward(x: Matrix) { return x }
}

export class Dense implements Layer {
    weights: Matrix;
    constructor(n_inputs: number, n_outputs: number) {
        this.weights = new Matrix(n_outputs, n_inputs);
    }
    forward(x: Matrix) {
        return this.weights.matmul(x);
    }
}

export class ReLU implements Layer {
    static relu(x: number) {
        return Math.max(0, x);
    }
    forward(x: Matrix) {
        let output = x.copy()
        output.apply((value) => ReLU.relu(value));
        return output;
    }
}


export class Sigmoid implements Layer {
    static sigmoid(x: number) {
        return (1 / (1 + Math.exp(-x)));
    }
    forward(x: Matrix) {
        let output = x.copy()
        output.apply((value) => Sigmoid.sigmoid(value));
        return output;
    }
}




export class Softmax implements Layer {

    // Compute the softmax of a column vector matrix
    static softmax(x: Matrix): Matrix {
        if (x.numCols !== 1) {
            throw new Error('Softmax can only be applied to column vectors');
        }
        const maxVal = x.max();
        const expMatrix = new Matrix(x.numRows, 1, false);
        expMatrix.apply((_, i) => Math.exp(x.data[i][0] - maxVal));
        const sumExp = expMatrix.sum();
        return expMatrix.divideValue(sumExp);
    }
    forward(x: Matrix) {
        return Softmax.softmax(x);
    }
    // Return the index of the maximum value in a column vector
    static argmax(x: Matrix): number {
        if (x.numCols !== 1) {
            throw new Error('Argmax can only be applied to column vectors');
        }
        let maxIndex = 0;
        let maxValue = x.data[0][0];
        for (let i = 1; i < x.numRows; i++) {
            if (x.data[i][0] > maxValue) {
                maxValue = x.data[i][0];
                maxIndex = i;
            }
        }
        return maxIndex;
    }
}