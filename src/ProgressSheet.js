// Progress Sheet
var PROGRESS_SHEET_NAME = "Acompanhamento";
var PROGRESS_DATA_RANGE = "A3:O42";
var PROGRESS_DATA_RANGE_FIRST_ROW = 3;
var PROGRESS_DATA_RANGE_FIRST_COLUMN = 1;
var PROGRESS_DATA_RANGE_DEVELOPMENT_REMAINING_HOURS_COLUMN = 6;
var PROGRESS_DATA_RANGE_VALIDATION_REMAINING_HOURS_COLUMN = 8;
var PROGRESS_DATA_RANGE_DEVELOPER_NAME_COLUMN = 13;
var PROGRESS_DATA_RANGE_VALIDATOR_NAME_COLUMN = 14;

var PROGRESS_TOTAL_COMPLETED_POINTS_RANGE = "I1";
var PROGRESS_WIP_RANGE = "K1";

var PROGRESS_TASK_INFO_RANGE = "A3:D42";
var PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN = 0;
var PROGRESS_TASK_INFO_RANGE_TASK_TITLE_COLUMN = 2;
var PROGRESS_TASK_INFO_RANGE_TASK_POINTS_COLUMN = 3;

var PROGRESS_ORIGINAL_ESTIMATIVE_RANGE = "E3:E43";

var PROGRESS_VALIDATION_PERCENT_RANGE = "F3:F42";

var PROGRESS_DEVELOPMENT_REMAINING_HOURS_RANGE = "G3:G42";

var PROGRESS_VALIDATION_REMAINING_HOURS_RANGE = "I3:I42";

var PROGRESS_SPENT_HOURS_RANGE = "L3:L42";

var PROGRESS_STATUS_AND_RESPONSIBLES_RANGE = "M3:O42";

// Progress sheet functions
function getProgressDataRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_DATA_RANGE);
}

function getProgressData() {
  return getProgressDataRange().getValues();
}

function getProgressTaskInfoRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_TASK_INFO_RANGE);
}

function getProgressTaskInfoData() {
  return getProgressTaskInfoRange().getValues();
}

function getProgressOriginalEstimativeRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_ORIGINAL_ESTIMATIVE_RANGE);
}

function getProgressOriginalEstimativeData() {
  return getProgressOriginalEstimativeRange().getValues();
}

function getProgressValidationPercentRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_VALIDATION_PERCENT_RANGE);
}

function getProgressValidationPercentData() {
  return getProgressValidationPercentRange().getValues();
}

function getProgressDevelopmentRemainingHoursRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_DEVELOPMENT_REMAINING_HOURS_RANGE);
}

function getProgressDevelopmentRemainingHoursData() {
  return getProgressDevelopmentRemainingHoursRange().getValues();
}

function getProgressValidationRemainingHoursRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_VALIDATION_REMAINING_HOURS_RANGE);
}

function getProgressValidationRemainingHoursData() {
  return getProgressValidationRemainingHoursRange().getValues();
}

function getProgressSpentHoursRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_SPENT_HOURS_RANGE);
}

function getProgressSpentHoursData() {
  return getProgressSpentHoursRange().getValues();
}

function getProgressStatusAndResponsiblesRange() {
  return getSheetByName(PROGRESS_SHEET_NAME).getRange(PROGRESS_STATUS_AND_RESPONSIBLES_RANGE);
}

function getProgressStatusAndResponsiblesData() {
  return getProgressStatusAndResponsiblesRange().getValues();
}

function getProgressDataRangeColumnByIndex(index) {
  return index + PROGRESS_DATA_RANGE_FIRST_COLUMN;
}

function getProgressDataRangeRowByIndex(index) {
  return index + PROGRESS_DATA_RANGE_FIRST_ROW;
}

function updateProgress(tasks) {
  var taskInfoData = getProgressTaskInfoData();
  var validationPercentData = getProgressValidationPercentData();
  var developmentRemainingHoursData = getProgressDevelopmentRemainingHoursData();
  var validationRemainingHoursData = getProgressValidationRemainingHoursData();
  var spentHoursData = getProgressSpentHoursData();
  var statusAndResponsiblesData = getProgressStatusAndResponsiblesData();
  
  deleteMissingProgressTasks(taskInfoData, validationPercentData, developmentRemainingHoursData, validationRemainingHoursData, spentHoursData, statusAndResponsiblesData, tasks);
  insertProgressNewTasks(taskInfoData, tasks);
  updateProgressTasks(taskInfoData, validationPercentData, developmentRemainingHoursData, validationRemainingHoursData, spentHoursData, tasks);
  
  getProgressTaskInfoRange().setValues(taskInfoData);
  getProgressValidationPercentRange().setValues(validationPercentData);
  getProgressDevelopmentRemainingHoursRange().setValues(developmentRemainingHoursData);
  getProgressValidationRemainingHoursRange().setValues(validationRemainingHoursData);
  getProgressSpentHoursRange().setValues(spentHoursData);
  getProgressStatusAndResponsiblesRange().setValues(statusAndResponsiblesData);
}

function deleteMissingProgressTasks(taskInfoData, validationPercentData, developmentRemainingHoursData, validationRemainingHoursData, spentHoursData, statusAndResponsiblesData, tasks) {
  var existingIds = [];
  if (tasks) {
    for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      existingIds.push(tasks[taskIndex].id);
    }
  }
  for (var dataIndex = 0; dataIndex < taskInfoData.length; dataIndex++) {
    if (!taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN] || existingIds.indexOf(taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN]) < 0) {
      var taskInfoRow = taskInfoData[dataIndex];
      for (var column = 0; column < taskInfoRow.length; column++) {
        taskInfoRow[column] = "";
      }
      validationPercentData[dataIndex] = [""];
      developmentRemainingHoursData[dataIndex] = [""];
      validationRemainingHoursData[dataIndex] = [""];
      spentHoursData[dataIndex] = [""];
      var statusAndResponsiblesRow = statusAndResponsiblesData[dataIndex];
      for (var column = 0; column < statusAndResponsiblesRow.length; column ++) {
        statusAndResponsiblesRow[column] = "";
      }
    }
  }
}

function insertProgressNewTasks(data, tasks) {
  if (!tasks || tasks.length == 0) {
    return;
  }
  
  var emptyRow = 0;
  for (var taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
    var task = tasks[taskIndex];
    var exists = false;
    for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
      var value = data[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN];
      if (value == task.id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      while (data[emptyRow][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN]) {
        emptyRow++;
      }
      data[emptyRow][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN] = task.id;
    }
  }
}

function updateProgressTasks(taskInfoData, validationPercentData, developmentRemainingHoursData, validationRemainingHoursData, spentHoursData, tasks) {
  if (!tasks || tasks.lenght == 0) {
    return;
  }
  var originalEstimativeData = getProgressOriginalEstimativeData();
  for (var dataIndex = 0; dataIndex < taskInfoData.length; dataIndex++) {
    var taskId = taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN];
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
    taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_TITLE_COLUMN] = task.fields['System.Title'];
    var storyPoints = task.fields['Microsoft.VSTS.Scheduling.StoryPoints'];
    if (!storyPoints) {
      storyPoints = 0;
    }
    taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_POINTS_COLUMN] = storyPoints;
    var originalEstimative = originalEstimativeData[dataIndex][0];
    if (originalEstimative)
    {
      var remainingHours = task.fields['Microsoft.VSTS.Scheduling.RemainingWork'];
      if (!remainingHours) {
        remainingHours = 0;
      }
      var validationPercent = validationPercentData[dataIndex][0];
      if (!validationPercent) {
        validationPercent = 0;
      }
      var validationOriginalEstimative = originalEstimative * validationPercent;
      var remainingHoursOverValidation = remainingHours - validationOriginalEstimative;
      if (remainingHoursOverValidation < 0) {
        remainingHoursOverValidation = 0;
      }
      var validationRemainingHours = remainingHours - remainingHoursOverValidation;
      if (validationRemainingHours < 0) {
        validationRemainingHours = 0;
      }
      developmentRemainingHoursData[dataIndex] = [remainingHoursOverValidation];
      validationRemainingHoursData[dataIndex] = [validationRemainingHours];
    }
    var spentHours = task.fields['Microsoft.VSTS.Scheduling.CompletedWork'];
    if (!spentHours) {
      spentHours = 0;
    }
    spentHoursData[dataIndex] = [spentHours];
  }
}

function updateProgressTaskColor()
{
  var data = getProgressData();
  var sheet = getSheetByName(PROGRESS_SHEET_NAME);
  for (var dataIndex = 0; dataIndex < data.length; dataIndex++)
  {
    var developerName = data[dataIndex][PROGRESS_DATA_RANGE_DEVELOPER_NAME_COLUMN];
    var developerColor = getColorOf(developerName);
    
    var validatorName = data[dataIndex][PROGRESS_DATA_RANGE_VALIDATOR_NAME_COLUMN];
    var validatorColor = getColorOf(validatorName);
    
    var row = getProgressDataRangeRowByIndex(dataIndex);
    
    var developerField = sheet.getRange(row, getProgressDataRangeColumnByIndex(PROGRESS_DATA_RANGE_DEVELOPER_NAME_COLUMN));
    developerField.setBackground(developerColor);
    
    var developmentField = sheet.getRange(row, getProgressDataRangeColumnByIndex(PROGRESS_DATA_RANGE_DEVELOPMENT_REMAINING_HOURS_COLUMN));
    developmentField.setBackground(developerColor);    
    
    var validatorField = sheet.getRange(row, getProgressDataRangeColumnByIndex(PROGRESS_DATA_RANGE_VALIDATOR_NAME_COLUMN));
    validatorField.setBackground(validatorColor);
    
    var validationField = sheet.getRange(row, getProgressDataRangeColumnByIndex(PROGRESS_DATA_RANGE_VALIDATION_REMAINING_HOURS_COLUMN));
    validationField.setBackground(validatorColor);
  }
}

function exportOriginalEstimative(config, tasks)
{
  if (!tasks || tasks.length == 0) {
    return;
  }
  
  var taskInfoData = getProgressTaskInfoData();
  var originalEstimativeData = getProgressOriginalEstimativeData();
  
  for (var dataIndex = 0; dataIndex < taskInfoData.length; dataIndex++) {
    var taskId = taskInfoData[dataIndex][PROGRESS_TASK_INFO_RANGE_TASK_ID_COLUMN];
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
    
    var originalEstimative = originalEstimativeData[dataIndex][0];
    if (!originalEstimative) {
      originalEstimative = 0;
    }
    originalEstimative = (originalEstimative).toFixed(2);
    
    if (task.fields['Microsoft.VSTS.Scheduling.OriginalEstimate'] != originalEstimative) {
      
      var payload = [
        {
          "op": "test",
          "path": "/rev",
          "value": task.rev
        },
        {
          "op": "add",
          "path": "/fields/Microsoft.VSTS.Scheduling.OriginalEstimate",
          "value": originalEstimative
        }
      ];
      
      if (!task.fields['Microsoft.VSTS.Scheduling.RemainingWork'] && task.fields['System.State'] == 'New') {
        payload.push(
          {
            "op": "add",
            "path": "/fields/Microsoft.VSTS.Scheduling.RemainingWork",
            "value": originalEstimative
          });
      }
      
      payload.push(
        {
          "op": "add",
          "path": "/fields/System.History",
          "value": "Atualizando estimativa original através de script."
        });
      
      tasks[taskIndex] = patchTask(config, taskId, payload);
    }
  }
}