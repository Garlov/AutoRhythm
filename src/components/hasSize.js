const hasSize = function hasSizeFunc(state) {
    let width = 0;
    let height = 0;

    function setSize({ width: wp, height: hp }) {
        width = wp;
        height = hp;

        return { width, height };
    }

    function setWidth(wp) {
        state.setSize(wp, height);
        return wp;
    }

    function setHeight(hp) {
        state.setSize(width, hp);
        return hp;
    }

    function getWidth() {
        return width;
    }

    function getHeight() {
        return height;
    }

    return {
        // props
        // methods
        setSize,
        setWidth,
        setHeight,
        getWidth,
        getHeight,
    };
};

export default hasSize;
