const { ipcRenderer } = require('electron');
const player = require('./player.js');

const getActivePlayers = () => document.querySelectorAll('audio, video');

function commandPlayers(action, amount) {
    getActivePlayers().forEach((player) => {
        switch (action) {
            case 'toggleMute': player.toggleMute(); break;
            case 'togglePause': player.togglePause(); break;
            case 'stop': player.stop(); break;
            case 'changeVolume': player.changeVolume(amount); break;
            case 'changeSpeed': player.changeSpeed(amount); break;
            case 'seek': player.seek(amount); break;
            case 'togglePitchCorrection': player.togglePitchCorrection(); break;
            default: console.log('Unknown action ' + action); break;
        }
    });
}

function createPlayer(fileURI) {
    activePlayers = getActivePlayers();
    if (activePlayers.length > 0) activePlayers.forEach((player) => {
        player.destroy();
    });

    player.create(fileURI);
}

function initialize() {
    let fileURI = process.argv.at(-2);
    if (fileURI != 'none' && fileURI != '.') { 
        createPlayer(fileURI)
    }

    document.addEventListener('wheel', function(e) {
        let player = document.elementFromPoint(e.clientX, e.clientY);

        if (e.deltaY < 0 && player.volume < 1) {
            player.volume = (player.volume * 100 + 10) / 100;
        } else if (e.deltaY > 0 && player.volume > 0) {
            player.volume = (player.volume * 100 - 10) / 100;
        } else return

        console.log(`Volume: ${player.volume}`);
    });

    ipcRenderer.on('control-player', function (e, action, amount) {
        commandPlayers(action, amount)
    });
}

module.exports = {
    initialize,
    createPlayer,
    commandPlayers
}