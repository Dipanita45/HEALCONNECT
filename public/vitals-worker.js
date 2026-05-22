let currentPulse = 0;
let buffer = [];
const MAX_POINTS = 1000;

// Simple downsampling: Moving Average
function downsample(data, factor) {
  if (data.length <= factor) return data;
  const result = [];
  for (let i = 0; i < data.length; i += factor) {
    const chunk = data.slice(i, i + factor);
    const avgY = chunk.reduce((sum, point) => sum + point.y, 0) / chunk.length;
    // Keep the x value of the last point in the chunk
    result.push({ x: chunk[chunk.length - 1].x, y: avgY });
  }
  return result;
}

self.onmessage = function (e) {
  if (e.data.type === 'UPDATE_PULSE') {
    currentPulse = e.data.pulse;
  }
};

// Process simulated hardware data every 50ms
setInterval(() => {
  const pulse = currentPulse;
  let newPoints = [];

  if (pulse >= -300 && pulse <= 300) {
    newPoints.push({ x: Date.now(), y: 0 });
  } else if (pulse > 600) {
    const pulseArray = [
      { x: Date.now(), y: 64 },
      { x: Date.now() + 5, y: 168 },
      { x: Date.now() + 25, y: 300 },
      { x: Date.now() + 50, y: -200 },
      { x: Date.now() + 85, y: 100 },
      { x: Date.now() + 165, y: -40 },
    ];
    newPoints.push(...pulseArray);
  }

  if (newPoints.length > 0) {
    buffer.push(...newPoints);
    if (buffer.length > MAX_POINTS * 2) { // Buffer more before downsampling
      buffer = buffer.slice(buffer.length - MAX_POINTS * 2);
    }
  }
}, 100);

// Batch and downsample every 200ms to avoid main thread UI blocking
setInterval(() => {
  if (buffer.length > 0) {
    // Downsample by a factor of 2 to reduce chart density
    const processedData = downsample(buffer, 2);
    self.postMessage({ type: 'BATCH_UPDATE', ecgData: processedData });
  }
}, 200);
