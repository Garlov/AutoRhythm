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

function getLaneIndex(i, lanePercents, laneLength) {
    for (let j = 0; j < lanePercents.length; j += 1) {
        if (i < lanePercents[j] * laneLength) {
            return j;
        }
    }

    return 0;
}

const createNoteMap = function createNoteMapFunc(audioBuffer, numberOfLanes, laneRanges, thresholds) {
    const { sampleRate, numberOfChannels } = audioBuffer;
    const freqMap = [];
    const bufferSize = 2 ** 12;
    const buffer = new Float64Array(bufferSize);
    let start = 0;

    /**
     * We use these to vary the magnitudal threshold based on note prevalence.
     */
    const defaultThresholds = [].concat(thresholds);
    const currentThresholds = [].concat(thresholds);

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
    // Generate a frequency map in spectrum chunks, using a fast fourier transform. (RFFT)
    let lastLaneIndex = 0;
    while (start + bufferSize < monoData.length) {
        buffer.set(monoData.slice(start, start + bufferSize));
        start += bufferSize;
        // Calculates a fast fourier transform spectrum.
        const fft = new RFFT(bufferSize, sampleRate);
        fft.forward(buffer);

        let laneSignalSum = 0;
        const laneData = new Array(numberOfLanes).fill(false);
        for (let i = 0; i < fft.spectrum.length; i += 1) {
            if (i > laneRanges[laneRanges.length - 1] * fft.spectrum.length) {
                // if (laneSignalSum < thresholds[lastLaneIndex]) {
                //     laneData[lastLaneIndex] = true;
                // }
                break;
            }

            const laneIndex = getLaneIndex(i, laneRanges, fft.spectrum.length);
            if (lastLaneIndex !== laneIndex) {
                if (laneSignalSum < currentThresholds[lastLaneIndex]) {
                    laneData[lastLaneIndex] = true;
                    currentThresholds[lastLaneIndex] += defaultThresholds[lastLaneIndex] * 0.1;
                } else {
                    currentThresholds[lastLaneIndex] -= defaultThresholds[lastLaneIndex] * 0.01;
                }

                laneSignalSum = 0;
            }

            fft.spectrum[i] = equalize(fft.spectrum[i], i, fft.spectrum.length);
            laneSignalSum += fft.spectrum[i];

            lastLaneIndex = laneIndex;
        }

        if (laneSignalSum < currentThresholds[lastLaneIndex]) {
            laneData[lastLaneIndex] = true;
            currentThresholds[lastLaneIndex] += defaultThresholds[lastLaneIndex] * 0.1;
        } else {
            currentThresholds[lastLaneIndex] -= defaultThresholds[lastLaneIndex] * 0.01;
        }

        freqMap.push(laneData);
    }

    return freqMap;
};

export default createNoteMap;
