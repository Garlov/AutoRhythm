import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import createSineWaveVisualizer from 'entities/createSineWaveVisualiser';
import createFrequencyVisualizer from 'entities/createFrequencyVisualizer';
import hasAudio from 'components/hasAudio';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const createVisualizerScene = function createVisualizerSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.VISUALIZER);
    let visualizers = [];

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
        am.stopMusic();
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

    const hasAudioState = hasAudio(state);
    const localState = {
        // props
        // methods
        create,
        visualize,
        update,
        destroy,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }, { state: hasAudioState, name: 'hasAudio' }];

    getFunctionUsage(states, 'createVisualizerScene');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
    });
};

export default createVisualizerScene;
