import {EventAggregator} from 'aurelia-event-aggregator';

export class PluginHandle extends EventAggregator {
  constructor(session, id, fetchClient) {
    super();
    this.session = session;
    this.id = id;
    this.fetchClient = fetchClient;
  }
}
