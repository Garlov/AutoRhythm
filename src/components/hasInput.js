import store from '../store';

const hasInput = function hasInputFunc(state) {
    function getKeyboard() {
        return store.keyboard;
    }

    return {
        getKeyboard,
    };
};

export default hasInput;
