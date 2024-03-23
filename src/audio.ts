import { generateReverb } from './generateReverb'
import { useAppState } from './stores/appStore'

export function createAudio() {
  const { actx, setOutput } = useAppState.getState()
  
  const out = new GainNode(actx, { gain: 0.5 })
  const reverbGain = new GainNode(actx, { gain: 0.5 })
  setOutput(out)
  
  const reverb = new ConvolverNode(actx);

  out.connect(reverb).connect(reverbGain).connect(actx.destination);
  out.connect(actx.destination);
  generateReverb(actx, { 
    fadeInTime: 0.1,
    decayTime: 5,
    lpFreqStart: 3000,
    lpFreqEnd: 200,
    numChannels: 1,
    sampleRate: actx.sampleRate,
  }, (buffer: AudioBuffer) => {
    reverb.buffer = buffer
  });
}