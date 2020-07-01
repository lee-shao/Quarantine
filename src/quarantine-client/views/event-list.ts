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
        // debugger
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
        let x = 650;
        let y = 450;
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


    // public open(scene: Phaser.Scene): void {
    //     this.scene = scene;
    //     console.log("hello biatch");
    //     // this.createLogBookView(TimeController.getInstance().getWeeksSinceGameStart()).createModal();
    // }

    // private createLogBookView(week: number): LogBookView {
    //     const lbView = new LogBookView(this.scene, week);
    //     const info = Stats.getInstance().getWeeklyStats(week);
    //     const is = Stats.getInstance().getIncomeStatement(week);

    //     this.generateLogBookStats(lbView, info);
    //     this.generateLogBookStatsImages(lbView);
    //     this.generateLogBookIncomeStatement(lbView, is);

    //     lbView.addGameObjects([new Phaser.GameObjects.Text(
    //         this.scene,
    //         330, 
    //         800, 
    //         "This log book shows the accumulated values for each week.", 
    //         { color: 'Black', fontSize: '22px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
    //     )]);
        
    //     return lbView;
    // }















    

    // public constructor(scene: Phaser.Scene, x: number, y: number){
    //     debugger
    //     super(scene, x, y);
    //     this.eventNote = this.scene.add.image(this.x, this.y, 'event-note');
    //     this.eventNote.scale = 0.5;
        
    //     this.guiScene = GuiScene.getInstance();
    //     this.eventLog = EventLog.getInstance();
    //     this.events = this.eventLog.getLast();

    //     this.eventNote.on('pointerover', () => { this.eventNote.scale = 0.6; });
    //     this.eventNote.on('pointerout', () => { this.eventNote.scale = 0.5; });
    //     this.eventNote.on('pointerup', () => {
    //         if(!this.guiScene.mainSceneIsPaused){
    //             if (this.guiScene.soundON) this.guiScene.buttonClickMusic.play();
    //         } else {
    //             const popup = new PopupWindow(GuiScene.instance, 0, 0, 'event-note', 1600, 80, true, [this.eventLog[0], this.eventLog[1], this.eventLog[2]], false);
    //             popup.createModal();
    //         }
    //     });
    //     this.scene.add.existing(this);
    // }

    public static getInstance(scene = null, x = 0, y = 0): EventList {
        if(!EventList.instance) EventList.instance = new EventList(scene);
        return EventList.instance;
    }

} 