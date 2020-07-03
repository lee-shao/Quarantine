import { TimeSubscriber } from "../models/util/timeSubscriber";
import { TimeController } from "./timeController";
import { EventRarity } from "../models/util/enums/eventRarity";
import { Event } from "./entities/event";
import { Stats } from "./stats";
import { UpgradeController } from "./gui-controller/upgradeController";
import { TimedEvent } from "./entities/timedEvent";
import { Controller } from "./controller";
import { Role } from "../models/util/enums/roles";
import { TutorialController } from "./gui-controller/tutorialController";

/**
 * Singleton controller which implements application logic for events.
 * @author Sebastian Führ
 * @author Marvin Kruber
 */
export class EventController implements TimeSubscriber {

    /** The only existing instance of this controller */
    private static instance: EventController;

    /** List of the event categories which hold a list of events each */
    public eventList = require("./../../../res/json/random-events.json");

    private lessThan1500000Infected = true;

    /** List of callback functions for events */
    private static eventFunctionList = {
        "COMMON": [
            /** The player gets money to simulate donation of test kits. */
            (): void => {
                Stats.getInstance().budget += 10_000 * Stats.getInstance().currentPriceTestKit;
            },
            /** The price of test kits is doubled for seven days */
            (): void => {
                Stats.getInstance().currentPriceTestKit *= 2;
                new TimedEvent(7, (): void => {
                    Stats.getInstance().currentPriceTestKit /= 2;
                });
            },
            /** The salary of health workers is sponsored for a week */
            (): void => {
                Stats.getInstance().budget += 10_000 * 7 * Stats.getInstance().currentSalaryHW
            },
            /** Anonymous donation */
            (): void => {
                Stats.getInstance().budget += 100_000;
            },
            /** Bad news are dominating the media (happiness down) */
            (): void => {
                Stats.getInstance().happiness -= 15;
            }
        ],
        "RARE": [
            /** Anonymous donation */
            (): void => {
                Stats.getInstance().budget += 1_000_000;
            },
            /** State workers demand a bonus (wages higher for a while) */
            (): void => {
                Stats.getInstance().currentSalaryHW += 10;
                Stats.getInstance().currentSalaryPO += 10;
                new TimedEvent(14, (): void => {
                    Stats.getInstance().currentSalaryHW -= 10;
                    Stats.getInstance().currentSalaryPO -= 10;
                });
            },
            /** Finally some good news (happiness up) */
            (): void => {
                Stats.getInstance().happiness += 20;
            },
            /** People going out due to heat wave (infection up for a week) */
            (): void => {
                Stats.getInstance().basicInteractionRate *= 1.2;
                Stats.getInstance().maxInteractionVariance *= 1.2;
                new TimedEvent(3, (): void => {
                    Stats.getInstance().basicInteractionRate /= 1.2;
                    Stats.getInstance().maxInteractionVariance /= 1.2;
                });
            }
        ],
        "VERY_RARE": [
            /** The salary of police officers is sponsored for a week */
            (): void => {
                Stats.getInstance().budget += 10_000 * 7 * Stats.getInstance().currentSalaryPO;
            },
            /** Anonymous donation */
            (): void => {
                Stats.getInstance().budget += 100_000_000;
            },
            /** People staying in due to storms (infection down for a week) */
            (): void => {
                Stats.getInstance().basicInteractionRate *= 0.9;
                Stats.getInstance().maxInteractionVariance *= 0.9;
                new TimedEvent(3, (): void => {
                    Stats.getInstance().basicInteractionRate /= 0.9;
                    Stats.getInstance().maxInteractionVariance /= 0.9;
                });
            }
        ],
        "EPIC": [
            /** Anonymous donation */
            (): void => {
                Stats.getInstance().budget += 1_000_000_000;
            },
            /** State workers demand a bonus (wages higher for a while) */
            (): void => {
                Stats.getInstance().currentSalaryHW += 5;
                Stats.getInstance().currentSalaryPO += 5;
                new TimedEvent(42, (): void => {
                    Stats.getInstance().currentSalaryHW -= 5;
                    Stats.getInstance().currentSalaryPO -= 5;
                });
            },
            (): void => {
                //
            }
        ],
        "LEGENDARY": [
            /** An NGO is supplying volunteers and 1 Mio. € in donations in a large-scale effort to help police and healthcare. */
            (): void => {
                Stats.getInstance().currentSalaryHW -= 5;
                Stats.getInstance().currentSalaryPO -= 5;
                Controller.getInstance().distributeNewRoles(5_000, Role.POLICE);
                if (UpgradeController.getInstance().researchExists()) { // cure exists
                    Controller.getInstance().distributeNewRoles(2_500, Role.HEALTH_WORKER);
                    Controller.getInstance().distributeNewRoles(2_500, Role.HEALTH_WORKER, true);
                } else Controller.getInstance().distributeNewRoles(5_000, Role.HEALTH_WORKER);
            },
            /** Anonymous donation */
            (): void => {
                Stats.getInstance().budget += 5_000_000_000;
            },
            /** Finally some good news (happiness up) */
            (): void => {
                Stats.getInstance().happiness == 100;
            }
        ]
    }

    /** Time span until the next event with a common rarity should happen */
    private timeSpanCommon: number;
    /** Time span until the next event with a rare rarity should happen */
    private timeSpanRare: number;
    /** Time span until the next event with a very rare rarity should happen */
    private timeSpanVeryRare: number;
    /** Time span until the next event with an epic rarity should happen */
    private timeSpanEpic: number;
    /** Time span until the next event with an legendary rarity should happen */
    private timeSpanLegendary: number;

    private constructor() {
        TimeController.getInstance().subscribe(this);
        this.calcRanTimeSpan(EventRarity.COMMON);
        this.calcRanTimeSpan(EventRarity.RARE);
        this.calcRanTimeSpan(EventRarity.VERY_RARE);
        this.calcRanTimeSpan(EventRarity.EPIC);
        this.calcRanTimeSpan(EventRarity.LEGENDARY);
    }

    /**
     * When one of the time counters reaches zero a random event
     * of this rarity level gets called. Then this counters, an all
     * others which also reached 0 in this round get recalculated.
     * @see TimeSubscriber
     * @see #callRandomEvent
     */
    notify(): void {
        this.decreaseEventCounters();
        if (!this.timeSpanLegendary) {
            this.callRandomEvent(EventRarity.LEGENDARY);
        } else if (!this.timeSpanEpic) {
            this.callRandomEvent(EventRarity.EPIC);
        } else if (!this.timeSpanVeryRare) {
            this.callRandomEvent(EventRarity.VERY_RARE);
        } else if (!this.timeSpanRare) {
            this.callRandomEvent(EventRarity.RARE);
        } else if (!this.timeSpanCommon) {
            this.callRandomEvent(EventRarity.COMMON);
        }
        this.resetTriggeredEventCounters();

        if(this.lessThan1500000Infected && Stats.getInstance().getInfected() >= 150000) { //triggers lockdown event
            this.lessThan1500000Infected = false;
            TutorialController.getInstance().enableLockdown();
        }
    }

    /**
     * Opens a randomly selected event popup for the given rarity level.
     * @param eventRarity Rarity level to select an event from
     */
    private callRandomEvent(eventRarity: string): void {
        const idx = this.getRandomIntInclusive(0, this.eventList[eventRarity].length - 1);
        const eventInfo = this.eventList[eventRarity][idx];
        new Event(
            EventController.eventFunctionList[eventRarity][idx],
            eventInfo["name"],
            eventInfo["description"],
            eventInfo["image-path"],
            eventInfo["positive"],
            eventInfo["summary"]
        );
    }

    /** Reduces all event counters by one. */
    private decreaseEventCounters(): void {
        this.timeSpanLegendary--;
        this.timeSpanEpic--;
        this.timeSpanVeryRare--;
        this.timeSpanRare--;
        this.timeSpanCommon--;
    }

    /**
     * Checks wether there are event counters which
     * reached zero to recalculate them accordingly.
     */
    private resetTriggeredEventCounters(): void {
        if (!this.timeSpanLegendary) this.calcRanTimeSpan(EventRarity.LEGENDARY);
        if (!this.timeSpanEpic) this.calcRanTimeSpan(EventRarity.EPIC);
        if (!this.timeSpanVeryRare) this.calcRanTimeSpan(EventRarity.VERY_RARE);
        if (!this.timeSpanRare) this.calcRanTimeSpan(EventRarity.RARE);
        if (!this.timeSpanCommon) this.calcRanTimeSpan(EventRarity.COMMON);
    }

    /**
     * Generates a random integer between min and max (inclusive).
     * @param min 
     * @param max 
     * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/math.random
     */
    public getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; 
    } 

    /**
     * Calculates a semi-random timespan for the given event rarity level.
     * @param level event rarity level
     */
    private calcRanTimeSpan(level: EventRarity): void {
        switch (level) {
            case EventRarity.COMMON:
                this.timeSpanCommon = this.getRandomIntInclusive(7, 14);
                break;
            case EventRarity.RARE:
                this.timeSpanRare = this.getRandomIntInclusive(20, 28);
                break;
            case EventRarity.VERY_RARE:
                this.timeSpanVeryRare = this.getRandomIntInclusive(30, 50);
                break;
            case EventRarity.EPIC:
                this.timeSpanEpic = this.getRandomIntInclusive(51, 80);
                break;
            case EventRarity.LEGENDARY:
                this.timeSpanLegendary = this.getRandomIntInclusive(83, 90);
                break;
            default:
                throw new Error("Unknown EventRarity enum received. How did you do this?!?");
        }
    }

    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): EventController {
        if (!EventController.instance) EventController.instance = new EventController();
        return EventController.instance;
    }

}