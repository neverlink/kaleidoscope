const { ipcRenderer } = require('electron')

const resizeWindow = (width, height) => ipcRenderer.send('resize-window', width, height);

class VideoPlayer {
    constructor(fileURI) {
        this.domElement = this.createElement(fileURI);
        document.querySelector('#container').appendChild(this.domElement);
    }

    stop = () => { this.domElement.currentTime = 0; this.domElement.pause(); }

    toggleMute = () => this.domElement.muted = !this.domElement.muted;

    togglePause = () => this.domElement.isPlaying = !this.domElement.isPlaying;

    togglePitchCorrection = () => this.domElement.preservesPitch = !this.domElement.preservesPitch

    changeVolume = (amount) => {
        this.domElement.volume = (this.domElement.volume * 100 + amount) / 100;
        console.log(`Volume: ${this.domElement.volume}`);
    }

    changeSpeed = (amount) => {
        let newRate = (this.domElement.playbackRate * 100 + amount) / 100;
        if (newRate > 0 && newRate < 16)
            this.domElement.playbackRate = newRate
        else
            return
        console.log(`Rate: ${newRate}`);
    }

    seekSeconds = (amount) => {
        this.domElement.currentTime = (this.domElement.currentTime += amount).toFixed(2);
        console.log(`Skipped to: ${this.domElement.currentTime}`);
    }

    createElement(fileURI) {
        const domElement = document.createElement('video');

        const defaultProperties = {
            'src': fileURI,
            'volume': 0.5,
            'loop': true,
            'autoplay': 'true',
            'preservesPitch': false // THIS DEFAULT DOES NOT WORK
        }

        for (const [property, value] of Object.entries(defaultProperties)) {
            domElement.setAttribute(property, value)
        }

        domElement.oncontextmenu = function () { alert("insert pretty menu here") }

        domElement.addEventListener('loadedmetadata', () => {
            resizeWindow(domElement.videoWidth, domElement.videoHeight);
        }, false);

        return domElement;
    }

    destroy = () => this.domElement.remove();
}

module.exports = {
    VideoPlayer: VideoPlayer
}