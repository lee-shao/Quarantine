import { MainScene } from "../scenes/main-scene";
import { ChartScene } from "../scenes/chart-scene";
import { MapScene } from "../scenes/map-scene";
import { PopupWindow } from "../popupWindow";
import { GuiElement } from "../guiElement";

/**
 * Factory which generates the reset game button which opens a popup and
 * asks the player if he/she really wants to restart the game.
 * @see GuiScene
 * @author Hien
 * @author Sebastian Führ
 */
export class RestartButton extends GuiElement {

    /** Create and add a restart button to the GuiScene */
    public create(): void {
        const resetBtn = this.scene.add.image(this.scene.game.renderer.width - 100, 150, 'restart');
        resetBtn.setInteractive();

        // hover, click event etc.
        resetBtn.on('pointerover', () => {
            resetBtn.setScale(0.7);
        });

        resetBtn.on('pointerout', () => {
            resetBtn.setScale(1);
        });

        resetBtn.on('pointerup', () => {
            //creates popup messages
            const popupMss = new PopupWindow(this.scene, 0, 0, 'note', this.scene.game.renderer.width / 2 + 60, this.scene.game.renderer.height / 2 - 70, true, [new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 100, this.scene.game.renderer.height / 2, 'Do you want to restart this game ?', { color: 'Black', fontSize: '14px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })], false);
            //creates confirm button
            const restartOKBtn = new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2, this.scene.game.renderer.height / 2 + 50, 'restart-popup');

            //confirm button interactive events
            restartOKBtn.setInteractive();
            //hover, click event etc
            restartOKBtn.on('pointerover', () => {
                restartOKBtn.setTexture('restart-popup-hover');
            });

            restartOKBtn.on('pointerout', () => {
                restartOKBtn.setTexture('restart-popup');
            });

            //do restart the game when btn were clicked
            restartOKBtn.on('pointerup', () => {
                const main = this.scene.scene.get('MainScene') as MainScene;
                const chart = this.scene.scene.get('ChartScene') as ChartScene;
                const map = this.scene.scene.get('MapScene') as MapScene;

                main.scene.restart();
                chart.scene.restart();
                map.scene.restart();

                //close modal
                popupMss.closeModal();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            });

            //add confirm to object container and show the popup
            popupMss.addGameObjects([restartOKBtn]);
            popupMss.createModal();
            if (this.scene.soundON) this.scene.buttonClickMusic.play();

        });
    }

}