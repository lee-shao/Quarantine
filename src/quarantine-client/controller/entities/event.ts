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
    public constructor(
            executeEventFunction: Function,
            title: string,
            description: string,
            imagePath: string,
            ethos: boolean,
            summary: string
            ) {
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
        const styleSummary = { // summary style
            fontSize: '40px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        styleSummary['color'] = (ethos) ? 'green' : 'red'; // summary is red for bad events and green for good events

        const ppTitle = new Phaser.GameObjects.Text(GuiScene.instance, 0, 90, title, styleTitle);
        ppTitle.setWordWrapWidth(1300);
        ppTitle.setX((1920 / 2) - ppTitle.width / 2);
        const ppDescription = new Phaser.GameObjects.Text(GuiScene.instance, 300, 350, description, styleDesc);
        ppDescription.setWordWrapWidth(1300);
        this.addLastEvent(title, description);
        const ppSummary = new Phaser.GameObjects.Text(GuiScene.instance, 300, 700, summary, styleSummary);
        ppSummary.setWordWrapWidth(1100);
        const popup = new PopupWindow(GuiScene.instance, 0, 0, 'event-note', 1600, 80, true, [img, ppTitle, ppDescription, ppSummary], false);

        executeEventFunction();
    }

    public addLastEvent(title: string, description: string) {
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
            GuiScene.instance.scene.scene.add.rectangle(1670, 600, 480, 100, 0xffffff);
            this.eventTitle = GuiScene.instance.scene.scene.add.text(1440, 570, title, styleTitle);
        } //else {
        //     this.eventTitle.destroy();
        //     this.eventTitle = GuiScene.instance.scene.scene.add.text(1320, 670, title, styleTitle);
        // }
        if(!this.eventDescription) {
            GuiScene.instance.scene.scene.add.rectangle(1580, 790, 640, 150, 0xffffff);
            this.eventDescription = GuiScene.instance.scene.scene.add.text(1300, 730, description, styleDesc);
        } //else {
        //     this.eventDescription.destroy();
        //     this.eventDescription = GuiScene.instance.scene.scene.add.text(1200, 830, description, styleDesc);
        // }
    }

}