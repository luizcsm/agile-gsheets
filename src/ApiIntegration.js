// API Settings
var API_BASE_URL = "https://dev.azure.com/";
var API_VERSION = "5.0-preview";

// API Paths
var ITERATIONS_PATH = "_apis/work/teamsettings/iterations";
var WORK_ITEMS_PATH = "_apis/wit/workitems";

function getHeaders(login, accessToken)
{
  var authHeader = 'Basic ' + Utilities.base64Encode(login + ':' + accessToken);
  
  var headers = {
    'Accept' : 'application/json',
    'Authorization' : authHeader
  };
  return headers;
}

function findSprintIdByName(sprint, config) {
  var url = API_BASE_URL + config.organization + '/' + config.project + '/' + config.team + '/' + ITERATIONS_PATH + '?api-version=' + API_VERSION;
  var options = {
    'method' : 'get',
    'headers' : getHeaders(config.login, config.accessToken)
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  Logger.log('Obtendo lista de iterações:\n' + json);
  var sprints = JSON.parse(json);
  if (sprints && sprints.count > 0) {
    for (var i = 0; i < sprints.count; i++) {
      if (sprints.value[i].name == sprint) {
        return sprintId = sprints.value[i].id;
      }
    }
  }
  throw "Sprint " + sprint + " não encontrado";
}

function getTasks(config) {
  var taskIds = getTaskIds(config);
  var tasks = [];
  if (taskIds && taskIds.length) {
    for (var i = 0; i < taskIds.length; i++) {
      var taskId = taskIds[i];
      var task = getTask(config, taskId.task);
      if (isCurrentTask(task)) {
        tasks.push(task);
      }
    }
  }
  return tasks;
}

function isCurrentTask(task) {
  return task.fields['System.WorkItemType'] == "Task" && !hasExclusiveTag(task);
}

function hasExclusiveTag(task) {
  var tags = task.fields['System.Tags'];
  return tags && (tags.indexOf("PENDÊNCIA") != -1 || tags.indexOf("Lembrete") != -1 || tags.indexOf("Sprint Anterior") != -1);
}

function getTaskIds(config) {
  var url = API_BASE_URL + config.organization + '/' + config.project + '/' + config.team + '/' + ITERATIONS_PATH + '/' + config.sprintId + '/' +
    'workitems?api-version=' + API_VERSION;
  var options = {
    'method' : 'get',
    'headers' : getHeaders(config.login, config.accessToken)
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  Logger.log('Obtendo lista de itens da iteração:\n' + json);
  
  var taskIds = [];
  var userStories = JSON.parse(json);
  if (userStories) {
    var relations = userStories.workItemRelations;
    if (relations && relations.length > 0) {
      for (var i = 0; i < relations.length; i++) {
        var relation = relations[i];
        if (relation.rel == "System.LinkTypes.Hierarchy-Forward") {
          taskIds.push({
            'userStory' : relation.source.id,
            'task' : relation.target.id
          });
        }
      }
    }
  }
  return taskIds;
}

function getTask(config, taskId) {
  var url = API_BASE_URL + config.organization + '/' + config.project + '/' + WORK_ITEMS_PATH + '/' + taskId +
    '?api-version=' + API_VERSION;
  
  var options = {
    'method' : 'get',
    'headers' : getHeaders(config.login, config.accessToken)
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  Logger.log('Obtendo detalhes de tarefa:\n' + json);
  return JSON.parse(json);
}

function patchTask(config, taskId, payload) {
  var url = API_BASE_URL + config.organization + '/' + config.project + '/' + WORK_ITEMS_PATH + '/' + taskId +
    '?api-version=' + API_VERSION;
  
  var json = JSON.stringify(payload);
  
  var options = {
    'method' : 'patch',
    'contentType': 'application/json-patch+json',    
    'headers' : getHeaders(config.login, config.accessToken),
    'payload' : json
  };
  
  Logger.log('Atualizando tarefa ' + taskId + ':\n' + json);
  var response = UrlFetchApp.fetch(url, options);
  json = response.getContentText();
  Logger.log('Resultado obtido ao atualizar a tarefa ' + taskId + ':\n' + json);
  return JSON.parse(json);
}