const { ipcRenderer } = require('electron');
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

const initializeUI = () => {
    titleBarMenuBtn.addEventListener('click', () => {
        alert('insert menu here');
    });

    minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('minimize-app');
    });

    maximizeBtn.addEventListener('click', () => {
        ipcRenderer.send('maximize-app');
    });

    closeBtn.addEventListener('click', () => {
        ipcRenderer.send('quit-app');
    });
}

const initApp = () => {
    initializeUI();
    defineDropArea();
    playerHandler.initialize();
    playerUI.initialize();
}

document.addEventListener("DOMContentLoaded", initApp);