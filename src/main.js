import WebcamManager from './js/webcam';

const button = document.querySelector('#snap');

const webcamManager = new WebcamManager(480, 480);

button.addEventListener('click', (ev) => {
  webcamManager.takeSnapshot();
  ev.preventDefault();
});
