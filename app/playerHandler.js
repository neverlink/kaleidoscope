const { ipcRenderer } = require('electron');
const playerUI = require('./playerUI.js');
const playerUtils = require('./playerUtils.js');
const VideoPlayer = require('./player/VideoPlayer.js');
const AudioPlayer = require('./player/AudioPlayer.js');

ipcRenderer.on('create-players', (e, fileURIs) => replacePlayers(fileURIs));

const createPlayer = (src) => {
    if (src == null || src == '.')
        return;

    let fileExtension = src.substring(src.lastIndexOf('.') + 1).toLowerCase();
    const audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
    const videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

    let player;

    if (audioContainers.includes(fileExtension))
        player = new AudioPlayer(src);
    else if (videoContainers.includes(fileExtension))
        player = new VideoPlayer(src);
    else
        return alert(`Unsupported file type: ${fileExtension}!`);
        
    playerContainer.appendChild(player);
    playerUI.setPlayerEvents(player);
    window.activePlayers.push(player);

    return player;
}

const destroyPlayer = (player = null) => {
    window.activePlayers.length ? null : ipcRenderer.send('quit-app');
    
    let playerInstance = window.activePlayers.find((p) => p.src == player.src);
    window.destroyedPlayers.push(playerInstance);
    window.activePlayers = window.activePlayers.filter((p) => p.src != playerInstance.src);
    
    playerInstance.destroy();
    playerUI.updateState();
};

const destroyPlayers = () => window.activePlayers.forEach((p) => destroyPlayer(p));

const replacePlayers = (fileURIs) => {
    destroyPlayers();
    fileURIs.forEach((src) => createPlayer(src));
};

const restorePlayer = () => {
    if (!window.destroyedPlayers.length)
        return;
    let oldPlayer = window.destroyedPlayers.pop();
    let newPlayer = createPlayer(oldPlayer.src);
    newPlayer.node.style.order = oldPlayer.node.style.order;
    playerUtils.commandPlayers('seek', 0);
};

const initialize = (startURI) => {
    window.playerID = 0;
    window.playerVolume = 0.5; // To-do: Load from cookeis
    window.activePlayers = [];
    window.destroyedPlayers = [];

    customElements.define("audio-player", AudioPlayer, { extends: "video" });
    customElements.define("video-player", VideoPlayer, { extends: "video" });

    createPlayer(startURI);
};

module.exports = {
    initialize,
    createPlayer,
    destroyPlayer,
    restorePlayer,
    destroyPlayers,
    replacePlayers
};