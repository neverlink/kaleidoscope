const { ipcRenderer } = require('electron');
const playerHandler = require('./playerHandler.js');
const playerUI = require('./playerUI.js');
const keybinds = require('./keybinds.js');

const setBorderEvents = () => {
    minimizeBtn.addEventListener('click', () =>  ipcRenderer.send('minimize-app'));
    maximizeBtn.addEventListener('click', () => ipcRenderer.send('maximize-app'));
    closeBtn.addEventListener('click', () => ipcRenderer.send('quit-app'));
}

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

const loadPreferences = () => {
    if (localStorage.length === 0) {
        localStorage.setItem('playerVolume', 0.5);
        localStorage.setItem('preservePitch', false);
        localStorage.setItem('preserveAspectRatio', true);
    }
    for (const [key, value] of Object.entries(localStorage)) {
        window.key = value;
    }
}

const initialize = () => {
    if (process.platform !== 'win32') {
        titlebar.style.display = 'None'
    }

    setBorderEvents();
    defineDropArea();
    loadPreferences();

    let initialFilepath = process.argv.at(-2);
    playerHandler.initialize(initialFilepath);
    playerUI.initialize();
    keybinds.initialize();

    // Needs work
    fileSelector.multiple = true;    
    fileSelector.accept = 'audio/*, video/*';

    splashContainer.addEventListener('click', () => fileSelector.click());

    fileSelector.addEventListener('change', () => {
        let filePaths = Object.values(fileSelector.files).map(fileObj => fileObj['path']);
        playerHandler.replacePlayers(filePaths);
    });

    sidebarBtn.addEventListener('click', playerUI.toggleSidebar);
    content.addEventListener('click', playerUI.closeSidebar);
}

document.addEventListener('DOMContentLoaded', initialize);