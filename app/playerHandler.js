const VideoPlayer = require('./player/VideoPlayer.js');
const AudioPlayer = require('./player/AudioPlayer.js');
const playerUI = require('./playerUI.js');
const playerUtils = require('./playerUtils.js');
const { ipcRenderer } = require('electron');

const createPlayer = (src) => {
    if (src == null || src == '.')
        return;

    let fileExtension = src.substring(src.lastIndexOf('.') + 1);
    let audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
    let videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

    let player;

    if (audioContainers.includes(fileExtension))
        player = new AudioPlayer(src);
    else if (videoContainers.includes(fileExtension))
        player = new VideoPlayer(src);
    else
        return alert('Unsupported file type!');
        
    playerContainer.appendChild(player);
    window.activePlayers.push(player);
    playerUI.setPlayerEvents(player);

    return player;
}

const destroyPlayer = (player) => {
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

const initialize = () => {
    window.playerID = 0;
    window.playerVolume = 0.5; // load from cookeis
    window.activePlayers = [];
    window.destroyedPlayers = [];

    customElements.define("audio-player", AudioPlayer, { extends: "video" });
    customElements.define("video-player", VideoPlayer, { extends: "video" });

    let startURI = process.argv.at(-2);
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