import { PopupWindow } from "../popupWindow";
import { TutorialController } from "../../controller/gui-controller/tutorialController";

/**
 * GUI for tutorials. 
 * @author Sebastian Führ
 * @author Marvin Kruber
 */
export class TutorialView extends PopupWindow {

    /** The current page of the tutorial */
    private currPage: number;

    /** Key of the current tutorial (see /res/json/tutorial-messages.json) */
    private tutorialKey: string;

    constructor(scene: Phaser.Scene, page: number,  x: number, y: number, closeBtnX: number, closeBtnY: number, tutorialKey: string) {
        super(
            scene, 
            x, 
            y, 
            'tablet', 
            closeBtnX, 
            closeBtnY,
            true, 
            [],
            false
        );

        this.tutorialKey = tutorialKey;

        this.currPage = page;

        this.addGameObjects(this.createFBBtn());
    }

    /** Creates two buttons to allow to change the visible page in the tutorial */
    private createFBBtn(): Phaser.GameObjects.Image[] {
        const arr = [];

        if (this.currPage < TutorialController.getInstance().getNumberOfPages(this.tutorialKey) - 1) {
            const nextBtn = new Phaser.GameObjects.Image(this.scene, 1580, 700, 'arrow-next');

            //confirm button interactive events
            nextBtn.setInteractive();

            // hover effects
            nextBtn.on('pointerover', () => {nextBtn.scale = 1.2;});
            nextBtn.on('pointerout', () => {nextBtn.scale = 1;});

            nextBtn.on('pointerup', () => {
                if (TutorialController.getInstance().showNextPage(this.currPage, this.x , this.y, this.getCloseBtnX(), this.getCloseBtnY(), this.tutorialKey)) this.destroy();
            });
            arr.push(nextBtn);
        }

        if (this.currPage > 0) {
            const prevBtn = new Phaser.GameObjects.Image(this.scene, 350, 700, 'arrow-next');
            prevBtn.angle = 180;

            //confirm button interactive events
            prevBtn.setInteractive();

            // hover effects
            prevBtn.on('pointerover', () => {prevBtn.scale = 1.2;});
            prevBtn.on('pointerout', () => {prevBtn.scale = 1;});

            prevBtn.on('pointerup', () => {
                if (TutorialController.getInstance().showPrevPage(this.currPage, this.x, this.y, this.getCloseBtnX(), this.getCloseBtnY(), this.tutorialKey)) this.destroy();
            });
            arr.push(prevBtn);
        }

        return arr;
    }

}