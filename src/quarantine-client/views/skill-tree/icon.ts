import { SkillTreeView } from "./skillTreeView";
import { UpgradeController } from "../../controller/gui-controller/upgradeController";
import { SkillController } from "../../controller/gui-controller/skillController";
import { GuiScene } from "../scenes/gui-scene";
/**
 * 
 * @author Shao
 */
export class Icon extends Phaser.GameObjects.Container {

    public skillIsActive: boolean;

    public skillBought: boolean;

    public skillIcon: Phaser.GameObjects.Image;

    public ringColor: Phaser.GameObjects.Image;

    public buyButton: Phaser.GameObjects.Image;

    public descriptions = require("./../../../../res/json/skill-descriptions.json");

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean, bought: boolean) {
        super(scene, x, y);

        this.skillIsActive = active;
        this.skillBought = bought;

        this.ringColor = new Phaser.GameObjects.Image(this.scene, 0, 0, '');
        this.ringColor = this.addRingColor(this.descriptions[texture]['price'], texture, skillTree).setScale(0.4);
        this.addButtonAnimations(skillTree, texture);
        this.buyButton = new Phaser.GameObjects.Image(this.scene, innerWidth*0.775 - this.x, innerHeight*0.9 - this.y, 'buyButton').setScale(0.4).setOrigin(0.5);

        this.addBuyButton(texture, skillTree);
        this.buyButton.setVisible(false);
        this.setName(texture);
        this.remainState();
    }

    public addBuyButton(key: string, skillTree: SkillTreeView): void {
        if(!(this.ringColor.name == 'red')) {
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
                if(skillTree.activateSkill(key) == true) {
                    skillTree.iconIsPressed = false;
                    this.skillIsActive = true;
                    this.skillBought = true;
                    this.ringColor = this.addRingColor(this.descriptions[key]['price'], key, skillTree).setScale(0.4);
                    this.remainState();
                }
                if (GuiScene.instance.soundON) GuiScene.instance.increaseSound.play();
            });
            this.add(this.buyButton);
        }
    }

    private addButtonAnimations(skillTree: SkillTreeView, key: string): void {
        this.skillIcon = new Phaser.GameObjects.Image(this.scene, 0, 0, key).setScale(0.4).setInteractive()
        .on('pointerover', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.5);
                this.skillIcon.setScale(0.5);
            } else if(skillTree.iconIsPressed == false) {
                if(this.skillBought == false) {
                    this.ringColor.setScale(0.5);
                    this.skillIcon.setScale(0.5);
                }
                skillTree.eraseDescription();
                skillTree.showDescription(key);
                this.buyButton.setVisible(true);
            }
            skillTree.hidePreviousBuyButton(skillTree.previousSkill);
        })
        .on('pointerout', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.4);
                this.skillIcon.setScale(0.4);
            }
            if(skillTree.iconIsPressed == false) {
                if(this.skillBought == false) {
                    this.ringColor.setScale(0.4);
                    this.skillIcon.setScale(0.4);
                }
                skillTree.eraseDescription();
                this.buyButton.setVisible(false);
            }
        })
        .on('pointerdown', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                this.ringColor.setScale(0.35);
                this.skillIcon.setScale(0.35);
            } else if(this.skillBought == false) {    
                this.ringColor.setScale(0.35);
                this.skillIcon.setScale(0.35);
            }
        })
        .on('pointerup', () => {
            if(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen') {
                if(this.skillIsActive == false) {
                    skillTree.hideCurrentSkills();
                    skillTree.openSubtree(key);
                    this.skillIsActive = true;
                } else if(this.skillIsActive == true) {
                    skillTree.backButton.setVisible(false);
                    skillTree.hideCurrentSkills();
                    skillTree.openMainTree();
                    this.skillIsActive = false;
                }
            } else if(skillTree.iconIsPressed == false && this.skillBought == false) {
                skillTree.eraseDescription();
                skillTree.showDescription(key);
                this.buyButton.setVisible(true);
                skillTree.iconIsPressed = true;
                this.skillIsActive = true;
            } else if(skillTree.iconIsPressed == true && this.skillIsActive == true && this.skillBought == false) {
                this.ringColor.setScale(0.4);
                this.skillIcon.setScale(0.4);
                skillTree.eraseDescription();
                this.buyButton.setVisible(false);
                skillTree.iconIsPressed = false;
                this.skillIsActive = false;
            } else if (skillTree.iconIsPressed == true && this.skillIsActive == false && this.skillBought == false) {
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
        this.add(this.skillIcon);
        this.add(this.ringColor);
    }

    public addRingColor(price: number, key: string, skillTree: SkillTreeView): Phaser.GameObjects.Image {
        if(UpgradeController.getInstance().isSolvent(price) == true) {
            this.ringColor.setTexture('circle-orange').setName('orange');       
        } else {
            this.ringColor.setTexture('circle-red').setName('red');
        }
        if(this.skillBought == true || price == 0) {
            this.ringColor.setTexture('circle-green').setName('green');
        }
        return this.ringColor;
    }

    public resetScale(scale: number): void {
        this.skillIcon.setScale(scale);
        this.ringColor.setScale(scale);
        this.skillIsActive = false;
        this.buyButton.setVisible(false);
    }

    private remainState(): void {
        if(this.skillBought == true) {
            this.skillIcon.setScale(0.35);
            this.ringColor.setScale(0.35);
            this.buyButton.setTexture('buyButtonA').removeInteractive();
        }
    }
}