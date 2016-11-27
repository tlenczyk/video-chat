import {EventAggregator} from 'aurelia-event-aggregator';
import {VIDEO_PLUGIN_NAME} from '../commons/constants';
import {SessionService} from '../janus/session-service';
import {PluginHandle} from '../janus/plugin-handle';

export class Session extends EventAggregator {
  id = null;
  options = null;
  fetchClient = null;
  handles = {};

  constructor(id, options, fetchClient) {
    super();
    this.id = id;
    this.options = options;
    this.fetchClient = fetchClient;
  }

  url() {
    return `${this.options.server}/${this.id}`;
  }

  attach() {
    return this.fetchClient.post(this.url(), {
      janus: "attach",
      plugin: VIDEO_PLUGIN_NAME,
      transaction: SessionService.getTransactionId()
    })
      .then((json) => {
        const handle = new PluginHandle(this, json.data.id, this.fetchClient);
        this.handles[handle.id] = handle;

        return handle;
      });
  }
}
