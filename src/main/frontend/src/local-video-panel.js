import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {log} from './config/logger';
import {SESSION_CREATED} from './commons/constants-events';

@inject(EventAggregator, log)
export class LocalVideoPanel {
  @bindable
  panelTitle = '';
  localVideoSource = null;

  constructor(eventAggregator, log) {
    this.eventAggregator = eventAggregator;
    this.log = log;
  }

  attached() {
    this.eventAggregator.subscribe(SESSION_CREATED, (session) => {
      this.log.debug('onSessionCreated in panel', this.panelTitle, session);

      session.attach().then((handle)=> {
        this.log.debug('handle created in panel', this.panelTitle, handle);
        handle.hangup();

        var joinRoom = {"request": "join", "room": 1234, "ptype": "publisher", "display": 'publisher'};
        handle.message({"message": joinRoom});

        handle.subscribe('joined', (data)=> {
          navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
            this.localVideoSource = URL.createObjectURL(stream);

            session.createOffer(handle, stream).then((jsep) => {
              var publish = {"request": "configure", "audio": true, "video": true};
              handle.message({"message": publish, "jsep": jsep});
            });
          });
        });

        handle.subscribe("remoteJsep", (jsep) => {
          session.handleRemoteJsep(jsep);
        });
      });
    });
  }
}
