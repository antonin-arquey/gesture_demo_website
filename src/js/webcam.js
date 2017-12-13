

const video = document.querySelector('video');
const image = document.querySelector('#photo');
const canvas = document.querySelector('#canvas');

export default class {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function getUM(constraints) {
        // First get ahold of the legacy getUserMedia, if present
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
    // Prefer camera resolution nearest to 1280x720.
    const constraints = { audio: true, video: { width, height } };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        console.log(stream);

        // Older browsers may not have srcObject
        if ('srcObject' in video) {
          video.srcObject = stream;
        } else {
          // Avoid using this in new browsers, as it is going away.
          video.src = window.URL.createObjectURL(stream);
        }
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch((err) => {
        console.log(`${err.name} : ${err.message}`);
      });
  }

  takeSnapshot() {
    console.log(this);
    canvas.width = this.width;
    canvas.height = this.height;
    console.log(canvas.width, canvas.height, this.width, this.height);
    canvas.getContext('2d').drawImage(video, 0, 0, this.width, this.height);
    console.log(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height))
    image.setAttribute('src', canvas.toDataURL('image/png'));
  }
}
