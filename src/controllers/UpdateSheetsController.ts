class UpdateSheetsController {

    constructor(
        private readonly workItemFetcher: IWorkItemFetcher,
        private readonly sheetProvider: ISheetProvider) {
    }

    update() {
        let iteration: string = "x";
        let workItems = this.workItemFetcher.listIterationWorkItems(iteration)

        for (const sheet of this.sheetProvider.getSheets()) {

            let workItemSheet = sheet as IWorkItemSheet;
            if (workItemSheet.setWorkItems) {
                workItemSheet.setWorkItems(workItems);
            }
            sheet.update();
        }
    }
}