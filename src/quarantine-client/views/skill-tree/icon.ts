import { SkillController } from "../../controller/gui-controller/skillController";
import { SkillTreeView } from "./skillTreeView";
import { UpgradeController } from "../../controller/gui-controller/upgradeController";

/**
 * 
 * @author Shao
 */
export class Icon extends Phaser.GameObjects.Container {

    public skillIsActive: boolean;

    public skillIcon: Phaser.GameObjects.Image;

    public ringColor: Phaser.GameObjects.Image;

    public buyButton: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean) {
        super(scene, x, y);

        this.skillIsActive = active;

        this.addButtonAnimations(skillTree, texture);
        this.buyButton = new Phaser.GameObjects.Image(this.scene, innerWidth*0.775 - this.x, innerHeight*0.9 - this.y, 'buyButton').setScale(0.4).setOrigin(0.5);

        this.addBuyButton(skillTree);
        this.buyButton.setVisible(false);
        this.setName(texture);
        this.addRingColor();
    }

    public addBuyButton(skillTree: SkillTreeView): void {
        this.buyButton.setInteractive()
        .on('pointerover', () => {
            this.buyButton.setTexture('buyButtonH');
        })
        .on('pointerout', () => {
            this.buyButton.setTexture('buyButton');
        })
        .on('pointerdown', () => {
            this.buyButton.setTexture('buyButtonP')
        })
        .on('pointerup', () => {
            this.buyButton.setTexture('buyButtonA')
            this.buyButton.removeInteractive();
            skillTree.activateSkill(skillTree.previousSkill);
            console.log('previousSkill = ' + skillTree.previousSkill);
        });
        this.add(this.buyButton);
    }

    private addButtonAnimations(skillTree: SkillTreeView, key: string): void {
        this.ringColor = this.addRingColor();
        this.skillIcon = new Phaser.GameObjects.Image(this.scene, 0, 0, key).setScale(0.4).setInteractive()
        .on('pointerover', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.5);
                this.skillIcon.setScale(0.5);
            } else {
                if(skillTree.iconIsPressed == false) {
                    this.ringColor.setScale(0.5);
                    this.skillIcon.setScale(0.5);
                    skillTree.eraseDescription();
                    skillTree.showDescription(key);
                    this.buyButton.setVisible(true);
                }
            }
        })
        .on('pointerout', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.4);
                this.skillIcon.setScale(0.4);
            }
            if(skillTree.iconIsPressed == false) {
                this.ringColor.setScale(0.4);
                this.skillIcon.setScale(0.4);
                skillTree.eraseDescription();
                this.buyButton.setVisible(false);
            }
        })
        .on('pointerdown', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.35);
                this.skillIcon.setScale(0.35);
            } else {    
                this.ringColor.setScale(0.35);
                this.skillIcon.setScale(0.35);
            }
        })
        .on('pointerup', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                if(this.skillIsActive == false) {
                    skillTree.hideCurrentSkills();
                    skillTree.openSubtree(key, skillTree.addCurrentSkillIcons(key));
                    this.skillIsActive = true;
                } else if(this.skillIsActive == true) {
                    skillTree.backButton.setVisible(false);
                    skillTree.hideCurrentSkills();
                    skillTree.openMainTree();
                    this.skillIsActive = false;
                }
            } else if(skillTree.iconIsPressed == false) {
                skillTree.eraseDescription();
                skillTree.showDescription(key);
                this.buyButton.setVisible(true);
                skillTree.iconIsPressed = true;
                this.skillIsActive = true;
            } else if(skillTree.iconIsPressed == true && this.skillIsActive == true) {
                this.ringColor.setScale(0.4);
                this.skillIcon.setScale(0.4);
                skillTree.eraseDescription();
                this.buyButton.setVisible(false);
                skillTree.iconIsPressed = false;
            } else if (skillTree.iconIsPressed == true && this.skillIsActive == false) {
                this.ringColor.setScale(0.35);
                this.skillIcon.setScale(0.35);
                skillTree.resetPreviouslyPressed(skillTree.previousSkill);
                skillTree.eraseDescription();
                skillTree.showDescription(key);
                this.buyButton.setVisible(true);
                this.skillIsActive = true;
            }
            skillTree.previousSkill = key;
        });
        this.add(this.ringColor);
        this.add(this.skillIcon);
    }

    public addRingColor(): Phaser.GameObjects.Image {
        if(UpgradeController.getInstance().isSolvent(10000) == true) {
            this.ringColor = new Phaser.GameObjects.Image(this.scene, 0, 0, 'circle-orange').setScale(0.4);
        } else {
            this.ringColor = new Phaser.GameObjects.Image(this.scene, 0, 0, 'circle-red').setScale(0.4);
        }
        if(this.skillIsActive == true) {
            this.ringColor = new Phaser.GameObjects.Image(this.scene, 0, 0, 'circle-green').setScale(0.4);
        }
        return this.ringColor;
    }

    public resetScale(scale: number): void {
        this.skillIcon.setScale(scale);
    }
}