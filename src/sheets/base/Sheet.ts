abstract class Sheet implements ISheet {

    protected readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(sheetName: string) {
        this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    }

    abstract update() : void;

    onEdit(event: any): void {
        // Must be overriden if onEdit behavior is desired.
    }
}