const { ipcRenderer } = require('electron');
const { updateWindowState } = require('./playerUI.js');
const mediaPlayer = require('./player.js');
const playerUtils = require('./playerUtils.js');

const setIpcEvents = () => {
    ipcRenderer.on('toggle-aspect-ratio', function (e) {
        toggleAspectRatio();
    });

    ipcRenderer.on('create-players', function (e, fileURIs, destroyRest) {
        replacePlayer(fileURIs);
    });

    ipcRenderer.on('command-players', function (e, action, value) {
        playerUtils.commandPlayers(action, value);
    });

    ipcRenderer.on('destroy-player', function (e) {
        destroyPlayer(playerUtils.getFocusedPlayer());
    });

    ipcRenderer.on('restore-player', function (e) {
        if (lastDestroyedSrc != null)
            createPlayers(lastDestroyedSrc);
    });
}

const toggleAspectRatio = () => {
    let pageRoot = document.querySelector(':root');
    let rootStyle = getComputedStyle(pageRoot);

    if (rootStyle.getPropertyValue('--player-aspect-ratio') == 'contain')
        style = 'fill';
    else
        style = 'contain'
        
    pageRoot.style.setProperty('--player-aspect-ratio', style);
}

const replacePlayer = (fileURIs) => {
    playerUtils.getActivePlayers().forEach(p => destroyPlayer(p));
    createPlayers(fileURIs);
}

const createPlayers = (fileURIs) => {
    if (fileURIs == 'none' || fileURIs == '.')
        return

    if (typeof (fileURIs) === "string") {
        fileURIs = [fileURIs]
    }

    fileURIs.forEach((fileURI) =>
        newPlayer = mediaPlayer.create(fileURI));

    newPlayer.addEventListener('loadedmetadata', () => {
        updateWindowState();
    });
}

const destroyPlayer = (player) => {
    let playerCount = playerUtils.getActivePlayers().length;

    if (playerCount < 1)
        ipcRenderer.send('quit-app');
        
    lastDestroyedSrc = player.unload();
    player.remove();
    updateWindowState();
}

const initialize = () => {
    let startURI = process.argv.at(-2);
    replacePlayer(startURI);
    updateWindowState();
    setIpcEvents();
}

module.exports = {
    initialize,
    replacePlayer,
    createPlayers,
    destroyPlayer,
    toggleAspectRatio
}