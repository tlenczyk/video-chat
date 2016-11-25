import {EventAggregator} from 'aurelia-event-aggregator';

export class Session extends EventAggregator {
  constructor(sessionId) {
    super();
    this.sessionId = sessionId;
  }
}
