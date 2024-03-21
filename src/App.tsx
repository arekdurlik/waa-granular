import { GlobalStyle } from './styled'

function App() {
  
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
  }

  return (
    <>
      <GlobalStyle/>
      <button onClick={handleLoadSample}>Load sample</button>
    </>
  )
}

export default App
