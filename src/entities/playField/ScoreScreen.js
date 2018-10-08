import isGameEntity from 'components/entities/isGameEntity';
import getFunctionUsage from 'utils/getFunctionUsage';
import canEmit from 'components/canEmit';
import hasSize from 'components/hasSize';
import hasPosition from 'components/hasPosition';
import gameConfig from 'configs/gameConfig';
import pipe from 'utils/pipe';
import Button from 'entities/Button';
import eventConfig from 'configs/eventConfig';
import canListen from 'components/canListen';

const ScoreScreen = function ScoreScreenFunc(parent) {
    const state = {};
    const parentState = parent;

    let background;
    let notehits = 0;
    let totalNotes = 0;
    let noteHitRateText;
    let bestCombo = 0;
    let bestComboText;
    let npsPeak = 0;
    let npsPeakText;
    let score = 0;
    let scoreText;
    let titleText;
    let retryButton;
    let menuButton;
    let win = false;

    function onRetry() {
        state.emit(eventConfig.EVENTS.SCORE_SCREEN.RETRY);
    }

    function onMenu() {
        state.emit(eventConfig.EVENTS.SCORE_SCREEN.MENU);
    }

    function init() {
        const w = gameConfig.GAME.VIEWWIDTH * 0.6;
        const h = gameConfig.GAME.VIEWHEIGHT * 0.6;
        state.setSize({ width: w, height: h });

        const x = (gameConfig.GAME.VIEWWIDTH - w) / 2;
        const y = (gameConfig.GAME.VIEWHEIGHT - h) / 2;
        state.setPosition({ x, y });
    }

    function setScore(val) {
        score = val;
        state.refresh();
    }

    function setNoteHits(notehitsVal, totalNotesVal) {
        notehits = notehitsVal;
        totalNotes = totalNotesVal;
        state.refresh();
    }

    function setNpsPeak(val) {
        npsPeak = val;
        state.refresh();
    }

    function setBestCombo(val) {
        bestCombo = val;
        state.refresh();
    }

    function setWin(val) {
        win = val;
        state.refresh();
    }

    function refresh() {
        if (!background) {
            background = parentState.add.graphics();
        }
        background.clear();
        background.fillStyle(0x000000, 1);
        background.fillRect(state.getX(), state.getY(), state.getWidth(), state.getHeight());
        background.lineStyle(3, 0xcccccc, 1);
        background.strokeRect(state.getX(), state.getY(), state.getWidth(), state.getHeight());

        if (!titleText) {
            titleText = parent.add.text(0, 0, '', {
                font: '64px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        titleText.text = win ? 'Congratulations, you won!' : 'Sorry, better luck next time';
        titleText.x = state.getX() + state.getWidth() / 2 - titleText.width / 2;
        titleText.y = state.getY() + 20;

        if (!scoreText) {
            scoreText = parent.add.text(0, 0, '', {
                font: '40px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        scoreText.text = `Your score: ${score}`;
        scoreText.x = state.getX() + state.getWidth() / 2 - scoreText.width / 2;
        scoreText.y = state.getY() + 100;

        if (!noteHitRateText) {
            noteHitRateText = parent.add.text(0, 0, '', {
                font: '40px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        noteHitRateText.text = `Notes: ${notehits}/${totalNotes} (${(notehits / (totalNotes / 100)).toFixed(3)}%)`;
        noteHitRateText.x = state.getX() + state.getWidth() / 2 - noteHitRateText.width / 2;
        noteHitRateText.y = state.getY() + 180;

        if (!npsPeakText) {
            npsPeakText = parent.add.text(0, 0, '', {
                font: '40px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        npsPeakText.text = `Highest notes per second: ${npsPeak}`;
        npsPeakText.x = state.getX() + state.getWidth() / 2 - npsPeakText.width / 2;
        npsPeakText.y = state.getY() + 260;

        if (!bestComboText) {
            bestComboText = parent.add.text(0, 0, '', {
                font: '40px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
        }

        bestComboText.text = `Best combo: ${bestCombo}`;
        bestComboText.x = state.getX() + state.getWidth() / 2 - bestComboText.width / 2;
        bestComboText.y = state.getY() + 340;

        if (!retryButton) {
            retryButton = Button(parentState);
            retryButton.init();
            retryButton.setText('Retry');
            state.listenOn(retryButton, eventConfig.EVENTS.BUTTON.CLICK, onRetry);
        }
        retryButton.setSize({ width: state.getWidth() / 4, height: state.getHeight() * 0.2 });
        retryButton.setPosition({
            x: state.getX() + state.getWidth() / 4,
            y: state.getY() + state.getHeight() - retryButton.getHeight() - 50,
        });

        if (!menuButton) {
            menuButton = Button(parentState);
            menuButton.init();
            menuButton.setText('Menu');
            state.listenOn(menuButton, eventConfig.EVENTS.BUTTON.CLICK, onMenu);
        }
        menuButton.setSize({ width: state.getWidth() / 4, height: state.getHeight() * 0.2 });
        menuButton.setPosition({
            x: state.getX() + (state.getWidth() / 4) * 2,
            y: state.getY() + state.getHeight() - menuButton.getHeight() - 50,
        });
    }

    function destroy() {
        if (background) {
            background.destroy();
            background = undefined;
        }
        if (titleText) {
            titleText.destroy();
            titleText = undefined;
        }
        if (scoreText) {
            scoreText.destroy();
            scoreText = undefined;
        }
        if (noteHitRateText) {
            noteHitRateText.destroy();
            noteHitRateText = undefined;
        }
        if (npsPeakText) {
            npsPeakText.destroy();
            npsPeakText = undefined;
        }
        if (bestComboText) {
            bestComboText.destroy();
            bestComboText = undefined;
        }
        if (retryButton) {
            retryButton.destroy();
            retryButton = undefined;
        }
        if (menuButton) {
            menuButton.destroy();
            menuButton = undefined;
        }
    }

    const isGameEntityState = isGameEntity(state);
    const canEmitState = canEmit(state);
    const canListenState = canListen(state);
    const hasPositionState = hasPosition(state);
    const hasSizeState = hasSize(state);

    const localState = {
        // props
        // methods
        init,
        setScore,
        setNoteHits,
        setNpsPeak,
        setBestCombo,
        setWin,
        refresh,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: isGameEntityState, name: 'isGameEntity' },
        { state: canEmitState, name: 'canEmit' },
        { state: canListenState, name: 'canListen' },
        { state: hasPositionState, name: 'hasPosition' },
        { state: hasSizeState, name: 'hasSize' },
    ];

    getFunctionUsage(states, 'ScoreScreen');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        setPosition: pipe(
            hasPositionState.setPosition,
            localState.refresh,
        ),
        setSize: pipe(
            hasSizeState.setSize,
            localState.refresh,
        ),
        destroy: pipe(
            localState.destroy,
            canEmitState.destroy,
            canListenState.destroy,
        ),
    });
};

export default ScoreScreen;
