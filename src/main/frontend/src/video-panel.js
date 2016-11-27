import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {log} from './config/logger';
import {SESSION_CREATED} from './commons/constants-events';

@inject(EventAggregator, log)
export class VideoPanel {
  @bindable
  panelTitle = '';
  videoOn = false;
  audioOn = false;

  constructor(eventAggregator, log) {
    this.eventAggregator = eventAggregator;
    this.log = log;
  }

  toggleVideo() {
    this.videoOn = !this.videoOn;
  }

  toggleAudio() {
    this.audioOn = !this.audioOn;
  }

  attached() {
    this.eventAggregator.subscribe(SESSION_CREATED, (session) => {
      this.log.debug('onSessionCreated in panel', this.panelTitle, session);

      session.attach().then((handle)=> {
        this.log.debug('handle created in panel', this.panelTitle, handle);
      });
    });
  }
}
