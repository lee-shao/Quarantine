/**
 * Interface for subscribers (Pub/Sub) of TimeController
 * @author Sebastian Führ
 * @author Marvin Kruber
 * @see TimeController
 */
export interface TimeSubscriber {
    /** Allows notification by TimeController about time updates */
    notify(): void;
}