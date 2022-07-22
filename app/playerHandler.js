const { ipcRenderer } = require('electron');
import { activatePlayer } from './videoController.js';

function resizeWindow(width, height) {
    ipcRenderer.send('resize-window', width, height);
}

let activePlayers = []

function createPlayer(fileURI) {
    if (fileURI == "none") { return }

    let videoFormats = [ 'mp4', 'webm', 'mkv', 'ogg']
    let audioFormats = [ 'mp3', 'wav', 'flac']

    try { // if videoFormats.includes()
        if (activePlayers.length > 0) activePlayers.forEach((player) => player.destroy());
        activePlayers.push(new VideoPlayer(fileURI));
    
        // This is generic and works for audio elements
        Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
            configurable: true, // else Uncaught TypeError: Cannot redefine property
            get: function () {
                return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
            }
        });
    }
    catch { alert('Unsupported file type!'); }
}

class VideoPlayer {
    constructor(fileURI) {
        this.fileURI = fileURI;
        this.domElement = this.createElement(this.fileURI);
        document.querySelector('#container').appendChild(this.domElement);
        activatePlayer(this);
    }

    createElement(fileURI) {
        const videoBlock = document.createElement('video');

        videoBlock.src = fileURI;
        videoBlock.volume = 0.5;
        videoBlock.loop = true;
        videoBlock.autoplay = true;
        videoBlock.id = `video${activePlayers.length}`
        videoBlock.oncontextmenu = function () { alert("insert pretty menu here") }

        videoBlock.addEventListener('loadedmetadata', () => {
            resizeWindow(videoBlock.videoWidth, videoBlock.videoHeight);
        }, false);

        return videoBlock;
    }

    destroy = () => this.domElement.remove();
}

export { createPlayer }