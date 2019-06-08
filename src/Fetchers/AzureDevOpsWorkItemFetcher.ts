class AzureDevOpsWorkItemFetcher extends BaseWorkItemItemFetcher {

    private readonly API_VERSION = "5.0-preview";

    constructor(readonly config: AzureDevOpsConfig) { super("https://dev.azure.com/") }

    listIterationWorkItems(iterationId: string): Array<WorkItem> {
        let workItemIds: Array<number> = this.listWorkItemIds(iterationId);
        return workItemIds.map((id) => this.getWorkItemById(id));
    }

    public listWorkItemIds(iterationId: string) : Array<number> {
        const requestPath: string = this.config.organization + '/' + this.config.project + '/' + this.config.team +
            '/_apis/work/teamsettings/iterations/'+ iterationId + '/workitems?api-version=' + this.API_VERSION;
        return this.doGetRequest<AzureDevOpsIterationWorkItems>(requestPath).workItemRelations.map((relation => relation.target.id));
    }

    getWorkItemById(id: number): WorkItem {
        const requestPath: string = this.config.organization + '/' + this.config.project + '/_apis/wit/workitems/' + id +
            '?api-version=' + this.API_VERSION;

        return this.convertToEntity(this.doGetRequest<AzureDevOpsWorkItem>(requestPath));
    }

    protected getRequestHeaders(): object {
        return {
            Accept : 'application/json',
            Authorization : 'Basic ' + Utilities.base64Encode(this.config.acessToken)
        };
    }

    private convertToEntity(model: AzureDevOpsWorkItem): WorkItem {
        let type: string = model.fields["System.WorkItemType"];
        switch (type) {
            case "User Story":
                return this.convertToUserStory(model);
            case "Task":
                return this.convertToTask(model);
            case "Bug":
                return this.convertToBug(model);
            case "Issue":
                return this.convertToIssue(model);
            default:
                return null;
        }
    }

    private convertToUserStory(model: AzureDevOpsWorkItem): UserStory {
        let userStory: UserStory = new UserStory();
        this.fillCommonFields(userStory, model);
        return userStory;
    }

    private convertToTask(model: AzureDevOpsWorkItem): Task {
        let task: Task = new Task();
        this.fillCommonFields(task, model);
        return task;
    }

    private convertToBug(model: AzureDevOpsWorkItem): Bug {
        let bug: Bug = new Bug();
        this.fillCommonFields(bug, model);
        return bug;
    }

    private convertToIssue(model: AzureDevOpsWorkItem) : Issue {
        let issue: Issue = new Issue();
        this.fillCommonFields(issue, model);
        return issue;
    }

    private fillCommonFields(workItem: WorkItem, model: AzureDevOpsWorkItem) : void {
        workItem.id = model.id;
        workItem.version = model.rev;
        workItem.assignedTo = model.fields["System.AssignedTo"] ? (model.fields["System.AssignedTo"]["displayName"] as string) : null;
        workItem.state = model.fields["System.State"] as string;
        workItem.tags = model.fields["System.Tags"] ? (model.fields["System.Tags"] as string).split(';') : null;
        workItem.title = model.fields["System.Title"] as string;
        workItem.workItemType = model.fields["System.WorkItemType"] as string;
        workItem.htmlLink = model._links["html"]["href"] as string;
    }
}