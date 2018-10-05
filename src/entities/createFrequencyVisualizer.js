import gameConfig from 'configs/gameConfig';

const createFrequencyVisualizer = function createFrequencyVisualizerFunc() {
    const state = {};
    let analyser;
    let bufferLength;
    let dataArray;
    let vis;
    let width = gameConfig.GAME.VIEWWIDTH;
    let height = gameConfig.GAME.VIEWHEIGHT / 2;
    let x = 0;
    let y = 0;
    let alpha = 1;
    let color = 0xdddddd;

    function setSize(w, h) {
        width = w;
        height = h;
    }

    function setPosition(xp, yp) {
        x = xp;
        y = yp;
    }

    function setFillStyle(c, a) {
        color = c;
        alpha = a;
    }

    function init(gameState) {
        vis = gameState.add.graphics();

        // setup analyser and buffer
        const am = gameState.getAudioManager();
        analyser = am.getAudioContext().createAnalyser();
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        // connect analyser to audio context/source
        am.getAudioSource().connect(analyser);
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
        init,
        update,
        setSize,
        setPosition,
        setFillStyle,
    });
};

export default createFrequencyVisualizer;
