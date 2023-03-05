export const engine = new Worker('stockfish.js')

engine.onerror = (ev) => {
  console.table(ev);
}

engine.onmessage = (ev) => {
  console.log(ev.data);
}

export function cmd(msg: string) {
  engine.postMessage(msg);
}