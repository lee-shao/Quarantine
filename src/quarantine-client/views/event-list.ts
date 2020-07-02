import { GuiElement } from "./guiElement";
import { GuiScene } from "./scenes/gui-scene";
import { PopupWindow } from "./popupWindow";
import { EventLog } from "../controller/eventLog";
import { TimeController } from "../controller/timeController";
import { LogBookView } from "./log-book/logBookView";
import { Stats } from "../controller/stats";


export class EventList extends PopupWindow {

    private eventNote: Phaser.GameObjects.Image;
    private static instance: EventList;

    private guiScene: GuiScene;
    private eventLog: EventLog;
    private events: Array<[string,string,string]>;


    constructor(scene: Phaser.Scene) {
        super(scene, 0, 5, 'event-note', 1550, 50, true, 
        [
            new Phaser.GameObjects.Text(scene, 820, 350, 'Last Events', { 
                color: 'Black', 
                fontSize: '70px',
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
            })
        ], false);

        console.log("CREATING SUPER");
        this.addEvents();
        this.scene.add.existing(this);
    }

    public addEvents(): void {
        console.log("CREATING EVENTS");
        this.events = EventLog.getInstance().getLastFive();
        const styleDesc = { // description style
            color: 'Black',
            fontSize: '25px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            wordWrap: { width: 950 }
        };
        const styleTitle = { // title style
            color: 'Black',
            align: 'left',
            fontSize: '30px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            wordWrap: { width: 950 },
            

        };
        const x = 650;
        let y = 250;
        for (let i = 0; i < this.events.length; i++) {
            // debugger
            
            const element = this.events[i];
            console.log(element);

            // const text = new Phaser.GameObjects.Text(this.scene, this.x + x, this.y + y, , styleTitle);  //.setInteractive();   
            const title = new Phaser.GameObjects.Text(this.scene, this.x + x, this.y + y, `Event № ${i+1}: ${element[0]}`, styleTitle);
            const description = new Phaser.GameObjects.Text(this.scene, this.x + x, this.y + y, "\n\n"+element[1], styleDesc);
            // this.add(text);
            this.add(title);
            this.add(description);
            y = y + 125;
        }

    }

    public static getInstance(scene = null, x = 0, y = 0): EventList {
        if(!EventList.instance) EventList.instance = new EventList(scene);
        return EventList.instance;
    }

} 