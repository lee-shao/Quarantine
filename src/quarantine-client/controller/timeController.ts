import 'phaser';
import { TimeSubscriber } from '../models/util/timeSubscriber';

/**
 * Singleton controller which simulates ingame time. It acts as the central 
 * coordinator of the all time related logic and is a publisher (Pub/Sub) for
 * Phaser.GameObjects who want to get notfied about time changes.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class TimeController {

    /** Tics per day */
    private ticsPerDay = 24;

    /** Phaser tics since the last ingame day */
    private ticAccumulator = 0;

    /** Past ingame hours during ten phaser tics */
    private hoursPerTenTics = 1;

    /** Hours passed since game start */
    private hoursSinceGameStart = 0;

    /** Last day played */
    private lastDayPlayed = 0;

    /** All registered subscribers of this publisher (Pub/Sub) */
    private subscribers = [];

    /** The only existing instance of TimeController */
    private static instance: TimeController;

    private constructor() {
        // needed to allow singleton properties
    }

    /**
     * Gets called with every phaser3 tic and counts ingame hours since game start.
     * Calls the notify function on all subscribers of this controller when a whole
     * day has passed.
     * @see TimeSubscriber
     */
    public tic(): void {
        this.ticAccumulator += 1;
        if (this.ticAccumulator % 10 == 0) this.hoursSinceGameStart += this.hoursPerTenTics;
        if (this.ticAccumulator >= this.ticsPerDay * 10) { //>= if player wants to speed up the game and ticAccumulator would be greater than (updated this.ticsPerDay)*10
            this.ticAccumulator = 0.0;
            this.subscribers.forEach(s => s.notify());
        }
    }

    /**Changes tics per day to the given value. This way it affects the game speed. 
     * @param ticsPerDay New number of tics per day
     */
    private changeGameSpeed(ticsPerDay: number): void {
        this.ticsPerDay = ticsPerDay; 
        this.hoursPerTenTics = 24 / this.ticsPerDay;
    }

    /**
     * Changes the speed mode of the game. Currently, there are three different speed modes available.
     * @param speedMode - 0 = normal speed,  
     *                   -1 = half speed,  
     *                  1.5 = 1.5x speed,  
     *                    2 = doubled speed
     */
    public setGameSpeed(speedMode = 0): void {
        if(speedMode == -1) this.changeGameSpeed(48); //slow down
        else if (speedMode == 1) this.changeGameSpeed(18) //speed up x1.5
        else if(speedMode == 2) this.changeGameSpeed(12); //speed up x2
        else this.changeGameSpeed(24);
    }

    /**
     * Subscribe to the TimeController (Pub/Sub) to get notified about changes in time.
     * @param subscriber Expects a Phaser.GameObject if this object wants to be notfied about time changes
     */
    public subscribe(subscriber: TimeSubscriber): TimeController {
        this.subscribers.push(subscriber);
        return this;
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** 
     * Returns the only existing singleton instance of this controller
     * @returns The singleton instance
     */
    public static getInstance(): TimeController {
        if (!TimeController.instance) TimeController.instance = new TimeController();
        return TimeController.instance;
    }

    /** @returns Tics per day */
    public getTicsPerDay(): number {return this.ticsPerDay;}

    /** @returns Hous passed since game start */
    public getHoursSinceGameStart(): number {return Math.floor(this.hoursSinceGameStart);} //return Math.floor(this.hoursSinceGameStart)

    /** @returns Days passed since game start */
    public getDaysSinceGameStart(): number {return Math.floor(this.hoursSinceGameStart / 24);}

    /** @returns Weeks passed since game start */
    public getWeeksSinceGameStart(): number {return Math.floor(this.getDaysSinceGameStart() / 7);}
}