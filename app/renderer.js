import { createPlayer } from './playerHandler.js';

const notify = async (msg) => {
    console.log(msg)
}

const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (evt) => evt.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        dropArea.addEventListener(evtName, prevents);
    });

    const handleDrop = (evt) => {
        const file = [...evt.dataTransfer.files][0];
        createPlayer(file.path);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
    createPlayer();
}

document.addEventListener("DOMContentLoaded", initApp);

export { notify }