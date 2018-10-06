import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';

const MusicSelectScene = function MusicSelectSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.MUSIC_SELECT);

    function create() {}

    function update(time, delta) {}

    return Object.assign(state, {
        // props
        // methods
        create,
    });
};

export default MusicSelectScene;
