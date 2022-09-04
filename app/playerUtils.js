const getFocusedPlayer = () => {
    return Array
        .from(document.querySelectorAll(':hover'))
        .find(x => x.nodeName == 'VIDEO');
}

const commandPlayers = (action, amount) => {
    switch (action) {
        case 'toggleAspectRatio': toggleAspectratio(); break;
        default: break;
    }

    activePlayers.forEach(player => {
        switch (action) {
            case 'toggleMute': player.toggleMute(); break;
            case 'togglePause': player.togglePause(); break;
            case 'stop': player.stop(); break;
            case 'adjustVolume': player.adjustVolume(amount); break;
            case 'replaceVolume': player.adjustVolume(amount, true); break;
            case 'adjustRate': player.adjustRate(amount); break;
            case 'seek': player.seek(amount); break;
            case 'seekToPercentage': player.currentTime = (player.duration * amount) / 100; break;
            case 'stepFrames': player.stepFrames(amount); break;
            case 'togglePitchCorrection': player.togglePitchCorrection(); break;
            default: break;
        }
    });
}

module.exports = {
    getFocusedPlayer,
    commandPlayers
}