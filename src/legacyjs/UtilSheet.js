// Util Sheet
var UTIL_SHEET_NAME = "Útil";
var UTIL_DATA_RANGE_FIRST_ROW = 3;
var UTIL_DATA_RANGE_FIRST_COLUMN = 1;
var UTIL_DATA_RANGE_COLOR_VALUE_COLUMN = 23;

var UTIL_COLOR_RANGE = "W3:X9"
var UTIL_COLOR_RANGE_COLOR_NAME_COLUMN = 0;

// Util Sheet Function
function getUtilColorRange() {
    return getSheetByName(UTIL_SHEET_NAME).getRange(UTIL_COLOR_RANGE);
}

function getUtilColorData() {
    return getUtilColorRange().getValues();
}

function getUtilDataRangeColumnByIndex(index) {
    return index + UTIL_DATA_RANGE_FIRST_COLUMN;
}

function getUtilDataRangeRowByIndex(index) {
    return index + UTIL_DATA_RANGE_FIRST_ROW;
}


function getUtilToleranceRiskTaskMediumCount()
{
  getSheetByName(UTIL_SHEET_NAME).getRange("F11");
}

function getUtilToleranceRiskTaskHighCount()
{
  getSheetByName(UTIL_SHEET_NAME).getRange("F12");
}

function getUtilToleranceRiskTaskMediumTolerance()
{
  getSheetByName(UTIL_SHEET_NAME).getRange("F13");
}

function getUtilToleranceRiskTaskHighTolerance()
{
  getSheetByName(UTIL_SHEET_NAME).getRange("F14");
}

function getColorOf(name)
{
    var color = "#ffffff";
    var colorData = getUtilColorData();
    for (var dataIndex = 0; dataIndex < colorData.length; dataIndex++)
    {
        var currentName = colorData[dataIndex][UTIL_COLOR_RANGE_COLOR_NAME_COLUMN];
        if (currentName == name) {
            var row = getUtilDataRangeRowByIndex(dataIndex);
            var column = getUtilDataRangeColumnByIndex(UTIL_DATA_RANGE_COLOR_VALUE_COLUMN);
            color = getSheetByName(UTIL_SHEET_NAME).getRange(row, column).getBackground();
            return color;
        }
    }
    return color;
}

function activateSheet(nameOfSheet)
{
   var ss = SpreadsheetApp.getActive();
   var sheet = ss.getSheetByName(nameOfSheet);
   sheet.activate();
}
