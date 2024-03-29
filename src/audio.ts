import { useAppState } from './stores/appStore'

export function createAudio() {
  const { actx, setMaster } = useAppState.getState();
  
  const master = new GainNode(actx);
  setMaster(master);

  master.connect(actx.destination);
}