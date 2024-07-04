class Player extends HTMLVideoElement {
    constructor(filePath) {
        super();
        this.src = this.#sanitizeFilename(filePath);
        this.loop = true;
        this.autoplay = true;
        this.controls = false;
        this.activeIntervals = [];
        this.#setProperties();
        this.#setEvents();
    }

    #sanitizeFilename = (filePath) => {
        let pathComponents = filePath.split(/[/\\]+/)
        let filename = pathComponents.pop()
        return filePath.replace(filename, encodeURIComponent(filename))
    }

    clearIntervals = () => this.activeIntervals.forEach((x) => clearInterval(x));

    destroy = () => {
        this.clearIntervals();
        this.remove();
    }

    #setProperties = () => {
        this.frameRate = 30; // Default
        this.volume = localStorage.getItem('playerVolume');
        this.preservesPitch = localStorage.getItem('preservePitch');
        this.style.order = window.playerID++;
    }

    #setEvents = () => {
        this.addEventListener('click', () => this.togglePause());
        this.addEventListener('pause', () => this.clearIntervals());
        this.addEventListener('seeking', () => this.clearIntervals());

        this.addEventListener('wheel', (event) => {
            if (event.deltaY < 0 && this.volume < 1)
                this.adjustVolume(+0.05);
            else if (event.deltaY > 0 && this.volume > 0)
                this.adjustVolume(-0.05);
        });
    }
    
    get isPlaying() { return this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2; }
    
    set isPlaying(value) { value ? this.play() : this.pause(); }

    stop = () => { this.pause(); this.currentTime = 0; }

    toggleMute = () => this.muted = !this.muted;

    togglePause = () => this.isPlaying ? this.pause() : this.play();

    togglePitchCorrection = () => this.preservesPitch = !this.preservesPitch;

    adjustVolume = (amount, absolute=false) => {
        let newVolume = absolute ? amount / 100 : (this.volume + amount).toFixed(2);

        if (newVolume >= 0 && newVolume <= 1) {
            this.volume = newVolume;
            localStorage.setItem('playerVolume', newVolume);
        }
    }

    adjustRate = (amount) => {
        let newRate = (this.playbackRate * 10 + amount) / 10;
        if (newRate > 0 && newRate <= 16) {
            this.playbackRate = newRate;
        }
    }

    seek = (seconds) => { this.currentTime = this.currentTime += seconds; }

    stepFrames = (count) => this.currentTime += count * (1 / this.frameRate);
}

module.exports = Player;