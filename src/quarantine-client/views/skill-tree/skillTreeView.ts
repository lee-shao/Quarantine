import { PopupWindow } from "../popupWindow";
import { SkillController } from "../../controller/skillController";
import { Icon } from "./icon";

/**
 * 
 * @author Shao
 */
export class SkillTreeView extends PopupWindow {

    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 5, 'open-notebook', 1550, 50, true, [], false);
        /*super(scene, 0, 5, 'open-notebook', 1550, 50, true, [
            new Phaser.GameObjects.Text(scene, 820, 50, 'Skill Tree', { 
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }),
        ], false);*/

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();

        //this.addSkillTitles();
        //this.addGameObjects(this.addSkillButtons());
        this.addSkillButtons();
        this.scene.add.existing(this);
    }

    private addBackButton(key: string): void {
        
        const backButton = new Phaser.GameObjects.Image(this.scene, 320, 870, 'arrow-next');
        backButton.angle = 180;

        backButton.setInteractive()
        .on('pointerover', () => {
            backButton.scale = 1.2;
        })
        .on('pointerout', () => {
            backButton.scale = 1;
        })
        .on('pointerdown', () => {
            backButton.scale = 1;
        })
        .on('pointerup', () => {
            backButton.scale = 1.2;
            this.addSkillButtons();
            this.removeSkillButtons(key);
            backButton.destroy();
        });

        this.add(backButton);
    }

    private addSkillButtons(): void {
        const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Skill Tree', {
            color: 'Black', 
            fontSize: '70px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setOrigin(0.5).setName('skilltree');
        const medicalTreatmentButton = new Icon(this.scene, innerWidth*0.2, innerHeight*0.25, 'medical-treatment', this, true);
        const policeButton = new Icon(this.scene, innerWidth*0.275, innerHeight*0.25, 'police-icon', this, true);
        const testingButton = new Icon(this.scene, innerWidth*0.35, innerHeight*0.25, 'testing', this, true);
        const lockdownButton = new Icon(this.scene, innerWidth*0.425, innerHeight*0.25, 'lockdown-icon', this, true);
        const citizensButton = new Icon(this.scene, innerWidth*0.5, innerHeight*0.25, 'citizen', this, true);

        this.add(title);
        this.add(medicalTreatmentButton);
        this.add(policeButton);
        this.add(testingButton);
        this.add(lockdownButton);
        this.add(citizensButton);
    }

    public openSubtree(key: string): void {
        
        this.removeMainSkillButtons();
        this.addBackButton(key);
        if(key == 'medical-treatment') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Medical-Treatment', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('medical-treatment-title');
            const additionalMedicalSuppliesI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.35, 'additional-medical-supplies-1', this, true);
            const additionalMedicalSuppliesII = new Icon(this.scene, innerWidth*0.25, innerHeight*0.475, 'additional-medical-supplies-2', this, true);
            const upgradeMedicalFacilitiesI = new Icon(this.scene, innerWidth*0.45, innerHeight*0.475, 'upgrade-medical-facilities-1', this, true);
            const upgradeMedicalFacilitiesII = new Icon(this.scene, innerWidth*0.35, innerHeight*0.6, 'upgrade-medical-facilities-2', this, true);
            const upgradeMedicalFacilitiesIII = new Icon(this.scene, innerWidth*0.25, innerHeight*0.725, 'upgrade-medical-facilities-3', this, true);
            const medicinI = new Icon(this.scene, innerWidth*0.55, innerHeight*0.6, 'medicine-1', this, true);
            const medicinII = new Icon(this.scene, innerWidth*0.45, innerHeight*0.725, 'medicine-2', this, true);
            const medicinIII = new Icon(this.scene, innerWidth*0.35, innerHeight*0.85, 'medicine-3', this, true);

            this.add(title);
            this.add(additionalMedicalSuppliesI);
            this.add(additionalMedicalSuppliesII);
            this.add(upgradeMedicalFacilitiesI);
            this.add(upgradeMedicalFacilitiesII);
            this.add(upgradeMedicalFacilitiesIII);
            this.add(medicinI);
            this.add(medicinII);
            this.add(medicinIII);
        }

        if(key == 'police-icon') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Police', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('police-title');
            const learnExpertise = new Icon(this.scene, this.x + 960, this.y + 300, 'expertise', this, true);
            const militaryI = new Icon(this.scene, this.x + 760, this.y + 400, 'military-1', this, true);
            const militaryII = new Icon(this.scene, this.x + 1160, this.y + 400, 'military-2', this, true);
            const militaryIII = new Icon(this.scene, this.x + 960, this.y + 500, 'military-3', this, true);
            const policeEquipment = new Icon(this.scene, this.x + 760, this.y + 600, 'police-equipment', this, true);
            const testing = new Icon(this.scene, this.x + 1360, this.y + 500, 'testing', this, true); 
            const trackingEncounters = new Icon(this.scene, this.x + 1160, this.y + 600, 'tracking', this, true);

            this.add(title);
            this.add(learnExpertise);
            this.add(militaryI);
            this.add(militaryII);
            this.add(militaryIII);
            this.add(policeEquipment);
            this.add(testing);
            this.add(trackingEncounters);
        }

        if(key == 'testing') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Testing', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('testing-title');
            const additionalTestKits = new Icon(this.scene, this.x + 960, this.y + 300, 'additional-test-kits', this, true);
            const upgradeTestKitsI = new Icon(this.scene, this.x + 760, this.y + 400, 'upgrade-test-kit-1', this, true);
            const upgradeTestKitsII = new Icon(this.scene, this.x + 1160, this.y + 400, 'upgrade-test-kit-2', this, true);
            const nationwideTesting = new Icon(this.scene, this.x + 960, this.y + 500, 'nationwide-testing', this, true);
            const dna = new Icon(this.scene, this.x + 760, this.y + 600, 'dna', this, true);
            const immunityTests = new Icon(this.scene, this.x + 1360, this.y + 500, 'immunity-tests', this, true); 

            this.add(title);
            this.add(additionalTestKits);
            this.add(upgradeTestKitsI);
            this.add(upgradeTestKitsII);
            this.add(nationwideTesting);
            this.add(dna);
            this.add(immunityTests);
        }

        if(key == 'lockdown-icon') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Lockdown', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('lockdown-title');
            const lockdownStageI = new Icon(this.scene, this.x + 960, this.y + 300, 'lockdown-stage-1', this, true);
            const lockdownStageII = new Icon(this.scene, this.x + 760, this.y + 400, 'lockdown-stage-2', this, true);
            const lockdownStageIII = new Icon(this.scene, this.x + 1160, this.y + 400, 'lockdown-stage-3', this, true);
            const lockdownStageIV = new Icon(this.scene, this.x + 960, this.y + 500, 'lockdown-stage-4', this, true);
            const publicTransport = new Icon(this.scene, this.x + 760, this.y + 600, 'public-transport', this, true);
            const restrictedTraffic = new Icon(this.scene, this.x + 1360, this.y + 500, 'restricted-traffic', this, true); 
            const fincancialSupportI = new Icon(this.scene, this.x + 1160, this.y + 600, 'financial-support-1', this, true); 
            const fincancialSupportII = new Icon(this.scene, this.x + 960, this.y + 700, 'financial-support-2', this, true);

            this.add(title);
            this.add(lockdownStageI);
            this.add(lockdownStageII);
            this.add(lockdownStageIII);
            this.add(lockdownStageIV);
            this.add(publicTransport);
            this.add(restrictedTraffic);
            this.add(fincancialSupportI);
            this.add(fincancialSupportII);
        }

        if(key == 'citizen') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth/2, innerHeight*0.1, 'Citizen', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('citizen-title');
            const expertiseI = new Icon(this.scene, this.x + 960, this.y + 300, 'expertise-1', this, true);
            const expertiseII = new Icon(this.scene, this.x + 760, this.y + 400, 'expertise-2', this, true);
            const expertiseIII = new Icon(this.scene, this.x + 1160, this.y + 400, 'expertise-3', this, true);
            const trackingAppI = new Icon(this.scene, this.x + 960, this.y + 500, 'tracking-1', this, true);
            const trackingAppII = new Icon(this.scene, this.x + 760, this.y + 600, 'tracking-2', this, true);

            this.add(title);
            this.add(expertiseI);
            this.add(expertiseII);
            this.add(expertiseIII);
            this.add(trackingAppI);
            this.add(trackingAppII);
        }
    }

    private removeMainSkillButtons(): void {
        this.getByName('skilltree').destroy();
        this.getByName('medical-treatment').destroy();
        this.getByName('police-icon').destroy();
        this.getByName('testing').destroy();
        this.getByName('lockdown-icon').destroy();
        this.getByName('citizen').destroy();
    }

    public removeSkillButtons(key: string): void {
        if(key == 'medical-treatment') {
            this.getByName('medical-treatment-title').destroy();
            this.getByName('additional-medical-supplies-1').destroy();
            this.getByName('additional-medical-supplies-2').destroy();
            this.getByName('upgrade-medical-facilities-1').destroy();
            this.getByName('upgrade-medical-facilities-2').destroy();
            this.getByName('upgrade-medical-facilities-3').destroy();
            this.getByName('medicine-1').destroy();
            this.getByName('medicine-2').destroy();
            this.getByName('medicine-3').destroy();
        }
        if(key == 'police-icon') {
            this.getByName('police-title').destroy();
            this.getByName('expertise').destroy();
            this.getByName('military-1').destroy();
            this.getByName('military-2').destroy();
            this.getByName('military-3').destroy();
            this.getByName('police-equipment').destroy();
            this.getByName('testing').destroy();
            this.getByName('tracking').destroy();
        }
        if(key == 'testing') {
            this.getByName('testing-title').destroy();
            this.getByName('additional-test-kits').destroy();
            this.getByName('upgrade-test-kit-1').destroy();
            this.getByName('upgrade-test-kit-2').destroy();
            this.getByName('nationwide-testing').destroy();
            this.getByName('dna').destroy();
            this.getByName('immunity-tests').destroy();
        }
        if(key == 'lockdown-icon') {
            this.getByName('lockdown-title').destroy();
            this.getByName('lockdown-stage-1').destroy();
            this.getByName('lockdown-stage-2').destroy();
            this.getByName('lockdown-stage-3').destroy();
            this.getByName('lockdown-stage-4').destroy();
            this.getByName('public-transport').destroy();
            this.getByName('restricted-traffic').destroy();
            this.getByName('financial-support-1').destroy();
            this.getByName('financial-support-2').destroy();
        }
        if(key == 'citizen') {
            this.getByName('citizen-title').destroy();
            this.getByName('expertise-1').destroy();
            this.getByName('expertise-2').destroy();
            this.getByName('expertise-3').destroy();
            this.getByName('tracking-1').destroy();
            this.getByName('tracking-2').destroy();
        }
    }
/*

    /*private addRingColor(): Phaser.GameObjects.GameObject[] {
        return [
            this.scene.add.image(this.x + 960, this.y + 250, 'circle-green')
            /*this.setColor(SkillController.getInstance(), this.x + 960, this.y + 250),
            this.setColor(SkillController.getInstance(), this.x + 1240, this.y + 400),
            this.setColor(SkillController.getInstance(), this.x + 1160, this.y + 700),
            this.setColor(SkillController.getInstance(), this.x + 760, this.y + 700),
            this.setColor(SkillController.getInstance(), this.x + 680, this.y + 400),
            this.setIcon(this.x + 960, this.y + 250, 'medical-treatment'),
            this.setIcon(this.x + 1240, this.y + 400, 'police'),
            this.setIcon(this.x + 1160, this.y + 700, 'testing'),
            this.setIcon(this.x + 760, this.y + 700, 'lockdown'),
            this.setIcon(this.x + 680, this.y + 400, 'citizen'),
        ]
        
    }*/

    /*private setColor(sC: SkillController, x: number, y: number, skill?: Function): Phaser.GameObjects.Image {
        let color = '';
       
        if(skill() == true) {
            color = 'circle-green';
        } else {
            if(sC.skillBuyable(sC) == true) {
                color = 'circle-orange';
            } else {
                 color = 'circle-red';
            }
        }
        const iconColor = this.scene.add.image(x, y, color).setScale(0.75);

        return iconColor;
    }

    private setIcon(x: number, y: number, texture: string): Phaser.GameObjects.Image {
        const icon = this.scene.add.image(x, y, texture).setScale(0.75);
        return icon;
    }*/

    /*private addSkillTitles(): void {
        this.scene.add.text(960, 200, 'Medical Treatment', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        this.scene.add.text(960, 200, 'Police', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        this.scene.add.text(960, 200, 'Testing', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        new Phaser.GameObjects.Text(this.scene, 960, 200, 'Lockdown', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }),
        new Phaser.GameObjects.Text(this.scene, 960, 200, 'Citizens', {
            color: 'Black',
            fontSize: '50px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        })
    }*/


}