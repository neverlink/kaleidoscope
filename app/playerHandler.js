const { ipcRenderer, ipcMain } = require('electron');
const mediaPlayer = require('./player.js');

const getActivePlayers = () => Array.from(document.querySelectorAll('audio, video'));

const resizeWindow = () => {
    let width = 0;
    let height = 0;

    getActivePlayers().forEach((player) => {
        if (player.width > width && player.height > height) {
            width = player.width;
            height = player.height;
        }
    });

    if (width == 0 || height == 0)
        return

    console.log(`Resizing to ${width} x ${height}`)
    ipcRenderer.send('resize-window', width, height)
};

const updateTitle = () => {
    let newTitle = 'Kaleidoscope'
    getActivePlayers().forEach((player) => {
        newTitle += ' - ' + decodeURI(player.src.substring(player.src.lastIndexOf('/') + 1));
    });
    document.title = newTitle;
}

function commandPlayers(action, amount) {
    getActivePlayers().forEach((player) => {
        switch (action) {
            case 'toggleMute': player.toggleMute(); break;
            case 'togglePause': player.togglePause(); break;
            case 'stop': player.stop(); break;
            case 'changeVolume': player.changeVolume(amount); break;
            case 'replaceVolume': player.changeVolume(amount, true); break;
            case 'changeSpeed': player.changeSpeed(amount); break;
            case 'seek': player.seek(amount); break;
            case 'seekToPercentage': player.currentTime = (player.duration * amount) / 100; break;
            case 'togglePitchCorrection': player.togglePitchCorrection(); break;
            case 'toggleAspectRatio': player.toggleAspectRatio(); break;
            case 'destroy': player.destroy(); break;
            default: break;
        }
    });
}

function createPlayers(fileURIs, destroyRest=false) {
    if (fileURIs == 'none' || fileURIs == '.') {
        console.log('No file URI provided!')
        return
    }

    if (destroyRest) commandPlayers('destroy');

    if (typeof(fileURIs) === "string") {
        fileURIs = [ fileURIs ]
    }

    fileURIs.forEach((fileURI) => {
        newPlayer = mediaPlayer.create(fileURI);
    });
    
    newPlayer.addEventListener('loadedmetadata', () => {
        resizeWindow();
        updateTitle();
    });

    if (getActivePlayers().length > 1) {
        document.querySelector('#gui-progress-bar').style.display = 'none';
    }
}

function initialize() {
    let startURI = process.argv.at(-2);
    createPlayers(startURI);

    let focusedPlayer = null;
    document.addEventListener('mousemove', function (e) {
        focusedPlayer = document.elementFromPoint(e.clientX, e.clientY)
    });

    document.addEventListener('wheel', function (e) {
        let player = focusedPlayer;
        if (e.deltaY < 0 && player.volume < 1) {
            player.changeVolume(+5);
        } else if (e.deltaY > 0 && player.volume > 0) {
            player.changeVolume(-5);
        }
    });

    ipcRenderer.on('create-players', function (e, fileURIs) {
        createPlayers(fileURIs);
    });

    ipcRenderer.on('command-players', function (e, action, value) {
        commandPlayers(action, value);
    });

    ipcRenderer.on('destroy-player', function (e, player) {
        if (getActivePlayers().length <= 1){
            ipcRenderer.send('quit-app');
        } else {
            destroyedPlayerSrc = focusedPlayer.destroy();
            resizeWindow();
            updateTitle();
        }
    });

    ipcRenderer.on('restore-player', function (e, player) {
        if (destroyedPlayerSrc != null)
            createPlayers(destroyedPlayerSrc);
    });
}

module.exports = {
    initialize,
    createPlayers,
    commandPlayers
}