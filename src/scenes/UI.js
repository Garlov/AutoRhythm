import Phaser from 'phaser';
import Stats from 'stats-js';
import * as dat from 'dat.gui';
import gameConfig from 'configs/gameConfig';

/**
 * Layer/Scene for UI elements.
 */

const UI = function UIFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.UI);
    let gui;
    let stats;

    function setupPerformanceStats() {
        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.body.appendChild(stats.domElement);

        // TODO cleanup listeners
        state.events.on('preupdate', () => {
            stats.begin();
        });
        state.events.on('postupdate', () => {
            stats.end();
        });
    }

    function setupDatGui() {
        gui = new dat.GUI();
        gui.addFolder('Test folder');

        state.guiData = {
            name: 'name',
        };
        const guiController = gui.add(state.guiData, 'name');
        guiController.onFinishChange((name) => {
            console.log(name);
        });
    }

    function create() {
        setupDatGui();
        setupPerformanceStats();
    }

    function destroy() {
        gui.destroy();
        stats.end();
        document.body.removeChild(stats);
    }

    return Object.assign(state, {
        // props
        // methods
        create,
        destroy,
    });
};

export default UI;
