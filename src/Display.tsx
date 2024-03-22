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
  const { ctx, buffer, setCanvas, setCtx } = useAppState();
  const { setPosition, spray, density } = useGrainStore();
  const intervalID = useRef(0);
  const clear = useRef(false);
  
  useEffect(() => {
    if (!canvas.current) return;
    canvas.current.width = window.innerWidth - 1;
    canvas.current.height = 400;

    setCanvas(canvas.current);
    setCtx(canvas.current.getContext('2d')!);
  }, [canvas, setCanvas, setCtx])

  // init seeker in the middle
  useEffect(() => {
    if (!display.current) return;
    
    const { left, width } = display.current.getBoundingClientRect();
    
    const displayX = lerp(left, left + width, 0.5);
    setSeeker(displayX);
  }, [])

  useEffect(() => {
    if (!buffer) return;
    clearInterval(intervalID.current);
    clear.current = true;

    setTimeout(() => {
      intervalID.current = setInterval(loop, 1000 - density);
    clear.current = false;
    })
    function loop() {
      if (clear.current || !buffer) {
        clearInterval(intervalID.current);
        return;
      }

      createGrain();
    }

    loop();
  }, [buffer, density]);


  useEffect(() => {
    if (!buffer || !canvas.current) return;

    function drawBuffer(width: number, height: number, buffer: AudioBuffer) {
      if (!canvas.current || !ctx) return;
  
      const data = buffer.getChannelData(0);
      const step = Math.ceil( data.length / width );
      const amp = Math.round(height / 2);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#a9e8ff';
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        
        for (let j = 0; j < step; j++) {
          const datum = data[(i*step)+j]; 
          if (datum < min)
            min = datum;
          if (datum > max)
            max = datum;
        }
  
        ctx.fillRect(i, (1+min)*amp, 1, (max-min)*amp);
      }
    }

    drawBuffer(canvas.current.width, canvas.current.height, buffer);
  }, [buffer, ctx]);

  function handlePointerDown(e: MouseEvent) {
    pointerDown.current = true;

    moveSeeker(e);
  }

  function handlePointerUp() {
    pointerDown.current = false;
  }

  function setSeeker(x: number) {
    if (!seeker.current) return;
    
    seeker.current.style.transform = `translateX(${x}px)`;
    setPosition(x);
  }
  
  function moveSeeker(e: MouseEvent) {
    if (!pointerDown.current || !display.current) return;
    
    const x = e.clientX;
    
    const { left, width } = display.current.getBoundingClientRect();
    
    const displayX = range(x, 0, window.innerWidth, left, left + width);
    setSeeker(displayX);
  }

  return (
    <Wrapper ref={display} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={moveSeeker}>
      <Grains className='grains'>
      </Grains>
      <Seeker ref={seeker}>
        <Line/>
        <Spray width={spray}/>
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
`
const Line = styled.div`
position: absolute;
width: 0.05vw;
height: 100%;
background-color: white;
z-index: 2;
`
const Spray = styled.div<{ width: number }>`
${({ width }) => `
  width: ${width * 2}px;
  left: -${width}px;
`}
height: 100%;
background-color: #0095cf77;
position: absolute;
`
const Grains = styled.div`
position: absolute;
width: 100%;
height: 100%;
z-index: 1;
`