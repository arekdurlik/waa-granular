/* eslint-disable react-hooks/exhaustive-deps */
import { MouseEvent, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { lerp, range } from './helpers'
import { useAppState } from './stores/appStore'
import { createGrain } from './Grain'
import { useGrainStore } from './stores/grainStore'

export function Display() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const display = useRef<HTMLDivElement | null>(null);
  const seeker = useRef<HTMLDivElement | null>(null);
  const pointerDown = useRef(false);
  const ctx = useAppState(state => state.ctx);
  const buffer = useAppState(state => state.buffer);
  const setCanvas = useAppState(state => state.setCanvas);
  const setCtx = useAppState(state => state.setCtx);
  const setPosition = useGrainStore(state => state.setPosition);
  const setReversePosition = useGrainStore(state => state.setReversePosition);
  const spray = useGrainStore(state => state.spray);
  const pan = useGrainStore(state => state.pan);
  const seek = useGrainStore(state => state.seek);
  const density = useGrainStore(state => state.density);
  const seekerOverflowLeft = useRef<HTMLDivElement | null>(null);
  const seekerOverflowRight = useRef<HTMLDivElement | null>(null);
  const sprayRef = useRef<HTMLDivElement | null>(null);
  const intervalID = useRef(0);
  const timeoutID = useRef(0);
  const seekIntervalID = useRef(0);
  const clear = useRef(false);
  
  // setup canvas & get context
  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = window.innerWidth - 1;
    canvas.current.height = 400;

    setCanvas(canvas.current);
    setCtx(canvas.current.getContext('2d')!);
  }, [canvas, setCanvas, setCtx]);

  // init seeker in the middle
  useEffect(() => {
    if (!display.current) return;
    
    const { left, width } = display.current.getBoundingClientRect();
    
    const displayX = lerp(left, left + width, 0.5);
    setSeeker(displayX, displayX);
  }, [])

  // seek
  useEffect(() => {
    clearInterval(seekIntervalID.current);

    if (seek === 0) return;

    seekIntervalID.current = setInterval(() => {
      if (!canvas.current) return

      const { position, reversePosition, seek } = useGrainStore.getState()
      let newPosition = position + seek
      let newReversePosition = reversePosition - seek

      if (newPosition > canvas.current.width) {
        newPosition = 0
        newReversePosition = canvas.current.width
      } else if (newPosition < 0) {
        newPosition = canvas.current.width
        newReversePosition = 0
      }

      setSeeker(newPosition, newReversePosition);
    }, 10)
  }, [seek])

  // create grain loop
  useEffect(() => {
    clearInterval(intervalID.current);
    clearTimeout(timeoutID.current);
    clear.current = true;
    
    if (!buffer) return;
    const container = document.querySelector('.grains');

    setTimeout(() => {
      intervalID.current = setInterval(loop, 1000 - density);
      clear.current = false;
    })
    
    function loop() {
      if (clear.current || !buffer) {
        clearInterval(intervalID.current);
        clear.current = false;
        return;
      }

      const activeNotes = useAppState.getState().activeNotes;
      

      activeNotes.forEach((note, i) => {
        const timeout = ((1000 - density) / activeNotes.length) * i;

        timeoutID.current = setTimeout(() => {
          createGrain(container!, note);
        }, timeout);
      })
    }

    loop();
  }, [buffer, density]);

  // draw waveform
  useEffect(() => {
    if (!buffer || !canvas.current) return;

    function drawBuffer(width: number, height: number, buffer: AudioBuffer) {
      if (!canvas.current || !ctx) return;
  
      const data = buffer.getChannelData(0);
      const step = Math.ceil( data.length / width );
      const amp = Math.round(height / 2);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = 'rgb(130, 180, 209)';
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        
        for (let j = 0; j < step; j++) {
          const datum = data[(i*step)+j]; 
          if (datum < min) {
            min = datum;
          }

          if (datum > max) {
            max = datum;
          }
        }
  
        ctx.fillRect(i, (1+min)*amp, 1, (max-min)*amp);
      }
    }

    drawBuffer(canvas.current.width, canvas.current.height, buffer);
  }, [buffer, ctx]);

  function handlePointerDown(e: MouseEvent) {
    pointerDown.current = true;

    handlePointerMove(e);
  }

  function handlePointerUp() {
    pointerDown.current = false;
  }
  
  function handlePointerMove(e: MouseEvent) {
    if (!pointerDown.current || !display.current) return;
    
    const x = e.clientX;
    
    const { left, width } = display.current.getBoundingClientRect();
    
    const displayX = range(x, 0, window.innerWidth, left, left + width);
    const reverseX = range(x, window.innerWidth, 0, left, left + width);
    setSeeker(displayX, reverseX);
  }

  function setSeeker(x: number, rx: number) {
    if (!seeker.current || !seekerOverflowLeft.current || !seekerOverflowRight.current || !canvas.current) return;

    seeker.current.style.transform = `translateX(${x}px)`;
    seekerOverflowLeft.current.style.transform = `translateX(${x - canvas.current.width}px)`;
    seekerOverflowRight.current.style.transform = `translateX(${x + canvas.current.width}px)`;
    setPosition(x);
    setReversePosition(rx);
  }

  return (
    <Wrapper 
      ref={display} 
      onPointerDown={handlePointerDown} 
      onPointerUp={handlePointerUp} 
      onPointerMove={handlePointerMove}
    >
      <Grains className='grains'>
      </Grains>
      <Seeker ref={seeker}>
        <Line/>
        <Spray 
          ref={sprayRef} 
          width={spray} 
          height={pan}
        />
      </Seeker>
      <Seeker ref={seekerOverflowLeft}>
        <Spray 
          ref={sprayRef} 
          width={spray} 
          height={pan}
        />
      </Seeker>
      <Seeker ref={seekerOverflowRight}>
        <Spray 
          ref={sprayRef} 
          width={spray} 
          height={pan}
        />
      </Seeker>
      <Waveform ref={canvas}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: relative;
width: 100%;
max-height: 50%;
background-color: black;
`
const Waveform = styled.canvas`
position: relative;
width: 100%;
height: 100%;
`
const Seeker = styled.div`
position: absolute;
width: 0.05vw;
height: 100%;
transform: translateX(400px);
z-index: 2;
pointer-events: none;
display: flex;
align-items: center;
`
const Line = styled.div`
position: absolute;
width: 1px;
height: 100%;
background-color: #fff;
z-index: 2;
pointer-events: none;
`
const Spray = styled.div<{ width: number, height: number }>`
${({ width }) => width && `
  width: ${width * 2}px;
  left: -${width}px;
`}

${({ height }) => `height: calc(${height * 100}% + ${20 - (20 * height)}px);`}
background-color: #008bdb7a;
position: absolute;
`

const Grains = styled.div`
position: absolute;
width: 100%;
height: 100%;
z-index: 4;
`