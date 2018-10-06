import gameConfig from 'configs/gameConfig';
import { RFFT } from 'dsp.js';

const createMusicAnalyzer = function createMusicAnalyzerFunc() {
    const state = {};
    let analyser;
    let bufferLength;
    const samplesPerSecond = 4;
    let stepSize = 1;
    let numberOfChannels = 1;
    let sampleRate = 48000;
    let dataArray;
    let vis;
    const width = gameConfig.GAME.VIEWWIDTH;
    const height = gameConfig.GAME.VIEWHEIGHT / 2;
    const x = 0;
    const y = gameConfig.GAME.VIEWHEIGHT / 2;
    const thickness = 3;
    const alpha = 1;
    const color = 0xdddddd;

    function drawSummary() {
        // if (analyser) {
        // analyser.getByteTimeDomainData(dataArray);
        // vis.clear();
        vis.lineStyle(thickness, color, alpha);
        // const sampleCount = bufferLength / stepSize;
        const sliceWidth = (width * 1.0) / dataArray.length;
        vis.beginPath();
        // vis.moveTo(x, y + height / 2);
        for (let i = 0; i < dataArray.length; i += 1) {
            const v = dataArray[i] / numberOfChannels + 1;
            vis.lineTo(x + sliceWidth * i, y + (v * height) / 2);
        }
        vis.lineTo(x + width, y + height / 2);
        vis.strokePath();
        // }
    }

    function init(gameState) {
        vis = gameState.add.graphics();

        const am = gameState.getAudioManager();
        const { audioBuffer } = am.getBackgroundMusic();
        bufferLength = audioBuffer.length;
        ({ numberOfChannels, sampleRate } = audioBuffer);
        stepSize = parseInt(sampleRate / samplesPerSecond);
        const buffer = new Float64Array(2 ** 20);
        dataArray = new Float64Array(buffer.length / stepSize);
        console.log(buffer.length, stepSize);

        // Loop through all channels and get X samples every second to build a summary of the song.
        for (let i = 0; i < numberOfChannels; i += 1) {
            const now = performance.now();
            buffer.set(audioBuffer.getChannelData(i).slice(0, 2 ** 20));
            const fft = new RFFT(buffer.length, sampleRate);
            fft.forward(buffer);
            console.log(fft.spectrum);
            console.log(performance.now() - now);

            // for (let j = 0, pos = 0; j < fft.spectrum.length; j += stepSize, pos += 1) {
            //     dataArray[pos] += fft.spectrum[j];
            // }
        }
        console.log(dataArray);
        // drawSummary();
    }

    return Object.assign(state, {
        // props
        // methods
        init,
    });
};

export default createMusicAnalyzer;
