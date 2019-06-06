function copyModelMissingSheetsToThisSpreadsheet():void
{
    let originSpreadSheet = SpreadsheetApp.openById(MODEL_ID_DOCUMENT);
    
    let originSheetsNames = getSheetsNames(originSpreadSheet);

    let destinySpreadSheet = SpreadsheetApp.getActiveSpreadsheet();

    let destinySpreadSheetNames = getSheetsNames(destinySpreadSheet);

    let modelMissingSheets = originSheetsNames.filter(name => {
        return !destinySpreadSheetNames.contains(name);
    });

    modelMissingSheets.forEach(missingSheet =>
        {
            let newSheet = originSpreadSheet.getSheetByName(missingSheet).copyTo(originSpreadSheet);
            newSheet.setName(missingSheet);
        }
    );
}

function getSheetsNames(SpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    return SpreadSheet.getSheets().map(sheet => {
        return sheet.getName();
    });
}

var MODEL_ID_DOCUMENT:string =  "1JPnGrxMKlX9fc1G7il7E_ESqNjVbTi-wbCOr4Lc8w9E"

interface Array<T>{
    contains(objecto: any): boolean;
}

Array.prototype.contains = function(object: any): boolean {
    return this.filter(element => {
        return element == object;
    }).length > 0;
}