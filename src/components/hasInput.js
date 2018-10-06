import gameConfig from 'configs/gameConfig';

const hasInput = function hasInputFunc(state) {
    function getKeyboard() {
        return state.scene.manager.getScene(gameConfig.SCENES.GAME).getKeyboard();
    }

    return {
        getKeyboard,
    };
};

export default hasInput;
