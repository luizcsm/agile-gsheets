abstract class Sheet implements ISheet {

    protected readonly sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(sheetName: string) {
        this.sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    }

    abstract update() : void;
}