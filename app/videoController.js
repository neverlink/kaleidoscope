import { notify } from './renderer.js';

let video = null;

const toggleMute = () => video.muted ? video.muted = false : video.muted = true;
const togglePause = () => video.isPlaying ? video.pause() : video.play();

const changeSpeed = (amount) => { 
    video.playbackRate = (video.playbackRate * 100 + amount) / 100;
    notify(`Rate: ${video.playbackRate}`);
}

const changeVolume = (amount) => {
    video.volume = (video.volume * 100 + amount) / 100;
    notify(`Volume: ${video.volume}`);
}

function activatePlayer(player) {
    video = player.domElement;
    document.addEventListener('keydown', function (e) {
        switch(true) {
            case e.code === 'Space': togglePause(); break;
            case e.code === 'KeyM': toggleMute(); break;
            case e.ctrlKey && e.code === 'ArrowUp': changeSpeed(+10); break;
            case e.ctrlKey && e.code === 'ArrowDown': changeSpeed(-10); break;
            case e.code === 'ArrowUp': changeVolume(10); break;
            case e.code === 'ArrowDown': changeVolume(-10); break;
            default: console.log(`${e.code} is not mapped to an action!`)
        }
    });
}

export { activatePlayer };