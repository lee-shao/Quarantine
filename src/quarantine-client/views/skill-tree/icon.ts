import { SkillController } from "../../controller/gui-controller/skillController";
import { SkillTreeView } from "./skillTreeView";

export class Icon extends Phaser.GameObjects.Image {
    
    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    private skillIsActive: boolean;

    private button: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, skillTree: SkillTreeView, active: boolean) {
        super(scene, x, y, texture);

        this.availableSkillPoints = SkillController.getInstance().getAvailableSkillPoints();
        this.nextSkillPointPrice = SkillController.getInstance().getNextSkillPointPrice();
        this.skillIsActive = active;

        this.addButtonAnimations(texture, skillTree);

        //this.scene.add.existing(this);
    }

    private addButtonAnimations(key: string, skillTree: SkillTreeView): void {
        this.setInteractive()
        .on('pointerover', () => {
            this.setScale(0.85);
        })
        .on('pointerout', () => {
            this.setScale(0.75);
        })
        .on('pointerdown', () => {
            this.setScale(0.75);
        })
        .on('pointerup', () => {
            this.setScale(0.85);
            skillTree.openSubtree(key);
            
            if(key == 'additional-medical-supplies-1') {
                SkillController.getInstance().activateAdditionalMedicalSuppliesI();
            }
            if(key == 'additional-medical-supplies-2') {
                SkillController.getInstance().activateAdditionalMedicalSuppliesII();
            }
            if(key == 'upgrade-medical-facilities-1') {
                SkillController.getInstance().activateUpgradeMedicalFacilitiesI();
            }
            if(key == 'upgrade-medical-facilities-2') {
                SkillController.getInstance().activateUpgradeMedicalFacilitiesII();
            }
            if(key == 'upgrade-medical-facilities-3') {
                SkillController.getInstance().activateUpgradeMedicalFacilitiesIII();
            }
            if(key == 'medicine-1') {
                SkillController.getInstance().activateMedicineI();
            }
            if(key == 'medicine-2') {
                SkillController.getInstance().activateMedicineII();
            }
            if(key == 'medicine-3') {
                SkillController.getInstance().activateMedicineIII();
            }

            if(key == 'expertise') {
                SkillController.getInstance().activateLearnExpertise();
            }
            if(key == 'military-1') {
                SkillController.getInstance().activateMilitaryI();
            }
            if(key == 'military-2') {
                SkillController.getInstance().activateMilitaryII();
            }
            if(key == 'military-3') {
                SkillController.getInstance().activateMilitaryIII();
            }
            if(key == 'police-equipment') {
                SkillController.getInstance().activatePoliceEquipment();
            }
            if(key == 'testing') {
                SkillController.getInstance().activateTesting();
            }
            if(key == 'tracking') {
                SkillController.getInstance().activateTrackingEncounters();
            }

            if(key == 'additional-test-kits') {
                SkillController.getInstance().activateAdditionalTestKits();
            }
            if(key == 'upgrade-test-kit-1') {
                SkillController.getInstance().activateUpgradeTestKitI();
            }
            if(key == 'upgrade-test-kit-2') {
                SkillController.getInstance().activateUpgradeTestKitII();
            }
            if(key == 'nationwide-testing') {
                SkillController.getInstance().activateNationwideTesting();
            }
            if(key == 'dna') {
                SkillController.getInstance().activatednaRnaCodeSequence();
            }
            if(key == 'immunity-tests') {
                SkillController.getInstance().activateImmunityTests();
            }

            if(key == 'lockdown-stage-1') {
                SkillController.getInstance().activateLockdownStageI();
            }
            if(key == 'lockdown-stage-2') {
                SkillController.getInstance().activateLockdownStageII();
            }
            if(key == 'lockdown-stage-3') {
                SkillController.getInstance().activateLockdownStageIII();
            }
            if(key == 'lockdown-stage-4') {
                SkillController.getInstance().activateLockdownStageIV();
            }
            if(key == 'public-transport') {
                SkillController.getInstance().activatePublicTransport();
            }
            if(key == 'restricted-traffic') {
                SkillController.getInstance().activateRestrictedTraffic();
            }
            if(key == 'financial-support-1') {
                SkillController.getInstance().activateFinancialSupportI();
            }
            if(key == 'financial-support-2') {
                SkillController.getInstance().activateFinancialSupportI();
            }

            if(key == 'expertise-1') {
                SkillController.getInstance().activateExpertiseI();
            }
            if(key == 'expertise-2') {
                SkillController.getInstance().activateExpertiseII();
            }
            if(key == 'expertise-3') {
                SkillController.getInstance().activateExpertiseIII();
            }
            if(key == 'tracking-1') {
                SkillController.getInstance().activateTrackingAppI();
            }
            if(key == 'tracking-2') {
                SkillController.getInstance().activateTrackingAppII();
            }

            //skillTree.removeSkillButtons(key);
        });
    }
}