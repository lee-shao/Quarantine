import { Controller } from "../../controller/controller";
import { TimeController } from "../../controller/timeController";
import { EventController } from "../../controller/eventController";

/**
 * Main phaser scene which manages the other game scene
 */
export class MainScene extends Phaser.Scene {

    /** Instance of the central coordinator */
    private controller: Controller;
    /** Instance of the central time coordinator */
    private timeController: TimeController;

    constructor() {
        super({
            key: 'MainScene',
            active: false
        });
    }

    preload(): void {
        this.load.image('background', 'assets/sprites/main-scene/background.png');
    }

    init(): void {
        //
    }

    create(): void {
        this.add.image(960, 470, 'background');

        this.timeController = TimeController.getInstance();
        this.controller = Controller.getInstance();
        EventController.getInstance();
    }

    update(): void {
        //Updates ingame time
        this.timeController.tic();
    }

}
