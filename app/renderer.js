const playerHandler = require("./playerHandler.js");
const playerUI = require("./playerUI.js");

const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
        dropArea.addEventListener(e, prevents);
    });

    const handleDrop = (e) => {
        let files = [...e.dataTransfer.files];
        let filePaths = files.map(file => file['path']);
        playerHandler.replacePlayer(filePaths);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
    playerHandler.initialize();
    playerUI.initialize();
}

document.addEventListener("DOMContentLoaded", initApp);