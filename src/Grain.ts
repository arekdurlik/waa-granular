import { lerp, range, secondsToTimeConstant } from './helpers'
import { useAppState } from './stores/appStore'
import { useGrainStore } from './stores/grainStore'

const MAX_GRAINS = 1024

export function createGrain(container: Element) {
  const grainState = useGrainStore.getState();
  const { buffer, reverseBuffer, canvas, actx, master, incGrains, decGrains } = useAppState.getState();
  if (!buffer?.duration || !canvas || !master) return;
  
  const grains = incGrains();

  if (grains >= MAX_GRAINS) {
     decGrains();
     return;
  }

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
  
  // setup audio & connect nodes
  const src = new AudioBufferSourceNode(actx, { loop: true, playbackRate: Math.abs(grainState.pitch) });
  const panner = new StereoPannerNode(actx, { pan });
  const gain = new GainNode(actx, { gain: 0 });

  src
    .connect(gain)
    .connect(panner)
    .connect(master);

  // direction & speed
  // direction == 0 - all reverse 
  // direction == 1 - all forward
  let direction = grainState.pitch;
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
  const attack = Math.min(grainState.attack, 1 - grainState.decay) * grainState.size
  const decay = Math.min(grainState.decay, 1 - grainState.attack) * grainState.size
  const decayStart = actx.currentTime + grainState.size - decay

  gain.gain.setTargetAtTime(1, actx.currentTime, attack); // attack
  gain.gain.setTargetAtTime(0, decayStart, secondsToTimeConstant(decay)); // decay

  src.stop(actx.currentTime + grainState.size);
  
  // create grain element
  const grain = document.createElement('div');
  grain.classList.add('grain');
  grain.style.top = `${(canvas.height / 2 ) - 8 + (pan * ((canvas.height/ 2) - 10))}px`;
  grain.style.left = `${pos}px`;
  container.appendChild(grain);
  
  // animate grain element
  let rafID = 0;
  const startTime = performance.now();
  let currentOffset = 0;

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
      newPos = canvas.width;
    } else if (newPos > canvas.width) {
      newPos -= canvas.width;
    }

    grain.style.left = newPos + 'px';
    grain.style.opacity = `${gain.gain.value}`;
  }

  animateGrain();
}
