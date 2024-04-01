import { createGlobalStyle } from 'styled-components'

export const main_color = '#0cf';

export const GlobalStyle = createGlobalStyle`

html {
  color-scheme: dark;
  font-family: sans-serif;
  letter-spacing: 1px;
}

input[type="range"] {
  min-width: 300px;
  width: 100%;
}

body {
  margin: 0;
  overflow-x: hidden;
  background-color: #222;
}

canvas {
  image-rendering: pixelated;
  shape-rendering: crispEdges;
  min-height: 400px;
}

.grain {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: ${main_color};
  pointer-events: none;
}
`