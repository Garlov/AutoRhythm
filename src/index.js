import 'styles/main.scss';
import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';

import BootScene from 'scenes/Boot';
import LoadScene from 'scenes/Load';
import Game from 'scenes/Game';
import resizeCanvas from 'utils/resizeCanvas';
import createKeyboardInput from 'core/Keyboard';
import store from './store';

const phaserConfig = {
    type: Phaser.WEBGL,
    width: gameConfig.GAME.VIEWWIDTH,
    height: gameConfig.GAME.VIEWHEIGHT,
    backgroundColor: '#222222',
    parent: 'game',
    scene: [BootScene, LoadScene, Game],
    audio: {
        disableWebAudio: false,
    },
};

const game = new Phaser.Game(phaserConfig);
store.keyboard = createKeyboardInput();
store.keyboard.enable();
store.phaserGame = game;


window.addEventListener('resize', resizeCanvas);
