function setControls() {
    Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
        configurable: true,
        get: function () {
            return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
        },
        set: function (keepPlaying) {
            keepPlaying ? this.play() : this.pause();
        }
    });

    HTMLMediaElement.prototype.toggleMute = function () {
        this.muted = !this.muted;
        this.muted ? console.log('Muted') : console.log('Unmuted')
    }

    HTMLMediaElement.prototype.togglePause = function () {
        this.isPlaying = !this.isPlaying;
        this.isPlaying ? console.log('Paused') : console.log('Resumed')
    }

    HTMLMediaElement.prototype.togglePitchCorrection = function () {
        this.preservesPitch = !this.preservesPitch
        this.preservesPitch ? console.log('Pitch correction: Enabled') : console.log('Pitch correction: Disabled')
    }

    HTMLMediaElement.prototype.changeVolume = function (amount) {
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

    HTMLMediaElement.prototype.stop = function () {
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

    HTMLMediaElement.prototype.toggleAspectRatio = function () {
        if (this.classList.contains('keep-proportions')) {
            this.classList.remove('keep-proportions');
            this.classList.add('ignore-proportions');
        } else {
            this.classList.remove('ignore-proportions');
            this.classList.add('keep-proportions');
        }
    }

    HTMLMediaElement.prototype.destroy = function (amount) {
        let oldSrc = this.src;
        this.removeAttribute('src');
        this.load();
        this.remove();
        return oldSrc;
    }
}

function spawnElement(fileURI) {
    const node = document.createElement('video');

    node.src = fileURI;
    node.volume = 0.5;
    node.autoplay = true;
    node.loop = true;
    node.preservesPitch = false;
    node.className = 'player keep-proportions';

    node.addEventListener('click', () => node.togglePause());
    node.oncontextmenu = function () { 'insert pretty menu here' }

    document.querySelector('div#player-container').appendChild(node);
    return node;
}

module.exports.create = (fileURI) => {
    node = spawnElement(fileURI);
    setControls();
    console.log('Player created for ' + fileURI)
    return node;
}