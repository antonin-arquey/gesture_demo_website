import Vue from 'vue';
import 'bootstrap';

import WebcamManager from './js/webcam';
import convnetjs from '../convnet-min';
import model from './json/model.json';


import ProbabilityChart from './components/ProbabilityChart.vue';

new Vue({ // eslint-disable-line no-new
  el: '#app',
  template: '<ProbabilityChart></ProbabilityChart>',
  components: {
    ProbabilityChart,
  },
});

const button = document.querySelector('#snap');

const webcamManager = new WebcamManager(64, 64);

button.addEventListener('click', (ev) => {
  const data = webcamManager.takeSnapshot();
  let arr = [[]];
  let x = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (i % 256 === 0) {
      arr.push([]);
      x += 1;
    }
    arr[x].push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  arr = arr.slice(1);
  const v = new convnetjs.Vol(arr);
  const net = new convnetjs.Net(); // create an empty network
  net.fromJSON(model);

  const probabilityVolume = net.forward(v);
  console.log(probabilityVolume);
  ev.preventDefault();
});
