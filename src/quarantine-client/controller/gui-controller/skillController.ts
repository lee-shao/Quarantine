import { Stats } from "../stats";
import { Controller } from "../controller"
import { Role } from "../../models/util/enums/roles";
import { UpgradeController } from "./upgradeController";
import { SkillTreeView } from "../../views/skill-tree/skillTreeView";

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

    private sT: SkillTreeView;

    public descriptions = require("./../../../../res/json/skill-descriptions.json");

    private constructor() {
        this.stats = Stats.getInstance();
        this.controller = Controller.getInstance();
        this.uC = UpgradeController.getInstance();
    }

    // ----------------------------------------------------------------- GENERAL METHODS

    /**
     * Checks whether the prerequsites for activating the skill are met and, in this case,
     * it invokes the passed skill function
     * @param skillPointPrice Number of skill points which is required to activate the skill
     * @param requiredSkills Abilities which have to be skilled previously
     * @param skill Anonymous function which contains the actual skill logic
     * @returns if the activation was successful
     */
    private activateSkill(skillPointPrice: number, requiredSkills: boolean[], key: string, skill: Function): boolean {
        //Checks if player has enough available skill points and if all required abilities are skilled
        if( !(this.uC.isSolvent(skillPointPrice)) || (requiredSkills.filter(x => !x).length > 0) ) return false;

        skill();
        this.uC.buyItem(skillPointPrice);
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
    public activateAdditionalMedicalSuppliesI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [], key, () => {
            this.additionalMedicalSuppliesI = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    public additionalMedicalSuppliesI = false;

    /**
     * The government declares state of emergency. Large amounts 
     * of money will be spent on additional medical supplies.  
     * Medical staff will be provided with upgraded face masks (FFP3-masks).
     * @returns wether the skill is activated successfully
     */
public activateAdditionalMedicalSuppliesII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.additionalMedicalSuppliesI], key, () => {
            this.additionalMedicalSuppliesII = true;
            this.stats.currentPriceTestKit -= 10;
        })
    }
    public additionalMedicalSuppliesII = false;

    
    /**
     * Increase of hygiene standards and additional medical staff 
     * in hospitals and other medical facilities.
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.additionalMedicalSuppliesI], key, () => {
            this.upgradeMedicalFacilitiesI = true;
            this.controller.distributeNewRoles(10000, Role.HEALTH_WORKER, true);
        })
    }

    public upgradeMedicalFacilitiesI = false;

    /**
     * Hospitals will be upgraded with modern medical equipment. 
     * (Isolated ventilation systems, ventilators, etc. to enable 
     * isolated treatments in quarantine)
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.upgradeMedicalFacilitiesI], key, () => {
            this.upgradeMedicalFacilitiesII = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    public upgradeMedicalFacilitiesII = false;

    /**
     * Large investments in all medical facilities. New hospitals built out of nothing. 
     * Large research institutes working together. Medical staff are getting protective 
     * suits with masks and filter attachments.
     * @returns wether the skill is activated successfully  
     */
    public activateUpgradeMedicalFacilitiesIII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.upgradeMedicalFacilitiesII], key, () => {
            this.upgradeMedicalFacilitiesIII = true;
            this.stats.currentPriceVaccination -= 10;
            this.stats.currentSalaryHW -= 5;
        })
    }

    public upgradeMedicalFacilitiesIII = false;

    /**
     * A research institute dithisovered the effectiveness of a 
     * medicine which can reduce symptoms.
     * @returns wether the skill is activated successfully
     */
    public activateMedicineI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.upgradeMedicalFacilitiesI], key, () => {
            this.medicineI = true;
            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL <= 5) { // Last 3 levels of research can not be bought this way
                this.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    public medicineI = false;


    /**
     * A new medicine developed to slow down the speed of 
     * the spreading, in the human body.
     * 
     * (requires “DNA/ RNA Code-Sequence” from [Testing])
     * @returns wether the skill is activated successfully
     */
    public activateMedicineII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.medicineI, this.dnaRnaCodeSequence], key, () => {
            this.medicineII = true;
            const researchLvL = this.uC.measures["research"]["current_level"];
            if(researchLvL <= 6) { // Last 3 levels of research can not be bought this way
                this.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    public medicineII = false;

    /**
     * A highly effective medicine got developed, which can stop the 
     * virus from spreading in the human body. If taken early enough 
     * there is a high chance the human will survive
     * @returns wether the skill is activated successfully
     */
    public activateMedicineIII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.medicineII], key, () => {
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

    public medicineIII = false;

    // ----------------------------------------------------------------- POLICE

    /**
     * Police will be informed and educated by experts and are spreading 
     * facts and positive hope messages to citizen by contact. Citizen will 
     * trust the police and feel safer.
     * @returns wether the skill is activated successfully
     */
    public activateLearnExpertise(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [], key, () => {
            this.learnExpertise = true;
            this.stats.happinessRate += 0.5;
        })
    }

    public learnExpertise = false;

    /**
     * Police forces will be provided extra safety equipment in which 
     * they feel safer. This increases the effectiveness of the police. 
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * 
     * @returns wether the skill is activated successfully
     */
    public activatePoliceEquipment(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.learnExpertise, this.additionalMedicalSuppliesI], key, () => {
            this.policeEquipment = true;
            this.stats.happinessRate += 0.5;
        })
    }

    public policeEquipment = false;

    /**
     * Police forces will be provided with test-kits and can test citizen, 
     * which they suspect of illness. 
     * @returns wether the skill is activated successfully
     */
    public activateTesting(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.learnExpertise], key, () => {
            this.testing = true;
            this.controller.distributeNewRoles(100, Role.HEALTH_WORKER, true);
        })
    }

    public testing = false;

    /**
     * The police are now able to track the people, which might have encountered 
     * with already infected people.
     * 
     * (requires “Nationwide Testing” from [Testing])
     * @returns wether the skill is activated successfully
     */
    public activateTrackingEncounters(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.testing, this.nationwideTesting], key, () => {
            this.trackingEncounters = true;
            this.controller.distributeNewRoles(200, Role.HEALTH_WORKER, true);
        })
    }

    public trackingEncounters = false;

    /**
     * The government deploy military troops in the major cities to provide 
     * security and maintain control. This reduces the chance that citizen 
     * will violate the law and break out of lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.learnExpertise], key, () => {
            this.militaryI = true;
            this.stats.maxInteractionVariance *= 0.9;
            this.stats.basicInteractionRate *= 0.9;
        })
    }

    public militaryI = false;

    /**
     * All military forces are deployed around the whole country to provide 
     * security and maintain control. Any outbreak or violation of the law 
     * will be punished immediately. The military uses transport vehicles 
     * to provide food to the citizens and transport infected people to hospitals.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.militaryI], key, () => {
            this.militaryII = true;
            this.stats.maxInteractionVariance *= 0.8;
            this.stats.basicInteractionRate *= 0.8;
        })
    }

    public militaryII = false;

    /**
     * All cities are under entry and exit ban. Major roads are blocked by 
     * military forces. The military has the instruction to shoot down any 
     * citizen, who attempts to break out from a lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryIII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.militaryII], key, () => {
            this.militaryIII = true;
            this.stats.maxInteractionVariance *= 0.7;
            this.stats.basicInteractionRate *= 0.7;
            this.stats.happinessRate -= 1;
        })
    }

    public militaryIII = false;

    // ----------------------------------------------------------------- TESTING

    /**
     * The government use funds and loans to stock up the amount of test-kits. 
     * The overall number of tests per day will increase.
     * @returns wether the skill is activated successfully
     */
    public activateAdditionalTestKits(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [], key, () => {
            this.additionalTestKits = true;
            this.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, true);
        })
    }

    public additionalTestKits = false;

    /**
     * A research institute developed a new method of testing which is more 
     * reliable than the old tests. 
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.additionalTestKits], key, () => {
            this.upgradeTestKitI = true;
            this.stats.currentPriceTestKit -= 5;
        })
    }

    public upgradeTestKitI = false;

    /**
     * Testing is now faster and even more reliable.
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.upgradeTestKitI], key, () => {
            this.upgradeTestKitII = true;
            this.stats.currentPriceTestKit -= 15;
            this.stats.currentPriceVaccination -= 15;
        })
    }

    public upgradeTestKitII = false;

    /**
     * The government declares to not only test the people with symptoms and 
     * those who had contact to those but allowing nationwide tests.
     * @returns wether the skill is activated successfully
     */
    public activateNationwideTesting(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.additionalTestKits], key, () => {
            this.controller.distributeNewRoles(30000, Role.HEALTH_WORKER, true);
            this.nationwideTesting = true;
        })
    }

    public nationwideTesting = false;

    /**
     * A research institute analysed a code-sequence of the (virus). The new 
     * dithisovery will speed up the research for a cure
     * @returns wether the skill is activated successfully
     */
    public activatednaRnaCodeSequence(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.nationwideTesting], key, () => {
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

    public dnaRnaCodeSequence = false;

    /**
     * A new antibody test now allows fully reliable tests which 
     * can be done in under 2 hours.
     * @returns wether the skill is activated successfully
     */
    public activateImmunityTests(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.dnaRnaCodeSequence], key, () => {
            this.immunityTests = true;
            this.stats.currentSalaryHW -= 5;
        })
    }

    public immunityTests = false;
    
    // ----------------------------------------------------------------- LOCKDOWN

    /** Big events with more than 1000 people are cancelled. 
     * The government suggests washing hands more often and to hold your 
     * hand in front of your mouth when coughing. 
     * Infected people are treated as usual in average hospitals.
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [], key, () => {
            this.lockdownStageI = true;
            this.stats.basicInteractionRate *= 0.9;
        })
    }

    public lockdownStageI = false;

    /** Events and Groups with more than 100 people are forbidden. 
     * Infected people are treated isolated if possible. Citizens are 
     * recommended to stay home and work from home if possible and only 
     * go outside when necessary. Common public facilities beside from 
     * thishool and churches are closed. Citizens are supervised to avoid 
     * contact to others when going out. 
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.lockdownStageI], key, () => {
            this.lockdownStageII = true;
            this.stats.maxInteractionVariance *= 0.8;
        })
    }

    public lockdownStageII = false;

    /**
     * All public facilities (thishools, churches, universities, etc.) are 
     * closed. Everyone citizens are under curfew. Going to the supermarket 
     * and hospitals is still allowed. No more than two Families are allowed 
     * to meet in one apartment. When going outside people must keep a distance 
     * of 1.5 meters from others.
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.lockdownStageII], key, () => {
            this.lockdownStageIII = true;
            this.stats.basicInteractionRate *= 0.9;
            this.stats.maxInteractionVariance *= 0.9;
        })
    }

    public lockdownStageIII = false;

    /**
     * Full lockdown. No one is supposed to be outside of their houses. 
     * Military provide food and water.
     * 
     * (requires “Military II” from [Police])
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIV(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.lockdownStageIII, this.militaryII], key, () => {
            this.lockdownStageIV = true;
            this.stats.basicInteractionRate *= 0.6;
            this.stats.maxInteractionVariance = 0;
        })
    }

    public lockdownStageIV = false;


    /**
     * Limited public transportation. Drivers are provided with more safety 
     * so that they can concentrate on their work. Wearing a mask is required 
     * while using public transportation. Vehicles are cleaned and sterilized daily.
     * @returns wether the skill is activated successfully
     */
    public activatePublicTransport(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.lockdownStageI], key, () => {
            this.publicTransport = true;
        })
    }

    public publicTransport = false;

    /**
     * No public transportation. Roadblocks prevent citizens from using their own car 
     * to drive around. Airports and docks are closed. Only vehicles allowed are those 
     * from the police, the military and high officials.
     * @returns wether the skill is activated successfully
     */
    public activateRestrictedTraffic(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.publicTransport], key, () => {
            this.restrictedTraffic = true;
        })
    }

    public restrictedTraffic = false;

    /**
     * The government honors the work of important jobs (health workers, doctors and 
     * even supermarket cashiers) with a lot of applause and shoutouts. After a lot of 
     * complaints and negative critique from the internet and influencers the government 
     * is pressurized to raise the wage of those people a bit. 
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.publicTransport], key, () => {
            this.financialSupportI = true;
            this.stats.currentSalaryHW -= 10;
            this.stats.currentSalaryPO -= 10;
            this.stats.happiness += 10;
        })
    }

    public financialSupportI = false;

    /**
     * To assure citizens will stay home and to prevent people from going bankrupt the 
     * generous government will provide a monthly financial support packet to those who 
     * are directly affected by the lockdown.
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.financialSupportI], key, () => {
            this.financialSupportII = true;
            this.stats.happinessRate += 2;
        })
    }

    public financialSupportII = false;

    // ----------------------------------------------------------------- CITIZENS

    /**
     * Officials are holding press conferences to make statements about the current 
     * situation. Specialists are recommending behaviours (hand washing, not touching 
     * faces, etc.). Citizens feel more enlightened and the government seems 
     * transparent and trustworthy.
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [], key, () => {
            this.expertiseI = true;
            this.stats.happinessRate += 0.5;
        })
    }

    public expertiseI = false;

    /**
     * Officials working together with experts and influencers to help provide positive 
     * messages and helpful behaviour. This will reduce the spread of made up fake news.
     * Citizens are more likely to adapt recommended behaviours. (washing hands more frequently, 
     * coughing into elbow, not touching faces, distance from other people, etc.)
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.expertiseI], key, () => {
            this.expertiseII = true;
            this.stats.happinessRate += 0.5;
        })
    }

    public expertiseII = false;

    /**
     * Everyone strictly follows recommended behaviours. (excessive hand washing, very high 
     * usage of disinfectant everywhere, no handshaking when greeting others, etc.)
     * Citizens now wear face masks to protect others of getting infected.
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseIII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.expertiseII, this.additionalMedicalSuppliesI], key, () => {
            this.expertiseIII = true;
            this.stats.maxInteractionVariance *= 0.5;
        })
    }

    public expertiseIII = false;

    /** The use of a tracking app based on voluntary basis is now available for citizens to use.
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppI(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.expertiseI], key, () => {
            this.trackingAppI = true;
        })
    }

    public trackingAppI = false;

    /**
     * The government overtake the tracking app. Every citizen must use the tracking app to enable 
     * localization and to help informing the police and other citizens about infected people.
     * 
     * (requires “ Tracking Encounters” from [Police])
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppII(key: string): boolean {
        return this.activateSkill(this.descriptions[key]['price'], [this.trackingAppI, this.trackingEncounters], key, () => {
            this.trackingAppII = true;
        })
    }

    public trackingAppII = false;

    // ========================================================================================================================= GETTER-METHODS

    /** @returns The singleton instance */
    public static getInstance(): SkillController {
        if (!SkillController.instance) SkillController.instance = new SkillController();
            return SkillController.instance;
        }
}
