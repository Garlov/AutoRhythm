import Phaser from 'phaser';
import gameConfig from 'configs/gameConfig';
import audioConfig from 'configs/audioConfig';
import hasInput from 'components/hasInput';
import canListen from 'components/canListen';
import Visualizer from 'scenes/Visualizer';
import hasAudio from 'components/hasAudio';

const MusicSelectScene = function MusicSelectSceneFunc() {
    const state = new Phaser.Scene(gameConfig.SCENES.MUSIC_SELECT);
    let currentSongIndex = 0;
    let graphicsObj;

    const visualizer = Visualizer();
    const songs = [];

    const hasInputState = hasInput(state);
    const hasAudioState = hasAudio(state);
    const canListenState = canListen(state);

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

    function _selectSong() {}

    function _previewSong() {
        state.getAudioManager().pauseMusic();
        state.getAudioManager().playMusic(songs[currentSongIndex].key);
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

    function create() {
        const titleText = state.add.text(gameConfig.GAME.VIEWWIDTH / 2, 20, 'Song Selection', {
            font: '64px Arial',
            fill: '#eeeeee',
            align: 'center',
        });
        titleText.x -= titleText.width / 2;

        graphicsObj = state.add.graphics();
        state.listenOn(state.getKeyboard(), 'keydown', _onKeyDown);
        state.scene.add(gameConfig.SCENES.VISUALIZER, visualizer, false);

        _renderSongs();
        _previewSong();
    }

    function update(time, delta) {}

    function destroy() {}

    return Object.assign(state, hasInputState, canListenState, hasAudioState, {
        // props
        // methods
        create,
        update,
        destroy,
    });
};

export default MusicSelectScene;
