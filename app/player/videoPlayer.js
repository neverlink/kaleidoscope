const { updateWindowState } = require('../playerUI.js');

const spawnVideo = () => {
    let node = document.createElement('video');

    node.addEventListener('loadedmetadata', () => {
        node.width = node.videoWidth;
        node.height = node.videoHeight;
        updateWindowState();
    });

    return node
}

// loadSubtitles = (node) => {
//     return
//     // let filename = node.src.slice(0, -4);
//     // filename += '.vtt';
//     // node.appendChild(createSubtitles(filename));
// }

// createSubtitles = (fileURI) => {
//     let subtitles = document.createElement('track');
//     subtitles.src = uri;
//     subtitles.kind = 'subtitles';
//     subtitles.label = 'English'
//     subtitles.srclang = 'en';
//     return subtitles
// }

module.exports = {
    spawnVideo
}