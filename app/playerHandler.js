const { VideoPlayer } = require('./videoPlayer.js');

const activePlayers = [];

// const getActivePlayers = () => document.querySelectorAll('audio, video');

// function commandPlayers(method) {
//     players = getActivePlayers();
// }

function createPlayer(fileURI) {
    if (activePlayers.length > 0) activePlayers.forEach((player) => {
        player.destroy();
    });

    let newPlayer = new VideoPlayer(fileURI);
    activePlayers.push(newPlayer);

    newPlayer.domElement.addEventListener('click', () => newPlayer.togglePause());
}

function initialize() {
    Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', { // This is generic and works for audio elements
        configurable: true, // else Uncaught TypeError: Cannot redefine property
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        },
        set: function (keepPlaying) {
            keepPlaying ? this.play() : this.pause();
        }
    });

    document.addEventListener('wheel', function(e) {
        let player = document.elementFromPoint(e.clientX, e.clientY);

        if (e.deltaY < 0 && player.volume < 1) {
            player.volume = (player.volume * 100 + 10) / 100;
        } else if (e.deltaY > 0 && player.volume > 0) {
            player.volume = (player.volume * 100 - 10) / 100;
        } else return
        console.log(`Volume: ${player.volume}`);
    });
}

module.exports = {
    initialize,
    createPlayer,
    activePlayers
}