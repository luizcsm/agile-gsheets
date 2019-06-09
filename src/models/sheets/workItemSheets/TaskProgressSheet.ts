class TaskProgressSheet extends WorkItemSheet {

    constructor(workItems : WorkItem[]) {
        super(TASK_PROGRESS_SHEET, workItems);        
    }

    workItemFilter(workItem: WorkItem): boolean {
        return workItem && workItem.workItemType == WorkItemType.Task;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}