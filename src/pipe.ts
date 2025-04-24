import Bird from "./bird";
import { Canvas } from "./canvas";

export default class Pipe {
    position: { x: number; y: number; };
    velocity: { x: number; y: number; };
    canvas: Canvas;
    width: number;
    height: number;
    top_height: number;
    gap: number;
    is_crossed: Record<number, boolean>;
    constructor(x: number, y: number, canvas: Canvas) {
        this.canvas = canvas
        this.position = { x, y };
        this.velocity = { x: -0.1, y: 0 };
        this.width = 70;
        this.height = this.canvas.height;
        this.top_height = 100 + Math.random() * 300;
        this.gap = 150;
        this.is_crossed = {};
    }
    update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;

    }
    hasCrossed(bird: Bird) {
        if (!(bird.id in this.is_crossed)) {
            this.is_crossed[bird.id] = false;
        }
        if (((bird.position.x + bird.radius) > (this.position.x + this.width)) && !this.is_crossed[bird.id]) {
            bird.score++;
            this.is_crossed[bird.id] = true;
        }
    }
    draw() {
        this.canvas.drawRect(this.position.x, 0, this.width, this.top_height, { fillStyle: 'green' });
        this.canvas.drawRect(this.position.x, this.top_height + this.gap, this.width, this.canvas.height, { fillStyle: 'green' });
    }
}