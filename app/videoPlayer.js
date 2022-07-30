const { ipcRenderer } = require('electron')

const resizeWindow = (width, height) => ipcRenderer.send('resize-window', width, height);

class VideoPlayer {
    constructor(fileURI) {
        this.domElement = this.createElement(fileURI);
        
        this.domElement.addEventListener('loadedmetadata', () => {
            resizeWindow(this.domElement.videoWidth, this.domElement.videoHeight);
        }, false); // move outside this module to simplify splitscreen, use props as dimesions

        document.querySelector('#container').appendChild(this.domElement);
    }

    stop = () => { this.domElement.currentTime = 0; this.domElement.pause(); }

    toggleMute = () => this.domElement.muted = !this.domElement.muted;

    togglePause = () => this.domElement.isPlaying = !this.domElement.isPlaying;

    togglePitchCorrection = () => this.domElement.preservesPitch = !this.domElement.preservesPitch

    changeVolume(amount) {
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
            'autoplay': 'true',
            'loop': true
        }
        
        for (const [property, value] of Object.entries(defaultProperties)) {
            domElement.setAttribute(property, value)
        }
        
        domElement.preservesPitch = false;
        domElement.oncontextmenu = function () { alert("insert pretty menu here") }
        return domElement;
    }

    destroy() { this.domElement.removeAttribute('src'); this.domElement.remove(); }
}

module.exports = {
    VideoPlayer: VideoPlayer
}