import {FetchClient} from '../../src/commons/fetch-client';

describe('fetch-client.spec.js', () => {

  let deferred;
  let httpClientMock = {
    fetch: () => {
    }
  };

  beforeEach(() => {
    deferred = $.Deferred();

    spyOn(httpClientMock, 'fetch').and.returnValue(deferred.promise());
  });

  it('should execute GET request', (done) => {
    //given
    let url = 'http://aurelia.io';
    let client = new FetchClient(httpClientMock);
    let someData = {any: 'data'};

    //when
    client.get(url).then((data)=> {

      //then
      expect(httpClientMock.fetch).toHaveBeenCalledWith(url);
      expect(data).toEqual(someData);
      done();
    });
    resolve(someData);
  });

  it('should execute POST request', () => {
    //given
    let url = 'http://aurelia.io';
    let client = new FetchClient(httpClientMock);
    let requestData = {any: 'request'};
    let responseData = {any: 'response'};

    //when
    client.post(url, requestData).then((data)=> {

      //then
      expect(httpClientMock.fetch).toHaveBeenCalledWith(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });
      expect(data).toEqual(responseData);
    });
    resolve(responseData);
  });

  function resolve(obj) {
    return deferred.resolve({
      json: () => {
        return obj;
      }
    });
  }
});
