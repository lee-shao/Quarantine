
export class EventLog {
    private static instance: EventLog; 
    // fifo
    // newest element is [0]
    // oldest element is [5]
    private events: Array<[string,string,string]>;
    private event: [string,string,string];

    public updateEventList(eventName: string, eventDesc: string, eventImagePath: string): void {
      // let event: [string,string,string];
      this.event = [eventName, eventDesc, eventImagePath]
      const arraylen = this.events.unshift(this.event);
      if (arraylen > 5) {
        this.events.pop();
      }
    }
    public getLast(): [string,string,string] {
      return this.events[0];
    }
    public getLastFive(): Array<[string,string,string]> {
      return this.events;
    }
      
    private constructor() {
      this.events = [];
    }
    // ----------------------------------------------------------------- GETTER-METHODS
    /** @returns The singleton instance */
    public static getInstance(): EventLog {
        if (!EventLog.instance) EventLog.instance = new EventLog();
        return EventLog.instance;
    }
}

