import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';
import createSineWaveVisualizer from 'entities/createSineWaveVisualiser';
import createFrequencyVisualizer from 'entities/createFrequencyVisualizer';
import createMusicAnalyzer from 'entities/musicAnalyzer';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let UIScene;
    const visualizers = [];

    function cameraSetup() {
        // state.cameras.main.startFollow(state.player); // or whatever else.
        state.cameras.main.setViewport(0, 0, gameConfig.GAME.VIEWWIDTH, gameConfig.GAME.VIEWHEIGHT);
        state.cameras.main.setZoom(0.8);
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

    function getAudioManager() {
        return audioManager;
    }

    function create() {
        cameraSetup();
        // start music
        audioManager.playBgMusic();

        // instatiate visualizers
        // visualizers.push(createSineWaveVisualizer());
        // visualizers.push(createFrequencyVisualizer());

        // visualizers.forEach((viz, i) => {
        //     viz.init(state);
        // });

        const analyzer = createMusicAnalyzer();
        analyzer.init(state);
    }

    function update(time, delta) {
        visualizers.forEach((viz) => {
            viz.update();
        });
    }

    function destroy() {
        if (UI) UI.destroy();
    }

    return Object.assign(state, {
        // props
        // methods
        init,
        getAudioManager,
        create,
        update,
        destroy,
    });
};

export default Game;
