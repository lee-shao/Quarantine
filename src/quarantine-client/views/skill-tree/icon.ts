import { SkillController } from "../../controller/skillController";
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
        this.setScale(0.4);
        this.setName(texture);

        //scene.add.existing(this);
    }

    private addButtonAnimations(key: string, skillTree: SkillTreeView): void {
        this.setInteractive()
        .on('pointerover', () => {
            this.setScale(0.5);
        })
        .on('pointerout', () => {
            this.setScale(0.4);
        })
        .on('pointerdown', () => {
            this.setScale(0.4);
        })
        .on('pointerup', () => {
            this.setScale(0.5);
            skillTree.openSubtree(key);
            
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

            //skillTree.removeSkillButtons(key);
        });
    }
}