class TaskRiskAnalysisSheet extends WorkItemSheet {

    private readonly TASK_RISK_ANALYSIS_RANGE = "TASK_RISK_ANALYSIS_RANGE";
    private readonly TASK_RISK_ANALYSIS_DEFAULT_RANGE = "A3:C41";

    constructor() {
        super(TASK_RISK_ANALYSIS_SHEET);
    }

    protected workItemFilter(workItem: WorkItem): boolean {
        return workItem && workItem.workItemType == WorkItemType.Task;
    }

    protected getDataRangeList(): GoogleAppsScript.Spreadsheet.Range[] {
        let ranges = new Array<GoogleAppsScript.Spreadsheet.Range>();

        let range1: GoogleAppsScript.Spreadsheet.Range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(this.TASK_RISK_ANALYSIS_RANGE);
        if (!range1) {
            range1 = SpreadsheetApp.getActiveSpreadsheet().getRange(this.TASK_RISK_ANALYSIS_DEFAULT_RANGE);
        }
        ranges.push(range1);

        return ranges;
    }

    protected updateDataRangesLine(rangeList: RangeAndDataPair[], lineIndex: number, workItem: WorkItem): void {
        let task = workItem as Task;
        rangeList[0].values[lineIndex][1] = task.title;
        rangeList[0].values[lineIndex][2] = task.storyPoints;
    }
}