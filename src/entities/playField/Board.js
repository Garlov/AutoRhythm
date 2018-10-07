import isGameEntity from 'components/entities/isGameEntity';
import LaneReceptor from 'entities/playField/LaneReceptor';
import hasPosition from 'components/hasPosition';
import gameConfig from 'configs/gameConfig';
import Note from 'entities/playField/Note';
import canListen from 'components/canListen';
import eventConfig from 'configs/eventConfig';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';

const Board = function BoardFunc(parent) {
    const state = {};
    let parentState = parent;
    let laneReceptors = [];
    let lanes = [];
    let notes = [];
    const laneCount = 4;
    const x = 400;
    const y = gameConfig.GAME.VIEWHEIGHT - 250;
    let freqMap;
    let song;
    let score = 0;
    let scoreText;
    let multiplier = 1;
    let multiplierText;

    // NPS calculations.
    let notesPastLane = 0;
    let notesAtLastCheck = 0;
    let lastNpsCheckTime = 0;
    const npsWindow = 1000; // how long between each calculation in ms.
    let npsText;

    function incrementScore(val) {
        if (val < 0) {
            multiplier = 1;
        }
        score += val * multiplier;
        scoreText.text = `${score}`;
        if (val > 0) {
            multiplier += 1;
        }
        multiplierText.text = `${multiplier}x`;
    }

    function onNoteLeftLane(note) {
        notesPastLane += 1;
    }

    function onNoteLeftLaneNoHit(note) {
        incrementScore(-10);
    }

    function onReceptorDown(e) {
        const { duration } = song.audioBuffer;
        const currentTime = song.getCurrentTime();
        const currentIndexF = (freqMap.length / duration) * currentTime;
        const currentIndex = parseInt(currentIndexF);

        const note = lanes[e.index][currentIndex];
        if (note && !note.hit) {
            incrementScore(100);
            note.onHit();
        } else {
            incrementScore(-10);
        }
    }

    function init() {
        scoreText = parent.add.text(20, 20, `${score}`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
        });

        multiplierText = parent.add.text(20, 100, `${multiplier}x`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
        });

        npsText = parent.add.text(20, gameConfig.GAME.VIEWHEIGHT, 'NPS', {
            font: '48px Arial',
            fill: '#eeeeee',
            align: 'center',
        });
        npsText.y -= npsText.height;

        const laneSize = (gameConfig.GAME.VIEWWIDTH - x * 2) / laneCount;
        state.setPosition({ x, y });
        for (let i = 0; i < laneCount; i += 1) {
            const laneReceptor = LaneReceptor(state);
            laneReceptor.init();
            laneReceptor.setIndex(i);
            laneReceptor.setSize({ width: laneSize, height: 100 });
            laneReceptors.push(laneReceptor);

            state.listenOn(laneReceptor, eventConfig.EVENTS.LANE.RECEPTOR_DOWN, onReceptorDown);
        }

        const threshold = {
            0: -60000,
            1: -30000,
            2: -20000,
            3: -5000,
        };

        const count = {
            max: freqMap.length,
            0: 0,
            1: 0,
            2: 0,
            3: 0,
        };
        for (let i = 0; i < freqMap.length; i += 1) {
            const signal = freqMap[i].slice(0, freqMap[i].length * 0.5);
            for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
                let notesInLane = lanes[laneIndex];
                if (!notesInLane) {
                    notesInLane = [];
                    lanes.push(notesInLane);
                }
                const laneSignalLength = signal.length / laneCount;
                const start = laneIndex * laneSignalLength;
                const laneSignal = signal.slice(start, start.laneSignalLength);
                const res = laneSignal.reduce((tot, curr) => tot + curr, 0);
                if (res < threshold[laneIndex]) {
                    const note = Note(state);
                    note.init(i, state.getX() + laneSize * laneIndex + laneSize / 2);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, onNoteLeftLaneNoHit);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE, onNoteLeftLane);
                    notesInLane.push(note);
                    notes.push(note);
                    count[laneIndex] += 1;
                } else {
                    notesInLane.push(undefined);
                }
            }
        }
        console.log(count);
    }

    function update() {
        const { duration } = song.audioBuffer;
        const currentTime = song.getCurrentTime();
        const currentIndexF = (freqMap.length / duration) * currentTime;
        const currentIndex = parseInt(currentIndexF);

        const npsCheckTime = performance.now();
        if (npsCheckTime - lastNpsCheckTime > npsWindow) {
            lastNpsCheckTime = npsCheckTime;

            const noteDifference = notesPastLane - notesAtLastCheck;
            npsText.setText(`NPS:  ${noteDifference / (npsWindow / 1000)}`);

            notesAtLastCheck = notesPastLane;
        }

        notes.forEach((n) => {
            if (n) {
                n.update({ currentIndex: currentIndexF, stepSize: 150 });
            }
        });

        laneReceptors.forEach((laneReceptor, i) => {
            const note = lanes[i][currentIndex];
            if (note) {
                laneReceptor.setColor(0x00ff00);
            } else {
                laneReceptor.setColor(0xcccccc);
            }
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
    }

    const isGameEntityState = isGameEntity(state);
    const hasPositionState = hasPosition(state);
    const canListenState = canListen(state);

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
            canListen.destroy,
        ),
    });
};

export default Board;
