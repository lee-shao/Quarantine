import { Stats } from "../../controller/stats";
import { TimeController } from "../../controller/timeController";
import { TimeSubscriber } from "../../models/util/timeSubscriber";

export class NewsPaper extends Phaser.GameObjects.Container implements TimeSubscriber {

    private newspaperImage: Phaser.GameObjects.Image;
    private stats: Stats;
    private happiness: number;
    private totalCases: number;
    private infected: number;
    private dead: number;
    private cured: number;
    private cases: number[];
    private static instance: NewsPaper;
    private happinessState: string;

    private happinessStateText: Phaser.GameObjects.Text;
    private mainText: Phaser.GameObjects.Text;
    private totalInfectionsText: Phaser.GameObjects.Text

    /** The only existing instance of time controller */
    private tC: TimeController;

    public constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        this.stats = Stats.getInstance();

        this.tC = TimeController.getInstance();
        this.tC.subscribe(this);

        this.scene.add.image(300, 780, 'news').setScale(0.75);
        this.newspaperImage = this.scene.add.image(this.x+150, this.y + 125, 'flu-virus').setScale(0.5);
        this.scene.add.text(this.x +300, this.y+100, `Happiness Report:`, {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '30px',
            fontWeight: '700'
        });
        this.happinessStateText = this.scene.add.text(this.x + 300, this.y + 100, `\nNewest surveys uncover\n${this.happinessState} results: \n${this.happiness} % of people happy.`, {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '25px',
        });
        this.totalInfectionsText = this.scene.add.text(this.x+100, this.y - 100, `Infections pass ${this.totalCases} cases` , {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '40px',
        });
        this.mainText = this.scene.add.text(this.x+300, this.y - 50, `Within a week, \n${this.infected} new infections, \n${this.dead} new death and \n${this.cured} cured cases \nhave been confirmed`, {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '25px',
        });
        this.updateHappinessReport();
        this.updateHeadline(0);
        this.scene.add.existing(this);
    }

    public static getInstance(scene = null, x = 0, y = 0): NewsPaper {
        if(!NewsPaper.instance) NewsPaper.instance = new NewsPaper(scene, x, y);
        return NewsPaper.instance;
    }

    public updateHappinessReport(): void {
        this.happiness = this.stats.happiness;
        if(this.happiness < 25) {
            this.happinessState = "devastating";
        } else if(this.happiness >= 25 && this.happiness < 50) {
            this.happinessState = "shocking";
        }
        else if(this.happiness >= 50 && this.happiness < 75) {
            this.happinessState = "concerning";
        }
        else if(this.happiness >= 75 && this.happiness <= 100) {
            this.happinessState = "reassuring";
        }
        this.happinessStateText.setText(`\nNewest surveys uncover\n${this.happinessState} results: \n${this.happiness} % of people happy.`);
    }

    public updateHeadline(totalInfections: number): void {
        const week = TimeController.getInstance().getWeeksSinceGameStart();
        this.cases = Stats.getInstance().getWeeklyStats(week);
        this.infected = this.cases[0];
        this.cured = this.cases[1];
        this.dead = this.cases[2];
        // if(week == 1) {
        //     this.newspaperImage.destroy();
        //     this.newspaperImage = this.scene.add.image(this.x - 250, this.y + 125, 'ambulance').setScale(0.75);
        // }
        
        this.totalInfectionsText.setText(`Infections pass ${totalInfections} cases`);
        this.mainText.setText(`Within a week, \n${this.infected} new infections, \n${this.dead} new death and \n${this.cured} cured cases \nhave been confirmed`);
    }

    notify(): void {
        if (TimeController.getInstance().getDaysSinceGameStart() % 7 == 0) {
            this.updateHappinessReport();
            this.updateHeadline(this.stats.getInfected());
        }
    }
}