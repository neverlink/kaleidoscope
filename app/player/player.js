class Player extends HTMLVideoElement {
    constructor(src) {
        super();
        this.src = src;
        this.loop = true;
        this.autoplay = true;
        this.controls = false;
        this.activeIntervals = [];
        this.#setProperties();
        this.#setEvents();
    }

    clearIntervals = () => this.activeIntervals.forEach((x) => clearInterval(x));

    destroy = () => {
        this.clearIntervals();
        this.remove();
    }

    #setProperties = () => {
        this.frameRate = 30;
        this.volume = window.playerVolume;
        this.preservesPitch = false;
        this.style.order = window.playerID++;
    }

    #setEvents = () => {
        this.addEventListener('click', () => this.togglePause());
        this.addEventListener('pause', () => this.clearIntervals());
        this.addEventListener('seeking', () => this.clearIntervals());

        this.addEventListener('wheel', (event) => {
            if (event.deltaY < 0 && this.volume < 1)
                this.adjustVolume(+5);
            else if (event.deltaY > 0 && this.volume > 0)
                this.adjustVolume(-5);
        });
    }
    
    get isPlaying() { return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2; }
    
    set isPlaying(value) { value ? this.play() : this.pause(); }

    stop = () => { this.pause(); this.currentTime = 0; }

    toggleMute = () => this.muted = !this.muted;

    togglePause = () => this.isPlaying ? this.pause() : this.play();

    togglePitchCorrection = () => this.preservesPitch = !this.preservesPitch;

    adjustVolume = (amount, absolute=false) => {
        let newVolume = absolute ? amount / 100 : (Math.trunc(this.volume * 100) + amount) / 100;

        if (newVolume >= 0 && newVolume <= 1) {
            this.volume = newVolume;
            window.playerVolume = newVolume;
        }
    }

    adjustRate = (amount) => {
        let newRate = (this.playbackRate * 10 + amount) / 10;
        if (newRate > 0 && newRate <= 16) {
            this.playbackRate = newRate;
        }
    }

    seek = (amount) => {
        switch (amount) {
            case 0: this.currentTime = 0; break;
            case -1: this.currentTime = this.duration - 0.1; this.pause(); break;
            default: this.currentTime = this.currentTime += amount;
        }
    }

    stepFrames = (amount) => this.currentTime += amount * (1 / this.frameRate);
}

module.exports = Player;