import { Stats } from "../../controller/stats";
import { TimeController } from "../../controller/timeController";
import { TimeSubscriber } from "../../models/util/timeSubscriber";
import { TutorialComponent } from "../tutorial/tutorialComponent";
import { GuiElement } from "../guiElement";

export class NewsPaper extends GuiElement implements TimeSubscriber, TutorialComponent {
    
    private newspaperImage: Phaser.GameObjects.Image;
    private backgroundImage: Phaser.GameObjects.Image;
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
    private totalInfectionsText: Phaser.GameObjects.Text

    private x: number;
    private y: number;

    /** The only existing instance of time controller */
    private tC: TimeController;

    public create(): NewsPaper {
        this.stats = Stats.getInstance();

        this.tC = TimeController.getInstance();
        this.tC.subscribe(this);

        this.x = 0;
        this.y = 780;
        this.totalCases = 0;

        this.backgroundImage = this.scene.add.image(this.x + 300, this.y, 'news').setScale(0.75);
        this.newspaperImage = this.scene.add.image(this.x + 150, this.y + 50, 'flu-virus').setScale(0.3);
        this.happinessStateText = this.scene.add.text(this.x + 300, this.y - 50, `Happiness Report:\nNewest surveys uncover\n${this.happinessState} results: \n${this.happiness} % of people happy.`, {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '25px',
        });
        this.totalInfectionsText = this.scene.add.text(this.x + 30, this.y - 100, `Infections pass ${this.totalCases} cases` , {
            fontFamily:'Arial',
            color:'#000000',
            fontSize: '40px',
        });
        this.updateHappinessReport();
        this.updateHeadline(0);
        this.hideComponent();

        return this;
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
        
        this.totalInfectionsText.setText(`Infections pass ${Stats.formatLargerNumber(totalInfections)} cases`);
    }

    public activateComponent(): void {
        this.totalInfectionsText.visible = true;
        this.happinessStateText.visible = true;
        this.newspaperImage.visible = true;
        this.backgroundImage.visible = true;
    }

    public hideComponent(): void {
        this.totalInfectionsText.visible = false;
        this.happinessStateText.visible = false;
        this.newspaperImage.visible = false;
        this.backgroundImage.visible = false;
    }

    notify(): void {
        if (TimeController.getInstance().getDaysSinceGameStart() % 7 == 0) {
            this.updateHappinessReport();
            this.updateHeadline(this.stats.getInfected());
        }
    }
}