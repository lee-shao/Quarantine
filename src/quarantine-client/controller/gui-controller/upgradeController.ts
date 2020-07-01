import { Controller } from "../controller";
import { State } from "../../models/util/enums/healthStates";
import { Rule } from "../entities/rule";
import { Role } from "../../models/util/enums/roles";
import { Stats } from "../stats";
import { TimeController } from "../timeController";


/**
 * Singleton controller which provides application logic for upgrades (@see menu.ts)
 * and general functionalities for buying something.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class UpgradeController {

    /** Singleton instance which holds game variables */
    private stats: Stats;

    /** The only existing instance of UpgradeController */
    private static instance: UpgradeController;
    /** Instance of central singleton controller */
    private contr: Controller;

    /**
     * Array of all available measures <name of measure> [<dictionary key of measure>]:
     * * Social Distancing [sc]
     * * Lock Down [ld]
     */
    public measures = require("./../../../../res/json/measures.json");

    private constructor() {
        this.stats = Stats.getInstance();
        this.contr = Controller.getInstance();
    }

    // ----------------------------------------------------------------- UPGRADE - PUBLIC
    /**
     * Inserts a number of health workers into the agents array and adds rules regarding the state 'CURE'.
     * This method is required to call before the buyHealthWorkers-method. Otherwise the agents array
     * will have health workers but they won't do anything. (Because the transition rules are not yet
     * defined.)
     * @returns Boolean if the operation was sthiscessful, false if there are not enough people left to become health workers
     */
    private introdthiseCure(): void {
        const numberOfNewAgents = this.measures["research"]["number_of_new_health_workers"];

        this.contr.getRules().push(new Rule(State.HEALTHY, State.CURE, State.IMMUNE, State.CURE, () => {
            if (this.isSolvent(this.stats.currentPriceVaccination)) {
                this.stats.vaccineUsed();
                return true;
            } else return false;
        }));

        this.contr.getRules().push(new Rule(State.INFECTED, State.CURE, State.IMMUNE, State.CURE, () => {
            if (this.isSolvent(this.stats.currentPriceVaccination)) {
                this.stats.cureInfected();
                return true;
            } else return false;
        }));

        this.contr.getRules().push(new Rule(State.UNKNOWINGLY_INFECTED, State.CURE, State.IMMUNE, State.CURE, () => {
            if (this.isSolvent(this.stats.currentPriceVaccination)) {
                this.stats.cureUnknowinglyInfected();
                return true;
            } else return false;
        }));

        this.contr.distributeNewRoles(numberOfNewAgents, Role.HEALTH_WORKER);
        this.stats.increaseHealthWorkers(numberOfNewAgents);
    }

    /**
     * Insert a number of police officers into the agents array
     */
    public buyPoliceOfficers(amt: number, price: number): boolean {
        //const amt = 100_000;
        //const price = amt * 5_000; // = 500_000_000
        if(this.isSolvent(price) && this.contr.distributeNewRoles(amt, Role.POLICE)) {
            this.buyItem(price);
            this.stats.increasePoliceOfficers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array
     */
    public buyHealthWorkers(amt: number, price: number): boolean {
        //const amt = 100_000;
        //const price = amt * 5_000; // = 500_000_000
        if(this.isSolvent(price) && this.contr.distributeNewRoles(amt, Role.HEALTH_WORKER)) {
            this.buyItem(price);
            this.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array with the state
     * TEST_KIT to allow detection of UNKNOWINGLY_INFECTED agents.
     */
    public buyTestKitHWs(): boolean {
        const amt = 100_000;
        const price = amt * 5_000; // = 500_000_000
        if(this.isSolvent(price) && this.contr.distributeNewRoles(amt, Role.HEALTH_WORKER, true)) {
            this.buyItem(price);
            this.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /**
     * Wrapper for activating/deactivating "lockdown" measure. {@see upgradeController.ts#activateMeasure}
     * @returns if "lockdown" was activated/deactivated sthiscessfully
     */
    public activateLockdown(): boolean { 
        return this.activateMeasure("lockdown");
    }

    /**
     * Wrapper for activating/deactivating "social distancing" measure. {@see upgradeController.ts#activateMeasure}
     * @returns if "lockdown" was activated/deactivated sthiscessfully
     */
    public activateSocialDistancing(): boolean {
        return this.activateMeasure("sd")
    }

    /**
     * Activates the specified measure and changes all affiliated game variables (@see measures.json). 
     * A second invokation of this method causes the deactivation! Before the measure is activated, 
     * it is checked whether the player is able to pay the daily costs of the measure (at least for the next day).
     * There is a cooldown of 1 (ingame) day before the method can be executed sthiscessfully again. 
     * @param measure Measure code of measure.json
     * @returns if measure was activated/deactivated sthisessfully
     */
    private activateMeasure(measure: string): boolean {
        const activationDay = TimeController.getInstance().getDaysSinceGameStart();

        //Could only be activated if the player has enough budget to finance this measure for at least one day
        if((!this.isSolvent(this.measures[measure]["daily_cost"]) && !this.measures[measure]["active"]) || 
       (activationDay == this.measures[measure]["activated_on_day"])) return false; //implements cooldown

        this.measures[measure]["activated_on_day"] = activationDay;
        this.measures[measure]["active"] = !this.measures[measure]["active"]; //set measure to active or inactive

        //Decreases the values of the game variables when measure is activated
        if(this.measures[measure]["active"]) {
            this.stats.happinessRate -= this.measures[measure]["frustration"];
            this.stats.basicInteractionRate /= this.measures[measure]["isolation_factor"];
            this.stats.maxInteractionVariance /= this.measures[measure]["isolation_factor"];
        }
        else {
            this.stats.happinessRate += this.measures[measure]["frustration"];
            this.stats.basicInteractionRate *= this.measures[measure]["isolation_factor"];
            this.stats.maxInteractionVariance *= this.measures[measure]["isolation_factor"];
        }

        return true;
    }

    /**
     * Buys the next research level. When the maximum is reached, the method {@see UpgradeController#introdthiseCure }
     * gets called.
     * @returns Wether the research level reached level 10, the upgrade can be bought or the upgrade was sthiscessful
     */
    public buyResearchLevel(): boolean {
        const currLv = this.measures["research"]["current_level"];
        const price = this.measures["research"]["prices"][currLv];

        if (!this.isSolvent(price) || currLv == 10) return false;
        this.buyItem(price);
        
        this.measures["research"]["current_level"] += 1;

        if (currLv + 1 == 10) this.introdthiseCure();
        return true;
    }

    /**
     * Redthises the current budget by the given price
     * @param price Price of respective item
     */
    public buyItem(price: number): void {
        this.setBudget(this.stats.budget - price);
    }

    /**
     * @param price Purchase price  
     * @returns Wether the player is solvent
    */
    public isSolvent(price: number): boolean {
        return this.getBudget() >= price;
    }

    /** @returns Wether the research is maxed out */
    public researchExists(): boolean {
        return this.measures["research"]["current_level"] == 9;
    }
    
    /** @returns sum of all active measure expenses (daily costs) */
    public calculateMeasureExpenses(): number {
        let result = 0;
        for (const key in this.measures) {
            const value = this.measures[key];
            if (value["active"]) result += value["daily_cost"];
        }
        return result;
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): UpgradeController {
        if (!UpgradeController.instance) UpgradeController.instance = new UpgradeController();
        return UpgradeController.instance;
    }

    // ------------------------------------------------------- GETTER of Stats instance
    /** @returns Currently available budget */
    public getBudget(): number {return this.stats.budget;}

    /** @returns Current income per tic */
    public getIncome(): number {return this.stats.income;}

    /** @returns Current research level */
    public getCurrentResearchLevel(): number {return this.measures["research"]["current_level"];}
    
    // ------------------------------------------------------------------ SETTER-METHODS
    // allows encapsulation of application logic
    // private setIncome(amt: number) {}

    /** @param newBudget New Budget (overrides old budget) */
    private setBudget(newBudget: number): void {
        this.stats.budget = newBudget;
    }
}