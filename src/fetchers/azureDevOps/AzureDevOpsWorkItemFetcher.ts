class AzureDevOpsWorkItemFetcher extends BaseWorkItemFetcher {

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

        return this.convertToEntity_(this.doGetRequest<AzureDevOpsWorkItem>(requestPath));
    }

    protected getRequestHeaders(): object {
        return {
            Accept : 'application/json',
            Authorization : 'Basic ' + Utilities.base64Encode(this.config.login + ':' + this.config.acessToken)
        };
    }

    private convertToEntity_(model: AzureDevOpsWorkItem): WorkItem {
        let type: string = model.fields["System.WorkItemType"];
        switch (type) {
            case "User Story":
                return this.convertToUserStory_(model);
            case "Task":
                return this.convertToTask_(model);
            case "Bug":
                return this.convertToBug_(model);
            case "Issue":
                return this.convertToIssue_(model);
            default:
                return null;
        }
    }

    private convertToUserStory_(model: AzureDevOpsWorkItem): UserStory {
        let userStory: UserStory = new UserStory();
        this.fillCommonFields_(userStory, model);
        userStory.workItemType = WorkItemType.UserStory;
        return userStory;
    }

    private convertToTask_(model: AzureDevOpsWorkItem): Task {
        let task: Task = new Task();
        this.fillCommonFields_(task, model);
        task.workItemType = WorkItemType.Task;
        task.completedWork = model.fields["Microsoft.VSTS.Scheduling.CompletedWork"];
        task.originalEstimate = model.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"];
        task.storyPoints = model.fields["Microsoft.VSTS.Scheduling.StoryPoints"];
        return task;
    }

    private convertToBug_(model: AzureDevOpsWorkItem): Bug {
        let bug: Bug = new Bug();
        this.fillCommonFields_(bug, model);
        bug.workItemType = WorkItemType.Bug;
        bug.origin = this.convertBugOrigin_(model.fields["Custom.Origem"] as string);
        bug.severity = this.convertBugSeverity_(model.fields["Microsoft.VSTS.Common.Severity"] as string);
        return bug;
    }

    private convertToIssue_(model: AzureDevOpsWorkItem) : Issue {
        let issue: Issue = new Issue();
        this.fillCommonFields_(issue, model);
        issue.workItemType = WorkItemType.Issue;
        return issue;
    }

    private fillCommonFields_(workItem: WorkItem, model: AzureDevOpsWorkItem) : void {
        workItem.id = model.id.toString();
        workItem.version = model.rev;
        workItem.assignedTo = model.fields["System.AssignedTo"] ? (model.fields["System.AssignedTo"]["displayName"] as string) : null;
        workItem.state = this.convertWorkItemState_(model.fields["System.State"] as string);
        workItem.tags = model.fields["System.Tags"] ? (model.fields["System.Tags"] as string).split(';') : null;
        workItem.title = model.fields["System.Title"] as string;
        workItem.htmlLink = model._links["html"]["href"] as string;
    }

    private convertWorkItemState_(state: string) : WorkItemState {
        switch (state) {
            case "New":
                return WorkItemState.New;
            case "Closed":
                return WorkItemState.Closed;
            case "Validating":
                return WorkItemState.Validating;
            case "Deployed QA":
                return WorkItemState.DeployedQA;
            default:
                return WorkItemState.Active;
        }
    }

    private convertBugOrigin_(origin: string) : BugOrigin {
        if (origin == "Specification") {
            return BugOrigin.Specification;
        }
        return BugOrigin.Implementation;
    }

    private convertBugSeverity_(severity: string) : BugSeverity {
        switch (severity) {
            case "1 - Critical":
                return BugSeverity.Critical;
            case "2 - High":
                return BugSeverity.High;
            case "3 - Medium":
                return BugSeverity.Medium;
            case "4 - Low":
            default:
                return BugSeverity.Low;
        }
    }
}