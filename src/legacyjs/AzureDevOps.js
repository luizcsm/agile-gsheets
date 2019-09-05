// Event Registering functions
function onOpen(e) {
  SpreadsheetApp.getUi()
  .createAddonMenu()
  .addItem('Importar Tarefas', 'importTasksEvent')
  .addItem('Exportar estimativas', 'exportOriginalEstimativeEvent')
  .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function onEdit(e)
{
  var row = e.range.getRowIndex();
  var column = e.range.getColumnIndex();
  
  if(e.range.getSheet().getSheetName()=="Acompanhamento" && row>=3 & column>=14)
  {  
    updateProgressTaskColor();
  }
  if(e.range.getSheet().getSheetName()=="Info")
  {
    updateGaVBurndown();
  }
  
  if(e.range.getSheet().getSheetName()=="Análise de Risco" || e.range.getSheet().getSheetName()=="Útil")
  {
    setRecomendation();
  }
}

// Registered events
function importTasksEvent() {
  var config = getConfig();
  var tasks = getTasks(config);
  updateRiskAnalisys(tasks);
  updateProgress(tasks);
  updateBurndown();
  updateGaVBurndown();
  activateSheet("Burndown");
}

function exportOriginalEstimativeEvent() {
  var config = getConfig();
  var tasks = getTasks(config);
  exportOriginalEstimative(config, tasks);
  updateProgress(tasks);
}

// Helper functions
function getSheetByName(name) {
  
   return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}