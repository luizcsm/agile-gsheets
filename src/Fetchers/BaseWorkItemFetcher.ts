abstract class BaseWorkItemItemFetcher implements WorkItemFetcherInterface {

    constructor(protected readonly endpoint: string) { }

    abstract listIterationWorkItems(iteration: string): Array<WorkItem>;
    abstract getWorkItemById(id: number) : WorkItem;

    protected doGetRequest<T>(path: string) : T {
        let params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: 'get',
            headers: this.getHeaders()
        }
        let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(this.endpoint + path, params);
        return JSON.parse(response.getContentText()) as T;
    }

    protected abstract getHeaders() : object;
}