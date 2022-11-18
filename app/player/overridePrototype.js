// Overrides the default HTMLMediaElement behaviour to appropriately fit our needs.
Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
    configurable: true,
    get: function () {
        return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2;
    },
    set: function (keepPlaying) {
        keepPlaying ? this.play() : this.pause();
    }
});

HTMLMediaElement.prototype.toggleMute = function () {
    this.muted = !this.muted;
}

HTMLMediaElement.prototype.togglePause = function () {
    this.isPlaying = !this.isPlaying;
}

HTMLMediaElement.prototype.togglePitchCorrection = function () {
    this.preservesPitch = !this.preservesPitch
}

HTMLMediaElement.prototype.adjustVolume = function (amount, absolute) {
    if (absolute)
        newVolume = amount / 100;
    else
        newVolume = (Math.trunc(this.volume * 100) + amount) / 100;
    if (newVolume >= 0 && newVolume <= 1) {
        this.volume = newVolume;
        guiVolumeSlider.value = newVolume * 100;
        window.playerVolume = newVolume;
    }
}

HTMLMediaElement.prototype.adjustRate = function (amount) {
    let newRate = (this.playbackRate * 10 + amount) / 10;
    if (newRate > 0 && newRate <= 16)
        this.playbackRate = newRate
}

HTMLMediaElement.prototype.stop = function () {
    this.pause();
    this.currentTime = 0;
}

HTMLMediaElement.prototype.seek = function (amount) {
    switch (amount) {
        case 0: this.currentTime = 0; break;
        case -1: this.currentTime = this.duration - 0.1; this.pause(); break;
        default: this.currentTime = this.currentTime += amount;
    }
}

HTMLMediaElement.prototype.stepFrames = function (amount) {
    this.currentTime += amount * (1 / this.frameRate);
}

HTMLMediaElement.prototype.unload = function () {
    let oldSrc = this.src;
    this.removeAttribute('src');
    this.load();

    for (let i = 1; i <= 10; i++) {
        window.clearInterval(i);
    }

    return oldSrc;
}