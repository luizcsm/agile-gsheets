// Burndown Sheet
var BURNDOWN_SHEET_NAME = "Burndown";

var BURNDOWN_DAY_DATA_RANGE = "B5:B30";
var BURNDOWN_LEFT_POINTS = "G5:G30";
var BURNDOWN_FINISHED_POINTS = "H5:H30";
var BURNDOWN_WIP = "I5:I30";

var BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE = "H5:I30";
var BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE_FINISHED_POINTS_COLUMN = 0;
var BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE_WIP_COLUMN = 1;

function getFinishedPoints() {
  return +getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_TOTAL_COMPLETED_POINTS_RANGE).getValue().toFixed(2);
}

function getWip() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_WIP_RANGE).getValue();
}

function getBurndownDayDataRange() {
  return getSheetByName(BURNDOWN_SHEET_NAME).getRange(BURNDOWN_DAY_DATA_RANGE);
}

function getBurndownDayData() {
  return getBurndownDayDataRange().getValues();
}

function getBurndownFinishedPointsAndWipDataRange() {
  return getSheetByName(BURNDOWN_SHEET_NAME).getRange(BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE);
}

function getBurndownFinishedPointsAndWipData() {
  return getBurndownFinishedPointsAndWipDataRange().getValues();
}

function updateBurndown() {
  var burndownDayData = getBurndownDayData();  
  var todayRow = getBurndownTodayRow(burndownDayData);
  
  var finishedPoints = getFinishedPoints();
  var wip = getWip();
  
  var finishedPointsAndWipData = getBurndownFinishedPointsAndWipData();

  finishedPointsAndWipData[todayRow][BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE_FINISHED_POINTS_COLUMN] = finishedPoints;
  finishedPointsAndWipData[todayRow][BURNDOWN_FINISHED_POINTS_AND_WIP_RANGE_WIP_COLUMN] = wip;

  getBurndownFinishedPointsAndWipDataRange().setValues(finishedPointsAndWipData);
}

function getBurndownTodayRow(burndownDayData) {

  if (!burndownDayData) {
    return null;
  }

  var today = new Date();
  
  for (var dataIndex = 0; dataIndex < burndownDayData.length; dataIndex++)
  {  
    var day = burndownDayData[dataIndex][0];

    if (day && areDatesEqual(today, day))
    {
      return dataIndex;
    }
  }
  return null;
}

function areDatesEqual(data1, data2)
{
  return data1.getDate() + "/" + data1.getMonth() + "/" + data1.getFullYear() == data2.getDate() + "/" + data2.getMonth() + "/" +data2.getFullYear();
}
