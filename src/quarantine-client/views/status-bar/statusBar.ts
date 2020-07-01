import { GuiElement } from "../guiElement";
import { GuiScene } from "../scenes/gui-scene";
import { Stats } from "../../controller/stats";
import { TimeSubscriber } from "../../models/util/timeSubscriber";
import { TimeController } from "../../controller/timeController";

export class StatusBar extends GuiElement implements TimeSubscriber {

    private stats: Stats;

    private rValue: Phaser.GameObjects.Text;
    private infected: Phaser.GameObjects.Text;
    private dailyIncome: Phaser.GameObjects.Text;
    private budget: Phaser.GameObjects.Text;

    public constructor(scene: GuiScene) {
        super(scene);

        this.stats = Stats.getInstance();
        TimeController.getInstance().subscribe(this);
    }

    private init(): void {
        this.scene.add.image(480, 0, 'status-bar').setOrigin(0);
        this.scene.add.image(960, 0, 'cash').setOrigin(0);
        this.scene.add.image(1200, 1, 'money').setOrigin(0).setScale(0.5);
    }

    public create(): StatusBar {
        this.init();

        const style = {
            color: 'Black',
            fontSize: '22px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        this.rValue = this.scene.add.text(500, 4, "R-Value: " + this.stats.getRValue().toLocaleString("de-DE"), style).setOrigin(0);
        this.infected = this.scene.add.text(720, 5, "Infected: " + this.stats.getInfectedString(), style).setOrigin(0);
        this.dailyIncome = this.scene.add.text(1000, 5, this.stats.getEarningsString(), style).setOrigin(0);
        this.budget = this.scene.add.text(1240, 5, this.stats.getBudgetString(), style).setOrigin(0);

        return this;
    }

    public update(): void {
        this.dailyIncome.setText(this.stats.getEarningsString());
        this.budget.setText(this.stats.getBudgetString());
    }

    notify(): void {
        this.rValue.setText("R-Value: " + this.stats.getRValue().toLocaleString("de-DE"));
        this.infected.setText("Infected: " + this.stats.getInfectedString());
    }

}