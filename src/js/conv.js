import WebcamManager from './webcam';
import convnetjs from '../../convnet-min';


import model from '../json/model.json';

let webcamManager = null;
let net = null;

export function init(callback) {
  net = new convnetjs.Net(); // create an empty network
  net.fromJSON(model);
  webcamManager = new WebcamManager(64, 64, () => {
    callback();
  });
}

export function predict() {
  const data = webcamManager.takeSnapshot();
  const arr = [];
  let x = -1;
  for (let i = 0; i < data.length; i += 4) {
    if (i % 256 === 0) {
      arr.push([]);
      x += 1;
    }
    arr[x].push(Math.round((data[i] + data[i + 1] + data[i + 2]) / 3));
  }

  const v = new convnetjs.Vol(64, 64, 1);

  for (x = 0; x < arr.length; x += 1) {
    for (let y = 0; y < arr[x].length; y += 1) {
      v.set(y, x, 0, arr[x][y]);
    }
  }

  return net.forward(v).w;
}
