import * as Comlink from "comlink"

function expensive(time: number): number {
  const start = Date.now();
  let count = 0
  while (Date.now() - start < time) {
    count++
  }
  return count
}

Comlink.expose({ expensive });

export { expensive }
