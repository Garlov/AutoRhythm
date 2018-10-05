import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import AudioManager from 'core/AudioManager';
import UI from 'scenes/UI';

/**
 * Responsible for delegating the various levels, holding the various core systems and such.
 */
const Game = function GameFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.GAME);
    let audioManager;
    let UIScene;
    let background;
    let analyser;
    let bufferLength;
    let dataArray;
    let vis;

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

    function create() {
        cameraSetup();
        // start music
        audioManager.playBgMusic();
        // instatiate visulizer
        vis = state.add.graphics();
        // create context
        const audioCtx = audioManager.getBackgroundMusic().source.context;
        // setup analyser and buffer
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        bufferLength = analyser.fftSize;
        dataArray = new Uint8Array(bufferLength);
        // connect analyser to audio context/source
        audioManager.getBackgroundMusic().source.connect(analyser);
    }

    function drawVisulizer() {
        if (analyser) {
            analyser.getByteTimeDomainData(dataArray);
            vis.clear();
            vis.lineStyle(5, 0xff0000, 1);
            const width = gameConfig.GAME.VIEWWIDTH;
            const height = gameConfig.GAME.VIEWHEIGHT;
            const sliceWidth = (width * 1.0) / bufferLength;
            let x = 0;
            vis.beginPath();
            vis.moveTo(0, height / 2);

            for (let i = 0; i < bufferLength; i += 1) {
                const v = dataArray[i] / 128;
                const y = (v * height) / 2;
                vis.lineTo(x, y);
                x += sliceWidth;
            }

            vis.lineTo(width, height / 2);
            vis.strokePath();
        }
    }

    function update(time, delta) {
        drawVisulizer();
    }

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
