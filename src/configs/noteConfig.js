export default {
    BUFFERSIZE: 2 ** 12,
    // percentile ranges for each lane in the frequency map.
    RANGES: [0.05, 0.15, 0.4, 1],
    // sensitivity threshold in each lane before we add a note. (Lower frequencies on the left).
    THRESHOLD: [-60000, -50000, -50000, -50000],
    MAX_MODIFIER: 0.25,
    THRESHOLDMODS: {
        UP: 0.15,
        DOWN: 0.03,
    },
    MIDDLE_COLOR: 0xb71c1c, // Color of the 2 middle notes
    EDGE_COLOR: 0x1565c0,
    NOTE_SPEED: 100, // Speed at which the notes fall down the screen (higher number reduces note density)
    NOTE_RADIUS: 40,
    RECEPTOR_MODES: {
        GRADIENT: 'gradient',
        CIRCLE: 'circle',
        ARROWS: 'arrows',
    },
    RECEPTOR_MODE: 'arrows',
};
