const {ipcRenderer} = require('electron')

const resizeWindow = (width, height) => {
  ipcRenderer.send('resize-window', width, height)
}

const createVideoBlock = (fileURI) => {
  if (document.querySelector('video')) {
    alert('video already exists')
    return
  }
  
  const videoBlock = document.createElement('video');

  videoBlock.src = fileURI
  videoBlock.loop = true
  videoBlock.autoplay = true
  videoBlock.oncontextmenu = function () { alert("insert pretty menu here") }
  
  videoBlock.addEventListener('loadedmetadata', () => {
    resizeWindow(videoBlock.videoWidth, videoBlock.videoHeight)
  }, false);
  
  document.body.appendChild(videoBlock)
}

const defineDropArea = () => {
  const dropArea = document.getElementById("dropContainer");

  const prevents = (evt) => evt.preventDefault();
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
    dropArea.addEventListener(evtName, prevents);
  });

  const handleDrop = (evt) => {
    const dt = evt.dataTransfer;
    const file = [...dt.files][0];
    const mime = file.type
    const fileType = mime.split('/')[0]

    if (fileType == 'video') {
      createVideoBlock(file.path)
    }
    else {
      alert(`${mime} is not supported!`)
    }
  }
  dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
  defineDropArea()
}

document.addEventListener("DOMContentLoaded", initApp);