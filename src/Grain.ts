import { lerp, range } from './helpers'
import { useAppState } from './stores/appStore'
import { useGrainStore } from './stores/grainStore'

const MAX_GRAINS = 1024

export function createGrain(container: Element) {
  const grainState = useGrainStore.getState();
  const { buffer, reverseBuffer, canvas, actx, output, incGrains, decGrains, grains } = useAppState.getState();
  if (!buffer?.duration || !canvas || !output) return;

  if (grains >= MAX_GRAINS) return;
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

  // direction
  let speed = grainState.speed;
  if (Math.random() > grainState.direction) {
    speed = speed * -1;
  }
  
  // setup audio
  const src = new AudioBufferSourceNode(actx, { loop: true, playbackRate: Math.abs(speed) });
  const panner = new StereoPannerNode(actx, { pan });
  const gain = new GainNode(actx, { gain: 0 });
  
  if (speed < 0) {
    src.buffer = reverseBuffer;
    src.start(actx.currentTime, Math.max(0, range(revPos, 0, canvas.width, 0, buffer.duration)));
  } else {
    src.buffer = buffer;
    src.start(actx.currentTime, Math.max(0, range(pos, 0, canvas.width, 0, buffer.duration)));
  }

  src
    .connect(gain)
    .connect(panner)
    .connect(output);

  gain.gain.linearRampToValueAtTime(0.05, actx.currentTime + 0.03);
  gain.gain.setTargetAtTime(0, actx.currentTime + grainState.size / 2, grainState.size / 2);
  src.stop(actx.currentTime + grainState.size);
  
  // create grain element
  const grain = document.createElement('div');
  grain.classList.add('grain');
  grain.style.top = `${200 + (pan * 180)}px`;
  grain.style.left = `${pos}px`;
  container?.appendChild(grain);
  
  // animate grain element
  let rafID = 0;
  const startTime = performance.now();
  let currentPos = 0;

  function animateGrain() {
    if (!canvas) return

    rafID = requestAnimationFrame(animateGrain);
    currentPos += speed;

    if (performance.now() - startTime > (grainState.size * 1000)) {
      grain.remove();
      decGrains();
      cancelAnimationFrame(rafID);
      return;
    }

    let newPos = pos + currentPos;

    if (newPos < 0) {
      newPos = canvas.width;
    } else if (newPos > canvas.width) {
      newPos -= canvas.width;
    }

    grain.style.left = newPos + 'px';
  }

  animateGrain();
}
