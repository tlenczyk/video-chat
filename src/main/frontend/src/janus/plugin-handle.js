import {EventAggregator} from 'aurelia-event-aggregator';
import {SessionService} from './session-service';
import {log} from '../config/logger';

export class PluginHandle extends EventAggregator {
  constructor(session, id, fetchClient) {
    super();
    this.session = session;
    this.id = id;
    this.fetchClient = fetchClient;
  }

  url() {
    return `${this.session.url()}/${this.id}`;
  }

  message(callbacks) {
    const message = callbacks.message;
    const jsep = callbacks.jsep;
    const request = {"janus": "message", "body": message, "transaction": SessionService.getTransactionId()};
    if (jsep) {
      request.jsep = jsep;
    }
    log.debug("Sending message to plugin (handle=" + this.id + "):", request);

    return this.fetchClient.post(this.url(), request)
      .catch((e) => {
        log.error("HANDLE message send error!", e);
      });
  }

  processResponseMessage(json) {
    const event = json.janus;

    if ('event' === event) {
      const data = json.plugindata.data;
      const error = data.error;
      const messageType = data.videoroom;

      if (error) {
        log.error('Poll error:', data);
        return;
      }

      if ('joined' === messageType) {
        this.publish("joined", {roomName: data.room, roomId: data.id});
        if (data.publishers && data.publishers.length > 0) {
          this.publish("publisherFound", {roomName: data.room, publisher: data.publishers[0]});
        }
      }

      if (json.jsep) {
        this.publish('remoteJsep', json.jsep);
      }
    }
  }

  sendTrickleCandidate(candidate) {
    const payload = {"janus": "trickle", "candidate": candidate, "transaction": SessionService.getTransactionId()};

    return this.fetchClient.post(this.url(), payload)
      .catch((e) => {
        log.debug("HANDLE candidate send error!", e);
      });
  }

  destroy() {
    return this.fetchClient.post(this.url(), {
      janus: "detach",
      transaction: SessionService.getTransactionId()
    });
  }

  hangup() {
    return this.fetchClient.post(this.url(), {
      janus: "hangup",
      transaction: SessionService.getTransactionId()
    });
  }
}
