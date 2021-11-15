import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import eventConfig from 'configs/eventConfig';

const MainMenuScene = function MainMenuSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.MAIN_MENU);
    let titleText;
    let graphicsObj;

    const options = [
        {
            text: 'Start Game',
            scene: gameConfig.SCENES.MUSIC_SELECT,
        },
        {
            text: 'Key config',
            scene: gameConfig.SCENES.KEY_CONFIG,
        },
        {
            text: 'Options',
            scene: gameConfig.SCENES.OPTIONS,
        },
    ];

    const optionTexts = [];
    let currentOption = 0;

    function _writeOptions() {
        graphicsObj.clear();
        options.forEach((key, i) => {
            const exists = optionTexts[i];
            const option = exists ? optionTexts[i] : state.add.text();
            const fontSize = i === currentOption ? 50 : 25;
            const fill = i === currentOption ? '#81c784' : '#eeeeee';

            option.setText(options[i].text);
            option.setPosition(gameConfig.GAME.VIEWWIDTH / 2, 200 + i * 60);
            option.setFont(`${fontSize}px Arial`);
            option.setFill(fill);
            option.setAlign('center');
            option.setOrigin(0.5);
            option.setStroke('#000000', 3);

            if (i === currentOption) {
                graphicsObj.lineStyle(5, 0xffffff, 1);
                graphicsObj.beginPath();
                graphicsObj.moveTo(option.x - option.width / 2, option.y + option.height / 2);
                graphicsObj.lineTo(option.x + option.width / 2, option.y + option.height / 2);
                graphicsObj.strokePath();
            }

            if (!exists) optionTexts.push(option);
        });
    }

    function _selectOption() {
        state.emitGlobal(eventConfig.EVENTS.MENU.SELECTED_ITEM, {
            scene: options[currentOption].scene,
        });
    }


    function _navigateUp() {
        currentOption -= 1;
        if (currentOption < 0) {
            currentOption = options.length - 1;
        }

        _writeOptions();
    }

    function _navigateDown() {
        currentOption += 1;
        if (currentOption > options.length - 1) {
            currentOption = 0;
        }
        _writeOptions();
    }

    // TODO Key Config...
    function _onKeyDown(e) {
        if (
            e.keyCode === gameConfig.KEYS.LEFT_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.UP_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.Z.CODE
        ) {
            _navigateUp();
        }

        if (
            e.keyCode === gameConfig.KEYS.RIGHT_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.DOWN_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.DOT.CODE
        ) {
            _navigateDown();
        }

        if (e.keyCode === gameConfig.KEYS.ENTER.CODE) {
            _selectOption();
        }
    }

    function create() {
        if (!titleText) {
            titleText = state.add.text(gameConfig.GAME.VIEWWIDTH / 2, 20, 'AutoRhythm', {
                font: '72px Arial',
                fill: '#eeeeee',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
            });
            titleText.x -= titleText.width / 2;
        }

        if (!graphicsObj) {
            graphicsObj = state.add.graphics();
        }

        state.listenOn(state.getKeyboard(), 'keydown', _onKeyDown);
        _writeOptions();
    }

    function update(time, delta) { }

    function destroy() { }

    const hasInputState = hasInput(state);
    const canListenState = canListen(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        // methods
        create,
        update,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: hasInputState, name: 'hasInput' },
        { state: canListenState, name: 'canListen' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'MainMenu');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default MainMenuScene;
