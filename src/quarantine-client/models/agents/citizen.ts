import { Agent } from "./agent";
import { Role } from "../util/enums/roles";
import { State } from "../util/enums/healthStates";

/**
 * Generic citizen.
 * By default healthy. Can be infected by other citizen.
 * Subclass of agent.
 * @author Shao
 */
export class Citizen extends Agent {
    
    /**
     * Citizens have the role CITIZEN automatically.
     * @param state State of the new citizen
     */
    public constructor(state: State) {
        super(Role.CITIZEN, state);
    }

    public update(): void {
        super.update();
    }

}