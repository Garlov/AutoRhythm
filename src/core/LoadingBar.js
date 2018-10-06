import gameConfig from 'configs/gameConfig';
import getFunctionUsage from 'utils/getFunctionUsage';

/**
 * A multipurpose loading bar that can be added to any scene.
 */
const LoadingBar = function LoadingBarFunc() {
    const state = {};
    let x = 0;
    let y = 0;
    let parentScene;
    let loaderBg;
    let progressBar;
    let text;
    const width = gameConfig.GAME.VIEWWIDTH * 0.4;
    const height = gameConfig.GAME.VIEWHEIGHT * 0.025;
    const padding = 2;
    const textPaddingFromBar = 10;

    function updateProgressBar(progress) {
        if (!progressBar) {
            progressBar = parentScene.add.graphics();
        }
        progressBar.clear();
        progressBar.fillStyle(0xcccccc, 1);
        progressBar.fillRect(x - width / 2, y - height / 2, width * progress, height);
    }

    function init(newParent, newX = 400, newY = 400) {
        x = newX;
        y = newY;
        parentScene = newParent;

        loaderBg = parentScene.add.graphics();
        loaderBg.fillStyle(0x444444, 1);
        loaderBg.fillRect(x - width / 2 - padding, y - height / 2 - padding, width + padding * 2, height + padding * 2);

        // text = parentScene.add.text(x, y, 'Loading...', {
        //     font: '16px Arial',
        //     fill: '#eeeeee',
        //     align: 'center',
        // });
        // text.setOrigin(0.5, 1);
        // text.y -= text.height + textPaddingFromBar;

        parentScene.load.on('progress', updateProgressBar, state);
    }

    function destroy() {
        if (loaderBg) loaderBg.destroy();
        if (progressBar) progressBar.destroy();
        if (text) text.destroy();
    }

    const localState = {
        // methods
        init,
        destroy,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];
    getFunctionUsage(states, 'LoadingBar');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};
export default LoadingBar;
