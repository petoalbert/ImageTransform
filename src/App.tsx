import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ColorTheme from './ColorTheme'
import WebGlTest from './WebGlTest'

function App() {
  const [colors, setColors] = useState<ColorTheme>({ colors: [
    { r: 255, g: 0, b: 0, a: 255 },
    { r: 0, g: 255, b: 0, a: 255 },
    { r: 0, g: 0, b: 255, a: 255 },
  ] })

  const updateColors = (theme: ColorTheme) => {
    console.log("New colors: ", theme)
    setColors(theme)
  }

  return (
    <>
      <ColorTheme updateTheme={(c) => updateColors(c)} theme={colors} />
      <WebGlTest colorTheme={colors} setColorTheme={(c) => updateColors(c)} />
    </>
  )
}

export default App
