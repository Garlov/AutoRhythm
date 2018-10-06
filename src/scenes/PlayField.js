import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import Board from 'entities/playField/Board';

const PlayField = function PlayFieldFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.PLAY_FIELD);
    let board;

    function init() {}

    function create() {
        board = Board(state);
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
