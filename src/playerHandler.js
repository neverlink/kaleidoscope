const { ipcRenderer } = require('electron');

function resizeWindow (width, height) {
    ipcRenderer.send('resize-window', width, height);
}

let activePlayers = []

function createPlayer(file) {
    const mimeType = file.type;
    const fileType = mimeType.split('/')[0];

    if (fileType == 'video') {
        if (activePlayers.length > 0) activePlayers.forEach((player) => player.destroy());
        activePlayers.push(new VideoPlayer(file.path));
    }
    else
    {
        alert(`${mimeType} is not supported!`);
    }
}

class VideoPlayer {
    constructor(fileURI) {
        this.fileURI = fileURI;
        this.player = this.createElement(this.fileURI);
    }

    createElement(fileURI) {
        const videoBlock = document.createElement('video');

        videoBlock.loop = true;
        videoBlock.autoplay = true;
        videoBlock.src = fileURI;
        videoBlock.id = `video${activePlayers.length}`
        videoBlock.oncontextmenu = function () { alert("insert pretty menu here") }

        videoBlock.addEventListener('loadedmetadata', () => {
            resizeWindow(videoBlock.videoWidth, videoBlock.videoHeight);
        }, false);

        document.querySelector('#container').appendChild(videoBlock);
        return videoBlock;
    }

    destroy = () => this.player.remove();
}

export { createPlayer }