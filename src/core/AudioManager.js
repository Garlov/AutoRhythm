import gameConfig from 'configs/gameConfig';
import spriteConfig from 'configs/spriteConfig';
import audioConfig from 'configs/audioConfig';

/**
 * Default background Soundtrack is Full of Stars, by Philipp Weigl (http://freemusicarchive.org/music/Philipp_Weigl/Sound-trax/Philipp_Weigl_-_Full_of_Stars)
 * Used under creative commons license CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/, https://creativecommons.org/licenses/by/4.0/legalcode)
 *
 * Can we extend phaser SoundManager here for cleaner code?
 */

const AudioManager = function createAudioManagerFunc() {
    const state = {};
    let scene;
    let muteIcon;
    const muteIdentifier = `${gameConfig.GAME.TITLE.replace(/ /g, '_')}_isMuted`; // replace all spaces with _ for safety
    const soundEffects = new Map();
    const backgroundMusic = new Map();

    function init() {
        state.setupMute();
        // TODO fix map of background/sfx, split config or make mapped objects more complex
        backgroundMusic.set(audioConfig.BG_SCORE.KEY, scene.sound.add(audioConfig.BG_SCORE.KEY));
        Object.keys(audioConfig).forEach((objKey) => {
            const AUDIO = audioConfig[objKey];
            soundEffects.set(AUDIO.KEY, scene.sound.add(AUDIO.KEY));
        });

        return state;
    }

    function setScene(newScene) {
        // TODO move from old to new, if scene is already defined
        scene = newScene;
        return state;
    }

    function setPauseOnBlur(pauseOnBlur) {
        if (scene) {
            scene.sound.pauseOnBlur = pauseOnBlur; // Keep audio playing even when losing focus.
        }
        return state;
    }

    function playSfx(key) {
        if (soundEffects.has(key)) {
            soundEffects.get(key).play();
        }
    }

    function playBgMusic(key = audioConfig.BG_SCORE.KEY) {
        if (!state.isBgMusicPlaying && backgroundMusic.has(key)) {
            const bgm = backgroundMusic.get(key);
            bgm.loop = true;
            bgm.volume = 0.7;
            bgm.play();
            state.isBgMusicPlaying = true;
        }
    }

    function isAudioMuted() {
        return localStorage.getItem(muteIdentifier) === 'true';
    }

    function _updateMute() {
        if (state.isAudioMuted()) {
            muteIcon.setTexture(spriteConfig.SPEAKER_OFF.KEY);
            scene.sound.mute = true;
        } else {
            muteIcon.setTexture(spriteConfig.SPEAKER.KEY);
            scene.sound.mute = false;
        }
    }

    function toggleMute() {
        const muteStatus = (!state.isAudioMuted()).toString();
        localStorage.setItem(muteIdentifier, muteStatus);
        _updateMute();
    }

    function setupMute() {
        muteIcon = scene.add.image(1850, 1040, spriteConfig.SPEAKER.KEY);
        muteIcon.setScrollFactor(0);
        muteIcon.tint = gameConfig.UI_DEFAULT.tint;
        muteIcon.depth = 3;
        muteIcon.setInteractive();
        muteIcon.on('pointerup', state.toggleMute, state);

        _updateMute();
    }

    function destroy() {
        muteIcon.destroy();
        soundEffects.destroy();
        backgroundMusic.destroy();
    }

    return Object.assign(state, {
        // props
        isBgMusicPlaying: false,
        // methods
        init,
        playSfx,
        setScene,
        setPauseOnBlur,
        playBgMusic,
        isAudioMuted,
        toggleMute,
        setupMute,
        destroy,
    });
};

/**
 * Audio manager instance, there should only be one. Implementation may change.
 */
export default AudioManager;
