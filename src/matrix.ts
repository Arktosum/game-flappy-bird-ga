export default class Matrix {
    numRows: number; // Number of rows in the matrix
    numCols: number; // Number of columns in the matrix
    data: number[][]; // 2D array storing matrix elements

    constructor(numRows: number, numCols: number, randomize = true, fill = 0.0) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.data = Array.from({ length: this.numRows }, () => Array(this.numCols).fill(fill));
        if (randomize) {
            this.apply(() => (Math.random() * 2 - 1));
        }
    }

    // Print the shape and contents of the matrix
    print() {
        console.log(`Shape: (${this.numRows}, ${this.numCols})`);
        console.table(this.data);
    }

    // Apply a callback function to each element in the matrix
    apply(callback: (x: number, rowIndex: number, colIndex: number) => number) {
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                this.data[i][j] = callback(this.data[i][j], i, j);
            }
        }
    }

    // Check if two matrices have the same shape
    static isSameShape(A: Matrix, B: Matrix) {
        return A.numRows === B.numRows && A.numCols === B.numCols;
    }

    // Check if matrix A can be multiplied by matrix B
    static isMultipliable(A: Matrix, B: Matrix) {
        return A.numCols === B.numRows;
    }

    // Return a new matrix that is the element-wise sum of this and another matrix
    add(other: Matrix) {
        if (!Matrix.isSameShape(this, other)) {
            throw new Error('Invalid shapes for matrix addition');
        }
        const result = new Matrix(this.numRows, this.numCols, false);
        result.apply((_, i, j) => this.data[i][j] + other.data[i][j]);
        return result;
    }

    // Return a new matrix with a value added to each element
    addValue(value: number) {
        const result = new Matrix(this.numRows, this.numCols, false);
        result.apply((_, i, j) => this.data[i][j] + value);
        return result;
    }

    // Return a new matrix with each element multiplied by a value
    multiplyValue(value: number) {
        const result = new Matrix(this.numRows, this.numCols, false);
        result.apply((_, i, j) => this.data[i][j] * value);
        return result;
    }

    // Return a new matrix with each element divided by a value
    divideValue(value: number) {
        if (value === 0) {
            throw new Error('Division by zero is not allowed');
        }
        return this.multiplyValue(1 / value);
    }

    // Perform matrix multiplication with another matrix
    matmul(other: Matrix) {
        if (!Matrix.isMultipliable(this, other)) {
            throw new Error('Invalid shapes for matrix multiplication');
        }
        const result = new Matrix(this.numRows, other.numCols, false);
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < other.numCols; j++) {
                let sum = 0;
                for (let k = 0; k < this.numCols; k++) {
                    sum += this.data[i][k] * other.data[k][j];
                }
                result.data[i][j] = sum;
            }
        }
        return result;
    }

    // Return a deep copy of the matrix
    copy() {
        const result = new Matrix(this.numRows, this.numCols, false);
        result.data = this.data.map(row => row.slice());
        return result;
    }

    // Alias for copy method
    clone() {
        return this.copy();
    }

    // Return the transpose of the matrix
    transpose() {
        const result = new Matrix(this.numCols, this.numRows, false);
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                result.data[j][i] = this.data[i][j];
            }
        }
        return result;
    }

    // Create a column vector from a 1D array
    static fromArray(data: number[]) {
        const result = new Matrix(data.length, 1, false);
        for (let i = 0; i < data.length; i++) {
            result.data[i][0] = data[i];
        }
        return result;
    }
    static toArray(matrix: Matrix) {

        let data: number[] = [];

        matrix.apply((x) => {
            data.push(x);
            return x;
        })
        return data;
    }

    // Return the maximum value in the matrix
    max() {
        let maxVal = -Infinity;
        for (const row of this.data) {
            for (const val of row) {
                if (val > maxVal) maxVal = val;
            }
        }
        return maxVal;
    }

    // Return the sum of all elements in the matrix
    sum() {
        let total = 0;
        for (const row of this.data) {
            for (const val of row) {
                total += val;
            }
        }
        return total;
    }

    // Create a square identity matrix of given size, useful in linear algebra operations
    static identity(size: number): Matrix {
        const result = new Matrix(size, size, false);
        for (let i = 0; i < size; i++) {
            result.data[i][i] = 1;
        }
        return result;
    }

} 
