import {SessionService} from '../../../src/janus/session-service';
import {Session} from '../../../src/janus/session';

describe('session.spec.js', () => {

  let session;
  let postDeferred;
  let fetchClientMock = {
    post: () => {
    }
  };
  let sessionId = 1;
  let transactionId = 2;
  let options = {server: 'http://any-janus-url'};

  beforeEach(() => {
    postDeferred = $.Deferred();

    spyOn(fetchClientMock, 'post').and.returnValue(postDeferred.promise());
    spyOn(SessionService, 'getTransactionId').and.returnValue(transactionId);
    session = new Session(sessionId, options, fetchClientMock);
  });

  it('should get session URL', () => {
    expect(session.url()).toEqual(url());
  });


  it('should attach to video plugin', () => {
    //given
    let pluginHandle = {
      data: {id: 1}
    };

    //when
    session.attach(options).then((handle)=> {
      //then
      expect(fetchClientMock.post).toHaveBeenCalledWith(url(), {
        janus: 'attach',
        transaction: transactionId
      });
      expect(session.handles).toEqual({
        [pluginHandle.data.id]: handle
      });
    });
    postDeferred.resolve(pluginHandle);
  });

  function url() {
    return `${options.server}/${sessionId}`;
  }
});
