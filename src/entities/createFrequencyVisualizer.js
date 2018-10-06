import isVisualizer from 'components/isVisualizer';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';

const createFrequencyVisualizer = function createFrequencyVisualizerFunc() {
    const state = {};

    const isVisualizerState = isVisualizer(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);

    function setFillStyle(c, a) {
        state.color = c;
        state.alpha = a;
    }

    function visualize(parentState, audioContext, audioSource) {
        if (!parentState || !audioContext || !audioSource) {
            console.warn('Missing vital components required for visualization. A parent scene state is required for rendering, audioContext and audioSource is required for analysis.');
            return;
        }

        if (!state.vis) {
            state.vis = parentState.add.graphics();
        }

        // setup analyser and buffer
        state.analyser = audioContext.createAnalyser();
        state.analyser.smoothingTimeConstant = 0;
        state.analyser.fftSize = 256;
        state.bufferLength = state.analyser.frequencyBinCount;
        state.dataArray = new Uint8Array(state.bufferLength);

        // connect analyser to audio source
        audioSource.connect(state.analyser);
    }

    function drawVisualizer() {
        if (state.analyser && state.vis) {
            state.analyser.getByteFrequencyData(state.dataArray);

            state.vis.clear();
            state.vis.fillStyle(state.color, state.alpha);
            state.vis.lineStyle(2, state.color, state.alpha);

            const barWidth = state.getWidth() / state.bufferLength;
            let barHeight;

            for (let i = 0; i < state.bufferLength; i += 1) {
                barHeight = (state.getHeight() / 255) * state.dataArray[i];
                state.vis.strokeRect(state.getX() + barWidth * i, state.getY() + state.getHeight() - barHeight, barWidth, barHeight);
            }
        }
    }

    function destroy() {
        if (state.vis) {
            state.vis.clear();
            state.vis.destroy();
        }

        state.analyser = undefined;
    }

    function stop() {
        if (state.vis) {
            state.vis.clear();
        }
    }

    function update() {
        drawVisualizer();
    }

    return Object.assign(state, isVisualizerState, hasPositionState, hasSizeState, {
        // props
        // methods
        visualize,
        destroy,
        update,
        setFillStyle,
        stop,
    });
};

export default createFrequencyVisualizer;
