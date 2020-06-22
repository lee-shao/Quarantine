import { PopupWindow } from "../popupWindow";
import { Tutorial } from "../../controller/gui-controller/tutorial";

/**
 * @author Sebastian Führ
 */
export class TutorialView extends PopupWindow {

    /** The current page of the tutorial */
    private currPage: number;

    constructor(scene: Phaser.Scene, page: number) {
        super(
            scene, 
            0, 
            5, 
            'tablet', 
            1550, 
            200,
            true, 
            [],
            false
        );

        this.currPage = page;

        this.addGameObjects(this.createFBBtn());
    }

    /** Creates two buttons to allow to change the visible page in the tutorial */
    private createFBBtn(): Phaser.GameObjects.Image[] {
        const arr = [];

        if (this.currPage < Tutorial.getInstance().getNumberOfPages() - 1) {
            const nextBtn = new Phaser.GameObjects.Image(this.scene, 1580, 700, 'arrow-next');

            //confirm button interactive events
            nextBtn.setInteractive();

            // hover effects
            nextBtn.on('pointerover', () => {nextBtn.scale = 1.2;});
            nextBtn.on('pointerout', () => {nextBtn.scale = 1;});

            nextBtn.on('pointerup', () => {
                if (Tutorial.getInstance().showNextPage(this.currPage)) this.setVisible(false);
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
                if (Tutorial.getInstance().showPrevPage(this.currPage)) this.setVisible(false);
            });
            arr.push(prevBtn);
        }

        return arr;
    }

}