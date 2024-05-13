// worker.js
import { kMeans } from '../src/kmeans';

self.onmessage = function(event) {
    const { data } = event.data;

    console.log("HELLO")
  
    const centroids = kMeans(data, 8, (progressCentroids) => {
      const newColors = progressCentroids.map(c => ({ r: Math.floor(c[0]), g: Math.floor(c[1]), b: Math.floor(c[2]), a: 255}));
      self.postMessage({colors: newColors, inProgress: true});
    });
    const newColors = centroids.map(c => ({ r: Math.floor(c[0]), g: Math.floor(c[1]), b: Math.floor(c[2]), a: 255}));
    self.postMessage({colors: newColors, inProgress: false});
  };