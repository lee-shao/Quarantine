import 'phaser';
import { UpgradeController } from '../../controller/upgradeController';
import { TimeController } from '../../controller/timeController';
import { TimeSubscriber } from '../../models/util/timeSubscriber';
import { GuiScene } from '../scenes/gui-scene';

/**
 * Represents a container which inherit all necessary items
 * depending on the type of button that its gonna contain.
 * 
 * @author Shao
 */
export class ButtonContainer extends Phaser.GameObjects.Container implements TimeSubscriber {

    /** Key to determine which button is used */
    private key: string;
    /**  The daily costs of smth */
    private dailyCost: number;
    /** Visual text representation of daily costs */
    private dailyCostText: Phaser.GameObjects.Text;
    /** The Amount of smth */
    private amount: number;
    /** Visual text representation of amount */
    private amountText: Phaser.GameObjects.Text;
    /** How much percentage the research currently has */
    private percent: number;
    /** Visual text of percentage */
    private percentText: Phaser.GameObjects.Text;
    /** Time in days since lockdown has been activated */
    private daysInLockdown: number
    /** Text of how many days passed since lockdown has been activated */
    private daysInLockdownText: Phaser.GameObjects.Text;

    /** Total time spent in lockdowns (in days) */
    private countDays: number;
    /** Remembers the starting time */
    private startTime: number;
    /** Whether lockdown is activated or not */
    private lockdownActive: boolean;
    /** Visual text of price */
    private priceText: Phaser.GameObjects.Text;
    /** The Texture of the button */
    private buttonImage: Phaser.GameObjects.Image;
    /** Loading data of menu items (=> measure attributes)*/
    public measures = require("./../../../../res/json/measures.json");

    public upgradeContr: UpgradeController;

    private eventListener: Function;

    public constructor(scene: Phaser.Scene, x: number, y: number, texture: string, price: number, callback: Function) {
        super(scene, x, y);

        this.eventListener = callback;

        this.lockdownActive = false;
        this.daysInLockdown = 0;
        this.countDays = 0;
        this.percent = 0;
        this.key = texture;
        // Loading daily cost and amount from measures.json
        this.dailyCost = this.measures[this.key]['daily_cost'];
        this.amount = this.measures[this.key]['amount'];
        // Load 'key' as image and price as text to fixed position in the container
        this.buttonImage = this.scene.add.image(this.x + 100, this.y + 100, this.key).setScale(0.5);
        this.priceText = this.scene.add.text(this.x + 75, this.y + 138.5, `${price} €`, {
            fontFamily:'Arial',
            color:'#000000',
        });
        // Adding items depending on type of the button
        this.addEssentialItems(this.key);
        // Adding button animations
        this.buttonAnimations(this.buttonImage);

        TimeController.getInstance().subscribe(this);

        this.scene.add.existing(this);
    }

    /**
     * Depening on which button (key),
     * loading other items belonging to that button
     * @param title name of the button as string
     */
    private addEssentialItems(title: string): void {
        
        if(title == 'research' || title == 'police' || title == 'healthworkers') {
            this.scene.add.image(this.x + 325, this.y + 130, 'money').setScale(0.5);
            // The research button includes the static text 'Progress:' -> it is static
            if (title == 'research') {
                this.scene.add.image(this.x + 325, this.y + 85, 'progress').setScale(0.45);
                this.scene.add.text(this.x + 140, this.y + 70, 'Progress: ', {
                    fontFamily: 'Arial',
                    color: '#000000',
                });
                this.percentText = this.scene.add.text(this.x + 312, this.y + 78, `${this.percent}%`, {
                    fontFamily: 'Arial',
                    color: '#000000',
                }).setScale(0.85);
            }
            // Police and healthworkers buttons includes the amount, the daily costs and a plus/minus button
            if (title == 'police' || title == 'healthworkers') {
                // Text of amount
                this.amountText = this.scene.add.text(this.x + 160, this.y + 80, `${this.amount}`, {
                    fontFamily: 'Arial',
                    color: '#000000',
                });
                // Text of daily costs
                this.dailyCostText = this.scene.add.text(this.x + 160, this.y + 115, `${this.dailyCost} €/Day`, {
                    fontFamily: 'Arial',
                    color: '#000000',
                });
                // Plus sign to increase amount and daily costs linear
                this.scene.add.image(this.x + 325, this.y + 80, 'plus').setInteractive()
                .on('pointerup', () => {
                    this.amount += 1000;        // TODO: should be integrated with the const amt in the upgradecontroller
                    this.dailyCost += 40000;
                    this.setAmount();           // updates the text
                }).setScale(0.4);
                // Minus sign to decrease amount and daily costs linear
                this.scene.add.image(this.x + 325, this.y + 100, 'minus').setInteractive()
                .on('pointerup', () => {
                    if (this.amount > 0 && this.dailyCost > 0) {
                        this.amount -= 1000;
                        this.dailyCost -= 40000;
                        this.setAmount();       // updates the text
                    }
                }).setScale(0.4);
                this.scene.add.image(this.x + 275, this.y + 90, 'man').setScale(0.5);
            }
        }
        if(title == 'lockdown') {
            this.daysInLockdownText = this.scene.add.text(this.x + 140, this.y + 70, `Days: ${this.daysInLockdown}`, {
                fontFamily: 'Arial',
                color: '#000000',
            }).setAlpha(0);
            this.scene.add.image(this.x + 250, this.y + 90, 'calendar').setScale(0.5);
        }
    }

    /**
     * Adding button animations.
     * Increase on hover, decrease on pointerout.
     * Decrease on pointerdown, increase on pointerup.
     * @param image 
     */
    private buttonAnimations(image: Phaser.GameObjects.Image): void {
        image.setInteractive()
        .on('pointerover', () => { // increase scale on hover
            image.setScale(0.6);
        })
        .on('pointerout', () => { // decrease scale 
            image.setScale(0.5);
        })
        .on('pointerdown', () => { // decrease scale on click
            image.setScale(0.5);
        })
        .on('pointerup', () => { // "try to buy this item"
            image.setScale(0.6);
            //this.eventListener();       // initiate the buy process of reasearch in the upgrade controller
            // Updates the text of research price, since it has different prices for each level
            switch(this.key) {
                case 'research': 
                    this.eventListener();
                    this.percent += 10;
                    this.updateText();
                    // Grayscales the button if ten levels has been bought
                    if(this.measures[this.key]['current_level'] == 10) {     // maybe should change in upgrade controller to 10
                        image.setTexture('research-gray');
                        image.setScale(0.5);
                        image.removeInteractive();
                        this.priceText.destroy();
                    }
                    break;
                case 'lockdown': 
                    this.eventListener();
                    if(this.lockdownActive == false) {
                        this.lockdownActive = true;     //this.measures[this.key]['active'] = true;
                        this.startTime = TimeController.getInstance().getDaysSinceGameStart();  //this.measures[this.key]['activated_on_day'];
                        this.daysInLockdownText.setAlpha(1);
                    } else {
                        this.lockdownActive = false;    //this.measures[this.key]['active'] = false;
                        this.daysInLockdown = 0;
                        this.daysInLockdownText.setText(`Days: ${this.daysInLockdown}`).setAlpha(0);
                    }
                    break;
                case 'police':
                    UpgradeController.getInstance().buyPoliceOfficers(UpgradeController.getInstance(), this.amount, this.dailyCost);
                    break;
                case 'healthworkers':
                    UpgradeController.getInstance().buyHealthWorkers(UpgradeController.getInstance(), this.amount, this.dailyCost);
                    break;
                default: 
                    console.error("[WARNING] - Passed key does not exist.");
            }
            if (GuiScene.instance.soundON) GuiScene.instance.itemBoughtSound.play();
        });
    }

    public notify(): void {
        if(this.lockdownActive == true) {
            this.daysInLockdown++;   //this.measures[this.key]['activated_on_day'];
            this.countDays++;
            this.daysInLockdownText.setText(`Days: ${this.daysInLockdown}`);
        }
    }
    
    /**
     * Updates the text 
     */
    public updateText(): void {
        const currLv = this.measures['research']['current_level'];
        const currPrice = this.measures['research']['prices'][currLv];
        this.priceText.setText(`${currPrice} €`);
        this.percentText.setText(`${this.percent}%`);
    }

    /**
     * Updates the amount and the daily costs
     */
    public setAmount(): void {
        this.amountText.setText(`${this.amount}`);
        this.dailyCostText.setText(`${this.dailyCost} €/Day`);
    }
}