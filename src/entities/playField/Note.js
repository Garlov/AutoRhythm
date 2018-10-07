import isGameEntity from 'components/entities/isGameEntity';
import hasPosition from 'components/hasPosition';
import canEmit from 'components/canEmit';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const Note = function NoteFunc(parent) {
    const state = {};
    let noteBg;
    let board = parent;
    let index = 0;
    const noteSize = 40;
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

    function init(i, x) {
        state.setX(x);
        index = i;
    }

    function update({ currentIndex, stepSize, delta }) {
        const distance = (index - currentIndex) * stepSize;
        state.setY(board.getY() - distance);
        if (!noteBg && state.getY() > 0 && state.getY() < board.getY() + 400 && !state.hit) {
            noteBg = board.getParentState().add.graphics();
            noteBg.fillStyle(0xcccccc, 1);
            noteBg.fillCircle(0, 0, noteSize);
        }
        if (noteBg && state.getY() > board.getY() + 400) {
            noteBg.destroy();
            noteBg = undefined;
            if (!state.hit) {
                state.miss = true;
                state.emit(eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, state);
            }
        }
        if (noteBg) {
            noteBg.x = state.getX();
            noteBg.y = state.getY();
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

    function onHit() {
        state.hit = true;
        createNoteEffect();
        noteBg.destroy();
        noteBg = undefined;
        state.emit(eventConfig.EVENTS.TONE.LEFT_LANE, state);
    }

    function destroy() {
        if (noteBg) {
            noteBg.destroy();
            noteBg = undefined;
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
