import { PopupWindow } from "../popupWindow";
import { SkillController } from "../../controller/gui-controller/skillController";
import { Icon } from "./icon";

/**
 * 
 * @author Shao
 */
export class SkillTreeView extends PopupWindow {

    /** Instance of SkillTreeView */
    private static instance: SkillTreeView;

    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    public currentSkillIcons: any;

    public previousSkill: string;

    public skillDescription: Phaser.GameObjects.Text;

    public buyButton: Phaser.GameObjects.Image;
    
    public descriptions = require("./../../../../res/json/skill-descriptions.json");

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 5, 'open-notebook2', innerWidth*0.805, innerHeight*0.055, true, [
            new Phaser.GameObjects.Image(scene, innerWidth*0.705, innerHeight*0.5, 'transparent-area').setOrigin(0.5),
            new Phaser.GameObjects.Text(scene, innerWidth*0.7, innerHeight*0.1, 'Skillbeschreibung', {
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

        this.buyButton = new Phaser.GameObjects.Image(this.scene, innerWidth*0.775, innerHeight*0.9, 'buyButton').setScale(0.4).setOrigin(0.5);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();

        this.currentSkillIcons = this.addCurrentSkillIcons('main');
        this.addSkills(this.currentSkillIcons);
        this.scene.add.existing(this);
    }

    private addBackButton(): void {
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
            this.openMainTree();
            backButton.destroy();
        });
        this.add(backButton);
    }

    public addBuyButton(key: string, skillTree: SkillTreeView): void {
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
            this.activateSkill(key);
        });
        this.add(this.buyButton);
    }

    public openSubtree(key: string, buttons: any): void {
        
        this.currentSkillIcons = buttons;
        this.addBackButton();
        this.addSkills(buttons);
    }

    public openMainTree(): void {
        this.removeCurrentSkills();
        this.currentSkillIcons = this.addCurrentSkillIcons('main');
        this.addSkills(this.currentSkillIcons);
        this.eraseDescription();
        this.destroyBuyButton();
    }

    public addSkills(buttons: any): void {
        for (let i = 0; i < buttons.length; i++) {
            this.add(buttons[i]);
        }
    }

    public removeCurrentSkills(): void {
        for (let i = 0; i < this.currentSkillIcons.length; i++) {
            this.currentSkillIcons[i].destroy();
        }
    }

    public destroyBuyButton(): void {
        if(this.getByName('buyButton') != null) {
            this.getByName('buyButton').destroy();
        }
    }

    public showDescription(key: string): void {
        this.skillDescription.setText(this.descriptions[key]['description']);
    }

    public eraseDescription(): void {
        this.skillDescription.setText(' ');
    }

    public resetPreviouslyPressed(key: string): void {
        this.currentSkillIcons.forEach(icon => {
            if(icon instanceof Icon && icon.name == key) {
                if(!(key == 'medical-treatment' || key == 'police-skill' || key == 'testing-skill' || key == 'lockdown-skill' || key == 'citizen')) {
                    icon.setScale(1.2);
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
        const medicalTreatmentButton = new Icon(this.scene, innerWidth*0.35, innerHeight*0.275, 'medical-treatment', this, false);
        const policeButton = new Icon(this.scene, innerWidth*0.465, innerHeight*0.45, 'police-skill', this, false);
        const testingButton = new Icon(this.scene, innerWidth*0.425, innerHeight*0.725, 'testing-skill', this, false);
        const lockdownButton = new Icon(this.scene, innerWidth*0.28, innerHeight*0.725, 'lockdown-skill', this, false);
        const citizensButton = new Icon(this.scene, innerWidth*0.24, innerHeight*0.45, 'citizen', this, false);
        
        if(key == 'medical-treatment') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Medical-Treatment', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.4, innerHeight*0.555, 'medical-treatment-connections');
            const medicalTreatment = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.25, 'medical-treatment', this, false);
            const additionalMedicalSuppliesI = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.45, 'additional-medical-supplies-1', this, false);
            const additionalMedicalSuppliesII = new Icon(this.scene, innerWidth*0.25, innerHeight*0.55, 'additional-medical-supplies-2', this, false);
            const upgradeMedicalFacilitiesI = new Icon(this.scene, innerWidth*0.455, innerHeight*0.55, 'upgrade-medical-facilities-1', this, false);
            const upgradeMedicalFacilitiesII = new Icon(this.scene, innerWidth*0.345, innerHeight*0.65, 'upgrade-medical-facilities-2', this, false);
            const upgradeMedicalFacilitiesIII = new Icon(this.scene, innerWidth*0.255, innerHeight*0.755, 'upgrade-medical-facilities-3', this, false);
            const medicinI = new Icon(this.scene, innerWidth*0.535, innerHeight*0.65, 'medicine-1', this, false);
            const medicinII = new Icon(this.scene, innerWidth*0.45, innerHeight*0.755, 'medicine-2', this, false);
            const medicinIII = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.875, 'medicine-3', this, false);

            return [title, connections, medicalTreatment, additionalMedicalSuppliesI, additionalMedicalSuppliesII, upgradeMedicalFacilitiesI, upgradeMedicalFacilitiesII, upgradeMedicalFacilitiesIII, medicinI, medicinII, medicinIII]
        }
        if(key == 'police-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Police', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'police-connections');
            const police = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.25, 'police-skill', this, false);
            const learnExpertise = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.475, 'expertise', this, false);
            const militaryI = new Icon(this.scene, innerWidth*0.2675, innerHeight*0.5785, 'military-1', this, false);
            const militaryII = new Icon(this.scene, innerWidth*0.3455, innerHeight*0.675, 'military-2', this, false);
            const militaryIII = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.775, 'military-3', this, false);
            const policeEquipment = new Icon(this.scene, innerWidth*0.1925, innerHeight*0.675, 'police-equipment', this, false);
            const testing = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.5725, 'testing', this, false); 
            const trackingEncounters = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking', this, false);

            return [title, connections, police, learnExpertise, militaryI, militaryII, militaryIII, policeEquipment, testing, trackingEncounters]
        }

        if(key == 'testing-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Testing', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3375, innerHeight*0.5, 'testing-connections');
            const testing = new Icon(this.scene, innerWidth/3, innerHeight/4, 'testing', this, false);
            const additionalTestKits = new Icon(this.scene, innerWidth*0.3325, innerHeight*0.47, 'additional-test-kits', this, false);
            const upgradeTestKitsI = new Icon(this.scene, innerWidth*0.255, innerHeight*0.57, 'upgrade-test-kit-1', this, false);
            const upgradeTestKitsII = new Icon(this.scene, innerWidth*0.1855, innerHeight*0.665, 'upgrade-test-kit-2', this, false);
            const nationwideTesting = new Icon(this.scene, innerWidth*0.4155, innerHeight*0.57, 'nationwide-testing', this, false);
            const dna = new Icon(this.scene, innerWidth*0.4875, innerHeight*0.68, 'dna', this, false);
            const immunityTests = new Icon(this.scene, innerWidth*0.41, innerHeight*0.778, 'immunity-tests', this, false); 

            return [title, connections, testing, additionalTestKits, upgradeTestKitsI, upgradeTestKitsII, nationwideTesting, dna, immunityTests]
        }

        if(key == 'lockdown-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Lockdown', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'lockdown-connections');
            const lockdown = new Icon(this.scene, innerWidth*0.3475, innerHeight/4, 'lockdown-skill', this, false);
            const lockdownStageI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.4675, 'lockdown-stage-1', this, false);
            const lockdownStageII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.57, 'lockdown-stage-2', this, false);
            const lockdownStageIII = new Icon(this.scene, innerWidth*0.195, innerHeight*0.67, 'lockdown-stage-3', this, false);
            const lockdownStageIV = new Icon(this.scene, innerWidth*0.27, innerHeight*0.77, 'lockdown-stage-4', this, false);
            const publicTransport = new Icon(this.scene, innerWidth*0.43, innerHeight*0.57, 'public-transport', this, false);
            const restrictedTraffic = new Icon(this.scene, innerWidth*0.35, innerHeight*0.67, 'restricted-traffic', this, false); 
            const fincancialSupportI = new Icon(this.scene, innerWidth*0.51, innerHeight*0.67, 'financial-support-1', this, false); 
            const fincancialSupportII = new Icon(this.scene, innerWidth*0.43, innerHeight*0.77, 'financial-support-2', this, false);

            return [title, connections, lockdown, lockdownStageI, lockdownStageII, lockdownStageIII, lockdownStageIV, publicTransport, restrictedTraffic, fincancialSupportI, fincancialSupportII]
        }

        if(key == 'citizen') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Citizen', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5);

            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3515, innerHeight*0.45, 'citizens-connections');
            const citizens = new Icon(this.scene, innerWidth*0.35, innerHeight/4, 'citizen', this, false);
            const expertiseI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.475, 'expertise-1', this, false);
            const expertiseII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.575, 'expertise-2', this, false);
            const expertiseIII = new Icon(this.scene, innerWidth*0.19, innerHeight*0.675, 'expertise-3', this, false);
            const trackingAppI = new Icon(this.scene, innerWidth*0.43, innerHeight*0.575, 'tracking-1', this, false);
            const trackingAppII = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking-2', this, false);

            return [title, connections, citizens, expertiseI, expertiseII, expertiseIII, trackingAppI, trackingAppII]
        }
        return [title, connections, medicalTreatmentButton, policeButton, testingButton, lockdownButton, citizensButton]
    }

    public activateSkill(key: string): void {
        this.getByName(key).disableInteractive();
        if(key == 'additional-medical-supplies-1') {
            SkillController.getInstance().activateAdditionalMedicalSuppliesI(SkillController.getInstance());
        }
        if(key == 'additional-medical-supplies-2') {
            SkillController.getInstance().activateAdditionalMedicalSuppliesII(SkillController.getInstance());
        }
        if(key == 'upgrade-medical-facilities-1') {
            SkillController.getInstance().activateUpgradeMedicalFacilitiesI(SkillController.getInstance());
        }
        if(key == 'upgrade-medical-facilities-2') {
            SkillController.getInstance().activateUpgradeMedicalFacilitiesII(SkillController.getInstance());
        }
        if(key == 'upgrade-medical-facilities-3') {
            SkillController.getInstance().activateUpgradeMedicalFacilitiesIII(SkillController.getInstance());
        }
        if(key == 'medicine-1') {
            SkillController.getInstance().activateMedicineI(SkillController.getInstance());
        }
        if(key == 'medicine-2') {
            SkillController.getInstance().activateMedicineII(SkillController.getInstance());
        }
        if(key == 'medicine-3') {
            SkillController.getInstance().activateMedicineIII(SkillController.getInstance());
        }

        if(key == 'expertise') {
            SkillController.getInstance().activateLearnExpertise(SkillController.getInstance());
        }
        if(key == 'military-1') {
            SkillController.getInstance().activateMilitaryI(SkillController.getInstance());
        }
        if(key == 'military-2') {
            SkillController.getInstance().activateMilitaryII(SkillController.getInstance());
        }
        if(key == 'military-3') {
            SkillController.getInstance().activateMilitaryIII(SkillController.getInstance());
        }
        if(key == 'police-equipment') {
            SkillController.getInstance().activatePoliceEquipment(SkillController.getInstance());
        }
        if(key == 'testing') {
            SkillController.getInstance().activateTesting(SkillController.getInstance());
        }
        if(key == 'tracking') {
            SkillController.getInstance().activateTrackingEncounters(SkillController.getInstance());
        }

        if(key == 'additional-test-kits') {
            SkillController.getInstance().activateAdditionalTestKits(SkillController.getInstance());
        }
        if(key == 'upgrade-test-kit-1') {
            SkillController.getInstance().activateUpgradeTestKitI(SkillController.getInstance());
        }
        if(key == 'upgrade-test-kit-2') {
            SkillController.getInstance().activateUpgradeTestKitII(SkillController.getInstance());
        }
        if(key == 'nationwide-testing') {
            SkillController.getInstance().activateNationwideTesting(SkillController.getInstance());
        }
        if(key == 'dna') {
            SkillController.getInstance().activatednaRnaCodeSequence(SkillController.getInstance());
        }
        if(key == 'immunity-tests') {
            SkillController.getInstance().activateImmunityTests(SkillController.getInstance());
        }

        if(key == 'lockdown-stage-1') {
            SkillController.getInstance().activateLockdownStageI(SkillController.getInstance());
        }
        if(key == 'lockdown-stage-2') {
            SkillController.getInstance().activateLockdownStageII(SkillController.getInstance());
        }
        if(key == 'lockdown-stage-3') {
            SkillController.getInstance().activateLockdownStageIII(SkillController.getInstance());
        }
        if(key == 'lockdown-stage-4') {
            SkillController.getInstance().activateLockdownStageIV(SkillController.getInstance());
        }
        if(key == 'public-transport') {
            SkillController.getInstance().activatePublicTransport(SkillController.getInstance());
        }
        if(key == 'restricted-traffic') {
            SkillController.getInstance().activateRestrictedTraffic(SkillController.getInstance());
        }
        if(key == 'financial-support-1') {
            SkillController.getInstance().activateFinancialSupportI(SkillController.getInstance());
        }
        if(key == 'financial-support-2') {
            SkillController.getInstance().activateFinancialSupportI(SkillController.getInstance());
        }

        if(key == 'expertise-1') {
            SkillController.getInstance().activateExpertiseI(SkillController.getInstance());
        }
        if(key == 'expertise-2') {
            SkillController.getInstance().activateExpertiseII(SkillController.getInstance());
        }
        if(key == 'expertise-3') {
            SkillController.getInstance().activateExpertiseIII(SkillController.getInstance());
        }
        if(key == 'tracking-1') {
            SkillController.getInstance().activateTrackingAppI(SkillController.getInstance());
        }
        if(key == 'tracking-2') {
            SkillController.getInstance().activateTrackingAppII(SkillController.getInstance());
        }
    }
}