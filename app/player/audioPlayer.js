const Player = require('./Player');

class AudioPlayer extends Player {
    
    constructor(src) {
        super(src);
        // alert('Audio is not supported yet!');

        // Wait for the audio to finish loading and decoding
        this.addEventListener('canplaythrough', () => {
            let wf = this.calculateWaveform();
            console.log(wf);
        });
    }

    calculateWaveform = () => {
        const audioContext = new AudioContext();

        // Create an audio source from the audio element
        const audioSource = audioContext.createMediaElementSource(this);

        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 2048; // Set the FFT (Fast Fourier Transform) size

        // Connect the audio source to the analyzer
        audioSource.connect(analyzer);

        // Connect the analyzer to the audio context destination
        analyzer.connect(audioContext.destination);

        // Create an array to hold the waveform data
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        // Get the waveform data from the analyzer
        return analyzer.getByteTimeDomainData(dataArray);
    }

    visualizeWaveform = () => {
        // To-do
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