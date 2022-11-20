const getFocusedPlayer = () => {
    return Array
        .from(document.querySelectorAll(':hover'))
        .find(x => x.nodeName == 'VIDEO');
}

const commandPlayers = (action, amount) => {
    activePlayers.forEach(player => {
        switch (action) {
            case 'stop': player.stop(); break;
            case 'toggleMute': player.toggleMute(); break;
            case 'togglePause': player.togglePause(); break;
            case 'adjustVolume': player.adjustVolume(amount); break;
            case 'setVolume': player.adjustVolume(amount, true); break;
            case 'adjustRate': player.adjustRate(amount); break;
            case 'seek': player.seek(amount); break;
            case 'seekToPercentage': player.currentTime = (player.duration * amount) / 100; break;
            case 'stepFrames': player.stepFrames(amount); break;
            case 'toggleAspectRatio': toggleAspectratio(); break;
            case 'togglePitchCorrection': player.togglePitchCorrection(); break;
            default: break;
        }
    });
}

const toggleAspectRatio = () => {
	let pageRoot = document.querySelector(':root');
	let rootStyle = getComputedStyle(pageRoot);

	if (rootStyle.getPropertyValue('--player-aspect-ratio') == 'contain')
	    pageRoot.style.setProperty('--player-aspect-ratio', 'fill');
	else
        pageRoot.style.setProperty('--player-aspect-ratio', 'contain');
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