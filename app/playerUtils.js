const getFocusedPlayer = () => {
    return Array
        .from(document.querySelectorAll(':hover'))
        .find(x => x.nodeName == 'VIDEO');
}

const commandPlayers = (action, amount=null) => {
    activePlayers.forEach(player => {
        switch (action) {
            case 'stop': player.stop(); break;
            case 'toggleMute': player.toggleMute(); break;
            case 'togglePause': player.togglePause(); break;
            case 'adjustVolume': player.adjustVolume(amount); break;
            case 'setVolume': player.adjustVolume(amount, true); break;
            case 'adjustRate': player.adjustRate(amount); break;
            case 'seek': player.seek(amount); break;
            case 'seekToStart': player.currentTime = 0; break;
            case 'seekToEnd': player.currentTime = player.duration - 0.1; player.pause(); break;
            case 'seekToPercentage': player.currentTime = (player.duration * amount) / 100; break;
            case 'stepFrames': player.stepFrames(amount); player.pause(); break;
            case 'toggleAspectRatio': toggleAspectratio(); break;
            case 'togglePitchCorrection': player.togglePitchCorrection(); break;
            default: break;
        }
    });
}

const toggleAspectRatio = () => {
    let pageRoot = document.querySelector(':root');
    let rootStyle = getComputedStyle(pageRoot);

    if (rootStyle.getPropertyValue('--player-aspect-ratio') == 'contain') {
        pageRoot.style.setProperty('--player-aspect-ratio', 'fill');
        localStorage.setItem('preserveAspectRatio', true)
    }
    else {
        pageRoot.style.setProperty('--player-aspect-ratio', 'contain');
        localStorage.setItem('preserveAspectRatio', false)
    }
};

const toggleFullscreen = () => {
    if (document.fullscreenElement) 
        document.exitFullscreen();
    else
        playerContainer.requestFullscreen();
};

module.exports = {
    commandPlayers,
    getFocusedPlayer,
    toggleFullscreen,
    toggleAspectRatio
}