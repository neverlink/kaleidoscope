const { ipcRenderer } = require('electron')

const resizeWindow = (width, height) => ipcRenderer.send('resize-window', width, height);

class VideoPlayer {
    constructor(fileURI) {
        this.domElement = this.createElement(fileURI);

        this.domElement.addEventListener('loadedmetadata', () => {
            this.width = this.domElement.videoWidth;
            this.height = this.domElement.videoHeight;
            this.duration = this.domElement.duration;
            resizeWindow(this.width, this.height);
        }, false); // move outside this module to simplify splitscreen, use props as dimesions
        
        document.querySelector('#container').appendChild(this.domElement);
    }

    stop = () => { this.domElement.currentTime = 0; this.domElement.pause(); }

    toggleMute = () => this.domElement.muted = !this.domElement.muted;

    togglePause = () => this.domElement.isPlaying = !this.domElement.isPlaying;

    togglePitchCorrection = () => this.domElement.preservesPitch = !this.domElement.preservesPitch

    changeVolume(amount) {
        let newVolume = (this.domElement.volume * 100 + amount) / 100;
        if (newVolume < 0 || newVolume > 1) return;
        this.domElement.volume = newVolume
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

    seek = (amount) => {
        switch (amount) {
            case 0: this.domElement.currentTime = 0; break;
            case -1: this.domElement.currentTime = this.duration - 0.1; break;
            default: this.domElement.currentTime = (this.domElement.currentTime += amount);
        }
        console.log(`Skipped to: ${this.domElement.currentTime}`);
    }

    createElement(fileURI) {
        const domElement = document.createElement('video');
        
        domElement.src = fileURI,
        domElement.volume = 0.5,
        domElement.autoplay = true,
        domElement.loop = true        
        domElement.preservesPitch = false;

        domElement.oncontextmenu = function () { alert("insert pretty menu here") }
        return domElement;
    }

    destroy() { 
        this.domElement.removeAttribute('src');
        this.domElement.load();
        this.domElement.remove();
    }
}

module.exports = {
    VideoPlayer: VideoPlayer
}