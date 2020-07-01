import { GuiElement } from "./guiElement";
import { EventList } from "./event-list";
import { GuiScene } from "./scenes/gui-scene";
import { EventLog } from "../controller/eventLog";
import { PopupWindow } from "./popupWindow";



export class EventButton extends GuiElement {

    private eventNote: Phaser.GameObjects.Image;
    // private static instance: EventButton;

    // private guiScene: GuiScene;
    private eventLog: EventLog;

    private eventTitle: Phaser.GameObjects.Text;
    private eventDescription: Phaser.GameObjects.Text;



    public create(): EventButton {
        this.eventNote = this.scene.add.image(1500, 850, 'event-note');
        this.eventNote.setInteractive();
        this.eventNote.scale = 0.5;
        
        // this.guiScene = GuiScene.getInstance();
        this.eventLog = EventLog.getInstance();

        this.eventNote.on('pointerover', () => { this.eventNote.scale = 0.55; });
        this.eventNote.on('pointerout', () => { this.eventNote.scale = 0.5; });
        this.eventNote.on('pointerup', () => {
            if(!this.scene.mainSceneIsPaused){
                // EventList.getInstance().open(this.scene);
                console.log("hello biatch1");
                const skillTree = new EventList(this.scene);
                skillTree.createModal();
                if (this.scene.soundON) this.scene.buttonClickMusic.play();
            } else {
                const popup = new PopupWindow(this.scene, 0, 0, '', 1050, 400, false, [], false);
                const blankNode = this.scene.add.image(this.scene.game.renderer.width / 2 + 50, this.scene.game.renderer.height / 2, 'blank-note').setDisplaySize(300, 200);
                const content = new Phaser.GameObjects.Text(this.scene, this.scene.game.renderer.width / 2 - 50, this.scene.game.renderer.height / 2, 'The game is paused', { color: 'Black', fontSize: '20px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
                popup.addGameObjects([blankNode, content]);
                popup.createModal();
            }
        });

        return this;
    }
    /** @returns Phaser.GameObjects.Image of rule button */
    public getEventButton(): Phaser.GameObjects.Image {return this.eventNote}

    public addLastEvent(title: string, description: string) {
        debugger
        const styleDesc = { // description style
            color: 'Black',
            fontSize: '25px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        const styleTitle = { // title style
            color: 'Black',
            align: 'center',
            fontSize: '30px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        if(!this.eventTitle) {
            this.eventTitle = this.scene.add.text(0, 90, title, styleTitle);
        } else {
            this.eventTitle.destroy();
            this.eventTitle = this.scene.add.text(0, 90, title, styleTitle);
        }
        if(!this.eventDescription) {
            this.eventDescription = this.scene.add.text(300, 350, description, styleDesc);
        } else {
            this.eventDescription.destroy();
            this.eventDescription = this.scene.add.text(300, 350, description, styleDesc);
        }
    }

    // public static getInstance(scene = null, x = 0, y = 0): EventButton {
    //     if(!EventButton.instance) EventButton.instance = new EventButton(scene);
    //     return EventButton.instance;
    // }
}