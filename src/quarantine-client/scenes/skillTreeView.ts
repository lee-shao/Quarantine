import { PopupWindow } from "./popupWindow";
import { SkillController } from "../objects/controller/skillController";
import { Icon } from "../objects/icon";

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
        super(scene, 0, 5, 'open-notebook', 1550, 50, true, [
            new Phaser.GameObjects.Text(scene, 820, 50, 'Skill Tree', { 
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }),
        ], false);

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
        const medicalTreatmentButton = new Icon(this.scene, this.x + 960, this.y + 250, 'medical-treatment', this, true).setScale(0.75).setName('mtButton');  //.setInteractive();
        const policeButton = new Icon(this.scene, this.x + 1240, this.y + 400, 'police-icon', this, true).setScale(0.75).setName('pButton');  //.setInteractive();
        const testingButton = new Icon(this.scene, this.x + 1160, this.y + 700, 'testing', this, true).setScale(0.75).setName('tButton');    //.setInteractive();
        const lockdownButton = new Icon(this.scene, this.x + 760, this.y + 700, 'lockdown-icon', this, true).setScale(0.75).setName('ldButton');   //.setInteractive();
        const citizensButton = new Icon(this.scene, this.x + 680, this.y + 400, 'citizen', this, true).setScale(0.75).setName('cButton');    //.setInteractive();

        this.add(medicalTreatmentButton);
        this.add(policeButton);
        this.add(testingButton);
        this.add(lockdownButton);
        this.add(citizensButton);
    }

    public openSubtree(key: string) {
        
        this.removeMainSkillButtons();
        this.addBackButton(key);
        if(key == 'medical-treatment') {
            const additionalMedicalSuppliesI = new Icon(this.scene, this.x + 960, this.y + 300, 'additional-medical-supplies-1', this, true).setScale(0.75).setName('amsButton');   //.setInteractive();
            const additionalMedicalSuppliesII = new Icon(this.scene, this.x + 760, this.y + 400, 'additional-medical-supplies-2', this, true).setScale(0.75).setName('ams2Button');  //.setInteractive();
            const upgradeMedicalFacilitiesI = new Icon(this.scene, this.x + 1160, this.y + 400, 'upgrade-medical-facilities-1', this, true).setScale(0.75).setName('umfButton');    //.setInteractive();
            const upgradeMedicalFacilitiesII = new Icon(this.scene, this.x + 960, this.y + 500, 'upgrade-medical-facilities-2', this, true).setScale(0.75).setName('umf2Button');    //.setInteractive();
            const upgradeMedicalFacilitiesIII = new Icon(this.scene, this.x + 760, this.y + 600, 'upgrade-medical-facilities-3', this, true).setScale(0.75).setName('umf3Button');   //.setInteractive();
            const medicinI = new Icon(this.scene, this.x + 1360, this.y + 500, 'medicine-1', this, true).setScale(0.75).setName('medButton');   //.setInteractive();
            const medicinII = new Icon(this.scene, this.x + 1160, this.y + 600, 'medicine-2', this, true).setScale(0.75).setName('med2Button');  //.setInteractive();
            const medicinIII = new Icon(this.scene, this.x + 960, this.y + 700, 'medicine-3', this, true).setScale(0.75).setName('med3Button');  //.setInteractive();

            this.add(additionalMedicalSuppliesI);
            this.add(additionalMedicalSuppliesII);
            this.add(upgradeMedicalFacilitiesI);
            this.add(upgradeMedicalFacilitiesII);
            this.add(upgradeMedicalFacilitiesIII);
            this.add(medicinI);
            this.add(medicinII);
            this.add(medicinIII);
        }

        if(key == 'police') {
            const learnExpertise = new Icon(this.scene, this.x + 960, this.y + 300, 'expertise', this, true).setScale(0.75).setName('exButton');
            const militaryI = new Icon(this.scene, this.x + 760, this.y + 400, 'military-1', this, true).setScale(0.75).setName('mil1Button');
            const militaryII = new Icon(this.scene, this.x + 1160, this.y + 400, 'military-2', this, true).setScale(0.75).setName('mil2Button');
            const militaryIII = new Icon(this.scene, this.x + 960, this.y + 500, 'military-3', this, true).setScale(0.75).setName('mil32Button');
            const policeEquipment = new Icon(this.scene, this.x + 760, this.y + 600, 'police-equipment', this, true).setScale(0.75).setName('peButton');
            const testing = new Icon(this.scene, this.x + 1360, this.y + 500, 'testing', this, true).setScale(0.75).setName('tButton'); 
            const trackingEncounters = new Icon(this.scene, this.x + 1160, this.y + 600, 'tracking', this, true).setScale(0.75).setName('trckButton');

            this.add(learnExpertise);
            this.add(militaryI);
            this.add(militaryII);
            this.add(militaryIII);
            this.add(policeEquipment);
            this.add(testing);
            this.add(trackingEncounters);
        }

        if(key == 'testing') {
            const additionalTestKits = new Icon(this.scene, this.x + 960, this.y + 300, 'additional-test-kits', this, true).setScale(0.75).setName('adtkButton');
            const upgradeTestKitsI = new Icon(this.scene, this.x + 760, this.y + 400, 'upgrade-test-kit-1', this, true).setScale(0.75).setName('utk1Button');
            const upgradeTestKitsII = new Icon(this.scene, this.x + 1160, this.y + 400, 'upgrade-test-kit-2', this, true).setScale(0.75).setName('utk2Button');
            const nationwideTesting = new Icon(this.scene, this.x + 960, this.y + 500, 'nationwide-testing', this, true).setScale(0.75).setName('nwButton');
            const dna = new Icon(this.scene, this.x + 760, this.y + 600, 'dna', this, true).setScale(0.75).setName('dnaButton');
            const immunityTests = new Icon(this.scene, this.x + 1360, this.y + 500, 'immunity-tests', this, true).setScale(0.75).setName('itButton'); 

            this.add(additionalTestKits);
            this.add(upgradeTestKitsI);
            this.add(upgradeTestKitsII);
            this.add(nationwideTesting);
            this.add(dna);
            this.add(immunityTests);
        }

        if(key == 'lockdown') {
            const lockdownStageI = new Icon(this.scene, this.x + 960, this.y + 300, 'lockdown-stage-1', this, true).setScale(0.75).setName('lds1Button');
            const lockdownStageII = new Icon(this.scene, this.x + 760, this.y + 400, 'lockdown-stage-2', this, true).setScale(0.75).setName('lds2Button');
            const lockdownStageIII = new Icon(this.scene, this.x + 1160, this.y + 400, 'lockdown-stage-3', this, true).setScale(0.75).setName('lds3Button');
            const lockdownStageIV = new Icon(this.scene, this.x + 960, this.y + 500, 'lockdown-stage-4', this, true).setScale(0.75).setName('lds4Button');
            const publicTransport = new Icon(this.scene, this.x + 760, this.y + 600, 'public-transport', this, true).setScale(0.75).setName('pubtButton');
            const restrictedTraffic = new Icon(this.scene, this.x + 1360, this.y + 500, 'restricted-traffic', this, true).setScale(0.75).setName('rTrButton'); 
            const fincancialSupportI = new Icon(this.scene, this.x + 1160, this.y + 600, 'financial-support-1', this, true).setScale(0.75).setName('fsup1Button'); 
            const fincancialSupportII = new Icon(this.scene, this.x + 960, this.y + 700, 'financial-support-2', this, true).setScale(0.75).setName('fsup2Button');

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
            const expertiseI = new Icon(this.scene, this.x + 960, this.y + 300, 'expertise-1', this, true).setScale(0.75).setName('ex1Button');
            const expertiseII = new Icon(this.scene, this.x + 760, this.y + 400, 'expertise-2', this, true).setScale(0.75).setName('ex2Button');
            const expertiseIII = new Icon(this.scene, this.x + 1160, this.y + 400, 'expertise-3', this, true).setScale(0.75).setName('ex3Button');
            const trackingAppI = new Icon(this.scene, this.x + 960, this.y + 500, 'tracking-1', this, true).setScale(0.75).setName('trck1Button');
            const trackingAppII = new Icon(this.scene, this.x + 760, this.y + 600, 'tracking-2', this, true).setScale(0.75).setName('trck2Button');

            this.add(expertiseI);
            this.add(expertiseII);
            this.add(expertiseIII);
            this.add(trackingAppI);
            this.add(trackingAppII);
        }
    }

    private removeMainSkillButtons(): void {
        this.getByName('mtButton').destroy();
        this.getByName('pButton').destroy();
        this.getByName('tButton').destroy();
        this.getByName('ldButton').destroy();
        this.getByName('cButton').destroy();
    }

    public removeSkillButtons(key: string): void {
        if(key == 'medical-treatment') {
            this.getByName('amsButton').destroy();
            this.getByName('ams2Button').destroy();
            this.getByName('umfButton').destroy();
            this.getByName('umf2Button').destroy();
            this.getByName('umf3Button').destroy();
            this.getByName('medButton').destroy();
            this.getByName('med2Button').destroy();
            this.getByName('med3Button').destroy();
        }
        if(key == 'police') {
            this.getByName('exButton').destroy();
            this.getByName('mil1Button').destroy();
            this.getByName('mil2Button').destroy();
            this.getByName('mil32Button').destroy();
            this.getByName('peButton').destroy();
            this.getByName('tButton').destroy();
            this.getByName('trckButton').destroy();
        }
        if(key == 'testing') {
            this.getByName('adtkButton').destroy();
            this.getByName('utk1Button').destroy();
            this.getByName('utk2Button').destroy();
            this.getByName('nwButton').destroy();
            this.getByName('dnaButton').destroy();
            this.getByName('itButton').destroy();
            
        }
        if(key == 'lockdown') {
            this.getByName('lds1Button').destroy();
            this.getByName('lds2Button').destroy();
            this.getByName('lds3Button').destroy();
            this.getByName('lds4Button').destroy();
            this.getByName('pubtButton').destroy();
            this.getByName('rTrButton').destroy();
            this.getByName('fsup1Button').destroy();
            this.getByName('fsup2Button').destroy();
        }
        if(key == 'citizen') {
            this.getByName('ex1Button').destroy();
            this.getByName('ex2Button').destroy();
            this.getByName('ex3Button').destroy();
            this.getByName('trck1Button').destroy();
            this.getByName('trck2Button').destroy();
        }
    }

    /*
    private addSkillButtons(): Phaser.GameObjects.GameObject[] {
        const medicalTreatmentButton = new Icon(this.scene, this.x + 960, this.y + 250, 'medical-treatment', 'medical-treatment', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { medicalTreatmentButton.setScale(0.85) })
        .on('pointerout', () => { medicalTreatmentButton.setScale(0.75) })
        .on('pointerdown', () => { medicalTreatmentButton.setScale(0.75) })
        .on('pointerup', () => { medicalTreatmentButton.setScale(0.85); this.openMedicalTreatmentsSkillTree('medical-treatment') });
        const policeButton = new Icon(this.scene, this.x + 1240, this.y + 400, 'police', 'police', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { policeButton.setScale(0.85) })
        .on('pointerout', () => { policeButton.setScale(0.75) })
        .on('pointerdown', () => { policeButton.setScale(0.75) })
        .on('pointerup', () => { policeButton.setScale(0.85); });
        const testingButton = new Icon(this.scene, this.x + 1160, this.y + 700, 'testing', 'testing', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { testingButton.setScale(0.85) })
        .on('pointerout', () => { testingButton.setScale(0.75) })
        .on('pointerdown', () => { testingButton.setScale(0.75) })
        .on('pointerup', () => { testingButton.setScale(0.85); });
        const lockdownButton = new Icon(this.scene, this.x + 760, this.y + 700, 'lockdown', 'lockdown', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { lockdownButton.setScale(0.85) })
        .on('pointerout', () => { lockdownButton.setScale(0.75) })
        .on('pointerdown', () => { lockdownButton.setScale(0.75) })
        .on('pointerup', () => { lockdownButton.setScale(0.85); });
        const citizensButton = new Icon(this.scene, this.x + 680, this.y + 400, 'citizen', 'citizen', true).setScale(0.75).setInteractive()
        .on('pointerover', () => { citizensButton.setScale(0.85) })
        .on('pointerout', () => { citizensButton.setScale(0.75) })
        .on('pointerdown', () => { citizensButton.setScale(0.75) })
        .on('pointerup', () => { citizensButton.setScale(0.85); });

        return [
            medicalTreatmentButton, policeButton, testingButton, lockdownButton, citizensButton
        ];
    }

    private openMedicalTreatmentsSkillTree(key: string): void {
        const medicalTreatmentSubTree = new Phaser.GameObjects.Container(this.scene, 0, 0, this.addSkills(key));
        this.scene.add.existing(medicalTreatmentSubTree);

    }

    private addSkills(key: string): Phaser.GameObjects.GameObject[] {
        if(key == 'medical-treatment') {
            const additionalMedicalSuppliesI = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 300, 'additional-medical-supplies').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesI.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesI.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesI.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesI.setScale(0.6); });
            const additionalMedicalSuppliesII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 400, 'additional-medical-supplies').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesII.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesII.setScale(0.6); });
            const upgradeMedicalFacilitiesI = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 400, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { additionalMedicalSuppliesII.setScale(0.6) })
            .on('pointerout', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerdown', () => { additionalMedicalSuppliesII.setScale(0.5) })
            .on('pointerup', () => { additionalMedicalSuppliesII.setScale(0.6); });
            const upgradeMedicalFacilitiesII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 500, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { upgradeMedicalFacilitiesII.setScale(0.6) })
            .on('pointerout', () => { upgradeMedicalFacilitiesII.setScale(0.5) })
            .on('pointerdown', () => { upgradeMedicalFacilitiesII.setScale(0.5) })
            .on('pointerup', () => { upgradeMedicalFacilitiesII.setScale(0.6); });
            const upgradeMedicalFacilitiesIII = new Phaser.GameObjects.Image(this.scene, this.x + 760, this.y + 600, 'upgrade-medical-facilities').setScale(0.5).setInteractive()
            .on('pointerover', () => { upgradeMedicalFacilitiesIII.setScale(0.6) })
            .on('pointerout', () => { upgradeMedicalFacilitiesIII.setScale(0.5) })
            .on('pointerdown', () => { upgradeMedicalFacilitiesIII.setScale(0.5) })
            .on('pointerup', () => { upgradeMedicalFacilitiesIII.setScale(0.6); });
            const medicinI = new Phaser.GameObjects.Image(this.scene, this.x + 1360, this.y + 500, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinI.setScale(0.6) })
            .on('pointerout', () => { medicinI.setScale(0.5) })
            .on('pointerdown', () => { medicinI.setScale(0.5) })
            .on('pointerup', () => { medicinI.setScale(0.6); });
            const medicinII = new Phaser.GameObjects.Image(this.scene, this.x + 1160, this.y + 600, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinII.setScale(0.6) })
            .on('pointerout', () => { medicinII.setScale(0.5) })
            .on('pointerdown', () => { medicinII.setScale(0.5) })
            .on('pointerup', () => { medicinII.setScale(0.6); });
            const medicinIII = new Phaser.GameObjects.Image(this.scene, this.x + 960, this.y + 700, 'medicine').setScale(0.5).setInteractive()
            .on('pointerover', () => { medicinIII.setScale(0.6) })
            .on('pointerout', () => { medicinIII.setScale(0.5) })
            .on('pointerdown', () => { medicinIII.setScale(0.5) })
            .on('pointerup', () => { medicinIII.setScale(0.6); });
        }

        return [

        ]
        
    }*/

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