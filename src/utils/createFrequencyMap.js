import { RFFT } from 'dsp.js';

function constrain(n, min, max) {
    if (n < min) return 0;
    if (n > max) return max;
    return n;
}

// equalize, attenuates low freqs and boosts highs;
function equalize(value, i, l) {
    let v = value * (-1 * Math.log((l - i) * (0.5 / (l * 2) / 200)) * (l / 2));
    v = constrain(v * 4, 0, 600);
    return -v;
}

const createFrequencyMap = function createFrequencyMapFunc(audioBuffer) {
    const { sampleRate } = audioBuffer;
    const freqMap = [];
    const bufferSize = 2 ** 12;
    const buffer = new Float64Array(bufferSize);
    let start = 0;
    // Loop through each channel and generate a frequency spectrum map.
    for (let i = 0; i < 1; i += 1) {
        // const now = performance.now();
        const channelData = audioBuffer.getChannelData(i);
        while (start + bufferSize < channelData.length) {
            buffer.set(channelData.slice(start, start + bufferSize));
            start += bufferSize;
            // Calculates a fast fourier transform spectrum.
            const fft = new RFFT(bufferSize, sampleRate);
            fft.forward(buffer);
            for (let j = 0; j < fft.spectrum.length; j += 1) {
                fft.spectrum[j] = equalize(fft.spectrum[j], j, fft.spectrum.length);
            }
            freqMap.push(fft.spectrum);
        }
        // console.log(performance.now() - now);
    }

    return freqMap;
};

export default createFrequencyMap;
