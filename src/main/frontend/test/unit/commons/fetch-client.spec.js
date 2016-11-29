import {FetchClient} from '../../../src/commons/fetch-client';
const noop = () => {
};
describe('fetch-client.spec.js', () => {

  let resolvePromise;
  let httpClientMock = {
    fetch: noop
  };

  beforeEach(() => {
    spyOn(httpClientMock, 'fetch').and.returnValue(new Promise((resolve)=> {
      resolvePromise = resolve;
    }));
  });

  it('should execute GET request', (done) => {
    //given
    let url = 'http://aurelia.io';
    let client = new FetchClient(httpClientMock);
    let someData = {any: 'data'};

    //when
    let getPromise = client.get(url);
    resolve(someData);

    //then
    getPromise.then((data)=> {
      expect(httpClientMock.fetch).toHaveBeenCalledWith(url);
      expect(data).toEqual(someData);
      done();
    });
  });

  it('should execute POST request', (done) => {
    //given
    let url = 'http://aurelia.io';
    let client = new FetchClient(httpClientMock);
    let requestData = {any: 'request'};
    let responseData = {any: 'response'};

    //when
    let postPromise = client.post(url, requestData);

    //then
    expect(httpClientMock.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData)
    });

    //when
    resolve(responseData);

    //then
    postPromise.then((data)=> {
      expect(data).toEqual(responseData);
      done();
    });
  });

  function resolve(obj) {
    return resolvePromise({
      json: () => {
        return obj;
      }
    });
  }
});
