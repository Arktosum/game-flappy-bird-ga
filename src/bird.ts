import { Canvas } from "./canvas";
import { Brain, GeneticAgent } from "./genetic";
import Matrix from "./matrix";
import Pipe from "./pipe";

function rectangularCollision(rect_x: number, rect_y: number, width: number, height: number, point_x: number, point_y: number) {

    let x_limit = (rect_x <= point_x) && (point_x <= (rect_x + width));
    let y_limit = (rect_y <= point_y) && (point_y <= (rect_y + height));
    return x_limit && y_limit
}



export default class Bird implements GeneticAgent {
    position: { x: number; y: number; };
    velocity: { x: number; y: number; };
    canvas: Canvas;
    radius: number;
    gravity: { x: number; y: number; };
    lastJumped: number;
    jumpTimeout: number;
    dead: boolean;
    score: number;
    id: number;
    geneticExpression: Brain;
    constructor(radius: number, canvas: Canvas) {
        this.id = Math.random() * 1000000000000
        this.canvas = canvas
        this.radius = radius
        this.position = { x: 100 + radius, y: this.canvas.height / 2 };
        this.velocity = { x: 0, y: 0 };
        this.gravity = { x: 0, y: 0.001 };
        this.lastJumped = Date.now();
        this.jumpTimeout = 250;
        this.dead = false;
        this.score = 0;

        this.geneticExpression = new Brain();

    }
    getFitness() {
        return this.score;
    }
    update(deltaTime: number) {
        if (this.dead) return;
        this.velocity.x += this.gravity.x * deltaTime;
        this.velocity.y += this.gravity.y * deltaTime;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
    think() {
        let input_array = [this.position.y / this.canvas.height];
        let input_vector = Matrix.fromArray(input_array);
        let output_vector = this.geneticExpression.forward(input_vector);
        let output = output_vector.data[0][0];
        if (output >= 0.5) {
            this.jump();
        }
    }
    jump() {
        if (this.dead) return;
        let this_time = Date.now();
        if ((this_time - this.lastJumped) >= this.jumpTimeout) {
            this.velocity.y = -0.3;
            this.lastJumped = this_time;
        }
    }
    draw() {
        if (!this.dead) {
            this.canvas.drawCircle(this.position.x, this.position.y, this.radius, { fillStyle: 'yellow' })
        }
        else {
            this.canvas.drawCircle(this.position.x, this.position.y, this.radius, { fillStyle: 'red' })
        }
    }
    isColliding(pipe: Pipe) {
        let top_pipe = rectangularCollision(pipe.position.x, pipe.position.y, pipe.width, pipe.top_height, this.position.x + this.radius, this.position.y);
        let bottom_height = pipe.height - (pipe.top_height + pipe.gap)
        let bottom_pipe = rectangularCollision(pipe.position.x, pipe.top_height + pipe.gap, pipe.width, bottom_height, this.position.x + this.radius, this.position.y);

        let top_pipe_inside = rectangularCollision(pipe.position.x, pipe.position.y, pipe.width, pipe.top_height, this.position.x + this.radius, this.position.y - this.radius);
        let bottom_pipe_inside = rectangularCollision(pipe.position.x, pipe.top_height + pipe.gap, pipe.width, bottom_height, this.position.x + this.radius, this.position.y + this.radius);

        return top_pipe || bottom_pipe || top_pipe_inside || bottom_pipe_inside;
    }
    handleCollision(pipe: Pipe) {
        if ((this.position.y - this.radius) <= 0 || (this.position.y + this.radius) >= this.canvas.height) {
            // out of bounds
            this.dead = true;
        }
        let is_colliding = this.isColliding(pipe);
        if (is_colliding) {
            this.dead = true;
        }
    }
}