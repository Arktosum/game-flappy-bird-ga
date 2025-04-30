import Bird from "./bird";
import { Canvas } from "./canvas";

export default class Pipe {
    position: { x: number; y: number; };
    canvas: Canvas;
    width: number;
    topHeight: number;
    gapHeight: number;
    bottomHeight: number;
    passedBirds: Set<number>;
    constructor(x: number, y: number, canvas: Canvas) {
        this.position = { x, y };
        this.canvas = canvas;
        this.width = 150;
        this.topHeight = 100 + Math.random() * canvas.height / 2;
        this.gapHeight = 400;
        this.bottomHeight = this.canvas.height - (this.topHeight + this.gapHeight)
        this.passedBirds = new Set<number>();
    }
    hasPassed(bird: Bird) {
        if (bird.dead) return; // We don't care about dead birds
        if (this.passedBirds.has(bird.id)) return; // We don't care about birds that have already passed!
        if (bird.position.x > this.position.x + this.width / 2) {
            bird.passedPipe();
            this.passedBirds.add(bird.id);
        }
    }
    update(delta_time: number) {
        this.position.x -= 0.3 * delta_time;
    }
    draw() {
        this.canvas.drawRect(this.position.x, this.position.y, this.width, this.topHeight, { 'fillStyle': 'green' });
        this.canvas.drawRect(this.position.x, this.position.y + this.topHeight + this.gapHeight, this.width, this.bottomHeight, { 'fillStyle': 'green' });
    }

}


