import { GuiElement } from "../guiElement";
import { LogBookController } from "../../controller/gui-controller/logBookController";
import { TutorialComponent } from "../tutorial/tutorialComponent";
import { PopupWindow } from "../popupWindow";

/**
 * Factory which generates the the log book button which opens the
 * log book sub scene.
 * @see GuiScene
 * @see LogBookController
 * @author Sebastian Führ
 */
export class LogBookButton extends GuiElement implements TutorialComponent {

    /** Log book button */
    private lbBtn: Phaser.GameObjects.Image;

    /** Create and add a log book button to the GuiScene */
    public create(): LogBookButton {
        this.lbBtn = this.scene.add.image(1050, 780, 'log').setOrigin(0);
        this.lbBtn.scale = 0.6;
        this.lbBtn.angle = -10;

        // hover effect
        this.lbBtn.on('pointerover', () => { this.lbBtn.scale = 0.65; });
        this.lbBtn.on('pointerout', () => { this.lbBtn.scale = 0.6; });

        this.lbBtn.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                LogBookController.getInstance().open(this.scene); // open log book sub scene
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            } else {
                const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popupMss.addGameObjects([blankNode, content]);
                popupMss.createModal();
            }
        });

        this.hideComponent();

        return this;
    }

    /** @see TutorialComponent */
    public hideComponent(): void {
        this.lbBtn.disableInteractive();
        this.lbBtn.setVisible(false);
    }

    /** @see TutorialComponent */
    public activateComponent(): void {
        this.lbBtn.setVisible(true);
        this.lbBtn.setInteractive();
        this.scene.addToVisibleButtons(this.lbBtn);
    }

    /** @returns Phaser.GameObjects.Image of logbook button */
    public getLockBookButton(): Phaser.GameObjects.Image {return this.lbBtn;}
}