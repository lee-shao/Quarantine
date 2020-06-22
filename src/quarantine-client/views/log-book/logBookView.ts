import { PopupWindow } from "../popupWindow";
import { LogBook } from "../../controller/gui-controller/logBook";

/**
 * @author Sebastian Führ
 */
export class LogBookView extends PopupWindow {

    private currWeek: number;

    constructor(scene: Phaser.Scene, week: number) {
        super(
            scene, 
            0, 
            5, 
            'open-notebook', 
            1550, 
            50,
            true, 
            [
                new Phaser.GameObjects.Text(
                    scene,
                    400, 
                    50, 
                    "Log - Week " + week, 
                    { color: 'Black', fontSize: '70px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
                )
            ],
            false
        );

        this.currWeek = week;

        this.addGameObjects(this.createFBBtns());
    }

    /**
     * Creates two buttons to allow to change the visible page in the log book.
     */
    private createFBBtns(): Phaser.GameObjects.Image[] {
        const nextBtn = new Phaser.GameObjects.Image(this.scene, 1600, 870, 'arrow-next');

        //confirm button interactive events
        nextBtn.setInteractive();

        // hover effects
        nextBtn.on('pointerover', () => {nextBtn.scale = 1.2;});
        nextBtn.on('pointerout', () => {nextBtn.scale = 1;});

        nextBtn.on('pointerup', () => {
            if (LogBook.getInstance().showNextWeek(this.currWeek)) this.setVisible(false);
        });

        const prevBtn = new Phaser.GameObjects.Image(this.scene, 320, 870, 'arrow-next');
        prevBtn.angle = 180;

        //confirm button interactive events
        prevBtn.setInteractive();

        // hover effects
        prevBtn.on('pointerover', () => {prevBtn.scale = 1.2;});
        prevBtn.on('pointerout', () => {prevBtn.scale = 1;});

        prevBtn.on('pointerup', () => {
            if (LogBook.getInstance().showPrevWeek(this.currWeek)) this.setVisible(false);
        });

        return [nextBtn, prevBtn];
    }

}