class MySheetProvider implements ISheetProvider {

    getSheets(): ISheet[] {
        let sheets: Array<Sheet> = new Array<Sheet>();
        sheets.push(new TaskRiskAnalysisSheet());
        return sheets;
    }
}