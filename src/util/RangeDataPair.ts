class RangeAndDataPair {

    values: any[][];

    constructor(readonly range: GoogleAppsScript.Spreadsheet.Range) {      
        this.values = range.getValues(); 
    }

    update(): void {
        this.range.setValues(this.values);
    }

    getLine(index: number): any[] {
        return this.values[index];
    }
}