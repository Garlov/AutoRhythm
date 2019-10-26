import { RFFT } from 'dsp.js';
import MersenneTwister from 'mersenne-twister';
import gameConfig from 'configs/gameConfig';
import noteConfig from 'configs/noteConfig';

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

function balanceLaneData(laneData, notesInAllLanes, rng) {
    if (notesInAllLanes <= 2) return laneData; // We don't need to balance lanes with 0 or 1 note (for now, we may want to shift this later.).

    const balancedLaneData = [].concat(laneData);

    // Reduce prevalence of 3-4 note spreads. This gets very dense very fast.
    const numberOfNotes = balancedLaneData.reduce((acc, cur) => acc + cur, 0);
    const chanceToKeepSpread = 0.01; // % chance.
    if (numberOfNotes > 3 && rng.random() > chanceToKeepSpread) {
        balancedLaneData.forEach((val, index) => {
            balancedLaneData[index] = !val; // swap from 3 or 4, to 1 or 0.
        });
    }

    return balancedLaneData;
}

function compareTresholdAndAdjustSensitivity(laneSignalSum, lastLaneIndex, currentThresholds) {
    if (laneSignalSum < currentThresholds[lastLaneIndex]) {
        currentThresholds[lastLaneIndex] += noteConfig.THRESHOLD[lastLaneIndex] * noteConfig.THRESHOLDMODS.UP; // note found, threshold increased by a set %.
        return true;
    } else {
        currentThresholds[lastLaneIndex] -= noteConfig.THRESHOLD[lastLaneIndex] * noteConfig.THRESHOLDMODS.DOWN; // no note found, threshold lowered by a set %.
        if (currentThresholds[lastLaneIndex] > noteConfig.THRESHOLD[lastLaneIndex] * noteConfig.MAX_MOD) { // We don't want to get any more sensitive. NOTE It's > and not < because thresholds are negative.
            currentThresholds[lastLaneIndex] = noteConfig.THRESHOLD[lastLaneIndex] * noteConfig.MAX_MOD;
        }
        return false;
    }
}

const createNoteMap = function createNoteMapFunc(audioBuffer, numberOfLanes, laneRanges, thresholds) {
    const { sampleRate, numberOfChannels } = audioBuffer;
    const freqMap = [];
    const bufferSize = noteConfig.BUFFERSIZE;
    const buffer = new Float64Array(bufferSize);
    let start = 0;

    const generator = new MersenneTwister(gameConfig.GAME.RNGSEED);

    /**
     * We use this to vary the magnitudal threshold based on note prevalence.
     */
    const currentThresholds = [].concat(thresholds);

    /**
     * We down-mix from stereo (or higher) to mono for the purpose of the freq map.
     * Conversion is always from two channels for now, so on files with more than two channels some detail will be lost.
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Basic_concepts_behind_Web_Audio_API#Up-mixing_and_down-mixing
     */
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

    /**
     * Split the monoChannel data into 'bufferSize' chunks, then calculate a fast fourier transform (RFFT, https://github.com/corbanbrook/dsp.js) per chunk.
     * We then process the RFFT spectrum based on a laneRange array (i.e [0.1, 0.3, 0.7, 1]) which describe what percentage range of the spectrum each game lane wants to use.
     * We summarize each lanes frequency levels, and compare against the laneIndex threshold values. We vary the thresholds based on the frequency of notes as well.
     */
    let lastLaneIndex = 0;
    while (start + bufferSize < monoData.length) {
        buffer.set(monoData.slice(start, start + bufferSize));
        start += bufferSize;
        const rfft = new RFFT(bufferSize, sampleRate);
        rfft.forward(buffer);

        const laneData = new Array(numberOfLanes).fill(false);
        let laneSignalSum = 0;
        let notesInAllLanes = 0;
        for (let i = 0; i < rfft.spectrum.length; i += 1) {
            if (i > laneRanges[laneRanges.length - 1] * rfft.spectrum.length) {
                break;
            }

            const laneIndex = getLaneIndex(i, laneRanges, rfft.spectrum.length);
            if (lastLaneIndex !== laneIndex) {
                // we've swapped lane, compare sums against threshold.
                if (compareTresholdAndAdjustSensitivity(laneSignalSum, lastLaneIndex, currentThresholds)) {
                    notesInAllLanes += 1;
                    laneData[lastLaneIndex] = true;
                }
                laneSignalSum = 0;
            }

            rfft.spectrum[i] = equalize(rfft.spectrum[i], i, rfft.spectrum.length);
            laneSignalSum += rfft.spectrum[i];

            lastLaneIndex = laneIndex;
        }
        // we've finished the lane (spectrum), compare sums against threshold. As there's likely more chunks to process, the thresholds need to be adjusted here as well.
        if (compareTresholdAndAdjustSensitivity(laneSignalSum, lastLaneIndex, currentThresholds)) {
            notesInAllLanes += 1;
            laneData[lastLaneIndex] = true;
        }

        const balancedLaneData = balanceLaneData(laneData, notesInAllLanes, generator);
        freqMap.push(balancedLaneData);
    }

    return freqMap;
};

export default createNoteMap;
