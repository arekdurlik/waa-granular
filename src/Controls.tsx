import styled from 'styled-components'
import { useGrainStore } from './stores/grainStore'
import { useAppState } from './stores/appStore'

export function Controls() {
  const { canvas, grains, master } = useAppState()
  const grain = useGrainStore()
  const sprayMax = (canvas?.width ?? 1) / 2

  return <Wrapper>
    <div>
      Grains: {grains}
    </div>
    <Slider>
      <span>Master volume: {Math.round(master!.gain.value * 100) / 100}</span>
      <input type='range' min={0} max={2} step={0.01} value={master?.gain.value} onChange={e => master!.gain.value = (Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Grain density: {grain.density}</span>
      <input type='range' min={0.01} max={1000} step={0.01} value={grain.density} onChange={e => grain.setDensity(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Grain size: {grain.size}</span>
      <input type='range' min={0.04} max={3} step={0.01} value={grain.size} onChange={e => grain.setSize(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Grain Attack: {grain.attack}</span>
      <input type='range' min={0} max={1} step={0.01} value={grain.attack} onChange={e => grain.setAttack(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Grain Decay: {grain.decay}</span>
      <input type='range' min={0} max={1} step={0.01} value={grain.decay} onChange={e => grain.setDecay(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Spray: {grain.spray}</span>
      <input type='range' min={0} max={sprayMax} step={0.01} value={grain.spray} onChange={e => grain.setSpray(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Pan: {grain.pan}</span>
      <input type='range' min={0} max={1} step={0.01} value={grain.pan} onChange={e => grain.setPan(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Pitch: {grain.pitch}</span>
      <input type='range' min={0} max={2} step={0.001} value={grain.pitch} onChange={e => grain.setPitch(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Direction: {grain.direction}</span>
      <input type='range' min={0} max={1} step={0.01} value={grain.direction} onChange={e => grain.setDirection(Number(e.target.value))}/>
    </Slider>
    <Slider>
      <span>Seek: {grain.seek}</span>
      <input type='range' min={-3} max={3} step={0.001} value={grain.seek} onChange={e => grain.setSeek(Number(e.target.value))}/>
    </Slider>
</Wrapper>
}

const Wrapper = styled.div`
margin: 10px;
color: white;
display: flex;
flex-direction: column;
gap: 4px;
`

const Slider = styled.div`
display: flex;
align-items: flex-start;
justify-content: flex-start;
flex-direction: column;
gap: 5px;
`