import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import eventConfig from 'configs/eventConfig';
import audioConfig from 'configs/audioConfig';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import Visualizer from 'scenes/Visualizer';
import hasAudio from 'components/hasAudio';
import canEmit from 'components/canEmit';
import getFunctionUsage from 'utils/getFunctionUsage';
import pipe from 'utils/pipe';
import store from '../store';

const MusicSelectScene = function MusicSelectSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.MUSIC_SELECT);
    let currentSongIndex = 0;
    let graphicsObj;
    let titleText;
    let descriptionText;

    let visualizer;
    const songs = [];

    function _renderSongs() {
        graphicsObj.clear();

        Object.keys(audioConfig.MUSIC).forEach((key, i) => {
            let song = songs[i];
            if (!song) {
                const songData = audioConfig.MUSIC[key];
                const artist = songData.ARTIST || 'N / A';
                const title = songData.TITLE || 'N / A';

                const songObj = {
                    title,
                    artist,
                    key: songData.KEY,
                    text: state.add.text(),
                };

                song = songObj;
                songs.push(songObj);
            }

            const fontSize = i === currentSongIndex ? 50 : 25;
            const fill = i === currentSongIndex ? '#81c784' : '#eeeeee';
            song.text.setText(`${song.title} by ${song.artist}`);
            song.text.setPosition(gameConfig.GAME.VIEWWIDTH / 2, 200 + i * 60);
            song.text.setFont(`${fontSize}px Arial`);
            song.text.setFill(fill);
            song.text.setAlign('center');
            song.text.setOrigin(0.5);
            song.text.setStroke('#000000', 3);

            if (i === currentSongIndex) {
                // TODO Make a tween
                graphicsObj.lineStyle(5, 0xffffff, 1);
                graphicsObj.beginPath();
                graphicsObj.moveTo(song.text.x - song.text.width / 2, song.text.y + song.text.height / 2);
                graphicsObj.lineTo(song.text.x + song.text.width / 2, song.text.y + song.text.height / 2);
                graphicsObj.strokePath();
            }
        });
    }

    function _selectSong() {
        state.emitGlobal(eventConfig.EVENTS.GAME.SONG_SELECTED, {
            key: songs[currentSongIndex].key,
            title: songs[currentSongIndex].title,
            artist: songs[currentSongIndex].artist,
        });
    }

    function _previewSong() {
        const { key } = songs[currentSongIndex];
        visualizer.visualize(key);
    }

    function _navigateUp() {
        currentSongIndex -= 1;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }

        _renderSongs();
        _previewSong();
    }

    function _navigateDown() {
        currentSongIndex += 1;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        _renderSongs();
        _previewSong();
    }

    function _onKeyDown(e) {
        if (state.sys.isActive()) {
            if (
                e.keyCode === gameConfig.KEYS.LEFT_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.UP_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.Z.CODE
            ) {
                _navigateUp();
            }

            if (
                e.keyCode === gameConfig.KEYS.RIGHT_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.DOWN_ARROW.CODE ||
                e.keyCode === gameConfig.KEYS.DOT.CODE
            ) {
                _navigateDown();
            }

            if (e.keyCode === gameConfig.KEYS.ENTER.CODE) {
                _selectSong();
            }

            if (e.keyCode === gameConfig.KEYS.ESCAPE.CODE) {
                const data = {
                    sourceScene: gameConfig.SCENES.MUSIC_SELECT,
                };
                state.emitGlobal(eventConfig.EVENTS.MENU.ENTERED, data);
            }
        }
    }

    function create() {
        if (!titleText) {
            titleText = state.add.text(gameConfig.GAME.VIEWWIDTH / 2, 20, 'Song Selection', {
                font: '72px Arial',
                fill: '#eeeeee',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4,
            });
            titleText.x -= titleText.width / 2;
        }

        if (!descriptionText) {
            descriptionText = state.add.text(10, 20, `Controls\n
Select Music by using (Z) and (.) or the arrow keys.
During play, press (Z), (X), (,), (.) or the arrow keys
when notes pass through the receptors. Confirm your selection
by pressing the (Enter) Key.\n
Difficulty, receptor and note types, fail off etc.
can be changed using the menu on the right.

Music by Of Far Different Nature (https://fardifferent.carrd.co/)
Other songs from https://unminus.com/`, {
                font: '20px Arial',
                fill: '#eeeeee',
                align: 'Left',
                stroke: '#000000',
                strokeThickness: 2,
            });
        }

        if (!graphicsObj) {
            graphicsObj = state.add.graphics();
        }
        state.listenOn(state.getKeyboard(), 'keydown', _onKeyDown);

        visualizer = Visualizer();
        state.scene.add(gameConfig.SCENES.VISUALIZER, visualizer, true);
        _renderSongs();

        setTimeout(() => {
            _previewSong(); // if we preview too soon, it won't render.
        }, 150);

        // show settings.
        store.ui.getGUIRef().show();
        store.ui.getGUIRef().open();
        store.settings.open();
    }

    function update(time, delta) { }

    function destroy() {
        visualizer.destroy();
        visualizer = undefined;
        state.scene.remove(gameConfig.SCENES.VISUALIZER);

        state.getAudioManager().stopMusic();

        // hide settings
        store.ui.getGUIRef().close();
        store.ui.getGUIRef().hide();
    }

    const hasInputState = hasInput(state);
    const hasAudioState = hasAudio(state);
    const canListenState = canListen(state);
    const canEmitState = canEmit(state);

    const localState = {
        // props
        // methods
        create,
        update,
        destroy,
    };

    const states = [
        { state, name: 'state' },
        { state: localState, name: 'localState' },
        { state: hasInputState, name: 'hasInput' },
        { state: hasAudioState, name: 'hasAudio' },
        { state: canListenState, name: 'canListen' },
        { state: canEmitState, name: 'canEmit' },
    ];

    getFunctionUsage(states, 'MusicSelect');
    return Object.assign(...states.map(s => s.state), {
        // pipes and overrides
        update: pipe(
            state.update,
            localState.update,
        ),
        destroy: pipe(
            localState.destroy,
            canListenState.destroy,
            canEmitState.destroy,
        ),
    });
};

export default MusicSelectScene;
