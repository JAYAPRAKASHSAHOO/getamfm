function BindEmployeeDDL(value) {
    if (value.length >= 3) {
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql('SELECT * FROM AssignmentTable WHERE AssignmentText like ? LIMIT 50 COLLATE NOCASE', ['%' + value + '%'], BindEmployeeDropDown, function (tx, error) {
            });
        });
    }
    else {
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find("#adhocEmployee option:gt(0)").remove();
        $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");
    }
}

function BindEmployeeDropDown(ts, result) {
    var pageID = $.mobile.activePage.attr("id");
    var optiontag;
    var item;
    $("#" + pageID).find("#adhocEmployee option:gt(0)").remove();
    $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");

    if (result.rows.length === 0) {
        var option = '<option value="-2">' + GetCommonTranslatedValue("NoRecordFound") + '</option>';
        $("#" + pageID).find("#adhocEmployee").append(option);
        $("#" + pageID).find("#adhocEmployee").val("-2");
        //$("#" + pageID).find("#adhocEmployee").selectmenu("disable");
        $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");
        return false;
    }
    if (result.rows.length == 1) {
        item = result.rows.item(0);
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", item.AssignmentID);
        optiontag.innerHTML = item.AssignmentText;
        $("#" + pageID).find("#adhocEmployee").append(optiontag);
        $("#" + pageID).find("#adhocEmployee").val(item.AssignmentID);
        $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");
        //$("#" + pageID).find("#employeeTextBox").val(item["AssignmentText"]);
        return false;
    }

    if (result.rows.length > 1) {        
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", "-3");
        optiontag.innerHTML = "-- [ " + result.rows.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $("#" + pageID).find("#adhocEmployee").append(optiontag);
        for (i = 0; i < result.rows.length; i++) {
            item = result.rows.item(i);
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", item.AssignmentID);
            optiontag.innerHTML = item.AssignmentText;
            $("#" + pageID).find("#adhocEmployee").append(optiontag);
        }
        $("#" + pageID).find("#adhocEmployee").val("-3");
    }
    $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");
}


function getInspTemplate() {
    var pageID = $.mobile.activePage.attr("id");
    var resultLength = 0;    
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var inspTemplateURL = standardAddress + "Inspection.ashx?methodname=GetAdhocInspectionData";

    if (navigator.onLine) {
        $.postJSON(inspTemplateURL, myJSONobject, function (data) {
            if (data.length > 0) {
                resultLength = data.length;
                for (i = 0; i < data.length; i++) {
                    var optiontag = document.createElement('option');
                    optiontag.setAttribute("value", data[i].InspectionTemplateID);
                    optiontag.innerHTML = data[i].Altkey;
                    $("#" + pageID).find("#inspectionTemplateDDL").append(optiontag);
                }
                $("#" + pageID).find("#inspectionTemplateDDL").selectmenu("refresh");
                $("#" + pageID).find("#inspAdhocPriority").text(data[resultLength - 1].AdhocInspDefaultPriority);
            }
        });
    }
}

function CreateAdhocInsp() {
    var pageID = $.mobile.activePage.attr("id");
    if ($('#' + pageID).find('#SPidDDL').val() == -1) {
        showError($('#SStCityLabel').text().replace(':', '') + GetTranslatedValue('adhocMandatoryMsg') + $('#SStCityLabel').text().replace(':', ''));
        return false;
    }
    else if ($('#' + pageID).find('#SFloorValue').val() == -1) {
        showError($('#SFloorLabel').text().replace(':', '') + GetTranslatedValue('adhocMandatoryMsg') + $('#SFloorLabel').text().replace(':', ''));
        return false;
    }
    else if ($('#' + pageID).find('#SRoomValue').val() == -1) {
        showError($('#SRoomLabel').text().replace(':', '') + GetTranslatedValue('adhocMandatoryMsg') + $('#SRoomLabel').text().replace(':', ''));
        return false;
    }
    else if ($('#' + pageID).find('#inspectionTemplateDDL').val() == -1) {
        showError($('#inspectionTemplateLabel').text().replace(':', '') + GetTranslatedValue('adhocMandatoryMsg') + $('#inspectionTemplateLabel').text().replace(':', ''));
        return false;
    }
    else if ($('#' + pageID).find('#adhocEmployee').val() == -1 || $('#' + pageID).find('#adhocEmployee').val() == -3) {
        showError($('#empLabel').text().replace(':', '') + GetTranslatedValue('adhocMandatoryMsg') + $('#empLabel').text().replace(':', ''));
        return false;
    }

    var toFetchSiteNum = $('#' + pageID).find('#SRoomValue').val();
    var toFetchDivReg = ($('#' + pageID).find('#SPidDDL').val()).split('|');
    var divDescription = $('#' + pageID).find('#SPidDDL option:selected').text();
    var custNum = toFetchSiteNum.substring(toFetchSiteNum.indexOf('}') + 1, toFetchSiteNum.indexOf('['));
    var custSiteNum = toFetchSiteNum.substring(toFetchSiteNum.indexOf('[') + 1, toFetchSiteNum.length);
    var inspTemplate = $('#' + pageID).find('#inspectionTemplateDDL').val();
    var assignedEmp = $('#' + pageID).find('#adhocEmployee').val(); 
    var data = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "CustomerNumber": custNum,
        "CustomerSiteNumber": custSiteNum,
        "InspectionTemplate": inspTemplate,
        "AssignedEmployeeNumber": assignedEmp,
        "CreatedEmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "GPSLocation": GlobalLat + "," + GlobalLong,
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    var adhocInspectionURL = standardAddress + "Inspection.ashx?methodname=CreateAdhocInspection";
    if (navigator.onLine) {
        showLoading();
        $.postJSON(adhocInspectionURL, data, function (resultData) {
            if ((resultData[0].ReturnMessage).length !== 0) {
                closeLoading();
                setTimeout(function () {
                    showError(resultData[0].ReturnMessage);
                }, 500);                
            }
            else {
                if (assignedEmp == decryptStr(localStorage.getItem("EmployeeNumber"))) {
                    localStorage.setItem("RegionNumber", toFetchDivReg[1]);
                    localStorage.setItem("DivisionNumber",toFetchDivReg[0]);
                    localStorage.setItem("DivisionDescription", divDescription);
                    localStorage.setItem("InspectionNumber", resultData[0].inspNumber);
                    localStorage.setItem("InspectionWorkOrderNumber", resultData[0].WorkOrderNumber);
                    ////closeLoading();
                    if (navigator.onLine) {
                        $.mobile.changePage("InspectionAreas.html");
                    }
                }
                else {
                    var adhocInspMsg = GetTranslatedValue('adhocSuccessMsg') + resultData[0].WorkOrderNumber + GetTranslatedValue('adhocAnd') + resultData[0].inspNumber;
                    $('#' + pageID).find('#AdhocInspSuccessMsg').text(adhocInspMsg);
                    closeLoading();
                    setTimeout(function () {
                        $('#' + pageID).find('#AdhocInspSuccessPopup').popup('open');
                    }, 500);

                }
            }
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function CloseAdhocSuccessPopup() {
    $('#AdhocInspSuccessPopup').popup('close');
    $('#AdhocInspSuccessMsg').text('');
    ResetAdhoc();
}

function InspectionAdhocPageSecurity(SgstCollection) {   
    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PriorityLabel", "CanAccess")) {
        $("#adhocInspectionPriorityDiv").show();
    }
    else {
        $("#adhocInspectionPriorityDiv").hide();
    }
}

function BindLoggedInEmployee() {
    var valueArray = [];
    openDB();
    dB.transaction(function (ts) {
        var selectQuery = 'SELECT * FROM AssignmentTable WHERE AssignmentID = ?';
        valueArray.push(decryptStr(localStorage.getItem('EmployeeNumber')));
        ts.executeSql(selectQuery, valueArray, function (tx, results) {
            BindAssignedTo(results);
        });
    });
}

function BindAssignedTo(result) {
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#adhocEmployee option:gt(0)").remove();
    $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");

    if (result.rows.length !== 0) {
        var item = result.rows.item(0);
        var optiontag = document.createElement('option');
        optiontag.setAttribute("value", item.AssignmentID);
        optiontag.innerHTML = item.AssignmentText;
        $("#" + pageID).find("#adhocEmployee").append(optiontag);
        $("#" + pageID).find("#adhocEmployee").val(item.AssignmentID);
        $("#" + pageID).find("#adhocEmployee").selectmenu("refresh");
        $("#" + pageID).find("#employeeTextBox").val(item.AssignmentText);
    }
}

function ResetAdhoc() {
    var pageID = $.mobile.activePage.attr("id");     
    $('#' + pageID).find('#SFloorValue').val('-1');
    $("#" + pageID).find("#SFloorValue").selectmenu("refresh");
    $('#' + pageID).find('#SRoomValue').val('-1');
    $("#" + pageID).find("#SRoomValue").selectmenu("disable");
    $("#" + pageID).find("#SRoomValue").selectmenu("refresh");
    $('#' + pageID).find('#inspectionTemplateDDL').val('-1');
    $("#" + pageID).find("#inspectionTemplateDDL").selectmenu("refresh");
    $('#' + pageID).find('#SPidTextBox').val("");
    $('#' + pageID).find('#SPidDDL').val('-1');
    $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
    $('#' + pageID).find('#SStCityValue').html("");
    $('#' + pageID).find('#SBuildingValue').html("");
    setLocation();
    BindLoggedInEmployee();
    $("#" + pageID).find("#setLocLocal").hide();
}

function InspectionAdhocTranslateDropdowns() {
    // Initialize the dropdown selections
    var pageID = $.mobile.activePage.attr("id");
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var selectProperty = GetTranslatedValue("SelectPropertyDropDownOptions");

    $('#' + pageID).find("#SPidDDL").html('<option value="-1">' + selectProperty + '</option>').selectmenu("refresh");
    $('#' + pageID).find("#SFloorValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
    $('#' + pageID).find("#SRoomValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
    $('#' + pageID).find("#inspectionTemplateDDL").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $('#' + pageID).find("#adhocEmployee").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
}

