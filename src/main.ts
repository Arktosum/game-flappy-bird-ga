import Bird from "./bird";
import { Canvas } from "./canvas";
import { GeneticAlgorithm } from "./genetic";
import Pipe from "./pipe";
import './style.css'

const root = document.getElementById('root')!;
const canvas = new Canvas({ width: 800, height: 600, parent: root, backgroundColor: '#000000' });

// const img = new Image();

// img.src = 'test-2.jpg'; // Replace with your image path


// document.body.addEventListener('keyup', (e) => {
//   let key = e.key;
//   console.log('jump');
//   if (key == ' ') {
//     bird.jump();
//   }
// })

let pipes: Pipe[] = [];
let pipe = new Pipe(canvas.width, 0, canvas);
pipes.push(pipe)
setInterval(() => {
  if (pipes.length < 3) {
    let pipe = new Pipe(canvas.width, 0, canvas);
    pipes.push(pipe);
  }
  else {
    pipes.splice(0, 1);
    let pipe = new Pipe(canvas.width, 0, canvas);
    pipes.push(pipe);
  }
}, 3 * 1000)



const POPULATION_SIZE = 1000;

let genetic_algorithm = new GeneticAlgorithm(POPULATION_SIZE, () => {
  return new Bird(20, canvas);
})



let fps = 100;
let fixed_time = 1000 / fps;
let prevTime = Date.now();


let all_died = false;

function is_all_dead() {
  if (all_died) return;
  let count = 0;
  for (let bird of genetic_algorithm.population as Bird[]) {
    if (bird.dead) {
      count++;
    }
  }
  if (count != POPULATION_SIZE) return;
  console.log("All dead!");
  const selected = genetic_algorithm.selection();
  console.log(selected)
  all_died = true;
}
function render(delta_time: number) {
  is_all_dead();
  canvas.clear('#000000');
  // canvas.getContext().drawImage(img, bird.position.x - 150, bird.position.y - 150, 300, 300);

  for (let pipe of pipes) {
    for (let bird of genetic_algorithm.population as Bird[]) {
      if (!bird.dead) bird.score += 0.01; // Bird is still alive!
      bird.handleCollision(pipe);
      pipe.hasCrossed(bird);
      bird.think();
      bird.draw();
      bird.update(delta_time);
    }
    pipe.draw();
    pipe.update(delta_time);

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



