import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ColorTheme from './ColorTheme'
import WebGlTest from './WebGlTest'
import ImageUpload from './ImageUpload'
import { kMeans } from './kmeans'

function App() {
  const [colors, setColors] = useState<ColorTheme | null>(null)

  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null)

  const updateColors = (theme: ColorTheme) => {
    console.log("New colors: ", theme)
    setColors(theme)
  }

  const updateBitmap = (b: ImageBitmap) => {
    setBitmap(b)

    console.log("Start calculating kmeans")

    // get the imagedata from imageBitmap
    const canvas = new OffscreenCanvas(b.width, b.height);
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(b, 0, 0);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;

    const data: number[][] = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      data.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
    }

    // create a new worker
    const worker = new Worker('worker.ts', { type: 'module' });

    // post the data to the worker
    worker.postMessage({ data });

    // listen for messages from the worker
    worker.onmessage = function (event) {
      // call setColorTheme with the new colors
      setColors({ colors: event.data });
    };
  }

  if (!bitmap) {
    return (
      <ImageUpload setBitmap={updateBitmap} />
    )
  } else if (!colors) {
    return <div id="loading">
      Analyzing image...
      <div id="spinner" className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  } else {
    return (
      <>
        <ColorTheme updateTheme={(c) => updateColors(c)} theme={colors} />
        <WebGlTest colorTheme={colors} setColorTheme={(c) => updateColors(c)} imageBitmap={bitmap} />
      </>
    )
  }
}

export default App
