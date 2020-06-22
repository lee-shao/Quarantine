import { State } from "../../models/util/enums/healthStates";

/**
 * Represents a transition rule of the population protocol.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Rule {
    public readonly inputState1: State;
    public readonly inputState2: State;
    public readonly outputState1: State;
    public readonly outputState2: State;

    /**
     * Should encapsulate game logic which is triggered by the application of this rule.  
     * E.g. increment the death counter by one if the transition rule triggered the death
     * (removal) of a citizen.
     * @returns weather the operation was successful
     */
    public calculationRule: () => boolean;

    constructor(inputState1, inputState2, outputState1, outputState2, calculationRule = function(): boolean {return true;}) {
        this.inputState1 = inputState1;
        this.inputState2  = inputState2;
        this.outputState1 = outputState1;
        this.outputState2 = outputState2;
        this.calculationRule = calculationRule;
    }
}