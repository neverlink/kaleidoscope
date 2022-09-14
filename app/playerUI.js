const { ipcRenderer } = require('electron');
const playerUtils = require('./playerUtils.js');

const resizeWindow = () => {
    let width = 0;
    let height = 0;

    window.activePlayers.forEach((player) => {
        if (player.width > width && player.height > height) {
            width = player.width;
            height = player.height;
        }
    });

    if (width == 0 || height == 0) {
        width = 500;
        height = 500;
    }
    
    ipcRenderer.send('resize-window', width, height)
};

const updateTitle = () => {
    if (window.activePlayers.length) {
        let videoTitles = [];
        window.activePlayers.forEach((player) => {
            videoTitles.push(decodeURI(player.src.substring(player.src.lastIndexOf('/') + 1)));
        });
        titleBarTitle.innerHTML = videoTitles.join(' - ');
    } else {
        titleBarTitle.innerHTML = 'Kaleidoscope';
    }
}

const updateWindowState = () => {
    let playerCount = window.activePlayers.length;

    resizeWindow();
    updateTitle();

    if (playerCount == 0) {
        splashContainer.classList.remove('hidden');
        playerControls.classList.add('hidden');
    } else {
        splashContainer.classList.add('hidden');
        playerControls.classList.remove('hidden');
    }

    if (playerCount == 1) {
        guiProgressBar.classList.remove('hidden');
        guiTimeLeft.classList.remove('hidden');
    }

    if (playerCount >= 2) {
        guiProgressBar.classList.add('hidden');
        guiTimeLeft.classList.add('hidden');
    }
}

const initialize = () => {
    playerContainer.addEventListener('dblclick', () => {
        playerUtils.toggleFullscreen();
    });

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
        playerUtils.commandPlayers('replaceVolume', guiVolumeSlider.valueAsNumber);
    });

    guiToggleFullscreen.addEventListener('click', () => {
        playerUtils.toggleFullscreen();
    });

    document.addEventListener('mousemove', (e) => {
        if (document.elementFromPoint(e.clientX, e.clientY).nodeName == 'VIDEO') {
            playerControls.classList.remove('transparent');
            setTimeout(() => {
                playerControls.classList.add('transparent');
            }, 1500);
        } else {
            playerControls.classList.remove('transparent');
        }
    });
}

module.exports = {
    initialize,
    updateWindowState
}