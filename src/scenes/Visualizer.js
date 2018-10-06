import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import createSineWaveVisualizer from 'entities/createSineWaveVisualiser';
import createFrequencyVisualizer from 'entities/createFrequencyVisualizer';
import audioConfig from 'configs/audioConfig';

const createVisualizerScene = function createVisualizerSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.VISUALIZER);
    const visualizers = [];

    function create() {
        // // instantiate visualizers
        visualizers.push(createSineWaveVisualizer());
        visualizers.push(createFrequencyVisualizer());

        state.visualize();
    }

    function _getAudioManager() {
        return state.scene.manager.getScene(gameConfig.SCENES.GAME).getAudioManager();
    }

    function visualize(key = audioConfig.MUSIC.BOWERS_WILKINS.KEY) {
        const am = _getAudioManager();
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
    }

    return Object.assign(state, {
        // props
        // methods
        create,
        visualize,
        update,
        destroy,
    });
};

export default createVisualizerScene;
