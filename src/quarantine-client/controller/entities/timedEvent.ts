import { TimeSubscriber } from '../../models/util/timeSubscriber';
import { TimeController } from '../timeController';

/**
 * An in-game event and opens a popup window.  
 * Represents the interface between the gui and the event
 * application logic {@see EventController}.
 * This event has a second callback function which will
 * be executed after a specified time frame.
 * 
 * @author Marvin Kruber
 * @author Sebastian Führ
 */
export class TimedEvent implements TimeSubscriber {

    /** Time span until the second event function gets called */
    private timeSpan: number;

    /** Callback function which gets called after a specific time span */
    private timedEventFunction: Function;

    constructor(timeSpan: number, timedEventFunction: Function) {
        TimeController.getInstance().subscribe(this);
        this.timeSpan = timeSpan;
        this.timedEventFunction = timedEventFunction;
    }

    notify(): void {
        this.timeSpan--;
        if (this.timeSpan == 0) {
            this.timedEventFunction();
        }
    }

}