const playerHandler = require("./playerHandler.js");

const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
        dropArea.addEventListener(e, prevents);
    });

    const handleDrop = (e) => {
        let files = [...e.dataTransfer.files];
        let filePaths = files.map(file => file['path']);
        playerHandler.createPlayers(filePaths, true);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
    playerHandler.initialize();
}

document.addEventListener("DOMContentLoaded", initApp);