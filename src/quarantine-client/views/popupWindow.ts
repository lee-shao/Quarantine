import "phaser";
import { MainScene } from "./scenes/main-scene";
import { ChartScene } from "./scenes/chart-scene";
import { MapScene } from "./scenes/map-scene";

/**
 * Creates a popup window on creation which holds multiple phaser game objects.
 * @author Vinh Hien Tran
 */
export class PopupWindow extends Phaser.GameObjects.Container {

    private pause: boolean;
    private isChild: boolean;
    private closeBtnX: number;
    private closeBtnY:  number;
    /**
     * @param scene scene to which this GameObject belongs
     * @param x x-index position of this modal
     * @param y y-index position of this modal
     * @param closeBtnX x-index position of this close btn
     * @param closeBtnY y-index position of this close btn
     * @param data list of objects
     * @param backgroundKey : key of background image
     * @param pause true to not pause and false to pause the game
     * @param isChild this attribute is true, when the popup windows will be opened by another popup windows 
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, backgroundKey: string,
            closeBtnX: number, closeBtnY: number, pause: boolean, data: Phaser.GameObjects.GameObject[], isChild: boolean) {
        super(scene, x, y);
        //set pause
        this.pause = pause;
        //set child
        this.isChild = isChild;
        //add background
        if(backgroundKey !== ''){
            this.addBackground(backgroundKey);
        }
        //add close btn
        this.closeBtnX = closeBtnX;
        this.closeBtnY = closeBtnY;
        //add object
        data.forEach(x => scene.add.existing(x));
        this.addGameObjects(data);
    }

    /** 
     * Add phaser 3 game objects to the popup.
     * @param objs Array of game objects to add into the popup
     */ 
    public addGameObjects(objs: Phaser.GameObjects.GameObject[]): void {
        this.add(objs).setDepth(3);
    }

    /**
     * Set the background of this container
     * @param backgroundImg string of image object's key
     */ 
    private addBackground(backgroundImg: string): void {
        this.add(new Phaser.GameObjects.Image(this.scene, this.scene.game.renderer.width / 2, this.scene. game.renderer.height / 2, backgroundImg).setDepth(2));
    }

    /**
     * Add close button which destroys the popup and returns to parent scene
     * @param x x-coordinate of the close button
     * @param y y-coordinate of the close button
     */
    private addCloseBtn(x: number, y: number): void {
        // add close button to top right of popup scene
        const cancelBtn = new Phaser.GameObjects.Image(this.scene, x, y, 'cancelButton').setOrigin(0).setDepth(1);

        // set Interactive
        cancelBtn.setInteractive();
        
        // button click event
        cancelBtn.on("pointerup", () => {
            this.closeModal();
        });

        // hover effect
        cancelBtn.on("pointerover", () => {cancelBtn.scale = 1.1});
        cancelBtn.on("pointerout", () => {cancelBtn.scale = 1});

        this.add(cancelBtn);
    }

    /** this method will close modal, callable by anthoner class and designed for future confirm button */
    public closeModal(): void {
        //stop this modal scene
        this.setVisible(false);

        //if this popup windows not a child, wake up the chart scene.
        if(!this.isChild){
            const chart = this.scene.scene.get('ChartScene') as ChartScene;
            const map = this.scene.scene.get('MapScene') as MapScene;

            map.scene.wake();
            chart.scene.wake();
            // resume the game if game was paused.    
            if(this.pause){
                const main = this.scene.scene.get('MainScene') as MainScene;
                const map = this.scene.scene.get('MapScene') as MapScene;

                main.scene.resume();
                chart.scene.resume();
                map.scene.resume();
            }
        }
    }
    
    /**
    * This public method can callable from outside
    * For example: To show Modal
    * ```
    * new PopupWindow(this, 0, 0, 'log-background', 530, 130, [new Phaser.GameObjects.Text(this, 700, 300, 'hello from gui',{color:'red', fontSize: '50px'})]);
    * ```
    */
    public createModal(): void {
        if(!this.isChild){
            // send the scenes to back
            const main = this.scene.scene.get('MainScene') as MainScene;
            const chart = this.scene.scene.get('ChartScene') as ChartScene;
            const map = this.scene.scene.get('MapScene') as MapScene;
        
            //main.scene.sendToBack();
            //chart.scene.sendToBack();
            //map.scene.sendToBack();

            chart.scene.sleep();
            map.scene.sleep();
            if(this.pause){
                main.scene.pause();
                chart.scene.pause();
                map.scene.pause();
            }
        }

        this.scene.add.existing(this);
        this.addCloseBtn(this.closeBtnX, this.closeBtnY);
        this.setVisible(true);
    }
}