var Availability = {};


/**
 * Tech Statuses for Set Employee Status transactions stored as HTML option tags.
 */
Availability.TechStatusOptions;

/// <summary>
/// Method to get the technician details.
/// </summary>
function getAvailableTechnician() {
    var pageSize = getLocal("SearchResultThreshold");
    var pageID = "#" + $.mobile.activePage.attr('id');
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "PageSize": pageSize,
        "PageNumber": "1"
    });

    if (navigator.onLine) {
        showLoading();
        var accessURL = standardAddress + "TechnicianAvailability.ashx?methodname=GetTechnicians";
        $.ajaxpostJSON(accessURL, myJSONobject, function (resultData) {
            closeLoading();
            if (resultData.Table.length > 0) {
                BindTechnicians(resultData);
            }
            else {
                $(pageID).find('#noTechnicians').show();
                $(pageID).find('#NoRecords').text(GetTranslatedValue("NoTechnicianRecords"));
            }

        });
    }
}

/// <summary>
/// Method to bind technicians to the collapsible set.
/// </summary>
/// <param name="data">Holds the details of employee.</param>
function BindTechnicians(data) {
    var numberOfTechnicians = data.Table.length;
    try {
        var dynamicHeader = '';
        if (numberOfTechnicians === 0) {
        }
        else {
            for (var index = 0; index < numberOfTechnicians; index++) {
                collapsibleSetInside = '';
                if (index != 0) {
                    dynamicHeader = dynamicHeader + '</ul></div>';
                }

                if (data.Table[index].Avail == "Yes") {
                    dynamicHeader = dynamicHeader +
                        '<div data-role="collapsible" data-inset="true" >' +
                        '<h4>' + (IsStringNullOrEmpty(data.Table[index].EmployeeName) ? "" : data.Table[index].EmployeeName) +
                        '<img class="img-approve ui-icon availableIconPosition"/></h4>' +
                        '<ul data-role="listview">';
                }
                else {
                    var 
                    dynamicHeader = dynamicHeader +
                        '<div data-role="collapsible" data-inset="true" >' +
                        '<h4>' + (IsStringNullOrEmpty(data.Table[index].EmployeeName) ? "" : data.Table[index].EmployeeName) +
                        '<img class="img-cancel ui-icon availableIconPosition" /></h4>' +
                        '<ul data-role="listview">';
                }
                collapsibleSetInside = CreateList(data.Table[index]);
                dynamicHeader = dynamicHeader + collapsibleSetInside;
                if (data.Table[index].RowNumber == data.Table[index].MaxRow) {
                    $('#techListMoreButton').hide();
                }
                else {
                    $('#techListMoreButton').show();
                }
            }
        }
        dynamicHeader = dynamicHeader + '</ul></div>';
        $('#technicianAvailabilityListDiv').append(dynamicHeader);
        $('#technicianAvailabilityListDiv').trigger('create');
    }
    catch (Error) {
        closeLoading();
        setTimeout(function () {
                   showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
        }, 500);
    }
}

/// <summary>
/// Method to bind the technician info to the list. 
/// </summary>
/// <param name="techDetails">Holds the technician details.</param>
function CreateList(techDetails) {
    var dynamicCollList = " ";
    var techName = "'" + techDetails.EmployeeName + "'";
    dynamicCollList = dynamicCollList +
                        '<li><a id="' + techDetails.EmployeeNumber + '"  href="#" onclick="javascript:NavigateToTechnicianAvailableDetails(' + techDetails.EmployeeNumber + ',' + techName + ')" class="ui-link-inherit">' +
                            '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('UnavailableReasonLabel') +
                            ' : ' + (IsStringNullOrEmpty(techDetails.UnavailReason) ? "" : techDetails.UnavailReason) + '</p>' +
                            '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('StartLabel') +
                            ' : ' + (IsStringNullOrEmpty(techDetails.UnavailFrom) ? "" : techDetails.UnavailFrom) + '</p>' +
                            '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('StopLabel') +
                            ' : ' + (IsStringNullOrEmpty(techDetails.UnavailTo) ? "" : techDetails.UnavailTo) + '</p>' +
                            '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('BackupAssignmentLabel') +
                            ' : ' + (IsStringNullOrEmpty(techDetails.BackupName) ? "" : techDetails.BackupName) + '</p>' +
    '</a></li>';
    return dynamicCollList;
}

/// <summary>
/// Method to navigate to the technician details.
/// </summary>
/// <param name="EmployeeNumber">Holds the values of employee number.</param>
/// <param name="EmployeeName">Holds the values of employee name.</param>
function NavigateToTechnicianAvailableDetails(EmployeeNumber, EmployeeName) {
    setLocal("TechnicianNumber", EmployeeNumber);
    setLocal("TechnicianName", EmployeeName);
    if (navigator.onLine) {
        $.mobile.changePage("TechnicianAvailableDetails.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to get navigate to the previous screen.
/// </summary>
function NavigateToHome() {
    if (navigator.onLine) {
        parent.history.back();
        return false;
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to get technicians records on click of more button.
/// </summary>
function GetNextTechList(obj) {
    var pageNumber = parseInt($("#TechnicianAvailabilityView").find("#" + obj.id).attr('data-nextPage')) + 1;
    var pageSize = getLocal("SearchResultThreshold");
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "PageSize": pageSize,
        "PageNumber": pageNumber
    });

    if (navigator.onLine) {
        showLoading();
        var accessURL = standardAddress + "TechnicianAvailability.ashx?methodname=GetTechnicians";
        $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
            if (resultData.Table.length > 0) {
                $("#TechnicianAvailabilityView").find("#techListMoreButton").attr('data-nextPage',
                parseInt($("#TechnicianAvailabilityView").find("#techListMoreButton").attr('data-nextPage')) + 1);
                BindTechnicians(resultData);
                closeLoading();
            }
        });
    }
}

/// <summary>
/// Method to convert the date time to display.
/// </summary>
function GetDateTime(data) {
    try {
        var param1 = new Date(data);
        var date = strPad(param1.getDate(), 2);
        var month = strPad(param1.getMonth() + 1, 2);
        var year = param1.getFullYear();
        var hours = strPad(param1.getHours(), 2) % 12;
        var minutes = strPad(param1.getMinutes(), 2);
        var amPm = "";
        if (hours > 12) {
            amPm = GetCommonTranslatedValue("PMLabel");
        }
        else {
            amPm = GetCommonTranslatedValue("AMLabel");
        }
        var param2 = month + '/' + date + '/' + year + ' ' + hours + ':' + minutes + ' ' + amPm;
        return param2;
    }
    catch (e) {
        log(e);
    }
}

/// <summary>
/// Method to validate backup assignment.
/// </summary>
function ValidateBackUpAssignment() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    if ($("#UseBackUpCheckBox").prop('checked') == false) {
        $("#BackUpDetailsUl").addClass('ui-disabled');
    }
    else {
        $("#BackUpDetailsUl").removeClass('ui-disabled');
    }
}

/// <summary>
/// Method to bind backup details.
/// </summary>
function BindBackUpDetails() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectedVallue = $(pageID + " #BackUpDetailsDropDownList").val();
    switch (selectedVallue) {
        case 'Employee':
            BindBackUpData();
            break;
        case 'Vendor':
            BindBackUpData();
            break;
        case 'SubVar':
            BindBackUpData();
            break;
        case 'UseMatrix':
            BindBackUpData();
            break;
    }
}

/// <summary>
/// Method to bind backup data.
/// </summary>
function BindBackUpData() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var data = iMFMJsonObject({
        Type: $(" #BackUpDetailsDropDownList").val(),
        TechnicianNumber: getLocal("TechnicianNumber")
    });

    if (navigator.onLine) {
        if ($(" #BackUpDetailsDropDownList").val() == "UseMatrix") {
            $('#AssignmentListDropDownList').parent().hide();
        }
        else {
            $('#AssignmentListDropDownList').parent().show();

            $.postJSON(standardAddress + "TechnicianAvailability.ashx?methodname=BackUpDataDetails", data, function (result) {
                $(pageID + " #AssignmentListDropDownList option:gt(0)").remove();
                if (result.Table.length != 0) {
                    for (index = 0; index < result.Table.length; index++) {
                        var tag = document.createElement('option');
                        if ($(" #BackUpDetailsDropDownList").val() == "Employee") {
                            tag.setAttribute("value", result.Table[index].EmployeeNumber);
                            tag.innerHTML = result.Table[index].EmployeeName + "-" + result.Table[index].EmployeeNumber;
                            $('#AssignmentListDropDownList').append(tag);
                        }
                        else if ($(" #BackUpDetailsDropDownList").val() == "Vendor") {
                            tag.setAttribute("value", result.Table[index].VendorNumber);
                            tag.innerHTML = result.Table[index].Name;
                            $('#AssignmentListDropDownList').append(tag);
                        }
                        else if ($(" #BackUpDetailsDropDownList").val() == "SubVar") {
                            var opt;
                            var subVarData = result.Table[index].SubVar.split(';');
                            for (var count = 0; count < subVarData.length; count++) {
                                var datavalue = subVarData[count].split(',');
                                if (datavalue.length > 1) {
                                    if ((datavalue[0] != null || datavalue[0] != '') && (datavalue[1] != null || datavalue[1] != '')) {
                                        opt = '<option value="' + datavalue[0] + '">' + datavalue[1].replace('<', '&#60;') + '</option>';
                                        $('#AssignmentListDropDownList').append(opt);
                                    }
                                }
                            }

                            $('#AssignmentListDropDownList').selectmenu('refresh');
                        }
                    }

                    if ($(" #BackUpDetailsDropDownList").val() == "Employee") {
                        $('#AssignmentListDropDownList').val(result.Table[0].EmployeeNumber);
                        $(" #AssignmentListDropDownList").selectmenu('refresh');
                    }
                    else if ($(" #BackUpDetailsDropDownList").val() == "Vendor") {
                        $('#AssignmentListDropDownList').val(result.Table[0].VendorNumber);
                        $(" #AssignmentListDropDownList").selectmenu('refresh');
                    }
                }
            });
        }
    }
}

/// <summary>
/// Method to save technician data.
/// </summary>
function SaveTechAvailData() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var startDate = $("#StartDateTextBox").val();
    var stopDate = $("#StopDateTextBox").val();

    var secAvailableReason;
    if ($("#UnAvailReasonTextArea").val() !== "") {
        secAvailableReason = securityError($("#UnAvailReasonTextArea"));
//        setLocal("secAvailableReason", secAvailableReason);
        //        if (secureOldPwd == "") {
        //            return false;
        //        }
    }

    //    var unAvailableReason = $("#UnAvailReasonTextArea").val();
    var unAvailableReason = secAvailableReason;
    var backUpType = $("#BackUpDetailsDropDownList").val();
    var assignment = $(pageID).find("#AssignmentListDropDownList option:selected").val();
    var useBackUpCheck = $("#UseBackUpCheckBox").prop('checked');
    var useP1P2Check = $("#P1P2CheckBox").prop('checked');

    if (startDate.length == 0 || stopDate.length == 0) {
        showError(GetTranslatedValue("StartStopDateRequired"));
        return false;
    }
    else {
        DateTimeValidation();
    }

    if ($("#UnAvailReasonTextArea").css('visibility') == "visible" && $("#UnAvailReasonTextArea").prop("disabled") == false) {
        if ($("#UnAvailReasonTextArea").attr("data-Required") == "true" && unAvailableReason.length == 0) {
            showError(GetTranslatedValue("UnavailableReasonRequired"));
            return false;
        }
    }

    if ($("#UseBackUpCheckBox").css('visibility') == "visible" && $("#UseBackUpCheckBox").prop("disabled") == false) {
        if ($("#UseBackUpCheckBox").prop('checked') == true) {
            if (($("#BackUpDetailsDropDownList").val() == "-1" || $("#AssignmentListDropDownList").val() == "-1") && $("#BackUpDetailsDropDownList").val() != "UseMatrix") {
                showError(GetTranslatedValue("BackUpDetailsRequired"));
                return false;
            }
        }
    }

    if ($("#UseBackUpCheckBox").prop('checked') == true) {
        if ($("#AssignmentListDropDownList").val() == "UseMatrix") {
            useBackUpCheck = true;
        }
    }
    
    var data = iMFMJsonObject({
        "StartDate": startDate,
        "StopDate": stopDate,
        "UnAvaialbleReason": unAvailableReason,
        "BackUpType": backUpType,
        "Assignment": assignment,
        "UseBackUpCheck": useBackUpCheck,
        "UseP1P2Check": useP1P2Check,
        "TechnicianNumber": getLocal("TechnicianNumber"),
        "Latitude": GlobalLat,
        "Longitude": GlobalLong,
        "LoggedInEmployeeNumber": decryptStr(getLocal("EmployeeNumber"))
    });

    if (navigator.onLine) {
        $.postJSON(standardAddress + "TechnicianAvailability.ashx?methodname=TechnicianSetData", data, function (result) {
            if (result == true) {
                $.mobile.changePage("TechnicianAvailabilityView.html");
            }
        });
    }
}

/// <summary>
/// Method to reset technician details.
/// </summary>
function ResetTechFields() {
    var pageID = "#" + $.mobile.activePage.attr('id');

    if ($(pageID + " #hiddenStart").val() != null && $(pageID + " #hiddenStop").val() != null) {
////        SetOnlineTime("StartDateTextBox", $(pageID + " #hiddenStart").val());
////        SetOnlineTime("StopDateTextBox", $(pageID + " #hiddenStop").val());
        $("#StartDateTextBox").val($(pageID + " #hiddenStart").val());
        $("#StopDateTextBox").val($(pageID + " #hiddenStop").val());
    }
    else {
        $(pageID + " #StartDateTextBox").val('');
        $(pageID + " #StopDateTextBox").val('');
    }

    if ($(pageID + " #hiddenUnAvailreason").val() != null) {
        $(pageID + " #UnAvailReasonTextArea").val($(pageID + " #hiddenUnAvailreason").val());
    }
    else {
        $(pageID + " #UnAvailReasonTextArea").val('');
    }

    if ($(pageID + " #hiddenBackUpType").val() != null && $(pageID + " #hiddenBackUpType").val() != ""  && $(pageID + " #hiddenAssignment").val() != "" && $(pageID + " #hiddenAssignment").val() != null) {
        $(pageID + " #UseBackUpCheckBox").attr('checked', true).checkboxradio('refresh');
        $(pageID + " #BackUpDetailsDropDownList").val($(pageID + " #hiddenBackUpType").val());
        $(pageID + " #BackUpDetailsDropDownList").selectmenu('refresh', true);
        $(pageID + " #AssignmentListDropDownList").val($(pageID + " #hiddenAssignment").val());
        $(pageID + " #AssignmentListDropDownList").selectmenu('refresh', true);
        if ($(pageID + " #hiddenBackUpType").val() == "UseMatrix") {
            $(pageID + " #BackUpDetailsDropDownList").val("UseMatrix");
            $(pageID + " #BackUpDetailsDropDownList").selectmenu('refresh', true);
            $(pageID + " #AssignmentListDropDownList").parent().hide();
        }
        else {
            $(pageID + " #AssignmentListDropDownList").parent().show();
        }
    }
    else {
        $(pageID + " #BackUpDetailsDropDownList").val('-1');
        $(pageID + " #BackUpDetailsDropDownList").selectmenu("refresh", true);
        $(pageID + " #AssignmentListDropDownList").parent().show();
        $(pageID + " #AssignmentListDropDownList option:gt(0)").remove();
        $(pageID + " #AssignmentListDropDownList").val('-1');
        $(pageID + " #AssignmentListDropDownList").selectmenu("refresh", true);
    }

    if ($(pageID + " #hiddenBackUpCheck").val() == "true") {
        $(pageID + " #UseBackUpCheckBox").prop('checked', true).checkboxradio('refresh');
    }
    else {
        $(pageID + " #UseBackUpCheckBox").prop('checked', false).checkboxradio('refresh');
    }

    if ($(pageID + " #hiddenP1P2").val() == "true") {
        $(pageID + " #P1P2CheckBox").prop('checked', true).checkboxradio('refresh');
    }
    else {
        $(pageID + " #P1P2CheckBox").prop('checked', false).checkboxradio('refresh');
    }
}

/// <summary>
/// Method to load technician details.
/// </summary>
function LoadTechnicianDetails() {
    var backUpType;
    var assignmentVal;
    var pageID = "#" + $.mobile.activePage.attr('id');
    var data = iMFMJsonObject({
        "TechnicianNumber": getLocal("TechnicianNumber")
    });


    if (navigator.onLine) {
        $.postJSON(standardAddress + "TechnicianAvailability.ashx?methodname=GetTechnicianData", data, function (result) {
            if (result.Table.length > 0) {
                LoadHiddenFieldsTech(result);
                $("#UnAvailReasonTextArea").val(result.Table[0].UnavailReason);
                $("#StartDateTextBox").val(result.Table[0].UnavailFrom);
                $("#StopDateTextBox").val(result.Table[0].UnavailTo);

                if (result.Table[0].BackupP1Only == true) {
                    $(pageID + " #P1P2CheckBox").attr('checked', true).checkboxradio('refresh');
                }
                else {
                    $(pageID + " #P1P2CheckBox").attr('checked', false).checkboxradio('refresh');
                }

                if (result.Table[0].BackupEmployee != null) {
                    $("#BackUpDetailsUl").removeClass('ui-disabled');
                    if ($("#UseBackUpCheckBox").attr("disabled") != "disabled") {
                        $(pageID + " #UseBackUpCheckBox").attr('checked', true).checkboxradio('refresh');
                        $("#UseBackUpCheckBox").parent().removeClass('ui-disabled');
                    }
                    else {
                        $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                    }

                    $("#BackUpDetailsDropDownList").val("Employee");
                    backUpType = "Employee";
                    assignmentVal = result.Table[0].BackupEmployee;
                }
                else if (result.Table[0].BackupVendor != null || result.Table[0].BackupVendorSite != null) {
                    $("#BackUpDetailsUl").removeClass('ui-disabled');
                    if ($("#UseBackUpCheckBox").attr("disabled") != "disabled") {
                        $(pageID + " #UseBackUpCheckBox").attr('checked', true).checkboxradio('refresh');
                        $("#UseBackUpCheckBox").parent().removeClass('ui-disabled');
                    }
                    else {
                        $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                    }

                    $("#BackUpDetailsDropDownList").val("Vendor");
                    backUpType = "Vendor";
                    assignmentVal = result.Table[0].BackupVendor;
                }
                else if (result.Table[0].BackupSubVar != null) {
                    $("#BackUpDetailsUl").removeClass('ui-disabled');
                    if ($("#UseBackUpCheckBox").attr("disabled") != "disabled") {
                        $(pageID + " #UseBackUpCheckBox").attr('checked', true).checkboxradio('refresh');
                        $("#UseBackUpCheckBox").parent().removeClass('ui-disabled');
                    }
                    else {
                        $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                    }

                    $("#BackUpDetailsDropDownList").val("SubVar");
                    backUpType = "SubVar";
                    assignmentVal = result.Table[0].BackupSubVar;
                }
                else {
                    if (result.Table[0].BackupUseMatrix == false) {
                        $("#BackUpDetailsUl").addClass('ui-disabled');
                        if ($("#UseBackUpCheckBox").attr("disabled") != "disabled") {
                            $(pageID + " #UseBackUpCheckBox").attr('checked', false).checkboxradio('refresh');
                            $("#UseBackUpCheckBox").parent().removeClass('ui-disabled');
                        }
                        else {
                            $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                        }
                    }
                }

                if (result.Table[0].BackupUseMatrix == true) {
                    $("#BackUpDetailsUl").removeClass('ui-disabled');
                    if ($("#UseBackUpCheckBox").attr("disabled") != "disabled") {
                        $(pageID + " #UseBackUpCheckBox").attr('checked', true).checkboxradio('refresh');
                    }
                    else {
                        $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                    }

                    $("#BackUpDetailsDropDownList").val("UseMatrix");
                    backUpType = "UseMatrix";
                    $("#BackUpDetailsDropDownList").selectmenu("refresh", true);
                    $('#AssignmentListDropDownList').parent().hide();
                }
                else {
                    $('#AssignmentListDropDownList').parent().show();
                }
            }

            if ($("#P1P2CheckBox").attr("disabled") != "disabled") {
                $("#P1P2CheckBox").parent().removeClass('ui-disabled');
            }
            else {
                $("#P1P2CheckBox").parent().addClass('ui-disabled');
            }

            BindTechnicianDetails(backUpType, assignmentVal);
        });
    }
}

/// <summary>
/// Method to validate datetime.
/// </summary>
function DateTimeValidation() {
    var one_day_in_milliseconds;
    one_day_in_milliseconds = 1000 * 60 * 60 * 24;
    var StartDate = $("#StartDateTextBox").val();
    var Start = new Date(StartDate.split('T')[0] + ' ' + StartDate.split('T')[1]);
    var StopDate = $("#StopDateTextBox").val();
    var Stop = new Date(StopDate.split('T')[0] + ' ' + StopDate.split('T')[1]);

    var MaxDate = new Date("12-31-2099");
    var MinDate = new Date("1-1-1940");

    var startMaxDate_diff = Math.floor((MaxDate.getTime() - Start.getTime()) / one_day_in_milliseconds);
    var stoptMaxDate_diff = Math.floor((MaxDate.getTime() - Stop.getTime()) / one_day_in_milliseconds);
    var startMinDate_diff = Math.floor((MinDate.getTime() - Start.getTime()) / one_day_in_milliseconds);
    var stoptMinDate_diff = Math.floor((MinDate.getTime() - Stop.getTime()) / one_day_in_milliseconds);
    var startStopDate_diff = Math.floor((Start.getTime() - Stop.getTime()) / one_day_in_milliseconds);

    if ((startMaxDate_diff < 0 && stoptMaxDate_diff < 0 && startMinDate_diff > 0 && stoptMinDate_diff > 0) && (startStopDate_diff == 0 || startStopDate_diff != -1)) {
        showError(GetTranslatedValue("DateTimeRangeError"));
        return false;
    }
}

/// <summary>
/// Method to check for security tokens.
/// </summary>
/// <param name="pageId">Holds the value of page id.</param>
function CheckSecurityTokens(pageId) {
    var pageID = pageId;
    var SgtCollection = $.GetSecuritySubTokens(400042, 0);
    for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
        $("#" + SgtCollection.SgstCollection[i].SubTokenDescription.toLowerCase().replace(/\s/g, "")).hide();
        if (SgtCollection.SgstCollection[i].CanAccess == 1) {
            $("#" + SgtCollection.SgstCollection[i].SubTokenDescription.toLowerCase().replace(/\s/g, "")).show();
            switch (SgtCollection.SgstCollection[i].SubTokenDescription) {
                case "StartStopDateDiv":
                    $(pageID + " #StartDateTextBox").show();
                    $(pageID + " #StopDateTextBox").show();
                    $(pageID + " #StartDateTextBox").removeClass('ui-disabled');
                    $(pageID + " #StopDateTextBox").removeClass('ui-disabled');
                    $(pageID + " #StartDateTextBox").attr("Requried", "true");
                    $(pageID + " #StopDateTextBox").attr("Requried", "true");
                    break;
                case "UnAvailReasonTextArea":
                    $(pageID + " #UnAvailReasonTextArea").show();
                    if (SgtCollection.SgstCollection[i].ReadOnly == 0) {
                        $(pageID + " #UnAvailReasonTextArea").addClass('ui-disabled');
                    }
                    else {
                        $(pageID + "#UnAvailReasonTextArea").removeClass('ui-disabled');
                        if (SgtCollection.SgstCollection[i].Required == 1) {
                            $(pageID + " #UnAvailReasonTextArea").attr("data-Required", "true");
                            $(pageID + " #ReasonMandatoryLabel").show();
                        }
                        else {
                            $(pageID + " #UnAvailReasonTextArea").attr("data-Required", "false");
                            $(pageID + " #ReasonMandatoryLabel").hide();
                        }
                    }
                    break;
                case "UseBackUpCheckBox":
                    $(pageID + " #UseBackUpCheckBox").show();
                    if (SgtCollection.SgstCollection[i].ReadOnly == 0) {
                        $("#UseBackUpCheckBox").parent().addClass('ui-disabled');
                        $("#UseBackUpCheckBox").attr("disabled", true);
                        $(pageID + " #BackUpDetailsUl").addClass('ui-disabled');
                    }
                    else {
                        $(pageID + " #UseBackUpCheckBox").parent().removeClass('ui-disabled');
                        $("#UseBackUpCheckBox").attr("disabled", false);
                        if ($("#UseBackUpCheckBox").prop('checked') == false) {
                            $("#BackUpDetailsUl").addClass('ui-disabled');
                        }
                        else {
                            $("#BackUpDetailsUl").removeClass('ui-disabled');
                        }
                    }
                    break;
                case "BackUpDetailsUl":
                    $(pageID + " #BackUpDetailsUl").show();
                    break;
                case "SubmitButton":
                    $(pageID + " #SubmitButton").show();
                    if (SgtCollection.SgstCollection[i].ReadOnly == 0) {
                        $(pageID + " #SubmitButton").addClass('ui-disabled');
                    }
                    else {
                        $(pageID + " #SubmitButton").removeClass('ui-disabled');
                    }
                    break;
                case "ResetButton":
                    $(pageID + " #ResetButton").show();
                    if (SgtCollection.SgstCollection[i].ReadOnly == 0) {
                        $(pageID + " #ResetButton").addClass('ui-disabled');
                    }
                    else {
                        $(pageID + " #ResetButton").removeClass('ui-disabled');
                    }
                    break;
                case "P1P2CheckBox":
                    $(pageID + " #P1P2CheckBox").show();
                    if (SgtCollection.SgstCollection[i].ReadOnly == 0) {
                        $("#P1P2CheckBox").parent().addClass('ui-disabled');
                        $("#P1P2CheckBox").attr("disabled", true);
                    }
                    else {
                        $(pageID + " #P1P2CheckBox").parent().removeClass('ui-disabled');
                        $("#P1P2CheckBox").attr("disabled", false);
                    }
                    break;
            }
        }
        else {
            $(pageID + " #StartUl").hide();
            $(pageID + " #ReasonUl").hide();
            $(pageID + " #UseBackUpCheckBox").parent().hide();
            $(pageID + " #BackUpDetailsUl").hide();
            $(pageID + " .button-panel").hide();
            $(pageID + " #P1P2CheckBox").hide();
        }
    }
}

/// <summary>
/// Method to bind technician details.
/// </summary>
/// <param name="backupType">Holds the values of assignment type.</param>
/// <param name="assignmentVal">Holds assinged values.</param>
function BindTechnicianDetails(backupType, assignmentVal) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var data = iMFMJsonObject({
        Type: $(" #BackUpDetailsDropDownList").val(),
        TechnicianNumber: getLocal("TechnicianNumber")
    });

    if (navigator.onLine) {
        if ($(" #BackUpDetailsDropDownList").val() == "UseMatrix") {
            $('#AssignmentListDropDownList').parent().hide();
        }
        else {
            $('#AssignmentListDropDownList').parent().show();

            $.postJSON(standardAddress + "TechnicianAvailability.ashx?methodname=BackUpDataDetails", data, function (result) {
                $(pageID + " #AssignmentListDropDownList option:gt(0)").remove();
                if (result.Table.length != 0) {
                    for (index = 0; index < result.Table.length; index++) {
                        var tag = document.createElement('option');
                        if (backupType == "Employee") {
                            tag.setAttribute("value", result.Table[index].EmployeeNumber);
                            tag.innerHTML = result.Table[index].EmployeeName + "-" + result.Table[index].EmployeeNumber;
                            $('#AssignmentListDropDownList').append(tag);
                        }
                        else if (backupType == "Vendor") {
                            tag.setAttribute("value", result.Table[index].VendorNumber);
                            tag.innerHTML = result.Table[index].Name;
                            $('#AssignmentListDropDownList').append(tag);
                        }
                        else if (backupType == "SubVar") {
                            var opt;
                            var subVarData = result.Table[index].SubVar.split(';');
                            for (var count = 0; count < subVarData.length; count++) {
                                var datavalue = subVarData[count].split(',');
                                if (datavalue.length > 1) {
                                    if ((datavalue[0] != null || datavalue[0] != '') && (datavalue[1] != null || datavalue[1] != '')) {
                                        opt = '<option value="' + datavalue[0] + '">' + datavalue[1] + '</option>';
                                        $('#AssignmentListDropDownList').append(opt);
                                    }
                                }
                            }
                        }
                        else if (backupType = "UseMatrix") {
                            $(" #BackUpDetailsDropDownList").val("UseMatrix");
                            $("#BackUpDetailsDropDownList").selectmenu('refresh', true);
                        }
                    }

                    if ($(" #BackUpDetailsDropDownList").val() == "Employee") {
                        $("#UseBackUpCheckBox").attr('checked', true);
                        $('#AssignmentListDropDownList').val(result.Table[0].EmployeeNumber);
                        $(" #AssignmentListDropDownList").selectmenu('refresh');
                        $("#BackUpDetailsDropDownList").val(backupType);
                        $("#BackUpDetailsDropDownList").selectmenu('refresh', true);
                        $("#AssignmentListDropDownList").val(assignmentVal);
                        $('#AssignmentListDropDownList').selectmenu('refresh', true);
                    }
                    else if ($(" #BackUpDetailsDropDownList").val() == "Vendor") {
                        $('#AssignmentListDropDownList').val(result.Table[0].VendorNumber);
                        $(" #AssignmentListDropDownList").selectmenu('refresh');
                        $("#BackUpDetailsDropDownList").val(backupType);
                        $("#BackUpDetailsDropDownList").selectmenu('refresh', true);
                        $("#AssignmentListDropDownList").val(assignmentVal);
                        $('#AssignmentListDropDownList').selectmenu('refresh', true);
                    }
                    else if ($(" #BackUpDetailsDropDownList").val() == "SubVar") {
                        $("#BackUpDetailsDropDownList").val(backupType);
                        $("#BackUpDetailsDropDownList").selectmenu('refresh', true);
                        $("#AssignmentListDropDownList").val(assignmentVal);
                        $('#AssignmentListDropDownList').selectmenu('refresh', true);
                    }
                    else if ($("#BackUpDetailsDropDownList").val() == "UseMatrix") {
                        $("#BackUpDetailsDropDownList").val("UseMatrix");
                        $("#BackUpDetailsDropDownList").selectmenu('refresh', true);
                    }
                }
            });
        }
    }
}

/// <summary>
/// Method to loads hidden field of technicians.
/// </summary>
function LoadHiddenFieldsTech(result) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    if (result.Table[0].UnavailFrom != null && result.Table[0].UnavailTo != null) {
        $(pageID + " #hiddenStart").val(result.Table[0].UnavailFrom);
        $(pageID + " #hiddenStop").val(result.Table[0].UnavailTo);
    }

    $(pageID + " #hiddenUnAvailreason").val(result.Table[0].UnavailReason);

    if (result.Table[0].BackupEmployee) {
        $(pageID + " #hiddenBackUpCheck").val(true);
        $(pageID + " #hiddenBackUpType").val("Employee");
        $(pageID + " #hiddenAssignment").val(result.Table[0].BackupEmployee);
    }
    else if (result.Table[0].BackupVendor) {
        $(pageID + " #hiddenBackUpCheck").val(true);
        $(pageID + " #hiddenBackUpType").val("Vendor");
        $(pageID + " #hiddenAssignment").val(result.Table[0].BackupVendor);
    }
    else if (result.Table[0].BackupSubVar) {
        $(pageID + " #hiddenBackUpCheck").val(true);
        $(pageID + " #hiddenBackUpType").val("SubVar");
        $(pageID + " #hiddenAssignment").val(result.Table[0].BackupSubVar);
    }
    else if (result.Table[0].BackupUseMatrix == true) {
        $(pageID + " #hiddenBackUpCheck").val(true);
        $(pageID + " #hiddenBackUpType").val("UseMatrix");
    }

    $(pageID + " #hiddenP1P2").val(result.Table[0].BackupP1Only);
}

function BindTechnicianAvailableDetailsDropdowns() {
    var pageID = $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var HTEmployee = GetTranslatedValue("EmployeeLabel");
    var HTVendor = GetTranslatedValue("VendorLabel");
    var HTSubvar = GetTranslatedValue("SubVarLabel");
    var HTMatrix = GetTranslatedValue("UseMatrixLabel");

    var backupDropdownHTML = '<option value="-1">' + selectLabel + '</option><option value="Employee">' + HTEmployee + '</option>' +
        '<option value="Vendor">' + HTVendor + '</option><option value="SubVar">' + HTSubvar + '</option>' +
        '<option value="UseMatrix">' + HTMatrix + '</option>';
    $("#" + pageID).find("#BackUpDetailsDropDownList").html(backupDropdownHTML).selectmenu("refresh");

    $("#" + pageID).find("#AssignmentListDropDownList").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");                
}

/**
 * Enable the dropdown for tech status reasons.
 * @param [object] sliderEntity - The slider that contains which type of status should populate the dropdown.
 */
function showTechStatusReason(sliderEntity) {
    var pageID = $.mobile.activePage.attr('id');
    var reasonDropdown = $("#" + $(sliderEntity).attr('data-reason'));
    
    var optionList = '';
    $(Availability.TechStatusOptions).each(function() {
        if (this.value !== "-1" && $(this).attr('data-type') == $(sliderEntity).val()) {
              optionList += this.outerHTML;
        }        
    });
    
    $(reasonDropdown).html(optionList);
    
    // For Phase 1 of this enhancement, we operate under the assumption that
    // 1 is available, everything else is not.
    var currentStatus = $(reasonDropdown).find('option[value="' + getLocal("TechnicianStatus") + '"]').attr('data-type');
    // Check the current status and verify that the user actually changed something.
    if (currentStatus !== $(sliderEntity).val() && $.parseHTML(optionList).length > 1) {
        $(reasonDropdown).removeAttr('disabled').selectmenu("refresh");
        $(reasonDropdown).parent().show();
    } else {
        $(reasonDropdown).parent().hide();
    }
    // Reset the dropdown if the selected value is disabled/hidden.
    if ($(reasonDropdown).find('option[value="' + getLocal("TechnicianStatus") + '"]').length >= 1) {
        selectedVal = getLocal("TechnicianStatus");
    } else {
        selectedVal = $(reasonDropdown).first().val();
    }

    $(reasonDropdown).val(selectedVal).selectmenu("refresh");
}

/**
 * Save the technician's status.
 * @param [string] techStatusName - Name of the entity that contains the tech status.
 */
function saveTechStatus(techStatusName) {
    var techStatus = $("#" + techStatusName);
    document.activeElement.blur();
    $(techStatus).blur();

    // Validate the value.
    if (getLocal('TechnicianStatus') != $(techStatus).find("option:selected").val()) {
    
        var jsonParams = iMFMJsonObject({
            "EmployeeStatus": $(techStatus).find("option:selected").val(),
            "Latitude": GlobalLat,
            "Longitude": GlobalLong
        });
        
        // Submit to the database.
        $.when(Availability.SubmitTechStatus(jsonParams))
        .done(function() {
            // Update the local value.
            setLocal('TechnicianStatus', $(techStatus).find("option:selected").val());
            showError(GetCommonTranslatedValue("UpdateSuccess"), function () { closeTechStatusPopup()});
            })
        .fail(function() {
            showError(GetCommonTranslatedValue("ErrorMessage"), function() { closeTechStatusPopup()});
            });
    } else {
        closeTechStatusPopup();
    }
}

/**
 * Get the list of available employee statuses from the database.
 * @returns An array of statuses.
 */
Availability.GetEmployeeStatuses = function () {
    var fetchStatus = $.Deferred();
    var jsonParams = iMFMJsonObject({});
    
    var fetchURL = standardAddress + "TechnicianAvailability.ashx?methodname=GetEmployeeStatusDropDown";
    
    $.postJSON(fetchURL, jsonParams, function (fetchResults) {
        if (fetchResults.Table.length > 0) {
            fetchStatus.resolve(fetchResults.Table);
        } else {
            fetchStatus.reject("empty");
        }
    });
    
    return fetchStatus.promise();
}

/**
 * Update the Tech Status for the user.
 * @param [object] the json params for the update.
 * @returns A boolean value of whether the update succeeded or not.
 */
Availability.SubmitTechStatus = function (jsonParams) {
    var transStatus = $.Deferred();
    
    var transURL = standardAddress + "TechnicianAvailability.ashx?methodname=SetEmployeeStatus";
    
    $.postJSON(transURL, jsonParams, function (transResults) {
        if (transResults) {
            transStatus.resolve();
        } else {
            transStatus.reject();
        }
    });
    
    return transStatus.promise();
}
