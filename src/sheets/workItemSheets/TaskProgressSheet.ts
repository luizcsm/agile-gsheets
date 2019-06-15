class TaskProgressSheet extends WorkItemSheet {

    constructor() {
        super(TASK_PROGRESS_SHEET);        
    }

    workItemFilter(workItem: WorkItem): boolean {
        return workItem && workItem.workItemType == WorkItemType.Task;
    }

    protected getDataRangeList(): GoogleAppsScript.Spreadsheet.RangeList {
        throw new Error("Method not implemented.");
    }

    protected updateDataRangesLine(rangeList: RangeAndDataPair[], lineIndex: number, workItem: WorkItem): void {
        throw new Error("Method not implemented.");
    }
}