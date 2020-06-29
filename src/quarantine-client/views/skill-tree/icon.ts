import { SkillController } from "../../controller/gui-controller/skillController";
import { SkillTreeView } from "./skillTreeView";

/**
 * 
 * @author Shao
 */
export class Icon extends Phaser.GameObjects.Container {
    
    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    public skillIsActive: boolean;

    public skillIcon: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean) {
        super(scene, x, y);

        //this.skillIcon = new Phaser.GameObjects.Image(scene, x, y, texture).setScale(0.4);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();
        this.skillIsActive = active;

        this.addButtonAnimations(skillTree, texture);
        this.setName(texture);
    }

    private addButtonAnimations(skillTree: SkillTreeView, key: string): void {
        this.skillIcon = new Phaser.GameObjects.Image(this.scene, 0, 0, key).setScale(0.4).setInteractive()
        //this.skillIcon = this.scene.add.image(this.x, this.y, key).setScale(0.4).setInteractive()
        .on('pointerover', () => {
            if(!(this.skillIcon.scale < 0.4)) {
                this.skillIcon.setScale(0.5);
            }
            if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
                skillTree.eraseDescription();
                skillTree.destroyBuyButton();
                skillTree.showDescription(key);
                skillTree.addBuyButton(key, skillTree);
            }
        })
        .on('pointerout', () => {
            if(this.skillIcon.scale == 0.5) {
                this.skillIcon.setScale(0.4);
            }
            //if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
            //}
        })
        .on('pointerdown', () => {
            skillTree.resetPreviouslyPressed(skillTree.previousSkill);
            this.skillIcon.setScale(0.35);
            skillTree.previousSkill = key;
        })
        .on('pointerup', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                //skillTree.currentSkillIcons = skillTree.addCurrentSkillIcons('main');
                skillTree.removeCurrentSkills();
                skillTree.openSubtree(key, skillTree.addCurrentSkillIcons(key));
                if(this.skillIsActive == true) {
                    skillTree.openMainTree();
                }
                this.skillIsActive = true;
            } 
        });
        this.add(this.skillIcon);
    }

    /*public manualSetScale(scale: number): void {
        this.setScale(scale);
    }*/
}