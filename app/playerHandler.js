const { VideoPlayer } = require('./videoPlayer.js');

const activePlayers = [] // replace this with mediaGroup

function commandPlayers(method) {
    playerHandler.activePlayers.forEach((player) => {
        player.method
    });
}

function getFocusedPlayer() { // currently this returns a domElement, not a VideoPlayer
    document.addEventListener('mousemove', e => {
        x = document.elementFromPoint(e.clientX, e.clientY)
        console.log(x)
        return x
    }, { passive: true, once: true }) // once might screw stuff up
}

function createPlayer(fileURI) {
    if (activePlayers.length > 0) activePlayers.forEach((player) => player.destroy()); // if SplitScreen disabled

    let newPlayer = new VideoPlayer(fileURI);
    activePlayers.push(newPlayer);

    Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', { // This is generic and works for audio elements
        configurable: true, // else Uncaught TypeError: Cannot redefine property
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        },
        set: function (keepPlaying) {
            keepPlaying ? this.play() : this.pause()
        }
    });
}

// document.onwheel = e => {
//     playerHandler.activePlayers.forEach((player) => {
//         if (e.deltaY >= 0)
//             player.changeVolume(-10);
//         else
//             player.changeVolume(+10);
//     });
// }

module.exports = {
    createPlayer,
    activePlayers,
    getFocusedPlayer,
    commandPlayers
}