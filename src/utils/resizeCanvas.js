import gameConfig from 'configs/gameConfig';

const resizeCanvas = function resizeCanvasFunc() {
    const canvas = document.querySelector('#game>canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = gameConfig.GAME.VIEWWIDTH / gameConfig.GAME.VIEWHEIGHT;
    if (windowRatio < gameRatio) {
        canvas.style.width = `${windowWidth}px`;
        canvas.style.height = `${windowWidth / gameRatio}px`;
    } else {
        canvas.style.width = `${windowHeight * gameRatio}px`;
        canvas.style.height = `${windowHeight}px`;
    }
};

export default resizeCanvas;
