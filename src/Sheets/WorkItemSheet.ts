abstract class WorkItemSheet {
    constructor(public readonly sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    }
    
    abstract canDisplayWorkItem(workItem: WorkItem) : boolean;
}