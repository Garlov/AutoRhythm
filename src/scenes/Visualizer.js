import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import createSineWaveVisualizer from 'entities/createSineWaveVisualiser';
import createFrequencyVisualizer from 'entities/createFrequencyVisualizer';
import hasAudio from 'components/hasAudio';

const createVisualizerScene = function createVisualizerSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.VISUALIZER);
    let visualizers = [];

    const hasAudioState = hasAudio(state);

    function create() {
        // // instantiate visualizers
        const sineViz = createSineWaveVisualizer();
        const freqViz = createFrequencyVisualizer();

        sineViz.setSize({ width: gameConfig.GAME.VIEWWIDTH / 2.5, height: gameConfig.GAME.VIEWHEIGHT / 3 });
        sineViz.setPosition({ x: gameConfig.GAME.VIEWWIDTH / 2, y: gameConfig.GAME.VIEWHEIGHT - sineViz.getHeight() / 1.5 });

        freqViz.setSize({ width: gameConfig.GAME.VIEWWIDTH / 2.5, height: gameConfig.GAME.VIEWHEIGHT / 3 });
        freqViz.setPosition({ x: 0, y: gameConfig.GAME.VIEWHEIGHT - freqViz.getHeight() / 1.5 });

        visualizers.push(sineViz);
        visualizers.push(freqViz);
    }

    function visualize(key) {
        const am = state.getAudioManager();
        am.pauseMusic();
        am.playMusic(key);

        visualizers.forEach((viz) => {
            viz.visualize(state.scene.manager.getScene(gameConfig.SCENES.GAME), am.getAudioContext(key), am.getAudioSource(key));
        });
    }

    function update(time, delta) {
        visualizers.forEach((viz) => {
            viz.update();
        });
    }

    function destroy() {
        visualizers.forEach(viz => viz.destroy());
        visualizers = [];
    }

    return Object.assign(state, hasAudioState, {
        // props
        // methods
        create,
        visualize,
        update,
        destroy,
    });
};

export default createVisualizerScene;
