import WebcamManager from './js/webcam';
import convnetjs from '../convnet-min';
import model from './json/model';

const button = document.querySelector('#snap');

const webcamManager = new WebcamManager(64, 64);


button.addEventListener('click', (ev) => {
  let data = webcamManager.takeSnapshot();
  let arr = [[]];
  let x = 0;
  for (var i = 0; i < data.length; i += 4) {
    if (i%256 == 0){
      arr.push([]);
      x++;
      console.log(x);
    }
    arr[x].push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  arr = arr.slice(1);
  console.log(arr);
  var v = new convnetjs.Vol(arr);
  var net = new convnetjs.Net(); // create an empty network
  net.fromJSON(model);

  var probability_volume = net.forward(v);
  console.log(probability_volume);  
  ev.preventDefault();
});
