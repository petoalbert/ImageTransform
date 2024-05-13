import { useState } from 'react'
import './App.css'
import ColorTheme from './ColorTheme'
import WebGlRenderer from './WebGlRenderer'
import ImageUpload from './ImageUpload'
import { WorkerMessage } from './workermessage'

function App() {
  const [colors, setColors] = useState<ColorTheme | null>(null)
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const updateColors = (theme: ColorTheme) => {
    setColors(theme)
  }

  const updateBitmap = (b: ImageBitmap) => {
    setBitmap(b)
    setLoading(true)

    const canvas = new OffscreenCanvas(b.width, b.height);
    const ctx = canvas.getContext('2d');

    ctx?.drawImage(b, 0, 0);
    const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
    if (!imageData) return;

    const data: number[][] = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      data.push([imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]]);
    }

    const worker = new Worker('worker.ts', { type: 'module' });

    worker.postMessage({ data });

    worker.onmessage = function (event: MessageEvent<WorkerMessage>) {
      setColors({ colors: event.data.colors });
      if (!event.data.inProgress) {
        setLoading(false);
      }
    };
  }


  if (!bitmap || !colors) {
    return (
      <ImageUpload setBitmap={updateBitmap} />
    )
  } else {
    const loadingDiv = <div id="loading" style={{ width: bitmap.width }}>
      Analyzing image...
      <div id="spinner" className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>

    return (
      <>
        {loading ? loadingDiv : <ColorTheme updateTheme={(c) => updateColors(c)} theme={colors} />}
        <WebGlRenderer colorTheme={colors} imageBitmap={bitmap} />
      </>
    )
  }
}

export default App
