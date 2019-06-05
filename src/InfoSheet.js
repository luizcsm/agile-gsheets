// Info Sheet
var INFO_SHEET_NAME = "Azure DevOps Info";
var INFO_RANGE = "A2:B8";
var INFO_RANGE_DESCRIPTION_COLUMN = 0;
var INFO_RANGE_VALUE_COLUMN = 1;

// Info sheet functions
function getInfoRange() {
    return getSheetByName(INFO_SHEET_NAME).getRange(INFO_RANGE);
}

function getInfoData() {
    return getInfoRange().getValues();
}

function getConfig() {
    var data = getInfoData();
    var config = {
        organization : assertAndReturnInfo(data, "Organização", "Organização não preenchida."),
        project : assertAndReturnInfo(data, "Projeto", "Projeto não preenchido."),
        team : assertAndReturnInfo(data, "Equipe", "Equipe não preenchida."),
        sprintId : null,
        login : assertAndReturnInfo(data, "Login", "Login não preenchido."),
        accessToken : assertAndReturnInfo(data, "Personal Acess Token", "Token não preenchido.")
    };
    config.sprintId = assertAndReturnInfoSprintId(data, config);

    return config;
}

function assertAndReturnInfo(data, description, message) {
    var returnValue = findInfoValue(data, description);
    if (!returnValue)
        throw message;
    return returnValue;
}

function findInfoValue(data, description) {
    for (var index = 0; index < data.length; index++) {
        if (data[index][0] == description) {
            return data[index][1];
        }
    }
    return null;
}

function assertAndReturnInfoSprintId(data, config) {
    var sprintId = findInfoValue(data, "Id Sprint");
    if (!sprintId) {
        var sprint = assertAndReturnInfo(data, "Sprint", "Sprint não preenchido.");
        sprintId = findSprintIdByName(sprint, config);
        setInfoValue(data, "Id Sprint", sprintId);
    }
    return sprintId;
}

function setInfoValue(data, description, value) {
    for (var index = 0; index < data.length; index++) {
        if (data[index][INFO_RANGE_DESCRIPTION_COLUMN] == description) {
            data[index][INFO_RANGE_VALUE_COLUMN] = value;
            getInfoRange().setValues(data);
            return;
        }
    }
}
