const Player = require('./player/Player.js');
const playerUI = require('./playerUI.js');
const playerUtils = require('./playerUtils.js');
const { ipcRenderer } = require('electron');

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
	// get rid of 'none' string here & in main.js
	if (typeof fileURI != "string" || fileURI == 'none' || fileURI == '.')
		return;

	let player = new Player(fileURI);
	
	playerContainer.appendChild(player.node);
	window.activePlayers.push(player);
	playerUI.setPlayerEvents(player);

	player.node.addEventListener('loadedmetadata', () => playerUI.updateState());
	return player;
}

const destroyPlayers = () => window.activePlayers.forEach((p) => destroyPlayer(p));

const createPlayers = (fileURIs) => {
	destroyPlayers();
	fileURIs.forEach((fileURI) => {
		createPlayer(fileURI);
	});
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