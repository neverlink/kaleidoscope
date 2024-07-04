const Player = require('./Player.js');

class VideoPlayer extends Player {
    constructor(src) {
        super(src);
    }

    get width() { return this.videoWidth }
    get height() { return this.videoHeight }
    
    loadSubtitles = (node) => {
        let filename = node.src.slice(0, -4);
        filename += '.vtt';
        this.appendChild(this.#createSubtitles(filename));
    }
    
    #createSubtitles = (fileURI) => {
        let subtitles = document.createElement('track');
        subtitles.src = fileURI;
        subtitles.kind = 'subtitles';
        subtitles.label = 'English'
        subtitles.srclang = 'en';
        return subtitles
    }
}

module.exports = VideoPlayer;