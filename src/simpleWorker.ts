import * as Comlink from "comlink"

function expensive(time: number): number {
  const start = Date.now();
  let count = 0
  while (Date.now() - start < time) {
    count++
  }
  return count
}

function randomiseArray(buffer: ArrayBuffer): ArrayBuffer {
  const data = new Uint8Array(buffer);
  console.log("worker received", data)
  for (let i = 0; i < 1000; i++) {
    const index1 = Math.floor(Math.random() * data.length);
    const index2 = Math.floor(Math.random() * data.length);
    const oldValue = data[index1];
    data[index1] = data[index2];
    data[index2] = oldValue;
  }
  console.log("worker result", data);
  return buffer;
}

function drawPattern(canvas: OffscreenCanvas): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d ctx")
  }

  const data = new ImageData(canvas.width, canvas.height);
  const numPixels = data.width * data.height;
  const endTime = performance.now() + 3000;
  while (performance.now() < endTime) {
    for (let j = 0; j < numPixels * 4; j += 4) {
      if (data.data[j] === 0) {
        data.data[j] = j;
      }
      data.data[j] = (data.data[j] + data.data[Math.max(0, j - 3)] * 1.1) % 0xff;
      data.data[j + 1] = (data.data[j] + data.data[Math.max(0, j - 3)] * 2.2) % 0xff;
      data.data[j + 2] = (data.data[j] + data.data[Math.max(0, j - 3)] * 3.4) % 0xff;
      data.data[j + 3] = 0xff;
    }
  }
  ctx.putImageData(data, 0, 0);
}

const obj = { expensive, randomiseArray, drawPattern };

Comlink.expose(obj);

export type SimpleWorker = typeof obj;

export { expensive, randomiseArray, drawPattern };
