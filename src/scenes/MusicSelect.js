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

const MusicSelectScene = function MusicSelectSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.MUSIC_SELECT);
    let currentSongIndex = 0;
    let graphicsObj;
    let titleText;

    let visualizer;
    let songs = [];

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

            const fontSize = i === currentSongIndex ? 50 : 32;
            song.text.setText(`${song.title} by ${song.artist}`);
            song.text.setPosition(gameConfig.GAME.VIEWWIDTH / 2, 200 + i * 60);
            song.text.setFont(`${fontSize}px Arial`);
            song.text.setFill('#eeeeee');
            song.text.setAlign('center');
            song.text.setOrigin(0.5);

            if (i === currentSongIndex) {
                graphicsObj.lineStyle(5, 0xffffff, 1);
                graphicsObj.beginPath();
                graphicsObj.moveTo(song.text.x - song.text.width / 2, song.text.y + song.text.height / 2);
                graphicsObj.lineTo(song.text.x + song.text.width / 2, song.text.y + song.text.height / 2);
                graphicsObj.strokePath();
            }
        });
    }

    function _selectSong() {
        state.emitGlobal(eventConfig.EVENTS.GAME.SONG_SELECTED, { key: songs[currentSongIndex].key });
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
            if (e.keyCode === gameConfig.KEYCODES.LEFT_ARROW || e.keyCode === gameConfig.KEYCODES.UP_ARROW) {
                _navigateUp();
            }

            if (e.keyCode === gameConfig.KEYCODES.RIGHT_ARROW || e.keyCode === gameConfig.KEYCODES.DOWN_ARROW) {
                _navigateDown();
            }

            if (e.keyCode === gameConfig.KEYCODES.ENTER) {
                _selectSong();
            }
        }
    }

    function stop() {
        songs.forEach((song) => {
            song.text.destroy();
        });

        songs = [];
        visualizer.stop();
        state.scene.stop();
    }

    function create() {
        if (!titleText) {
            titleText = state.add.text(gameConfig.GAME.VIEWWIDTH / 2, 20, 'Song Selection', {
                font: '64px Arial',
                fill: '#eeeeee',
                align: 'center',
            });
            titleText.x -= titleText.width / 2;
        }

        if (!graphicsObj) {
            graphicsObj = state.add.graphics();
        }
        state.listenOn(state.getKeyboard(), 'keydown', _onKeyDown);

        if (!visualizer) {
            visualizer = Visualizer();
            state.scene.add(gameConfig.SCENES.VISUALIZER, visualizer, true);
        }

        _renderSongs();
        _previewSong();
    }

    function update(time, delta) {}

    function destroy() {
        visualizer.destroy();
        state.scene.remove(gameConfig.SCENES.VISUALIZER);
        visualizer = undefined;
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
        stop,
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
            canListen.destroy,
            canEmit.destroy,
        ),
    });
};

export default MusicSelectScene;
