import gameConfig from 'configs/gameConfig';
import { RFFT } from 'dsp.js';

const createMusicAnalyzer = function createMusicAnalyzerFunc() {
    const state = {};
    let analyser;
    let bufferLength;
    const samplesPerSecond = 4;
    const stepSize = 1;
    let numberOfChannels = 1;
    let sampleRate = 48000;
    // let dataArray;
    let vis;
    const width = gameConfig.GAME.VIEWWIDTH;
    const height = gameConfig.GAME.VIEWHEIGHT / 2;
    const x = 0;
    const y = gameConfig.GAME.VIEWHEIGHT;
    const thickness = 3;
    const alpha = 1;
    const color = 0xdddddd;

    const freqMap = [];
    let currentIndex = 0;

    function constrain(n, min, max) {
        if (n < min) return 0;
        if (n > max) return max;
        return n;
    }

    // equalize, attenuates low freqs and boosts highs;
    function equalize(value, i, l) {
        let v = value * (-1 * Math.log((l - i) * (0.5 / (l * 2) / 200)) * (l / 2));
        v = constrain(v * 4, 0, height);
        return -v;
    }

    function drawSummary() {
        if (freqMap[currentIndex]) {
            vis.clear();
            vis.lineStyle(thickness, color, alpha);
            const dataArray = freqMap[currentIndex];
            const sliceWidth = (width * 1.0) / dataArray.length;
            vis.beginPath();
            for (let i = 0; i < dataArray.length; i += 1) {
                const v = equalize(dataArray[i], i, dataArray.length);
                vis.lineTo(x + sliceWidth * i, y + v);
            }
            vis.strokePath();
            currentIndex += 1;
        } else {
            currentIndex = 0;
        }
    }

    function init(gameState) {
        vis = gameState.add.graphics();

        const am = gameState.getAudioManager();
        const { audioBuffer } = am.getBackgroundMusic();
        ({ numberOfChannels, sampleRate } = audioBuffer);
        const bufferSize = 2 ** 12;
        const buffer = new Float64Array(bufferSize);
        let start = 0;
        // Loop through each channel and generate a frequency spectrum map.
        for (let i = 0; i < 1; i += 1) {
            const now = performance.now();
            const channelData = audioBuffer.getChannelData(i);
            while (start + bufferSize < channelData.length) {
                buffer.set(channelData.slice(start, start + bufferSize));
                start += bufferSize;
                // Calculates a fast fourier transform spectrum.
                const fft = new RFFT(bufferSize, sampleRate);
                fft.forward(buffer);
                freqMap.push(fft.spectrum);
            }
            console.log(performance.now() - now);
        }
        drawSummary();
    }

    function update() {
        drawSummary();
    }

    return Object.assign(state, {
        // props
        // methods
        init,
        update,
    });
};

export default createMusicAnalyzer;
