import {bindable} from 'aurelia-framework';

export class VideoPanel {
  @bindable
  panelTitle = '';
  videoOn = false;
  audioOn = false;

  toggleVideo() {
    this.videoOn = !this.videoOn;
  }

  toggleAudio() {
    this.audioOn = !this.audioOn;
  }

}
