export default {
    BUFFERSIZE: 2 ** 12,
    // percentile ranges for each lane in the frequency map.
    RANGES: [0.05, 0.15, 0.4, 75],
    // sensitivity threshold in each lane before we add a note. (Lower frequencies on the left).
    THRESHOLD: [-40000, -30000, -30000, -30000],
    MAX_MODIFIER: 0.25,
    THRESHOLDMODS: {
        UP: 0.15,
        DOWN: 0.03,
    },
};
