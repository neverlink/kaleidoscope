const { spawnAudio } = require('./AudioPlayer.js');
const { spawnVideo } = require('./VideoPlayer.js');
const { updateTimecode } = require('../playerUI.js');

class Player {
    constructor(fileURI) {
        this.node = this.#create(fileURI);
        this.#setNodeProperties(fileURI);
        this.#setNodeEvents();
        this.frameRate = 30;
        this.activeIntervals = [];
    }

    #create = (fileURI) => {
        let fileExtension = fileURI.substring(fileURI.lastIndexOf('.') + 1);
        let audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
        let videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

        if (audioContainers.includes(fileExtension))
            return spawnAudio(fileURI);
        else if (videoContainers.includes(fileExtension))
            return spawnVideo(fileURI);
        else
            alert('Unsupported file type!');
    };

    destroy = () => {
        this.#clearIntervals();
        this.node.remove();
    }

    #setNodeProperties = (fileURI) => {
        this.node.src = fileURI;
        this.node.volume = window.playerVolume;
        this.node.loop = true;
        this.node.autoplay = true;
        this.node.preservesPitch = false;
        this.node.style.order = window.playerID++;
    }

    #clearIntervals = () => this.activeIntervals.forEach((x) => clearInterval(x));

    #setNodeEvents = () => {
        // move this to VideoPlayer class later
        this.node.addEventListener('loadedmetadata', () => {
            this.width = this.node.videoWidth;
            this.height = this.node.videoHeight;
        });

        this.node.addEventListener('click', () => this.togglePause());
    
        this.node.addEventListener('wheel', (event) => {
            if (event.deltaY < 0 && this.volume < 1)
                this.adjustVolume(+5);
            else if (event.deltaY > 0 && this.volume > 0)
                this.adjustVolume(-5);
        });
    
        this.node.addEventListener('playing', () => {
            this.activeIntervals.push(setInterval(() => {
                if (this.duration - this.currentTime <= 0.1)
                    this.currentTime = 0;
                else if (window.activePlayers.length == 1)
                    updateTimecode(this.node);
            }));
        });
    
        this.node.addEventListener('seeking', () => this.#clearIntervals());
    
        this.node.addEventListener('pause', () => this.#clearIntervals());
    }

    get src() { return this.node.src; }
    set src(value) { this.node.src = value }

    get volume() { return this.node.volume; }
    set volume(value) { this.node.volume = value; }

    get duration() { return this.node.duration; };
    set duration(value) {}

    get currentTime() { return this.node.currentTime; }
    set currentTime(value) { this.node.currentTime = value; }

    get playbackRate() { return this.node.playbackRate; }
    set playbackRate(value) { this.node.playbackRate = value; }

    get isPlaying() { return this.node.currentTime > 0 && !this.node.paused && !this.node.ended && this.node.readyState > 2; }
    set isPlaying(value) { value ? this.play() : this.pause(); }

    stop = () => {
        this.node.pause();
        this.node.currentTime = 0;
    }

    play = () => this.node.play();

    pause = () => this.node.pause();

    togglePause = () => this.isPlaying ? this.pause() : this.play();

    toggleMute = () => this.muted = !this.muted;

    togglePitchCorrection = () => this.node.preservesPitch = !this.node.preservesPitch

    adjustVolume = (amount, absolute=false) => {
        let newVolume = absolute ? amount / 100 : (Math.trunc(this.volume * 100) + amount) / 100;

        if (newVolume >= 0 && newVolume <= 1) {
            this.node.volume = newVolume;
            window.playerVolume = newVolume;
        }
    }

    adjustRate = (amount) => {
        let newRate = (this.playbackRate * 10 + amount) / 10;
        if (newRate > 0 && newRate <= 16) {
            this.node.playbackRate = newRate;
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