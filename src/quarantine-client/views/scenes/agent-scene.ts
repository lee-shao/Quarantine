import { VisualAgent } from "../../models/agents/visualAgent";
import { Citizen } from "../../models/agents/citizen";
import { Police } from "../../models/agents/police";
import { State } from "../../models/util/enums/healthStates";

/**
 * Scene to visualize the agents behaviour in the populations protocol.
 * Scene should appear and disappear by clicking on a tile of the map. (Suggestion)
 * @author Shao
 */
export class AgentScene extends Phaser.Scene {
    /** group of agents with same behaviour */
    private agents: Phaser.GameObjects.Group;
    /** group of police officers with slightly different behaviour than other generic agents */
    private police: Phaser.GameObjects.Group;

    constructor() {
        super({
            key: 'AgentScene',
            active: false      // Change to true to take a look
        });
    }

    preload(): void {
        /**
         * Preload spritesheets
         */
        /** Spritesheet of citizen. (white) */
        this.load.spritesheet('citizen', 'assets/sprites/agent_w.png', { frameWidth: 64, frameHeight: 64 });
        /** Spritesheet of police officer. (green) */
        this.load.spritesheet('police', 'assets/sprites/agent_g.png', { frameWidth: 64, frameHeight: 64 });
        /** Spritesheet of infected citizen. (red) */
        this.load.spritesheet('infected', 'assets/sprites/agent_r.png', { frameWidth: 64, frameHeight: 64 });
    }

    init(): void {
        console.log('Init');
    }

    create(): void {
        /** adding agents to group */
        this.agents = this.add.group();
        this.police = this.add.group();
        
        /** Sets the bounds of the area where agents should interact in */
        this.physics.world.setBounds(432, 182, 933, 637);       // Change bounds later when layout is clear.
        
        /** adding collision */
        this.addCollision();
        /** adding animations */
        this.addAnimations();

        /**
         * Manually spawning with fixed number is just for test cases.
         * Later it should be replaced by spawning depending on other variables.
         */
        /** spawn citizen */
        this.spawnCitizen();
        /** spawn police officers */
        this.spawnPolice();
        /** spawn infected citizen */
        this.spawnInfectedCitizen();

        console.log('Create');
    }

    update(): void {
        /** call update() function of all children of the agent group */
        this.agents.children.each(a => a.update());
        /** call the update() function of all children of the police officers group */
        this.police.children.each(a => a.update());

        console.log('Update');
    }

    spawnCitizen(): void {
        for (let i = 0; i < 100; i++) {
            /** Spawns a citizen as VisualAgent at random position, with the role 'citizen' and the state 'healthy' */
            const citizen = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Citizen(State.HEALTHY), 'citizen');
            citizen.setSize(38, 38);        // Set the size of the hitbox
            citizen.setOffset(16, 16);      // Sets the center of the hitbox
            citizen.body.isCircle = true;   // Sets the hitbox from rectangle to circle
            this.agents.add(citizen);
        }
    }

    spawnPolice(): void {
        for (let i = 0; i < 1; i++) {
            /** Spawns a police officer as VisualAgent at random position, with the role 'police' and the state 'healthy' */
            const police = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Police(State.HEALTHY), 'police');
            police.setSize(38, 38);         // Set the size of the hitbox
            police.setOffset(16, 16);       // Sets the center of the hitbox
            police.body.isCircle = true;    // Sets the hitbox from rectangle to circle
            this.police.add(police);
        }
    }

    spawnInfectedCitizen(): void {
        for (let i = 0; i < 1; i++) {
            /** Spawns a citizen as VisualAgent at random position, with the role 'citizen' and state 'infected' */
            const infected = new VisualAgent(this, Phaser.Math.Between(430, 1365), Phaser.Math.Between(180, 820), new Citizen(State.INFECTED), 'infected');
            infected.setSize(38, 38);       // Set the size of the hitbox
            infected.setOffset(16, 16);     // Sets the center of the hitbox
            infected.body.isCircle = true;  // Sets the hitbox from rectangle to circle
            this.agents.add(infected);
        }
    }

    addCollision(): void {
        /** Adds collider between two agents */
        this.physics.add.collider(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.setCollided();
            a1.changeDirectionOnCollide();      // Calls the method to change direction when collide
            a1.meet(a2);
        });
        /** Adds collider between two police officers */
        this.physics.add.collider(this.police, this.police, (p: VisualAgent) => {
            p.setCollided();
            p.changeDirectionOnCollide();
        });
        /** Adds collider between police officer and agent */
        this.physics.add.collider(this.agents, this.police, (a: VisualAgent, p: VisualAgent) => {
            a.setCollided();
            p.setCollided();
            a.changeDirectionOnCollide();
            p.changeDirectionOnCollide();
            a.meet(p);
            p.meet(a);
        });

        /** 
         * Calls the method to correct the position when overlap.
         */
        this.physics.add.overlap(this.agents, this.agents, (a1: VisualAgent, a2: VisualAgent) => {
            a1.correctPositionWhenOverlap(a2.x, a2.y);
        })
        this.physics.add.overlap(this.police, this.police, (p1: VisualAgent, p2: VisualAgent) => {
            p1.correctPositionWhenOverlap(p2.x, p2.y);
        })
        this.physics.add.overlap(this.agents, this.police, (a: VisualAgent, p: VisualAgent) => {
            a.correctPositionWhenOverlap(p.x, p.y);
            p.correctPositionWhenOverlap(a.x, a.y);
        })
    }

    /**
     * Adding running animations
     */
    addAnimations(): void {
        /** Running animation of generic citizen. (white) */
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('citizen', { start: 0, end: 8 })
        });
        /** Running animation of infected citizen. (red) */
        this.anims.create({
            key: 'infectedWalk',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('infected', { start: 0, end: 8 })
        });
        /** Running animation of police officer. (green) */
        this.anims.create({
            key: 'patrol',
            repeat: -1,
            frameRate: 12,
            frames: this.anims.generateFrameNames('police', { start: 0, end: 8 })
        });
    }
}