import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from "aurelia-logging-console";

export var log = LogManager.getLogger('video-chat');

LogManager.setLevel(window.location.href.match(/.*\?debug.*/i)
  ? LogManager.logLevel.debug
  : LogManager.logLevel.error);
