const { ipcRenderer } = require('electron');
const playerUI = require('./playerUI.js');
const playerUtils = require('./playerUtils.js');
// const AudioPlayer = require('./player/AudioPlayer.js');
const VideoPlayer = require('./player/VideoPlayer.js');

ipcRenderer.on('create-players', (e, fileURIs) => replacePlayers(fileURIs));

const createPlayer = (srcPath) => {
    if (srcPath == null || srcPath == '.')
        return;

    let fileExtension = srcPath.substring(srcPath.lastIndexOf('.') + 1).toLowerCase();
    const audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
    const videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

    let player;

    if (audioContainers.includes(fileExtension))
        player = new VideoPlayer(srcPath); // unsupported
    else if (videoContainers.includes(fileExtension))
        player = new VideoPlayer(srcPath);
    else
        return alert(`Unsupported file type: ${fileExtension}!`);
        
    playerContainer.appendChild(player);
    playerUI.setPlayerEvents(player);
    window.activePlayers.push(player);
    
    return player;
}

const destroyPlayer = (player = null, refreshUI = true) => {
    window.activePlayers.length ? null : ipcRenderer.send('quit-app');
    
    let playerInstance = window.activePlayers.find((p) => p.src == player.src);
    window.destroyedPlayers.push(playerInstance);
    window.activePlayers = window.activePlayers.filter((p) => p.src != playerInstance.src);
    
    playerInstance.destroy();
    if (refreshUI) playerUI.refreshState();
};

const replacePlayers = (fileURIs) => {
    window.activePlayers.forEach((p) => destroyPlayer(p, updateUI=false));
    fileURIs.forEach((src) => createPlayer(src));
};

const restorePlayer = () => {
    if (window.destroyedPlayers.length === 0) return;
    let oldPlayer = window.destroyedPlayers.pop();
    let newPlayer = createPlayer(oldPlayer.src);
    newPlayer.style.order = oldPlayer.style.order;
    playerUtils.commandPlayers('seekToStart');
};

const initialize = (startURI) => {
    window.playerID = 0;
    window.activePlayers = [];
    window.destroyedPlayers = [];

    // customElements.define("audio-player", AudioPlayer, { extends: "video" });
    customElements.define("video-player", VideoPlayer, { extends: "video" });

    createPlayer(startURI);
};

module.exports = {
    initialize,
    createPlayer,
    destroyPlayer,
    restorePlayer,
    replacePlayers
};