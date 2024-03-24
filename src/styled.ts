import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

#root {
  width: 100vw;
  height: 100vh;
}

input[type="range"] {
  min-width: 300px;
  width: 100%;
}

body {
  margin: 0;
  overflow: hidden;
  background-color: #222;
}

canvas {
  image-rendering: pixelated;
  shape-rendering: crispEdges;
}

.grain {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #0cf;
  pointer-events: none;
}
`