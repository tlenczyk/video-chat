import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(HttpClient)
export class FetchClient {

  constructor(httpClient) {
    this.httpClient = httpClient;
  }

  get(url) {
    return this.httpClient.fetch(url)
      .then((r) => r.json());
  }

  post(url, body) {
    return this.httpClient.fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
      .then((r) => r.json());
  }
}
