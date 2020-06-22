import { Controller } from "./controller";
import { State } from "../models/util/enums/healthStates";
import { Rule } from "./entities/rule";
import { Role } from "../models/util/enums/roles";
import { Stats } from "./stats";
import { TimeSubscriber } from "../models/util/timeSubscriber";
import { TimeController } from "./timeController";
import { IncomeStatement } from "./entities/incomeStatement";


/**
 * Singleton controller to manage application logic which is linked to upgrades
 * and financial tasks.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class UpgradeController implements TimeSubscriber {

    /** Singleton instance which holds game variables */
    private stats: Stats;

    /** The only existing instance of UpgradeController */
    private static instance: UpgradeController;
    /** Instance of central singleton controller */
    private contr: Controller;
    /** Instance of singleton time controller */
    private tC: TimeController;

    /**
     * Array of all available measures <name of measure> [<dictionary key of measure>]:
     * * Social Distancing [sc]
     * * Lock Down [ld]
     */
    public measures = require("./../../../res/json/measures.json");

    private constructor() {
        this.stats = Stats.getInstance();
        this.contr = Controller.getInstance();

        this.tC = TimeController.getInstance().subscribe(this);
    }

    // ----------------------------------------------------------------- UPGRADE - PUBLIC
    /**
     * Inserts a number of health workers into the agents array and adds rules regarding the state 'CURE'.
     * This method is required to call before the buyHealthWorkers-method. Otherwise the agents array
     * will have health workers but they won't do anything. (Because the transition rules are not yet
     * defined.)
     * @returns Boolean if the operation was successful, false if there are not enough people left to become health workers
     */
    private introduceCure(): void {
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
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyPoliceOfficers(uC: UpgradeController, amt: number, price: number): boolean {
        //const amt = 100_000;
        //const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.POLICE)) {
            uC.buyItem(price);
            uC.stats.increasePoliceOfficers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyHealthWorkers(uC: UpgradeController, amt: number, price: number): boolean {
        //const amt = 100_000;
        //const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER)) {
            uC.buyItem(price);
            uC.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /**
     * Insert a number of health workers into the agents array with the state
     * TEST_KIT to allow detection of UNKNOWINGLY_INFECTED agents.
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     */
    public buyTestKitHWs(uC: UpgradeController): boolean {
        const amt = 100_000;
        const price = amt * 5_000; // = 500_000_000
        if(uC.isSolvent(price) && uC.contr.distributeNewRoles(amt, Role.HEALTH_WORKER, true)) {
            uC.buyItem(price);
            uC.stats.increaseHealthWorkers(amt);
            return true;
        } else return false;
    }

    /**
     * Wrapper for activating/deactivating "lockdown" measure. {@see upgradeController.ts#activateMeasure}
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     * @returns if "lockdown" was activated/deactivated successfully
     */
    public activateLockdown(uC: UpgradeController): boolean { 
        return uC.activateMeasure("lockdown");
    }

    /**
     * Wrapper for activating/deactivating "social distancing" measure. {@see upgradeController.ts#activateMeasure}
     * @param uC UpgradeController needed for closure {@see menu.ts#buildClosure}
     * @returns if "lockdown" was activated/deactivated successfully
     */
    public activateSocialDistancing(uC: UpgradeController): boolean {
        return uC.activateMeasure("sd")
    }

    /**
     * Activates the specified measure and changes all affiliated game variables (@see measures.json). 
     * A second invokation of this method causes the deactivation! Before the measure is activated, 
     * it is checked whether the player is able to pay the daily costs of the measure (at least for the next day).
     * There is a cooldown of 1 (ingame) day before the method can be executed successfully again. 
     * @param measure Measure code of measure.json
     * @returns if measure was activated/deactivated sucessfully
     */
    private activateMeasure(measure: string): boolean {
        const activationDay = this.tC.getDaysSinceGameStart();

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
     * Buys the next research level. When the maximum is reached, the method {@see UpgradeController#introduceCure }
     * gets called.
     * @param uC UpgradeController instance
     * @returns Wether the research level reached level 10, the upgrade can be bought or the upgrade was successful
     */
    public buyResearchLevel(uC: UpgradeController): boolean {
        const currLv = uC.measures["research"]["current_level"];
        const price = uC.measures["research"]["prices"][currLv];

        if (!uC.isSolvent(price) || currLv == 10) return false;
        uC.buyItem(price);
        
        uC.measures["research"]["current_level"] += 1;

        if (currLv + 1 == 10) uC.introduceCure();
        return true;
    }

    /** @returns Wether the research is maxed out */
    public researchExists(): boolean {
        return this.measures["research"]["current_level"] == 9;
    }

    /** @see TimeSubscriber */
    public notify(): void {
        this.updateHappiness();
        this.updateCompliance();
        this.updateBudget(this.calculateIncome(), this.calculateExpenses());

        this.stats.updateWeek(this.getIncomeStatementToday());
    }

    /** 
     * ---
     * __Example usage:__  
     * Acces to the money spend for the salary of police officers through 
     * `getIncomeStatement().expenses.salaries.police;`
     * 
     * ---
     * @returns an income statement for the current day
     * @see #calculateMeasureExpenses()
     */
    public getIncomeStatementToday(): IncomeStatement {
        return new IncomeStatement(
            this.stats.income,
            this.stats.getPOSalary(),
            this.stats.getHWSalary(),
            this.stats.getDailyTestKitsExpense(),
            this.stats.getDailyVaccinesExpense(),
            this.calculateMeasureExpenses()
        );
    }


    // ----------------------------------------------------------------- UPGRADE - PRIVATE
    /**
     * Calculate the compliance depending on the populations happiness
     * 
     * | Happiness | Compliance|  
     * | ----- | ----- |
     * |       100 |       100 |  
     * |        50 |      45.4 |  
     * |         0 |        10 |
     */
    private updateCompliance(): void {
        this.stats.compliance = 19/4950 * Math.pow(this.stats.happiness, 2) + 511/990 * this.stats.happiness + 10;
    }

    /**
     * Calculate happiness based on the currrent happiness rate
     */
    private updateHappiness(): void {
        const result = this.stats.happiness + this.stats.happinessRate;
        if(result >= 100) this.stats.happiness = 100;
        else if(result <= 0) this.stats.happiness = 0;
        else this.stats.happiness = result;
    }

    /**
     * Calculate the income depending on the population compliance.
     * When the compliance sinks below 20% the state generates 0 income,
     * while above 70% 100% of the income are generated.
     * @returns earnings in EURO
     */
    private calculateIncome(): number {
        if (this.stats.compliance > 70) this.stats.income = 1 * this.stats.maxIncome;
        else if (this.stats.compliance < 20) this.stats.income = 0;
        else {
            this.stats.income = Math.floor((this.stats.compliance - 20) * 2 * this.stats.maxIncome /100); //TODO
        }
        return this.stats.income;
    }

    /**
     * Calculate the sum of all expenses of the day
     * @returns expenses in EURO
     */
    private calculateExpenses(): number {
        const sals = this.stats.getHWSalary() + this.stats.getPOSalary()
        const consumption = this.stats.getDailyTestKitsExpense() + this.stats.getDailyVaccinesExpense();
        return sals + consumption + this.calculateMeasureExpenses();
    }

    /** @returns sum of all active measure expenses (daily costs) */
    private calculateMeasureExpenses(): number {
        let result = 0;
        for (const key in this.measures) {
            const value = this.measures[key];
            if (value["active"]) result += value["daily_cost"];
        }
        return result;
    }

    /**
     * Budget = Budget + Income - Expenses
     * @param income
     * @param expenses
     * @see #calculateIncome
     * @see #calculateExpenses
     */
    private updateBudget(income: number, expenses: number): void {
        this.stats.budget += (income - expenses);
    }

    /**
     * Reduces the current budget by the given price
     * @param price Price of respective item
     */
    private buyItem(price: number): void {
        this.setBudget(this.getBudget() - price);
    }

    /**
     * @param price Purchase price  
     * @returns Wether the player is solvent
    */
    public isSolvent(price: number): boolean {
        return this.getBudget() >= price;
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

    /** @returns Time Controller instance */
    public getTimeController(): TimeController {return this.tC;}
    // ------------------------------------------------------------------ SETTER-METHODS
    // allows encapsulation of application logic
    // private setIncome(amt: number) {}

    /** @param newBudget New Budget (overrides old budget) */
    private setBudget(newBudget: number): void {
        this.stats.budget = newBudget;
    }

}