const { ipcRenderer } = require('electron')

const resizeWindow = (width, height) => ipcRenderer.send('resize-window', width, height);

function setControls() {
    Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
        configurable: true, // else Uncaught TypeError: Cannot redefine property
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        },
        set: function (keepPlaying) {
            keepPlaying ? this.play() : this.pause();
        }
    });

    HTMLMediaElement.prototype.toggleMute = function() {
        this.muted = !this.muted;
        this.muted ? console.log('Muted') : console.log('Unmuted')
    }
    
    HTMLMediaElement.prototype.togglePause = function() {
        this.isPlaying = !this.isPlaying;
        this.isPlaying ? console.log('Paused') : console.log('Resumed')
    }
    
    HTMLMediaElement.prototype.togglePitchCorrection = function() {
        this.preservesPitch = !this.preservesPitch
        this.preservesPitch ? console.log('Pitch correction: Enabled') : console.log('Pitch correction: Disabled')
    }

    HTMLMediaElement.prototype.changeVolume = function(amount) {
        let newVolume = (this.volume * 100 + amount) / 100;
        if (newVolume < 0 || newVolume > 1) return;
        this.volume = newVolume
        console.log(`Volume: ${this.volume}`);
    }

    HTMLMediaElement.prototype.changeSpeed = function (amount) {
        let newRate = (this.playbackRate * 10 + amount) / 10;
        if (newRate > 0 && newRate <= 16)
            this.playbackRate = newRate
        else
            return
        console.log(`Rate: ${newRate}`);
    }

    HTMLMediaElement.prototype.stop = function() {
        this.currentTime = 0;
        this.pause();
    }

    HTMLMediaElement.prototype.seek = function (amount) {
        switch (amount) {
            case 0: this.currentTime = 0; break;
            case -1: this.currentTime = this.duration - 0.1; break;
            default: this.currentTime = this.currentTime += amount;
        }
        console.log(`Skipped to: ${this.currentTime.toFixed(2)}`);
    }

    HTMLMediaElement.prototype.destroy = function (amount) {
        this.removeAttribute('src');
        this.load();
        this.remove();
    }
}

function spawnElement(fileURI) {
    const node = document.createElement('video');
    
    node.src = fileURI,
    node.volume = 0.5,
    node.autoplay = true,
    node.loop = true        
    node.preservesPitch = false;

    node.addEventListener('loadedmetadata', () => resizeWindow(node.videoWidth, node.videoHeight));
    node.addEventListener('click', () => node.togglePause());
    
    node.oncontextmenu = function () { alert("insert pretty menu here") }

    document.querySelector('#container').appendChild(node);
    return node
}

module.exports.create = (fileURI) => {
    spawnElement(fileURI);
    setControls();
}