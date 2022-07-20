import { initializePlayer } from './playerHandler.js';

const defineDropArea = () => {
    const dropArea = document.getElementById("dropContainer");

    const prevents = (evt) => evt.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evtName => {
        dropArea.addEventListener(evtName, prevents);
    });

    const handleDrop = (evt) => {
        const file = [...evt.dataTransfer.files][0];
        initializePlayer(file);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
}

document.addEventListener("DOMContentLoaded", initApp);