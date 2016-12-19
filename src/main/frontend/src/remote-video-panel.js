import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {log} from './config/logger';
import {SESSION_CREATED} from './commons/constants-events';

@inject(EventAggregator, log)
export class RemoteVideoPanel {
  @bindable
  panelTitle = '';
  session = null;
  remoteVideoSource = null;

  constructor(eventAggregator, log) {
    this.eventAggregator = eventAggregator;
    this.log = log;
  }

  attached() {
    this.eventAggregator.subscribe(SESSION_CREATED, (session) => {
      this.log.debug('onSessionCreated in panel', this.panelTitle, session);
      this.session = session;

      session.attach().then((masterHandle)=> {
        this.log.debug('handle created in panel', this.panelTitle, masterHandle);
        masterHandle.hangup();

        var joinRoom = {"request": "join", "room": 1234, "ptype": "publisher", "display": 'remoteMaster'};
        masterHandle.message({"message": joinRoom});

        masterHandle.subscribe('joined', (data)=> {
          this.log.debug('Remote Room joined', data);
        });

        masterHandle.subscribe("publisherFound", (data) => {
          log.debug('joining to room with publishers', data.publisher);
          this.attachToPublisher(data.roomName, data.publisher.id);
        });
      });
    });
  }

  attachToPublisher(roomName, publisherId) {
    this.session.attach().then((publisherHandle) => {

      let joinAsListenerRequest = {"request": "join", "room": roomName, "ptype": "listener", "feed": publisherId};
      publisherHandle.message({message: joinAsListenerRequest});

      publisherHandle.subscribe('remoteStream', (remoteStream) => {
        this.remoteVideoSource = URL.createObjectURL(remoteStream);
      });

      publisherHandle.subscribe("remoteJsep", (jsep) => {
        this.session.createAnswer(publisherHandle, jsep).then((answerJsep)=> {
          let body = {"request": "start", "room": roomName};
          publisherHandle.message({"message": body, "jsep": answerJsep});
        });
      });
    });
  }
}
