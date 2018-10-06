import gameConfig from 'configs/gameConfig';

const hasAudio = function hasAudioFunc(state) {
    function getAudioManager() {
        return state.scene.manager.getScene(gameConfig.SCENES.GAME).getAudioManager();
    }

    return {
        getAudioManager,
    };
};

export default hasAudio;
