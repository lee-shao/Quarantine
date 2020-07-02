import { Controller } from "../../controller/controller";
import { TimeController } from "../../controller/timeController";
import { ResourceController } from "../../controller/resourceController";

/**
 * Main phaser scene which manages the other game scene
 */
export class MainScene extends Phaser.Scene {

    /** Instance of the central coordinator */
    private controller: Controller;
    /** Instance of the central time coordinator */
    private timeController: TimeController;

    /** Instance of the central resource managment unit */
    private resourceController: ResourceController

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
        this.resourceController = ResourceController.getInstance();
    }

    update(): void {
        //Updates ingame time
        this.timeController.tic();
    }

}
