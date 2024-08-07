const { ipcRenderer } = require('electron');
const { commandPlayers, toggleFullscreen } = require('./playerUtils.js');

const openSidebar = () => sidebar.setAttribute('active', 'true');
const closeSidebar = () => sidebar.setAttribute('active', 'false');
const toggleSidebar = () => sidebar.getAttribute('active') == 'false' ? openSidebar() : closeSidebar();

const resizeWindow = () => {
    let windowWidth = 0;
    let windowHeight = 0;

    // Get dimensions of largest player
    window.activePlayers.forEach((player) => {
        if (player.width > windowWidth && player.height > windowHeight) {
            windowWidth = player.width;
            windowHeight = player.height + titlebar.offsetHeight;
        }
    });

    if (windowWidth === 0 || windowHeight === 0) {
        windowWidth = 500;
        windowHeight = 500;
    }

    // Resizes videos with either dimension larger than the screen's
    // Slightly aggressive, tends to downscale videos which can fit
    let largestWindowDim = Math.max(windowWidth, windowHeight);
    let smallestScreenDim = Math.min(window.screen.width, window.screen.height);
    if (largestWindowDim > smallestScreenDim) {
        let downscaleFactor = smallestScreenDim / largestWindowDim;
        windowWidth = Math.round(windowWidth * downscaleFactor);
        windowHeight = Math.round(windowHeight * downscaleFactor);
    }

    if (windowWidth !== window.currentWidth || windowHeight !== window.currentHeight) {
        ipcRenderer.send('resize-window', windowWidth, windowHeight)
        window.currentWidth = windowWidth;
        window.currentHeight = windowHeight;
    }
};

const updateTitle = () => {
    if (!window.activePlayers.length)
        return windowTitle.innerHTML = 'Kaleidoscope';

    let videoTitles = [];
    window.activePlayers.forEach((player) => {
        let filepath = player.src.split('/').at(-1)
        let filename = decodeURIComponent(filepath)
        videoTitles.push(filename);
    });

    windowTitle.innerHTML = videoTitles.join(' - ');
}

const updateTimecode = (player) => {
    const parseTime = (time) => {
        let seconds = Math.round(time % 60);
        let minutes = Math.floor(time / 60);
        const padNumber = (number) => number.toString().padStart(2, 0)
        if (minutes >= 60) {
            let hours = Math.floor(minutes / 60);
            minutes = Math.floor((time / 60) % 60);
            return [hours, padNumber(minutes), padNumber(seconds)].join(':')
        }
        return [padNumber(minutes), padNumber(seconds)].join(':')
    }
    guiTimeProgress.innerHTML = parseTime(player.currentTime) + ' / ' + parseTime(player.duration);
    guiProgressBar.value = Math.trunc(player.currentTime / player.duration * 1000);
}

const refreshState = () => {
    updateTitle();
    resizeWindow();

    const showControls = () => playerControls.classList.remove('hidden');
    const hideControls = () => playerControls.classList.add('hidden');

    const showSplash = () => splashContainer.classList.remove('hidden');
    const hideSplash = () => splashContainer.classList.add('hidden');

    const showProgressBar = () => guiProgressBar.classList.remove('hidden');
    const hideProgressBar = () => guiProgressBar.classList.add('hidden');
    
    const showTimecode = () => guiTimeProgress.classList.remove('hidden');
    const hideProgressTime = () => guiTimeProgress.classList.add('hidden');

    let playerCount = window.activePlayers.length;

    if (playerCount === 0) {
        showSplash();
        hideControls();
    } else if (playerCount >= 1) {
        hideSplash();
        showControls();
    }

    if (playerCount === 1) {
        showProgressBar();
        showTimecode();
    } else if (playerCount > 1) {
        hideProgressBar();
        hideProgressTime();
    }
}

// WIP
const notify = async (message) => {
    popup.innerHTML = message;
    popup.classList.remove('transparent');
    await new Promise(r => setTimeout(r, delay));
    popup.classList.add('transparent');
}

// Called when a player is created
const setPlayerEvents = (player) => {
    player.addEventListener('loadedmetadata', () => refreshState());

    player.addEventListener('playing', () => {
        guiTogglePause.src = 'fontawesome-icons/pause.svg';
        player.activeIntervals.push(setInterval(() => {
            if (player.duration - player.currentTime <= 0.1)
                player.currentTime = 0;
            else if (window.activePlayers.length == 1)
                updateTimecode(player);
        }));
    });
    
    player.addEventListener('seeking', () => updateTimecode(player));
    
    player.addEventListener('pause', () => guiTogglePause.src = 'fontawesome-icons/play.svg');

    player.addEventListener('volumechange', async () => {
        if (player.muted) {
            guiVolumeIcon.src = 'fontawesome-icons/volume-xmark.svg';
            guiVolumeSliderContainer.style.display = 'none';
            await notify('Toggled Mute');
            return;
        }
        guiVolumeSlider.value = player.volume * 100;
        guiVolumeSliderContainer.style.display = 'flex';
        if (player.volume >= 0.5) guiVolumeIcon.src = 'fontawesome-icons/volume-high.svg';
        else if (player.volume > 0) guiVolumeIcon.src = 'fontawesome-icons/volume-low.svg';
        else if (player.volume == 0) guiVolumeIcon.src = 'fontawesome-icons/volume-xmark.svg';
        else alert(`Unhandled: Player volume is negative: ${player.volume}!`)
    });
}

const initialize = () => {
    refreshState();

    const hideControls = () => playerControls.classList.add('transparent');
    const showControls = () => playerControls.classList.remove('transparent');
    
    let peekingControls = false;
    const peekControls = async (delay) => {
        peekingControls = true;
        showControls();
        await new Promise(r => setTimeout(r, delay)); // Shouldn't delay be populated?
        hideControls();
        peekingControls = false;
    }

    // Display controls 
    playerControls.addEventListener('mouseenter', () => showControls());
    playerControls.addEventListener('mouseleave', async () => await peekControls(delay = 1000));
    playerContainer.addEventListener('mousemove', async () => !peekingControls ? await peekControls(delay=1500) : null);
    document.addEventListener('keyup', async () => !peekingControls ? await peekControls(delay=1500) : null);

    // Player controls
    guiTogglePause.addEventListener('click', () => commandPlayers('togglePause'));
    guiProgressBar.addEventListener('input', () => commandPlayers('seekToPercentage', guiProgressBar.valueAsNumber / 10));
    guiVolumeIcon.addEventListener('click', () => commandPlayers('toggleMute'));
    guiVolumeSlider.addEventListener('input', () => commandPlayers('setVolume', guiVolumeSlider.valueAsNumber));
    guiToggleFullscreen.addEventListener('click', () => toggleFullscreen());
}

module.exports = {
    initialize,
    refreshState,
    updateTimecode,
    setPlayerEvents,
    toggleSidebar,
    closeSidebar
}