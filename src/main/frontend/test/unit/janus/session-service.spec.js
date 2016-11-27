import {SessionService} from '../../../src/janus/session-service';
import {log} from '../../../src/config/logger';
import {SESSION_CREATED} from '../../../src/commons/constants-events';

describe('fetch-client.spec.js', () => {

  let sessionService;
  let postDeferred;
  let fetchClientMock = {
    post: () => {
    }
  };
  let eventAggregatorMock = {
    publish: () => {
    }
  };

  beforeEach(() => {
    postDeferred = $.Deferred();

    spyOn(fetchClientMock, 'post').and.returnValue(postDeferred.promise());
    spyOn(eventAggregatorMock, 'publish');
    spyOn(SessionService, 'getTransactionId').and.returnValue(1);
    sessionService = new SessionService(fetchClientMock, eventAggregatorMock, log);
  });

  it('should create session', () => {
    //given
    let options = {server: 'http://any-janus-url'};
    let sessionData = {data: {id: 1}};

    //when
    sessionService.createSession(options).then(()=> {
      //then
      expect(fetchClientMock.post).toHaveBeenCalledWith(options.server, {
        janus: 'create',
        transaction: 1
      });
      expect(sessionService.session.id).toEqual(sessionData.id);
    });
    postDeferred.resolve(sessionData);
  });

  it('should publish event after creating session', () => {
    //given
    let options = {server: 'http://any-janus-url'};
    let sessionData = {data: {id: 1}};

    //when
    sessionService.createSession(options).then(()=> {
      //then
      expect(eventAggregatorMock.publish.calls.mostRecent().args[0]).toEqual(SESSION_CREATED);
      expect(eventAggregatorMock.publish.calls.mostRecent().args[1].id).toEqual(sessionData.id);
    });
    postDeferred.resolve(sessionData);
  });
});
