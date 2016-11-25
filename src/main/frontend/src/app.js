import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {SessionService} from './janus/session-service';

@inject(SessionService, EventAggregator)
export class App {

  constructor(sessionService, eventAggregator) {
    this.sessionService = sessionService;
    this.eventAggregator = eventAggregator;
  }

  attached() {
    const server = "http://172.17.0.2:8088/janus";

    this.sessionService.createSession({server});
  }
}
