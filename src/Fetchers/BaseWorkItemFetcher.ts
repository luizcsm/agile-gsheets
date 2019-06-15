abstract class BaseWorkItemFetcher implements IWorkItemFetcher {

    constructor(protected readonly endpoint: string) { }

    abstract listIterationWorkItems(iteration: string): Array<WorkItem>;
    abstract getWorkItemById(id: number) : WorkItem;

    protected doGetRequest<T>(path: string) : T {
        let params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
            method: 'get',
            headers: this.getRequestHeaders()
        }
        let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(this.endpoint + path, params);
        
        if (response.getResponseCode() != 200) {
            Logger.log('Error performing get request. Response code: %d', response.getResponseCode());
        }

        return JSON.parse(response.getContentText()) as T;
    }

    protected abstract getRequestHeaders() : object;
}