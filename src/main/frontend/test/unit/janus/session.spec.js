import {SessionService} from '../../../src/janus/session-service';
import {Session} from '../../../src/janus/session';
import {VIDEO_PLUGIN_NAME} from '../../../src/commons/constants';
const noop = () => {
};

describe('session.spec.js', () => {

  let session;
  let postPromiseResolve;
  let getPromiseResolve;
  let fetchClientMock = {
    post: noop,
    get: noop
  };
  let sessionId = 1;
  let transactionId = 2;
  let options = {server: 'http://any-janus-url'};

  beforeEach(() => {
    spyOn(fetchClientMock, 'post').and.returnValue(new Promise((resolve)=> {
      postPromiseResolve = resolve;
    }));
    spyOn(fetchClientMock, 'get').and.returnValue(new Promise((resolve)=> {
      getPromiseResolve = resolve;
    }));
    spyOn(SessionService, 'getTransactionId').and.returnValue(transactionId);
    session = new Session(sessionId, options, fetchClientMock);
  });

  it('should get session URL', () => {
    expect(session.url()).toEqual(url());
  });


  it('should attach to video plugin', (done) => {
    //given
    let pluginHandle = {
      data: {id: 1}
    };

    //when
    let attachPromise = session.attach();

    //then
    expect(fetchClientMock.post).toHaveBeenCalledWith(url(), {
      janus: 'attach',
      plugin: VIDEO_PLUGIN_NAME,
      transaction: transactionId
    });

    //when
    postPromiseResolve(pluginHandle);

    //then
    attachPromise.then((handle)=> {
      //then
      expect(session.handles).toEqual({[pluginHandle.data.id]: handle});
      done();
    });
  });

  function url() {
    return `${options.server}/${sessionId}`;
  }
});
