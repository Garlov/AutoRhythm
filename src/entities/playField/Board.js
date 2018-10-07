import isGameEntity from 'components/entities/isGameEntity';
import LaneReceptor from 'entities/playField/LaneReceptor';
import hasPosition from 'components/hasPosition';
import gameConfig from 'configs/gameConfig';
import Note from 'entities/playField/Note';
import canListen from 'components/canListen';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import canEmit from 'components/canEmit';

const Board = function BoardFunc(parent) {
    const state = {};
    let parentState = parent;
    let laneReceptors = [];
    let lanes = [];
    let notes = [];
    const laneCount = 4;
    const x = 600;
    const y = gameConfig.GAME.VIEWHEIGHT - 100;
    let freqMap;
    let song;
    let score = 0;
    let scoreText;
    let combo = 1;
    let multiplierText;

    // NPS calculations.
    let notesPastLane = 0;
    let notesAtLastCheck = 0;
    let lastNpsCheckTime = 0;
    const npsWindow = 1000; // how long between each calculation in ms.
    let npsText;
    let peak = 0;

    let notesHit = 0;
    let comboPeak = 0;

    function incrementScore(val) {
        if (val < 0) {
            combo = 1;
        }
        score += val * combo;
        scoreText.text = `${score}`;
        if (val > 0) {
            combo += 1;

            if (combo > comboPeak) {
                comboPeak = combo;
            }
        }
        multiplierText.text = `${combo}x`;
    }

    function onNoteLeftLane(note) {
        if (note.hit) {
            notesHit += 1;
        }

        notesPastLane += 1;
    }

    function onNoteLeftLaneNoHit(note) {
        incrementScore(-10);
        notesPastLane += 1;
    }

    function onReceptorDown(e) {
        const threshold = 0.1; // 100 ms both ways

        const { duration } = song.audioBuffer;
        const indexesPerSec = freqMap.length / duration;
        const secondsPerIndex = 1 / indexesPerSec;
        const currentTime = song.getCurrentTime() - secondsPerIndex / 2; // move center of note to center of receptor

        const minIndex = parseInt(indexesPerSec * (currentTime - threshold));
        const maxIndex = parseInt(indexesPerSec * (currentTime + threshold));

        let hit = false;
        for (let i = minIndex; i <= maxIndex; i += 1) {
            const note = lanes[e.index][i];
            if (note && (!note.hit || !note.miss)) {
                incrementScore(100);
                note.onHit();
                hit = true;
                break;
            }
        }
        if (!hit) {
            incrementScore(-10);
        }
    }

    function init() {
        scoreText = parent.add.text(20, 20, `${score}`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
        });

        multiplierText = parent.add.text(20, 100, `${combo}x`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
        });

        npsText = parent.add.text(20, gameConfig.GAME.VIEWHEIGHT, 'NPS', {
            font: '32px Arial',
            fill: '#eeeeee',
            align: 'center',
        });
        npsText.y -= npsText.height;

        const laneSize = (gameConfig.GAME.VIEWWIDTH - x * 2) / laneCount;
        state.setPosition({ x, y });
        for (let i = 0; i < laneCount; i += 1) {
            const laneReceptor = LaneReceptor(state);
            laneReceptor.setSize({ width: laneSize, height: 100 });
            laneReceptor.init();
            laneReceptor.setIndex(i);
            laneReceptors.push(laneReceptor);

            state.listenOn(laneReceptor, eventConfig.EVENTS.LANE.RECEPTOR_DOWN, onReceptorDown);
        }

        const count = {
            max: freqMap.length,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
        };

        const now = performance.now();
        for (let i = 0; i < freqMap.length; i += 1) {
            // loop through all the song 'chunks'

            for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
                let notesInLane = lanes[laneIndex];
                if (!notesInLane) {
                    notesInLane = new Array(freqMap.length).fill(undefined);
                    lanes.push(notesInLane);
                }

                if (freqMap[i][laneIndex]) {
                    const note = Note(state);
                    note.init(i, state.getX() + laneSize * laneIndex + laneSize / 2);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, onNoteLeftLaneNoHit);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE, onNoteLeftLane);
                    notesInLane[i] = note;
                    notes.push(note);
                    count[laneIndex] += 1;
                }
            }
        }
        console.log(performance.now() - now);
        console.log(count, notes.length);
    }

    function update() {
        const { duration } = song.audioBuffer;
        const currentTime = song.getCurrentTime();
        const currentIndexF = (freqMap.length / duration) * currentTime;

        if (currentTime > duration) {
            state.emit(eventConfig.EVENTS.SONG.SONG_END, {
                escape: false,
                loss: false,
                npsPeak: peak,
                bestCombo: comboPeak,
                score,
                notesHit,
                totalNotes: notes.length,
            });
            return;
        }

        // NPS Calculations.
        const npsCheckTime = performance.now();
        if (npsCheckTime - lastNpsCheckTime > npsWindow) {
            lastNpsCheckTime = npsCheckTime;

            const noteDifference = notesPastLane - notesAtLastCheck;
            if (peak < noteDifference) peak = noteDifference;

            npsText.setText(`NPS:  ${noteDifference / (npsWindow / 1000)} (Peak: ${peak})`);
            notesAtLastCheck = notesPastLane;
        }

        const { delta } = parentState.game.loop;
        notes.forEach((n) => {
            if (n) {
                n.update({ currentIndex: currentIndexF, stepSize: 150, delta });
            }
        });

        laneReceptors.forEach((laneReceptor, i) => {
            laneReceptor.update();
        });
    }

    function setFrequencyMap(s, fm) {
        song = s;
        freqMap = fm;
    }

    function getParentState() {
        return parentState;
    }

    function getLaneCount() {
        return laneCount;
    }

    function destroy() {
        laneReceptors.forEach((lr) => {
            lr.destroy();
        });
        laneReceptors = [];
        notes.forEach((n) => {
            n.destroy();
        });
        notes = [];
        // no need to destroy, just empty
        lanes = [];

        song = undefined;
        freqMap = undefined;
        parentState = undefined;
        if (scoreText) {
            scoreText.destroy();
            scoreText = undefined;
        }
        if (multiplierText) {
            multiplierText.destroy();
            multiplierText = undefined;
        }

        if (npsText) {
            npsText.destroy();
            npsText = undefined;
        }
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const canListenState = canListen(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        // methods
        init,
        update,
        setFrequencyMap,
        getParentState,
        getLaneCount,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: canListenState, name: 'canListen' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'Board');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            localState.update,
            isGameEntityState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default Board;
