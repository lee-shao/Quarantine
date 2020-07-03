import 'phaser';
import { GameObjects } from 'phaser';
import { UpgradeController } from '../../controller/gui-controller/upgradeController';
import { ButtonContainer } from './button-container';
import { TutorialComponent } from '../tutorial/tutorialComponent';
import { Stats } from '../../controller/stats';
import { TimeSubscriber } from '../../models/util/timeSubscriber';
import { TimeController } from '../../controller/timeController';

/**
 * Extends Phaser.GameObjects.Container and represents the ingame item menu.
 * 
 * It contains the single items as well as all relevant layout components like navigation buttons (@see arrow-button) and so on.
 * ItemMenu is implemented as a singleton
 * @author Marvin Kruber
 * @author Shao
 */
export class ItemMenu extends Phaser.GameObjects.Container implements TutorialComponent, TimeSubscriber {

    /** Current available budget */
    private budget: number;
    /** Current income */
    private income: number;

    /** Instance of upgradeController. Used to buy measures */
    private upgradeContr: UpgradeController;
    
    /** Data of all measures @see measures.json */
    public measures = require("./../../../../res/json/measures.json");

    /** Counts the number of invocations of activateComponent*/
    private activationCounter = 0;

    /** Singleton instance */
    private static instance: ItemMenu;

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of this menu
     * @param y vertical position of this menu
     */
    private constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.upgradeContr = UpgradeController.getInstance();
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        // Add background
        this.scene.add.image(this.x + 350 , this.y + 120, 'notebook').setScale(0.6);  //.setAlpha(0.5); //dont work
        // Add sticky note
        this.add(this.scene.add.image(this.x - 110 , -120, 'note-pink').setScale(0.6));
        this.add(this.scene.add.image(450, -186, 'cash').setOrigin(0).setScale(0.7));
        this.add(this.scene.add.image(450, -206, 'money').setOrigin(0).setScale(0.4));
        this.add(this.scene.add.image(470, -130, 'police-batch').setOrigin(0).setScale(0.13));
        this.add(this.scene.add.image(470, -110, 'health-sign').setOrigin(0).setScale(0.07));

        this.scene.add.existing(this);

        this.addStatistics();

        TimeController.getInstance().subscribe(this);
    }

    public notify(): void {
        this.updateItemMenu();
    }

    /** Creates the "profile". That means item menu relevant stats are visualized on the menu. */
    private addStatistics(): void {
        const stats = Stats.getInstance();
        this.add(this.scene.add.text(this.x - 200, -200,`\t\t\t\t\t\t\t${stats.getBudgetString()}\n\t\t\t\t\t\t\t${stats.getEarningsString()}\n\nSalary:\n\t\t\t\t\t\t\t\t\t${stats.getPoliceSalaryString()}\n\t\t\t\t\t\t\t\t\t${stats.getHwSalaryString()}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
        }))
    }

    /** Updates all menu statistics i.e. budget and income. */
    public updateItemMenu(): void {
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        const stats = Stats.getInstance();
        (this.getAt(5) as GameObjects.Text).setText(`\t\t\t\t\t\t\t${stats.getBudgetString()}\n\t\t\t\t\t\t\t${stats.getEarningsString()}\n\nSalary:\n\t\t\t\t\t\t\t\t\t${stats.getPoliceSalaryString()}\n\t\t\t\t\t\t\t\t\t${stats.getHwSalaryString()}`);
    }

    //-------------------------------------------------------------------------------------------------
    /** Adds lockdown button to the menu */
    public unlockLockdownBtn(): void {
        new ButtonContainer(this.scene, this.x + 25, 575, 'lockdown', this.measures['lockdown']['price'], () => this.upgradeContr.activateLockdown());
    }

    public activateComponent(): void {
        // Add/unlocks button container
        ++this.activationCounter;
        if( this.activationCounter == 1) {
            new ButtonContainer(this.scene, this.x + 25, 675, 'police', this.measures['police']['price'], () => this.updateItemMenu());
            new ButtonContainer(this.scene, this.x + 25, 775, 'healthworkers', this.measures['healthworkers']['price'], () => this.updateItemMenu());
        } else {
            new ButtonContainer(this.scene, this.x + 25, 475, 'research', this.measures['research']['prices'][0], () => this.upgradeContr.buyResearchLevel());
        }
    }

    public hideComponent(): void {
        // has to be implemented because of tutorialComponent (-> interface)
    }

    /** Singleton method.
     * @returns Instance of ItemMenu
     */
    public static getInstance(scene = null, x = 0, y = 0): ItemMenu {
        if(!ItemMenu.instance) ItemMenu.instance = new ItemMenu(scene, x, y);
        return ItemMenu.instance;
    }
}