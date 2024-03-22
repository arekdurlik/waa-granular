import styled from 'styled-components'
import { useGrainStore } from './stores/grainStore'
import { useAppState } from './stores/appStore'

export function Controls() {
  const { canvas, grains } = useAppState()
  const { spray, setSpray, speed, setSpeed, pan, setPan, size, setSize, density, setDensity } = useGrainStore()
  const sprayMax = (canvas?.width ?? 1) / 2

  return <Wrapper>
    <div>
      Grains: {grains}
    </div>
    <div>
      Grain density:
      <input type='range' min={0.01} max={1000} step={0.01} value={density} onChange={e => setDensity(Number(e.target.value))}/>
    </div>
    <div>
      Grain size:
      <input type='range' min={0.04} max={3} step={0.01} value={size} onChange={e => setSize(Number(e.target.value))}/>
    </div>
    <div>
      Spray:
      <input type='range' min={0} max={sprayMax} step={0.1} value={spray} onChange={e => setSpray(Number(e.target.value))}/>
    </div>
    <div>
      Speed:
      <input type='range' min={-1} max={1} step={0.01} value={speed} onChange={e => setSpeed(Number(e.target.value))}/>
    </div>
    <div>
      Pan:
      <input type='range' min={0} max={1} step={0.01} value={pan} onChange={e => setPan(Number(e.target.value))}/>
    </div>
</Wrapper>
}

const Wrapper = styled.div`
margin: 10px;
color: white;
div {
  display: flex;
  align-items: center;
}
`