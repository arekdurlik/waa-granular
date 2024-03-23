import { lerp, range } from './helpers'
import { useAppState } from './stores/appStore'
import { useGrainStore } from './stores/grainStore'

export function createGrain() {
  const container = document.querySelector('.grains');
  const grain = document.createElement('div');
  const grainState = useGrainStore.getState();
  const { buffer, reverseBuffer, canvas, actx, output, incGrains, decGrains, grains } = useAppState.getState();
  if (grains >= 1024) return;
  incGrains();

  if (!buffer?.duration || !canvas || !output) return;

  const offset = lerp(-grainState.spray, grainState.spray, Math.random());
  const pan = lerp(-grainState.pan, grainState.pan, Math.random());
  let pos = grainState.position + offset;
  let revPos = grainState.reversePosition + offset;

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

  let rafID = 0;

  const src = new AudioBufferSourceNode(actx, { loop: true });
  
  let speed = grainState.speed;

  if (Math.random() > 0.5) {
    speed = speed * -1;
  }


  if (speed < 0) {
    src.buffer = reverseBuffer;
    src.start(actx.currentTime, Math.max(0, range(revPos, 0, canvas.width, 0, buffer.duration)));
  } else {
    src.buffer = buffer;
    src.start(actx.currentTime, Math.max(0, range(pos, 0, canvas.width, 0, buffer.duration)));
  }
  src.playbackRate.value = Math.abs(speed);
  

  src.stop(actx.currentTime + grainState.size);
  const panner = new StereoPannerNode(actx, { pan });
  const gain = new GainNode(actx, { gain: 0 });
  gain.gain.linearRampToValueAtTime(0.4, actx.currentTime + 0.03);
  gain.gain.setTargetAtTime(0, actx.currentTime + grainState.size / 2, grainState.size / 2);
  src.connect(gain).connect(panner).connect(output);
  
  grain.style.width = '20px';
  grain.style.height = '20px';
  grain.style.backgroundColor = '#0cf';
  grain.style.position = 'absolute';
  grain.style.top = `${200 + (pan * 180)}px`;
  grain.style.left = `${pos}px`;
  grain.style.pointerEvents = 'none';

  container?.appendChild(grain);

  let currentPos = 0;
  const startTime = performance.now();

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
