import 'phaser';
import { GameObjects } from 'phaser';
import { UpgradeController } from '../../controller/gui-controller/upgradeController';
import { ButtonContainer } from './button-container';
import { TutorialComponent } from '../tutorial/tutorialComponent';

/**
 * Extends Phaser.GameObjects.Container and represents the ingame item menu.
 * 
 * It contains the single items as well as all relevant layout components like navigation buttons (@see arrow-button) and so on.
 * ItemMenu is implemented as a singleton
 * @author Marvin Kruber
 * @author Shao
 */
export class ItemMenu extends Phaser.GameObjects.Container implements TutorialComponent {

    /** Current available budget */
    private budget: number;
    /** Current income */
    private income: number;

    /** Instance of upgradeController. Used to buy measures */
    public upgradeContr: UpgradeController;
    
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
        // Add menu bar
        this.add(this.scene.add.image(this.x + 515 , 70, 'note-pink').setScale(0.6));

        this.scene.add.existing(this);

        this.addStatistics();
    }

    /** Creates the "profile". That means item menu relevant stats are visualized on the menu. */
    private addStatistics(): void {
        this.add(this.scene.add.text(this.x + 425, 0,`Budget: ${this.budget}\nIncome: ${this.income}`,{ // \n for line break and then setLineSpacing
            fontFamily:'Arial',
            color:'#000000',
        }))
    }

    /** Updates all menu statistics i.e. budget and income. */
    public updateItemMenu(): void {
        this.budget = this.upgradeContr.getBudget();
        this.income = this.upgradeContr.getIncome();
        (this.getAt(1) as GameObjects.Text).setText(`Budget: ${this.budget}\nIncome: ${this.income}`);
    }

    //-------------------------------------------------------------------------------------------------
    /** */
    private buildClosure(myFunction: Function): Function {
        const contr = this.upgradeContr;
        return function(): void {myFunction(contr)};
    }

    /** Adds lockdown button to the menu */
    public unlockLockdownBtn(): void {
        new ButtonContainer(this.scene, this.x + 25, 575, 'lockdown', this.measures['lockdown']['price'], this.buildClosure(this.upgradeContr.activateLockdown));
    }

    public activateComponent(): void {
        // Add/unlocks button container
        ++this.activationCounter;
        if( this.activationCounter == 1) {
            new ButtonContainer(this.scene, this.x + 25, 675, 'police', this.measures['police']['price'], this.buildClosure(this.upgradeContr.buyPoliceOfficers));
            new ButtonContainer(this.scene, this.x + 25, 775, 'healthworkers', this.measures['healthworkers']['price'], this.buildClosure(this.upgradeContr.buyHealthWorkers));
        } else {
            new ButtonContainer(this.scene, this.x + 25, 475, 'research', this.measures['research']['prices'][0], this.buildClosure(this.upgradeContr.buyResearchLevel));
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