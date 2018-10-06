import isVisualizer from 'components/isVisualizer';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';

const createSineWaveVisualizer = function createSineWaveVisualizerFunc() {
    const state = {};
    let thickness = 3;

    const isVisualizerState = isVisualizer(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);

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
        state.analyser.fftSize = 2 ** 12;

        state.bufferLength = state.analyser.fftSize;
        state.dataArray = new Uint8Array(state.bufferLength);

        // connect analyser to audio source
        audioSource.connect(state.analyser);
    }

    function setLineStyle(t, c, a) {
        thickness = t;
        state.color = c;
        state.alpha = a;
    }

    function drawVisualizer() {
        if (state.analyser && state.vis) {
            state.analyser.getByteTimeDomainData(state.dataArray);
            state.vis.clear();
            state.vis.lineStyle(thickness, state.color, state.alpha);

            const sliceWidth = (state.getWidth() * 1.0) / state.bufferLength;
            state.vis.beginPath();

            for (let i = 0; i < state.bufferLength; i += 1) {
                const v = state.dataArray[i] / 128;

                state.vis.lineTo(state.getX() + sliceWidth * i, state.getY() + (v * state.getHeight()) / 2);
            }

            state.vis.strokePath();
        }
    }

    function update() {
        drawVisualizer();
    }

    function destroy() {
        if (state.vis) {
            state.vis.clear();
            state.vis.destroy();
        }

        state.analyser = undefined;
    }

    return Object.assign(state, isVisualizerState, hasPositionState, hasSizeState, {
        // props
        // methods
        visualize,
        update,
        destroy,
        setLineStyle,
    });
};

export default createSineWaveVisualizer;
