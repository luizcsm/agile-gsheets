abstract class WorkItemSheet extends BaseSheet {

    readonly workItems: WorkItem[];

    constructor(sheetName: string, workItems: WorkItem[]) {
        super(sheetName);
        this.workItems = workItems.filter(this.workItemFilter);
    }
    
    abstract workItemFilter(workItem: WorkItem): boolean;

    update(): void {
        let rangeValuePairList : RangeAndDataPair[] = this.getDataRangeList().getRanges().map((range) => new RangeAndDataPair(range));
        this.removeDeleted_(rangeValuePairList);
        this.addNewIds_(rangeValuePairList);
        this.update_(rangeValuePairList);
        rangeValuePairList.forEach(element => {
            element.update();
        });
    }

    private removeDeleted_(rangeList: RangeAndDataPair[]): void {
        const newWorkItemsIds = this.getNewWorkItemIds_();
        const idRange: RangeAndDataPair = rangeList[this.getWorkItemIdsRangeIndex()];
        for (let idIndex = 0; idIndex < idRange.values[0].length; idIndex++) {
            const element: string = idRange[0][idIndex];
            if (!element || !newWorkItemsIds.contains(element)) {
                rangeList.forEach(range => {
                    for (let columnIndex = 0; columnIndex < range.values[idIndex].length; columnIndex++) {
                        range.values[idIndex][columnIndex] = "";                        
                    }
                });
            }
        }
    }

    private addNewIds_(rangeList: RangeAndDataPair[]): void {
        throw new Error("NotImplemented");
    }

    private update_(rangeList: RangeAndDataPair[]): void {
        throw new Error("NotImplemented");
    }

    protected abstract getDataRangeList() : GoogleAppsScript.Spreadsheet.RangeList;

    protected abstract updateDataRangesLine(rangeList: RangeAndDataPair[], lineIndex: number, workItem: WorkItem): void;

    private getNewWorkItemIds_(): string[] {
        return this.workItems.map((item) => item.id);
    }

    protected getWorkItemIdsRangeIndex(): number {
        return 1;
    }
}