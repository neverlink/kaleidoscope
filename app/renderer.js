import { createPlayer } from './playerHandler.js';

const notify = async (msg) => {
    console.log(msg)
    // let alertBox = document.querySelector('#alert-hidden');
    // alertBox.innerHTML = msg;

    // alertBox.id = 'alert-show';
    // await new Promise(r => setTimeout(r, 2000));
    // // alertBox.id = 'alert-hide';
}

const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (evt) => evt.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        dropArea.addEventListener(evtName, prevents);
    });

    const handleDrop = (evt) => {
        const file = [...evt.dataTransfer.files][0];
        createPlayer(file);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
}

document.addEventListener("DOMContentLoaded", initApp);

export { notify }