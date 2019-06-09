abstract class WorkItemSheet extends BaseSheet {

    readonly workItems: WorkItem[];

    constructor(sheetName: string, workItems: WorkItem[]) {
        super(sheetName);
        this.workItems = workItems.filter(this.workItemFilter);
    }
    
    abstract workItemFilter(workItem: WorkItem) : boolean;
}