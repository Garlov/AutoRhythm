import isVisualizer from 'components/isVisualizer';
import hasPosition from 'components/hasPosition';
import hasSize from 'components/hasSize';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const createSineWaveVisualizer = function createSineWaveVisualizerFunc() {
    const state = {};
    let thickness = 3;

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

    function stop() {
        if (state.vis) {
            state.vis.clear();
        }
    }

    function destroy() {
        if (state.vis) {
            state.vis.clear();
            state.vis.destroy();
        }

        state.analyser = undefined;
    }

    const isVisualizerState = isVisualizer(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);

    const localState = {
        // props
        // methods
        visualize,
        update,
        destroy,
        setLineStyle,
        stop,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isVisualizerState, name: 'isVisualizer' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSizeState, name: 'hasSize' },
    ];

    getFunctionUsage(states, 'createSineWaveVisualizer');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: localState.update,
        destroy: pipe(
            localState.destroy,
            isVisualizerState.destroy,
        ),
        stop: pipe(
            localState.stop,
            isVisualizerState.stop,
        ),
    });
};

export default createSineWaveVisualizer;
