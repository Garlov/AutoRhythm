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
import noteConfig from 'configs/noteConfig';

const Board = function BoardFunc(parent) {
    const state = {};
    let parentState = parent;
    let laneReceptors = [];
    let lanes = [];
    let notes = [];
    const threshold = 0.1; // 100 ms both ways
    let lastIndexInReceptor = 0;
    const laneCount = 4;
    const x = 600;
    const y = gameConfig.GAME.VIEWHEIGHT - 100;
    let freqMap;
    let song;
    let score = 0;
    let scoreText;
    let combo = 1;
    let multiplierText;
    let songText;
    let judgmentText;
    let judgmentTextTimeLeft = 1500;

    let health = gameConfig.HEALTH.MAX;
    let healthBar;

    // NPS calculations.
    let notesPastLane = 0;
    let notesAtLastCheck = 0;
    let lastNpsCheckTime = 0;
    const npsWindow = 1000; // how long between each calculation in ms.
    let npsText;
    let peak = 0;

    let notesHit = 0;
    let comboPeak = 0;
    let indicesPerSec = 0;

    function drawHealthBar() {
        if (!healthBar) {
            healthBar = parentState.add.graphics();
        }
        healthBar.clear();
        if (health > 50) {
            healthBar.fillStyle(0x66bb6a, 1);
        } else if (health > 25) {
            healthBar.fillStyle(0xffd54f, 1);
        } else {
            healthBar.fillStyle(0xb71c1c, 1);
        }

        const width = 5 * health;
        if (width > 0) {
            healthBar.fillRect(gameConfig.GAME.VIEWWIDTH - width - 20, 20, width, 25);
        }
    }

    function updateHealth(val) {
        if (val < 0) {
            health -= gameConfig.HEALTH.REDUCE;
        } else {
            health += gameConfig.HEALTH.GAIN;
        }

        if (health > gameConfig.HEALTH.MAX) {
            health = gameConfig.HEALTH.MAX;
        }

        if (health <= 0 && !gameConfig.HEALTH.FAIL_OFF) {
            state.emit(eventConfig.EVENTS.SONG.SONG_END, {
                escape: false,
                loss: true,
                npsPeak: peak,
                bestCombo: comboPeak,
                score,
                notesHit,
                totalNotes: notes.length,
            });
            return;
        }

        drawHealthBar();
    }

    function adjustScore(val) {
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

        updateHealth(val);
    }

    function setJudgmentText(text, fillColor) {
        judgmentTextTimeLeft = 1500;
        judgmentText.setText(text);
        judgmentText.setFill(fillColor);
        judgmentText.setX(gameConfig.GAME.VIEWWIDTH / 2 - judgmentText.width / 2);
    }

    function onNoteLeftLane(note) {
        if (note.hit) {
            notesHit += 1;
        }

        notesPastLane += 1;
    }

    function onNoteLeftLaneNoHit(note) {
        setJudgmentText(gameConfig.HIT_THRESHOLDS.MISS.TEXT, gameConfig.HIT_THRESHOLDS.MISS.COLOR);
        adjustScore(-10);
        notesPastLane += 1;
    }

    function onReceptorDown(e) {
        const secondsPerIndex = 1 / indicesPerSec;
        const currentTime = song.getCurrentTime() - secondsPerIndex / 2; // move center of note to center of receptor

        const minIndex = parseInt(indicesPerSec * (currentTime - threshold));
        const maxIndex = parseInt(indicesPerSec * (currentTime + threshold));


        let hit = false;
        for (let i = minIndex; i <= maxIndex; i += 1) {
            const note = lanes[e.index][i];
            if (note && (!note.hit && !note.miss)) {
                const msOffset = Math.abs(note.timestamp - currentTime) * 1000;
                if (msOffset < gameConfig.HIT_THRESHOLDS.FLAWLESS.MS) {
                    setJudgmentText(gameConfig.HIT_THRESHOLDS.FLAWLESS.TEXT, gameConfig.HIT_THRESHOLDS.FLAWLESS.COLOR);
                } else if (msOffset < gameConfig.HIT_THRESHOLDS.GREAT.MS) {
                    setJudgmentText(gameConfig.HIT_THRESHOLDS.GREAT.TEXT, gameConfig.HIT_THRESHOLDS.GREAT.COLOR);
                } else if (msOffset < gameConfig.HIT_THRESHOLDS.GOOD.MS) {
                    setJudgmentText(gameConfig.HIT_THRESHOLDS.GOOD.TEXT, gameConfig.HIT_THRESHOLDS.GOOD.COLOR);
                } else if (msOffset < gameConfig.HIT_THRESHOLDS.BAD.MS) {
                    setJudgmentText(gameConfig.HIT_THRESHOLDS.BAD.TEXT, gameConfig.HIT_THRESHOLDS.BAD.COLOR);
                }

                adjustScore(100);
                note.onHit();
                hit = true;
                break;
            }
        }

        if (!hit) {
            setJudgmentText(gameConfig.HIT_THRESHOLDS.MISS.TEXT, gameConfig.HIT_THRESHOLDS.MISS.COLOR);
            adjustScore(-10);
        }
    }

    function _onKeyDown(e) {
        if (e.keyCode === gameConfig.KEYS.ESCAPE.CODE) {
            state.emit(eventConfig.EVENTS.SONG.SONG_END, {
                escape: true,
                loss: true,
                npsPeak: peak,
                bestCombo: comboPeak,
                score,
                notesHit,
                totalNotes: notes.length,
            });
        }
    }

    function setupListeners() {
        state.listenOn(parentState.getKeyboard(), eventConfig.EVENTS.KEYBOARD.KEYDOWN, _onKeyDown);
    }

    function init(songInfo) {
        scoreText = parent.add.text(20, 20, `${score}`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        });

        judgmentText = parent.add.text(gameConfig.GAME.VIEWWIDTH / 2, gameConfig.GAME.VIEWHEIGHT / 2, '', {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        });

        multiplierText = parent.add.text(20, 100, `${combo}x`, {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4,
        });

        npsText = parent.add.text(20, gameConfig.GAME.VIEWHEIGHT, 'NPS', {
            font: '32px Arial',
            fill: '#eeeeee',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
        });
        npsText.y -= npsText.height;

        songText = parent.add.text(20, npsText.y - 10, `${songInfo.title} - ${songInfo.artist}`, {
            font: '24px Arial',
            fill: '#eeeeee',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3,
        });
        songText.y -= songText.height;

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

        /**
         * As generating thousands of notes in memory simultaneously is rather heavy, consider doing this in 20-30second chunks throughout the song instead...
         */
        const { duration } = song.audioBuffer;
        indicesPerSec = freqMap.length / duration;
        const timePerLaneFill = duration / freqMap.length; // This is the minimum difference between each note.
        const now = performance.now();
        for (let i = 0; i < freqMap.length; i += 1) {
            // loop through all the song 'chunks' and generate notes per lane.
            for (let laneIndex = 0; laneIndex < laneCount; laneIndex += 1) {
                let notesInLane = lanes[laneIndex];
                if (!notesInLane) {
                    notesInLane = new Array(freqMap.length).fill(undefined);
                    lanes.push(notesInLane);
                }

                if (freqMap[i][laneIndex]) {
                    const texture = laneIndex === 0 || laneIndex === 3 ? 'edgeNote' : 'middleNote';
                    const note = Note(state);
                    const timestamp = timePerLaneFill * i;
                    note.init(i, state.getX() + laneSize * laneIndex + laneSize / 2, texture, laneIndex, timestamp);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE_NO_HIT, onNoteLeftLaneNoHit);
                    state.listenOnce(note, eventConfig.EVENTS.TONE.LEFT_LANE, onNoteLeftLane);
                    notesInLane[i] = note;
                    notes.push(note);
                    count[laneIndex] += 1;
                }
            }
        }
        console.log(`Notemap Generation took ${performance.now() - now}ms.`);

        setupListeners();
        drawHealthBar();
    }

    function update() {
        const { duration } = song.audioBuffer;
        const currentTime = song.getCurrentTime();
        const currentIndexF = (freqMap.length / duration) * currentTime;

        const secondsPerIndex = 1 / indicesPerSec;
        const currentTimeWithOffset = song.getCurrentTime() - secondsPerIndex / 2; // move center of note to center of receptor

        const missedIndex = parseInt(indicesPerSec * (currentTimeWithOffset - threshold)) - 1;

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
                n.update({ currentIndex: currentIndexF, stepSize: noteConfig.NOTE_SPEED, delta });
            }
        });

        judgmentTextTimeLeft -= delta;
        if (judgmentTextTimeLeft < 0) judgmentText.setText('');

        laneReceptors.forEach((laneReceptor, i) => {
            laneReceptor.update(delta);

            for (let j = lastIndexInReceptor; j <= missedIndex; j += 1) {
                const note = lanes[i][j];
                if (note && (!note.hit && !note.miss)) {
                    note.onMiss();
                    break;
                }
            }
            lastIndexInReceptor = missedIndex;
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

        if (healthBar) {
            healthBar.destroy();
            healthBar = undefined;
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
