import 'phaser';
import { PopupWindow } from "../../views/popupWindow";
import { GuiScene } from "../../views/scenes/gui-scene";

/**
 * An in-game event and opens a popup window.  
 * Represents the interface between the gui and the event
 * application logic {@see EventController}.
 * 
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Event {

    /**
     * @param executeEventFunction Should Encapsulates game logic which is executed when the event is triggered. E.g. increment the death counter (removal) of a citizen.
     */
    public constructor(executeEventFunction: Function, title: string, description: string, imagePath: string) {
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

        executeEventFunction();
        popup.createModal();
    }

}