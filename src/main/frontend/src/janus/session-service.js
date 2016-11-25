import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {log} from '../config/logger';
import {FetchClient} from '../commons/fetch-client';
import {Session} from '../janus/session';

@inject(FetchClient, EventAggregator, log)
export class SessionService {

  static getTransactionId = () => (Math.random() * 10000000).toFixed().toString();

  constructor(fetchClient, eventAggregator, log) {
    this.fetchClient = fetchClient;
    this.eventAggregator = eventAggregator;
    this.log = log;
  }

  createSession(options) {
    this.options = options;

    return this.fetchClient.post(this.options.server, {
      janus: "create",
      transaction: SessionService.getTransactionId()
    }).then((json) => {
      this.session = new Session(json.data.id);

      this.log.debug("Session created", this.session);

      this.eventAggregator.publish('session-created', this.session);
    });
  }
}
