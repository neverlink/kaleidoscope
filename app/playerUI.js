const playerHandler = require("./playerHandler.js");

function initialize() {
    document.querySelector('#gui-toggle-pause').addEventListener('click', () => {
        playerHandler.commandPlayers('togglePause');
    });

    let progressBar = document.querySelector('#gui-progress-bar')
    progressBar.addEventListener('input', () => {
        playerHandler.commandPlayers('seekToPercentage', progressBar.valueAsNumber);
    });

    document.querySelector('#gui-volume-icon').addEventListener('click', () => {
        playerHandler.commandPlayers('toggleMute');
    });

    let volumeSlider = document.querySelector('#gui-volume-slider')
    volumeSlider.addEventListener('input', () => {
        playerHandler.commandPlayers('replaceVolume', volumeSlider.valueAsNumber);
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
    initialize
}