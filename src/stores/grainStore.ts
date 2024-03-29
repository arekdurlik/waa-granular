import { create } from 'zustand'

interface State {
  position: number,
  reversePosition: number,
  size: number
  pitch: number,
  direction: number,
  seek: number,
  spray: number,
  pan: number,
  density: number,
  attack: number,
  decay: number
  
  setPosition: (position: number) => void
  setReversePosition: (reversePosition: number) => void
  setSize: (size: number) => void
  setPitch: (pitch: number) => void
  setDirection: (direction: number) => void
  setSeek: (seek: number) => void
  setSpray: (spray: number) => void
  setPan: (pan: number) => void
  setDensity: (density: number) => void
  setAttack: (attack: number) => void
  setDecay: (decay: number) => void
}

export const useGrainStore = create<State>((set) => ({
  position: 0,
  reversePosition: 0,
  size: 0.5,
  pitch: 1,
  direction: 1,
  seek: 0,
  spray: 100,
  pan: 1,
  density: 950,
  attack: 0.25,
  decay: 0.25,

  setPosition: (position) => set({ position }),
  setReversePosition: (reversePosition) => set({ reversePosition }),
  setSize: (size) => set({ size }),
  setPitch: (pitch) => set({ pitch }),
  setDirection: (direction) => set({ direction }),
  setSeek: (seek) => set({ seek }),
  setSpray: (spray) => set({ spray }),
  setPan: (pan) => set({ pan }),
  setDensity: (density) => set({ density }),
  setAttack: (attack) => set({ attack }),
  setDecay: (decay) => set({ decay })
}))