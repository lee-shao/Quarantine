import { Agent } from "./agent";
import { Role } from "../util/enums/roles";
import { State } from "../util/enums/healthStates";

/**
 * Moving agent entities as VisualAgents.
 * Working as a visual interpretation of the agents
 * to show movement and collsion
 * to furthermore elucidate the spread of the virus.
 * @author Shao
 */
export class VisualAgent extends Phaser.Physics.Arcade.Sprite {
    // ------------------------------------------------ GAME VARIABLES 
    /** The role of the agent */
    public role: Role;
    /** The health state of the agent */
    public healthState: State;
    /** Decides which action the agent do next */
    public action = Phaser.Math.Between(0, 1);
    /** Defines the movement-speed of the agent */
    public velocity = Phaser.Math.RND.realInRange(0.5, 1);
    /** Defines in which direction the body is pointing to */
    public degree = Phaser. Math.Between(0, 360);
    /** The gradient as 2 dimensional vector to determine in which direction of the body is moving to */
    public gradient = new Phaser.Math.Vector2(); 
    /** Sets the duration of the current action */
    public counter = 200;
    /** Indicator whether the agent has collided with someone or not */
    public collided: boolean;
    /** Defines the turn rate of the agent */
    public turnRate: number;

    /**
     * The constructor generates a visual agent at position(x, y)
     * and inherits the role and health state from the param agent
     * which will simulate certain behavior visually.
     * 
     * @param scene the Phaser.Scene where the visual agent belongs to
     * @param x the x position of the visual agent
     * @param y the y position of the visual agent
     * @param agent call the constructor of a subclass of the agent
     * @param texture texture (or color) of the visual agent
     */
    public constructor(scene: Phaser.Scene, x: number, y: number, agent: Agent, texture: string) {
        super(scene, x, y, texture);

        this.role = agent.getRole();
        this.healthState = agent.getHealthState();
        this.setDisplaySize(32, 32);    // original size is 64x64.
        this.randomWalk();

        this.collided = false;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        //this.setImmovable(true);
        this.setCollideWorldBounds(true);
    }

    /**
     * Updates the frames and position of visual agent.
     * Counting down and do certain behaviours when conditions met.
     */
    public update(): void {
        // ------------------------------------------------ RUNNING-ANIMATIONS
        /** Sets the skin and animation of police and citizen */
        if(this.role == 'POLICE') {
            this.anims.play('patrol', true);
        }
        if(this.role == 'CITIZEN' && this.healthState == State.HEALTHY) {
            this.anims.play('walk', true);
        }
        if(this.role == 'CITIZEN' && this.healthState == State.INFECTED) {
            this.anims.play('infectedWalk', true);
        }

        /** certain behaviours */
        if(this.counter <= 0 && this.action == 0) {       //:TODO add more movements and behaviors
            this.randomWalk();
        }

        this.randomTurn();
        /** Moving the body to the direction it is facing to */
        this.x += this.velocity * this.gradient.x;
        this.y += this.velocity * this.gradient.y;

        this.collided = false;
        this.counter--;
    }

    /**
     * Implements the behaviour and events happening when the agents collide.
     * Simulates the spreading of the virus.
     * @param agent 
     */
    public meet(agent: VisualAgent): void {
        /** healthy agent meets infected agent */
        if(this.healthState == State.INFECTED) {
            if(agent.healthState == State.HEALTHY) {
                agent.healthState = State.INFECTED;
            }
        }
        /** police meets infected agent */
        if(this.role == 'POLICE') {
            // TODO: infected agent should get quarantined
            if(agent.healthState == State.INFECTED) {
                agent.x = 435;
                agent.y = 200;
                agent.velocity = 0;
                agent.counter = 10000;
            }
        }
    }

    /**
     * Implements random walking behaviour
     */
    public randomWalk(): void {
        this.action = Phaser.Math.Between(0, 1);
        this.velocity = Phaser.Math.RND.realInRange(0.5, 1);
        this.degree = Phaser.Math.Between(0, 360);
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.counter = Phaser.Math.Between(200, 300);
        this.turnRate = Phaser.Math.RND.realInRange(-0.4, 0.4);
        this.angle = this.degree + 90;
    }

    /**
     * Change the direction when agents collide with each other
     * TODO: change direction when agent hits the wall
     */
    public changeDirectionOnCollide(): void {
        if(this.collided == true) {
            this.degree += 180;
            this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
            this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
            this.turnRate = Phaser.Math.RND.realInRange(-0.4, 0.4);
            this.angle = this.degree + 90;
        }
    }

    /**
     * Implements random turn behaviour
     */
    public randomTurn(): void {
        this.degree += this.turnRate;
        this.gradient.x = Phaser.Math.RoundTo(Math.cos(Phaser.Math.DegToRad(this.degree)), -4);
        this.gradient.y = Phaser.Math.RoundTo(Math.sin(Phaser.Math.DegToRad(this.degree)), -4);
        this.angle += this.turnRate;
    }

    /**
     * Moves the agent further away from the other overlapping agent.
     * This function gets called from both agents.
     * @param otherAgentX The x-coordinate of the overlapping agent
     * @param otherAgentY The y-coordinate of the overlapping agent
     */
    public correctPositionWhenOverlap(otherAgentX: number, otherAgentY: number): void {
        this.x += (this.x - otherAgentX)/20;
        this.y += (this.y - otherAgentY)/20;
    }

    // ------------------------------------------------ GETTER-METHODS
    /** @returns whether the agents have collided or not */
    public isCollided(): boolean {
        return this.collided;
    }

    // ------------------------------------------------ SETTER-METHODS
    /** Set agent to collided */
    public setCollided(): void {
        this.collided = true;
    }

    /** Set agent to not collided */
    public setNotCollided(): void {
        this.collided = false;
    }

}