import { Stats } from "../stats";
import { Controller } from "../controller"
import { Role } from "../../models/util/enums/roles";
import { UpgradeController } from "./upgradeController";

/**
 * Singleton controller which implements all skills of the skill tree.
 * Each skill has an activation flag and an affiliated function! 
 * (beginning with activate...)
 * @author Marvin Kruber
 */
export class SkillController {

    /** Singleton instance of SkillController */
    private static instance: SkillController;

    /** Singleton instance which holds game variables */
    private stats: Stats;

    /** Singleton instance of Controller */
    private controller: Controller;                           //TODO Implement budgetController

    /** Singleton instance of UpgradeController */
    private uC: UpgradeController;

    /** Number of currently available skill points */
    private availableSkillPoints: number; 

    /** Purchase price of the next skill point */
    private nextSkillPointPrice: number;

    /** Maximum purchase price for a skill point */
    private maximumSkillPointPrice: number;

    private constructor() {
        this.stats = Stats.getInstance();
        this.controller = Controller.getInstance();
        this.uC = UpgradeController.getInstance();

        this.availableSkillPoints = 3; //could be outsourced to stats => see difficulty level
        this.nextSkillPointPrice = 500_000_000;
        this.maximumSkillPointPrice = 5_000_000_000;
    }

    // ----------------------------------------------------------------- GENERAL METHODS

    /**
     * Buys skill point and calculates the price 
     * for the next skill point. {@see skillController.ts#updateNextSkillPointPrice}
     * @returns false, if the player is not solvent
     */
    public buySkillPoint(): boolean {
        if (this.skillBuyable() == false) return false;

        this.stats.budget -= this.nextSkillPointPrice; //buy skill point
        this.availableSkillPoints++;

        this.updateNextSkillPointPrice();
    }

    /**
     * test if player is solvent (edit: Shao)
     */
    public skillBuyable(): boolean {
        if(! (this.stats.budget < this.nextSkillPointPrice)) return false; //tests if player is solvent
        else return true;
    }

    /** Calculates the purchase price for the next skill point. 
     * The maximum price is determined by {@see maximumSkillPointPrice} 
     */
    private updateNextSkillPointPrice(): void {
        this.nextSkillPointPrice = Math.floor(this.nextSkillPointPrice * 1.2);

        if(this.nextSkillPointPrice >= this.maximumSkillPointPrice) this.nextSkillPointPrice = this.maximumSkillPointPrice;
    }

    /**
     * Checks whether the prerequsites for activating the skill are met and, in this case,
     * it invokes the passed skill function
     * @param requiredSkillPoints Number of skill points which is required to activate the skill
     * @param requiredSkills Abilities which have to be skilled previously
     * @param skill Anonymous function which contains the actual skill logic
     * @returns if the activation was successful
     */
    private activateSkill(requiredSkillPoints: number, requiredSkills: boolean[], skill: Function): boolean {
        //Checks if player has enough available skill points and if all required abilities are skilled
        if( (requiredSkillPoints > this.availableSkillPoints) || (requiredSkills.filter(x => !x).length > 0) ) return false;

        skill();
        this.availableSkillPoints -= requiredSkillPoints;
        return true;
    }

    // ========================================================================================================================= SKILL TREE


    // ----------------------------------------------------------------- MEDICAL TREATMENT

    /**
     * The government buys a package of medical supplies, to fill up 
     * the needs of all hospitals and medical staff. (Medical supplies 
     * consist of the most necessary medical equipment like face masks, 
     * gloves, disinfectant, etc.)
     * @returns wether the skill is activated successfully
     */
    public activateAdditionalMedicalSuppliesI(): boolean {
        return this.activateSkill(1, [], () => {
            this.additionalMedicalSuppliesI = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    private additionalMedicalSuppliesI = false;

    /**
     * The government declares state of emergency. Large amounts 
     * of money will be spent on additional medical supplies.  
     * Medical staff will be provided with upgraded face masks (FFP3-masks).
     * @returns wether the skill is activated successfully
     */
public activateAdditionalMedicalSuppliesII(): boolean {
        return this.activateSkill(1, [this.additionalMedicalSuppliesI], () => {
            this.additionalMedicalSuppliesII = true;
            this.stats.currentPriceTestKit -= 10;
        })
    }
    private additionalMedicalSuppliesII = false;

    
    /**
     * Increase of hygiene standards and additional medical staff 
     * in hospitals and other medical facilities.
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesI(): boolean {
        return this.activateSkill(2, [this.additionalMedicalSuppliesI], () => {
            this.upgradeMedicalFacilitiesI = true;
            this.controller.distributeNewRoles(10000, Role.HEALTH_WORKER, true);
        })
    }

    private upgradeMedicalFacilitiesI = false;

    /**
     * Hospitals will be upgraded with modern medical equipment. 
     * (Isolated ventilation systems, ventilators, etc. to enable 
     * isolated treatments in quarantine)
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesII(): boolean {
        return this.activateSkill(2, [this.upgradeMedicalFacilitiesI], () => {
            this.upgradeMedicalFacilitiesII = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    private upgradeMedicalFacilitiesII = false;

    /**
     * Large investments in all medical facilities. New hospitals built out of nothing. 
     * Large research institutes working together. Medical staff are getting protective 
     * suits with masks and filter attachments.
     * @returns wether the skill is activated successfully  
     */
    public activateUpgradeMedicalFacilitiesIII(): boolean {
        return this.activateSkill(3, [this.upgradeMedicalFacilitiesII], () => {
            this.upgradeMedicalFacilitiesIII = true;
            this.stats.currentPriceVaccination -= 10;
            this.stats.currentSalaryHW -= 5;
        })
    }

    private upgradeMedicalFacilitiesIII = false;

    /**
     * A research institute dithisovered the effectiveness of a 
     * medicine which can reduce symptoms.
     * @returns wether the skill is activated successfully
     */
    public activateMedicineI(): boolean {
        return this.activateSkill(1, [this.upgradeMedicalFacilitiesI], () => {
            this.medicineI = true;
            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL <= 5) { // Last 3 levels of research can not be bought this way
                this.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    private medicineI = false;


    /**
     * A new medicine developed to slow down the speed of 
     * the spreading, in the human body.
     * 
     * (requires “DNA/ RNA Code-Sequence” from [Testing])
     * @returns wether the skill is activated successfully
     */
    public activateMedicineII(): boolean {
        return this.activateSkill(1, [this.medicineI, this.dnaRnaCodeSequence], () => {
            this.medicineII = true;
            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL <= 6) { // Last 3 levels of research can not be bought this way
                this.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    private medicineII = false;

    /**
     * A highly effective medicine got developed, which can stop the 
     * virus from spreading in the human body. If taken early enough 
     * there is a high chance the human will survive
     * @returns wether the skill is activated successfully
     */
    public activateMedicineIII(): boolean {
        return this.activateSkill(1, [this.medicineII], () => {
            this.medicineIII = true;

            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL == 9) { // Introduces alternative bonus
                this.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, false);
                this.stats.currentSalaryHW -= 20;
            } else { //Introduces cure without paying
                this.uC.measures["research"]["current_level"] = 8;
                const price = this.uC.measures["research"]["prices"][8];
                this.stats.budget += price;
                this.uC.buyResearchLevel();
            }
        })
    }

    private medicineIII = false;

    // ----------------------------------------------------------------- POLICE

    /**
     * Police will be informed and educated by experts and are spreading 
     * facts and positive hope messages to citizen by contact. Citizen will 
     * trust the police and feel safer.
     * @returns wether the skill is activated successfully
     */
    public activateLearnExpertise(): boolean {
        return this.activateSkill(1, [], () => {
            this.learnExpertise = true;
            this.stats.happinessRate += 0.5;
        })
    }

    private learnExpertise = false;

    /**
     * Police forces will be provided extra safety equipment in which 
     * they feel safer. This increases the effectiveness of the police. 
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * 
     * @returns wether the skill is activated successfully
     */
    public activatePoliceEquipment(): boolean {
        return this.activateSkill(1, [this.learnExpertise, this.additionalMedicalSuppliesI], () => {
            this.policeEquipment = true;
            this.stats.happinessRate += 0.5;
        })
    }

    private policeEquipment = false;

    /**
     * Police forces will be provided with test-kits and can test citizen, 
     * which they suspect of illness. 
     * @returns wether the skill is activated successfully
     */
    public activateTesting(): boolean {
        return this.activateSkill(1, [this.learnExpertise], () => {
            this.testing = true;
            this.controller.distributeNewRoles(100, Role.HEALTH_WORKER, true);
        })
    }

    private testing = false;

    /**
     * The police are now able to track the people, which might have encountered 
     * with already infected people.
     * 
     * (requires “Nationwide Testing” from [Testing])
     * @returns wether the skill is activated successfully
     */
    public activateTrackingEncounters(): boolean {
        return this.activateSkill(1, [this.testing, this.nationwideTesting], () => {
            this.trackingEncounters = true;
            this.controller.distributeNewRoles(200, Role.HEALTH_WORKER, true);
        })
    }

    private trackingEncounters = false;

    /**
     * The government deploy military troops in the major cities to provide 
     * security and maintain control. This reduces the chance that citizen 
     * will violate the law and break out of lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryI(): boolean {
        return this.activateSkill(1, [this.learnExpertise], () => {
            this.militaryI = true;
            this.stats.maxInteractionVariance *= 0.9;
            this.stats.basicInteractionRate *= 0.9;
        })
    }

    private militaryI = false;

    /**
     * All military forces are deployed around the whole country to provide 
     * security and maintain control. Any outbreak or violation of the law 
     * will be punished immediately. The military uses transport vehicles 
     * to provide food to the citizens and transport infected people to hospitals.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryII(): boolean {
        return this.activateSkill(1, [this.militaryI], () => {
            this.militaryII = true;
            this.stats.maxInteractionVariance *= 0.8;
            this.stats.basicInteractionRate *= 0.8;
        })
    }

    private militaryII = false;

    /**
     * All cities are under entry and exit ban. Major roads are blocked by 
     * military forces. The military has the instruction to shoot down any 
     * citizen, who attempts to break out from a lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryIII(): boolean {
        return this.activateSkill(1, [this.militaryII], () => {
            this.militaryIII = true;
            this.stats.maxInteractionVariance *= 0.7;
            this.stats.basicInteractionRate *= 0.7;
            this.stats.happinessRate -= 1;
        })
    }

    private militaryIII = false;

    // ----------------------------------------------------------------- TESTING

    /**
     * The government use funds and loans to stock up the amount of test-kits. 
     * The overall number of tests per day will increase.
     * @returns wether the skill is activated successfully
     */
    public activateAdditionalTestKits(): boolean {
        return this.activateSkill(1, [], () => {
            this.additionalTestKits = true;
            this.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, true);
        })
    }

    private additionalTestKits = false;

    /**
     * A research institute developed a new method of testing which is more 
     * reliable than the old tests. 
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitI(): boolean {
        return this.activateSkill(1, [this.additionalTestKits], () => {
            this.upgradeTestKitI = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    private upgradeTestKitI = false;

    /**
     * Testing is now faster and even more reliable.
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitII(): boolean {
        return this.activateSkill(1, [this.upgradeTestKitI], () => {
            this.upgradeTestKitII = true;
            this.stats.currentPriceTestKit -= 15;
            this.stats.currentPriceVaccination -= 15;
        })
    }

    private upgradeTestKitII = false;

    /**
     * The government declares to not only test the people with symptoms and 
     * those who had contact to those but allowing nationwide tests.
     * @returns wether the skill is activated successfully
     */
    public activateNationwideTesting(): boolean {
        return this.activateSkill(1, [this.additionalTestKits], () => {
            this.controller.distributeNewRoles(30000, Role.HEALTH_WORKER, true);
            this.nationwideTesting = true;
        })
    }

    private nationwideTesting = false;

    /**
     * A research institute analysed a code-sequence of the (virus). The new 
     * dithisovery will speed up the research for a cure
     * @returns wether the skill is activated successfully
     */
    public activatednaRnaCodeSequence(): boolean {
        return this.activateSkill(1, [this.nationwideTesting], () => {
            this.dnaRnaCodeSequence = true;
            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL == 9) { // Introduces alternative bonus
                this.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, false);
                this.stats.currentSalaryHW -= 20;
            } else if(researchLvL >= 7){ //Introduces cure without paying
                this.uC.measures["research"]["current_level"] = 8;
                const price = this.uC.measures["research"]["prices"][8];
                this.stats.budget += price;
                this.uC.buyResearchLevel();
            } else { //Increases current research level
                this.uC.measures["research"]["current_level"] += 2;
            }
        })
    }

    private dnaRnaCodeSequence = false;

    /**
     * A new antibody test now allows fully reliable tests which 
     * can be done in under 2 hours.
     * @returns wether the skill is activated successfully
     */
    public activateImmunityTests(): boolean {
        return this.activateSkill(1, [this.dnaRnaCodeSequence], () => {
            this.immunityTests = true;
            this.stats.currentSalaryHW -= 5;
        })
    }

    private immunityTests = false;
    
    // ----------------------------------------------------------------- LOCKDOWN

    /** Big events with more than 1000 people are cancelled. 
     * The government suggests washing hands more often and to hold your 
     * hand in front of your mouth when coughing. 
     * Infected people are treated as usual in average hospitals.
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageI(): boolean {
        return this.activateSkill(1, [], () => {
            this.lockdownStageI = true;
            this.stats.basicInteractionRate *= 0.9;
        })
    }

    private lockdownStageI = false;

    /** Events and Groups with more than 100 people are forbidden. 
     * Infected people are treated isolated if possible. Citizens are 
     * recommended to stay home and work from home if possible and only 
     * go outside when necessary. Common public facilities beside from 
     * thishool and churches are closed. Citizens are supervised to avoid 
     * contact to others when going out. 
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageII(): boolean {
        return this.activateSkill(1, [this.lockdownStageI], () => {
            this.lockdownStageII = true;
            this.stats.maxInteractionVariance *= 0.8;
        })
    }

    private lockdownStageII = false;

    /**
     * All public facilities (thishools, churches, universities, etc.) are 
     * closed. Everyone citizens are under curfew. Going to the supermarket 
     * and hospitals is still allowed. No more than two Families are allowed 
     * to meet in one apartment. When going outside people must keep a distance 
     * of 1.5 meters from others.
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIII(): boolean {
        return this.activateSkill(1, [this.lockdownStageII], () => {
            this.lockdownStageIII = true;
            this.stats.basicInteractionRate *= 0.9;
            this.stats.maxInteractionVariance *= 0.9;
        })
    }

    private lockdownStageIII = false;

    /**
     * Full lockdown. No one is supposed to be outside of their houses. 
     * Military provide food and water.
     * 
     * (requires “Military II” from [Police])
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIV(): boolean {
        return this.activateSkill(1, [this.lockdownStageIII, this.militaryII], () => {
            this.lockdownStageIV = true;
            this.stats.basicInteractionRate *= 0.6;
            this.stats.maxInteractionVariance = 0;
        })
    }

    private lockdownStageIV = false;


    /**
     * Limited public transportation. Drivers are provided with more safety 
     * so that they can concentrate on their work. Wearing a mask is required 
     * while using public transportation. Vehicles are cleaned and sterilized daily.
     * @returns wether the skill is activated successfully
     */
    public activatePublicTransport(): boolean {
        return this.activateSkill(1, [this.lockdownStageI], () => {
            this.publicTransport = true;
        })
    }

    private publicTransport = false;

    /**
     * No public transportation. Roadblocks prevent citizens from using their own car 
     * to drive around. Airports and docks are closed. Only vehicles allowed are those 
     * from the police, the military and high officials.
     * @returns wether the skill is activated successfully
     */
    public activateRestrictedTraffic(): boolean {
        return this.activateSkill(1, [this.publicTransport], () => {
            this.restrictedTraffic = true;
        })
    }

    private restrictedTraffic = false;

    /**
     * The government honors the work of important jobs (health workers, doctors and 
     * even supermarket cashiers) with a lot of applause and shoutouts. After a lot of 
     * complaints and negative critique from the internet and influencers the government 
     * is pressurized to raise the wage of those people a bit. 
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportI(): boolean {
        return this.activateSkill(2, [this.publicTransport], () => {
            this.financialSupportI = true;
            this.stats.currentSalaryHW -= 10;
            this.stats.currentSalaryPO -= 10;
            this.stats.happiness += 10;
        })
    }

    private financialSupportI = false;

    /**
     * To assure citizens will stay home and to prevent people from going bankrupt the 
     * generous government will provide a monthly financial support packet to those who 
     * are directly affected by the lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportII(): boolean {
        return this.activateSkill(3, [this.financialSupportI], () => {
            this.financialSupportII = true;
            this.stats.happinessRate += 2;
        })
    }

    private financialSupportII = false;

    // ----------------------------------------------------------------- CITIZENS

    /**
     * Officials are holding press conferences to make statements about the current 
     * situation. Specialists are recommending behaviours (hand washing, not touching 
     * faces, etc.). Citizens feel more enlightened and the government seems 
     * transparent and trustworthy.
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseI(): boolean {
        return this.activateSkill(1, [], () => {
            this.expertiseI = true;
            this.stats.happinessRate += 0.5;
        })
    }

    private expertiseI = false;

    /**
     * Officials working together with experts and influencers to help provide positive 
     * messages and helpful behaviour. This will reduce the spread of made up fake news.
     * Citizens are more likely to adapt recommended behaviours. (washing hands more frequently, 
     * coughing into elbow, not touching faces, distance from other people, etc.)
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseII(): boolean {
        return this.activateSkill(1, [this.expertiseI], () => {
            this.expertiseII = true;
            this.stats.happinessRate += 0.5;
        })
    }

    private expertiseII = false;

    /**
     * Everyone strictly follows recommended behaviours. (excessive hand washing, very high 
     * usage of disinfectant everywhere, no handshaking when greeting others, etc.)
     * Citizens now wear face masks to protect others of getting infected.
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseIII(): boolean {
        return this.activateSkill(1, [this.expertiseII, this.additionalMedicalSuppliesI], () => {
            this.expertiseIII = true;
            this.stats.maxInteractionVariance *= 0.5;
        })
    }

    private expertiseIII = false;

    /** The use of a tracking app based on voluntary basis is now available for citizens to use.
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppI(): boolean {
        return this.activateSkill(1, [this.expertiseI], () => {
            this.trackingAppI = true;
        })
    }

    private trackingAppI = false;

    /**
     * The government overtake the tracking app. Every citizen must use the tracking app to enable 
     * localization and to help informing the police and other citizens about infected people.
     * 
     * (requires “ Tracking Encounters” from [Police])
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppII(): boolean {
        return this.activateSkill(1, [this.trackingAppI, this.trackingEncounters], () => {
            this.trackingAppII = true;
        })
    }

    private trackingAppII = false;

    // ========================================================================================================================= GETTER-METHODS

    /** @returns The singleton instance */
    public static getInstance(): SkillController {
        if (!SkillController.instance) SkillController.instance = new SkillController();
            return SkillController.instance;
        }

    /** @returns Number of currently available skill points */
    public getAvailableSkillPoints(): number {return this.availableSkillPoints}

    /** @returns Purchase price of the next skill point */
    public getNextSkillPointPrice(): number {return this.nextSkillPointPrice}

}