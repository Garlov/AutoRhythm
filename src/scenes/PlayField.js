import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import Board from 'entities/playField/Board';
import createFrequencyMap from 'utils/createFrequencyMap';

const PlayField = function PlayFieldFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.PLAY_FIELD);
    let board;

    function init() {}

    function create() {
        const currentSong = state.scene.manager
            .getScene(gameConfig.SCENES.GAME)
            .getAudioManager()
            .getCurrentSong();
        const freqMap = createFrequencyMap(currentSong.audioBuffer);

        board = Board(state);
        board.setFrequencyMap(currentSong, freqMap);
        board.init();
    }

    function update(time, delta) {
        board.update();
    }

    function destroy() {}

    return Object.assign(state, {
        // props
        // methods
        init,
        create,
        update,
        destroy,
    });
};

export default PlayField;
