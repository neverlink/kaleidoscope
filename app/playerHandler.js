const { ipcRenderer } = require('electron');
const mediaPlayer = require('./player.js');

const getActivePlayers = () => Array.from(document.querySelectorAll('audio, video'));

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
            case 'toggleAspectRatio': player.toggleAspectRatio(); break;
            default: break;
        }
    });
}

function createPlayers(fileURIs) {
    if (fileURIs == 'none' || fileURIs == '.') {
        console.log('No file URI provided!')
        return
    }

    fileURIs.forEach((fileURI) => {
        newPlayer = mediaPlayer.create(fileURI);
        newPlayer.addEventListener('loadedmetadata', () => {
            if (getActivePlayers().length == 1) {
                resizeWindow(newPlayer.videoWidth, newPlayer.videoHeight);
            }
            console.log(`Body: ${document.body.scrollWidth} x ${document.body.scrollHeight}`);
        });
        document.title += ' - ' + newPlayer.src.substring(newPlayer.src.lastIndexOf('/') + 1)
    });
}

function initialize() {
    let startURI = process.argv.at(-2);
    createPlayers(startURI);

    let focusedPlayer = null;
    document.addEventListener('mousemove', function (e) {
        focusedPlayer = document.elementFromPoint(e.clientX, e.clientY)
    });

    let destroyedPlayerSrc = null;

    document.addEventListener('wheel', function (e) {
        let player = focusedPlayer;
        if (e.deltaY < 0 && player.volume < 1) {
            player.volume = (player.volume * 100 + 10) / 100;
        } else if (e.deltaY > 0 && player.volume > 0) {
            player.volume = (player.volume * 100 - 10) / 100;
        } else return
        console.log(`Volume: ${player.volume}`);
    });

    ipcRenderer.on('create-players', function (e, fileURIs) {
        createPlayers(fileURIs);
    });

    ipcRenderer.on('command-players', function (e, action, value) {
        commandPlayers(action, value)
    });

    ipcRenderer.on('destroy-player', function (e, player) {
        destroyedPlayerSrc = focusedPlayer.destroy();
        // no players left? reply to main with quit
    });

    ipcRenderer.on('restore-player', function (e, player) {
        if (destroyedPlayerSrc != null)
            createPlayers([destroyedPlayerSrc]);
    });
}

module.exports = {
    initialize,
    createPlayers,
    commandPlayers
}