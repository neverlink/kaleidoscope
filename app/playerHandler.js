const { ipcRenderer } = require('electron');
const { updateWindowState } = require('./playerUI.js');
const mediaPlayer = require('./player.js');
const playerUtils = require('./playerUtils.js');

const setIpcEvents = () => {
	ipcRenderer.on('create-players', function (e, fileURIs) {
		createPlayers(fileURIs);
	});
	
	ipcRenderer.on('command-players', function (e, action, value) {
		playerUtils.commandPlayers(action, value);
	});
	
	ipcRenderer.on('destroy-player', function (e) {
		destroyPlayer(playerUtils.getFocusedPlayer());
	});
	
	ipcRenderer.on('restore-player', function (e) {
		restorePlayer();
	});
	
	ipcRenderer.on('toggle-aspect-ratio', function (e) {
		playerUtils.toggleAspectRatio();
	});

	ipcRenderer.on('toggle-fullscreen', function (e) {
		playerUtils.toggleFullscreen();
	});
};
const createPlayer = (fileURI) => {
	if (fileURI == 'none' || fileURI == '.')
		return;

	let newPlayer = mediaPlayer.create(fileURI);

	newPlayer.addEventListener('error', () => {
		alert('Unsupported codec!');
	});

	newPlayer.addEventListener('loadedmetadata', () => {
		newPlayer.width = newPlayer.videoWidth;
		newPlayer.height = newPlayer.videoHeight;
		playerContainer.appendChild(newPlayer);
		updateWindowState();
	});

	return newPlayer;
}

const createPlayers = (fileURIs) => {
	destroyPlayers();

	if (typeof fileURIs === 'string')
		fileURIs = [fileURIs];

	fileURIs.forEach((fileURI) => {
		createPlayer(fileURI);
	});
};

const destroyPlayer = (player) => {
	let playerCount = activePlayers.length;

	if (playerCount < 1)
		ipcRenderer.send('quit-app');

	window.destroyedPlayers.push([player.src, player.style.order]);
	activePlayers = activePlayers.filter((p) => p.src !== player.src);
	
	player.unload();
	player.remove();

	updateWindowState();
};

const destroyPlayers = () => {
	window.activePlayers.forEach((p) => destroyPlayer(p));
};

const restorePlayer = () => {
	if (destroyedPlayers) {
		let oldPlayer = destroyedPlayers.pop();
		createPlayer(oldPlayer[0]);
		let newPlayer = window.activePlayers.at(-1);
		newPlayer.style.order = oldPlayer[1];
		playerUtils.commandPlayers('seek', 0);
	}
}

const initialize = () => {
	window.playerID = 0;
	window.playerVolume = 0.5;
	window.activePlayers = [];
	window.destroyedPlayers = [];

	let startURI = process.argv.at(-2);
	createPlayer(startURI);
	updateWindowState();
	setIpcEvents();
};

module.exports = {
	initialize,
	createPlayer,
	createPlayers,
	destroyPlayer,
	destroyPlayers
};