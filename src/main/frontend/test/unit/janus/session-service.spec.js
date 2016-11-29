import {SessionService} from '../../../src/janus/session-service';
import {log} from '../../../src/config/logger';
import {SESSION_CREATED} from '../../../src/commons/constants-events';

const noop = () => {};

describe('session-service.spec.js', () => {

  let sessionService;
  let resolvePost;
  let fetchClientMock = {
    post: noop
  };
  let eventAggregatorMock = {
    publish: noop
  };
  let transactionId = 1;

  beforeEach(() => {
    spyOn(fetchClientMock, 'post').and.returnValue(new Promise((resolve) => {
      resolvePost = resolve;
    }));
    spyOn(eventAggregatorMock, 'publish');
    spyOn(SessionService, 'getTransactionId').and.returnValue(transactionId);
    sessionService = new SessionService(fetchClientMock, eventAggregatorMock, log);
  });

  it('should create session', (done) => {
    //given
    let options = {server: 'http://any-janus-url'};
    let sessionData = {data: {id: 1}};

    //when
    let createSessionPromise = sessionService.createSession(options);

    //then
    expect(fetchClientMock.post).toHaveBeenCalledWith(options.server, {
      janus: 'create',
      transaction: transactionId
    });

    //when
    resolvePost(sessionData);

    //then
    createSessionPromise.then(()=> {
      expect(sessionService.session.id).toEqual(sessionData.data.id);
      done();
    });
  });

  it('should publish event after creating session', (done) => {
    //given
    let options = {server: 'http://any-janus-url'};
    let sessionData = {data: {id: 1}};

    //when
    let createSessionPromise = sessionService.createSession(options);
    resolvePost(sessionData);

    //then
    createSessionPromise.then(()=> {
      expect(eventAggregatorMock.publish.calls.mostRecent().args[0]).toEqual(SESSION_CREATED);
      expect(eventAggregatorMock.publish.calls.mostRecent().args[1].id).toEqual(sessionData.data.id);
      done();
    });
  });
});
