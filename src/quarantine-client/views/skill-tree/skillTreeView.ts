import { PopupWindow } from "../popupWindow";
import { SkillController } from "../../controller/skillController";
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

        this.buyButton = new Phaser.GameObjects.Image(this.scene, innerWidth*0.775, innerHeight*0.9, 'buyButton').setScale(0.4).setOrigin(0.5).setName('buyButton').setInteractive();

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();

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
            //this.addSkillTitles();
            this.removeSkillButtons(key);
            backButton.destroy();
        });
        this.add(backButton);
    }

    public addBuyButton(key: string, skillTree: SkillTreeView): void {
        this.buyButton
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
            this.buyButton.disableInteractive();
            this.activateSkill(key, skillTree);
        });
        this.add(this.buyButton);
    }

    private addSkillButtons(): void {
        const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Skill Tree', {
            color: 'Black', 
            fontSize: '70px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }).setOrigin(0.5).setName('skilltree');
        const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'connections').setName('connections');
        const medicalTreatmentButton = new Icon(this.scene, innerWidth*0.35, innerHeight*0.275, 'medical-treatment', this, true);
        const policeButton = new Icon(this.scene, innerWidth*0.465, innerHeight*0.45, 'police-skill', this, true);
        const testingButton = new Icon(this.scene, innerWidth*0.425, innerHeight*0.725, 'testing-skill', this, true);
        const lockdownButton = new Icon(this.scene, innerWidth*0.28, innerHeight*0.725, 'lockdown-skill', this, true);
        const citizensButton = new Icon(this.scene, innerWidth*0.24, innerHeight*0.45, 'citizen', this, true);

        this.add(title);
        this.add(connections);
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
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Medical-Treatment', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('medical-treatment-title');
            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.4, innerHeight*0.555, 'medical-treatment-connections').setName('medical-treatment-connections');
            const medicalTreatment = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.25, 'medical-treatment', this, true).disableInteractive();
            const additionalMedicalSuppliesI = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.45, 'additional-medical-supplies-1', this, true);
            const additionalMedicalSuppliesII = new Icon(this.scene, innerWidth*0.25, innerHeight*0.55, 'additional-medical-supplies-2', this, true);
            const upgradeMedicalFacilitiesI = new Icon(this.scene, innerWidth*0.455, innerHeight*0.55, 'upgrade-medical-facilities-1', this, true);
            const upgradeMedicalFacilitiesII = new Icon(this.scene, innerWidth*0.345, innerHeight*0.65, 'upgrade-medical-facilities-2', this, true);
            const upgradeMedicalFacilitiesIII = new Icon(this.scene, innerWidth*0.255, innerHeight*0.755, 'upgrade-medical-facilities-3', this, true);
            const medicinI = new Icon(this.scene, innerWidth*0.535, innerHeight*0.65, 'medicine-1', this, true);
            const medicinII = new Icon(this.scene, innerWidth*0.45, innerHeight*0.755, 'medicine-2', this, true);
            const medicinIII = new Icon(this.scene, innerWidth*0.3525, innerHeight*0.875, 'medicine-3', this, true);

            this.add(title);
            this.add(connections);
            this.add(medicalTreatment);
            this.add(additionalMedicalSuppliesI);
            this.add(additionalMedicalSuppliesII);
            this.add(upgradeMedicalFacilitiesI);
            this.add(upgradeMedicalFacilitiesII);
            this.add(upgradeMedicalFacilitiesIII);
            this.add(medicinI);
            this.add(medicinII);
            this.add(medicinIII);
        }

        if(key == 'police-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Police', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('police-title');
            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'police-connections').setName('police-connections');
            const police = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.25, 'police-skill', this, true).disableInteractive();
            const learnExpertise = new Icon(this.scene, innerWidth*0.3475, innerHeight*0.475, 'expertise', this, true);
            const militaryI = new Icon(this.scene, innerWidth*0.2675, innerHeight*0.5785, 'military-1', this, true);
            const militaryII = new Icon(this.scene, innerWidth*0.3455, innerHeight*0.675, 'military-2', this, true);
            const militaryIII = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.775, 'military-3', this, true);
            const policeEquipment = new Icon(this.scene, innerWidth*0.1925, innerHeight*0.675, 'police-equipment', this, true);
            const testing = new Icon(this.scene, innerWidth*0.4325, innerHeight*0.5725, 'testing', this, true); 
            const trackingEncounters = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking', this, true);

            this.add(title);
            this.add(connections);
            this.add(police);
            this.add(learnExpertise);
            this.add(militaryI);
            this.add(militaryII);
            this.add(militaryIII);
            this.add(policeEquipment);
            this.add(testing);
            this.add(trackingEncounters);
        }

        if(key == 'testing-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Testing', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('testing-title');
            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3375, innerHeight*0.5, 'testing-connections').setName('testing-connections');
            const testing = new Icon(this.scene, innerWidth/3, innerHeight/4, 'testing', this, true).disableInteractive();
            const additionalTestKits = new Icon(this.scene, innerWidth*0.3325, innerHeight*0.47, 'additional-test-kits', this, true);
            const upgradeTestKitsI = new Icon(this.scene, innerWidth*0.255, innerHeight*0.57, 'upgrade-test-kit-1', this, true);
            const upgradeTestKitsII = new Icon(this.scene, innerWidth*0.1855, innerHeight*0.665, 'upgrade-test-kit-2', this, true);
            const nationwideTesting = new Icon(this.scene, innerWidth*0.4155, innerHeight*0.57, 'nationwide-testing', this, true);
            const dna = new Icon(this.scene, innerWidth*0.4875, innerHeight*0.68, 'dna', this, true);
            const immunityTests = new Icon(this.scene, innerWidth*0.41, innerHeight*0.778, 'immunity-tests', this, true); 

            this.add(title);
            this.add(connections);
            this.add(testing);
            this.add(additionalTestKits);
            this.add(upgradeTestKitsI);
            this.add(upgradeTestKitsII);
            this.add(nationwideTesting);
            this.add(dna);
            this.add(immunityTests);
        }

        if(key == 'lockdown-skill') {
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Lockdown', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('lockdown-title');
            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.35, innerHeight*0.5, 'lockdown-connections').setName('lockdown-connections');
            const lockdown = new Icon(this.scene, innerWidth*0.3475, innerHeight/4, 'lockdown-skill', this, true).disableInteractive();
            const lockdownStageI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.4675, 'lockdown-stage-1', this, true);
            const lockdownStageII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.57, 'lockdown-stage-2', this, true);
            const lockdownStageIII = new Icon(this.scene, innerWidth*0.195, innerHeight*0.67, 'lockdown-stage-3', this, true);
            const lockdownStageIV = new Icon(this.scene, innerWidth*0.27, innerHeight*0.77, 'lockdown-stage-4', this, true);
            const publicTransport = new Icon(this.scene, innerWidth*0.43, innerHeight*0.57, 'public-transport', this, true);
            const restrictedTraffic = new Icon(this.scene, innerWidth*0.35, innerHeight*0.67, 'restricted-traffic', this, true); 
            const fincancialSupportI = new Icon(this.scene, innerWidth*0.51, innerHeight*0.67, 'financial-support-1', this, true); 
            const fincancialSupportII = new Icon(this.scene, innerWidth*0.43, innerHeight*0.77, 'financial-support-2', this, true);

            this.add(title);
            this.add(connections);
            this.add(lockdown);
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
            const title = new Phaser.GameObjects.Text(this.scene, innerWidth*0.35, innerHeight*0.1, 'Citizen', {
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            }).setOrigin(0.5).setName('citizen-title');
            const connections = new Phaser.GameObjects.Image(this.scene, innerWidth*0.3515, innerHeight*0.45, 'citizens-connections').setName('citizens-connections');
            const citizens = new Icon(this.scene, innerWidth*0.35, innerHeight/4, 'citizen', this, true).disableInteractive();
            const expertiseI = new Icon(this.scene, innerWidth*0.35, innerHeight*0.475, 'expertise-1', this, true);
            const expertiseII = new Icon(this.scene, innerWidth*0.27, innerHeight*0.575, 'expertise-2', this, true);
            const expertiseIII = new Icon(this.scene, innerWidth*0.19, innerHeight*0.675, 'expertise-3', this, true);
            const trackingAppI = new Icon(this.scene, innerWidth*0.43, innerHeight*0.575, 'tracking-1', this, true);
            const trackingAppII = new Icon(this.scene, innerWidth*0.51, innerHeight*0.675, 'tracking-2', this, true);

            this.add(title);
            this.add(connections);
            this.add(citizens);
            this.add(expertiseI);
            this.add(expertiseII);
            this.add(expertiseIII);
            this.add(trackingAppI);
            this.add(trackingAppII);
        }
    }

    private removeMainSkillButtons(): void {
        this.getByName('skilltree').destroy();
        this.getByName('connections').destroy();
        this.getByName('medical-treatment').destroy();
        this.getByName('police-skill').destroy();
        this.getByName('testing-skill').destroy();
        this.getByName('lockdown-skill').destroy();
        this.getByName('citizen').destroy();
    }

    public removeSkillButtons(key: string): void {
        this.eraseDescription();
        if(key == 'medical-treatment') {
            this.getByName('medical-treatment-title').destroy();
            this.getByName('medical-treatment-connections').destroy();
            this.getByName('medical-treatment').destroy();
            this.getByName('additional-medical-supplies-1').destroy();
            this.getByName('additional-medical-supplies-2').destroy();
            this.getByName('upgrade-medical-facilities-1').destroy();
            this.getByName('upgrade-medical-facilities-2').destroy();
            this.getByName('upgrade-medical-facilities-3').destroy();
            this.getByName('medicine-1').destroy();
            this.getByName('medicine-2').destroy();
            this.getByName('medicine-3').destroy();
        }
        if(key == 'police-skill') {
            this.getByName('police-title').destroy();
            this.getByName('police-connections').destroy();
            this.getByName('police-skill').destroy();
            this.getByName('expertise').destroy();
            this.getByName('military-1').destroy();
            this.getByName('military-2').destroy();
            this.getByName('military-3').destroy();
            this.getByName('police-equipment').destroy();
            this.getByName('testing').destroy();
            this.getByName('tracking').destroy();
        }
        if(key == 'testing-skill') {
            this.getByName('testing-title').destroy();
            this.getByName('testing-connections').destroy();
            this.getByName('testing').destroy();
            this.getByName('additional-test-kits').destroy();
            this.getByName('upgrade-test-kit-1').destroy();
            this.getByName('upgrade-test-kit-2').destroy();
            this.getByName('nationwide-testing').destroy();
            this.getByName('dna').destroy();
            this.getByName('immunity-tests').destroy();
        }
        if(key == 'lockdown-skill') {
            this.getByName('lockdown-title').destroy();
            this.getByName('lockdown-connections').destroy();
            this.getByName('lockdown-skill').destroy();
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
            this.getByName('citizens-connections').destroy();
            this.getByName('citizen').destroy();
            this.getByName('expertise-1').destroy();
            this.getByName('expertise-2').destroy();
            this.getByName('expertise-3').destroy();
            this.getByName('tracking-1').destroy();
            this.getByName('tracking-2').destroy();
        }
    }

    public activateSkill(key: string, skillTree: SkillTreeView): void {
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

    public showDescription(key: string): void {
        this.skillDescription.setText(this.descriptions[key]['description']);
    }

    public destroyBuyButton(): void {
        if(this.getByName('buyButton') != null) {
            this.getByName('buyButton').destroy();
        }
    }

    public eraseDescription(): void {
        this.skillDescription.setText(' ');
    }
    
}