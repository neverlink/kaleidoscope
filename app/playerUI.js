const { ipcRenderer } = require('electron');
const playerUtils = require("./playerUtils.js");

const resizeWindow = (activePlayers) => {
    let width = 0;
    let height = 0;

    activePlayers.forEach((player) => {
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

const updateTitle = (activePlayers) => {
    let newTitle = 'Kaleidoscope'
    activePlayers.forEach((player) => {
        newTitle += ' - ' + decodeURI(player.src.substring(player.src.lastIndexOf('/') + 1));
    });
    document.title = newTitle;
}

const updateWindowState = () => {
    let activePlayers = playerUtils.getActivePlayers();

    resizeWindow(activePlayers);
    updateTitle(activePlayers);

    if (activePlayers.length == 0) {
        document.querySelector('#splash-container').style.display = 'flex';
        document.querySelector('#player-controls').style.display = 'none';
    } else {
        document.querySelector('#splash-container').style.display = 'none';
        document.querySelector('#player-controls').style.display = 'flex';
    }

    if (activePlayers.length == 1) {
        document.querySelector('#gui-progress-bar').style.display = 'initial';
        document.querySelector('#gui-timestamp').style.display = 'initial';
    }
    
    if (activePlayers.length >= 2) {
        document.querySelector('#gui-progress-bar').style.display = 'none';
        document.querySelector('#gui-timestamp').style.display = 'none';
    }
}

const initialize = () => {
    document.querySelector('#gui-toggle-pause').addEventListener('click', () => {
        playerUtils.commandPlayers('togglePause');
    });

    let progressBar = document.querySelector('#gui-progress-bar')
    progressBar.addEventListener('input', () => {
        playerUtils.commandPlayers('seekToPercentage', progressBar.valueAsNumber);
    });

    document.querySelector('#gui-volume-icon').addEventListener('click', () => {
        playerUtils.commandPlayers('toggleMute');
    });

    let volumeSlider = document.querySelector('#gui-volume-slider')
    volumeSlider.addEventListener('input', () => {
        playerUtils.commandPlayers('replaceVolume', volumeSlider.valueAsNumber);
    });

    let fullscreenToggler = document.querySelector('#gui-toggle-fullscreen')
    fullscreenToggler.addEventListener('click', () => {
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            document.querySelector('#player-container').requestFullscreen();
    });
}

module.exports = {
    initialize,
    updateWindowState
}