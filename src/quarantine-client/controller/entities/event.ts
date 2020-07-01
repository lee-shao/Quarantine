import 'phaser';
import { PopupWindow } from "../../views/popupWindow";
import { GuiScene } from "../../views/scenes/gui-scene";
import { EventButton } from '../../views/event-button';
import { Scenes } from 'phaser';

/**
 * An in-game event and opens a popup window.  
 * Represents the interface between the gui and the event
 * application logic {@see EventController}.
 * 
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Event {

    private eventTitle: Phaser.GameObjects.Text;
    private eventDescription: Phaser.GameObjects.Text;


    /**
     * @param executeEventFunction Should Encapsulates game logic which is executed when the event is triggered. E.g. increment the death counter (removal) of a citizen.
     */
    public constructor(executeEventFunction: Function, title: string, description: string, imagePath: string) {
        console.log("im in event entity");
        // debugger
        if (!imagePath) imagePath = "letter";
        const img = new Phaser.GameObjects.Image(GuiScene.instance, 1400, 700, imagePath).setOrigin(0).setDepth(1);
        const styleDesc = { // description style
            color: 'Black',
            fontSize: '55px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        const styleTitle = { // title style
            color: 'Black',
            align: 'center',
            fontSize: '80px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        const ppTitle = new Phaser.GameObjects.Text(GuiScene.instance, 0, 90, title, styleTitle);
        ppTitle.setWordWrapWidth(1300);
        ppTitle.setX((1920 / 2) - ppTitle.width / 2);
        const ppDescription = new Phaser.GameObjects.Text(GuiScene.instance, 300, 350, description, styleDesc);
        ppDescription.setWordWrapWidth(1300);
        const popup = new PopupWindow(GuiScene.instance, 0, 0, 'event-note', 1600, 80, true, [img, ppTitle, ppDescription], false);
        this.addLastEvent(title, description);
        executeEventFunction();
        // const guiScene = new GuiScene();
        // new EventButton(GuiScene.instance).create().addLastEvent(title, description);
        // popup.createModal();
    }

    public addLastEvent(title: string, description: string) {
        // debugger
        const styleDesc = { // description style
            color: 'Black',
            fontSize: '25px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            wordWrap: { width: 550 }
        };
        const styleTitle = { // title style
            color: 'Black',
            align: 'left',
            fontSize: '30px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            wordWrap: { width: 450 },
            

        };
        if(!this.eventTitle) {
            GuiScene.instance.scene.scene.add.rectangle(1570, 700, 480, 100, 0xffffff);
            this.eventTitle = GuiScene.instance.scene.scene.add.text(1340, 670, title, styleTitle);
        } else {
            this.eventTitle.destroy();
            this.eventTitle = GuiScene.instance.scene.scene.add.text(1320, 670, title, styleTitle);
        }
        if(!this.eventDescription) {
            GuiScene.instance.scene.scene.add.rectangle(1480, 890, 640, 150, 0xffffff);
            this.eventDescription = GuiScene.instance.scene.scene.add.text(1200, 830, description, styleDesc);
        } else {
            this.eventDescription.destroy();
            this.eventDescription = GuiScene.instance.scene.scene.add.text(1200, 830, description, styleDesc);
        }
    }

}