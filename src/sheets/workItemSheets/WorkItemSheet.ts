abstract class WorkItemSheet extends Sheet implements IWorkItemSheet {

    private workItems: WorkItem[];

    constructor(sheetName: string) {
        super(sheetName);
    }
    
    protected abstract workItemFilter(workItem: WorkItem): boolean;

    setWorkItems(workItems: WorkItem[]) {
        this.workItems = workItems.filter(this.workItemFilter);
    }

    update(): void {
        let rangeValuePairList : RangeAndDataPair[] = this.getDataRangeList().map((range) => new RangeAndDataPair(range));
        this.removeDeleted_(rangeValuePairList);
        this.addNewIds_(rangeValuePairList);
        this.update_(rangeValuePairList);
        rangeValuePairList.forEach(element => {
            element.update();
        });
    }

    private removeDeleted_(rangeList: RangeAndDataPair[]): void {
        const newWorkItemsIds: string[] = this.getNewWorkItemIds_();
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
        const newWorkItemsIds: string[] = this.getNewWorkItemIds_();
        const idRange: RangeAndDataPair = rangeList[this.getWorkItemIdsRangeIndex()];

        let emptyRow: number = 0;

        for (let idIndex: number = 0; idIndex < newWorkItemsIds.length; idIndex++) {
            let workItemId: string = newWorkItemsIds[idIndex];
            let exists: boolean = false;
            // Check if exists
            for (var rowIndex: number = 0; rowIndex < idRange.values.length; rowIndex++) {
                var rowTaskId: string = idRange.values[rowIndex][0] as string;
                if (rowTaskId === workItemId) {
                    exists = true;
                    break;
                }
            }
            // Insert if does not exist
            if (!exists) {
                while(idRange.values[emptyRow][0]) {
                    ++emptyRow;
                }
                idRange.values[emptyRow][0] = workItemId;
            }
        }
    }

    private update_(rangeList: RangeAndDataPair[]): void {
        const idRange: RangeAndDataPair = rangeList[this.getWorkItemIdsRangeIndex()];

        for (let rowIndex: number = 0; rowIndex < idRange.values.length; rowIndex++) {
            let workItemId: string = idRange.values[rowIndex][0] as string;
            if (!workItemId) {
                continue;
            }
            this.updateDataRangesLine(rangeList, rowIndex, this.workItems.find((item) => item.id === workItemId));            
        }
    }

    protected abstract getDataRangeList() : GoogleAppsScript.Spreadsheet.Range[];

    protected abstract updateDataRangesLine(rangeList: RangeAndDataPair[], rowIndex: number, workItem: WorkItem): void;

    private getNewWorkItemIds_(): string[] {
        return this.workItems.map((item) => item.id);
    }

    protected getWorkItemIdsRangeIndex(): number {
        return 1;
    }
}