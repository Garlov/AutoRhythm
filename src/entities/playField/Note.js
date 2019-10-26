import isGameEntity from 'components/entities/isGameEntity';
import hasPosition from 'components/hasPosition';
import canEmit from 'components/canEmit';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import noteConfig from 'configs/noteConfig';
import Phaser from 'phaser';

const Note = function NoteFunc(parent) {
    const state = {};
    let isDestroyed = false;
    let board = parent;
    let index = 0;
    let sprite;
    const noteSize = noteConfig.NOTE_RADIUS;
    let noteEffect;
    let noteEffectSize = noteSize;
    const noteEffectPos = { x: 0, y: 0 };

    function drawNoteEffect() {
        noteEffect.clear();
        noteEffect.lineStyle(2, 0xcccccc, 1);
        noteEffect.strokeCircle(noteEffectPos.x, noteEffectPos.y, noteEffectSize);
    }

    function createNoteEffect() {
        noteEffect = board.getParentState().add.graphics();
        noteEffectPos.x = state.getX();
        noteEffectPos.y = state.getY();
        drawNoteEffect();
    }

    function init(i, x, texture, lane) {
        state.setX(x);
        index = i;
        sprite = new Phaser.GameObjects.Sprite(board.getParentState(), x, 0, texture);
        sprite.setOrigin(0.5);
        board.getParentState().add.existing(sprite);
        if (noteConfig.RECEPTOR_MODE === noteConfig.RECEPTOR_MODES.ARROWS) {
            if (lane === 0) sprite.rotation = Math.PI / 2;
            if (lane === 2) sprite.rotation = Math.PI;
            if (lane === 3) sprite.rotation = -Math.PI / 2;
        }
    }

    function update({ currentIndex, stepSize, delta }) {
        if (isDestroyed) return;
        const distance = (index - currentIndex) * stepSize;
        state.setY(board.getY() - distance);

        if (sprite && state.getY() > board.getY() + 400) {
            // destroy note after exit
            sprite.destroy();
            sprite = undefined;
        }
        if (sprite) {
            sprite.x = state.getX();
            sprite.y = state.getY();
        }
        if (noteEffect) {
            noteEffectSize += (delta / 1000) * 800;
            if (noteEffectSize > 100) {
                noteEffect.destroy();
                noteEffect = undefined;
            } else {
                drawNoteEffect();
            }
        }
    }

    function onMiss() {
        state.miss = true;
        state.emit(eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, state);
    }

    function onHit() {
        state.hit = true;
        createNoteEffect();
        if (sprite) {
            sprite.destroy();
            sprite = undefined;
        }
        state.emit(eventConfig.EVENTS.TONE.LEFT_LANE, state);
    }

    function destroy() {
        isDestroyed = true;
        if (sprite) {
            sprite.destroy();
            sprite = undefined;
        }

        if (noteEffect) {
            noteEffect.destroy();
            noteEffect = undefined;
        }

        board = undefined;
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        hit: false,
        miss: false,
        // methods
        init,
        update,
        onHit,
        onMiss,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: canEmitState, name: 'canEmit' },
    ];
    getFunctionUsage(states, 'Note');

    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            localState.update,
            isGameEntityState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default Note;
