var WaveSurfer = require('wavesurfer.js');

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
        if (this.muted) {
            iconSrc = 'fontawesome/volume-xmark.svg';
            guiVolumeSliderContainer.style.display = 'none';
        } else {
            iconSrc = 'fontawesome/volume-high.svg'
            guiVolumeSliderContainer.style.display = 'inherit';
        }
        guiVolumeIcon.src = iconSrc;
    }

    HTMLMediaElement.prototype.togglePause = function () {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying)
            iconSrc = 'fontawesome/pause.svg';
        else
            iconSrc = 'fontawesome/play.svg';
        guiTogglePause.src = iconSrc;
    }

    HTMLMediaElement.prototype.togglePitchCorrection = function () {
        this.preservesPitch = !this.preservesPitch
    }

    HTMLMediaElement.prototype.adjustVolume = function (amount, absolute) {
        if (absolute)
            newVolume = amount / 100;
        else
            newVolume = (Math.trunc(this.volume * 100) + amount) / 100;

        if (newVolume < 0 || newVolume > 1)
            return;
        else
            this.volume = newVolume;

        if (newVolume >= 0.5)
            iconSrc = 'fontawesome/volume-high.svg';
        else if (newVolume > 0)
            iconSrc = 'fontawesome/volume-low.svg';
        else
            iconSrc = 'fontawesome/volume-xmark.svg';

        guiVolumeIcon.src = iconSrc;
        guiVolumeSlider.value = newVolume * 100;
    }

    HTMLMediaElement.prototype.adjustRate = function (amount) {
        let newRate = (this.playbackRate * 10 + amount) / 10;
        if (newRate > 0 && newRate <= 16)
            this.playbackRate = newRate
        else
            return
    }

    HTMLMediaElement.prototype.stop = function () {
        this.pause();
        this.currentTime = 0;
        guiTogglePause.src = 'fontawesome/play.svg';
        updatePlayerUI(this);
    }

    HTMLMediaElement.prototype.seek = function (amount) {
        switch (amount) {
            case 0: this.currentTime = 0; break;
            case -1: this.currentTime = this.duration - 0.1; this.pause(); break;
            default: this.currentTime = this.currentTime += amount;
        }
        updatePlayerUI(this);
    }

    HTMLMediaElement.prototype.stepFrames = function (amount) {
        this.currentTime += amount * (1 / this.frameRate);
        updatePlayerUI(this);
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

const updatePlayerUI = (node) => {
    guiProgressBar.value = Math.trunc(node.currentTime / node.duration * 1000);
    guiTimeLeft.innerHTML = getTimeString(node.currentTime) + ' / ' + getTimeString(node.duration)
}

const clearAllIntervals = () => {
    const lastIntervalId = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i <= lastIntervalId; i++) {
        window.clearInterval(i);
    }
}

const setEvents = (node) => {
    node.addEventListener('dblclick', () => {
        if (document.fullscreenElement)
            document.exitFullscreen();
        else
            content.requestFullscreen();
    });

    node.addEventListener('wheel', function (e) {
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
        setInterval(() => {
            if (node.currentTime >= node.duration - 0.10)
                node.currentTime = 0;
            updatePlayerUI(node);
        });
    });

    node.addEventListener('pause', () => {
        clearAllIntervals();
    });
}

const setProperties = (node, fileURI) => {
    node.src = fileURI;
    node.volume = 0.5;
    node.loop = true;
    node.autoplay = true;
    node.preservesPitch = false;
    node.frameRate = 30;
}

const spawnSubtitles = (fileURI) => {
    let subtitles = document.createElement('track');
    let uri = fileURI.slice(0, -4) + '.vtt';
    console.log(uri);
    subtitles.src = uri;
    subtitles.kind = 'subtitles';
    subtitles.srclang = 'en';
    subtitles.label = 'English'
    return subtitles
}

const spawnVideo = () => {
    return document.createElement('video');
}

const spawnAudio = (fileURI) => {
    // audioContainer = document.createElement('audio');
    // audioContainer.setAttribute('width', '800px')
    // audioContainer.setAttribute('height', '250px')
    // playerContainer.appendChild(audioContainer);

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

    let node = null;

    if (audioContainers.includes(fileExtension)) {
        alert('Audio is not supported yet!')
        // node = spawnAudio(fileURI);
        // console.log(node);
    } else if (videoContainers.includes(fileExtension)) {
        node = spawnVideo();
        node.appendChild(spawnSubtitles(fileURI));
    } else {
        alert('Unsupported file type!')
    }

    setProperties(node, fileURI);
    setEvents(node);
    setControls(node);
    return node
}