const Player = require('./Player');

class AudioPlayer extends Player {
    constructor(src) {
        super(src);

        console.log(this.src);
        
        this.addEventListener('canplaythrough', async () => {
            this.waveform = await this.createWaveform();
            playerContainer.appendChild(this.waveform);
        }, { once: true });
    }

    get width() { return 800 }
    get height() { return 400 }

    getLoudnessData = async () => {
        const response = await fetch(this.src);
        const arrayBuffer = await response.arrayBuffer();
        
        const audioCtx = new AudioContext();
        const audioData = await audioCtx.decodeAudioData(arrayBuffer);
        return audioData.getChannelData(0);
    }

    createWaveform = async () => {
        const waveform = document.querySelector('canvas#waveform');
        waveform.width = playerContainer.offsetWidth;
        waveform.height = playerContainer.offsetHeight;

        const wf = waveform.getContext("2d");
        // wf.lineCap = 'round'
        // wf.lineJoin = 'round'
        wf.fillStyle = "rgba(, 50, 150, 0.5)"; // Set background color
        wf.fillRect(0, 0, waveform.width, waveform.height); // Fill background
        wf.fillStyle = "gray"; // Set waveform color

        let samples = await this.getLoudnessData();
        for (let x = 0; x < samples.length / 4; x+=4) {
            let amplitude = samples[x] * waveform.height;
            wf.fillRect(x, waveform.height / 2 - amplitude / 2, 1, amplitude);
        }
        return waveform
    }
}

module.exports = AudioPlayer;