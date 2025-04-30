
import Bird from './bird';
import { Canvas } from './canvas';
import { GeneticAlgorithm } from './genetic';
import Pipe from './pipe';
import './style.css'

const root = document.getElementById('root')!;
const canvas = new Canvas({ width: 1920, height: 1080, parent: root, backgroundColor: '#000000' });

document.addEventListener('keyup', (e) => {
  if (e.key == ' ') {
    BIRDS[0].jump();
  }
})

let PIPES: Pipe[] = [new Pipe(canvas.width, 0, canvas)]

function generatePipe() {
  const pipe = new Pipe(canvas.width, 0, canvas);
  PIPES.push(pipe);
}

let pipeGenerator = setInterval(generatePipe, 3 * 1000);

const POPULATION_SIZE = 200;
let geneticAlgorithm = new GeneticAlgorithm(POPULATION_SIZE, () => {
  return new Bird(200, canvas.height / 2, canvas)
})

let BIRDS = geneticAlgorithm.population as Bird[];
function isAllDead() {
  let count = 0;
  for (let bird of BIRDS) {
    count += bird.dead ? 1 : 0
  }
  return count == BIRDS.length;
}


function render(delta_time: number) {
  if (isAllDead()) {
    console.log('All dead!');
    geneticAlgorithm.algorithm();
    BIRDS = geneticAlgorithm.population as Bird[]
    PIPES = [new Pipe(canvas.width, 0, canvas)]
    clearInterval(pipeGenerator);
    pipeGenerator = setInterval(generatePipe, 3 * 1000);

    return;
  }
  canvas.clear('#000000');
  for (let bird of BIRDS) {
    bird.think(PIPES);
    bird.update(delta_time);
    bird.draw();
  }

  for (let pipe of PIPES) {
    for (let bird of BIRDS) {
      pipe.hasPassed(bird);
      bird.handleCollision(pipe);
    }
    pipe.update(delta_time);
    pipe.draw();
  }

}

let fps = 144;
let fixed_time = 1000 / fps;
let prevTime = Date.now();


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






