export default class HttpService {
    ajax(method, url, data, headers) {
         this.fetchHeaders = new Headers({'content-type': 'application/json', ...(headers || {})});
        return fetch(url, {
            method,
            headers: this.fetchHeaders, body: JSON.stringify(data)
        }).then(x => x.json());
    }
}
