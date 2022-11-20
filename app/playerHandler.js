const VideoPlayer = require('./player/VideoPlayer.js');
const AudioPlayer = require('./player/AudioPlayer.js');
const playerUI = require('./playerUI.js');
const playerUtils = require('./playerUtils.js');
const { ipcRenderer } = require('electron');


const setIpcEvents = () => {
	ipcRenderer.on('create-players', (e, fileURIs) => createPlayers(fileURIs));
	ipcRenderer.on('destroy-player', () => destroyPlayer(playerUtils.getFocusedPlayer()));
	ipcRenderer.on('restore-player', () => restorePlayer());
	ipcRenderer.on('command-players', (e, action, value) => playerUtils.commandPlayers(action, value));
	ipcRenderer.on('toggle-fullscreen', () => playerUtils.toggleFullscreen());
	ipcRenderer.on('toggle-aspect-ratio', () => playerUtils.toggleAspectRatio());
};

const createPlayer = (src) => {
	// get rid of 'none' string here & in main.js
	if (typeof src != "string" || src == 'none' || src == '.')
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
	playerUI.setPlayerEvents(player); // possibly move to playerUI.updateState()

	return player;
}

const destroyPlayers = () => window.activePlayers.forEach((p) => destroyPlayer(p));

const createPlayers = (fileURIs) => {
	destroyPlayers();
	fileURIs.forEach((src) => createPlayer(src));
};

const destroyPlayer = (player) => {
	!activePlayers.length ? ipcRenderer.send('quit-app') : null;
		
	let playerInstance = window.activePlayers.find((p) => p.src == player.src);
	window.destroyedPlayers.push(playerInstance);
	window.activePlayers = window.activePlayers.filter((p) => p.src != playerInstance.src);

	playerInstance.destroy();
	playerUI.updateState();
};

const restorePlayer = () => {
	if (window.destroyedPlayers.length) {
		let oldPlayer = window.destroyedPlayers.pop();
		let newPlayer = createPlayer(oldPlayer.src);
		newPlayer.node.style.order = oldPlayer.node.style.order;
		playerUtils.commandPlayers('seek', 0);
	}
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
	setIpcEvents();
};

module.exports = {
	initialize,
	createPlayer,
	createPlayers,
	destroyPlayer,
	destroyPlayers
};