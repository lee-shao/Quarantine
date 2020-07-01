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
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateAdditionalMedicalSuppliesI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [], key, () => {
            sC.additionalMedicalSuppliesI = true;
            sC.stats.currentPriceTestKit -= 5;
        })
    }

    public additionalMedicalSuppliesI = false;

    /**
     * The government declares state of emergency. Large amounts 
     * of money will be spent on additional medical supplies.  
     * Medical staff will be provided with upgraded face masks (FFP3-masks).
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
public activateAdditionalMedicalSuppliesII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.additionalMedicalSuppliesI], key, () => {
            sC.additionalMedicalSuppliesII = true;
            sC.stats.currentPriceTestKit -= 10;
        })
    }
    public additionalMedicalSuppliesII = false;

    
    /**
     * Increase of hygiene standards and additional medical staff 
     * in hospitals and other medical facilities.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.additionalMedicalSuppliesI], key, () => {
            sC.upgradeMedicalFacilitiesI = true;
            sC.controller.distributeNewRoles(10000, Role.HEALTH_WORKER, true);
        })
    }

    public upgradeMedicalFacilitiesI = false;

    /**
     * Hospitals will be upgraded with modern medical equipment. 
     * (Isolated ventilation systems, ventilators, etc. to enable 
     * isolated treatments in quarantine)
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeMedicalFacilitiesII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.upgradeMedicalFacilitiesI], key, () => {
            sC.upgradeMedicalFacilitiesII = true;
            sC.stats.currentPriceTestKit -= 5;
        })
    }

    public upgradeMedicalFacilitiesII = false;

    /**
     * Large investments in all medical facilities. New hospitals built out of nothing. 
     * Large research institutes working together. Medical staff are getting protective 
     * suits with masks and filter attachments.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully  
     */
    public activateUpgradeMedicalFacilitiesIII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.upgradeMedicalFacilitiesII], key, () => {
            sC.upgradeMedicalFacilitiesIII = true;
            sC.stats.currentPriceVaccination -= 10;
            sC.stats.currentSalaryHW -= 5;
        })
    }

    public upgradeMedicalFacilitiesIII = false;

    /**
     * A research institute discovered the effectiveness of a 
     * medicine which can reduce symptoms.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMedicineI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.upgradeMedicalFacilitiesI], key, () => {
            sC.medicineI = true;
            const researchLvL = sC.uC.measures["research"]["current_level"];
            if(researchLvL <= 5) { // Last 3 levels of research can not be bought this way
                sC.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    public medicineI = false;


    /**
     * A new medicine developed to slow down the speed of 
     * the spreading, in the human body.
     * 
     * (requires “DNA/ RNA Code-Sequence” from [Testing])
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMedicineII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.medicineI, sC.dnaRnaCodeSequence], key, () => {
            sC.medicineII = true;
            const researchLvL = sC.uC.measures["research"]["current_level"];
            if(researchLvL <= 6) { // Last 3 levels of research can not be bought this way
                sC.uC.measures["research"]["current_level"] += 1 ;
            }
        })
    }

    public medicineII = false;

    /**
     * A highly effective medicine got developed, which can stop the 
     * virus from spreading in the human body. If taken early enough 
     * there is a high chance the human will survive
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMedicineIII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.medicineII], key, () => {
            sC.medicineIII = true;

            const researchLvL = sC.uC.measures["research"]["current_level"];
            if(researchLvL == 9) { // Introduces alternative bonus
                sC.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, false);
                sC.stats.currentSalaryHW -= 20;
            } else { //Introduces cure without paying
                sC.uC.measures["research"]["current_level"] = 8;
                const price = sC.uC.measures["research"]["prices"][8];
                sC.stats.budget += price;
                sC.uC.buyResearchLevel(sC.uC);
            }
        })
    }

    public medicineIII = false;

    // ----------------------------------------------------------------- POLICE

    /**
     * Police will be informed and educated by experts and are spreading 
     * facts and positive hope messages to citizen by contact. Citizen will 
     * trust the police and feel safer.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateLearnExpertise(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [], key, () => {
            sC.learnExpertise = true;
            sC.stats.happinessRate += 0.5;
        })
    }

    public learnExpertise = false;

    /**
     * Police forces will be provided extra safety equipment in which 
     * they feel safer. This increases the effectiveness of the police. 
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * 
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activatePoliceEquipment(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.learnExpertise, sC.additionalMedicalSuppliesI], key, () => {
            sC.policeEquipment = true;
            sC.stats.happinessRate += 0.5;
        })
    }

    public policeEquipment = false;

    /**
     * Police forces will be provided with test-kits and can test citizen, 
     * which they suspect of illness. 
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateTesting(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.learnExpertise], key, () => {
            sC.testing = true;
            sC.controller.distributeNewRoles(100, Role.HEALTH_WORKER, true);
        })
    }

    public testing = false;

    /**
     * The police are now able to track the people, which might have encountered 
     * with already infected people.
     * 
     * (requires “Nationwide Testing” from [Testing])
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateTrackingEncounters(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.testing, sC.nationwideTesting], key, () => {
            sC.trackingEncounters = true;
            sC.controller.distributeNewRoles(200, Role.HEALTH_WORKER, true);
        })
    }

    public trackingEncounters = false;

    /**
     * The government deploy military troops in the major cities to provide 
     * security and maintain control. This reduces the chance that citizen 
     * will violate the law and break out of lockdown.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.learnExpertise], key, () => {
            sC.militaryI = true;
            sC.stats.maxInteractionVariance *= 0.9;
            sC.stats.basicInteractionRate *= 0.9;
        })
    }

    public militaryI = false;

    /**
     * All military forces are deployed around the whole country to provide 
     * security and maintain control. Any outbreak or violation of the law 
     * will be punished immediately. The military uses transport vehicles 
     * to provide food to the citizens and transport infected people to hospitals.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.militaryI], key, () => {
            sC.militaryII = true;
            sC.stats.maxInteractionVariance *= 0.8;
            sC.stats.basicInteractionRate *= 0.8;
        })
    }

    public militaryII = false;

    /**
     * All cities are under entry and exit ban. Major roads are blocked by 
     * military forces. The military has the instruction to shoot down any 
     * citizen, who attempts to break out from a lockdown.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateMilitaryIII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.militaryII], key, () => {
            sC.militaryIII = true;
            sC.stats.maxInteractionVariance *= 0.7;
            sC.stats.basicInteractionRate *= 0.7;
            sC.stats.happinessRate -= 1;
        })
    }

    public militaryIII = false;

    // ----------------------------------------------------------------- TESTING

    /**
     * The government use funds and loans to stock up the amount of test-kits. 
     * The overall number of tests per day will increase.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateAdditionalTestKits(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [], key, () => {
            sC.additionalTestKits = true;
            sC.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, true);
        })
    }

    public additionalTestKits = false;

    /**
     * A research institute developed a new method of testing which is more 
     * reliable than the old tests. 
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.additionalTestKits], key, () => {
            sC.upgradeTestKitI = true;
            sC.stats.currentPriceTestKit -= 5;
        })
    }

    public upgradeTestKitI = false;

    /**
     * Testing is now faster and even more reliable.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateUpgradeTestKitII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.upgradeTestKitI], key, () => {
            sC.upgradeTestKitII = true;
            sC.stats.currentPriceTestKit -= 15;
            sC.stats.currentPriceVaccination -= 15;
        })
    }

    public upgradeTestKitII = false;

    /**
     * The government declares to not only test the people with symptoms and 
     * those who had contact to those but allowing nationwide tests.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateNationwideTesting(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.additionalTestKits], key, () => {
            sC.controller.distributeNewRoles(30000, Role.HEALTH_WORKER, true);
            sC.nationwideTesting = true;
        })
    }

    public nationwideTesting = false;

    /**
     * A research institute analysed a code-sequence of the (virus). The new 
     * discovery will speed up the research for a cure
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activatednaRnaCodeSequence(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.nationwideTesting], key, () => {
            sC.dnaRnaCodeSequence = true;
            const researchLvL = sC.uC.measures["research"]["current_level"];
            if(researchLvL == 9) { // Introduces alternative bonus
                sC.controller.distributeNewRoles(1000, Role.HEALTH_WORKER, false);
                sC.stats.currentSalaryHW -= 20;
            } else if(researchLvL >= 7){ //Introduces cure without paying
                sC.uC.measures["research"]["current_level"] = 8;
                const price = sC.uC.measures["research"]["prices"][8];
                sC.stats.budget += price;
                sC.uC.buyResearchLevel(sC.uC);
            } else { //Increases current research level
                sC.uC.measures["research"]["current_level"] += 2;
            }
        })
    }

    public dnaRnaCodeSequence = false;

    /**
     * A new antibody test now allows fully reliable tests which 
     * can be done in under 2 hours.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateImmunityTests(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.dnaRnaCodeSequence], key, () => {
            sC.immunityTests = true;
            sC.stats.currentSalaryHW -= 5;
        })
    }

    public immunityTests = false;
    
    // ----------------------------------------------------------------- LOCKDOWN

    /** Big events with more than 1000 people are cancelled. 
     * The government suggests washing hands more often and to hold your 
     * hand in front of your mouth when coughing. 
     * Infected people are treated as usual in average hospitals.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [], key, () => {
            sC.lockdownStageI = true;
            sC.stats.basicInteractionRate *= 0.9;
        })
    }

    public lockdownStageI = false;

    /** Events and Groups with more than 100 people are forbidden. 
     * Infected people are treated isolated if possible. Citizens are 
     * recommended to stay home and work from home if possible and only 
     * go outside when necessary. Common public facilities beside from 
     * school and churches are closed. Citizens are supervised to avoid 
     * contact to others when going out. 
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.lockdownStageI], key, () => {
            sC.lockdownStageII = true;
            sC.stats.maxInteractionVariance *= 0.8;
        })
    }

    public lockdownStageII = false;

    /**
     * All public facilities (schools, churches, universities, etc.) are 
     * closed. Everyone citizens are under curfew. Going to the supermarket 
     * and hospitals is still allowed. No more than two Families are allowed 
     * to meet in one apartment. When going outside people must keep a distance 
     * of 1.5 meters from others.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.lockdownStageII], key, () => {
            sC.lockdownStageIII = true;
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
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateLockdownStageIV(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.lockdownStageIII, sC.militaryII], key, () => {
            sC.lockdownStageIV = true;
            this.stats.basicInteractionRate *= 0.6;
            this.stats.maxInteractionVariance = 0;
        })
    }

    public lockdownStageIV = false;


    /**
     * Limited public transportation. Drivers are provided with more safety 
     * so that they can concentrate on their work. Wearing a mask is required 
     * while using public transportation. Vehicles are cleaned and sterilized daily.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activatePublicTransport(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.lockdownStageI], key, () => {
            sC.publicTransport = true;
        })
    }

    public publicTransport = false;

    /**
     * No public transportation. Roadblocks prevent citizens from using their own car 
     * to drive around. Airports and docks are closed. Only vehicles allowed are those 
     * from the police, the military and high officials.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateRestrictedTraffic(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.publicTransport], key, () => {
            sC.restrictedTraffic = true;
        })
    }

    public restrictedTraffic = false;

    /**
     * The government honors the work of important jobs (health workers, doctors and 
     * even supermarket cashiers) with a lot of applause and shoutouts. After a lot of 
     * complaints and negative critique from the internet and influencers the government 
     * is pressurized to raise the wage of those people a bit. 
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.publicTransport], key, () => {
            sC.financialSupportI = true;
            sC.stats.currentSalaryHW -= 10;
            sC.stats.currentSalaryPO -= 10;
            sC.stats.happiness += 10;
        })
    }

    public financialSupportI = false;

    /**
     * To assure citizens will stay home and to prevent people from going bankrupt the 
     * generous government will provide a monthly financial support packet to those who 
     * are directly affected by the lockdown.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateFinancialSupportII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.financialSupportI], key, () => {
            sC.financialSupportII = true;
            sC.stats.happinessRate += 2;
        })
    }

    public financialSupportII = false;

    // ----------------------------------------------------------------- CITIZENS

    /**
     * Officials are holding press conferences to make statements about the current 
     * situation. Specialists are recommending behaviours (hand washing, not touching 
     * faces, etc.). Citizens feel more enlightened and the government seems 
     * transparent and trustworthy.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [], key, () => {
            sC.expertiseI = true;
            sC.stats.happinessRate += 0.5;
        })
    }

    public expertiseI = false;

    /**
     * Officials working together with experts and influencers to help provide positive 
     * messages and helpful behaviour. This will reduce the spread of made up fake news.
     * Citizens are more likely to adapt recommended behaviours. (washing hands more frequently, 
     * coughing into elbow, not touching faces, distance from other people, etc.)
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.expertiseI], key, () => {
            sC.expertiseII = true;
            sC.stats.happinessRate += 0.5;
        })
    }

    public expertiseII = false;

    /**
     * Everyone strictly follows recommended behaviours. (excessive hand washing, very high 
     * usage of disinfectant everywhere, no handshaking when greeting others, etc.)
     * Citizens now wear face masks to protect others of getting infected.
     * 
     * (requires “Additional Medical Supplies I” from [Medical Treatments])
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateExpertiseIII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.expertiseII, sC.additionalMedicalSuppliesI], key, () => {
            sC.expertiseIII = true;
            sC.stats.maxInteractionVariance *= 0.5;
        })
    }

    public expertiseIII = false;

    /** The use of a tracking app based on voluntary basis is now available for citizens to use.
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppI(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.expertiseI], key, () => {
            sC.trackingAppI = true;
        })
    }

    public trackingAppI = false;

    /**
     * The government overtake the tracking app. Every citizen must use the tracking app to enable 
     * localization and to help informing the police and other citizens about infected people.
     * 
     * (requires “ Tracking Encounters” from [Police])
     * @param sC - SkillController needed for closure {@see menu.ts#buildClosure}
     * @returns wether the skill is activated successfully
     */
    public activateTrackingAppII(sC: SkillController, key: string): boolean {
        return sC.activateSkill(this.descriptions[key]['price'], [sC.trackingAppI, sC.trackingEncounters], key, () => {
            sC.trackingAppII = true;
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
