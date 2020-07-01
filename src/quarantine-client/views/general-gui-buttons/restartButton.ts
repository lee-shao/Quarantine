import { MainScene } from "../scenes/main-scene";
import { ChartScene } from "../tablet/chart-scene";
import { MapScene } from "../tablet/map-scene";
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

    private restartBtn: Phaser.GameObjects.Image;

    /** Create and add a restart button to the GuiScene */
    public create(): RestartButton {
        this.restartBtn = this.scene.add.image(this.scene.game.renderer.width - 50, 150, 'restart');
    /*public create(): Phaser.GameObjects.Sprite {
        const this.restartBtn = this.scene.add.sprite(this.scene.game.renderer.width - 100, 150, 'restart');*/

        this.restartBtn.setInteractive();

        // hover, click event etc.
        this.restartBtn.on('pointerover', () => {
            this.restartBtn.setScale(this.scaling);
        });

        this.restartBtn.on('pointerout', () => {
            this.restartBtn.setScale(1);
        });

        this.restartBtn.on('pointerup', () => {
                if(!this.scene.mainSceneIsPaused){
                    //creates popup messages
                    const popupMss = new PopupWindow(this.scene, 0, 0, '', 1100, 350, true, [], false);
                    const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(500, 300);
                    const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 100, this.scene.game.renderer.height / 2, 'Do you want to reset the game?', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

                    //creates confirm button
                    const restartOKBtn = new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2 + 50, 'restart-popup');

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
                        location.reload();
                    });

                    //add confirm to object container and show the popup
                    popupMss.addGameObjects([blankNode, content, restartOKBtn]);
                    popupMss.createModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
            }else{
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.sprite(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }

        });

        return this;
    }

    /** @returns Phaser.GameObjects.Image of restart button */
    public getRestartButton(): Phaser.GameObjects.Image { return this.restartBtn; }

}