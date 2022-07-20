const { ipcRenderer } = require('electron')

const resizeWindow = (width, height) => {
    ipcRenderer.send('resize-window', width, height);
}

let activePlayers = []

class VideoPlayer {
    constructor(fileURI) {
        this.fileURI = fileURI;
        this.player = this.createPlayer(this.fileURI);
        console.log(activePlayers)
    }

    createPlayer(fileURI) {
        const videoBlock = document.createElement('video');

        videoBlock.id = `video${activePlayers.length}`
        videoBlock.src = fileURI;
        videoBlock.loop = true;
        videoBlock.autoplay = true;
        videoBlock.oncontextmenu = function () { alert("insert pretty menu here") }

        videoBlock.addEventListener('loadedmetadata', () => {
            resizeWindow(videoBlock.videoWidth, videoBlock.videoHeight);
        }, false);

        document.body.appendChild(videoBlock);
        return videoBlock;
    }
}

function initializePlayer(file) {
    console.log(`Loading ${file.path}`);
    const mimeType = file.type;
    const fileType = mimeType.split('/')[0];

    if (fileType == 'video') {
        if (activePlayers.length == 0) {
            activePlayers.push(new VideoPlayer(file.path)); //todo replace current video
        }
    }
    else {
        alert(`${mimeType} is not supported!`);
    }
}

export { initializePlayer }