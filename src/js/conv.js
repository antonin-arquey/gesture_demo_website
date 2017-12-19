import WebcamManager from './webcam';
import convnetjs from '../../convnet-min';


import model from '../json/model.json';

const webcamManager = new WebcamManager(64, 64);
const net = new convnetjs.Net(); // create an empty network
net.fromJSON(model);

export default function conv() {
  const data = webcamManager.takeSnapshot();
  let arr = [[]];
  let x = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (i % 256 === 0) {
      arr.push([]);
      x += 1;
    }
    arr[x].push(Math.round((data[i] + data[i + 1] + data[i + 2]) / 3));
  }
  arr = arr.slice(1);
  console.log(arr);

  const v = new convnetjs.Vol(64, 64, 1, 0);

  for (x = 0; x <= arr.length; x += 1) {
    for (let y = 0; y <= arr[x].length; y += 1) {
      v.set(x, y, 0, data[x][y]);
    }
  }
  const probabilityVolume = net.forward(v);
  console.log(probabilityVolume.w);
  return probabilityVolume.w;
}
