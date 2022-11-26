const { ipcRenderer } = require('electron');
const playerHandler = require('./playerHandler.js');
const playerUI = require('./playerUI.js');
const keybinds = require('./keybinds.js');

const defineDropArea = () => {
    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(e => {
        dropContainer.addEventListener(e, prevents);
    });

    const handleFiles = (e) => {
        let files = [...e.dataTransfer.files];
        let filePaths = files.map(fileObj => fileObj['path']);
        playerHandler.replacePlayers(filePaths);
    }
    dropContainer.addEventListener('drop', handleFiles);
}

const setBorderEvents = () => {
    minimizeBtn.addEventListener('click', () =>  ipcRenderer.send('minimize-app'));
    maximizeBtn.addEventListener('click', () => ipcRenderer.send('maximize-app'));
    closeBtn.addEventListener('click', () => ipcRenderer.send('quit-app'));
}

const initialize = () => {
    setBorderEvents();
    defineDropArea();
    playerUI.initialize();
    keybinds.initialize();
    playerHandler.initialize(process.argv.at(-2));

    splashContainer.addEventListener('click', () => fileSelector.click());

    // Needs work
    fileSelector.multiple = true;
    fileSelector.accept = 'audio/*, video/*';

    fileSelector.addEventListener('change', () => {
        let filePaths = Object.values(fileSelector.files).map(fileObj => fileObj['path']);
        playerHandler.replacePlayers(filePaths)
    });
}

document.addEventListener('DOMContentLoaded', initialize);