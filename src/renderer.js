import { createPlayer } from './playerHandler.js';

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