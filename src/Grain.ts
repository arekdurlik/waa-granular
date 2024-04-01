import { notes } from './constants'
import { invlerp, lerp, range, secondsToTimeConstant } from './helpers'
import { useAppState } from './stores/appStore'
import { useGrainStore } from './stores/grainStore'

export function createGrain(container: Element, note: string) {
  const grainState = useGrainStore.getState();
  const { buffer, reverseBuffer, canvas, actx, master, incGrains, decGrains, grains, maxGrains } = useAppState.getState();
  if (!buffer?.duration || !canvas || !master) return;
  
  if (grains >= maxGrains) return;

  incGrains();

  // position + spray
  const spray = lerp(-grainState.spray, grainState.spray, Math.random());
  let pos = grainState.position + spray;
  let revPos = grainState.reversePosition + spray;

  // spray wrap around
  if (pos < 0) {
    pos = canvas.width + pos;
  } else if (pos > canvas.width) {
    pos -= canvas.width;
  }

  if (revPos < 0) {
    revPos = canvas.width + revPos;
  } else if (revPos > canvas.width) {
    revPos -= canvas.width;
  }

  // pan
  const pan = lerp(-grainState.pan, grainState.pan, Math.random());
  
  const twelvethRootOfTwo = Math.pow(2.0, 1.0 / 12.0);
  const noteMultiplier = Math.pow(twelvethRootOfTwo, notes.indexOf(note));

  // setup audio & connect nodes
  const src = new AudioBufferSourceNode(actx, { loop: true, playbackRate: Math.abs(grainState.pitch * noteMultiplier )});
  const panner = new StereoPannerNode(actx, { pan });
  const gain = new GainNode(actx, { gain: 0 });

  src
    .connect(gain)
    .connect(panner)
    .connect(master);

  // direction & speed
  // grainState.direction == 0 - all reverse 
  // grainState.direction == 1 - all forward
  let direction = grainState.pitch * noteMultiplier;
  if (Math.random() > grainState.direction) {
    direction = direction * -1;
  }
  
  if (direction < 0) {
    src.buffer = reverseBuffer;
    src.start(actx.currentTime, Math.max(0, range(revPos, 0, canvas.width, 0, buffer.duration)));
  } else {
    src.buffer = buffer;
    src.start(actx.currentTime, Math.max(0, range(pos, 0, canvas.width, 0, buffer.duration)));
  }

  // attack & decay
  let attack = grainState.attack;
  let decay = grainState.decay;

  const sum = attack + decay;

  if (sum > 1) {
    const scale = 1/sum;
    attack *= scale;
    decay *= scale;
  }

  attack *= grainState.size;
  decay *= grainState.size;
  
  const decayStart = actx.currentTime + grainState.size - decay;

  // stabilize combined volume of grains
  const volume = 1 / Math.sqrt(grains);

  gain.gain.setTargetAtTime(volume, actx.currentTime, attack); // attack
  gain.gain.setTargetAtTime(0, decayStart, secondsToTimeConstant(decay)); // decay

  src.stop(actx.currentTime + grainState.size + 0.2);
  
  // create grain element
  const grain = document.createElement('div');
  grain.classList.add('grain');
  grain.style.top = `${(canvas.height / 2 ) - 8 + (pan * ((canvas.height/ 2) - 10))}px`;
  grain.style.left = `${pos}px`;
  container.appendChild(grain);
  
  // animate grain element
  let rafID = 0;
  const startTime = performance.now();
  let currentOffset = - 10 // grain width/2;

  function animateGrain() {
    if (!canvas) return

    rafID = requestAnimationFrame(animateGrain);
    currentOffset += direction;

    if (performance.now() - startTime > (grainState.size * 1000)) {
      grain.remove();
      decGrains();
      cancelAnimationFrame(rafID);
      return;
    }

    let newPos = pos + currentOffset;

    if (newPos < 0) {
      newPos += canvas.width - 20;
    } else if (newPos > canvas.width) {
      newPos -= canvas.width;
    }

    grain.style.left = newPos + 'px';
    grain.style.opacity = `${invlerp(0, 1 / Math.sqrt(grains), gain.gain.value)}`;
  }

  animateGrain();
}
