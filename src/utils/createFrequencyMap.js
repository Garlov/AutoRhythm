import { RFFT } from 'dsp.js';

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
            freqMap.push(fft.spectrum);
        }
        // console.log(performance.now() - now);
    }

    return freqMap;
};

export default createFrequencyMap;
