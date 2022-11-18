require('./overridePrototype.js');
const { spawnAudio } = require('./audioPlayer.js');
const { spawnVideo } = require('./videoPlayer.js');
const { updateTimecode } = require('../playerUI.js');

const spawnPlayer = (fileURI) => {
    let fileExtension = fileURI.substring(fileURI.lastIndexOf('.') + 1);
    let audioContainers = ['mp3', 'ogg', 'wav', 'flac'];
    let videoContainers = ['mp4', 'mov', 'mkv', 'ogv', 'webm'];

    let node;

    if (audioContainers.includes(fileExtension))
        node = spawnAudio(fileURI);
    else if (videoContainers.includes(fileExtension))
        node = spawnVideo(fileURI);
    else
        return alert('Unsupported file type!');

    setProperties(node, fileURI);
    setEvents(node);
    return node;
};

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

    let fastInterval = null;

    node.addEventListener('playing', () => {
        guiTogglePause.src = 'fontawesome/pause.svg';
        clearInterval(fastInterval)
        fastInterval = setInterval(() => {
            if (node.duration - node.currentTime <= 0.1){
                node.currentTime = 0;
            }
            else if (window.activePlayers.length == 1) {
                console.log('updating timecode');
                updateTimecode(node);
            }
            else {
                clearInterval(fastInterval)
            }
        });
    });

    node.addEventListener('ended', () => {
        console.log('video ended lol');
    });

    // node.addEventListener('seeking', (e) => {
    //     updateTimecode(node);
    // });

    // move these to playerUI hooked to the first element in activePlayers?
    node.addEventListener('pause', () => {
        clearInterval(fastInterval);
        guiTogglePause.src = 'fontawesome/play.svg';
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
    node.volume = window.playerVolume;
    node.loop = true;
    node.autoplay = true;
    node.preservesPitch = false;
    node.frameRate = 30;
    node.style.order = window.playerID++;
}

module.exports = {
    spawnPlayer
}