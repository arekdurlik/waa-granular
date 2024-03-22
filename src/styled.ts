import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

#root {
  width: 100vw;
  height: 100vh;
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
`