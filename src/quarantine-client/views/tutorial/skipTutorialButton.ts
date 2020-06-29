import { GuiElement } from "../guiElement";
import { TimeController } from "../../controller/timeController";
import { TutorialComponent } from "./tutorialComponent";
import { GuiScene } from "../scenes/gui-scene";
import { ItemMenu } from "../item-menu/menu";
import { EventController } from "../../controller/eventController";

/**
 * Factory which generates the SkipTutorialButton.
 * This Button is only visible during the tutorial and removed(!) afterwards.
 * @see GuiScene
 * @see TutorialView
 * @author Marvin Kruber
 */
export class SkipTutorialButton extends GuiElement{

    /** Graphical representation of SkipTutorialButton e.g. "Skip whole tutorial" */
    private text: Phaser.GameObjects.Text;

    /** List of all components which are part of the tutorial
     * @see TutorialComponent
     */
    private tutorialComponents: TutorialComponent[];

    public constructor(scene: GuiScene, tutorialComponents: TutorialComponent[]) {
        super(scene);
        this.tutorialComponents = tutorialComponents;
    }

    public create(): SkipTutorialButton {

        this.text = this.scene.add.text(0, 0, "Skip whole tutorial", { // description style
            color: 'Yellow',
            fontSize: '28px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setInteractive();

        this.text.on('pointerover', () => { this.text.setColor('Black'); })
                 .on('pointerout', () => { this.text.setColor('Yellow'); })
                 .on('pointerup', () => {
                    // activate/display all components immediately
                    TimeController.getInstance().removeAllTimedTutorialEvents();
                    EventController.getInstance();
                    this.tutorialComponents.forEach(x => {x.activateComponent();
                                                    if(x instanceof ItemMenu) x.activateComponent() // has to be triggered a second time because of research
                                                });
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
                    this.text.destroy();
                });

        return this;
    }

    /** Removes the text of skip button*/
    public removeSkipButton(): void {
        this.text.destroy();
    }

}