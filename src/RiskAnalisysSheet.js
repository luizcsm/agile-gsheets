// Risk Analisys Sheet
var RISK_ANALISYS_SHEET_NAME = "Análise de Risco";

var RISK_ANALISYS_TASK_INFO_RANGE = "A3:C41"
var RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN = 0;
var RISK_ANALISYS_TASK_INFO_RANGE_TITLE_COLUMN = 1;
var RISK_ANALISYS_TASK_INFO_RANGE_POINTS_COLUMN = 2;

var RISK_ANALISYS_TASK_CHECKLIST_RANGE = "F3:T41";

// Risk Analisys Sheet functions
function getRiskAnalisysTaskInfoRange() {
    return getSheetByName(RISK_ANALISYS_SHEET_NAME).getRange(RISK_ANALISYS_TASK_INFO_RANGE);
}

function getRiskAnalisysTaskInfoData() {
    return getRiskAnalisysTaskInfoRange().getValues();
}

function getRiskAnalisysTaskChecklistRange() {
    return getSheetByName(RISK_ANALISYS_SHEET_NAME).getRange(RISK_ANALISYS_TASK_CHECKLIST_RANGE);
}

function getRiskAnalisysTaskChecklistData() {
    return getRiskAnalisysTaskChecklistRange().getValues();
}

function updateRiskAnalisys(tasks) {
    var taskInfoData = getRiskAnalisysTaskInfoData();
    var taskChecklistData = getRiskAnalisysTaskChecklistData();

    deleteMissingRiskAnalisysTasks(taskInfoData, taskChecklistData, tasks);
    insertRiskAnalisysNewTasks(taskInfoData, tasks);
    updateRiskAnalisysTasks(taskInfoData, tasks);

    getRiskAnalisysTaskInfoRange().setValues(taskInfoData);
    getRiskAnalisysTaskChecklistRange().setValues(taskChecklistData);
}

function deleteMissingRiskAnalisysTasks(taskInfoData, taskChecklistData, tasks) {
    var existingIds = [];
    if (tasks) {
        for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
            existingIds.push(tasks[taskIndex].id);
        }
    }
    for (var dataIndex = 0; dataIndex < taskInfoData.length; dataIndex++) {
        if (!taskInfoData[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN] || existingIds.indexOf(taskInfoData[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN]) < 0) {
            var taskInfoRow = taskInfoData[dataIndex];
            for (var column = 0; column < taskInfoRow.length; column++) {
                taskInfoRow[column] = "";
            }
            var taskChecklistRow = taskChecklistData[dataIndex];
            for (var column = 0; column < taskChecklistRow.length; column ++) {
                taskChecklistRow[column] = "";
            }    
        }
    }
}

function insertRiskAnalisysNewTasks(data, tasks) {
    if (!tasks || tasks.length == 0) {
        return;
    }

    var emptyRow = 0;
    for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        var task = tasks[taskIndex];
        var exists = false;
        for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
            var value = data[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN];
            if (value == task.id) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            while (data[emptyRow][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN]) {
                emptyRow++;
            }
            data[emptyRow][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN] = task.id;
        }
    }
}

function updateRiskAnalisysTasks(data, tasks) {
    if (!tasks || tasks.lenght == 0) {
        return;
    }
    for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
        var taskId = data[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_TASK_ID_COLUMN];
        if (!taskId) {
            continue;
        }
        var task = null;
        for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
            if (tasks[taskIndex].id == taskId) {
                task = tasks[taskIndex];
                break;
            }
        }
        data[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_TITLE_COLUMN] = task.fields['System.Title'];
        var storyPoints = task.fields['Microsoft.VSTS.Scheduling.StoryPoints'];
        if (!storyPoints) {
            storyPoints = 0;
        }
        data[dataIndex][RISK_ANALISYS_TASK_INFO_RANGE_POINTS_COLUMN] = storyPoints;
    }
}

function setRecomendation()
{
  var range = getSheetByName(RISK_ANALISYS_SHEET_NAME).getRange("B1");
  range.setValue(getRecomendationAboutStartBuild());
  
  if(canStartBuild())
  {
   range.setFontColor('green');
  }
  else
  {
    range.setFontColor('red');
  }
}

function getRecomendationAboutStartBuild()
{
   if(canStartBuild())
   {
      return "A quantidade de tasks com risco médio e alto estão dentro do tolerado, o build pode começar!";   
   }
   else
   {
     return "A quantidade de tasks com risco médio e alto não estão dentro do tolerado, recomenda-se NÃO começar o build";   
   }
}

function canStartBuild()
{
  var util = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Útil");
  var mediumPorcentage = util.getRange("F11").getValues()[0];
  var highPorcentage = util.getRange("F12").getValues()[0];
  
  var mediumTolerance = util.getRange("F13").getValues()[0];
  var highTolerance = util.getRange("F14").getValues()[0];
  
   var mediumIsOk = mediumPorcentage < mediumTolerance;
   var highIsOK = highPorcentage < highTolerance;
  
  return mediumIsOk && highIsOK;
}


