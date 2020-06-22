import 'phaser';

/**
 * Extends from Phaser.GameObjects.Image and represents a scroll button of the menu.
 * 
 * It implements the scroll functionality by using an event emitter which distributes
 * events to the single menu items and triggers that way updatePosition() of each item.
 * @author Marvin Kruber
 */
export class ArrowButton extends Phaser.GameObjects.Image{

    /** Scroll direction => 1= right, -1=left */
    private direction: number
    /** Static event emitter which is used for distributing events to the single items */
    private static readonly EMITTER = new Phaser.Events.EventEmitter();
    /** Used to limit the scroll width and indicates the current menu position*/
    private static scrollCounter: number;

    /**
     * 
     * @param scene scene to which this GameObject belongs
     * @param x horizontal position of the ArrowButton
     * @param y vertical position of the ArrowButton
     * @param key texture key
     * @param direction scroll direction: Choose 1 if the button should scroll items to the right or -1 for scroll them to the left
     * @param nbrItems number of menu items 
     */
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, direction: number, nbrItems: number) {
        super(scene, x, y, key);

        this.direction = direction;
        ArrowButton.scrollCounter = nbrItems;

        this.scene.add.existing(this);
        this.setScale(0.15, 0.2); //scale the displayed image

        this.setInteractive()
            .on('pointerdown', ()=> {
                const currentMenuPosition = ArrowButton.scrollCounter + this.direction;

                if(currentMenuPosition <= 3 || currentMenuPosition >= 7) return; //tests whether scrolling would exceed the specified scroll bounds

                ArrowButton.EMITTER.emit('myButtonClick', this.direction); //tirggers all on this event emitter (for this event) registered event handlers i.e. all menu items
                ArrowButton.scrollCounter = currentMenuPosition;
             });
    }

    /** 
     * Used to get the static event emitter of ArrowButton, so that e.g. items are able to register
     * their event handler on it.
     * @returns event emitter 
     */
    public static getEmitter(): Phaser.Events.EventEmitter {
        return ArrowButton.EMITTER;
    }
}