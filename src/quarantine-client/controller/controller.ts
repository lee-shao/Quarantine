import { Agent } from '../models/agents/agent';
import { Police } from '../models/agents/police';
import { Citizen } from '../models/agents/citizen';
import { Role} from '../models/util/enums/roles';
import { State } from '../models/util/enums/healthStates';
import { Rule } from './entities/rule';
import { HealthWorker } from '../models/agents/healthWorker';
import { TimeSubscriber } from '../models/util/timeSubscriber';
import { TimeController } from './timeController';
import { Stats } from './stats';
import { UpgradeController } from './upgradeController';
import { GuiScene } from '../views/scenes/gui-scene';
import { PopupWindow } from '../views/popupWindow';

/**
 * Singleton controller which should only simulates the population protocol.
 * This is achieved by finding defined transition rules of the protocol and applying
 * them to randomly selected agents.
 * It acts as the central coordinator of the application logic.
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class Controller implements TimeSubscriber {
    /** Singleton instance which holds game variables */
    private stats: Stats;
    /** The only existing instance of Controller */
    private static instance: Controller;
 
    /** All population protocol agents of the game */
    private agents: Agent[] = [];
    /** All transition rule currently defined in the population protocol */
    private rules: Rule[] = [];

    private constructor() {
        this.stats = Stats.getInstance();

        this.initiateRules();
        this.initiatePopulation();

        TimeController.getInstance().subscribe(this);

        this.distributeRandomlyInfected(1_000);
        this.stats.unknowinglyInfected = 1_000;
    }

    /** Initiate basic transition rules at gamestart. */
    private initiateRules(): void {
        this.rules = [
            new Rule(State.HEALTHY, State.INFECTED, State.UNKNOWINGLY_INFECTED, State.INFECTED),
            new Rule(State.HEALTHY, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED, State.UNKNOWINGLY_INFECTED, () => {
                Stats.getInstance().addUnknowinglyInfected();
                return true;
            }),
            new Rule(State.INFECTED, State.INFECTED, State.INFECTED, State.DECEASED, () => {
                Stats.getInstance().deceasedCitizen();
                return true;
            }),
            new Rule(State.TEST_KIT, State.UNKNOWINGLY_INFECTED, State.TEST_KIT, State.INFECTED, () => {
                if (UpgradeController.getInstance().isSolvent(this.stats.currentPriceTestKit)) {
                    const stats = Stats.getInstance();
                    stats.foundInfected();
                    stats.testKitUsed();
                    stats.firstCaseFound = true;
                    return true;
                } else return false;
            })
        ];
    }

    /**
     * On game start initiate a population which consists of citizens and some
     * police officers. The police officers are randomly distributed inside
     * the underlying array.
     */
    private initiatePopulation(): void {
        let remainingPolice = this.stats.getNumberOfPolice();
        let remainingHW = this.stats.getNumberOfHealthWorkers();
        this.agents = new Array(this.stats.getNumberOfAgents());
        
        for (let i = 0; i < this.stats.getNumberOfAgents(); i++) {
            if (remainingPolice > 0
                && (Math.random() > (this.stats.getNumberOfPolice() / this.stats.getNumberOfAgents()) // random generation of agents OR
                    || remainingPolice === this.stats.getNumberOfAgents() - i)) { // remaining number of agents has to be filled by police officers
                this.agents[i] = new Police(State.HEALTHY);
                remainingPolice--;
            } else if (remainingHW > 0
                && (Math.random() > (this.stats.getNumberOfHealthWorkers() / this.stats.getNumberOfAgents())
                || remainingHW === this.stats.getNumberOfAgents() - i)) {
                this.agents[i] = new HealthWorker(State.TEST_KIT);
                remainingHW--;
            } else {
                this.agents[i] = new Citizen(State.HEALTHY);
            }
        }
    }

    /**
     * Randomly assigns agents as 'UNKNOWINGLY_INFECTED'
     * @param amt Amount of agents to change the state
     */
    private distributeRandomlyInfected(amt: number): void {
        let i = 0;
        while (i < amt) {
            const idx = this.getRandomIndex();
            if (this.agents[idx].getHealthState() == State.HEALTHY) {
                this.agents[idx].setHealthState(State.UNKNOWINGLY_INFECTED);
                i++;
            }
        }
    }

    /**
     * Changes the role of the specified number of agents. The agents are chosen randomly.
     * Shouldn't be used with the rule CITIZEN.
     * @param amt Amount of new workers
     * @param role role to be distributed among the agents
     * @reurns If enough agents can be assigned that role
     */
    public distributeNewRoles(amt: number, role: Role, testKit = false): boolean {
        // There should be enough people left to be assigned the specific role
        if (this.stats.getPopulation() - this.stats.getNumberOfHealthWorkers() - this.stats.getNumberOfPolice() < amt) {
            amt = this.stats.getPopulation() - this.stats.getNumberOfHealthWorkers() - this.stats.getNumberOfPolice();
        }

        let i = 0;
        /** 
         * Changes agents of the agents array to become health workers if they are not already health
         * workers or police officers.
         */
        switch (role) {
            case Role.HEALTH_WORKER: {
                while (i < amt) {
                    const idx = this.getRandomIndex();
                    if((this.agents[idx] instanceof HealthWorker) ||
                        (this.agents[idx] instanceof Police)) continue;

                    if (testKit) this.agents[idx] = new HealthWorker(State.TEST_KIT);
                    else this.agents[idx] = new HealthWorker(State.CURE);
                    this.stats.increaseHealthWorkers(1);
                    i++;
                }
                break;
            }
            case Role.POLICE: {
                while (i < amt) {
                    const idx = this.getRandomIndex();
                    if((this.agents[idx] instanceof HealthWorker) ||
                        (this.agents[idx] instanceof Police)) continue;

                    const tmp = this.agents[idx].getHealthState(); // infected agents can become police officers
                    this.agents[idx] = new Police(tmp);
                    this.stats.increasePoliceOfficers(1);
                    i++;
                }
                break;
            }
            default: {
                console.log("[WARNING] distributeNewRoles in controller.ts wasn't invoked with police or health worker role.");
                break;
            }
        }
        return true;
    }

    /** Adds a specific amount of new citizens into the population array */
    public addNewPopulation(amt: number): void {
        for (let i = 0; i < amt; i++) this.agents.splice(this.getRandomIndex(), 0, new Citizen(State.HEALTHY));
        this.stats.increasePopulation(amt);
    }

    /** Returns a random integer value between 0 and the current population number. */
    private getRandomIndex(): number {return Math.floor(Math.random() * this.stats.getNumberOfAgents());}

    /** @returns Partially randomized interaction rate. */
    private calculateInteractionRate(): number {
        const sign = (Math.random() > 0.5) ? 1 : -1;
        return this.stats.basicInteractionRate + sign * this.stats.maxInteractionVariance;
    }

    /**
     * Simulates the interaction of two agents by searching for an existing transition rule
     * of the population protocol. If there is no rule, no interaction of the agents takes
     * place.
     * @param agent1 
     * @param agent2 
     */
    private findRuleAndApply(agent1: Agent, agent2: Agent): void {
        this.rules.forEach(r => {
            if (r.inputState1 == agent1.getHealthState() && r.inputState2 == agent2.getHealthState()) {
                if (r.calculationRule()) {
                    agent1.setHealthState(r.outputState1);
                    agent2.setHealthState(r.outputState2);
                }
            } else if (r.inputState1 == agent2.getHealthState() && r.inputState2 == agent1.getHealthState()) {
                if (r.calculationRule()) {
                    agent1.setHealthState(r.outputState2);
                    agent2.setHealthState(r.outputState1);
                }
            }
        });
    }

    /**
     * Checks wether some win or loss condition is matched. Opens a
     * popup message if this is the case.
     */
    private checkWinLoss(): void {
        if (this.stats.infected == 0 && this.stats.firstCaseFound) { // false WIN
            this.openWinLossWindow(
                "Congratulations!",
                "There are no active cases left! Let's hope you got all of it, who knows what goes unnoticed..."
            );
        } else if (this.stats.unknowinglyInfected == 0 && this.stats.infected == 0) { // true WIN
            this.openWinLossWindow(
                "Congratulations!",
                "You eradicated the virus! Your thoroughness really saved this country from disaster."
            );
        } else if (this.stats.getPopulation() - this.stats.getNumberOfHealthWorkers() == 0) { // LOOSE
            this.openWinLossWindow(
                "Loss!",
                "As the last survivors fade away, it is time to face it. This is the end."
            );
        } else if (this.stats.budget < this.stats.lowerBoundBankruptcy) { // LOOSE - bancruptcy
            this.openWinLossWindow(
                "You are Bankrupt!",
                "You have no money left."
            );
        }
    }

    /**
     * Opens a new popup to show a message which announces the loss.
     * @param title Title of the popup window
     * @param description The loosing message
     */
    public openWinLossWindow(title: string, description: string): void {
        const popup = new PopupWindow(GuiScene.instance, 0, 0, 'event-note', 1600, 80, true, [], true);
        const closeGameBtn = new Phaser.GameObjects.Image(GuiScene.instance, 1920 / 2, 800, 'NewGame').setOrigin(0).setDepth(1);
        closeGameBtn.setX(1920 / 2 - closeGameBtn.width / 2);
        closeGameBtn.setInteractive();
        
        closeGameBtn.on("pointerup", () => {location.reload();});

        // hover effect
        closeGameBtn.on("pointerover", () => {closeGameBtn.scale = 1.1});
        closeGameBtn.on("pointedown", () => {closeGameBtn.scale = 1});

        const styleDesc = {
            color: 'Black',
            fontSize: '55px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };
        const styleTitle = {
            color: 'Black',
            align: 'center',
            fontSize: '80px',
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        };

        const ppTitle = new Phaser.GameObjects.Text(GuiScene.instance, 0, 90, title, styleTitle);
        ppTitle.setWordWrapWidth(1400);
        ppTitle.setX((1920 / 2) - ppTitle.width / 2);
        const ppDescription = new Phaser.GameObjects.Text(GuiScene.instance, 300, 350, description, styleDesc);
        ppDescription.setWordWrapWidth(1400);
        popup.addGameObjects([closeGameBtn, ppTitle, ppDescription]);
        popup.createModal();
    }

    /** Implements the game logic. Select random pairs of agents to apply transition rules. */
    public update(): void {
        // number of interactions between agent pairs in the current tic
        const selections = Math.floor(this.calculateInteractionRate() * this.stats.getNumberOfAgents());
        
        let idxAgent1: number;
        let idxAgent2: number;
        // Generate two different random indexes for two agents of the agent array and call the method findRuleAndApply.
        for (let i = 0; i < selections; i++) {
            idxAgent1 = this.getRandomIndex();
            // Calculate new index until both indexes are different
            do {
                idxAgent2 = this.getRandomIndex();
            } while (idxAgent2 == idxAgent1)
            this.findRuleAndApply(this.agents[idxAgent1], this.agents[idxAgent2]);

            // Remove deceased agents from the agents array
            if (this.agents[idxAgent1].getHealthState() == State.DECEASED) {
                this.agents.splice(idxAgent1, 1);
            } else if (this.agents[idxAgent2].getHealthState() == State.DECEASED) {
                this.agents.splice(idxAgent2, 1);
            }
        }
        this.checkWinLoss();
    }

    /** @see TimeSubscriber */
    public notify(): void {this.update();}

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): Controller {
        if (!Controller.instance) Controller.instance = new Controller();
        return Controller.instance;
    }

    /** @returns Array of active rules */
    public getRules(): Rule[] {return this.rules;}

    // ------------------------------------------------------------------ SETTER-METHODS
    // ...

}