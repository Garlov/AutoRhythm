import Phaser from 'phaser';
import Stats from 'stats-js';
import * as dat from 'dat.gui';
import gameConfig from 'configs/gameConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import noteConfig from 'configs/noteConfig';
import store from '../store';

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
        stats.domElement.style.right = '0px';
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

    // Recreate textures when we change the colors.
    function triggerTextureRecreation() {
        store.game.createTextures();
    }

    function setupDatGui() {
        gui = new dat.GUI();
        // HACK -- We don't want the gui to be visible during gameplay. Closing it still allows re-opening.
        dat.GUI.prototype.hide = () => {
            gui.domElement.setAttribute('hidden', true);
        };

        dat.GUI.prototype.show = () => {
            gui.domElement.removeAttribute('hidden');
        };

        const folder = gui.addFolder('Settings');
        state.guiData = Object.assign({}, noteConfig, gameConfig.HEALTH);
        // No fail mode.
        folder.add(gameConfig.HEALTH, 'FAIL_OFF').listen().onChange((v) => {
            gameConfig.HEALTH.FAIL_OFF = v;
        });

        // Receptor mode.
        folder.add(noteConfig, 'RECEPTOR_MODE', noteConfig.RECEPTOR_MODES).onChange((v) => {
            noteConfig.RECEPTOR_MODE = v;
            triggerTextureRecreation(); // Recreate note textures from i.e circle to arrow.
        });

        folder.add(noteConfig, 'NOTE_SPEED', 25, 250).listen().onChange((v) => {
            noteConfig.NOTE_SPEED = v;
        });

        folder.add(noteConfig, 'NOTE_RADIUS', 25, 75).listen().onChange((v) => {
            noteConfig.NOTE_RADIUS = v;
            triggerTextureRecreation();
        });

        // Note Colors.
        folder.addColor(noteConfig, 'EDGE_COLOR').listen().onChange((v) => {
            noteConfig.EDGE_COLOR = v;
            triggerTextureRecreation();
        });

        folder.addColor(noteConfig, 'MIDDLE_COLOR').listen().onChange((v) => {
            noteConfig.MIDDLE_COLOR = v;
            triggerTextureRecreation();
        });

        const senseFolder = folder.addFolder('AI Generation - Difficulty/Sensitivity');

        // Adjust sensitivity
        const dynamicAdjust = senseFolder.addFolder('dynamic sense adjust');
        dynamicAdjust.add(noteConfig.THRESHOLDMODS, 'UP', 0, 0.5).listen().onChange((v) => {
            noteConfig.THRESHOLDMODS.UP = v;
        });

        dynamicAdjust.add(noteConfig.THRESHOLDMODS, 'DOWN', 0, 0.5).listen().onChange((v) => {
            noteConfig.THRESHOLDMODS.DOWN = v;
        });

        const ranges = {
            leftLaneRange: noteConfig.RANGES[0],
            downLaneRange: noteConfig.RANGES[1],
            upLaneRange: noteConfig.RANGES[2],
            rightLaneRange: noteConfig.RANGES[3],
        };

        const rangeFolder = senseFolder.addFolder('% of the spectrum lane covers.');
        rangeFolder.add(ranges, 'leftLaneRange', 0, 1, 0.01).listen().onChange((v) => {
            noteConfig.RANGES[0] = v;
        });
        rangeFolder.add(ranges, 'downLaneRange', 0, 1, 0.01).listen().onChange((v) => {
            noteConfig.RANGES[1] = v;
        });
        rangeFolder.add(ranges, 'upLaneRange', 0, 1, 0.01).listen().onChange((v) => {
            noteConfig.RANGES[2] = v;
        });
        rangeFolder.add(ranges, 'rightLaneRange', 0, 1, 0.01).listen().onChange((v) => {
            noteConfig.RANGES[3] = v;
        });

        const thresholds = {
            leftLaneThreshold: noteConfig.THRESHOLD[0],
            downLaneThreshold: noteConfig.THRESHOLD[1],
            upLaneThreshold: noteConfig.THRESHOLD[2],
            rightLaneThreshold: noteConfig.THRESHOLD[3],
        };

        rangeFolder.open();

        const thresholdFolder = senseFolder.addFolder('Threshold at which the lane places a note.');
        thresholdFolder.add(thresholds, 'leftLaneThreshold', -80000, -5000).listen().onChange((v) => {
            noteConfig.THRESHOLD[0] = v;
        });
        thresholdFolder.add(thresholds, 'downLaneThreshold', -80000, -5000).listen().onChange((v) => {
            noteConfig.THRESHOLD[1] = v;
        });
        thresholdFolder.add(thresholds, 'upLaneThreshold', -80000, -5000).listen().onChange((v) => {
            noteConfig.THRESHOLD[2] = v;
        });
        thresholdFolder.add(thresholds, 'rightLaneThreshold', -80000, -5000).listen().onChange((v) => {
            noteConfig.THRESHOLD[3] = v;
        });
        thresholdFolder.open();

        store.settings = folder;
    }

    function getGUIRef() {
        return gui;
    }

    function create() {
        setupDatGui();
        // setupPerformanceStats();
    }

    function destroy() {
        gui.destroy();
        stats.end();
        document.body.removeChild(stats);
    }

    const localState = {
        // methods
        getGUIRef,
        create,
        destroy,
    };

    const states = [{ state, name: 'state' }, { state: localState, name: 'localState' }];

    getFunctionUsage(states, 'UIScene');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
    });
};

export default UI;
