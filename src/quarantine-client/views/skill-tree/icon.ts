import { SkillController } from "../../controller/skillController";
import { SkillTreeView } from "./skillTreeView";

/**
 * 
 * @author Shao
 */
export class Icon extends Phaser.GameObjects.Image {
    
    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    private skillIsActive: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean) {
        super(scene, x, y, texture);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();
        this.skillIsActive = active;

        this.addButtonAnimations(texture, skillTree);
        this.setScale(0.4);
        this.setName(texture);
    }

    private addButtonAnimations(key: string, skillTree: SkillTreeView): void {
        this.setInteractive()
        .on('pointerover', () => {
            this.setScale(0.5);
            if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
                skillTree.eraseDescription();
                skillTree.destroyBuyButton();
                skillTree.showDescription(key);
                skillTree.addBuyButton(key, skillTree);
            }
        })
        .on('pointerout', () => {
            this.setScale(0.4);
            if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
            }
        })
        .on('pointerdown', () => {
            this.setScale(0.4);
        })
        .on('pointerup', () => {
            this.setScale(0.5);
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                skillTree.openSubtree(key);
            } else {
                //skillTree.showDescription(key);
                //skillTree.addBuyButton(key, skillTree);
            }
        });
    }
}