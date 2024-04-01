import { create } from 'zustand'

interface State {
  actx: AudioContext
  master: GainNode | null
  setMaster: (master: GainNode) => void
  grains: number,
  incGrains: () => number
  decGrains: () => number
  maxGrains: number
  setMaxGrains: (grainLimit: number) => void
  buffer: AudioBuffer | null
  reverseBuffer: AudioBuffer | null
  setBuffer: (buffer: AudioBuffer) => void
  setReverseBuffer: (buffer: AudioBuffer) => void
  canvas: HTMLCanvasElement | null,
  setCanvas: (canvas: HTMLCanvasElement) => void
  ctx: CanvasRenderingContext2D | null,
  setCtx: (ctx: CanvasRenderingContext2D) => void
  activeNotes: string[],
  activateNote: (key: string) => void
  deactivateNote: (key: string) => void
}

export const useAppState = create<State>((set, get) => ({
  actx: new AudioContext({
    latencyHint: 'interactive',
    sampleRate: 44100
  }),
  master: null,
  setMaster: (master) => set({ master }),
  grains: 0,
  incGrains: () => {
    const grains = get().grains + 1;
    set({ grains });
    return grains;
  },
  decGrains: () => {
    const grains = get().grains - 1;
    set({ grains });
    return grains;
  },
  maxGrains: 1024,
  setMaxGrains: (maxGrains) => set({ maxGrains }),
  buffer: null,
  reverseBuffer: null,
  setBuffer: (buffer) => set({ buffer }),
  setReverseBuffer: (reverseBuffer) => set({ reverseBuffer }),
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  ctx: null,
  setCtx: (ctx) => set({ ctx }),
  activeNotes: ['A'],
  activateNote: (note) => {
    const notes = get().activeNotes;
    const newNotes = [...notes, note];
    set({ activeNotes: newNotes });
  },
  deactivateNote: (note) => {
    const newNotes = [...get().activeNotes];
    newNotes.splice(newNotes.findIndex(n => n === note), 1);
    set({ activeNotes: newNotes });
  }
}))