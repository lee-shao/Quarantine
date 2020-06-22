/**
 * An income statement entitiy
 * @author Sebastian Führ
 */
export class IncomeStatement {

    public income = {
        "taxes": 0
    };

    public expenses = {
        "salaries": {
            "police": 0,
            "healthWorker": 0
        },
        "consumption": {
            "testKits": 0,
            "vaccines": 0
        },
        "measures": 0
    }

    /**
     * Constructor
     * @param taxes Money received from the population
     * @param poSalary salary for police officers
     * @param hwSalary salary for health workers
     * @param testKits sum of prices for test kits
     * @param vaccines sum of prices for vaccines
     * @param measures sum of costs for measures
     */
    constructor(
        taxes: number,
        poSalary: number,
        hwSalary: number,
        testKits: number,
        vaccines: number,
        measures: number
    ) {
        this.income.taxes = taxes;
        this.expenses.salaries.police = poSalary;
        this.expenses.salaries.healthWorker = hwSalary;
        this.expenses.consumption.testKits = testKits;
        this.expenses.consumption.vaccines = vaccines;
        this.expenses.measures = measures;
    }

    /**
     * Add a second income statement to the income statement where this method gets called
     * @param incomeStatement2 income statement to be added
     * @returns this instance
     */
    public add(incomeStatement2: IncomeStatement): IncomeStatement {
        this.income.taxes += incomeStatement2.income.taxes,
        this.expenses.salaries.police += incomeStatement2.expenses.salaries.police,
        this.expenses.salaries.healthWorker += incomeStatement2.expenses.salaries.healthWorker,
        this.expenses.consumption.testKits += incomeStatement2.expenses.consumption.testKits,
        this.expenses.consumption.vaccines += incomeStatement2.expenses.consumption.vaccines,
        this.expenses.measures += incomeStatement2.expenses.measures
        return this;
    }

    /** @returns sum of all salaries */
    public getSalarySum(): number {
        return this.expenses.salaries.police + this.expenses.salaries.healthWorker;
    }

    /** @returns sum of all conumable products, e.g. test kits and vaccines */
    public getConsumptionSum(): number {
        return this.expenses.consumption.testKits + this.expenses.consumption.vaccines;
    }

    /** @returns the sum of all expenses */
    public getExpenses(): number {
        return this.expenses.salaries.police
            + this.expenses.salaries.healthWorker
            + this.expenses.consumption.testKits
            + this.expenses.consumption.vaccines
            +this.expenses.measures;
    }

    /** @returns the sum of all incomes */
    public getIncome(): number {return this.income.taxes;}

    /** @returns the difference between the income and all expenses */
    public getEarningsTotal(): number {return this.getIncome() - this.getExpenses();}

}