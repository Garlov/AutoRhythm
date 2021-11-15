import noteConfig from 'configs/noteConfig';
import store from '../store';
import Phaser from 'phaser';

function createArrowTexture(scene, fillColor, strokeWidth, strokeColor, key, scale = 0.6) {
    if (store.game.textures.exists(key)) {
        store.game.textures.remove(key);
    }

    const width = 165 * scale;
    const height = 160 * scale;
    const d = new Phaser.GameObjects.Graphics(scene);

    d.beginPath();
    d.fillStyle(fillColor);
    d.lineStyle(strokeWidth, strokeColor);
    d.moveTo(60 * scale, 0); // top left
    d.lineTo(90 * scale, 0); // top right
    d.lineTo(90 * scale, 100 * scale); // middle-bottom-right
    d.lineTo(130 * scale, 65 * scale); // top-middle-right
    d.lineTo(150 * scale, 85 * scale); // top-middle-down-right
    d.lineTo(75 * scale, 155 * scale); // bottom
    d.lineTo(0, 85 * scale); // top-middle-down-left
    d.lineTo(20 * scale, 65 * scale); // top-middle-left
    d.lineTo(60 * scale, 100 * scale); // middle-bottom-left
    d.closePath();
    d.fillPath();
    d.strokePath();
    d.generateTexture(key, width, height);
    d.destroy();
}

function createCircleTexture(scene, strokeWidth, color, key) {
    if (store.game.textures.exists(key)) {
        store.game.textures.remove(key);
    }

    const d = new Phaser.GameObjects.Graphics(scene);
    d.fillStyle(color, 1);
    d.fillCircle(noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS - strokeWidth);
    d.lineStyle(strokeWidth, 0x000000, 1);
    d.strokeCircle(noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS + strokeWidth, noteConfig.NOTE_RADIUS);
    d.generateTexture(key, 2 * (noteConfig.NOTE_RADIUS + strokeWidth), 2 * (noteConfig.NOTE_RADIUS + strokeWidth));
    d.destroy();
}

function createTextures(scene) {
    if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.CIRCLE || noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.GRADIENT) {
        createCircleTexture(scene, 2, noteConfig.EDGE_COLOR, 'edgeNote');
        createCircleTexture(scene, 2, noteConfig.MIDDLE_COLOR, 'middleNote');
        createCircleTexture(scene, 2, 0xAAAAAA, 'circleReceptor');
    } else if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.ARROWS) {
        createArrowTexture(scene, noteConfig.EDGE_COLOR, 3, 0xCCCCCC, 'edgeNote');
        createArrowTexture(scene, noteConfig.MIDDLE_COLOR, 3, 0xCCCCCC, 'middleNote');
        createArrowTexture(scene, 0x444444, 3, 0xCCCCCC, 'receptor', 0.63);
    }
}

export default createTextures;
