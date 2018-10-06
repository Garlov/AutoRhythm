import gameConfig from 'configs/gameConfig';

const createFrequencyVisualizer = function createFrequencyVisualizerFunc() {
    const state = {};
    let analyser;
    let bufferLength;
    let dataArray;
    let vis;
    const width = gameConfig.GAME.VIEWWIDTH;
    const height = gameConfig.GAME.VIEWHEIGHT / 2;
    const x = 0;
    const y = 0;
    let alpha = 1;
    let color = 0xdddddd;

    function setFillStyle(c, a) {
        color = c;
        alpha = a;
    }

    function visualize(parentState, audioContext, audioSource) {
        if (!parentState || !audioContext || !audioSource) {
            console.warn('Missing vital components required for visualization. A parent scene state is required for rendering, audioContext and audioSource is required for analysis.');
            return;
        }

        vis = parentState.add.graphics();

        // setup analyser and buffer
        analyser = audioContext.createAnalyser();
        analyser.smoothingTimeConstant = 0;
        analyser.fftSize = 256;

        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // connect analyser to audio source
        audioSource.connect(analyser);
    }

    function drawVisualizer() {
        if (analyser) {
            analyser.getByteFrequencyData(dataArray);

            vis.clear();
            vis.fillStyle(color, alpha);
            vis.lineStyle(2, color, alpha);

            const barWidth = width / bufferLength;
            let barHeight;

            for (let i = 0; i < bufferLength; i += 1) {
                barHeight = (height / 255) * dataArray[i];
                vis.strokeRect(x + barWidth * i, y + height - barHeight, barWidth, barHeight);
            }
        }
    }

    function update() {
        drawVisualizer();
    }

    return Object.assign(state, {
        // props
        // methods
        visualize,
        update,
        setFillStyle,
    });
};

export default createFrequencyVisualizer;
