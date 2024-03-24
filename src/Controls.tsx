import styled from 'styled-components'
import { useGrainStore } from './stores/grainStore'
import { useAppState } from './stores/appStore'

export function Controls() {
  const { canvas, grains } = useAppState()
  const { spray, setSpray, speed, setSpeed, direction, setDirection, pan, setPan, size, setSize, density, setDensity, seek, setSeek } = useGrainStore()
  const sprayMax = (canvas?.width ?? 1) / 2

  return <Wrapper>
    <div>
      Grains: {grains}
    </div>
    <Slider>
      <span>Grain density:</span>
      <input type='range' min={0.01} max={1000} step={0.01} value={density} onChange={e => setDensity(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Grain size:</span>
      <input type='range' min={0.04} max={3} step={0.01} value={size} onChange={e => setSize(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Spray:</span>
      <input type='range' min={0} max={sprayMax} step={0.1} value={spray} onChange={e => setSpray(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Speed:</span>
      <input type='range' min={-1} max={2} step={0.01} value={speed} onChange={e => setSpeed(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Direction:</span>
      <input type='range' min={0} max={1} step={0.01} value={direction} onChange={e => setDirection(Number(e.target.value))}/>
    </Slider>
    <div>
      <span>Seek:</span>
      <input type='range' min={-3} max={3} step={0.001} value={seek} onChange={e => setSeek(Number(e.target.value))}/>
    </div>
    <Slider>
      <span>Pan:</span>
      <input type='range' min={0} max={1} step={0.01} value={pan} onChange={e => setPan(Number(e.target.value))}/>
    </Slider>
</Wrapper>
}

const Wrapper = styled.div`
margin: 10px;
color: white;
display: flex;
flex-direction: column;
gap: 10px;
`

const Slider = styled.div`
display: flex;
align-items: flex-start;
justify-content: flex-start;
flex-direction: column;
gap: 5px;
`