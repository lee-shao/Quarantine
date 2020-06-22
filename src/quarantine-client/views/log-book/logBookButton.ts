import { GuiElement } from "../guiElement";
import { LogBook } from "../../controller/gui-controller/logBook";

/**
 * Factory which generates the the log book button which opens the
 * log book sub scene.
 * @see GuiScene
 * @see LogBook
 * @author Sebastian Führ
 */
export class LogBookButton extends GuiElement {

    /** Create and add a log book button to the GuiScene */
    public create(): void {
        const lbBtn = this.scene.add.image(1000, 90, 'log').setOrigin(0);
        lbBtn.scale = 0.6;
        lbBtn.angle = 1;
        lbBtn.setInteractive();

        // hover effect
        lbBtn.on('pointerover', () => { lbBtn.scale = 0.65; });
        lbBtn.on('pointerout', () => { lbBtn.scale = 0.6; });

        lbBtn.on('pointerup', () => {
            LogBook.getInstance().open(this.scene); // open log book sub scene
            if (this.scene.soundON) this.scene.buttonClickMusic.play();
        });
    }

}