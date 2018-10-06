import canEmit from 'components/canEmit';
import gameConfig from 'configs/gameConfig';

const createKeyboardInput = function createKeyboardInputFunc() {
    const state = {};
    const canEmitState = canEmit(state);

    function keyDownFn(e) {
        state.emit(gameConfig.EVENTS.KEYDOWN, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function keyUpFn(e) {
        state.emit(gameConfig.EVENTS.KEYUP, { key: e.key, repeat: e.repeat, keyCode: e.keyCode });
    }

    function enable() {
        document.addEventListener('keydown', keyDownFn);
        document.addEventListener('keyup', keyUpFn);
    }

    function disable() {
        document.removeEventListener('keydown', keyDownFn);
        document.removeEventListener('keyup', keyUpFn);
    }

    return Object.assign(state, canEmitState, {
        // props
        // methods
        disable,
        enable,
    });
};

export default createKeyboardInput;
