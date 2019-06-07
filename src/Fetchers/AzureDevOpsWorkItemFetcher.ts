class AzureDevOpsWorkItemFetcher extends BaseWorkItemItemFetcher {

    private readonly API_VERSION = "5.0-preview";

    constructor(readonly config: AzureDevOpsConfig) { super("https://dev.azure.com/") }

    listIterationWorkItems(iterationId: string): Array<WorkItem> {
        let workItemIds: Array<number> = this.listWorkItemIds(iterationId);
        return workItemIds.map((id) => this.getWorkItemById(id));
    }

    private listWorkItemIds(iterationId: string) : Array<number> {
        const requestPath: string = this.config.organization + '/' + this.config.project + '/' + this.config.team +
            '/_apis/work/teamsettings/iterations/'+ iterationId + '/workitems?api-version=' + this.API_VERSION;
        return this.doGetRequest<AzureDevOpsWorkItemRelations>(requestPath).workItemRelations.map((relation => relation.target.id));
    }

    getWorkItemById(id: number): WorkItem {
        throw new Error("Method not implemented.");
    }
    protected getHeaders(): object {
        throw new Error("Method not implemented.");
    }
}