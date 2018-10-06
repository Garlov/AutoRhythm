import gameConfig from 'configs/gameConfig';

const createSineWaveVisualizer = function createSineWaveVisualizerFunc() {
    const state = {};
    let analyser;
    let bufferLength;
    let dataArray;
    let vis;
    let width = gameConfig.GAME.VIEWWIDTH;
    let height = gameConfig.GAME.VIEWHEIGHT / 2;
    let x = 0;
    let y = gameConfig.GAME.VIEWHEIGHT / 2;
    let thickness = 3;
    let alpha = 1;
    let color = 0xdddddd;

    function visualize(parentState, audioContext, audioSource) {
        if (!parentState || !audioContext || !audioSource) {
            console.warn('Missing vital components required for visualization. A parent scene state is required for rendering, audioContext and audioSource is required for analysis.');
            return;
        }

        vis = parentState.add.graphics();

        // setup analyser and buffer
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2 ** 12;

        bufferLength = analyser.fftSize;
        dataArray = new Uint8Array(bufferLength);

        // connect analyser to audio source
        audioSource.connect(analyser);
    }

    function setSize(w, h) {
        width = w;
        height = h;
    }

    function setPosition(xp, yp) {
        x = xp;
        y = yp;
    }

    function setLineStyle(t, c, a) {
        thickness = t;
        color = c;
        alpha = a;
    }

    function drawVisualizer() {
        if (analyser) {
            analyser.getByteTimeDomainData(dataArray);
            vis.clear();
            vis.lineStyle(thickness, color, alpha);

            const sliceWidth = (width * 1.0) / bufferLength;
            vis.beginPath();

            for (let i = 0; i < bufferLength; i += 1) {
                const v = dataArray[i] / 128;

                vis.lineTo(x + sliceWidth * i, y + (v * height) / 2);
            }

            vis.strokePath();
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
        setSize,
        setPosition,
        setLineStyle,
    });
};

export default createSineWaveVisualizer;
