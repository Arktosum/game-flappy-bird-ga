import { Canvas } from "./canvas";
import { GeneticAgent } from "./genetic";
import Matrix from "./matrix";
import { LayerType, NeuralNetwork } from "./nn";
import Pipe from "./pipe";



export default class Bird implements GeneticAgent {
    position: { x: number; y: number; };
    radius: any;
    id: number;
    canvas: Canvas;
    velocity: { x: number; y: number; };
    acceleration: { x: number; y: number; };
    dead: boolean;
    color: string;
    score: number;
    survivalTimePoint: number;
    passedPipePoint: number;
    lastJumped: number;
    jumpTimeout_ms: number;
    geneticExpression: NeuralNetwork
    constructor(x: number, y: number, canvas: Canvas) {
        this.position = { x, y }
        this.radius = 30;
        this.canvas = canvas;
        this.velocity = { x: 0, y: 0 }
        this.acceleration = { x: 0, y: 0.001 };
        this.dead = false;
        this.color = 'yellow'
        this.id = Math.random() + Date.now();
        this.survivalTimePoint = 0.01;
        this.passedPipePoint = 30;
        this.score = 0;
        this.lastJumped = Date.now()
        this.jumpTimeout_ms = 500; // ms

        this.geneticExpression = new NeuralNetwork();

        this.geneticExpression.addLayer(LayerType.DENSE, 4, 5);
        this.geneticExpression.addLayer(LayerType.RELU);
        this.geneticExpression.addLayer(LayerType.DENSE, 5, 5);
        this.geneticExpression.addLayer(LayerType.RELU);
        this.geneticExpression.addLayer(LayerType.DENSE, 5, 1);
        this.geneticExpression.addLayer(LayerType.SIGMOID);
    }
    think(pipes: Pipe[]) {
        let closestPipe = pipes[0];
        let closestDistance = Infinity;
        for (let pipe of pipes) {
            let distance = (pipe.position.x + pipe.width) - (this.position.x + this.radius);
            if (distance < 0) continue;
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPipe = pipe;
            }
        }
        closestPipe.color = 'gray';
        let inputArray = [this.position.y / this.canvas.height, this.velocity.y / this.canvas.height, closestPipe.topHeight / this.canvas.height, (closestPipe.topHeight + closestPipe.gapHeight) / this.canvas.height]
        let inputVector = Matrix.fromArray(inputArray);

        let outputVector = this.geneticExpression.forward(inputVector);
        let outputResult = outputVector.sum();
        if (outputResult > 0.5) {
            this.jump();
        }
    }
    getFitness() {
        return this.score;
    }
    clone() {
        let new_bird = new Bird(200, this.canvas.height / 2, this.canvas);
        new_bird.geneticExpression = this.geneticExpression.clone();
        return new_bird;
    }
    cross(other: Bird) {
        let new_bird = new Bird(200, this.canvas.height / 2, this.canvas);
        new_bird.geneticExpression = this.geneticExpression.cross(other.geneticExpression);
        return new_bird;
    }
    mutate(mutationRate: number) {
        this.geneticExpression.mutate(mutationRate);
    }
    kill() {
        this.dead = true;
        this.color = '#ffffff00'
    }
    passedPipe() {
        this.score += this.passedPipePoint;
    }
    update(deltaTime: number) {
        if (this.dead) return;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

        this.score += this.survivalTimePoint;
        if ((this.position.y - this.radius) < 0 || (this.position.y + this.radius) > this.canvas.height) {
            this.kill();
            this.score -= 20;
        }
    }
    draw() {
        this.canvas.drawCircle(this.position.x, this.position.y, this.radius, { fillStyle: this.color })
    }
    jump() {
        if (this.dead) return;
        const currentTime = Date.now();
        const difference = currentTime - this.lastJumped;
        if (difference > this.jumpTimeout_ms) {
            this.velocity.y = -0.4;
        }
    }
    isColliding(pipe: Pipe) {
        if (this.dead) return;
        let top_pipe_collision = rectanglePointCollision(pipe.position.x, pipe.position.y, pipe.width, pipe.topHeight, this.position.x + this.radius, this.position.y);
        let bottom_pipe_collision = rectanglePointCollision(pipe.position.x, pipe.position.y + pipe.topHeight + pipe.gapHeight, pipe.width, pipe.bottomHeight, this.position.x + this.radius, this.position.y);
        let top_pipe_inside_center = rectanglePointCollision(pipe.position.x, pipe.position.y, pipe.width, pipe.topHeight, this.position.x, this.position.y - this.radius);
        let bottom_pipe_inside_center = rectanglePointCollision(pipe.position.x, pipe.position.y + pipe.topHeight + pipe.gapHeight, pipe.width, pipe.bottomHeight, this.position.x, this.position.y + this.radius);

        return top_pipe_collision || bottom_pipe_collision || top_pipe_inside_center || bottom_pipe_inside_center;
    }

    handleCollision(pipe: Pipe) {
        if (this.dead) return;
        if (this.isColliding(pipe)) {
            this.kill();
            this.score -= 50;
        }
    }
}

function rectanglePointCollision(rect_x: number, rect_y: number, width: number, height: number, point_x: number, point_y: number) {
    let x_limit = (rect_x < point_x) && (point_x < (rect_x + width))
    let y_limit = (rect_y < point_y) && (point_y < (rect_y + height));
    return x_limit && y_limit;
}