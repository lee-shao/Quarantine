import { TimeController } from "../../controller/timeController";
import { Stats } from "../../controller/stats";

/**
 * Scene to show the infected people on a map
 * @author Jakob Hartmann
 */
export class MapScene extends Phaser.Scene {
    /** Number of infected people */
    private infected: number;

    /** Graphics object to draw the red circles */
    private graphics: Phaser.GameObjects.Graphics;

    /** Singleton to access the current infection numbers */
    private stats: Stats;

    /** Map to show the infected people */
    private map: Phaser.GameObjects.Sprite;

    constructor() {
        super({
            key: 'MapScene',
            active: false
        });
        TimeController.getInstance().subscribe(this);
    }


    preload(): void {
        /** Load map */
        this.load.image('germanyMap', 'assets/sprites/germany-map.png');
    }

    init(): void {
        /** The game starts with 0 infected people */
        this.infected = 0;
        this.stats = Stats.getInstance();

        /** If the game is restarted, the current graphics object will be destroyed */
        if (this.graphics != null) {
            this.graphics.destroy();
        }

        /** Add a new graphics object to the scene */
        this.graphics = this.add.graphics();
    }

    create(): void {
        /** Add the map to the scene */
        this.map = this.add.sprite(1400, 100, 'germanyMap');
        this.map.setScale(0.32, 0.32);
        this.map.setOrigin(0, 0);

        /** Add a white rectangle as background for the map to the scene */
        const rectangle = new Phaser.Geom.Rectangle(
            this.map.getTopLeft().x,
            this.map.getTopRight().y,
            this.map.getBottomRight().x - this.map.getTopLeft().x,
            this.map.getBottomRight().y - this.map.getTopLeft().y);
        
        /** Fill the rectangle */
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRectShape(rectangle);

        /** Select red color to fill the circles */
        this.graphics.fillStyle(0xFF0000);
    }

    /** @see TimeSubscriber */
    public notify(): void {
        this.updateMap();
    }

    /** Add newly infected to the map */
    updateMap(): void {
        /** Get current infection numbers */
        const currentlyInfected: number = this.stats.getInfected();

        /** For every thousandth person infected, add a red circle */
        while (this.infected + 1000 <= currentlyInfected) {
            /** Place a circle at a random position on the map */
            const circle = new Phaser.Geom.Circle(
                Phaser.Math.Between(this.map.getTopLeft().x + 5, this.map.getBottomRight().x - 5), 
                Phaser.Math.Between(this.map.getTopLeft().y + 5, this.map.getBottomRight().y - 5), 1.5);

            /** Fill the circle with the selected color */
            this.graphics.fillCircleShape(circle);

            /** Update internal infection numbers */
            this.infected = this.infected + 1000;
        }
    }
}