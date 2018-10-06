const isVisualizer = function isVisualizerFunc(state) {
    let analyser;
    let bufferLength;
    let dataArray;
    let vis;
    const alpha = 1;
    const color = 0xdddddd;

    function stop() {}

    function update() {
        state.drawVisualizer();
    }

    function drawVisualizer() {}

    function destroy() {
        if (vis) {
            vis.clear();
            vis.destroy();
        }

        if (analyser) {
            analyser.destroy();
        }
    }

    return {
        analyser,
        bufferLength,
        dataArray,
        vis,
        alpha,
        color,

        // methods
        update,
        stop,
        drawVisualizer,
        destroy,
    };
};

export default isVisualizer;
