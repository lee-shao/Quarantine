import { LogBookView } from "../../views/log-book/logBookView";
import { TimeController } from "../timeController";
import { Stats } from "../stats";
import { IncomeStatement } from "../entities/incomeStatement";

/**
 * The log book which stores statistical information about all passed
 * in-game weeks and allows to be opened inside a popup. This class
 * is implemented as a singleton.
 * @author Sebastian Führ
 */
export class LogBook {

    /** The only existing instance of this singleton */
    private static instance: LogBook;

    private stats: Stats;

    private textStatPosY: number;
    private imgStatPosY: number;
    private textFinanceIncPosY: number;
    private textFinanceExpPosY: number;

    private scene: Phaser.Scene;

    private constructor() {
        this.stats = Stats.getInstance();
    }

    /** 
     * @param scene Phaser scene where the sub menu should open
     * @returns the only existing instance of this singleton
     */
    public static getInstance(): LogBook {
        if (!this.instance) this.instance = new LogBook();
        return this.instance;
    }

    /**
     * Generates a phaser 3 text element which is positioned dynamically inside
     * the look book.
     * @param name The name of the position
     * @param value The value
     */
    private getStatTextEl(name: string, value: number): Phaser.GameObjects.Text {
        const temp = new Phaser.GameObjects.Text(
            this.scene,
            400, 
            this.textStatPosY, 
            name + ": " + this.stats.formatLargerNumber(value), 
            { color: 'Black', fontSize: '28px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        );
        this.textStatPosY += 64;
        return temp;
    }

    /**
     * Generates a phaser 3 text element which is positioned dynamically inside
     * the look book.
     * @param name The name of the position
     * @param value The value
     */
    private getFinanceTextEl(name: string, value: number, offset = 0): Phaser.GameObjects.Text {
        let posY: number;
        if (offset == 0) posY = this.textFinanceIncPosY;
        else posY = this.textFinanceExpPosY;
        const temp = new Phaser.GameObjects.Text(
            this.scene,
            1070 + offset, 
            posY, 
            name + ": " + this.stats.formatMoneyString(value), 
            { color: 'Black', fontSize: '18px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        );
        if (offset == 0) this.textFinanceIncPosY += 32;
        else this.textFinanceExpPosY += 32;
        return temp;
    }

    /**
     * Adds statistical information to the log book view.
     * @param lbView 
     * @param info 
     */
    private generateLogBookStats(lbView: LogBookView, info: number[]): void {
        this.textStatPosY = 155;
        const arr = [];
        arr.push(this.getStatTextEl("Infected", Number(info[0])));
        arr.push(this.getStatTextEl("Cured", Number(info[1])));
        arr.push(this.getStatTextEl("Death", Number(info[2])));
        arr.push(this.getStatTextEl("Health Workers", Number(info[3])));
        arr.push(this.getStatTextEl("Police Officers", Number(info[4])));
        arr.push(this.getStatTextEl("Research Level", Number(info[5])));
        arr.push(this.getStatTextEl("Used Test Kits", Number(info[6])));
        arr.push(this.getStatTextEl("Used Vaccines", Number(info[7])));
        
        lbView.addGameObjects(arr);
    }

    private getStatImg(imgKey: string): Phaser.GameObjects.Sprite {
        const el = new Phaser.GameObjects.Sprite(
            this.scene,
            350,
            this.imgStatPosY,
            imgKey
        );
        this.imgStatPosY += 64;
        return el;
    }

    private generateLogBookStatsImages(lbView: LogBookView): void {
        this.imgStatPosY = 160;
        const arr = [];

        const imgVirus = this.getStatImg('virus')
        imgVirus.scale = 0.3;
        arr.push(imgVirus);

        const imgGirl = new Phaser.GameObjects.Sprite(
            this.scene,
            310,
            this.imgStatPosY,
            'girl'
        );
        imgGirl.scale = 0.7;
        arr.push(imgGirl);

        const imgBoy = this.getStatImg('boy')
        imgBoy.scale = 0.7;
        arr.push(imgBoy);

        const imgTombStone = this.getStatImg('tomb-stone');
        imgTombStone.scale = 0.5;
        arr.push(imgTombStone);

        const imgPhysician = this.getStatImg('physician');
        imgPhysician.scale = 0.3;
        arr.push(imgPhysician);

        const imgPolice = this.getStatImg('police-icon'); // TODO search sprite?
        imgPolice.scale = 0.2;
        arr.push(imgPolice);

        const imgChemistry = this.getStatImg('chemistry');
        imgChemistry.scale = 0.5;
        arr.push(imgChemistry);

        const imgTestKit = this.getStatImg('medicine');
        imgTestKit.scale = 0.4;
        arr.push(imgTestKit);

        const imgVaccine = this.getStatImg('vaccine');
        imgVaccine.scale = 0.8;
        arr.push(imgVaccine);

        lbView.addGameObjects(arr);
    }

    private generateLogBookIncomeStatement(lbView: LogBookView, incomeStatement: IncomeStatement): void {
        // Reset y position counters
        this.textFinanceExpPosY = 160;
        this.textFinanceIncPosY = 160;

        const offset = 250;
        const arr = [];

        // headings
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1050, 
            this.textFinanceIncPosY - 37, 
            "Income", 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1300, 
            this.textFinanceExpPosY - 37, 
            "Expenses", 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));

        // income statement
        arr.push(this.getFinanceTextEl("Taxes", incomeStatement.income.taxes));
        arr.push(this.getFinanceTextEl("Salary Police Officers", incomeStatement.expenses.salaries.police, offset));
        arr.push(this.getFinanceTextEl("Salary Health Workers", incomeStatement.expenses.salaries.healthWorker, offset));
        arr.push(this.getFinanceTextEl("Test Kits Total", incomeStatement.expenses.consumption.testKits, offset));
        arr.push(this.getFinanceTextEl("Vaccines Total", incomeStatement.expenses.consumption.vaccines, offset));
        arr.push(this.getFinanceTextEl("Costs for Measures", incomeStatement.expenses.measures, offset));

        // total
        let tempY: number;
        if (this.textFinanceIncPosY > this.textFinanceExpPosY) tempY = this.textFinanceIncPosY;
        else tempY = this.textFinanceExpPosY;
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1050, 
            tempY, 
            this.stats.formatMoneyString(incomeStatement.getIncome()), 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));
        arr.push(new Phaser.GameObjects.Text(
            this.scene,
            1300, 
            tempY, 
            this.stats.formatMoneyString(incomeStatement.getExpenses()), 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        ));

        lbView.addGameObjects(arr);
    }

    /**
     * Creates a popup with information regarding the specified week.
     * @param week The current in-game time week.
     */
    private createLogBookView(week: number): LogBookView {
        const lbView = new LogBookView(this.scene, week);
        const info = Stats.getInstance().getWeeklyStats(week);
        const is = Stats.getInstance().getIncomeStatement(week);

        this.generateLogBookStats(lbView, info);
        this.generateLogBookStatsImages(lbView);
        this.generateLogBookIncomeStatement(lbView, is);

        lbView.addGameObjects([new Phaser.GameObjects.Text(
            this.scene,
            330, 
            800, 
            "This log book shows the accumulated values for each week.", 
            { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
        )]);
        
        return lbView;
    }

    /**
     * Opens the sub menu in the current week
     * @param scene The scene in which the sub scene should be displayed
     */
    public open(scene: Phaser.Scene): void {
        this.scene = scene;
        this.createLogBookView(TimeController.getInstance().getWeeksSinceGameStart()).createModal();
    }

    /**
     * @param currWeek The current in-game time week.
     * @returns wether the operation can be performed
     */
    public showNextWeek(currWeek: number): boolean {
        if (TimeController.getInstance().getWeeksSinceGameStart() == currWeek) return false;
        this.createLogBookView(currWeek + 1).createModal();
        return true;
    }

    /**
     * @param currWeek The current in-game time week.
     * @returns wether the operation can be performed
     */
    public showPrevWeek(currWeek: number): boolean {
        if (currWeek == 0) return false;
        this.createLogBookView(currWeek - 1).createModal();
        return true;
    }

}