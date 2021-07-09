import React, {useEffect} from 'react';

// Ran into issue where was coming through as plain worker. Couldn't find a lot of mention of
// it. Some here: https://github.com/developit/workerize-loader/issues/24
// https://github.com/developit/workerize-loader/issues/32
// eslint-disable-next-line import/no-webpack-loader-syntax
// import simpleWorker from 'workerize-loader!./simpleWorker'

// eslint-disable-next-line import/no-webpack-loader-syntax
import SimpleWorker from 'worker-loader!./simpleWorker'
import * as Comlink from "comlink";

import { expensive } from './simpleWorker'
import { useState } from 'react';

function App() {
  const onRunSimpleWorker = async () => {
    const worker = Comlink.wrap<{ expensive(time: number): number }>(new SimpleWorker());
    const s = performance.now();
    const result = await worker.expensive(5000);
    console.log(
      'worker done, took',
      Math.round(performance.now() - s),
      'returned',
      result
    )
  }

  const onRunMainThread = async () => {
    const s = performance.now();
    const result = expensive(5000);
    console.log(
      'main thread done, took',
      Math.round(performance.now() - s),
      'returned',
      result
    )
  }

  const [cross, setCross] = useState<SVGSVGElement | null>(null);
  useEffect(
    () => {
      if (!cross) {
        return undefined
      }

      let rotation = 0;
      const internalId = setInterval(
        () => {
          rotation = (rotation + 1) % 360;
          cross.style.transform = `rotate(${rotation}deg)`
        },
        50
      )
      return () => {
        clearInterval(internalId)
      }
    },
    [cross]
  )

  return (
    <div>
      <button type="button" onClick={onRunSimpleWorker}>Run simple worker</button>
      <button type="button" onClick={onRunMainThread}>Run main thread</button>
      <svg
        ref={setCross}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        width={500}
      >
        <g>
          <path d="M496.645,170.667H336.314V10.432C336.314,4.889,331.522,0,325.978,0H185.429c-5.544,0-9.743,4.889-9.743,10.432v160.234
            H14.762c-5.544,0-9.743,4.889-9.743,10.432v140.549c0,5.544,4.199,9.646,9.743,9.646h160.924v171.06
            c0,5.544,4.199,9.646,9.743,9.646h140.549c5.544,0,10.336-4.102,10.336-9.646v-171.06h160.331c5.544,0,10.336-4.102,10.336-9.646
            V181.099C506.98,175.555,502.189,170.667,496.645,170.667z M486.902,311.216H325.978c-5.544,0-9.743,4.889-9.743,10.432v170.273
            H195.765V321.648c0-5.544-4.792-10.432-10.336-10.432H25.098V190.745h160.331c5.544,0,10.336-4.102,10.336-9.646V20.078h120.471
            v161.021c0,5.544,4.199,9.646,9.743,9.646h160.924V311.216z"/>
        </g>
      </svg>
    </div>
  );
}

export default App;
