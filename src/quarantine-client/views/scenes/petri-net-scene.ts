import { TimeSubscriber } from "../../models/util/timeSubscriber";
import { TimeController } from "../../controller/timeController";
import { Stats } from "../../controller/stats";

export class PetriNetScene extends Phaser.Scene implements TimeSubscriber {
    private stats: Stats;

    private graphics: Phaser.GameObjects.Graphics;

    private x: number;

    private y: number;

    private btnPolice: Phaser.GameObjects.Sprite;

    private btnHealthy: Phaser.GameObjects.Sprite;

    private btnHealthworker: Phaser.GameObjects.Sprite;

    private btnInfected: Phaser.GameObjects.Sprite;

    private btnQuarantined: Phaser.GameObjects.Sprite;

    private btnImmune: Phaser.GameObjects.Sprite;

    private btnDead: Phaser.GameObjects.Sprite;

    private numberOfPolice: Phaser.GameObjects.Text;

    private numberOfHealthy: Phaser.GameObjects.Text;

    private numberOfHealthworker: Phaser.GameObjects.Text;

    private numberOfInfected: Phaser.GameObjects.Text;

    private numberOfQuarantined: Phaser.GameObjects.Text;

    private numberOfImmune: Phaser.GameObjects.Text;

    private numberOfDead: Phaser.GameObjects.Text;


    constructor() {
        super({
            key: 'PetriNetScene',
            active: false
        });
        TimeController.getInstance().subscribe(this);
    }

    preload(): void {
        this.load.image('paper', 'assets/sprites/petri-net/paper.jpg');

        this.load.image('blackDot', 'assets/sprites/petri-net/black-dot.png');
        this.load.image('blueDot', 'assets/sprites/petri-net/blue-dot.png');
        this.load.image('cyanDot', 'assets/sprites/petri-net/cyan-dot.png');
        this.load.image('greenDot', 'assets/sprites/petri-net/green-dot.png');
        this.load.image('limeDot', 'assets/sprites/petri-net/lime-dot.png');
        this.load.image('purpleDot', 'assets/sprites/petri-net/purple-dot.png');
        this.load.image('redDot', 'assets/sprites/petri-net/red-dot.png');
    }

    init(): void {
        this.stats = Stats.getInstance();

        /** If the game is restarted, the current graphics object will be destroyed */
        if (this.graphics != null) {
            this.graphics.destroy();
        }

        /** Add a new graphics object to the scene */
        this.graphics = this.add.graphics();

        this.x = 1050;
        this.y = 100;
    }

    create(): void {
        const background = this.add.sprite(this.x - 10, this.y, 'paper');
        background.setOrigin(0, 0);
        background.setDepth(-1);
        background.setScale(1.6, 1.35);

        this.createPetriNet();
    }

    updatePetriNet(): void {
        this.numberOfPolice.setText(Stats.formatLargerNumber(this.stats.getNumberOfPolice()));
        this.numberOfHealthy.setText(Stats.formatLargerNumber(this.stats.getHealthy()));
        this.numberOfHealthworker.setText(Stats.formatLargerNumber(this.stats.getNumberOfHealthWorkers()));
        this.numberOfInfected.setText(Stats.formatLargerNumber(this.stats.getInfected()));
        this.numberOfQuarantined.setText('0'); // TODO: Change
        this.numberOfImmune.setText(Stats.formatLargerNumber(this.stats.getImmune()));
        this.numberOfDead.setText(Stats.formatLargerNumber(this.stats.getDeceased()));

        this.btnPolice.setScale(Math.max(this.stats.getNumberOfPolice() / (2 * this.stats.getPopulation()), 0.05));
        this.btnHealthy.setScale(Math.max(this.stats.getHealthy() / (2 * this.stats.getPopulation()), 0.05));
        this.btnHealthworker.setScale(Math.max(this.stats.getNumberOfHealthWorkers() / (2 * this.stats.getPopulation()), 0.05));
        this.btnInfected.setScale(Math.max(this.stats.getInfected() / (2 * this.stats.getPopulation()), 0.05));
        this.btnQuarantined.setScale(Math.max(0 / (2 * this.stats.getPopulation()), 0.05)); //TODO: Change
        this.btnImmune.setScale(Math.max(this.stats.getImmune() / (2 * this.stats.getPopulation()), 0.05));
        this.btnDead.setScale(Math.max(this.stats.getDeceased() / (2 * this.stats.getPopulation()), 0.05));
    }

    private createPetriNet(): void {
        const style = {
            fontFamily: 'Times New Roman',
            fontStyle: 'bold',
            color: '#000000'
        };

        const style2 = {
            fontFamily: 'Times New Roman',
            fontSize: '15px',
            color: '#000000'
        };

        const style3 = {
            fontFamily: 'Times New Roman',
            fontSize: '12px',
            color: '#000000'
        };
        

        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.lineStyle(3, 0x000000);


        const police = new Phaser.Geom.Circle(this.x + 40, this.y + 35, 15);
        const policeLabel = this.add.text(this.x + 20, this.y + 2, 'Police', style);

        const healthy = new Phaser.Geom.Circle(this.x + 300, this.y + 35, 15);
        const healthyLabel = this.add.text(this.x + 270, this.y + 2, 'Healthy', style);

        const healthworker = new Phaser.Geom.Circle(this.x + 560, this.y + 35, 15);
        const healthworkerLabel = this.add.text(this.x + 510, this.y + 2, 'Healthworker', style);

        const infecting = new Phaser.Geom.Rectangle(this.x + 285, this.y + 103, 30, 30);
        const infectingLabel = this.add.text(infecting.x, infecting.centerY - 7, 'Infect', style3);

        const quarantining = new Phaser.Geom.Rectangle(this.x + 25, this.y + 185, 30, 30);
        const quarantiningLabel = this.add.text(quarantining.x, quarantining.y - 1, 'Quar-\nantine', style3);

        const infected = new Phaser.Geom.Circle(this.x + 300, this.y + 200, 15);
        const infectedLabel = this.add.text(this.x + 232, this.y + 171, 'Infected', style);

        const dying = new Phaser.Geom.Rectangle(this.x + 645, this.y + 185, 30, 30);
        const dyingLabel = this.add.text(dying.x + 3, dying.centerY - 7, 'Die', style2);

        const breakingFree = new Phaser.Geom.Rectangle(this.x + 155, this.y + 268, 30, 30);
        const breakingFreeLabel = this.add.text(breakingFree.x, breakingFree.y, 'Break\nFree', style3);

        const healing = new Phaser.Geom.Rectangle(this.x + 285, this.y + 268, 30, 30);
        const healingLabel = this.add.text(healing.x, healing.centerY - 7, 'Heal', style2);

        const curing = new Phaser.Geom.Rectangle(this.x + 545, this.y + 268, 30, 30);
        const curingLabel = this.add.text(curing.x, curing.centerY - 7, 'Cure', style2);

        const quarantined = new Phaser.Geom.Circle(this.x + 40, this.y + 365, 15);
        const quarantinedLabel = this.add.text(this.x + 0, this.y + 380, 'Quarantined', style);

        const gettingOut = new Phaser.Geom.Rectangle(this.x + 155, this.y + 350, 30, 30);
        const gettingOutLabel = this.add.text(gettingOut.x + 2, gettingOut.y - 1, 'Get\nOut', style2);

        const immune = new Phaser.Geom.Circle(this.x + 300, this.y + 365, 15);
        const immuneLabel = this.add.text(this.x + 270, this.y + 380, 'Immune', style);

        const dead = new Phaser.Geom.Circle(this.x + 660, this.y + 365, 15);
        const deadLabel = this.add.text(this.x + 640, this.y + 380, 'Dead', style);


        const linePoliceQuarantining = new Phaser.Geom.Line(police.x, police.bottom + 15, quarantining.centerX, quarantining.top - 15);
        const triangleQuarantining = this.drawTriangleForRectangle(quarantining, 'top');
        const trianglePolice = this.drawTriangleForCircle(police, 'bottom');

        const lineQuarantiningQuarantined = new Phaser.Geom.Line(quarantining.centerX, quarantining.bottom, quarantined.x, quarantined.top - 15);
        const triangleQuarantined = this.drawTriangleForCircle(quarantined, 'top');
        
        const lineQuarantinedGettingOut = new Phaser.Geom.Line(quarantined.right, quarantined.y, gettingOut.left - 15, gettingOut.centerY);
        const triangleGettingOut = this.drawTriangleForRectangle(gettingOut, 'left');

        const lineGettingOutImmune = new Phaser.Geom.Line(gettingOut.right, gettingOut.centerY, immune.left - 15, immune.y);
        const triangleImmune = this.drawTriangleForCircle(immune, 'left');

        const lineHealingImmune = new Phaser.Geom.Line(healing.centerX, healing.bottom, immune.x, immune.top - 15);
        const triangleImmune2 = this.drawTriangleForCircle(immune, 'top');

        const lineInfectedHealing = new Phaser.Geom.Line(infected.x, infected.bottom, healing.centerX, healing.top - 15);
        const triangleHealing = this.drawTriangleForRectangle(healing, 'top');

        const lineInfectingInfected = new Phaser.Geom.Line(infecting.centerX, infecting.bottom + 15, infected.x, infected.top - 15);
        const triangleInfected = this.drawTriangleForCircle(infected, 'top');
        const triangleInfecting = this.drawTriangleForRectangle(infecting, 'bottom');

        const lineHealthyInfecting = new Phaser.Geom.Line(healthy.x, healthy.bottom, infecting.centerX, infecting.top - 15);
        const triangleInfecting2 = this.drawTriangleForRectangle(infecting, 'top');

        const lineHealthworkerCuring = new Phaser.Geom.Line(healthworker.x, healthworker.bottom + 15, curing.centerX, curing.top - 15);
        const triangleHealthworker = this.drawTriangleForCircle(healthworker, 'bottom');
        const triangleCuring = this.drawTriangleForRectangle(curing, 'top');

        const lineInfectedDying = new Phaser.Geom.Line(infected.right, infected.y, dying.left - 15, dying.centerY);
        const triangleDying = this.drawTriangleForRectangle(dying, 'left');

        const lineDyingDead = new Phaser.Geom.Line(dying.centerX, dying.bottom, dead.x, dead.top - 15);
        const triangleDead = this.drawTriangleForCircle(dead, 'top');

        const lineCuringImmune = new Phaser.Geom.Line(curing.x, curing.bottom, immune.right + 13, immune.y - 5);
        const triangleImmune3 = new Phaser.Geom.Triangle(immune.right, immune.y, immune.right + 12, immune.y - 10, immune.right + 15, immune.y);

        const lineQuarantinedBreakingFree = new Phaser.Geom.Line(quarantined.getPoint(0.875).x, quarantined.getPoint(0.875).y, breakingFree.x - 16, breakingFree.bottom + 3);
        const triangleBreakingFree = new Phaser.Geom.Triangle(breakingFree.x - 1, breakingFree.bottom - 6, breakingFree.x - 18, breakingFree.bottom - 2, breakingFree.x - 15, breakingFree.bottom + 9);

        const lineBreakingFreeInfected = new Phaser.Geom.Line(breakingFree.right + 1, breakingFree.top + 5, infected.getPoint(0.375).x - 15, infected.getPoint(0.375).y + 9);
        const triangleInfected2 = new Phaser.Geom.Triangle(infected.getPoint(0.375).x, infected.getPoint(0.375).y, infected.getPoint(0.375).x - 17, infected.getPoint(0.375).y + 4, infected.getPoint(0.375).x - 14, infected.getPoint(0.375).y + 16);

        const lineInfectedCuring = new Phaser.Geom.Line(infected.getPoint(0.125).x + 1, infected.getPoint(0.125).y, curing.x - 14, curing.y - 4);
        const triangleCuring2 = new Phaser.Geom.Triangle(curing.x, curing.y, curing.x - 14, curing.y - 9, curing.x - 15, curing.y + 2);

        const lineInfectedQuarantining = new Phaser.Geom.Line(infected.left, infected.y, quarantining.right + 15, quarantining.centerY);
        const triangleQuarantining2 = this.drawTriangleForRectangle(quarantining, 'right');


        const rectangles: Array<Phaser.Geom.Rectangle> = [quarantining, dying, healing, curing, infecting, gettingOut, breakingFree];
        const circles: Array<Phaser.Geom.Circle> = [police, quarantined, infected, healthy, immune, healthworker, dead];
        const lines: Array<Phaser.Geom.Line> = [linePoliceQuarantining, lineQuarantiningQuarantined, lineQuarantinedGettingOut, lineGettingOutImmune, lineHealingImmune, lineInfectedHealing, lineInfectingInfected, lineHealthyInfecting, lineHealthworkerCuring, lineInfectedDying, lineDyingDead, lineCuringImmune, lineQuarantinedBreakingFree, lineBreakingFreeInfected, lineInfectedCuring, lineInfectedQuarantining];
        const triangles: Array<Phaser.Geom.Triangle> = [triangleQuarantining, trianglePolice, triangleQuarantined, triangleGettingOut, triangleImmune, triangleImmune2, triangleHealing, triangleInfected, triangleInfecting, triangleInfecting2, triangleCuring, triangleDying, triangleDead, triangleImmune3, triangleBreakingFree, triangleInfected2, triangleCuring2, triangleQuarantining2, triangleHealthworker];

        rectangles.forEach(rectangle => {
            this.graphics.strokeRectShape(rectangle);
            this.graphics.fillRectShape(rectangle);
        });

        circles.forEach(circle => {
            this.graphics.strokeCircleShape(circle);
            this.graphics.fillCircleShape(circle);
        });

        lines.forEach(line => {
            this.graphics.strokeLineShape(line);
        });

        triangles.forEach(triangle => {
            this.graphics.fillStyle(0x000000);
            this.graphics.fillTriangleShape(triangle);
        });

        this.numberOfPolice = this.add.text(police.right + 10, police.y - 6, Stats.formatLargerNumber(this.stats.getNumberOfPolice()), {color: '#0000FF'}).setVisible(false);
        this.numberOfHealthy = this.add.text(healthy.right + 10, healthy.y - 6, Stats.formatLargerNumber(this.stats.getHealthy()), {color: '#008000'}).setVisible(false);
        this.numberOfHealthworker = this.add.text(healthworker.right + 10, healthworker.y - 6, Stats.formatLargerNumber(this.stats.getNumberOfHealthWorkers()), {fill: '#00FFFF'}).setVisible(false);
        this.numberOfInfected = this.add.text(infected.right, infected.y - 27, Stats.formatLargerNumber(this.stats.getInfected()), {color: '#FF0000'}).setVisible(false);
        this.numberOfQuarantined = this.add.text(quarantined.right + 10, quarantined.y - 18, '0', {color: '#800080'}).setVisible(false); // TODO: Change
        this.numberOfImmune = this.add.text(immune.right + 30, immune.y - 6, Stats.formatLargerNumber(this.stats.getImmune()), {color: '#00FF00'}).setVisible(false);
        this.numberOfDead = this.add.text(dead.left - 70, dead.y - 6, Stats.formatLargerNumber(this.stats.getDeceased()), {color: '#000000'}).setVisible(false);

        this.btnPolice = this.add.sprite(police.x, police.y, 'blueDot');
        this.btnHealthy = this.add.sprite(healthy.x, healthy.y, 'greenDot');
        this.btnHealthworker = this.add.sprite(healthworker.x, healthworker.y, 'cyanDot');
        this.btnInfected = this.add.sprite(infected.x, infected.y, 'redDot');
        this.btnQuarantined = this.add.sprite(quarantined.x, quarantined.y, 'purpleDot');
        this.btnImmune = this.add.sprite(immune.x, immune.y, 'limeDot');
        this.btnDead = this.add.sprite(dead.x, dead.y, 'blackDot');

        const buttons: Array<Phaser.GameObjects.Sprite> = [this.btnPolice, this.btnHealthy, this.btnHealthworker, this.btnInfected, this.btnQuarantined, this.btnImmune, this.btnDead];

        buttons.forEach(button => {
            button.setScale(0.05);
            button.setInteractive();

            button.on('pointerover', () => {
                button.setAlpha(0.5);
            });

            button.on('pointerout', () => {
                button.setAlpha(1);
            });
        });

        this.btnPolice.setScale(Math.max(this.stats.getNumberOfPolice() / (2 * this.stats.getPopulation()), 0.05));
        this.btnHealthy.setScale(Math.max(this.stats.getHealthy() / (2 * this.stats.getPopulation()), 0.05));
        this.btnHealthworker.setScale(Math.max(this.stats.getNumberOfHealthWorkers() / (2 * this.stats.getPopulation()), 0.05));
        this.btnInfected.setScale(Math.max(this.stats.getInfected() / (2 * this.stats.getPopulation()), 0.05));
        this.btnQuarantined.setScale(Math.max(0 / (2 * this.stats.getPopulation()), 0.05)); //TODO: Change
        this.btnImmune.setScale(Math.max(this.stats.getImmune() / (2 * this.stats.getPopulation()), 0.05));
        this.btnDead.setScale(Math.max(this.stats.getDeceased() / (2 * this.stats.getPopulation()), 0.05));

        this.btnPolice.on('pointerover', () => {this.numberOfPolice.setVisible(true);});
        this.btnPolice.on('pointerout', () => {this.numberOfPolice.setVisible(false);});
        this.btnHealthy.on('pointerover', () => {this.numberOfHealthy.setVisible(true);});
        this.btnHealthy.on('pointerout', () => {this.numberOfHealthy.setVisible(false);});
        this.btnHealthworker.on('pointerover', () => {this.numberOfHealthworker.setVisible(true);});
        this.btnHealthworker.on('pointerout', () => {this.numberOfHealthworker.setVisible(false);});
        this.btnInfected.on('pointerover', () => {this.numberOfInfected.setVisible(true);});
        this.btnInfected.on('pointerout', () => {this.numberOfInfected.setVisible(false);});
        this.btnQuarantined.on('pointerover', () => {this.numberOfQuarantined.setVisible(true);});
        this.btnQuarantined.on('pointerout', () => {this.numberOfQuarantined.setVisible(false);});
        this.btnImmune.on('pointerover', () => {this.numberOfImmune.setVisible(true);});
        this.btnImmune.on('pointerout', () => {this.numberOfImmune.setVisible(false);});
        this.btnDead.on('pointerover', () => {this.numberOfDead.setVisible(true);});
        this.btnDead.on('pointerout', () => {this.numberOfDead.setVisible(false);});
    }


    private drawTriangleForCircle(object: any, orientation: string): Phaser.Geom.Triangle {
        let triangle: Phaser.Geom.Triangle;
        switch(orientation) {
            case 'top':
                triangle = new Phaser.Geom.Triangle(object.x, object.top, object.x - 5, object.top - 15, object.x + 5, object.top - 15);
                break;
            case 'right':
                triangle = new Phaser.Geom.Triangle(object.right, object.y, object.right + 15, object.y - 5, object.right + 15, object.y + 5);
                break;
            case 'bottom':
                triangle = new Phaser.Geom.Triangle(object.x, object.bottom, object.x - 5, object.bottom + 15, object.x + 5, object.bottom + 15);
                break;
            case 'left':
                triangle = new Phaser.Geom.Triangle(object.left, object.y, object.left - 15, object.y - 5, object.left - 15, object.y + 5);
                break;
        }
        return triangle;
    }

    private drawTriangleForRectangle(object: any, orientation: string): Phaser.Geom.Triangle {
        let triangle: Phaser.Geom.Triangle;
        switch(orientation) {
            case 'top':
                triangle = new Phaser.Geom.Triangle(object.centerX, object.top, object.centerX - 5, object.top - 15, object.centerX + 5, object.top - 15);
                break;
            case 'right':
                triangle = new Phaser.Geom.Triangle(object.right, object.centerY, object.right + 15, object.centerY - 5, object.right + 15, object.centerY + 5);
                break;
            case 'bottom':
                triangle = new Phaser.Geom.Triangle(object.centerX, object.bottom, object.centerX - 5, object.bottom + 15, object.centerX + 5, object.bottom + 15);
                break;
            case 'left':
                triangle = new Phaser.Geom.Triangle(object.left, object.centerY, object.left - 15, object.centerY - 5, object.left - 15, object.centerY + 5);
                 break;
        }
        return triangle;
    }

    /** @see TimeSubscriber */
    public notify(): void {
        this.updatePetriNet();
    }
}