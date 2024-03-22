import { lerp, range } from './helpers'
import { useAppState } from './stores/appStore'
import { useGrainStore } from './stores/grainStore'

export function createGrain() {
  const container = document.querySelector('.grains');
  const grain = document.createElement('div');
  const grainState = useGrainStore.getState();
  const { buffer, reverseBuffer, canvas, actx, output, incGrains, decGrains } = useAppState.getState();
  incGrains();

  if (!buffer?.duration || !canvas || !output) return;

  const offset = lerp(-grainState.spray, grainState.spray, Math.random());
  const pan = lerp(-grainState.pan, grainState.pan, Math.random());
  const pos = grainState.position + offset;

  let rafID = 0;

  const src = new AudioBufferSourceNode(actx);
  
  const speed = grainState.speed;
  
  if (speed < 0) {
    src.buffer = reverseBuffer;
  } else {
    src.buffer = buffer;
  }
  src.playbackRate.value = Math.abs(speed);
  
  src.start(actx.currentTime, Math.max(0, range(pos, 0, canvas.width, 0, buffer.duration)));

  src.stop(actx.currentTime + grainState.size);
  const panner = new StereoPannerNode(actx, { pan });
  const gain = new GainNode(actx, { gain: 0 });
  gain.gain.linearRampToValueAtTime(0.1, actx.currentTime + 0.03);
  gain.gain.setTargetAtTime(0, actx.currentTime + grainState.size / 2, grainState.size / 2);
  src.connect(gain).connect(panner).connect(output);
  
  grain.style.width = '20px';
  grain.style.height = '10px';
  grain.style.backgroundColor = '#0af';
  grain.style.position = 'absolute';
  grain.style.top = `${200 + (pan * 190)}px`;
  grain.style.left = `${pos}px`;
  grain.style.pointerEvents = 'none';

  container?.appendChild(grain);

  let currentPos = 0;
  const startTime = performance.now();
  function animateGrain() {
    rafID = requestAnimationFrame(animateGrain);
    currentPos += grainState.speed;

    if (performance.now() - startTime > (grainState.size * 1000)) {
      grain.remove();
      decGrains();
      cancelAnimationFrame(rafID);
      return;
    }

    grain.style.left = pos + currentPos + 'px';
  }

  animateGrain();
}
