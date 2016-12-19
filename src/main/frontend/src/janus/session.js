import {EventAggregator} from 'aurelia-event-aggregator';
import {VIDEO_PLUGIN_NAME} from '../commons/constants';
import {SessionService} from '../janus/session-service';
import {PluginHandle} from '../janus/plugin-handle';
import {log} from '../config/logger';

export class Session extends EventAggregator {
  id = null;
  options = null;
  fetchClient = null;
  handles = {};
  polling = false;
  pc = null;

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

        this.poll();

        return handle;
      });
  }

  poll() {
    if (this.polling) {
      return;
    }

    this.polling = true;
    this.fetchClient.get(this.url())
      .then((json) => {
        if (json.sender && this.handles[json.sender]) {
          let handle = this.handles[json.sender];
          handle.processResponseMessage(json);
        } else {
          log.debug('poll', json);
        }

        this.polling = false;
        this.poll();
      })
      .catch((err) => {
        log.error("Long poll ERROR", err);
        this.polling = false;
      });
  }

  createOffer(handle, stream) {
    this.setupPeerConnection(handle);

    if (stream) {
      this.pc.addStream(stream);
    }

    const mediaConstraints = {
      'mandatory': {
        'OfferToReceiveAudio': false,
        'OfferToReceiveVideo': false
      }
    };

    return this.pc.createOffer(mediaConstraints).then((offer) => {
      this.pc.setLocalDescription(offer);
      log.debug('Signaling. Sending Offer', offer);
      var jsep = {
        "type": offer.type,
        "sdp": offer.sdp
      };
      return jsep;
    });
  }

  createAnswer(handle, jsep) {
    var self = this;
    self.setupPeerConnection(handle);

    self.pc.ontrack = function (remoteStream) {
      log.debug("Handling Remote Stream", remoteStream.streams[0]);
      handle.publish('remoteStream', remoteStream.streams[0]);
    };

    return self.pc.setRemoteDescription(new RTCSessionDescription(jsep)).then(()=> {
      return self.pc.createAnswer().then((answer) => {
        self.pc.setLocalDescription(answer);
        var jsep = {
          "type": answer.type,
          "sdp": answer.sdp
        };
        return jsep;
      });
    });
  }

  setupPeerConnection(handle) {
    const pc_config = {"iceServers": this.options.iceServers};
    const pc_constraints = {};
    this.pc = new RTCPeerConnection(pc_config, pc_constraints);

    this.pc.onicecandidate = function (event) {
      log.debug('PC on candidate', event);
      if (event.candidate == null) {
        log.debug("PC End of candidates.");
        handle.sendTrickleCandidate({"completed": true});
      } else {
        var candidate = {
          "candidate": event.candidate.candidate,
          "sdpMid": event.candidate.sdpMid,
          "sdpMLineIndex": event.candidate.sdpMLineIndex
        };
        handle.sendTrickleCandidate(candidate);
      }
    };
  }

  handleRemoteJsep(jsep) {
    this.pc.setRemoteDescription(new RTCSessionDescription(jsep));
    log.debug('Signaling. Answer JSEP reveived', jsep);
  }
}
