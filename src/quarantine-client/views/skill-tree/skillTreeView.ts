import { PopupWindow } from "../popupWindow";
import { SkillController } from "../../controller/gui-controller/skillController";
import { Icon } from "./icon";

/**
 * 
 * @author Shao
 */
export class SkillTreeView extends PopupWindow {

    /** Instance of SkillTreeView */
    //private static instance: SkillTreeView;

    public currentSkillIcons: any;

    public previousSkill: string;
    
    public iconIsPressed: boolean;

    public skillDescription: Phaser.GameObjects.Text;

    public backButton: Phaser.GameObjects.Image;
    
    public descriptions = require("./../../../../res/json/skill-descriptions.json");

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 5, 'open-notebook2', innerWidth*0.805, innerHeight*0.055, true, [
            new Phaser.GameObjects.Image(scene, innerWidth*0.705, innerHeight*0.5, 'transparent-area').setOrigin(0.5),
            new Phaser.GameObjects.Text(scene, innerWidth*0.7, innerHeight*0.1, 'Description', {
                color: 'Black', 
                fontSize: '50px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5)
        ],
        false);

        this.skillDescription = new Phaser.GameObjects.Text(this.scene, innerWidth*0.585, innerHeight*0.215, ' ', {
            color: 'Black', 
            fontSize: '20px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        });
        this.add(this.skillDescription);

        this.backButton = new Phaser.GameObjects.Image(this.scene, 320, 870, 'arrow-next').setAngle(180);
        this.addBackButton();
        this.backButton.setVisible(false);

        this.iconIsPressed = false;
        this.currentSkillIcons = this.addCurrentSkillIcons('main');
        this.addSkills(this.currentSkillIcons);
        this.scene.add.existing(this);
    }

    private addBackButton(): void {
        this.backButton.setInteractive()
        .on('pointerover', () => {
            this.backButton.scale = 1.2;
        })
        .on('pointerout', () => {
            this.backButton.scale = 1;
        })
        .on('pointerdown', () => {
            this.backButton.scale = 1;
        })
        .on('pointerup', () => {
            this.backButton.scale = 1.2;
            this.hideCurrentSkills();
            this.openMainTree();
            this.backButton.setVisible(false);
            this.iconIsPressed = false;
        });
        this.add(this.backButton);
    }

    public openSubtree(key: string): void {
        
        this.currentSkillIcons = this.addCurrentSkillIcons(key)
        this.backButton.setVisible(true);
        this.addSkills(this.currentSkillIcons);
    }

    public openMainTree(): void {
        this.currentSkillIcons = this.addCurrentSkillIcons('main');
        this.addSkills(this.currentSkillIcons);
        this.eraseDescription();
    }

    public addSkills(buttons: any): void {
        for (let i = 0; i < buttons.length; i++) {
            this.add(buttons[i]);
        }
    }

    public hideCurrentSkills(): void {
        this.currentSkillIcons.forEach(element => {
            element.setVisible(false);
        });
    }

    public showDescription(key: string): void {
        let concatDescription = '\n\n';
        for (let i = 0; i < this.descriptions[key]['required_skills'].length; i++) {
            const element = this.descriptions[key]['required_skills'][i];
            concatDescription += '      ' + (i+1) + '. ' + element + '\n\n';
        }
        this.skillDescription.setText(this.descriptions[key]['name'] + '\n\n\n' + this.descriptions[key]['description'] + '\n\n\n\n Required skills: ' + concatDescription + '\n\n\n Price: ' + this.descriptions[key]['price'].toLocaleString() + ' €');
    }

    public eraseDescription(): void {
        this.skillDescription.setText(' ');
    }

    public resetPreviouslyPressed(key: string): void {
        this.currentSkillIcons.forEach(icon => {
            if(icon instanceof Icon && icon.name == key) {
                if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
                    icon.resetScale(0.4);
                }
            }
        });
    }

    public hidePreviousBuyButton(key: string): void {
        this.currentSkillIcons.forEach(icon => {
            if(icon instanceof Icon && icon.name == key) {
                if(icon.skillBought == true) {
                    icon.buyButton.destroy();
                }
            }
        });
    }

    public addCurrentSkillIcons(key: string): any[] {
        const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Skill Tree', {
            color: 'Black', 
            fontSize: '70px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setOrigin(0.5);

        const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'connections');
        const medicalTreatmentButton = new Icon(this.scene, innerWidth*0.35, innerHeight*0.275, 'medical-treatment', this, false, false);
        const policeButton = new Icon(this.scene, innerWidth*0.465, innerHeight*0.45, 'police-skill', this, false, false);
        const testingButton = new Icon(this.scene, innerWidth*0.425, innerHeight*0.725, 'testing-skill', this, false, false);
        const lockdownButton = new Icon(this.scene, innerWidth*0.28, innerHeight*0.725, 'lockdown-skill', this, false, false);
        const citizensButton = new Icon(this.scene, innerWidth*0.24, innerHeight*0.45, 'citizen', this, false, false);
        
        if(key == 'medical-treatment') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Medical-Treatment', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.4, innerHeight*0.555, 'medical-treatment-connections');
            const medicalTreatment = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.25, 'medical-treatment', this, false, false);
            const additionalMedicalSuppliesI = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.45, 'additional-medical-supplies-1', this, false, SkillController.getInstance().additionalMedicalSuppliesI);
            const additionalMedicalSuppliesII = new Icon(this.scene, innerWidth*0.25, innerHeight*0.55, 'additional-medical-supplies-2', this, false, SkillController.getInstance().additionalMedicalSuppliesII);
            const upgradeMedicalFacilitiesI = new Icon(this.scene, innerWidth*0.455, innerHeight*0.55, 'upgrade-medical-facilities-1', this, false, SkillController.getInstance().upgradeMedicalFacilitiesI);
            const upgradeMedicalFacilitiesII = new Icon(this.scene, innerWidth*0.345, innerHeight*0.65, 'upgrade-medical-facilities-2', this, false, SkillController.getInstance().upgradeMedicalFacilitiesII);
            const upgradeMedicalFacilitiesIII = new Icon(this.scene, innerWidth*0.255, innerHeight*0.755, 'upgrade-medical-facilities-3', this, false, SkillController.getInstance().upgradeMedicalFacilitiesIII);
            const medicinI = new Icon(this.scene, innerWidth*0.535, innerHeight*0.65, 'medicine-1', this, false, SkillController.getInstance().medicineI);
            const medicinII = new Icon(this.scene, innerWidth*0.45, innerHeight*0.755, 'medicine-2', this, false, SkillController.getInstance().medicineII);
            const medicinIII = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.875, 'medicine-3', this, false, SkillController.getInstance().medicineIII);

            return [title, connections, medicalTreatment, additionalMedicalSuppliesI, additionalMedicalSuppliesII, upgradeMedicalFacilitiesI, upgradeMedicalFacilitiesII, upgradeMedicalFacilitiesIII, medicinI, medicinII, medicinIII]
        }
        if(key == 'police-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Police', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'police-connections');
            const police = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.25, 'police-skill', this, false, false);
            const learnExpertise = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.475, 'expertise', this, false, SkillController.getInstance().learnExpertise);
            const militaryI = new Icon(this.scene, innerWidth*0.2675, innerHeight*0.5785, 'military-1', this, false, SkillController.getInstance().militaryI);
            const militaryII = new Icon(this.scene, innerWidth*0.3455, innerHeight*0.675, 'military-2', this, false, SkillController.getInstance().militaryII);
            const militaryIII = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.775, 'military-3', this, false, SkillController.getInstance().militaryIII);
            const policeEquipment = new Icon(this.scene, innerWidth*0.1925, innerHeight*0.675, 'police-equipment', this, false, SkillController.getInstance().policeEquipment);
            const testing = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.5725, 'testing', this, false, SkillController.getInstance().testing); 
            const trackingEncounters = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking', this, false, SkillController.getInstance().trackingEncounters);

            return [title, connections, police, learnExpertise, militaryI, militaryII, militaryIII, policeEquipment, testing, trackingEncounters]
        }

        if(key == 'testing-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Testing', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3375, innerHeight*0.5, 'testing-connections');
            const testing = new Icon(this.scene, innerWidth/3, innerHeight/4, 'testing-skill', this, false, false);
            const additionalTestKits = new Icon(this.scene, innerWidth*0.3325, innerHeight*0.47, 'additional-test-kits', this, false, SkillController.getInstance().additionalTestKits);
            const upgradeTestKitsI = new Icon(this.scene, innerWidth*0.255, innerHeight*0.57, 'upgrade-test-kit-1', this, false, SkillController.getInstance().upgradeTestKitI);
            const upgradeTestKitsII = new Icon(this.scene, innerWidth*0.1855, innerHeight*0.665, 'upgrade-test-kit-2', this, false, SkillController.getInstance().upgradeTestKitII);
            const nationwideTesting = new Icon(this.scene, innerWidth*0.4155, innerHeight*0.57, 'nationwide-testing', this, false, SkillController.getInstance().nationwideTesting);
            const dna = new Icon(this.scene, innerWidth*0.4875, innerHeight*0.68, 'dna', this, false, SkillController.getInstance().dnaRnaCodeSequence);
            const immunityTests = new Icon(this.scene, innerWidth*0.41, innerHeight*0.778, 'immunity-tests', this, false, SkillController.getInstance().immunityTests); 

            return [title, connections, testing, additionalTestKits, upgradeTestKitsI, upgradeTestKitsII, nationwideTesting, dna, immunityTests]
        }

        if(key == 'lockdown-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Lockdown', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'lockdown-connections');
            const lockdown = new Icon(this.scene, innerWidth*0.3475, innerHeight/4, 'lockdown-skill', this, false, false);
            const lockdownStageI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.4675, 'lockdown-stage-1', this, false, SkillController.getInstance().lockdownStageI);
            const lockdownStageII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.57, 'lockdown-stage-2', this, false, SkillController.getInstance().lockdownStageII);
            const lockdownStageIII = new Icon(this.scene, innerWidth*0.195, innerHeight*0.67, 'lockdown-stage-3', this, false, SkillController.getInstance().lockdownStageIII);
            const lockdownStageIV = new Icon(this.scene, innerWidth*0.27, innerHeight*0.77, 'lockdown-stage-4', this, false, SkillController.getInstance().lockdownStageIV);
            const publicTransport = new Icon(this.scene, innerWidth*0.43, innerHeight*0.57, 'public-transport', this, false, SkillController.getInstance().publicTransport);
            const restrictedTraffic = new Icon(this.scene, innerWidth*0.35, innerHeight*0.67, 'restricted-traffic', this, false, SkillController.getInstance().restrictedTraffic); 
            const fincancialSupportI = new Icon(this.scene, innerWidth*0.51, innerHeight*0.67, 'financial-support-1', this, false, SkillController.getInstance().financialSupportI); 
            const fincancialSupportII = new Icon(this.scene, innerWidth*0.43, innerHeight*0.77, 'financial-support-2', this, false, SkillController.getInstance().financialSupportII);

            return [title, connections, lockdown, lockdownStageI, lockdownStageII, lockdownStageIII, lockdownStageIV, publicTransport, restrictedTraffic, fincancialSupportI, fincancialSupportII]
        }

        if(key == 'citizen') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Citizen', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3515, innerHeight*0.45, 'citizens-connections');
            const citizens = new Icon(this.scene, innerWidth*0.35, innerHeight/4, 'citizen', this, false, false);
            const expertiseI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.475, 'expertise-1', this, false, SkillController.getInstance().expertiseI);
            const expertiseII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.575, 'expertise-2', this, false, SkillController.getInstance().expertiseII);
            const expertiseIII = new Icon(this.scene, innerWidth*0.19, innerHeight*0.675, 'expertise-3', this, false, SkillController.getInstance().expertiseIII);
            const trackingAppI = new Icon(this.scene, innerWidth*0.43, innerHeight*0.575, 'tracking-1', this, false, SkillController.getInstance().trackingAppI);
            const trackingAppII = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking-2', this, false, SkillController.getInstance().trackingAppII);

            return [title, connections, citizens, expertiseI, expertiseII, expertiseIII, trackingAppI, trackingAppII]
        }
        return [title, connections, medicalTreatmentButton, policeButton, testingButton, lockdownButton, citizensButton]
    }

    public activateSkill(key: string): boolean {
        this.getByName(key).disableInteractive();
        if(key == 'additional-medical-supplies-1') {
            return SkillController.getInstance().activateAdditionalMedicalSuppliesI(key);
        }
        if(key == 'additional-medical-supplies-2') {
            return SkillController.getInstance().activateAdditionalMedicalSuppliesII(key);
        }
        if(key == 'upgrade-medical-facilities-1') {
            return SkillController.getInstance().activateUpgradeMedicalFacilitiesI(key);
        }
        if(key == 'upgrade-medical-facilities-2') {
            return SkillController.getInstance().activateUpgradeMedicalFacilitiesII(key);
        }
        if(key == 'upgrade-medical-facilities-3') {
            return SkillController.getInstance().activateUpgradeMedicalFacilitiesIII(key);
        }
        if(key == 'medicine-1') {
            return SkillController.getInstance().activateMedicineI(key);
        }
        if(key == 'medicine-2') {
            return SkillController.getInstance().activateMedicineII(key);
        }
        if(key == 'medicine-3') {
            return SkillController.getInstance().activateMedicineIII(key);
        }

        if(key == 'expertise') {
            return SkillController.getInstance().activateLearnExpertise(key);
        }
        if(key == 'military-1') {
            return SkillController.getInstance().activateMilitaryI(key);
        }
        if(key == 'military-2') {
            return SkillController.getInstance().activateMilitaryII(key);
        }
        if(key == 'military-3') {
            return SkillController.getInstance().activateMilitaryIII(key);
        }
        if(key == 'police-equipment') {
            return SkillController.getInstance().activatePoliceEquipment(key);
        }
        if(key == 'testing') {
            return SkillController.getInstance().activateTesting(key);
        }
        if(key == 'tracking') {
            return SkillController.getInstance().activateTrackingEncounters(key);
        }

        if(key == 'additional-test-kits') {
            return SkillController.getInstance().activateAdditionalTestKits(key);
        }
        if(key == 'upgrade-test-kit-1') {
            return SkillController.getInstance().activateUpgradeTestKitI(key);
        }
        if(key == 'upgrade-test-kit-2') {
            return SkillController.getInstance().activateUpgradeTestKitII(key);
        }
        if(key == 'nationwide-testing') {
            return SkillController.getInstance().activateNationwideTesting(key);
        }
        if(key == 'dna') {
            return SkillController.getInstance().activatednaRnaCodeSequence(key);
        }
        if(key == 'immunity-tests') {
            return SkillController.getInstance().activateImmunityTests(key);
        }

        if(key == 'lockdown-stage-1') {
            return SkillController.getInstance().activateLockdownStageI(key);
        }
        if(key == 'lockdown-stage-2') {
            return SkillController.getInstance().activateLockdownStageII(key);
        }
        if(key == 'lockdown-stage-3') {
            return SkillController.getInstance().activateLockdownStageIII(key);
        }
        if(key == 'lockdown-stage-4') {
            return SkillController.getInstance().activateLockdownStageIV(key);
        }
        if(key == 'public-transport') {
            return SkillController.getInstance().activatePublicTransport(key);
        }
        if(key == 'restricted-traffic') {
            return SkillController.getInstance().activateRestrictedTraffic(key);
        }
        if(key == 'financial-support-1') {
            return SkillController.getInstance().activateFinancialSupportI(key);
        }
        if(key == 'financial-support-2') {
            return SkillController.getInstance().activateFinancialSupportII(key);
        }

        if(key == 'expertise-1') {
            return SkillController.getInstance().activateExpertiseI(key);
        }
        if(key == 'expertise-2') {
            return SkillController.getInstance().activateExpertiseII(key);
        }
        if(key == 'expertise-3') {
            return SkillController.getInstance().activateExpertiseIII(key);
        }
        if(key == 'tracking-1') {
            return SkillController.getInstance().activateTrackingAppI(key);
        }
        if(key == 'tracking-2') {
            return SkillController.getInstance().activateTrackingAppII(key);
        }
        return
    }
}