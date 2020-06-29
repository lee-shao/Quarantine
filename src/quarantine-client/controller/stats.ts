import { TimeController } from "./timeController";
import { UpgradeController } from "./gui-controller/upgradeController";
import { DifficultyLevel} from "../models/util/enums/difficultyLevels";
import { IncomeStatement } from "./entities/incomeStatement";

/**
 * Singleton controller which contains game variables (e.g. budget, population size)
 * and allows manipulation of the same.
 * @author Sebastian Führ
 * @author Marvin Kruber
 */
export class Stats {

    /** The only existing instance of Controller */
    private static instance: Stats;

    /**
     * Different difficulty levels can be reached through defining different
     * values for nbrPolice, budget, income...
     */
    private constructor(difficulty: DifficultyLevel) {
        let values;
        if(difficulty == DifficultyLevel.EASY) values = require("./../../../res/json//difficulty-levels/easy.json");
        else if (difficulty == DifficultyLevel.NORMAL) {
            values = require("./../../../res/json//difficulty-levels/normal.json");
        }
        else values = require("./../../../res/json/difficulty-levels/hard.json");
        // STATE VARIABLES
        this.population = values["population"];
        this.weeklyPolice[0] = this.getNumberOfAgents() * values["portion_of_police"];
        this.weeklyHW[0] = this.getNumberOfAgents() * values["portion_of_healthworkers"];
        this.happiness = values["happiness"];
        this.happinessRate = values["happinessRate"];
        this.compliance = values["compliance"];

        // PROBABILITIES / VIRUS VARIABLES
        this.basicInteractionRate = values["basicInteractionRate"];
        this.maxInteractionVariance = values["maxInteractionVariance"];
        this.currentInteractionRate = this.basicInteractionRate;

        // SALARIES
        this.avgSalaryPO = values["avgSalaryPO"]; // @see #79
        this.currentSalaryPO = this.avgSalaryPO;
        this.avgSalaryHW = values["avgSalaryHW"]; // @see #79
        this.currentSalaryHW = this.avgSalaryHW;

        // CONSUMPTION
        this.avgPriceTestKit = values["avgPriceTestKit"]; // @see #79
        this.currentPriceTestKit = this.avgPriceTestKit;
        this.avgPriceVaccination = values["avgPriceVaccination"]; // @see #79
        this.currentPriceVaccination = this.avgPriceVaccination;

        // FINANCE VARIABLES
        this.budget = values["budget"]; // allows to buy 2 upgrades immediately 
        this.maxIncome = values["maxIncome"]; // allows to buy 1 upgrade every 5 days
        this.income = values["income"];
        this.lowerBoundBankruptcy = -200_000;
    }

    /**
     * Loads the stats singleton with a specific difficulty
     * @param difficultyLvl Used to instantiate the stats object with different values 
     *                      depending on the difficulty level. This parameter is OPTIONAL!!!
     
    public static loadDifficulty(): void {
        ;
    }*/

    /** @returns The singleton instance */
    public static getInstance(difficultyLevel: DifficultyLevel = null): Stats {
        if (!Stats.instance) Stats.instance = new Stats(difficultyLevel);
        return Stats.instance;
    }

    /**
     * Expands all arrays which store weekly information:  
     * * used vaccines
     * * used test kits
     * * people who died
     * * people who got cured
     * * people who got infected
     * * hired health workers
     * * hired police officers
     * * current level of research
     * * income / expenses at the end of the week
     */
    public updateWeek(incomeStatement: IncomeStatement): void {
        const currWeek = TimeController.getInstance().getWeeksSinceGameStart();
        this.weeklyResearch[currWeek] = UpgradeController.getInstance().getCurrentResearchLevel();
        
        if (TimeController.getInstance().getDaysSinceGameStart() % 7 == 1) { // one week has passed
            this.weeklyDead.push(0);
            this.weeklyInfected.push(0);
            this.weeklyCured.push(0);
            this.weeklyHW.push(0);
            this.weeklyHW[currWeek + 1] = this.weeklyHW[currWeek];
            this.weeklyPolice.push(0);
            this.weeklyPolice[currWeek + 1] = this.weeklyPolice[currWeek];
            this.weeklyResearch.push(0);
            this.weeklyResearch[currWeek + 1] = UpgradeController.getInstance().getCurrentResearchLevel();
            this.weeklyTestKits.push(0);
            this.weeklyVaccines.push(0);

            this.weeklyIncomeStatements.push(new IncomeStatement(0,0,0,0,0,0));
        }
        
        this.resetConsumptionCounters();
        this.addIncomeStatementToArray(incomeStatement);
    }

    /** Add the given income statement to the current week of the weekly income statement array */
    private addIncomeStatementToArray(incomeStatement: IncomeStatement): void {
        const week = TimeController.getInstance().getWeeksSinceGameStart();
        this.weeklyIncomeStatements[week].add(incomeStatement);
    }

    /**
     * Store the numbers of used test kits and vaccines of the day into the respective
     * arrays and reset the counters. If a week has passed, a new field is generated in
     * each array.
     */
    private resetConsumptionCounters(): void {
        this.usedVaccinesThisDay = 0;
        this.usedTestKitsThisDay = 0;
    }

    /**
     * This method formats a large number into a decimal with a text which
     * represents the number.
     * @param value to be formatted
     */
    public formatLargerNumber(value: number): string {
        let invert = false;
        let result = "";

        if (value < 0) {
            value = value * -1;
            invert = true;
        }

        if (value >= 1_000_000_000) { // trillion
            if (invert) value = value * -1;
            result = +(value / 1_000_000_000).toFixed(2) + " Trillion";
        } else if (value >= 1_000_000_000) { // billion
            if (invert) value = value * -1;
            result = +(value / 1_000_000_000).toFixed(2) + " Mrd.";
        } else if (value >= 1_000_000) { // millions
            if (invert) value = value * -1;
            result = +(value / 1_000_000).toFixed(2) + " Mio."; // + before paranthesis clips 0 after the decimal
        } else {
            result = value.toLocaleString("de-DE");
        }
        return result;
    }

    /**
     * This method transforms a number into a string which represents this number
     * as a currency value.
     * @param value to be formatted
     * @see #formatLargeNumber
     */
    public formatMoneyString(value: number): string {
        return this.formatLargerNumber(value) + " " + this.currency;
    }

    
    // ------------------------------------------------------------------- STATE VARIABLES
    /** Scale factor to multiply with population numbers to simulate real population numbers */
    private readonly populationFactor = 50;  
    /** Population of the country the player is playing in */
    private population: number;
    /** Number of deceased people since the game started */
    private deceased = 0;
    /** 
     * Number of currently infected people (known cases). 
     * The game starts with 0 agents with the status INFECTED, but
     * a specific number of agents have the status UNKNOWINGLY_INFECTED.
     */
    public infected = 0;
    /**
     * Number of currently, unknowingly infected citizens.
     */
    public unknowinglyInfected = 0;
    /** Wether the first infected citizen was detected (with a test kit) or not */
    public firstCaseFound = false;

    /** Overall happiness of the population between 0 and 100.00 */
    public happiness: number;
    /** Current happiness tendency (by default the value is 0) */
    public happinessRate: number;
    /** Compliance of the population between 0 and 100.00 */
    public compliance: number;

    /** Number of immune citizens */
    public immune = 0;

    // --------------------------------------------------- PROBABILITIES / VIRUS VARIABLES
    /** 
     * Basic interaction rate which is used to calculate the number of
     * interactions per tic.
     */
    public basicInteractionRate: number;
    /** Upper bound of the randomly generated interaction variance */
    public maxInteractionVariance: number;
    /** Interaction rate which was currently calculated by controller */
    public currentInteractionRate: number;
    /** The virus name, chosen by the player */
    public virusName = "the virus"

    // -------------------------------------------------------------------------- SALARIES
    /** Average salary of a police officer per day in EURO (rounded) (month = 31 days) */
    public readonly avgSalaryPO: number;
    /** Current salary of a police officer per day in EURO (rounded) (month = 31 days) */
    public currentSalaryPO: number;
    /** Average salary of a health worker per day in EURO (rounded) (month = 31 days) */
    public readonly avgSalaryHW: number;
    /** Current salary of a health worker per day in EURO (rounded) (month = 31 days) */
    public currentSalaryHW: number;

    // ----------------------------------------------------------------------- CONSUMPTION
    /** Average price of a virus test kit in EURO (rounded) */
    public readonly avgPriceTestKit: number;
    /** Current price of a virus test kit in EURO (rounded) */
    public currentPriceTestKit: number;
    /** Used test kits since the stat of the day */
    private usedTestKitsThisDay = 0;
    /** Average price of a virus vaccination in EURO (rounded) */
    public readonly avgPriceVaccination: number;
    /** Current price of a virus vacination in EURO (rounded) */
    public currentPriceVaccination: number;
    /** Used vaccines since the start of the day */
    private usedVaccinesThisDay = 0;

    // ----------------------------------------------------------------- FINANCE VARIABLES
    /** Available money in EURO */
    public budget: number;
    /** Maximum reachable income */
    public maxIncome: number;
    /** Current income per tic */
    public income: number;
    /** The in-game currency */
    public currency = '€';

    // ----------------------------------------------------------------------- WEEKLY LOGS
    /** Number of infected people each week */
    private weeklyInfected = [0];
    /** Number of cured people each week */
    private weeklyCured = [0];
    /** Number of people who died each week */
    private weeklyDead = [0];
    /** Number of hired health workers each week */
    private weeklyHW = [0];
    /** Number of hired police officers each week */
    private weeklyPolice = [0];
    /** The level of research at the end of the week */
    private weeklyResearch = [0];
    /** The income statement each week */
    private weeklyIncomeStatements = [new IncomeStatement(0,0,0,0,0,0)];
    /** Number of used test kits each week */
    private weeklyTestKits = [0];
    /** Number of used vaccines each week */
    private weeklyVaccines = [0];
    /** When this lower bound is reached, the game should be lost */
    public lowerBoundBankruptcy: number;


    // -------------------------------------------------------------------- GETTER-METHODS
    /** @returns Current population number */
    public getPopulation(): number {return this.population * this.populationFactor;}
    /** @returns Actual number of agents inside the agents array */
    public getNumberOfAgents(): number {return this.population;}
    /** @returns Number of deceased people since game start */
    public getDeceased(): number {return this.deceased * this.populationFactor;}

    /**
     * The number does not include agents with the state UNKNOWINGLY_INFECTED 
     * @returns Number of currently infected people
     */
    public getInfected(): number {return this.infected * this.populationFactor;}

    /** @returns Number of police officers */
    public getNumberOfPolice(): number {return this.weeklyPolice[TimeController.getInstance().getWeeksSinceGameStart()] * this.populationFactor;}

    /** @returns Number of health workers */
    public getNumberOfHealthWorkers(): number {return this.weeklyHW[TimeController.getInstance().getWeeksSinceGameStart()] * this.populationFactor;}

    /** @returns salary for all health workers */
    public getHWSalary(): number {return this.getNumberOfHealthWorkers() * this.currentSalaryHW;}

    /** @returns salary for all police officers */
    public getPOSalary(): number {return this.getNumberOfPolice() * this.currentSalaryPO;}

    /** @returns prices for all bought test kits of the current day */
    public getDailyTestKitsExpense(): number {return this.usedTestKitsThisDay * this.currentPriceTestKit;}

    /** @returns prices for all bought vaccines of the current day */
    public getDailyVaccinesExpense(): number {return this.usedVaccinesThisDay * this.currentPriceVaccination;}

    /** @returns prices for all bought test kits of the current week */
    public getWeeklyTestKitsExpense(): number {return this.weeklyTestKits[this.weeklyTestKits.length - 1] * this.currentPriceTestKit;}

    /** @returns prices for all bought vaccines of the current week */
    public getWeeklyVaccinesExpense(): number {return this.weeklyVaccines[this.weeklyVaccines.length - 1] * this.currentPriceVaccination;}

    /** @returns R-Value */
    public getRValue(): number { 
        // Number of suscetible agents
        const suscetible = this.population - this.infected - this.weeklyHW[TimeController.getInstance().getWeeksSinceGameStart()] - this.immune;
        return this.basicInteractionRate * this.populationFactor * 4 * suscetible/ this.population;
    }

    /**
     * Returns an array of all weekly stats for the given week in the following order:  
     * 1. Infected
     * 2. Cured  
     * 3. Dead  
     * 4. Hired health workers
     * 5. Hired police officers
     * 6. Research level
     * 7. Used test kits
     * 8. Used vaccines
     * @param week The week for which to return the information
     * @returns Array of numbers
     */
    public getWeeklyStats(week: number): number[] {
        return [
            this.weeklyInfected[week] * this.populationFactor,
            this.weeklyCured[week] * this.populationFactor,
            this.weeklyDead[week] * this.populationFactor,
            this.weeklyHW[week] * this.populationFactor,
            this.weeklyPolice[week] * this.populationFactor,
            this.weeklyResearch[week],
            this.weeklyTestKits[week],
            this.weeklyVaccines[week]
        ];
    }

    /**
     * Returns the income statement for the specific week.
     * @param week 
     */
    public getIncomeStatement(week: number): IncomeStatement {
        return this.weeklyIncomeStatements[week];
    }

    // --------------------- GETTER STRING METHODS -------------------------------- //
    /** @returns the budget as a formatted string */
    public getBudgetString(): string {
        return this.formatMoneyString(this.budget);
    }

    /** @returns the difference of the income and all epxenses as a formatted string */
    public getEarningsString(): string {
        const is = UpgradeController.getInstance().getIncomeStatementToday();
        return this.formatMoneyString(is.getEarningsTotal());
    }

    /** @returns the current percentage of infected people, e.g. 45 % */
    public getInfectedString(): string {
        if (this.infected * this.populationFactor < 1_000_000) {
            return this.formatLargerNumber(this.infected * this.populationFactor);
        } else return ((this.infected / this.population) * this.populationFactor).toFixed(2) + " %";
    }


    // ------------------------------------------------------------------ SETTER-METHODS
    /** Increase deceased counter by one and decrease infected and population counter by one */
    public deceasedCitizen(): void {
        this.weeklyDead[TimeController.getInstance().getWeeksSinceGameStart()]++;
        this.deceased++;
        this.population--;
        this.infected--;
    }

    /** Increase infected counter by one */
    public foundInfected(): void {
        this.weeklyInfected[TimeController.getInstance().getWeeksSinceGameStart()]++;
        this.infected++;
        this.unknowinglyInfected--;
    }

    /** Decrease infected counter by one and consume one vaccine */
    public cureInfected(): void {
        this.infected--;
        this.immune++;
        this.vaccineUsed();
    }

    /** Increase unknowingly infected counter by one */
    public addUnknowinglyInfected(): void {
        this.unknowinglyInfected++;
    }

    /** Decrease unknowingly infected counter by one and consume one vaccine */
    public cureUnknowinglyInfected(): void {
        this.unknowinglyInfected--;
        this.immune++;
        this.vaccineUsed();
    }

    /** Increases the current number of plice officer agents
     * @param amt Number of new police officers
     */
    public increasePoliceOfficers(amt: number): void {
        this.weeklyPolice[TimeController.getInstance().getWeeksSinceGameStart()] += amt;
    }

    /**
     * Increases the variable which represents the number of agents inside the agents array.
     * This method does not influence the agents array but only the length variable!
     * @param amt Amount of new agents
     */
    public increasePopulation(amt: number): void {
        this.population += amt;
    }

    /** Increases the current number of health worker agents
     * @param amt Number of new health workers
     */
    public increaseHealthWorkers(amt: number): void {
        this.weeklyHW[TimeController.getInstance().getWeeksSinceGameStart()] += amt;
    }

    /** Increse the test kit counter for the current day by one */
    public testKitUsed(): void {
        this.weeklyTestKits[TimeController.getInstance().getWeeksSinceGameStart()] += this.populationFactor;
        this.usedTestKitsThisDay += this.populationFactor;
    }

    /** Increse the vaccine counter for the current day by one */
    public vaccineUsed(): void {
        this.weeklyVaccines[TimeController.getInstance().getWeeksSinceGameStart()] += this.populationFactor;
        this.usedVaccinesThisDay += this.populationFactor;
    }
    
}