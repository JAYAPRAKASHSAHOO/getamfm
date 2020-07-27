var pageID = $.mobile.activePage.attr('id');
var closePopUP = false;

//====Setting the Default location Details.====
function SetDefaultLocation() {
    var pageID = $.mobile.activePage.attr('id');
    var property = $.trim(getLocal('LocName'));
    if (property != "null" && property.length !== 0) {
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT RegionID, RegionText, PropertyID, PropertyText  FROM PropertyTable WHERE TCC_Project_Number LIKE ? COLLATE NOCASE", [property],
                                    function (te, result) {
                                        if (result.rows.length > 0) {
                                            $(pageID + " #cityLabel").text(result.rows.item(0).RegionText);
                                            $(pageID + " #hiddenFieldCityText").val(result.rows.item(0).RegionText);
                                            $(pageID + " #hiddenFieldCityValue").val(result.rows.item(0).RegionID);
                                            $(pageID + " #buildingLabel").text(result.rows.item(0).PropertyText);
                                            $(pageID + " #hiddenFieldBuildingText").val(result.rows.item(0).PropertyText);
                                            $(pageID + " #hiddenFieldBuildingValue").val(result.rows.item(0).PropertyID);
                                            ////buildingCurrencyCode = result.rows.item(0).CurrencyCode;
                                            // Populate Floor DD.
                                            if (result.rows.item(0).RegionID !== 0 && result.rows.item(0).PropertyID !== 0)
                                                populateFloorDropDown(result.rows.item(0).RegionID, result.rows.item(0).PropertyID);
                                        }
                                    }, function (e, m, s) { log(e.status); });
        });
    }
}

//====Populate Assignment dropdown when Employee is selected=====
function BindAssignmentDDEmployee(result) {
    $(pageID + " #ddlAssignment").children('option:not(:first)').remove();
    var i = 0;
    for (i = 0; i < result.length; i++) {
        var tag = document.createElement('option');
        tag.setAttribute("value", result[i].EmployeeNumber);
        tag.innerHTML = result[i].EmployeeName;
        $(pageID + " #ddlAssignment").append(tag);
    }
    $(pageID + " #ddlAssignment option:first").attr('selected', 'selected');
    $(pageID + " #ddlAssignment").selectmenu("refresh", true);
}

//====Populate Assignment dropdown when Vendor is selected====
function BindAssignmentDDVendor(result) {
    $(pageID + " #ddlAssignment").children('option:not(:first)').remove();
    var i = 0;
    for (i = 0; i < result.length; i++) {
        var tag = document.createElement('option');
        tag.setAttribute("value", result[i].VendorName);
        tag.innerHTML = result[i].OldVendorSite;
        $(pageID + " #ddlAssignment").append(tag);
    }
    $(pageID + " #ddlAssignment option:first").attr('selected', 'selected');
    $(pageID + " #ddlAssignment").selectmenu("refresh", true);
}

//====Called when AssignmentType DD selected index changes====
function BindAssignmentDropDown() {
    var tag;
    try {
        pageID = "#" + $.mobile.activePage.attr('id');
        var selectedVallue = $(pageID + " #ddlAssignmentType").val();
        setLocal('VendorSelected', 0);
        var netStatus = checkNetworkStatus();
        switch (selectedVallue) {
            case 'Employee':
                OflBindAssignmentDDEmployee();
                GetSecurityTokens(pageID);
                break;
            case 'Vendor':
                OflBindAssignmentDDEmployee();
                setLocal('VendorSelected', 1);
                GetSecurityTokens(pageID);
                break;
            case 'CallCenter':
                $(pageID).find("#ddlAssignment option:gt(0)").remove();
                tag = document.createElement('option');
                tag.setAttribute("value", "0");
                tag.innerHTML = GetTranslatedValue("CallCenter");
                GetSecurityTokens(pageID);
                $(pageID).find("#ddlAssignment").append(tag);
                $(pageID).find("#ddlAssignment").val("0").selectmenu("refresh").selectmenu("enable");
                break;
            case 'Manager':
                ////OflBindAssignmentDDEmployee();
                $(pageID).find("#ddlAssignment option:gt(0)").remove();
                tag = document.createElement('option');
                tag.setAttribute("value", "FM");
                tag.innerHTML = GetTranslatedValue("FMLabel");
                GetSecurityTokens(pageID);
                $(pageID).find("#ddlAssignment").append(tag);
                $(pageID).find("#ddlAssignment").val("FM").selectmenu("refresh").selectmenu("enable");
                break;
            case 'Current User':
                if (getLocal("PreviousScreen") !== "WOStepPage") {
                    ResetFields();
                } else {
                    BindDateTime();
                }
                CheckSelfGenSecurityTokens(pageID);
                $(pageID).find("#CompletionDateUl").show();
                SelfGenYesOrNo = 1;
                $(pageID + " #SelfGenFlag").val(SelfGenYesOrNo);
                OflBindAssignmentDDCurrentUser();
                break;
            default:
                $(pageID + " #ddlAssignment").selectmenu("disable");
                $(pageID + " #ddlAssignment").children('option:not(:first)').remove();
                $(pageID + " #ddlAssignment option:first").attr('selected', 'selected');
                $(pageID + " #ddlAssignment").selectmenu("refresh", true);
        }
        BindServiceContractDDL();
    }
    catch (Error) {
        showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }
}

//====To get the GetState-City/BuildingData====
function GetStCityBuildingData() {
    var propertyID = jQuery.trim($(pageID + " #propertyID").val());
    var pattern = /^[A-Za-z0-9]*$/;
    if (propertyID === '' || !pattern.test(propertyID)) {
        $(pageID + " #propertyID").focus();
        return;
    }

    // Reset Necessary Fields First.
    $(pageID + " #cityLabel").text('');
    $(pageID + " #buildingLabel").text('');
    $(pageID + " #hiddenFieldCityText").val(null);
    $(pageID + " #hiddenFieldCityValue").val(null);
    $(pageID + " #hiddenFieldBuildingText").val(null);
    $(pageID + " #hiddenFieldBuildingValue").val(null);
    ////buildingCurrencyCode = ''; 

    $(pageID + " #ddlFloor").children('option:not(:first)').remove();
    $(pageID + " #ddlFloor option:eq(0)").attr('selected', 'selected');
    $(pageID + " #ddlFloor").selectmenu("refresh", true);
    $(pageID + " #roomSelect").children('option:not(:first)').remove();
    $(pageID + " #roomSelect option:eq(0)").attr('selected', 'selected');
    $(pageID + " #roomSelect").selectmenu("refresh", true);
    $(pageID + " #hiddenFieldFloorText").val($('#ddlFloor option:selected').text());
    $(pageID + " #hiddenFieldRoomText").val($('#roomSelect option:selected').text());
    GetDataFromLocalDB("2");
}
//====Set Search Property details====
function SetSearchedPropertyDetails(data) {

    //Data contains both text and value.
    if (data.length !== 0) {
        $(pageID + " #cityLabel").text(data[0]);
        $(pageID + " #hiddenFieldCityText").val(data[0]);
        $(pageID + " #hiddenFieldCityValue").val(data[1]);

        $(pageID + " #buildingLabel").text(data[2]);
        $(pageID + " #hiddenFieldBuildingText").val(data[2]);
        $(pageID + " #hiddenFieldBuildingValue").val(data[3]);
        ////buildingCurrencyCode = data[4]; 

        //Populate Floor DD.
        populateFloorDropDown(data[1], data[3]);
        //Show the Home button.
        $(pageID + " #setHomeLink").show();
    }
    else {
        showError($(pageID + " #hiddenFieldLocationNotFoundMsg").val());
    }
}

//====Ajax call to get Floor dropdown value=====
function populateFloorDropDown(stCityValue, buildingValue) {
    GetDataFromLocalDB("3");
}

//====Binding Room DropDown====
function BindRoomDropDown() {
    $(pageID + " #hiddenFieldFloorText").val($(pageID + " #ddlFloor option:selected").text());
    var cityValue = $(pageID + " #hiddenFieldCityValue").val();
    var buildingValue = $(pageID + " #hiddenFieldBuildingValue").val();
    var selectedFloor = $(pageID + " #ddlFloor").val();
    if (selectedFloor == -1) {
        $(pageID + " #roomSelect").children('option:not(:first)').remove();
        $(pageID + " #roomSelect option:first").attr('selected', 'selected');
        $(pageID + " #roomSelect").selectmenu("refresh", true);
        return;
    }

    GetDataFromLocalDB("6");
}

//====Getting the Group and SubGroup data from entered Problem code text====
function GetGroupSubgroupData() {
    if ($(pageID + " #problemCodeDD option:selected").val() == "-1") {
        $(pageID + " #problemCodeDD").focus();
        return;
    }
    var problemCodeText = $(pageID + " #problemCodeDD option:selected").text();
    var netStatus = checkNetworkStatus();
    GetDataFromLocalDB("5");
}

//====Set Group and Sungroup Data====
function SetGroupSubgroupData(result) {
    var problemCodeText = $(pageID + " #problemCodeDD option:selected").text();
    $(pageID + " #groupLabel").text(result[0]);
    $(pageID + " #groupHiddenField").val(result[1]);
    $(pageID + " #subGroupLabel").text(result[2]);
    $(pageID + " #subGroupHiddenField").val(result[3]);

    $(pageID + " #problemDescriptionTextArea").focus();
    $(pageID + " #HiddenProblemCodeDesc").val(problemCodeText + " :>");

    if (pageID == '#CreateWOC') {
        BindResolutionCodeDD();
    }
}

//==== Populate ProblemCodeDD====
function BindProblemCodeDD() {
    ////First clear the Necessary fields.
    pageID = "#" + $.mobile.activePage.attr("id");
    ResetGroupSubGroupProblemDescTextArea();
    $(pageID + " #problemCodeDD option:gt(0)").remove();
    $(pageID + " #problemCodeDD").selectmenu("refresh", true);
    var searchText = jQuery.trim($(pageID + " #PCTB").val());
    if (searchText === null || searchText === '' || searchText.length < 3) {
        $(pageID + " #PCTB").focus();
        return;
    }
    GetDataFromLocalDB("4");
}

//====Bind ProblemCode DropDown====
function PopulateproblemCodeDD(result) {
    var tag;
    $(pageID + " #problemCodeDD option:gt(0)").remove();
    $(pageID + " #problemCodeDD").selectmenu("refresh", true);

    if (result.length === 0) {
        tag = document.createElement('option');
        tag.setAttribute("value", "-2");
        tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
        $(pageID + " #problemCodeDD").append(tag);
        $(pageID + " #problemCodeDD").val("-2");
        $(pageID + " #problemCodeDD").selectmenu("refresh", true);
        return;
    }
    else if (result.length == 1) {
        tag = document.createElement('option');
        tag.setAttribute("value", result[0].Value);
        tag.innerHTML = result[0].Key;
        $(pageID + " #problemCodeDD").append(tag);
        $(pageID + " #problemCodeDD").val(result[0].Value);
        $(pageID + " #problemCodeDD").selectmenu("refresh", true);
        ////        $(pageID).find("#EstimatedServiceCostText").val(parseFloat(result[0].EstServiceCost, 10).toFixed(2));
        ////        $(pageID).find("#CurrencyCodeSelect").val(result[0].CurrencyCode);
        ////        $(pageID).find("#CurrencyCodeSelect").selectmenu("refresh", true);
        ////        $(pageID).find("#hiddenProblemCodeCurrencyCode").val(result[0].CurrencyCode);
        ResetGroupSubGroupProblemDescTextArea();
        GetGroupSubgroupData();
        return;
    }
    else {
        var firstTag = document.createElement('option');
        firstTag.setAttribute("value", "-3");
        firstTag.innerHTML = "-- [ " + result.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $(pageID + " #problemCodeDD").append(firstTag);
        var i = 0;
        for (i = 0; i < result.length; i++) {
            tag = document.createElement('option');
            tag.setAttribute("value", result[i].Value);
            tag.innerHTML = result[i].Key;
            $(pageID + " #problemCodeDD").append(tag);
        }
        $(pageID + " #problemCodeDD").val("-3");
        $(pageID + " #problemCodeDD").selectmenu("refresh", true);
        $(pageID + " #PCTB").focus();
    }
}

//====Reset Group Subgroup ProblemDescription TextArea====
function ResetGroupSubGroupProblemDescTextArea() {
    $(pageID + " #groupLabel").text('');
    $(pageID + " #groupHiddenField").val('');
    $(pageID + " #subGroupLabel").text('');
    $(pageID + " #subGroupHiddenField").val('');
    $(pageID + " #problemDescriptionTextArea").val('');
}

//====Set the hiddenFieldRoomText field value.====
function SetHiddenValue() {
    if ($(pageID + " #roomSelect option:selected").val() == "-1") {
        $(pageID + " #hiddenFieldRoomText").val("");
    }
    else {
        $(pageID + " #hiddenFieldRoomText").val($(pageID + " #roomSelect option:selected").text());
    }
}

//====Resetting Fields====
function ResetFields(resetAssignment) {
    pageID = "#" + $.mobile.activePage.attr('id');
    if (resetAssignment) {
        $(pageID + " #ddlAssignmentType").val('Employee');
        BindAssignmentDropDown();
        $(pageID + " #ddlAssignmentType").val('-1');
        $(pageID + " #ddlAssignmentType").selectmenu("refresh", true);



        $(pageID + " #AssignmentSearchTextBox").val('');
        $(pageID + " #ddlAssignment option:gt(0)").remove();
        $(pageID + " #ddlAssignment").val('-1');

        $(pageID + " #ddlAssignment").selectmenu("refresh", true);

    }


    $(pageID).find("#SPidTextBox").val('');

    $(pageID + " #propertyID").val('');
    $(pageID + " #SStCityValue").text('');
    $(pageID + " #SStCityValue").attr("data-value", "-1");

    $(pageID + " #SBuildingValue").text('');
    $(pageID + " #SBuildingValue").attr("data-value", "-1");

    $(pageID).find("#SPidDDL option:gt(0)").remove();
    $(pageID).find("#SPidDDL").val('-1');
    $(pageID).find("#SPidDDL").selectmenu("refresh", true);

    $(pageID + " #SFloorValue option:gt(0)").remove();
    $(pageID + " #SFloorValue").val('-1');
    $(pageID + " #SFloorValue").selectmenu("refresh", true);

    $(pageID + " #SRoomValue option:gt(0)").remove();
    $(pageID + " #SRoomValue").val('-1');
    $(pageID + " #SRoomValue").selectmenu("refresh", true);

    $(pageID + " #PCTB").val('');

    $(pageID + " #problemCodeDD option:gt(0)").remove();
    $(pageID + " #problemCodeDD").val('-1');
    $(pageID + " #problemCodeDD").selectmenu('refresh');

    $(pageID + " #groupLabel").text('');
    $(pageID + " #subGroupLabel").text('');

    $(pageID + " #problemDescriptionTextArea").val('');

    $(pageID + " #EstimatedServiceCostText").val(''); // added to reset NTE 
    $(pageID).find("#CurrencyCodeSelect").val('USD');
    $(pageID).find("#CurrencyCodeSelect").selectmenu("refresh", true);
    ////added to empty the location details text area.
    $(pageID).find("#locDetailsTextArea").val('');

    $(pageID + " #hiddenFieldCityText").val('');
    $(pageID + " #hiddenFieldCityValue").val('');
    $(pageID + " #hiddenFieldBuildingValue").val('');
    $(pageID + " #hiddenFieldBuildingText").val('');
    $(pageID + " #hiddenFieldFloorText").val('');
    $(pageID + " #hiddenFieldRoomText").val('');
    $(pageID + " #groupHiddenField").val('');
    $(pageID + " #subGroupHiddenField").val('');
    ////buildingCurrencyCode = '';
    //HideOrShow();
    setLocation();

    $(pageID + " #SRoomValue").selectmenu("disable", true);
    $(pageID).find("#setLocLocal").hide();

    $(pageID + " #ServiceContractCovered").attr('checked', false).checkboxradio('refresh');

    $(pageID + " #ServiceContractDropDownList").val('-1');
    $(pageID + " #ServiceContractDropDownList").selectmenu("refresh", true);

    $(pageID + " #CompanyCoveredCheckBox").attr('checked', false).checkboxradio('refresh');

    $(pageID + " #orderTypeDropDown").val('-1');
    $(pageID + " #orderTypeDropDown").selectmenu("refresh", true);

    $(pageID + " #callerNameTextBox").val('');
    $(pageID + " #callerNameTextBox").text('');

    $(pageID + " #CostCenterTextBox").val('');
    $(pageID + " #PendingArrival").val('');
    $(pageID + " #PendingArrival").text('');
    $(pageID + " #PendingDeparture").val('');
    $(pageID + " #PendingLaborLabel").hide();

    ///// Reset attachment fields
    $('#CreateAttachmentContainer').hide();
    $('#HiddenAttachmentFlag').val('false');
    $('#workOrderAttachment').attr("src", "");
    $('#clearAttachmentSource').hide();
    $("#CreateWOAttachment").val('');
    $("#AttachmentRequiredCheckBox").attr('checked', false).checkboxradio("refresh");

    createWOAttachmentFlag = false;

    if ($('#ddlAssignmentType').val() == 'Current User') {
        $(pageID).find("#DateTimeEntered").val('');
        $(pageID).find("#TargetCompleteDateTime").val('');
        $(pageID).find(".SiteTZLabel").text('');
    }
    // $(pageID + " #ResolutionCodeDD option:gt(0)").remove();
    $(pageID + " #ResolutionCodeDD").val('-1');
    $(pageID + " #ResolutionCodeDD").selectmenu('refresh');
    $(pageID + " #RCGroupValueLabel").html('');
    $(pageID + " #RCSubGroupValue").html('');
}

function LoadHiddenFields() {
    var targetcomplete = null;
    pageID = "#" + $.mobile.activePage.attr("id");
    $(pageID + " #hiddenFieldCityText").val($(pageID + " #SStCityValue").text());
    $(pageID + " #hiddenFieldBuildingText").val($(pageID + " #SBuildingValue").text());
    $(pageID + " #hiddenFieldCityValue").val($(pageID + " #SStCityValue").attr("data-value"));
    $(pageID + " #hiddenFieldBuildingValue").val($(pageID + " #SBuildingValue").attr("data-value"));
    $(pageID + " #hiddenFieldFloorText").val($(pageID + " #SFloorValue").text());
    $(pageID + " #hiddenFieldRoomText").val($(pageID + " #SRoomValue").text());
    $(pageID + " #hiddenArrivalDate").val($(pageID + " #PendingArrival").data("value"));
    $(pageID + " #hiddenDepartureDate").val($(pageID + " #PendingDeparture").data("value"));
    $(pageID + " #HiddenSourceField").val($(pageID + " #WorkOrderSourceSelect").find('option:selected').text());
    $(pageID + " #SelfGenPriorityFlag").val(getLocal("SelfGenPriority"));
    $(pageID + " #HiddenGPSLocation").val(GlobalLat + "," + GlobalLong);
    $(pageID + " #HiddenSessionID").val(decryptStr(getLocal("SessionID")));
    if (getLocal("PreviousScreen") === "WOStepPage") {
        $(pageID + " #HiddenParentWO").val(getLocal("WONumber"));
    }

    // If order type is not selected, don't pass in -1, just use the default case in the service.
    if ($("#orderTypeDropDown").val() != "-1") {
        $(pageID + " #HiddenOrderType").val($(pageID + " #orderTypeDropDown").val());
    }

    if ($('#ddlAssignmentType').val() == 'Current User') {
        SelfGenYesOrNo = 1;
        $(pageID + " #HiddenFieldAssignment").val($(pageID + " #ddlAssignment").find('option:selected').val());
        $(pageID + " #SelfGenFlag").val(SelfGenYesOrNo);
        $(pageID + " #hiddenDateEntered").val($(pageID + " #DateTimeEntered").val().replace('T', ' '));
        $(pageID + " #hiddenTargetComplete").val($(pageID + " #TargetCompleteDateTime").val().replace('T', ' '));
        targetcomplete = $(pageID + " #TargetCompleteDateTime").val().split('T');
        if (targetcomplete != null && targetcomplete != "") {
            if (targetcomplete[1].split(':').length > 2) {
                $(pageID + " #hiddenTargetComplete").val(targetcomplete[0] + ' ' + targetcomplete[1].split(':')[0] + ':' + targetcomplete[1].split(':')[1]);
                $(pageID + " #TargetCompleteDateTime").val(targetcomplete[0] + 'T' + targetcomplete[1].split(':')[0] + ':' + targetcomplete[1].split(':')[1]);
            }
        }
    }
    else {
        SelfGenYesOrNo = 0;
        $(pageID + " #SelfGenFlag").val(SelfGenYesOrNo);
    }
    if ($(pageID + " #callerNameTextBox").val() !== undefined) {
        $(pageID + " #HiddenFieldCallerName").val(securityError($(pageID + " #callerNameTextBox")));
    }
}

var employeeNumber = null;
var vendorNumber = null;
function TechnicianYes() {
    var optType;
    var opt;
    if (employeeNumber !== null) {
        if (employeeNumber !== "override") {
            optType = '<option value="Employee"></option>';
            $('#ddlAssignmentType option:gt(0)').remove();
            $('#ddlAssignmentType').append(optType);
            $('#ddlAssignmentType').val('Employee').selectmenu('refresh', true);
            $('#ddlAssignment option:gt(0)').remove();
            opt = '<option value="' + employeeNumber + '"></option>';
            $('#ddlAssignment').append(opt);
            $('#ddlAssignment').val(employeeNumber).selectmenu('refresh');
            $('#ddlAssignmentType').val('Employee').selectmenu('refresh', true);
        }
    }
    else {
        optType = '<option value="Vendor"></option>';
        $('#ddlAssignmentType option:gt(0)').remove();
        $('#ddlAssignmentType').append(optType);
        $('#ddlAssignmentType').val('Vendor').selectmenu('refresh', true);
        $('#ddlAssignment option:gt(0)').remove();
        opt = '<option value="' + vendorNumber + '"></option>';
        $('#ddlAssignment').append(opt);
        $('#ddlAssignment').val(vendorNumber).selectmenu('refresh');
        ////$('#EmployeeNumber').val(vendorNumber);
    }

    // Employee override is a corner case where the user is unavailable and has no backup. Used for post-create error message.
    if (employeeNumber === "override") {
        $(pageID + ' #hiddenAssignmentOverride').val('true');
    } else {
        $(pageID + ' #hiddenAssignmentOverride').val('false');
    }

    $('#TechnicianAvailableDiv').popup("close");
    closePopUP = true;
    $('#hiddenProcessStage').val("2");
    SubmitForm();
}

function TechnicalNo() {
    pageID = "#" + $.mobile.activePage.attr("id");
    $(pageID + ' #hiddenAssignmentOverride').val('true');
    $('#TechnicianAvailableDiv').popup("close");
    closePopUP = true;
    $('#hiddenProcessStage').val("3");
    SubmitForm();
}

function TechnicalCancel() {
    $('#ddlAssignmentType').val('Manager').selectmenu('refresh', true);
    BindAssignmentDropDown();
    closePopUP = true;
    setTimeout(function () {
        $('#ddlAssignment').val('FM');
        $('#ddlAssignment').selectmenu('refresh', true);
        $('#TechnicianAvailableDiv').popup("close");
        SubmitForm();
    }, 1000);
}

//====Submit Form when Save button is clicked====
function SubmitForm() {

    try {
        LoadHiddenFields();

        // Added by Arpitha to validate estimated cost value
        var regexEstimatedCost = new RegExp(/^[$]?([-][0-9]{1,2}([.][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([.][0-9]{1,2})$|^[$]?[0-9]{1,13}$/);
        var estimatedCostValue = regexEstimatedCost.test($.trim($('#EstimatedServiceCostText').val()));
        var errorMessage;
        var status = false;
        status = ValidateFields();
        pageID = "#" + $.mobile.activePage.attr("id");
        if (!status) {
            ////showError("Please fill all mandatory fields");
            showError(GetTranslatedValue("FillAll"));
            $(pageID + " #A1").removeClass('ui-disabled');
        }
        else if ((!estimatedCostValue) && ($.trim($('#EstimatedServiceCostText').val()).length !== 0)) {
            ////showError("Estimated service Cost value given is invalid. Please enter valid currency value.");
            showError(GetTranslatedValue("InvalidEstimatedCost"));
        }
        else if ($.trim($('#EstimatedServiceCostText').val()).length === 0 && $(pageID).find('#EstimatedServiceCostText').attr("requried") == "true") {
            ////showError("Please enter Estimated service cost");
            showError(GetTranslatedValue("EnterEstimatedCost"));
        }
        else if ($('#CurrencyCodeSelect').val() == "-1" && $(pageID).find('#CurrencyCodeSelect').attr("requried") == "true") {
            ////showError("Please enter the currency code");
            showError(GetTranslatedValue("EnterCurrencyCode"));
        }
        else if ($('#CostCenterTextBox').is(':visible') && $.trim($('#CostCenterTextBox').val()).length === 0 && $(pageID).find('#CostCenterTextBox').attr("requried") == "true") {
            ////showError("Please enter cost center.");
            showError(GetTranslatedValue("EnterCostCenter"));
        }
        else if ($('#ServiceContractDropDownList').is(':visible') && $('#ServiceContractDropDownList').val() == "-1" && $(pageID).find('#ServiceContractDropDownList').attr("requried") == "true") {
            ////showError("Please enter the service contract.");
            showError(GetTranslatedValue("EnterServiceContract"));
        }
        else if (createWOAttachmentFlag && $("#workOrderAttachment").attr('src').length == 1) {
            showError(GetCommonTranslatedValue("AttachmentRequired"));
        }
        else if ($('#ResolutionCodeDD').is(':visible') && $('#ResolutionCodeDD').val() == "-1" && $(pageID).find('#ResolutionCodeDD').attr("requried") == "true") {
            showError(GetTranslatedValue("EnterResolutionCode"));
        }
        else if ($('#SelfGenDateTime').is(':visible')) {
            if ($.trim($('#DateTimeEntered').val()).length === 0 && $.trim($('#TargetCompleteDateTime').val()).length === 0) {
                showError(GetCommonTranslatedValue("RequiredFields"));
            }
        }
        else if ($('#callerNameTextBox').is(':visible') && $('#callerNameTextBox').length == 0 && $('#callerNameTextBox').attr("requried") == "true") {
            showError(GetTranslatedValue("EnterCallerName"));
        }
        else if ($('#orderTypeDropDown').is(':visible') && $('#orderTypeDropDown').val() == "-1") {
            showError(GetTranslatedValue("EnterOrderType"));
        }
        else {
            var validationMessage = null;
            if ($('#ddlAssignmentType').val() == 'Current User') {
                validationMessage = ValidateDate();
                if (validationMessage != null) {
                    showError(validationMessage);
                    return;
                }
                else {
                    LoadHiddenFields();
                }
            }

            var WOD = JSON.stringify($(pageID + " #frmCreateWO").serializeArray());
            
            if (!navigator.onLine && $('#ddlAssignmentType').val() == 'Current User') {
                var elements = $(pageID + " #frmCreateWO").serializeArray();
                elements.forEach(function (element) {
                    if(element.name == "DateTimeEntered" || element.name == "hiddenDateEntered") {  
                        var tempDateTimeEntered = element.value;
                        if(tempDateTimeEntered.match(/\:/g) && tempDateTimeEntered.match(/\:/g).length == 2) {
                            tempDateTimeEntered = tempDateTimeEntered.split(':')[0]+ ":" + tempDateTimeEntered.split(':')[1];
                        }
                        element.value = tempDateTimeEntered;
                    }});
                WOD = JSON.stringify(elements);
            }

              if (navigator.onLine)  {
                $(pageID + " #A1").addClass('ui-disabled');
                $(pageID + 'actionLoadingPopup h1').text(GetTranslatedValue("CreatingWO"));
                if (closePopUP === true) {
                    setTimeout(function () {
                        showActionPopupLoading();
                    }, 500);
                }
                else {
                    showActionPopupLoading();
                }


                $.ajaxpostCreateJSON(standardAddress + "CreateWO.ashx?method=Save", { WOData: WOD }, function (serverDATA) {
                    $.mobile.loading("hide");
                    employeeNumber = null;
                    vendorNumber = null;
                    $(pageID).find("#AssignToFMButton").show();
                    //// logic need to be modified for saving attachment
                    if (createWOAttachmentFlag) {
                        if (serverDATA.indexOf("SUCCESS") != -1) {
                            var WON = serverDATA.split(':');
                            setLocal("WorkOrderNumber", WON[1]);
                            $('#CreateWODataBaseID').val(decryptStr(getLocal("DatabaseID")));
                            $('#CreateWOUserName').val(decryptStr(getLocal("UserName")));
                            $('#CreateWOLanguage').val(getLocal("Language"));
                            $('#CreateWOEmployeeNumber').val(decryptStr(getLocal("EmployeeNumber")));
                            $('#CreateWOEmployeeName').val(decryptStr(getLocal("EmployeeName")));
                            $('#CreateWONumber').val(WON[1]);
                            $('#CreateWOPriority').val(WON[2]);
                            $('#GPSLocation').val(GlobalLat + "," + GlobalLong);
                            $('#SessionID').val(decryptStr(getLocal("SessionID")));

                            // Store error message if error occurred during labor add.
                            if (WON.length > 3) {
                                setLocal("ErrorMessage", WON[3]);
                            }

                            $('#AttachDispForCreateWO').click();
                        } else {
                            // If serverDATA doesnt contain Success, then it's either Tech Avail or Error.
                            createWOErrorhandling(serverDATA);
                        }
                    } else {
                        if (!IsStringNullOrEmpty(serverDATA.DetWONumberVal) && !IsObjectNullOrUndefined(serverDATA.DetWONumberVal)) {
                            // No attachment, so process the rest of the form like normal.
                            createWorkOrderFlag = true;
                            newWorkOrderData = serverDATA;
                            if (!IsStringNullOrEmpty(newWorkOrderData.ErrorMessage)) {
                                setLocal("ErrorMessage", newWorkOrderData.ErrorMessage);
                            }

                            // If we're on the tag, don't let this be in the breadcrumb.
                            if (pageID === "#CreateWOT") {
                                var breadcrumb = getLocal("Breadcrumb").split(',');
                                breadcrumb.pop();
                                setLocal("Breadcrumb", breadcrumb);
                            }

                            //setLocal("PreviousScreen", null);
                            if (getLocal("PreviousScreen") == "WOStepPage") {
                                navigateToPreviousPage();
                            } else {
                                setLocal("WorkOrderNumber", serverDATA.DetWONumberVal);
                                $.mobile.changePage("WorkOrderDetails.html");
                            }
                        } else {
                            // If serverDATA doesnt contain Success, then it's either Tech Avail or Error.
                            createWOErrorhandling(serverDATA);
                        } ////end of else condition if work order number is empty.
                    }

                });       //// end of $.ajaxpostCreateJSON call.
            } //// end of online condition.

            else {  //// condition for offline. 
                if (createWOAttachmentFlag) {
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetTranslatedValue("CannotAttachOffline"));
                    }, 650);
                }
                else {
                    DumpintoLocalDB(WOD);
                }
            } //// end of condition for offline.
        }
    }
    catch (Error) {
        showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }
}

//====For checking Internet status (Online or Offline)=====
function checkNetworkStatus() {
    if (navigator.onLine) {
        return true;
    }
    else {
        return false;
    }
}

function ValidateFields() {
    var returnvalue = true;
    var pageID = "#" + $.mobile.activePage.attr('id');
    $(pageID).find("[data-requried='true']").each(function () {
        switch (this.tagName.toUpperCase()) {
            case "SELECT":
                if (this.value == "-1" || this.value == "-3") {
                    returnvalue = false;
                }
                break;
            case "INPUT":
                if (this.value.length === 0) {
                    returnvalue = false;
                }
                break;
            case "TEXTAREA":
                if (this.value.length === 0) {
                    returnvalue = false;
                }
                break;
        }
    });
    return returnvalue;
}

function OflBindAssignmentDDEmployee() {
    try {
        var assignmentTypeID = $(pageID + " #ddlAssignmentType").val();
        var db = openDatabase('iMFMDB', '', null, null);
        db.transaction(function (tx) {
            tx.executeSql('SELECT AssignmentID, AssignmentText FROM AssignmentTable WHERE AssignmentTypeID = ?', [assignmentTypeID], PopulateAssignmentDDLocally, failureSQL);
        });
    }
    catch (Error) {
        ShowError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }
}

function OflBindAssignmentDDCurrentUser() {
    try {
        var assignmentTypeID = 'Employee';
        var db = openDatabase('iMFMDB', '', null, null);
        db.transaction(function (tx) {
            tx.executeSql('SELECT AssignmentID, AssignmentText FROM AssignmentTable WHERE AssignmentTypeID = ?', [assignmentTypeID], PopulateAssignmentDDLocally, failureSQL);
        });
    }
    catch (Error) {
        ShowError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }
}

//====Populating AssignmentDD From Local DB "STARTS"====
function PopulateAssignmentDDLocally(tx, results) {
    $(pageID + " #ddlAssignment").selectmenu("enable", true);
    $(pageID + " #ddlAssignment").children('option:not(:first)').remove();
    var i = 0;
    if (results.rows.length === 0) {
        $(pageID + " #ddlAssignment option:first").attr('selected', 'selected');
        $(pageID + " #ddlAssignment").selectmenu("disable", true);
        return false;
    }
    for (i = 0; i < results.rows.length; i++) {
        var tag = document.createElement('option');
        tag.setAttribute("value", results.rows.item(i).AssignmentID);
        tag.innerHTML = results.rows.item(i).AssignmentText;
        $(pageID + " #ddlAssignment").append(tag);
    }

    if ($('#ddlAssignmentType').val() == 'Current User') {
        $(pageID).find("#ddlAssignment").val(decryptStr(getLocal("EmployeeNumber")));
        $(pageID).find("#ddlAssignment").selectmenu("refresh", true);
        $(pageID).find("#ddlAssignment").prop("disabled", true);
        return;
    }

    $(pageID + " #ddlAssignment option:first").attr('selected', 'selected');
    $(pageID + " #ddlAssignment").selectmenu("refresh", true);
}

//====Getting Data from LocalDB====
function GetDataFromLocalDB(code) {
    // var db = openDatabase('iMFMDB', '', null, null);
    openDB();
    var pageID = '#' + $.mobile.activePage.attr('id');

    switch (code) {
        // Getting Assignment data                                                                                                                                                                                                 
        case "1":
            var assignmentTypeID = $(pageID + " #ddlAssignmentType").val();
            dB.transaction(function (tx) {
                tx.executeSql('SELECT AssignmentID, AssignmentText FROM AssignmentTable WHERE AssignmentTypeID = ?', [assignmentTypeID], PopulateAssignmentDDLocally, failureSQL);
            });
            break;
        // Getting Property Search Result                                                                                                                                                                                                 
        case "2":
            var enteredProperty = jQuery.trim($(pageID + " #propertyID").val());
            dB.transaction(function (tx) {
                tx.executeSql("SELECT RegionID, RegionText, PropertyID, PropertyText, CurrencyCode  FROM PropertyTable WHERE TCC_Project_Number = ? COLLATE NOCASE", [enteredProperty], SetCityBuildingLocally, failureSQL);
            });
            break;
        //Getting Floor Data From Local DB.                                                                                                                                                                                                  
        case "3":
            //var city
            ID = $(pageID + " #hiddenFieldCityValue").val();
            var buildingID = $(pageID + " #hiddenFieldBuildingValue").val();
            dB.transaction(function (tx) {
                //tx.executeSql("SELECT FloorID, FloorText FROM PropertyTable WHERE (RegionID = ? and PropertyID = ?) ORDER BY FloorText", [cityID, buildingID], SetFloorLocally, failureSQL);
                tx.executeSql("SELECT FloorID, FloorText FROM FloorTable WHERE (PropertyID = ?) ORDER BY FloorText", [buildingID], SetFloorLocally, failureSQL);

            });
            break;
        //Getting Problem code Data From Local DB.                                                                                                                                                                                                 
        case "4":
            var problemSearchText = jQuery.trim($(pageID + " #PCTB").val());
            dB.transaction(function (tx) {
                tx.executeSql("SELECT Distinct( ProblemCodeID) , ProblemCodeDescription FROM ProblemTable WHERE (ProblemCodeDescription LIKE ?) ORDER BY ProblemCodeDescription", ["%" + problemSearchText + "%"], SetProblemCodeLocally, failureSQL);
            });
            break;
        //Getting Group SubGroup Data From Local DB.                                                
        case "5":
            var problemCodeValue = $(pageID + " #problemCodeDD option:selected").val();
            var buildingCurrency = $(pageID + " #HiddenBuildingCurrency").text();

            dB.transaction(function (tx) {
                tx.executeSql("SELECT GroupID, GroupDescription, SubGroupID, SubGroupDescription,EstServiceCost, CurrencyCode FROM ProblemTable WHERE (ProblemCodeID = ? )", [problemCodeValue], SetGroupSubgroupLocally, failureSQL);
            });
            break;
        //Getting Room Data From Local DB.                                                                                                                                                                                               
        case "6":
            //var cityValue = $(pageID + " #hiddenFieldCityValue").val();
            var buildingValue = $(pageID + " #hiddenFieldBuildingValue").val();
            var selectedFloor = $(pageID + " #ddlFloor").val();
            dB.transaction(function (tx) {
                //tx.executeSql("SELECT RoomID, RoomText FROM PropertyTable WHERE (RegionID = ? and PropertyID = ? and FloorID = ?)", [cityValue, buildingValue, selectedFloor], SetRoomLocally, failureSQL);
                tx.executeSql("SELECT RoomID, RoomText FROM RoomTable WHERE (FloorID = ? and PropertyID = ?)", [selectedFloor, buildingValue], SetRoomLocally, failureSQL);
            });
            break;
        // Getting Resolution Code data from local DB for binding DD.                                                                   
        case "7":
            dB.transaction(function (tx) {
                tx.executeSql("SELECT ResolutionCodeNumber, RCDescription FROM ResolutionCodeTable ", [], SetResolutionCodeLocally, failureSQL);
            });
            break;
        case "8":
            var resolutionCodeValue = $(pageID + " #ResolutionCodeDD option:selected").val();
            dB.transaction(function (tx) {
                tx.executeSql("SELECT RCGroupID, RCGroupDescription,RCSubGroupId,RCSubGroupDescription FROM ResolutionCodeTable WHERE (ResolutionCodeNumber = ?) ", [resolutionCodeValue], SetRCGroupSubgroupLocally, failureSQL);
            });
            break;
        // Getting filtered Resolution Code data from local DB (Case WOClose_ResCodeFilterByGroup = 1)                            
        case "9":

            var workOrderNumber = getLocal("WorkOrderNumber");
            dB.transaction(function (tx) {
                tx.executeSql("select p.GroupID from ProblemTable P " +
                                           " Where P.ProblemCodeID = ? ", [getLocal("ProblemCodeNumber")], GetEquipGroupFirst, failureSQL);
            });

            ////            dB.transaction(function (tx) {
            ////                tx.executeSql("SELECT DISTINCT rc.ResolutionCodeNumber, rc.RCDescription FROM ResolutionCodeTable rc " +
            ////                                                     "JOIN WorkOrderDetailsTable wod ON wod.WorkOrderNumber = ? " +
            ////                                                     "JOIN ProblemTable p ON p.ProblemCodeID = wod.ProblemCodeNumber " +
            ////                                                     "WHERE p.GroupID = rc.RCGroupID ", [workOrderNumber], SetResolutionCodeLocally, failureSQL);
            ////            });
            break;
        // Getting filtered Resolution Code data from local DB (Case WOClose_ResCodeFilterByGroup = 2)                                                          
        case "10":

            var workOrderNumber = getLocal("WorkOrderNumber");
            dB.transaction(function (tx) {
                tx.executeSql("select p.GroupID, p.SubGroupID from ProblemTable P " +
                                           " Where P.ProblemCodeID = ? ", [getLocal("ProblemCodeNumber")], GetEquipGroupSubGroupFirst, failureSQL);
            });
            ////            dB.transaction(function (tx) {
            ////                // Need Distinct because PastDue is duplicated in the DB.
            ////                tx.executeSql("SELECT DISTINCT rc.ResolutionCodeNumber, rc.RCDescription FROM ResolutionCodeTable rc " +
            ////                                                     "JOIN WorkOrderDetailsTable wod ON wod.WorkOrderNumber = ? " +
            ////                                                     "JOIN ProblemTable p ON p.ProblemCodeID = wod.ProblemCodeNumber " +
            ////                                                     "WHERE p.GroupID = rc.RCGroupID AND rc.RCSubGroupDescription = p.SubGroupDescription", [workOrderNumber], SetResolutionCodeLocally, failureSQL);
            ////            });
            break;

        case "11":
            var completedGroupID = '';
            var problemCodeID = '';

            if (pageID == '#CreateWOC') {
                completedGroupID = $(pageID + " #groupHiddenField").val();

                if ($(pageID + " #problemCodeDD option:selected").val() == "-1") {
                    $(pageID + " #problemCodeDD").focus();
                    return;
                }

                problemCodeID = $(pageID + " #problemCodeDD option:selected").val();

                ////completedSubGroupID = $(pageID + " #subGroupLabel").val();
            }
            else {
                completedGroupID = getLocal("currentGroupID");
                problemCodeID = getLocal("ProblemCodeNumber");
                ////completedSubGroupID = getLocal("currentSubGroupID");
            }
            if (getLocal("WOClose_ResCodeFilterByGroup") == 0) {
                GetDataFromLocalDB("7");
            } else if (getLocal("WOClose_ResCodeFilterByGroup") == 1) {
                dB.transaction(function (tx) {
                    // Need Distinct because PastDue is duplicated in the DB.
                    tx.executeSql("SELECT DISTINCT rc.ResolutionCodeNumber, rc.RCDescription FROM ResolutionCodeTable rc " +
                                         "WHERE rc.RCGroupID =  ?", [completedGroupID], SetResolutionCodeLocally, failureSQL);
                });
            } else if (getLocal("WOClose_ResCodeFilterByGroup") == 2) {

                dB.transaction(function (tx) {
                    // Need Distinct because PastDue is duplicated in the DB.
                    tx.executeSql("SELECT DISTINCT rc.ResolutionCodeNumber, rc.RCDescription FROM ResolutionCodeTable rc " +
                                         "JOIN ProblemTable p ON p.ProblemCodeID = ? " +
                                         "WHERE p.GroupID = rc.RCGroupID AND rc.RCSubGroupDescription = p.SubGroupDescription", [problemCodeID], SetResolutionCodeLocally, failureSQL);
                });


                ////                    tx.executeSql("SELECT DISTINCT rc.ResolutionCodeNumber, rc.RCDescription FROM ResolutionCodeTable rc " +
                ////                                         "WHERE rc.RCGroupID =  ? and rc.SubGroupDescription = ?", [completedGroupID, completedSubGroupID], SetResolutionCodeLocally, failureSQL);
                ////                });
            }


            break;
    }
}

//==== ExecuteSql failure callback====
function failureSQL(tx, error) {
    LogMessage("ExecuteSql Failed" + error.message);
}

////
// Method to get the Local data for the Equip Group and SubGroup. 
function GetEquipGroupFirst(tx, results) {
    if (results.rows.length > 0) {
        setLocal("currentGroupID", results.rows.item(0).GroupID);
        GetDataFromLocalDB("11");
    }
}

////
// Method to get the Local data for the Equip Group and SubGroup. 
function GetEquipGroupSubGroupFirst(tx, results) {
    if (results.rows.length > 0) {
        setLocal("currentGroupID", results.rows.item(0).GroupID);
        setLocal("currentSubGroupID", results.rows.item(0).SubGroupID);
        GetDataFromLocalDB("11");
    }
}

//====Success callback for getting Property details from Local DB====
function SetCityBuildingLocally(tx, results) {
    var data = [];
    if (results.rows.length == 1) {
        data[0] = results.rows.item(0).RegionText;
        data[1] = results.rows.item(0).RegionID;
        data[2] = results.rows.item(0).PropertyText;
        data[3] = results.rows.item(0).PropertyID;
        data[4] = results.rows.item(0).CurrencyCode;
        SetSearchedPropertyDetails(data);
    }
    else {
        showError($(pageID + " #hiddenFieldLocationNotFoundMsg").val());
    }
}

//====Success callback for getting Floor details from Local DB====
function SetFloorLocally(tx, results) {
    var tag;
    //// Bind the Floor Dropdown
    $(pageID + "  #SRoomValue").selectmenu("disable", true);
    $(pageID + " #SFloorValue").children('option:not(:first)').remove();
    var i = 0;
    if (results.rows.length == 1) {
        tag = document.createElement('option');
        tag.setAttribute("value", decryptStr(results.rows.item(i).FloorID));
        tag.innerHTML = decryptStr(results.rows.item(i).FloorText);
        $(pageID + " #SFloorValue").append(tag);
        $(pageID + " #SFloorValue").val(decryptStr(results.rows.item(i).FloorID)).selectmenu("refresh", true).change();
        $(pageID + " #SFloorValue").selectmenu("enable", true);
        return;
    }
    for (i = 0; i < results.rows.length; i++) {
        tag = document.createElement('option');
        tag.setAttribute("value", decryptStr(results.rows.item(i).FloorID));
        tag.innerHTML = decryptStr(results.rows.item(i).FloorText);
        $(pageID + " #SFloorValue").append(tag);
    }
    $(pageID + " #SFloorValue option:first").attr('selected', 'selected');
    $(pageID + " #SFloorValue").selectmenu("enable", true);
}

//====Success callback for getting Room details From Local DB====
function SetRoomLocally(tx, results) {
    var roomArray = [];
    var i = 0;
    for (i = 0; i < results.rows.length; i++) {
        //Dynamically creating object with Name and Description properties.
        var obj = {};
        obj.Name = decryptStr(results.rows.item(i).RoomID);
        obj.Description = decryptStr(results.rows.item(i).RoomText);
        roomArray[i] = obj;
    }
    SetRoomData(roomArray);
}

//====SetRoomData "STARTS"====
function SetRoomData(result) {
    var tag;
    //Bind the Room Dropdown
    pageID = "#" + $.mobile.activePage.attr('id');
    $(pageID + " #SRoomValue").children('option:not(:first)').remove();
    //If only one Result, Then set that as the selected Room.
    if (result.length == 1) {
        tag = document.createElement('option');
        tag.setAttribute("value", result[0].Name);
        tag.innerHTML = result[0].Description;
        $(pageID + " #SRoomValue").append(tag);
        document.getElementById("SRoomValue").options.add(tag);
        $(pageID + " #SRoomValue").val(result[0].Name).selectmenu("refresh", true).change();
        $(pageID + " #SRoomValue").selectmenu("enable", true);

        // We need to load the Matrix based data or the local data for the Problem code here as well.
        GetGroupSubgroupData();

        return;
    }
    var i = 0;
    for (i = 0; i < result.length; i++) {
        tag = document.createElement('option');
        tag.setAttribute("value", result[i].Name);
        tag.innerHTML = result[i].Description;
        $(pageID + " #SRoomValue").append(tag);
    }
    $(pageID + " #SRoomValue option:first").attr('selected', 'selected');
    $("#" + pageID).find("#SRoomValue").selectmenu("enable", true);
}

//====Success callback for getting ProblemCode details from Local DB====
function SetProblemCodeLocally(tx, results) {
    var problemArray = [];
    var i = 0;
    for (i = 0; i < results.rows.length; i++) {
        //Dynamically creating object with key value properties.
        var obj = {};
        obj.Key = results.rows.item(i).ProblemCodeDescription;
        obj.Value = results.rows.item(i).ProblemCodeID;
        ////obj.EstServiceCost = decryptStr(results.rows.item(i).EstServiceCost);
        ////obj.CurrencyCode = results.rows.item(i).CurrencyCode;
        problemArray[i] = obj;
    }
    PopulateproblemCodeDD(problemArray);
}

//====Success callback for getting Group SubGroup details from Local DB====
function SetGroupSubgroupLocally(tx, results) {
    // Here is where we have to check if the NTE has to be loaded from the Matrix or from the PC. Matrix is the first priority.
    var loadEstimatedServiceCostConfig = getLocal("iMFM_FetchNTEConfig");
    var groupSubgroupArray = [];
    groupSubgroupArray[0] = results.rows.item(0).GroupDescription;
    groupSubgroupArray[1] = results.rows.item(0).GroupID;
    groupSubgroupArray[2] = results.rows.item(0).SubGroupDescription;
    groupSubgroupArray[3] = results.rows.item(0).SubGroupID;

    // Check the company default for loading the PC from Matrix or PC. 0 to leave it as it is. 1 to load from hierarchy. 2 to exclusively load from Matrix.

    // Get the Data. 
    // Case 1: When the Company Default is set to 1 or 2
    var matrixEstimatedCost = "0.00";
    var matrixCurrency = "USD";
    var estimatedCostActual = parseFloat(decryptStr(results.rows.item(0).EstServiceCost), 10).toFixed(2);
    var currencyActual = "USD"; // Reset it to Default, just in case. 

    // First reset the NTE. 
    InspLoadCostandCurrency(matrixEstimatedCost, matrixCurrency);

    // Need to find the CustomerNumber and CustomerSiteNumber. Its different and CreateWOT and others. 
    //$(pageID + " #SRoomValue").text()
    var customerNumberSiteRAW;
    if (pageID == '#CreateWOT') {
        customerNumberSiteRAW = getLocal("CustomerSiteNumber");
    }
    else {
        customerNumberSiteRAW = $(pageID + " #SRoomValue option:selected").val();
    }

    try {
        if (loadEstimatedServiceCostConfig == 1 || loadEstimatedServiceCostConfig == 2) {
            if (navigator.onLine) {
                $(".DeviceTimeLabel").hide();
                var MatrixFetchData = {
                    DatabaseId: decryptStr(localStorage.getItem("DatabaseID")),
                    Culture: localStorage.getItem("Language"),
                    EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                    SessionID: decryptStr(getLocal("SessionID")),
                    CustomerSiteNumber: customerNumberSiteRAW,
                    ProblemCode: $(pageID + " #problemCodeDD option:selected").val()
                };
                $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetMatrixBasedInformation", { MatrixFetchData: JSON.stringify(MatrixFetchData) }, function (result) {

                    if (result != null) {
                        matrixEstimatedCost = result.EstServiceCost;
                        matrixCurrency = result.CurrencyCode;
                        LoadCostandCurrency(parseFloat(result.EstServiceCost, 10).toFixed(2), result.CurrencyCode);
                    }
                    else {
                        LoadCostandCurrency(parseFloat(estimatedCostActual, 10).toFixed(2), currencyActual);
                    }
                });
            }
        }
        else {
            // Wrote a separate method becuase if we do not have a NTE record for the Building Curerncy, even the Group/SubGroup will also not load. 
            LoadCostCurrencyFromLocalDB();
        }
    }
    catch (error) {
        LoadCostandCurrency(estimatedCostActual, currencyActual);
    }

    SetGroupSubgroupData(groupSubgroupArray);
}

function LoadCostCurrencyFromLocalDB() {
    //Getting Group SubGroup Data From Local DB. 
    var problemCodeValue = $(pageID + " #problemCodeDD option:selected").val();
    var buildingCurrency = $(pageID + " #HiddenBuildingCurrency").text();

    if (pageID == '#CreateWOT' && buildingCurrency == '') {
        // We have to calculate exclusively for the CreateWOT becuase there is no option to select the Building in Create WO from Assets. 
        var cotRegion = getLocal("RegionNumber");
        var cotDivision = getLocal("DivisionNumber");

        dB.transaction(function (tx) {
            tx.executeSql("SELECT CurrencyCode FROM PropertyTable WHERE (RegionID = ? and PropertyID = ?)", [cotRegion, cotDivision], GetTheBuildingCurrencyLocal, failureSQL);
        });

    }

    dB.transaction(function (tx) {
        tx.executeSql("SELECT GroupID, GroupDescription, SubGroupID, SubGroupDescription,EstServiceCost,CurrencyCode FROM ProblemTable WHERE (ProblemCodeID = ? and CurrencyCode = ?)", [problemCodeValue, buildingCurrency], SetCostCurrencyLocally, failureSQL);
    });

}

///
// Method to load the Building Curency Locally. 
///
function GetTheBuildingCurrencyLocal(tx, results) {
    try {
        if (results != null) {
            $(pageID + " #HiddenBuildingCurrency").text(results.rows.item(0).CurrencyCode);
        }
        else {
            $(pageID + " #HiddenBuildingCurrency").text("USD");
        }

        LoadCostCurrencyFromLocalDB();
    }
    catch (error) {
        $(pageID + " #HiddenBuildingCurrency").text("USD");
        LoadCostCurrencyFromLocalDB();
    }
}

//====Success callback for getting Currency and Currency Code details from Local DB====
function SetCostCurrencyLocally(tx, results) {
    try {
        if (results.rows.length == 1) {
            LoadCostandCurrency(parseFloat(decryptStr(results.rows.item(0).EstServiceCost), 10).toFixed(2), results.rows.item(0).CurrencyCode);
        }
        else {
            LoadCostandCurrency("0.00", $(pageID + " #HiddenBuildingCurrency").text());
        }
    }
    catch (error) {
        LoadCostandCurrency("0.00", $(pageID + " #HiddenBuildingCurrency").text());
    }
}

function LoadCostandCurrency(estCostCalculated, currencyCalculated) {
    $(pageID).find("#EstimatedServiceCostText").val(estCostCalculated);
    $(pageID).find("#CurrencyCodeSelect").val(currencyCalculated);
    $(pageID).find("#CurrencyCodeSelect").selectmenu("refresh", true);
    $(pageID).find("#hiddenProblemCodeCurrencyCode").val(currencyCalculated)
}

//====Function to update LocalDB tables with latest data from server====
function WOUpdateLocalDb() {
    LogMessage('Trying to Update LocalDB with Latest data');
    // First try to get latest data from server.If successful, delete Local DB data and then populate it with the latest data.
    $.ajax({
        type: "POST",
        url: '<%: Url.Action("GetOfflineData","DashBoard") %>',
        dataType: "json",
        headers: { "Origin": ORIGIN_HEADER },
        success: function (data) {
            //Success in getting data from server.
            LogMessage('Success in getting Latest data from server');
            LogMessage('Trying to Delete local data and Populate them with Latest one');
            DeleteWOLocalData();
            PopulateTables(data);
        },
        error: function () {
            LogMessage('Failed in getting Latest data from server');
            //Close Popups If any.
            $('#CreateWorkOrderforDispatch' + ' #woSyncPopupDiv').popup("close");
            $('#SelfGen2' + ' #woSyncPopupDiv').popup("close");
            ////showError("Error Getting Offline Data");
            showError(GetTranslatedValue("ErrorOffline"));
        }
    });
}

//====Log message in Browser====


//====Deleting Data from Local DB====
function DeleteWOLocalData() {
    var db = openDatabase('iMFMDB', '', null, null);
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM AssignmentTypeTable');
        tx.executeSql('DELETE FROM AssignmentTable');
        tx.executeSql('DELETE FROM PropertyTable');
        tx.executeSql('DELETE FROM FloorTable');
        tx.executeSql('DELETE FROM RoomTable');
        tx.executeSql('DELETE FROM ProblemTable');
    },
            ErrorCallback,
            LocalDbDeleteWOSuccessCallback
            );
}

//====LocalDbDeleteWOSuccessCallback====
function LocalDbDeleteWOSuccessCallback() {
    LogMessage('Deletion of data from LocalDB related to WOCreate pages is Successful');
    ////showError("Deletion of data from LocalDB related to WOCreate pages is Successful.");
    showError(GetTranslatedValue("DeletedFromLocalDB"));
}

//====Populating Tables======
function PopulateTables(data) {
    var db = openDatabase('iMFMDB', '', null, null);
    var i = 0;
    var columnArray;
    var valueArray;
    var insertQuery;

    db.transaction(function (tx) {
        //Populating AssignmentType table
        for (i = 0; i < data.assignmentTypeList.length; i++) {
            columnArray = ['AssignmentTypeID'];
            valueArray = [data.assignmentTypeList[i]];
            insertQuery = "INSERT INTO AssignmentTypeTable(" + columnArray + " ) " + "VALUES (?)";
            tx.executeSql(insertQuery, valueArray);
        }
        //Populating Assignment table
        for (i = 0; i < data.employeeList.length; i++) {
            var assignmentType = data.employeeList[i].Key; //e.g "Employee"
            var assignmentArray = data.employeeList[i].Value; //e.g List of employees with name and Number key value pair.
            for (var j = 0; j < assignmentArray.length; j++) {
                var empName = assignmentArray[j].name;
                var empNumber = assignmentArray[j].number;
                //Insert into Assignment table
                columnArray = ['AssignmentID', 'AssignmentText', 'AssignmentTypeID'];
                valueArray = [empNumber, "'" + empName + "'", "'" + assignmentType + "'"];
                var query = CreateInsertQuery("AssignmentTable", columnArray, valueArray);
                tx.executeSql(query);
            }
        }
        //Populating Property table
        //PropertyID is same as DivisionNumber
        for (i = 0; i < data.propertyList.length; i++) {
            columnArray = ['PropertyID', 'PropertyText', 'RegionID', 'RegionText', 'FloorID', 'FloorText', 'RoomID', 'RoomText'];
            var PropertyID = data.propertyList[i].PropertyID;
            var PropertyDescription = data.propertyList[i].PropertyDescription;
            var RegionID = data.propertyList[i].RegionID;
            var RegionDescription = data.propertyList[i].RegionDescription;
            var DistrictID = data.propertyList[i].DistrictID;
            var DistrictDescription = data.propertyList[i].DistrictDescription;
            var RoomID = data.propertyList[i].RoomID;
            var RoomDescription = data.propertyList[i].RoomDescription;
            valueArray = [PropertyID, PropertyDescription, RegionID, RegionDescription, DistrictID, DistrictDescription, RoomID, RoomDescription];
            insertQuery = "INSERT INTO PropertyTable(" + columnArray + " ) " + "VALUES (?,?,?,?,?,?,?,?)";
            tx.executeSql(insertQuery, valueArray);
        }

        //Populate Problem table
        for (i = 0; i < data.problemList.length; i++) {
            columnArray = ['ProblemCodeID', 'ProblemCodeText', 'GroupID', 'GroupDescription', 'SubGroupID', 'SubGroupDescription'];
            var ProblemCodeID = data.problemList[i].ProblemCodeID;
            var ProblemCodeText = data.problemList[i].ProblemCode;
            var GroupID = data.problemList[i].GroupID;
            var GroupDescription = data.problemList[i].GroupDescription;
            var SubGroupID = data.problemList[i].SubGroupID;
            var SubGroupDescription = data.problemList[i].SubGroupDescription;
            valueArray = [ProblemCodeID, ProblemCodeText, GroupID, GroupDescription, SubGroupID, SubGroupDescription];
            insertQuery = "INSERT INTO ProblemTable(" + columnArray + " ) " + "VALUES (?,?,?,?,?,?)";
            tx.executeSql(insertQuery, valueArray);
        }
    },
         ErrorCallback,
         LocalDbInsertSuccessCallback
        );

}

//====Transaction ErrorCallBack====
function ErrorCallback(error) {
    LogMessage('Error in LocalDB Transaction');
    showError(GetTranslatedValue("ErrorLocalDB"));
    $('#syncPopupDiv').popup("close");
    $('#WOCreate' + ' #woSyncPopupDiv').popup("close");
    $('#SelfGen2' + ' #woSyncPopupDiv').popup("close");
}

//====LocalDbInsertSuccessCallback====
function LocalDbInsertSuccessCallback() {
    LogMessage('Populating LocalDB tables Successful');
    showError(GetTranslatedValue("PopulatingLocalDB"));
    $('#syncPopupDiv').popup("close");
    $('#WOCreate' + ' #woSyncPopupDiv').popup("close");
    $('#SelfGen2' + ' #woSyncPopupDiv').popup("close");
}

//====LocalDbDeleteWOSuccessCallback====
function LocalDbDeleteWOSuccessCallback() {
    LogMessage('Deletion of data from LocalDB related to WOCreate pages is Successful');
    ////showError("Deletion of data from LocalDB related to WOCreate pages is Successful.");
    showError(GetTranslatedValue("DeletedFromLocalDB"));
}

function WOCreate_SetLocLocal() {
    var pageID = $.mobile.activePage.attr('id');
    var locID = $.trim($(pageID + " #hiddenFieldBuildingValue").val());
    if (locID !== '') {
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT TCC_Project_Number,PropertyText,RegionText  FROM PropertyTable WHERE PropertyID = ?", [locID], function (ts, results) {
                setLocal('LocName', results.rows.item(0).TCC_Project_Number);
                setLocal('LocationNameFull', "@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                $("#Home").find("#LocationLabel").html("@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                $("#" + pageID).find("#setHomeLink").hide();
            },
                        function (e, m, s) { log(e.status); });
        });
    }
}

function BindServiceContractDDL(ddlValue) {
    var FilterSCValue = getLocal("FilterSCValue");
    var vendorSelected = 1;
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectedVendorNum = "";
    var serviceContractSelectQuery;

    if (pageID == "#WODetailsPage") {
        selectedVendorNum = getLocal("WOAssignedVendor");
    }
    else {
        selectedVendorNum = $(pageID + " #ddlAssignment").val();
        vendorSelected = getLocal("VendorSelected");
    }
    if ($(pageID + " #GipPanelSecurityReq").val() !== undefined) {
        if ($(pageID + " #GipPanelSecurityReq").val() == 1 && vendorSelected == 1) {
            $(pageID + " #ServiceContractDropDownList").attr("Requried", "true");
            $(pageID + " #ServiceContractRequiredLabel").show();
        }
        else {
            $(pageID + " #ServiceContractDropDownList").attr("Requried", "false");
            $(pageID + " #ServiceContractRequiredLabel").hide();
        }
    }
    $(pageID).find("#ServiceContractDropDownList").children('option:not(:first)').remove();
    $(pageID + " #ServiceContractDropDownList").selectmenu('refresh');

    if (vendorSelected == 1 && FilterSCValue == 1) {
        var vendorNum = selectedVendorNum.split("-", 1);
        serviceContractSelectQuery = 'Select * FROM ServiceContractTable WHERE VendorNumber = ' + vendorNum + ' ';
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(serviceContractSelectQuery, [], function (te, result) {
                var item;
                for (var i = 0; i < result.rows.length; i++) {
                    item = result.rows.item(i);
                    $("#ServiceContractDropDownList").append("<option value='" + decryptStr(item.ServiceContractID) + "'>" + decryptStr(item.Description) + "</option>");
                }
                $("#ServiceContractDropDownList").selectmenu('refresh');
                $("#ServiceContractDropDownList").val(ddlValue);
                $("#ServiceContractDropDownList").selectmenu("refresh", true);
            });
        });
    }
    else if (vendorSelected == 1) {
        serviceContractSelectQuery = 'Select * FROM ServiceContractTable ';
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(serviceContractSelectQuery, [], function (te, result) {
                var item;
                for (var i = 0; i < result.rows.length; i++) {
                    item = result.rows.item(i);
                    $("#ServiceContractDropDownList").append("<option value='" + decryptStr(item.ServiceContractID) + "'>" + decryptStr(item.Description) + "</option>");
                }
                $("#ServiceContractDropDownList").selectmenu('refresh');
                $("#ServiceContractDropDownList").val(ddlValue);
                $("#ServiceContractDropDownList").selectmenu("refresh", true);
            });
        });
    }
}

function CheckCostCenterRequired() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var CompanyCoveredIsBillable = getLocal("CompanyCoveredIsBillable");
    var isChecked = false;
    if ($('#CompanyCoveredCheckBox').is(":checked")) {
        isChecked = true;
    }

    if ((CompanyCoveredIsBillable == 1 && isChecked) || (CompanyCoveredIsBillable === 0 && !isChecked)) {
        $(pageID + " #CostCenterRequiredLabel").show();
        $(pageID + " #CostCenterTextBox").attr("Requried", "true");
    }
    else {
        $(pageID + " #CostCenterTextBox").attr("Requried", "false");
        $(pageID + " #CostCenterRequiredLabel").hide();
    }
}

// Method to initialize the Labor popup.
function AddLaborPopupOpen() {
    var pageId = $.mobile.activePage.attr('id');
    var existingArrival = $("#" + pageId).find('#PendingArrival').attr("data-value");
    var existingDeparture = $("#" + pageId).find('#PendingDeparture').attr("data-value");
    var data = iMFMJsonObject({
        CustSiteKey: $("#SRoomValue").val()
    });

    $("#LaborErrorText").hide();

    if (navigator.onLine && data.CustSiteKey != "-1") {
        $(".DeviceTimeLabel").hide();

        $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetCurrentDateTimeandTimezone", { CustomerSiteNumber: JSON.stringify(data) }, function (result) {
            var dateTime = result.split(';');

            SetOnlineTime("ArrivalDateTextBox", dateTime[0]);
            SetOnlineTime("DepartureDateTextBox", dateTime[0]);
            $("#ArrivalSiteTZLabel").text(dateTime[1]);
            $("#DepartureSiteTZLabel").text(dateTime[1]);
            if ($('#ddlAssignmentType').val() == 'Current User') {
                SetOnlineTime("DateTimeEntered", dateTime[0]);
                $(".SiteTZLabel").text(dateTime[1]);
                setLocal("CurrentSiteDate", $("#DateTimeEntered").val());
                selfGenDateControler.currentDate = $("#DateTimeEntered").val();
                selfGenDateControler.targetDate = $("#TargetCompleteDateTime").val();
                $(pageID + " #HiddenDateEnteredTest").val(dateTime[1]);
            }
            else {
                ///SetOnlineTime("DateTimeEntered", dateTime[0]);
                ///SetOnlineTime("TargetCompleteDateTime", dateTime[0]);
                $(pageID + " #hiddenDateEntered").val(dateTime[0]);
                $(pageID + " #hiddenTargetComplete").val(dateTime[0]);
                $(".SiteTZLabel").text(dateTime[1]);
            }
        });
    }
    else {
        $(".DeviceTimeLabel").show();
        SetOfflineTime("ArrivalDateTextBox");
        SetOfflineTime("DepartureDateTextBox");
    }
    updateLabor();
    $('#timeEntryContentDiv').popup("open");
}

// Save the labor to the form and update the text fields for form submission.
function SaveLaborForOrder() {
    // Validate the labor and add it to the form for submission.
    var pageID = $.mobile.activePage.attr("id");
    var arrival = GetDateObjectFromInvariantDateString($("#ArrivalDateTextBox").val());
    var departure = GetDateObjectFromInvariantDateString($("#DepartureDateTextBox").val());
    var labor = $("#CalculatedHoursValueLabel").text();
    $("#LaborErrorText").hide();

    if (arrival > departure || labor <= 0) {
        // Fail case.
        $("#LaborErrorText").text(GetTranslatedValue("DepartureBeforeArrival"));
        $("#LaborErrorText").show();
    }
    else {
        $("#" + pageID).find('#PendingLaborLabel').show();
        $("#" + pageID).find('#PendingArrival').text(labor + " " + GetTranslatedValue("HoursAbbreviated"));

        // Offset dates to compensate for toJSON converting to UTC ('Z')
        var tzHourOffset = arrival.getTimezoneOffset() / 60 >> 0;
        var tzMinOffset = arrival.getTimezoneOffset() % 60;
        arrival.setHours(arrival.getHours() - tzHourOffset);
        arrival.setMinutes(arrival.getMinutes() - tzMinOffset);

        tzHourOffset = departure.getTimezoneOffset() / 60 >> 0;
        tzMinOffset = departure.getTimezoneOffset() % 60;
        departure.setHours(departure.getHours() - tzHourOffset);
        departure.setMinutes(departure.getMinutes() - tzMinOffset);
        $("#" + pageID).find('#PendingArrival').attr("data-value", arrival.toJSON().replace('T', ' ').replace('Z', ''));
        $("#" + pageID).find('#PendingDeparture').attr("data-value", departure.toJSON().replace('T', ' ').replace('Z', ''));
        $('#timeEntryContentDiv').popup("close");
    }
}

// Calculate the hours of time based on Arrival-Departure difference.
function calculateHours() {
    var arrivalNullEmpty = IsStringNullOrEmpty($("#ArrivalDateTextBox").val());
    var departureNullEmpty = IsStringNullOrEmpty($("#DepartureDateTextBox").val());

    if (!arrivalNullEmpty && !departureNullEmpty) {

        var arrivalDate = GetDateObjectFromInvariantDateString($("#ArrivalDateTextBox").val());
        var departureDate = GetDateObjectFromInvariantDateString($("#DepartureDateTextBox").val());

        var totalHours = (departureDate - arrivalDate) / 36e5; // 36e5 is scientific notation for (1000 * 60 * 60).
        return GetDecimal(totalHours, 2, false);
    }

    return NaN;
}

// OnChange event for updating Labor on the popup.
function updateLabor() {
    var hours = calculateHours();
    $("#CalculatedHoursValueLabel").text(emptyString);

    if (!isNaN(hours)) {
        $("#CalculatedHoursValueLabel").text(hours);
    }
}

function timecardBinding(pageId) {
    if ($("#" + pageId + "timecardEntryPopup").length > 0) {
        $("#" + pageId + "timecardEntryPopup").remove();
    }
    var timecardEntryPopupDiv = document.createElement('div');
    timecardEntryPopupDiv.setAttribute('id', pageId + 'timecardEntryPopup');
    timecardEntryPopupDiv.setAttribute('data-role', 'popup');
    timecardEntryPopupDiv.setAttribute('data-overlay-theme', 'a');
    timecardEntryPopupDiv.setAttribute('data-position-to', '#AddLabor');
    timecardEntryPopupDiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px;');
    $("#" + pageId).find('[data-role=content]').append(timecardEntryPopupDiv);
}

/////////////////////////////////////////////////// work order attachment functionality ///////////////////////////////////////

/// <summary>
/// Method to set attachment for create work order.
/// </summary>
function CheckAttachmentRequired() {
    if ($('#AttachmentRequiredCheckBox').is(":checked")) {
        $('#CreateAttachmentContainer').show();
        $('#HiddenAttachmentFlag').val('true');
        createWOAttachmentFlag = true;
    }
    else {
        $('#CreateAttachmentContainer').hide();
        $('#HiddenAttachmentFlag').val('false');
        $('#workOrderAttachment').attr("src", "a");
        $('#clearAttachmentSource').hide();
        $("#CreateWOAttachment").val('');
        createWOAttachmentFlag = false;
    }
}

/// <summary>
/// Common method to handle error while creating work order.
/// </summary>
function createWOErrorhandling(serverDATA) {
    if (serverDATA.indexOf("SUCCESS") != -1) {
        var WON = serverDATA.split(':');
        setLocal("WorkOrderNumber", WON[1]);

        // If we're on the tag, don't let this be in the breadcrumb.
        if (pageID === "#CreateWOT") {
            var breadcrumb = getLocal("Breadcrumb").split(',');
            breadcrumb.pop();
            setLocal("Breadcrumb", breadcrumb);
        }
        $.mobile.changePage("WorkOrderDetails.html");
    }
    else if (serverDATA.indexOf('WARNING') != -1) {
        if ($.trim($(pageID).find("#ddlAssignmentType").val()).indexOf("Manager") != -1) {
            $(pageID).find("#AssignToFMButton").hide();
        }
        closeActionPopupLoading();

        if (serverDATA.indexOf(';') != -1) {
            errorMessage = serverDATA.split(';');
            $("#AvailablityMessageSpan").html(errorMessage[0]);
            employeeNumber = errorMessage[1];
            setTimeout(function () {
                $("#TechnicianAvailableDiv").popup();
                $("#TechnicianAvailableDiv").popup("open", { positionTo: "window", shadow: true, transition: "flip" });

            }, 1000);

            $(pageID + " #A1").removeClass('ui-disabled');
        }
        else {
            errorMessage = serverDATA.split('$$');
            $("#AvailablityMessageSpan").html(errorMessage[0]);
            vendorNumber = errorMessage[1];
            setTimeout(function () {
                $("#TechnicianAvailableDiv").popup();
                $("#TechnicianAvailableDiv").popup("open", { positionTo: "window", shadow: true, transition: "flip" });

            }, 1000);

            $(pageID + " #A1").removeClass('ui-disabled');
        }
    } //// end of else if.
    else {
        $.BindAssignmentDropDown(MasterID, 2, "CanAccess");
        closeActionPopupLoading();
        setTimeout(function () {
            //showError(serverDATA);
            var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
            if (isHTML(serverDATA)) {
                showError($(serverDATA).text());
            }
            else {
                showError(serverDATA);
            }
        }, 1000);
        $(pageID + " #A1").removeClass('ui-disabled');
    }
}

function PostWOAttachment(form) {
    if (navigator.onLine) {
        var pageID = "#" + $.mobile.activePage.attr("id");
        $(pageID + 'actionLoadingPopup h1').text(GetCommonTranslatedValue("AutoDispatch"));
        var attachmentData = new FormData(form);
        $.ajax({
            processData: false,
            contentType: false,
            cache: false,
            url: standardAddress + "CreateWO.ashx?method=WOAttachment",
            type: "POST",
            headers: { "Origin": ORIGIN_HEADER },
            dataType: "json",
            data: attachmentData,
            success: function (resultData) {
                if (resultData === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    navigateToWodWithAttachment(resultData);
                    createWOAttachmentFlag = false;
                }
            },
            error: function (error, textStatus, jqXHR) {
                if (error.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    var pageID = $.mobile.activePage.attr('id');
                    var popupName = findPopupName(pageID);
                    var errorMsg = "";
                    createWOAttachmentFlag = false;
                    if (textStatus == 'timeout') {
                        errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetCommonTranslatedValue("AttachmentFail"));
                        }, 650);
                        //forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'error') {
                        errorMsg = GetCommonTranslatedValue("InternalError");
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetCommonTranslatedValue("AttachmentFail"));
                        }, 650);
                        //                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'abort') {
                        errorMsg = GetCommonTranslatedValue("RequestAborted");
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetCommonTranslatedValue("AttachmentFail"));
                        }, 650);
                        //                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'parsererror') {
                        errorMsg = GetCommonTranslatedValue("InternalParseError");
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetCommonTranslatedValue("AttachmentFail"));
                        }, 650);
                        //                        forcePopupClose(popupName, errorMsg);
                    }
                    else {
                        errorMsg = GetCommonTranslatedValue("NetworkLost");
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetCommonTranslatedValue("AttachmentFail"));
                        }, 650);
                        //                        forcePopupClose(popupName, errorMsg);
                    }
                }
            }
        });
    }
    else {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(GetCommonTranslatedValue("NetworkDiscrepancy"));
        }, 650);
    }
}

function navigateToWodWithAttachment(serverDATA) {
    //// if condition to check create work order.
    if (serverDATA.DetWONumberVal != null && serverDATA.DetWONumberVal != "undefined") {
        createWorkOrderFlag = true;
        newWorkOrderData = serverDATA;
        setLocal("WorkOrderNumber", serverDATA.DetWONumberVal);
        $.mobile.changePage("WorkOrderDetails.html");
    } //// end of if condition to check create work order.
    //// else condition if work order number is empty.
    else {
        // If the response is empty, it means the attachment failed because the request exceeded server setting (10MB).
        if (serverDATA.length === 0) {
            serverDATA = GetCommonTranslatedValue("AttachmentFail");
            closeActionPopupLoading();
            setTimeout(function () {
                showError(serverDATA, function () {
                    // Still navigate to the WO because it was created in the previous call.
                    $.mobile.changePage("WorkOrderDetails.html");
                });
            }, 1000);
            $(pageID + " #A1").removeClass('ui-disabled');
        } else {
            createWOErrorhandling(serverDATA);
        }
    } ////end of else condition if work order number is empty.
}

/////////////Camera Ios///////////////////////`
// A button will call this function
//
function capturePhotoAttachment(source) {
    var options = {
        quality: 20,
        encodingType: Camera.EncodingType.JPEG,
        destinationType: 0,
        sourceType: source
    };

    navigator.camera.getPicture(onPhotoAttachmentSuccess, onPhotoAttachFail, options);
}

// Called when a photo is successfully retrieved
//
function onPhotoAttachmentSuccess(imageData) {
    // Uncomment to view the base64 encoded image data
    // console.log(imageData);
    var pageID = $.mobile.activePage.attr('id') === "ActionsPopup" ? getLocal("RequestedAction") : $.mobile.activePage.attr('id');

    // Check for the tag attachment process, which will need to update the panel that is visible (AddAttachment)
    if (pageID === 'AddAttachment_Tag') {
        pageID = 'AddAttachment';
    }

    // Get image handle
    $('#' + pageID).find('.attachment-thumbnail').attr("src", "data:image/jpeg;base64," + imageData);
    $('#' + pageID).find('.attachment-thumbnail, .attachment-thumbnail-clear').show();

    /**********************************************************************
    * Assumed that every page will only have one attachment-data entity.
    * The only page that would have alternate modes should be ActionsPopup.
    * For that page, we should update the thumbnail and store the data
    * on the AttachmentForm to post. So only AttachmentForm should have
    * this class.
    **********************************************************************/
    $('.attachment-data').val(imageData);
}

// Called if something bad happens.
//
function onPhotoAttachFail(message) {
    ////alert('Failed because: ' + message);
}

function clearWorkOrderAttachment() {
    // Clear the thumbnail, hide the thumbnail entities, then clear the attachment data.
    $('.attachment-thumbnail').attr('src', '');
    $('.attachment-thumbnail').hide();
    $('.attachment-thumbnail-clear').hide();
    $('.attachment-data').val('');
}

//======= Binding WorkOrder Source DropDown=======
function BindWorkOrderSource(controlId, pageID) {
    var source;
    if ($.trim(getLocal('Source')).length == 0) {
        $(pageID).find("#WorkOrderSourceSelect").append("<option value='0'>iMFM</option>");
        $(pageID).find("#WorkOrderSourceSelect").prop('disabled', true);

    }
    else {
        source = JSON.parse($.trim(getLocal('Source')));
        $(pageID).find("#WorkOrderSourceSelect").empty();
        for (var i = 0; i < source.length; i++) {
            $(pageID).find("#WorkOrderSourceSelect").append("<option value='" + source[i].SourceID + "'>" + source[i].SourceName + "</option>");
        }
    }

    var val = -1;
    $(pageID).find('#WorkOrderSourceSelect option').each(function () {
        if ($(this).text() == 'iMFM') {
            val = $(this).val();
            $(this).attr('selected', 'selected');
        }
    });

    $(pageID).find("#WorkOrderSourceSelect").val(val);
    $(pageID).find("#WorkOrderSourceSelect").selectmenu("refresh", true);
}

function CheckSelfGenSecurityTokens(pageID) {
    ////    LoadTranslation('CreateWOD', null);
    //**** End

    var pageID = "#" + $.mobile.activePage.attr('id');

    var logOutLabel = GetCommonTranslatedValue("LogOutLabel");
    var selectPropertyOptionLabel = GetTranslatedValue("SelectPropertyDropDownOptions");
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var ProblemCodeDropDownValue = GetTranslatedValue("ProblemCodeDropDownValue");
    var ServiceContractLabel = GetTranslatedValue("ServiceContractCoveredLbl");

    if (getLocal("PreviousScreen") !== "WOStepPage") {
        $(pageID).find("#CreateWODLogoutButton .ui-btn-text").text(logOutLabel);
        $(pageID).find("#SPidDDL").html('<option value="-1">' + selectPropertyOptionLabel + '</option>').selectmenu("refresh");
        $(pageID).find("#problemCodeDD").html('<option value="-1">' + ProblemCodeDropDownValue + '</option>').selectmenu("refresh");
        //$(pageID).find("#ServiceContractCoveredLabel .ui-btn-text").text(ServiceContractLabel);
        ////SR: Pentesting & JQM update
        $(pageID).find("#ServiceContractCoveredLabel").text(ServiceContractLabel);
        $(pageID).find("#SFloorValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
        $(pageID).find("#SRoomValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
        //$(pageID).find("#attachmentCheckLabel .ui-btn-text").text(GetTranslatedValue("AttachmentCheckBoxLabel"));
        ////SR: Pentesting & JQM update
        $(pageID).find("#attachmentCheckLabel").text(GetTranslatedValue("AttachmentCheckBoxLabel"));
        $(pageID).find("#CreateAttachmentContainer").hide();
        $(pageID).find('#clearAttachmentSource').hide();
        $(pageID).find('#HiddenAttachmentFlag').val('false');
    }

    var SgtCollection = $.GetSecuritySubTokens(MasterID, 3);
    //    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "L1L2Panel", "CanAccess")) {
    //        $(pageID).find("#L1L2PanelDiv").hide();
    //    }
    //    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "GroupSubGroupPanel", "CanAccess")) {
    //        $(pageID).find("#GroupSubGroupPanelDiv").hide();
    //    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "LocationDetails", "CanAccess")) {
        $(pageID).find("#locationDescDiv").hide();
    }
    else {
        $(pageID).find("#locationDescDiv").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "LocationDetails") {
                if (SgtCollection.SgstCollection[i].Required == 1) {
                    $("#locDetailsRequiredLabel").show();
                    $("#locDetailsTextArea").attr("data-requried", "true");
                }
                else {
                    $("#locDetailsTextArea").attr("data-requried", "false");
                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $("#locDetailsRequiredLabel").hide();
                        $("textarea[name='locDetailsTextArea']").prop('disabled', false);
                    }
                    else {
                        $("#locDetailsRequiredLabel").hide();
                        $("textarea[name='locDetailsTextArea']").prop('disabled', true);
                    }
                } // end of else
            }
        } //End of for
    }
    //    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "SelfGenDateTime", "CanAccess")) {
    //        $(pageID).find("#CompletionDateUl").hide();
    //    }
    //    else {
    //        $(pageID).find("#CompletionDateUl").show();       
    //        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
    //            if (SgtCollection.SgstCollection[i].SubTokenDescription == "SelfGenDateTime") {
    //                if (SgtCollection.SgstCollection[i].SubTokenDescription == "SelfGenDateTime" && SgtCollection.SgstCollection[i].ReadOnly == 0 && SgtCollection.SgstCollection[i].Required == 0) {
    //                    $(pageID + " #SelfGenDateTime").attr("Requried", false);
    //                    $(pageID).find("#SelfGenDateTime").addClass('ui-disabled');
    //                    $(pageID).find("#lblDateEntered").removeClass("ui-screen-hidden");
    //                    $(pageID).find("#lblTargetComplete").removeClass("ui-screen-hidden");
    //                }
    //                else {
    //                    $(pageID + " #SelfGenDateTime").attr("Requried", true);
    //                    $(pageID).find("#SelfGenDateTime").removeClass('ui-disabled');
    //                }
    //            }
    //        }//End of for
    //    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "WOAttachmentPanel", "CanAccess")) {
        $(pageID).find("#CreateWODAttachmentPanel").hide();
        createWOAttachmentFlag = false;
    }
    else {
        $(pageID).find("#CreateWODAttachmentPanel").show();
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "GIPPanel", "CanAccess")) {
        $(pageID).find("#GIPPanelUl").hide();
    }
    else {
        $('#GipPanelSecurityReq').val(0);
        $(pageID).find("#GIPPanelUl").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel") {
                if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].ReadOnly == 0 && SgtCollection.SgstCollection[i].Required == 0) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").hide();
                    $(pageID + " #CurrencyCodeRequiredLabel").hide();
                    $(pageID + " #ServiceContractRequiredLabel").hide();
                    $(pageID + " #CostCenterRequiredLabel").hide();
                    $(pageID + ' #EstimatedServiceCostText').attr('readonly', 'readonly');
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", true);
                    $(pageID + ' #CostCenterTextBox').attr('readonly', 'readonly');
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", true);
                    $(pageID + ' #ServiceContractCoveredLabel').addClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').addClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredCheckBox').addClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').addClass('ui-disabled');

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").attr('readonly', 'readonly');
                }
                else if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].Required == 1) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").show();
                    $(pageID + " #CurrencyCodeRequiredLabel").show();
                    $(pageID + " #EstimatedServiceCostText").attr("Requried", "true");
                    $(pageID + " #CurrencyCodeSelect").attr("Requried", "true");
                    $(pageID + ' #EstimatedServiceCostText').removeAttr("readonly");
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", false);
                    $(pageID + ' #ServiceContractCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').removeClass('ui-disabled');
                    $(pageID + " #ServiceContractRequiredLabel").show();
                    $(pageID + " #CostCenterRequiredLabel").show();
                    $(pageID + " #ServiceContractDropDownList").attr("Requried", "true");
                    $(pageID + " #CostCenterTextBox").attr("Requried", "true");
                    $(pageID + ' #CostCenterTextBox').removeAttr("readonly");
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", false);
                    $(pageID + ' #CompanyCoveredCheckBox').removeClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #GipPanelSecurityReq').val(1);

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").removeAttr('readonly');
                } // end of if
                else if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].Required == 0) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").hide();
                    $(pageID + " #CurrencyCodeRequiredLabel").hide();
                    $(pageID + " #ServiceContractRequiredLabel").hide();
                    $(pageID + " #CostCenterRequiredLabel").hide();
                    $(pageID + ' #EstimatedServiceCostText').removeAttr("readonly");
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", false);
                    $(pageID + ' #ServiceContractCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').removeClass('ui-disabled');
                    $(pageID + ' #CostCenterTextBox').removeAttr("readonly");
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", false);
                    $(pageID + ' #CompanyCoveredCheckBox').removeClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').removeClass('ui-disabled');

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").removeAttr('readonly');
                } // end of else if  
            } // end of SgtCollection.SgstCollection[i].SubTokenDescription if
        } // end of for
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "CAS:ExtAccountNumber", "CanAccess")) {
        $(pageID + " #ExtAccountNumberBlock").hide();
    } else {
        $(pageID + " #ExtAccountNumberBlock").show();
        if ($(pageID + " #ExtAccountNumberTextBox").attr('readonly') !== 'readonly') {
            if ($.GetSecuritySubTokensBit(SgtCollection, 3, "CAS:ExtAccountNumber", "Required")) {
                $(pageID + " #ExtAccountRequiredLabel").show();
                $(pageID + " #ExtAccountNumberTextBox").attr("Requried", "true");
            }
        }
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 3, "CreateWorkOrderSource", "CanAccess")) {
        $(pageID).find("#SourceDiv").hide();
    }
    else {
        $(pageID).find("#SourceDiv").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "CreateWorkOrderSource") {
                if (SgtCollection.SgstCollection[i].Required == 1) {
                    $("#sourceRequiredLabel").show();
                    $("#WorkOrderSourceSelect").attr("data-requried", "true");
                }
                else {
                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $("#sourceRequiredLabel").hide();
                        $("#WorkOrderSourceSelect").prop('disabled', false);

                    }
                    else {
                        $("#sourceRequiredLabel").hide();
                        $("#WorkOrderSourceSelect").prop('disabled', true);
                    }
                } // end of else
            }
        } // end of for
    }
    SecurityForCallerName(3);
    // $.BindAssignmentDropDown(MasterID, 2, "CanAccess");
    $(pageID).find("#ddlAssignmentType").attr("data-requried", "true");
    $(pageID).find("#ddlAssignment").attr("data-requried", "true");
    $(pageID).find("#SPidDDL").attr("data-requried", "true");
    $(pageID).find("#SFloorValue").attr("data-requried", "true");
    $(pageID).find("#SRoomValue").attr("data-requried", "true");
    $(pageID).find("#problemCodeDD").attr("data-requried", "true");
    $(pageID).find("#problemDescriptionTextArea").attr("data-requried", "true");
    BindCurrencyDropDown("CurrencyCodeSelect");
    BindSiteLabels();
    EnforceFieldSecurity(SgtCollection, "OrderType", false);
    // Need additional checks for OrderType.
    if ($.GetSecuritySubTokensBit(SgtCollection, 3, "OrderType", "CanAccess")) {
        // If enabled, it's sys required.
        $('[data-field="OrderType"] .mandatory').show();
    }
}

////function SaveLaborForOrder() {
////    // Validate the labor and add it to the form for submission.
////    var pageID = $.mobile.activePage.attr("id");
////    var arrival = GetDateObjectFromInvariantDateString($("#ArrivalDateTextBox").val());
////    var departure = GetDateObjectFromInvariantDateString($("#DepartureDateTextBox").val());
////    var labor = $("#CalculatedHoursValueLabel").text();
////    $("#LaborErrorText").hide();

////    if (arrival > departure || labor <= 0) {
////        // Fail case.
////        $("#LaborErrorText").text(GetTranslatedValue("DepartureBeforeArrival"));
////        $("#LaborErrorText").show();
////    }
////    else {
////        $("#" + pageID).find('#PendingLaborLabel').show();
////        $("#" + pageID).find('#PendingArrival').text(labor + " Hrs.");
////        $("#" + pageID).find('#PendingArrival').attr("data-value", arrival.toJSON().replace('T', ' ').replace('Z', ''));
////        $("#" + pageID).find('#PendingDeparture').attr("data-value", departure.toJSON().replace('T', ' ').replace('Z', ''));
////        $('#timeEntryContentDiv').popup("close");
////    }
////}

/// <summary>
/// Method to validate DateEntred and TargetCompleteDate
/// </summary>
function ValidateDate() {
    if (!navigator.onLine && $('#ddlAssignmentType').val() == 'Current User') {
        setLocal("CurrentSiteDate", $("#DateTimeEntered").val());
        selfGenDateControler.currentDate = $("#DateTimeEntered").val();
        selfGenDateControler.targetDate = $("#TargetCompleteDateTime").val();
    }
    var now = GetDateObjectFromInvariantDateString(selfGenDateControler.currentDate);
    var dateEntered = GetDateObjectFromInvariantDateString($("#DateTimeEntered").val());
    var validDate = GetDateObjectFromInvariantDateString(getLocal("CurrentSiteDate"));
    var validNoOfDays = $.trim(getLocal('DateEnteredValidDays'));
    validDate.setDate(validDate.getDate() - parseInt(validNoOfDays));
    var targetNow = GetDateObjectFromInvariantDateString(getLocal("CurrentSiteDate"));
    var targetCompleteDate = GetDateObjectFromInvariantDateString($("#TargetCompleteDateTime").val());

    if (dateEntered > now) {
        $("#DateTimeEntered").val(selfGenDateControler.currentDate);
        return GetTranslatedValue("NoFutureDateEntered");
    }
    else if (dateEntered <= validDate) {
        $("#DateTimeEntered").val(selfGenDateControler.currentDate);
        return ((GetTranslatedValue("DateEnteredErrorMessage")).replace('$', validNoOfDays));
    }
    else {
        selfGenDateControler.currentDate = $("#DateTimeEntered").val();
    }

    if ($(pageID).find("#DateTimeEntered").val() == "" && $(pageID).find("#TargetCompleteDateTime").val() == "") {
        return GetTranslatedValue("DateTimeRequired");
    }

    if ($(pageID).find("#DateTimeEntered").val() == "") {
        return GetTranslatedValue("DateEnteredRequired");
    }

    if ($(pageID).find("#TargetCompleteDateTime").val() == "") {
        return GetTranslatedValue("TargetCompleteRequired");
    }
    if (dateEntered >= targetCompleteDate) {
        $("#TargetCompleteDateTime").val(selfGenDateControler.targetDate);
        return GetTranslatedValue("TragetCompleteErrorMessage");
    }
    else if (targetCompleteDate < now) {
        $("#TargetCompleteDateTime").val(selfGenDateControler.targetDate);
        return GetTranslatedValue("TragetCompleteInvalidMessage");
    }
    else {
        selfGenDateControler.targetDate = $("#TargetCompleteDateTime").val();
    }
    //    $(pageID).find('#DateTimeEntered').attr("value", $(pageID).find("#DateTimeEntered").val());
    //    $(pageID).find('#TargetCompleteDateTime').attr("value", $(pageID).find("#DateTimeEntered").val());
}


/// <summary>
/// Method to get Security tokens for Dispatch
/// </summary>
function GetSecurityTokens(pageID) {
    $(pageID).find("#CompletionDateUl").hide();
    // $("#ddlAssignment").prop('disabled', false);
    var SgtCollection = $.GetSecuritySubTokens(MasterID, 0);
    //    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "L1L2Panel", "CanAccess")) {
    //        $(pageID).find("#L1L2PanelDiv").hide();
    //    }
    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "GroupSubGroupPanel", "CanAccess")) {
        $(pageID).find("#GroupSubGroupPanelDiv").hide();
    }
    else {
        $(pageID).find("#GroupSubGroupPanelDiv").show();
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "WOAttachmentPanel", "CanAccess")) {
        $(pageID).find("#CreateWODAttachmentPanel").hide();
        createWOAttachmentFlag = false;
    }
    else {
        $(pageID).find("#CreateWODAttachmentPanel").show();
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "LocationDetails", "CanAccess")) {
        $(pageID).find("#locationDescDiv").hide();
    }
    else {
        $(pageID).find("#locationDescDiv").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "LocationDetails") {
                if (SgtCollection.SgstCollection[i].Required == 1) {
                    $("#locDetailsRequiredLabel").show();
                    $("#locDetailsTextArea").attr("data-requried", "true");
                }
                else {
                    $("#locDetailsTextArea").attr("data-requried", "false");
                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $("#locDetailsRequiredLabel").hide();
                        $("textarea[name='locDetailsTextArea']").prop('disabled', false);
                    }
                    else {
                        $("#locDetailsRequiredLabel").hide();
                        $("textarea[name='locDetailsTextArea']").prop('disabled', true);
                    }
                } // end of else
            }
        } // end of for
    }
    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "CreateWorkOrderSource", "CanAccess")) {
        $(pageID).find("#SourceDiv").hide();
    }
    else {
        $(pageID).find("#SourceDiv").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "CreateWorkOrderSource") {
                if (SgtCollection.SgstCollection[i].Required == 1) {
                    $("#sourceRequiredLabel").show();
                    $("#WorkOrderSourceSelect").attr("data-requried", "true");
                }
                else {
                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $("#sourceRequiredLabel").hide();
                        $("#WorkOrderSourceSelect").prop('disabled', false);

                    }
                    else {
                        $("#sourceRequiredLabel").hide();
                        $("#WorkOrderSourceSelect").prop('disabled', true);
                    }
                } // end of else
            }
        } // end of for
    }
    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "GIPPanel", "CanAccess")) {
        $(pageID).find("#GIPPanelUl").hide();
    }
    else {
        $(pageID).find("#GIPPanelUl").show();
        $('#GipPanelSecurityReq').val(0);
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel") {
                if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].ReadOnly == 0 && SgtCollection.SgstCollection[i].Required == 0) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").hide();
                    $(pageID + " #CurrencyCodeRequiredLabel").hide();
                    $(pageID + " #ServiceContractRequiredLabel").hide();
                    $(pageID + " #CostCenterRequiredLabel").hide();
                    $(pageID + ' #EstimatedServiceCostText').attr('readonly', 'readonly');
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", true);
                    $(pageID + ' #CostCenterTextBox').attr('readonly', 'readonly');
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", true);
                    $(pageID + ' #ServiceContractCoveredLabel').addClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').addClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredCheckBox').addClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').addClass('ui-disabled');

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").attr('readonly', 'readonly');
                }
                else if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].Required == 1) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").show();
                    $(pageID + " #CurrencyCodeRequiredLabel").show();
                    $(pageID + " #EstimatedServiceCostText").attr("Requried", "true");
                    $(pageID + " #CurrencyCodeSelect").attr("Requried", "true");
                    $(pageID + ' #EstimatedServiceCostText').removeAttr("readonly");
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", false);
                    $(pageID + ' #ServiceContractCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').removeClass('ui-disabled');
                    $(pageID + " #ServiceContractRequiredLabel").show();
                    $(pageID + " #CostCenterRequiredLabel").show();
                    $(pageID + " #ServiceContractDropDownList").attr("Requried", "true");
                    $(pageID + " #CostCenterTextBox").attr("Requried", "true");
                    $(pageID + ' #CostCenterTextBox').removeAttr("readonly");
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", false);
                    $(pageID + ' #CompanyCoveredCheckBox').removeClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #GipPanelSecurityReq').val(1);
                    $(pageID + ' #WorkOrderSourceLabel').show();

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").removeAttr('readonly');
                } // end of if
                else if (SgtCollection.SgstCollection[i].SubTokenDescription == "GIPPanel" && SgtCollection.SgstCollection[i].Required == 0) {
                    $(pageID + " #EstimatedServiceCostRequriedLabel").hide();
                    $(pageID + " #CurrencyCodeRequiredLabel").hide();
                    $(pageID + " #ServiceContractRequiredLabel").hide();
                    $(pageID + " #CostCenterRequiredLabel").hide();
                    $(pageID + ' #EstimatedServiceCostText').removeAttr("readonly");
                    $(pageID + ' #CurrencyCodeSelect').prop("disabled", false);
                    $(pageID + ' #ServiceContractCoveredLabel').removeClass('ui-disabled');
                    $(pageID + ' #ServiceContractCovered').removeClass('ui-disabled');
                    $(pageID + ' #CostCenterTextBox').removeAttr("readonly");
                    $(pageID + ' #ServiceContractDropDownList').prop("disabled", false);
                    $(pageID + ' #CompanyCoveredCheckBox').removeClass('ui-disabled');
                    $(pageID + ' #CompanyCoveredLabel').removeClass('ui-disabled');

                    // New field is only editable if panel is not read only.                    
                    $(pageID + " #ExtAccountNumberTextBox").removeAttr('readonly');
                } // end of else if  
            } // end of SgtCollection.SgstCollection[i].SubTokenDescription if                    
        } // end of for
    }

    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "CAS:ExtAccountNumber", "CanAccess")) {
        $(pageID + " #ExtAccountNumberBlock").hide();
    } else {
        $(pageID + " #ExtAccountNumberBlock").show();
        if ($(pageID + " #ExtAccountNumberTextBox").attr('readonly') !== 'readonly') {
            if ($.GetSecuritySubTokensBit(SgtCollection, 0, "CAS:ExtAccountNumber", "Required")) {
                $(pageID + " #ExtAccountRequiredLabel").show();
                $(pageID + " #ExtAccountNumberTextBox").attr("data-requried", "true");
            }
        }
    }

    SecurityForCallerName(0);
    SecurityForVendorSearch("Vendor Search", 1);
    EnforceFieldSecurity(SgtCollection, "OrderType", false);
    // Need additional checks for OrderType.
    if ($.GetSecuritySubTokensBit(SgtCollection, 0, "OrderType", "CanAccess")) {
        // If enabled, it's sys required.
        $('[data-field="OrderType"] .mandatory').show();
    }
}

/// <summary>
/// Method to get Security tokens for CallerName field
/// </summary>
function SecurityForCallerName(tokenId) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var SgtCollection = $.GetSecuritySubTokens(MasterID, tokenId);
    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "CallerName", "CanAccess")) {
        $(pageID).find("#callerNameDiv").hide();
    }
    else {
        $(pageID).find("#callerNameDiv").show();
        for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
            if (SgtCollection.SgstCollection[i].SubTokenDescription == "CallerName") {
                if (SgtCollection.SgstCollection[i].Required == 1) {
                    $(pageID).find("#callerNameRequiredLabel").show();
                    $(pageID).find("#callerNameTextBox").attr("data-requried", "true");
                }
                else {
                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $(pageID).find("#callerNameRequiredLabel").hide();
                        $(pageID).find("#callerNameTextBox").prop('disabled', false);

                    }
                    else {
                        $(pageID).find("#callerNameRequiredLabel").hide();
                        $(pageID).find("#callerNameTextBox").prop('disabled', true);
                    }
                } // end of else
            }
        } // end of for
    }
}

/// <summary>
/// Method to enforce security for Vendor Search autocomplete text box.
/// </summary>
function SecurityForVendorSearch(tokenDesc, tokenId) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var SgtCollection;

    if (tokenDesc == "Reassign_VendorSearch") {
        SgtCollection = $.GetSecuritySubTokens(400009, tokenId);
    } else {
        SgtCollection = $.GetSecuritySubTokens(MasterID, tokenId);
    }
    if ($.GetSecuritySubTokensBit(SgtCollection, tokenId, tokenDesc, "CanAccess")) {
        if (tokenDesc == "Vendor Search") {
            if ($(pageID).find("#ddlAssignmentType").val() == "Vendor") {
                $(pageID).find("#AssignmentSearchTextBox").parent().show();
            } else {
                $(pageID).find("#AssignmentSearchTextBox").parent().hide();
            }
        }

        if (tokenDesc == "Reassign_VendorSearch") {
            if ($(pageID).find("#ReassignAssignTypeDDL").val() == "Vendor") {
                $(pageID).find("#AssignmentSearchTextBox").parent().show();
            } else {
                $(pageID).find("#AssignmentSearchTextBox").parent().hide();
            }
        }
    }
    else {
        $(pageID).find("#AssignmentSearchTextBox").parent().hide();
    }
}

/**
*  Bind property details, when user try creating WO from Steps screen. 
*/
function bindProperty() {
    var propertyID = getLocal("WOCustomerSiteNumber").split("{")[0].split("|")[1];
    var regionID = getLocal("WOCustomerSiteNumber").split("{")[0].split("|")[0];
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql('SELECT PropertyID, RegionID, PropertyText,RegionText, CurrencyCode FROM PropertyTable WHERE PropertyID =? AND RegionID =?', [propertyID, regionID], BindPidDropDown, function (tx, error) {
        });
    });
}

///Method to load the Matrix Data When the Room dropdown is selected / Updated. 
function RoomDataChangeLogic() {
    var roomChangeNTEConfig = getLocal("iMFM_FetchNTEConfig");
    if (roomChangeNTEConfig == 1) {
        GetGroupSubgroupData();
    }
}


