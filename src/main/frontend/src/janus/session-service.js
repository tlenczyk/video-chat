import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {log} from '../config/logger';
import {FetchClient} from '../commons/fetch-client';
import {SESSION_CREATED} from '../commons/constants-events';
import {Session} from '../janus/session';

@inject(FetchClient, EventAggregator, log)
export class SessionService {

  static getTransactionId = () => (Math.random() * 10000000).toFixed().toString();
  session = null;
  handles = [];

  constructor(fetchClient, eventAggregator, log) {
    this.fetchClient = fetchClient;
    this.eventAggregator = eventAggregator;
    this.log = log;
  }

  createSession(options) {

    return this.fetchClient.post(options.server, {
      janus: "create",
      transaction: SessionService.getTransactionId()
    }).then((json) => {
      this.session = new Session(json.data.id, options, this.fetchClient);

      this.log.debug("Session created", this.session);

      this.eventAggregator.publish(SESSION_CREATED, this.session);
    });
  }

  destroySession() {
    for (var ph in this.handles) {
      this.handles[ph].destroy();
    }

    return this.fetchClient.post(this.url(), {
      janus: "destroy",
      transaction: SessionService.getTransactionId()
    }).then(res =>{
      log.debug('Session destroyed', res);
    });
  }
}
