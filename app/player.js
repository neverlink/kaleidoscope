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
            document.querySelector('#gui-volume-slider-container').style.display = 'none';
        } else {
            iconSrc = 'fontawesome/volume-high.svg'
            document.querySelector('#gui-volume-slider-container').style.display = 'inherit';
        }
        document.querySelector('#gui-volume-icon').src = iconSrc;
    }

    HTMLMediaElement.prototype.togglePause = function () {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying)
            iconSrc = 'fontawesome/pause.svg';
        else
            iconSrc = 'fontawesome/play.svg';
        document.querySelector('#gui-toggle-pause').src = iconSrc;
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

        document.querySelector('#gui-volume-icon').src = iconSrc;
        document.querySelector('#gui-volume-slider').value = newVolume * 100;
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
        document.querySelector('#gui-toggle-pause').src = 'fontawesome/play.svg';;
    }

    HTMLMediaElement.prototype.seek = function (amount) {
        switch (amount) {
            case 0: this.currentTime = 0; break;
            case -1: this.currentTime = this.duration - 0.1; this.pause(); break;
            default: this.currentTime = this.currentTime += amount;
        }
    }

    HTMLMediaElement.prototype.unload = function (amount) {
        let oldSrc = this.src;
        this.removeAttribute('src');
        this.load();
        return oldSrc;
    }
}

const setEvents = (node) => {
    node.addEventListener('loadedmetadata', () => {
        node.width = node.videoWidth;
        node.height = node.videoHeight;
    }, { once: true });

    node.addEventListener('click', () => {
        node.togglePause()
    });

    node.addEventListener('wheel', function (e) {
        if (e.deltaY < 0 && node.volume < 1)
            node.adjustVolume(+5);
        else if (e.deltaY > 0 && node.volume > 0)
            node.adjustVolume(-5);
    });

    let updateUI = null;
    node.addEventListener('playing', () => {
        // Show playing animaion
        if (typeof updateUI == null) return;
        updateUI = setInterval(() => {
            if (node.currentTime >= node.duration - 0.10)
                node.currentTime = 0;

            document.querySelector('#gui-progress-bar')
                .value = Math.trunc(node.currentTime / node.duration * 100);
    
            let seconds = Math.round(node.currentTime % 60);
            let minutes = Math.trunc(node.currentTime / 60);
    
            document.querySelector('#gui-timestamp')
                .innerHTML = String(minutes).padStart(2, 0) + ':' + String(seconds).padStart(2, 0);
        });
    });

    node.addEventListener('pause', () => {
        clearInterval(updateUI);
        updateUI = null;
    });
}

const spawnElement = (fileURI) => {
    const node = document.createElement('video');
    
    node.src = fileURI;
    node.volume = 0.5;
    node.loop = true;
    node.autoplay = true;
    node.preservesPitch = false;
    
    return document.querySelector('div#player-container').appendChild(node);;
}

module.exports.create = (fileURI) => {
    let node = spawnElement(fileURI);
    setControls(); // Move this to trigger only once
    setEvents(node);
    return node;
}