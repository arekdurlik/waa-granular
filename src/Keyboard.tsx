import styled from 'styled-components'
import { useAppState } from './stores/appStore'
import { notes } from './constants'
import { main_color } from './styled'

export function Keyboard() {
  const activeNotes = useAppState(state => state.activeNotes);
  const activateNote = useAppState(state => state.activateNote);
  const deactivateNote = useAppState(state => state.deactivateNote);

  return <Wrapper>
    {notes.map((note, i) => 
      <Key 
        key={i} 
        active={activeNotes.includes(note)} 
        onClick={() => activeNotes.includes(note) ? deactivateNote(note) : activateNote(note)}>
          {note}
        </Key>
    )}
  </Wrapper>
}

const Wrapper = styled.div`
display: flex;
justify-content: center;
flex-wrap: wrap;
gap: 5px;
margin: 10px;
`

const Key = styled.span<{ active: boolean }>`
display: flex;
justify-content: center;
align-items: center;
min-width: 50px;
min-height: 50px;
color: black;
background-color: #999;
user-select: none;
border-radius: 5px;

${({ active }) => active && `background-color: ${main_color};`}
`