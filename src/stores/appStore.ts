import { create } from 'zustand'

interface State {
  actx: AudioContext,
  output: GainNode | null,
  grains: number,
  incGrains: () => void
  decGrains: () => void
  setOutput: (output: GainNode) => void
  buffer: AudioBuffer | null
  reverseBuffer: AudioBuffer | null
  setBuffer: (buffer: AudioBuffer) => void
  setReverseBuffer: (buffer: AudioBuffer) => void
  canvas: HTMLCanvasElement | null,
  setCanvas: (canvas: HTMLCanvasElement) => void
  ctx: CanvasRenderingContext2D | null,
  setCtx: (ctx: CanvasRenderingContext2D) => void
}

export const useAppState = create<State>((set, get) => ({
  actx: new AudioContext({
    latencyHint: 'interactive',
    sampleRate: 44100
  }),
  output: null,
  grains: 0,
  incGrains: () => set({ grains: get().grains + 1 }),
  decGrains: () => set({ grains: get().grains - 1 }),
  setOutput: (output) => set({ output }),
  buffer: null,
  reverseBuffer: null,
  setBuffer: (buffer) => set({ buffer }),
  setReverseBuffer: (reverseBuffer) => set({ reverseBuffer }),
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  ctx: null,
  setCtx: (ctx) => set({ ctx }),
}))