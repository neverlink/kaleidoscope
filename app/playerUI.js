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

    ipcRenderer.send('resize-window', width, height)
};

const updateTitle = (activePlayers) => {
    let videoTitles = [];
    activePlayers.forEach((player) => {
        videoTitles.push(decodeURI(player.src.substring(player.src.lastIndexOf('/') + 1)));
    });
    titleBarTitle.innerHTML = videoTitles.join(' - ');
}

const updateWindowState = () => {
    let activePlayers = playerUtils.getActivePlayers();

    resizeWindow(activePlayers);
    updateTitle(activePlayers);

    if (activePlayers.length == 0) {
        splashContainer.style.display = 'flex';
        playerControls.style.display = 'none';
    } else {
        splashContainer.style.display = 'none';
        playerControls.style.display = 'flex';
    }

    if (activePlayers.length == 1) {
        guiProgressBar.style.display = 'initial';
        guiTimestamp.style.display = 'initial';
    }

    if (activePlayers.length >= 2) {
        guiProgressBar.style.display = 'none';
        guiTimestamp.style.display = 'none';
    }
}

const initialize = () => {
    guiTogglePause.addEventListener('click', () => {
        playerUtils.commandPlayers('togglePause');
    });

    guiProgressBar.addEventListener('input', () => {
        playerUtils.commandPlayers('seekToPercentage', guiProgressBar.valueAsNumber / 10);
    });

    guiVolumeIcon.addEventListener('click', () => {
        playerUtils.commandPlayers('toggleMute');
    });

    guiVolumeSlider.addEventListener('input', () => {
        playerUtils.commandPlayers('replaceVolume', guiVolumeSlider.valueAsNumber / 10);
    });

    guiToggleFullscreen.addEventListener('click', () => {
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            playerContainer.requestFullscreen();
    });
}

module.exports = {
    initialize,
    updateWindowState
}