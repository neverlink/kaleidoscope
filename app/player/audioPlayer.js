const Player = require('./Player');

class AudioPlayer extends Player {
    constructor(src) {
        super(src);
        alert('Audio is not supported yet!');
    }
    
    // spawnAudio = (fileURI) => {
    //     audioContainer = document.createElement('audio');
    //     audioContainer.style.width = '800px';
    //     audioContainer.style.height = '250px';
    //     playerContainer.appendChild(audioContainer);
    
    //     wf = document.createElement('div');
    //     wf.setAttribute('id', 'waveform');
    //     playerContainer.appendChild(wf);
    
    //     var wavesurfer = WaveSurfer.create({
    //         container: '#waveform',
    //         waveColor: 'violet',
    //         progressColor: 'purple'
    //     });
    
    //     wavesurfer.on('ready', function () {
    //         wavesurfer.play();
    //     });
    
    //     wavesurfer.load(fileURI);
    //     return wf;
    // }
}

module.exports = AudioPlayer;