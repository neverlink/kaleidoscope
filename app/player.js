const WaveSurfer = require('wavesurfer.js');
const { toggleFullScreen } = require('./playerUtils.js')

const setControls = () => {
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
        updateTimeUI(this);
    }

    HTMLMediaElement.prototype.seek = function (amount) {
        switch (amount) {
            case 0: this.currentTime = 0; break;
            case -1: this.currentTime = this.duration - 0.1; this.pause(); break;
            default: this.currentTime = this.currentTime += amount;
        }
        updateTimeUI(this);
    }

    HTMLMediaElement.prototype.stepFrames = function (amount) {
        this.currentTime += amount * (1 / this.frameRate);
        updateTimeUI(this);
    }

    HTMLMediaElement.prototype.unload = function (amount) {
        let oldSrc = this.src;
        this.removeAttribute('src');
        this.load();
        clearAllIntervals();
        return oldSrc;
    }
}

const getTimeString = (time) => {
    let seconds = Math.round(time % 60);
    let minutes = Math.trunc(time / 60);
    return String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0);
}

const updateTimeUI = (node) => {
    guiProgressBar.value = Math.trunc(node.currentTime / node.duration * 1000);
    guiTimeLeft.innerHTML = getTimeString(node.currentTime) + ' / ' + getTimeString(node.duration);
}

const clearAllIntervals = () => {
    const lastIntervalId = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i <= lastIntervalId; i++)
        window.clearInterval(i);
}

const setEvents = (node) => {
    node.addEventListener('click', () => {
        node.togglePause();
    });
    
    node.addEventListener('wheel', (e) => {
        if (e.deltaY < 0 && node.volume < 1)
            node.adjustVolume(+5);
        else if (e.deltaY > 0 && node.volume > 0)
            node.adjustVolume(-5);
    });

    node.addEventListener('playing', () => {
        let getFpsCount = setInterval(() => {
            if (node.currentTime >= 1) {
                node.frameRate = Math.trunc(node.webkitDecodedFrameCount / node.currentTime) - 1;
                clearInterval(getFpsCount);
            }
        }, 1000);
    }, { once: true });

    node.addEventListener('playing', () => {
        guiTogglePause.src = 'fontawesome/pause.svg';
        setInterval(() => {
            if (node.currentTime >= node.duration - 0.10)
                node.currentTime = 0;
            else
                updateTimeUI(node);
        });
    });

    node.addEventListener('pause', () => {
        guiTogglePause.src = 'fontawesome/play.svg';
        clearAllIntervals();
    });

    node.addEventListener('volumechange', () => {
        if (node.volume >= 0.5)
            iconSrc = 'fontawesome/volume-high.svg';
        else if (node.volume > 0)
            iconSrc = 'fontawesome/volume-low.svg';
        else
            iconSrc = 'fontawesome/volume-xmark.svg';
        guiVolumeIcon.src = iconSrc;
    });

    node.addEventListener('mute', () => {
        iconSrc = 'fontawesome/volume-xmark.svg';
        guiVolumeSliderContainer.style.display = 'none';
        guiVolumeIcon.src = iconSrc;
    });

    node.addEventListener('unmute', () => {
        iconSrc = 'fontawesome/volume-high.svg';
        guiVolumeSliderContainer.style.display = 'inherit';
        guiVolumeIcon.src = iconSrc;
    });
}

const setProperties = (node, fileURI) => {
    node.src = fileURI;
    node.volume = 0.5;
    node.loop = true;
    node.autoplay = true;
    node.preservesPitch = false;
    node.frameRate = 30;
    node.style.order = window.playerID++;
}

const addSubtitles = (node) => {
    return
    // let filename = node.src.slice(0, -4);
    // filename += '.vtt';
    // node.appendChild(spawnSubtitles(filename));
}

const spawnSubtitles = (fileURI) => {
    let subtitles = document.createElement('track');
    subtitles.src = uri;
    subtitles.kind = 'subtitles';
    subtitles.label = 'English'
    subtitles.srclang = 'en';
    return subtitles
}

const spawnVideo = () => {
    let node = document.createElement('video');
    addSubtitles(node);
    return node
}

const spawnAudio = (fileURI) => {
    audioContainer = document.createElement('audio');
    audioContainer.style.width = '800px';
    audioContainer.style.height = '250px';
    playerContainer.appendChild(audioContainer);

    wf = document.createElement('div');
    wf.setAttribute('id', 'waveform');
    playerContainer.appendChild(wf);

    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    wavesurfer.on('ready', function () {
        wavesurfer.play();
    });

    wavesurfer.load(fileURI);
    return wf
}

module.exports.create = (fileURI) => {
    let fileExtension = fileURI.substring(fileURI.lastIndexOf('.') + 1);
    let audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
    let videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

    let node;

    if (audioContainers.includes(fileExtension)) {
        alert('Audio is not supported yet!');
        // node = spawnAudio(fileURI);
    } else if (videoContainers.includes(fileExtension)) {
        node = spawnVideo();
    } else {
        alert('Unsupported file type!');
    }

    setProperties(node, fileURI);
    setEvents(node);
    setControls(node);
    window.activePlayers.push(node);
    return node
}