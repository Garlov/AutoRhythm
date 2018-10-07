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
    const { sampleRate, numberOfChannels } = audioBuffer;
    const freqMap = [];
    const bufferSize = 2 ** 12;
    const buffer = new Float64Array(bufferSize);
    let start = 0;

    /**
     * We down-mix from stereo (or higher) to mono for the purpose of the freq map.
     * Conversion is always from stereo, so on files with more than two channels some detail will be lost.
     */
    // const now = performance.now();
    let monoData = [];
    if (numberOfChannels === 1) {
        monoData = audioBuffer.getChannelData(0);
    } else if (numberOfChannels >= 2) {
        const left = audioBuffer.getChannelData(0);
        const right = audioBuffer.getChannelData(1);

        for (let i = 0; i < left.length; i += 1) {
            monoData.push(0.5 * (left[i] + right[i]));
        }
    }

    // console.log(performance.now() - now);
    // Generate a frequency map in spectrum chunks, using a (RFFT) fast fourier transform.
    while (start + bufferSize < monoData.length) {
        buffer.set(monoData.slice(start, start + bufferSize));
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

    return freqMap;
};

export default createFrequencyMap;
