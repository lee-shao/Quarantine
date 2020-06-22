import 'phaser';
import { StartMenuScene } from './views/scenes/start-menu-scene';

const config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 1080,
    backgroundColor: Phaser.Display.Color.GetColor(255, 255, 255),
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    dom: {
        createContainer: true // allow manipulation of dom elements within phaser (used by status bar in gui-scene.ts)
    },

    scene: StartMenuScene,
    physics: {
        default: 'arcade',
        arcade: {
            // set to true to display object collision bounding boxes
            debug: false
        }
    }
};

/** Program entry point */
export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    new Game(config);
});
