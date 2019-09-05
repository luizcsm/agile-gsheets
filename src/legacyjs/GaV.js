var SPRINT_NAME = "B5";
var TEAM = "B4";
var SEPARATOR = " - ";

function getColorOfSquadRealPoints() {
  var color = SpreadsheetApp.getActive().getSheetByName("Útil").getRange("AA3").getBackground();
  return color;
}

function getColorOfLeftPoints()
{
  var color = SpreadsheetApp.getActive().getSheetByName("Útil").getRange("AA4").getBackground();
  return color;
}

function getColorOfWIP()
{
  var color = SpreadsheetApp.getActive().getSheetByName("Útil").getRange("AA5").getBackground();
  return color;
}

function buildTitleGaVName()
{
  var ss = SpreadsheetApp.getActive().getSheetByName(INFO_SHEET_NAME);
  return String(ss.getRange(TEAM).getValue()).split(SEPARATOR)[1] + SEPARATOR + ss.getRange(SPRINT_NAME).getValue();
}

function updateGaVBurndown()
{
  var sheet = SpreadsheetApp.getActive().getSheetByName('Burndown GaV');
  var name = sheet.getName();
  var chart = sheet.getCharts();
  
  if(chart.length>0)
  {
     chart = chart[0];
      var updatedChart = chart.modify().asAreaChart().setColors([getColorOfLeftPoints(),getColorOfSquadRealPoints(), getColorOfWIP()])
              .setTitle(buildTitleGaVName()).build();
     sheet.updateChart(updatedChart);
  }
}

