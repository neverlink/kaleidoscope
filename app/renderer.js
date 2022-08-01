const playerHandler = require("./playerHandler.js");

const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        dropArea.addEventListener(eName, prevents);
    });

    const handleDrop = (e) => {
        const file = [...e.dataTransfer.files][0];
        playerHandler.createPlayer(file.path);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
    playerHandler.initialize();
}

document.addEventListener("DOMContentLoaded", initApp);