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
        titleBarText.innerHTML = videoTitles.join(' - ');
    } else {
        titleBarText.innerHTML = 'Kaleidoscope';
    }
}

const updateWindowState = () => {
    resizeWindow();
    updateTitle();

    let playerCount = window.activePlayers.length;

    if (playerCount == 0) {
        playerControls.classList.add('hidden');
        splashContainer.classList.remove('hidden');
    } else {
        playerControls.classList.remove('hidden');
        splashContainer.classList.add('hidden');
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

const updateTimecode = (player) => {
    const parseTime = (time) => {
        let seconds = Math.round(time % 60);
        let minutes = Math.trunc(time / 60);
        return String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0);
    }
    guiTimeLeft.innerHTML = parseTime(player.currentTime) + ' / ' + parseTime(player.duration);
    guiProgressBar.value = Math.trunc(player.currentTime / player.duration * 1000);
}

const setEvents = () => {
    let peekingControls = false;

    const showControls = () => {
        playerControls.classList.remove('transparent');
    }

    const hideControls = () => {
        playerControls.classList.add('transparent');
    }

    const peekControls = async (delay) => {
        peekingControls = true;
        showControls()
        await new Promise(r => setTimeout(r, delay));
        hideControls()
        peekingControls = false;
    }

    playerContainer.addEventListener('mousemove', async (e) => {
        if (!peekingControls) {
            await peekControls(delay = 1500)
        }
    });

    playerControls.addEventListener('mouseenter', (e) => {
        showControls();
    });

    playerControls.addEventListener('mouseleave', async (e) => {
        await peekControls(delay = 1000);
    });

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
}

module.exports = {
    setEvents,
    updateTimecode,
    updateWindowState
}