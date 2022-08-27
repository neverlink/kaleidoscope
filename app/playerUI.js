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
        splashContainer.classList.remove('hidden');
        playerControls.classList.add('hidden');
    } else {
        splashContainer.classList.add('hidden');
        playerControls.classList.remove('hidden');
    }

    if (activePlayers.length == 1) {
        guiProgressBar.classList.remove('hidden');
        guiTimecode.classList.remove('hidden');
    }

    if (activePlayers.length >= 2) {
        guiProgressBar.classList.add('hidden');
        guiTimecode.classList.add('hidden');
    }
}

const initialize = () => {
    playerContainer.addEventListener('click', () => {
        playerUtils.commandPlayers('togglePause');
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
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            playerContainer.requestFullscreen();
    });

    // document.addEventListener('mousemove', (e) => {
    //     let elements = document.elementsFromPoint(e.clientX, e.clientY);
    //     playerControls.classList.remove('hidden');
    //     playerControls.classList.remove('hidden1');
    //     if (elements[0].id != 'playerControls') {
    //         waitForFadeOut = setTimeout(() => {
    //             playerControls.classList.add('hidden');
    //         }, 1500);
    //     }
    // });
}

module.exports = {
    initialize,
    updateWindowState
}