const { ipcRenderer } = require('electron');
const mediaPlayer = require('./player.js');

const getActivePlayers = () => document.querySelectorAll('audio, video');

const resizeWindow = (width, height) => {
    console.log(`Resizing to ${width} x ${height}`)
    ipcRenderer.send('resize-window', width, height)
};

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
    if (fileURI == 'none' || fileURI == '.') {
        console.log('Invalid file URI provided!')
        return
    }

    newPlayer = mediaPlayer.create(fileURI);

    node.addEventListener('loadedmetadata', () => {
        if (getActivePlayers().length == 1) {
            resizeWindow(newPlayer.videoWidth, newPlayer.videoHeight);
            console.log(`Body: ${newPlayer.width} x ${newPlayer.height}`);
        }
    });
}
function initialize() {
    let fileURI = process.argv.at(-2);
    createPlayer(fileURI);

    document.addEventListener('wheel', function (e) {
        let player = document.elementFromPoint(e.clientX, e.clientY);

        if (e.deltaY < 0 && player.volume < 1) {
            player.volume = (player.volume * 100 + 10) / 100;
        } else if (e.deltaY > 0 && player.volume > 0) {
            player.volume = (player.volume * 100 - 10) / 100;
        } else return

        console.log(`Volume: ${player.volume}`);
    });

    ipcRenderer.on('control-player', function (e, action, value) {
        commandPlayers(action, value)
    });
}

module.exports = {
    initialize,
    createPlayer,
    commandPlayers
}