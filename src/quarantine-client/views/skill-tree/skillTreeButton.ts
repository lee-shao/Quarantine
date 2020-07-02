import { GuiElement } from "../guiElement";
import { SkillTreeView } from "./skillTreeView";
import { TutorialComponent } from "../tutorial/tutorialComponent";
import { PopupWindow } from "../popupWindow";

/**
 * Factory which generates the the skill tree button which opens the
 * skill tree sub scene.
 * @see GuiScene
 * @see SkillTreeView
 * @author Shao
 * @author Sebastian Führ
 */
export class SkillTreeButton extends GuiElement implements TutorialComponent {

    private yourSkills: Phaser.GameObjects.Image;

    /** Create and add a skill tree button to the GuiScene */
    public create(): SkillTreeButton {
        this.yourSkills = this.scene.add.sprite(innerWidth*0.025, innerHeight*0.25, 'your_skills').setInteractive()
            .on('pointerover', () => {
                this.yourSkills.setScale(0.7);
            })
            .on('pointerout', () => {
                this.yourSkills.setScale(0.6);
            })
            .on('pointerdown', () => {
                this.yourSkills.setScale(0.55);
            })
            .on('pointerup', () => {
                if(!this.scene.mainSceneIsPaused){
                    this.yourSkills.setScale(0.6);
                    const skillTree = new SkillTreeView(this.scene);
                    skillTree.createModal();
                    if (this.scene.soundON) this.scene.buttonClickMusic.play();
                } else {
                    const popupMss = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                    const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                    const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                    popupMss.addGameObjects([blankNode, content]);
                    popupMss.createModal();
                }
            }).setScale(0.7);

            this.hideComponent();
            return this;
    }

    /** @see TutorialComponent */
    public hideComponent(): void {
        this.yourSkills.disableInteractive();
        this.yourSkills.setVisible(false);
    }

    /** @see TutorialComponent */
    public activateComponent(): void {
        this.yourSkills.setInteractive();
        this.yourSkills.setVisible(true);
        this.scene.addToVisibleButtons(this.yourSkills);
    }

    /** @returns Phaser.GameObjects.Image of skill tree button */
    public getSkillTreeButton(): Phaser.GameObjects.Image {return this.yourSkills;}
}