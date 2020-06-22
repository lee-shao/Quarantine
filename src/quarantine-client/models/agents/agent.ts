import 'phaser';
import { Role } from '../util/enums/roles';
import { State } from '../util/enums/healthStates';

/**
 * Entity class agent divided into other subclasses (e.g. police, citizen, etc.).
 * All agents works as identically programmed finite state machines
 * to simulate the population protocol in the controller class.
 * @author Shao
 */
export abstract class Agent {
    // ------------------------------------------------ GAME VARIABLES
    /** Determine the current status of the agent */
    protected quarantined: boolean;
    /** Determine the behaviour of the agent */
    protected socialDistancing: boolean;
    /** Role of the agent */
    protected role: Role;
    /** Health state of the Agent*/
    protected healthState: State; 
    /** Eventually giving the progress of the transition as integer representing a healthstate*/
    protected token: integer;
    // ------------------------------------------------ GAME VARIABLES

    /**
     * Constructor of the agent.
     * Call the constructor from a subclass (e.g. police).
     * @param role assign a role to the agent
     * @param state assign a health state to the agent
     */
    protected constructor(role: Role, state: State) {
        this.quarantined = false;   // should be false at beginning. Can be changed by purchasing Upgrades.
        this.socialDistancing = false;  //should be false at beginning. Can be changed by purchasing Upgrades.
        this.role = role;
        this.healthState = state;
        this.token = 0;
    }

    public update(): void {
        console.log('Update');
    }
    

    // ------------------------------------------------ GETTER-METHODS
    /** @returns whether the agent ist quaratined or not */
    public isQuarantined(): boolean {
        return this.quarantined;
    }

    /** @returns whether social distancing is active or not */
    public isSocialDistancingActive(): boolean {
        return this.socialDistancing;
    }

    /** @returns the current health state of the agent */
    public getHealthState(): State {
        return this.healthState;
    }

    /** @returns the role of the agent */
    public getRole(): Role {
        return this.role;
    }

    // ------------------------------------------------ SETTER-METHODS
    /** Set quarantine to true */
    public quarantine(): void {
        this.quarantined = true;
    }

    /** Set quarantine to false */
    public leaveQuarantine(): void {
        this.quarantined = false;
    }

    /** Set social distancing to true */
    public activateSocialDistancing(): void {
        this.socialDistancing = true;
    }

    /** Set social distancing to false */
    public deactivateSocialDistancing(): void {
        this.socialDistancing = false;
    }

    /**
     * Set new health state
     * @param newState assign new health state
     */
    public setHealthState(newState: State): void {
        this.healthState = newState;
    }

    /**
     * Set new role
     * @param newRole assign new role
     */
    public setRole(newRole: Role): void {
        this.role = newRole;
    }
}

