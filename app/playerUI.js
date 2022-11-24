const { ipcRenderer } = require('electron');
const { commandPlayers, toggleFullscreen } = require('./playerUtils.js');

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
    if (!window.activePlayers.length) {
        titleBarText.innerHTML = 'Kaleidoscope';
        return;
    }
    let videoTitles = [];
    window.activePlayers.forEach((player) => {
        videoTitles.push(decodeURI(player.src.substring(player.src.lastIndexOf('/') + 1)));
    });
    titleBarText.innerHTML = videoTitles.join(' - ');;
}

const updateTimecode = (player) => {
    const parseTime = (time) => {
        let seconds = Math.round(time % 60);
        let minutes = Math.trunc(time / 60);
        return String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0);
    }
    guiTimeProgress.innerHTML = parseTime(player.currentTime) + ' / ' + parseTime(player.duration);
    guiProgressBar.value = Math.trunc(player.currentTime / player.duration * 1000);
}

const updateState = () => {
    updateTitle();
    resizeWindow();

    const showControls = () => playerControls.classList.remove('hidden');
    const hideControls = () => playerControls.classList.add('hidden');

    const showSplash = () => splashContainer.classList.remove('hidden');
    const hideSplash = () => splashContainer.classList.add('hidden');

    const showProgressBar = () => guiProgressBar.classList.remove('hidden');
    const hideProgressBar = () => guiProgressBar.classList.add('hidden');
    
    const showProgressTime = () => guiTimeProgress.classList.remove('hidden');
    const hideProgressTime = () => guiTimeProgress.classList.add('hidden');

    let playerCount = window.activePlayers.length;

    if (!playerCount) {
        showSplash();
        hideControls();
        return;
    }
    
    hideSplash();
    showControls();

    if (playerCount == 1) {
        showProgressBar();
        showProgressTime();
        return
    }

    hideProgressBar();
    hideProgressTime();
}

// Called when a player is created/destroyed
const setPlayerEvents = (player) => {
    player.addEventListener('loadedmetadata', () => updateState());

    player.addEventListener('playing', () => {
        guiTogglePause.src = 'fontawesome/pause.svg';
        player.activeIntervals.push(setInterval(() => {
            if (player.duration - player.currentTime <= 0.1)
                player.currentTime = 0;
            else if (window.activePlayers.length == 1)
                updateTimecode(player);
        }));
    });
    
    player.addEventListener('seeking', () => updateTimecode(player));
    
    player.addEventListener('pause', () => guiTogglePause.src = 'fontawesome/play.svg');

    player.addEventListener('volumechange', () => {
        if (player.muted) {
            guiVolumeIcon.src = 'fontawesome/volume-xmark.svg';
            guiVolumeSliderContainer.style.display = 'none';
            return;
        }
        guiVolumeSlider.value = player.volume * 100;
        guiVolumeSliderContainer.style.display = 'flex';
        if (player.volume >= 0.5) guiVolumeIcon.src = 'fontawesome/volume-high.svg';
        else if (player.volume > 0) guiVolumeIcon.src = 'fontawesome/volume-low.svg';
        else if (player.volume == 0) guiVolumeIcon.src = 'fontawesome/volume-xmark.svg';
    });
}

const initialize = () => {
    const hideControls = () => playerControls.classList.add('transparent');
    const showControls = () => playerControls.classList.remove('transparent');
    
    let peekingControls = false;

    const peekControls = async (delay) => {
        peekingControls = true;
        showControls()
        await new Promise(r => setTimeout(r, delay));
        hideControls()
        peekingControls = false;
    }

    // Display controls 
    playerControls.addEventListener('mouseenter', () => showControls());
    playerControls.addEventListener('mouseleave', async () => await peekControls(delay = 1000));
    playerContainer.addEventListener('mousemove', async () => !peekingControls ? await peekControls(delay=1500) : null);
    document.addEventListener('keyup', async () => !peekingControls ? await peekControls(delay=1500) : null);

    // Controls button actions
    guiTogglePause.addEventListener('click', () => commandPlayers('togglePause'));
    guiProgressBar.addEventListener('input', () => commandPlayers('seekToPercentage', guiProgressBar.valueAsNumber / 10));
    guiVolumeIcon.addEventListener('click', () => commandPlayers('toggleMute'));
    guiVolumeSlider.addEventListener('input', () => commandPlayers('setVolume', guiVolumeSlider.valueAsNumber));
    guiToggleFullscreen.addEventListener('click', () => toggleFullscreen());
}

module.exports = {
    initialize,
    updateState,
    updateTimecode,
    setPlayerEvents
}