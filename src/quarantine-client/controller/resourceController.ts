import { Stats } from "./stats";
import { TimeController } from "./timeController";
import { TimeSubscriber } from "../models/util/timeSubscriber";
import { IncomeStatement } from "./entities/incomeStatement";
import { UpgradeController } from "./gui-controller/upgradeController";

/**
 * Singleton controller which manages all resources (e.g. happiness, compliance, budget).
 * It calculates and updates the resource values once a day.
 * @author Marvin Kruber
 */
export class ResourceController implements TimeSubscriber{
    
    /** Singleton instance which holds game variables */
    private stats: Stats;
    /** The only existing instance of ResourceController */
    private static instance: ResourceController;
    /** Instance of singleton time controller */
    private tC: TimeController;
    /** Instance of singleton upgrade controller */
    private uC: UpgradeController

    private constructor() {
        this.stats = Stats.getInstance();
        this.tC = TimeController.getInstance().subscribe(this);
        this.uC = UpgradeController.getInstance();
    }


    /** @see TimeSubscriber */
    public notify(): void {
        this.updateHappiness();
        this.updateCompliance();
        this.updateBudget(this.calculateIncome(), this.calculateExpenses());

        this.stats.updateWeek(this.getIncomeStatementToday());
    }

    // ----------------------------------------------------------------- UPDATE - METHODS
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
     * Calculate the income depending on the population compliance.
     * When the compliance sinks below 20% the state generates 0 income,
     * while above 70% 100% of the income are generated.
     * @returns earnings in EURO
     */
    private calculateIncome(): number {
        if (this.stats.compliance > 70) this.stats.income = 1 * this.stats.maxIncome;
        else if (this.stats.compliance < 20) this.stats.income = 0;
        else {
            this.stats.income = Math.floor((this.stats.compliance - 20) * 2 * this.stats.maxIncome /100);
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
        return sals + consumption + this.uC.calculateMeasureExpenses();
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): ResourceController {
        if (!ResourceController.instance) ResourceController.instance = new ResourceController();
        return ResourceController.instance;
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
            this.uC.calculateMeasureExpenses()
        );
    }
}