
import Bird from './bird';
import { Canvas } from './canvas';
import Pipe from './pipe';
import './style.css'

const root = document.getElementById('root')!;
const canvas = new Canvas({ width: 1920, height: 1080, parent: root, backgroundColor: '#000000' });

document.addEventListener('keyup', (e) => {
  if (e.key == ' ') {
    bird.jump();
  }
})

let PIPES: Pipe[] = [new Pipe(canvas.width, 0, canvas)]

setInterval(() => {
  const pipe = new Pipe(canvas.width, 0, canvas);
  PIPES.push(pipe);
}, 3 * 1000)

let fps = 100;
let fixed_time = 1000 / fps;
let prevTime = Date.now();

const bird = new Bird(200, canvas.height / 2, canvas);
function render(delta_time: number) {
  canvas.clear('#000000');
  bird.draw();
  bird.update(delta_time);
  console.log(bird.score)
  for (let pipe of PIPES) {
    bird.handleCollision(pipe);
    pipe.hasPassed(bird);
    pipe.update(delta_time);
    pipe.draw();
  }
}
function animate() {
  let currentTime = Date.now()
  let delta_time = currentTime - prevTime
  if (delta_time >= fixed_time) {
    render(delta_time);
    prevTime = currentTime;
  }
  requestAnimationFrame(animate)
}



requestAnimationFrame(animate);



