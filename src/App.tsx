import styled from 'styled-components'
import { GlobalStyle } from './styled'
import { Display } from './Display'
import { useAppState } from './stores/appStore'
import { createAudio } from './audio'
import { Controls } from './Controls'
import { cloneAudioBuffer } from './helpers'

createAudio();

function App() {
  const actx = useAppState(state => state.actx)
  const setBuffer = useAppState(state => state.setBuffer)
  const setReverseBuffer = useAppState(state => state.setReverseBuffer)
  
  async function handleLoadSample() {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Audio files',
          accept: {
            'audio/*': ['.wav', '.ogg', '.mp3', '.mp4', '.aac', '.flac'],
          }
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });

    const file = await fileHandle.getFile();

    if (file === null) return;

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    setBuffer(audioBuffer);

    const reverseBuffer = cloneAudioBuffer(audioBuffer);

    for (let i = 0; i < reverseBuffer.numberOfChannels; i++) {
      reverseBuffer.getChannelData(i).reverse();
    }
    setReverseBuffer(reverseBuffer);
  }

  return (
    <Wrapper>
      <GlobalStyle/>
      <Buttons>
        <button onClick={handleLoadSample}>Load sample</button>
      </Buttons>
      <Display/>
      <Controls/>
    </Wrapper>
  )
}

export default App

const Wrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
`

const Buttons = styled.div`
margin: 10px;
display: flex;
gap: 10px;
position: absolute;
z-index: 999;
`
