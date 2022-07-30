const { ipcRenderer } = require('electron');
const playerHandler = require("./playerHandler.js");


const defineDropArea = () => {
    const dropArea = document.querySelector("#dropContainer");

    const prevents = (e) => e.preventDefault();
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eName => {
        dropArea.addEventListener(eName, prevents);
    });

    const handleDrop = (e) => {
        const file = [...e.dataTransfer.files][0];
        playerHandler.createPlayer(file.path);
    }
    dropArea.addEventListener("drop", handleDrop);
}

const initApp = () => {
    defineDropArea();
    playerHandler.initialize();

    let fileURI = process.argv.at(-2);
    if (fileURI != 'none' && fileURI != '.') { playerHandler.createPlayer(fileURI) }
 
    // try playerHandler.commandPlayers
    ipcRenderer.on('control-player', function (e, action, amount) {
        playerHandler.activePlayers.forEach((player) => {
            switch (action) {
                case 'toggleMute': player.toggleMute(); break;
                case 'togglePause': player.togglePause(); break;
                case 'stop': player.stop(); break;
                case 'changeVolume': player.changeVolume(amount); break;
                case 'changeSpeed': player.changeSpeed(amount); break;
                case 'seekSeconds': player.seekSeconds(amount); break;
                case 'togglePitchCorrection': player.togglePitchCorrection(); break;
                default: console.log('unknown command ' + action); break;
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initApp);