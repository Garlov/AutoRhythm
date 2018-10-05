import Phaser from 'phaser';
import { List } from 'immutable';
import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import AudioManager from 'core/AudioManager';
import Player from 'entities/Player';
import UI from 'scenes/UI';
import audioConfig from 'configs/audioConfig';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let entities = List([]);
    let UIScene;
    let background;

    function createCoin() {
        audioManager.playSfx(audioConfig.COIN_SFX.KEY);
    }

    function cameraSetup() {
        // state.cameras.main.startFollow(state.player); // or whatever else.
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
    }

    function addEntities() {
        const numberOfEntities = 3;
        for (let i = 0; i < numberOfEntities; i += 1) {
            entities = entities.push(Player());
        }
        entities.forEach((e) => {
            e.printInfo();
        });
    }

    function init() {
        // After assets are loaded.
        UIScene = UI();
        state.scene.add(gameConfig.SCENES.UI, UIScene, true);
        audioManager = AudioManager()
            .setScene(UIScene)
            .setPauseOnBlur(true)
            .init();
    }

    function create() {
        background = state.add.image(0, 0, spriteConfig.BACKGROUND.KEY);
        background.setOrigin(0, 0);
        audioManager.playBgMusic();
        createCoin();
        addEntities();
        cameraSetup();
    }

    function update(time, delta) {}

    function destroy() {
        if (background) state.background.destroy();
        if (UI) UI.destroy();
    }

    return Object.assign(state, {
        // props
        // methods
        init,
        create,
        update,
        destroy,
    });
};

export default Game;
