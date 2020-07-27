var inspBuildingCurrency = 'USD';

/// <summary>
/// Method to bind inspection assignment in dropdown.
/// </summary>
function BindInspectionAssignmentDropDown() {
    $("#assignmentTypeDropDown option:gt(0)").remove();
    $("#assignmentDropDown option:gt(0)").remove();
    var dropDownValues = getLocal("InspectionAssignmentDropDown").split('/');
    for (var i = 1; i < dropDownValues.length - 1; i++) {
        var opt = "<option value =" + dropDownValues[i] + ">" + GetTranslatedValue(dropDownValues[i]) + "</option>";
        $("#assignmentTypeDropDown").append(opt);
    }
    $("#assignmentTypeDropDown").selectmenu("refresh");
    $("#assignmentDropDown").selectmenu("disable");
    $("#assignmentDropDown").selectmenu("refresh");
}

/// <summary>
/// Method to add security work order page.
/// </summary>
/// <param name="result">Holds the results data.</param>
function InspectionAddWOPageSecutiry(result) {
    $('#GipPanelSecurityReqInspection').val(0);
    $("#inspectionEstimatedServiceCostDiv").hide();
    $("#inspectionAttachmentPanel").hide();
    setLocal("InspectionAssignmentDropDown", "/");
    for (var i = 0; i < result.length; i++) {
        if (result[i].CanAccess == 1 && (result[i].ControlID <= 4)) {
            setLocal("InspectionAssignmentDropDown", getLocal("InspectionAssignmentDropDown") + result[i].SubTokenDescription + "/");
        }
        if (result[i].CanAccess == 1 && result[i].SubTokenDescription == "GIPPanel") {
            $("#inspectionEstimatedServiceCostDiv").show();
            if (result[i].ReadOnly == 1) {
                $("#inspectionEstimatedServiceCostText").textinput("enable");
                $("#inspectionCurrencyCodeSelect").selectmenu("enable");
                $("#inspectionServiceContractCovered").checkboxradio("enable");

                // New field is only editable if panel is not read only.
                $("#ExtAccountNumberTextBox").textinput("enable");
                $("#ExtAccountNumberTextBox").removeAttr('readonly');
                if (result[i].Required == 1) {
                    $('#GipPanelSecurityReqInspection').val(1);
                    $("#inspectionCurrencyCodeRequiredLabel").show();
                    $("#inspectionEstimatedServiceCostRequriedLabel").show();
                    $("#ServiceContractRequiredLabel").show();
                    $("#CostCenterRequiredLabel").show();
                    $("#inspectionEstimatedServiceCostText").attr("Requried", "true");
                    $("#inspectionCurrencyCodeSelect").attr("Requried", "true");
                    $("#ServiceContractDropDownList").attr("Requried", "true");
                    $("#CostCenterTextBox").attr("Requried", "true");
                } /// end of if required.
                else {
                    $("#inspectionCurrencyCodeRequiredLabel").hide();
                    $("#inspectionEstimatedServiceCostRequriedLabel").hide();
                    $("#ServiceContractRequiredLabel").hide();
                    $("#CostCenterRequiredLabel").hide();
                } // end of else
            } else {
                // New field is only editable if panel is not read only.
                $("#ExtAccountNumberTextBox").attr('readonly', 'readonly');
            }  //// end of if readonly
        } //// end of if GIP panel

        if (result[i].SubTokenDescription == "CAS:ExtAccountNumber") {
            if (result[i].CanAccess == 0) {
                $("#ExtAccountNumberBlock").hide();
            }
            else {
                $("#ExtAccountNumberBlock").show();
                if ($("#ExtAccountNumberTextBox").attr('readonly') !== 'readonly') {
                    if (result[i].Required == 1 && result[i].SubTokenDescription == "CAS:ExtAccountNumber") {
                        $("#ExtAccountRequiredLabel").show();
                        $("#ExtAccountNumberTextBox").attr("data-requried", "true");
                    }
                }
            }
        }

        if (result[i].CanAccess == 1 && result[i].SubTokenDescription == "InspectionWOAttachmentPanel") {
            $("#inspectionAttachmentPanel").show();
        }

        if (result[i].CanAccess == 1 && result[i].SubTokenDescription == "CreateWorkOrderSource") {
            $("#SourceDiv").show();
            if (result[i].Required == 1) {
                $("#sourceRequiredLabel").show();
                $("#WorkOrderSourceSelect").attr("data-requried", "true");
            }
            else {
                if (result[i].ReadOnly == 1) {
                    $("#sourceRequiredLabel").hide();
                    $("#WorkOrderSourceSelect").prop('disabled', false);
                }
                else {
                    $("#sourceRequiredLabel").hide();
                    $("#WorkOrderSourceSelect").prop('disabled', true);
                }
            }
        }
        else if (result[i].CanAccess == 0 && result[i].SubTokenDescription == "CreateWorkOrderSource") {
            $("#SourceDiv").hide();
        }
    }
    SecurityForCallerNameInsp(result);
    BindInspectionAssignmentDropDown();
}

/// <summary>
/// Method to set the Default location Details.
/// </summary>
function InspectionSetDefaultLocation() {
    $("#formInspectionAddWO #hiddenFieldCityText").val(getLocal("RegionDescription"));
    $("#formInspectionAddWO #hiddenFieldCityValue").val(regionNumber);

    $("#formInspectionAddWO #hiddenFieldBuildingText").val(getLocal("DivisionDescription"));
    $("#formInspectionAddWO #hiddenFieldBuildingValue").val(divisionNumber);
    // call function to load level 3 drop down
    if (regionNumber !== '' && divisionNumber !== '')
        LoadLevel3DropDown(regionNumber, divisionNumber);
}

/// <summary>
/// Method to set the hiddenFieldRoomText field value.
/// </summary>
function InspectionSetHiddenValue() {
    if ($("#level4DropDown option:selected").val() == "-1") {
        $("#formInspectionAddWO #hiddenFieldRoomText").val("");
        $('#proirityCodeDropDown').selectmenu("disable");

        if (getLocal("WorkOrderOption") != "PlannedExpense") {
            $('#problemCodeDropDown').selectmenu("disable");
            $('#problemCodeText').textinput('disable');
            $('#inspectionProblemDescriptionTextArea').textinput('disable');
        }
    }
    else {
        $("#formInspectionAddWO #hiddenFieldRoomText").val($("#level4DropDown option:selected").text());
        $('#problemCodeDropDown').selectmenu("enable");
        $('#problemCodeText').textinput('enable');
        $('#inspectionProblemDescriptionTextArea').textinput('enable');
        GetTargetDate();

        // Get the Matrix Information from the Problem Code.
        InspGetMatrixData();
    }
}

/// <summary>
/// Method to load level 3 dropdown.
/// </summary>
/// <param name="level1Value">Holds the value of level1 dropdown.</param>
/// <param name="level2value">Holds the value of level2 dropdown.</param>
function LoadLevel3DropDown(level1Value, level2value) {
    dB.transaction(function (tx) {
        tx.executeSql("SELECT FloorID, FloorText FROM FloorTable WHERE PropertyID = ? and RegionID = ? ORDER BY FloorText", [level2value, level1Value], Level3Success, failureSQL);

    });
}

/// <summary>
/// Method to success of level 3.
/// </summary>
/// <param name="tx">To execute sql.</param>
/// <param name="results">Holds the results data.</param>
function Level3Success(tx, results) {
    $("#level4DropDown").selectmenu("disable", true);
    $('#proirityCodeDropDown').selectmenu("disable", true);

    if (getLocal("WorkOrderOption") !== "PlannedExpense") {
        $('#problemCodeDropDown').selectmenu("disable");
        $('#problemCodeText').textinput('disable');
        $('#inspectionProblemDescriptionTextArea').textinput('disable');
    }
    $(" #level3DropDown option:gt(0)").remove();
    $(" #level3DropDown option:eq(0)").attr('selected', 'selected');
    $(" #level3DropDown").selectmenu("refresh", true);

    $(" #level4DropDown option:gt(0)").remove();
    $(" #level4DropDown option:eq(0)").attr('selected', 'selected');
    $(" #level4DropDown").selectmenu("refresh", true);
    var i = 0;
    var tag;
    if (results.rows.length == 1) {
        tag = document.createElement('option');
        tag.setAttribute("value", decryptStr(results.rows.item(i).FloorID));
        tag.innerHTML = decryptStr(results.rows.item(i).FloorText);
        $(" #level3DropDown").append(tag);
        $(" #level3DropDown").val(decryptStr(results.rows.item(i).FloorID)).selectmenu("refresh", true).change();
        $(" #level3DropDown").selectmenu("enable", true);
        return;
    }
    for (i = 0; i < results.rows.length; i++) {
        tag = document.createElement('option');
        tag.setAttribute("value", decryptStr(results.rows.item(i).FloorID));
        tag.innerHTML = decryptStr(results.rows.item(i).FloorText);
        $("#level3DropDown").append(tag);
    }
    $(" #level3DropDown option:first").attr('selected', 'selected');
    $(" #level3DropDown").selectmenu("enable", true);
}

/// <summary>
/// Method to post error of level 3.
/// </summary>
function Level3PostError() {
    ////showError("Error getting level3 data");
    showError(GetTranslatedValue("ErrorLevel3"));
}

/// <summary>
/// Method to load the level 4 dropdown.
/// </summary>
function LoadLevel4DropDown() {
    $('#problemCodeDropDown').selectmenu("enable");
    $('#problemCodeText').textinput('enable');
    $('#inspectionProblemDescriptionTextArea').textinput('enable');
    $("#formInspectionAddWO #hiddenFieldFloorText").val($("#level3DropDown option:selected").text());
    var selectedLevel3Value = $('#level3DropDown').val();
    if (selectedLevel3Value == -1) {
        $('#proirityCodeDropDown').selectmenu("disable");
        if (getLocal("WorkOrderOption") != "PlannedExpense") {
            $('#problemCodeDropDown').selectmenu("disable");
            $('#problemCodeText').textinput('disable');
            $('#inspectionProblemDescriptionTextArea').textinput('disable');
        }
        $('#level4DropDown').children('option:not(:first)').remove();
        $('#level4DropDown option:first').attr('selected', 'selected');
        $('#level4DropDown').selectmenu("refresh", true);
        return;
    }

    var cityValue = regionNumber;
    var buildingValue = divisionNumber;
    var selectedFloor = selectedLevel3Value;
    dB.transaction(function (tx) {
        tx.executeSql("SELECT RoomID, RoomText FROM RoomTable WHERE (FloorID = ? and PropertyID = ? and RegionID = ?)", [selectedFloor, buildingValue, cityValue], SetInspectionRoomLocally, failureSQL);
    });
}

/// <summary>
/// Method to success callback for getting Room details From Local DB.
/// </summary>
/// <param name="tx">To execute sql.</param>
/// <param name="results">Holds the results data.</param>
function SetInspectionRoomLocally(tx, results) {
    var roomArray = [];
    var i = 0;
    for (i = 0; i < results.rows.length; i++) {
        //Dynamically creating object with Name and Description properties.
        var obj = {};
        obj.Name = decryptStr(results.rows.item(i).RoomID);
        obj.Description = decryptStr(results.rows.item(i).RoomText);
        roomArray[i] = obj;
    }
    SetInspectionRoomData(roomArray);
}

/// <summary>
/// Method to set inspection room data.
/// </summary>
/// <param name="result">Holds the results data.</param>
function SetInspectionRoomData(result) {
    var tag;
    var i = 0;
    //Bind the Room Dropdown
    $(" #level4DropDown").children('option:not(:first)').remove();
    //If only one Result, Then set that as the selected Room.
    if (result.length == 1) {
        tag = document.createElement('option');
        tag.setAttribute("value", result[0].Name);
        tag.innerHTML = result[0].Description;
        $("#level4DropDown").append(tag);
        $("#level4DropDown option:eq(1)").attr('selected', 'selected');
        $("#level4DropDown").selectmenu("refresh", true);
        $("#hiddenFieldRoomText").val($('#level4DropDown option:selected').text());
        $("#level4DropDown").selectmenu("enable", true);
        $('#problemCodeDropDown').selectmenu("enable");
        $('#problemCodeText').textinput('enable');
        $('#inspectionProblemDescriptionTextArea').textinput('enable');
        if (getLocal("WorkOrderOption") != "PlannedExpense") {
        }
        GetTargetDate();

        // Also load the Inspection MAtrixData.
        InspGetMatrixData();

        return;
    }

    for (i = 0; i < result.length; i++) {
        tag = document.createElement('option');
        tag.setAttribute("value", result[i].Name);
        tag.innerHTML = result[i].Description;
        $("#level4DropDown").append(tag);
    }
    $("#level4DropDown option:first").attr('selected', 'selected');
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#level4DropDown").selectmenu("enable", true);
}

/// <summary>
/// Method to bind the level 4 drop down.
/// </summary>
/// <param name="result">Holds the results data.</param>
function SetLevel4Data(result) {
    $("#formInspectionAddWO #hiddenFieldFloorText").val($("#level4DropDown option:selected").text());
    $('#level4DropDown').children('option:not(:first)').remove();
    var tag = document.createElement('option');

    //If only one Result, Then set that as the selected Room.
    if (result.length == 1) {
        tag.setAttribute("value", result[0].Name);
        tag.innerHTML = result[0].Description;
        $('#level4DropDown').append(tag);
        $('#level4DropDown option:eq(1)').attr('selected', 'selected');
        $('#level4DropDown').selectmenu("refresh", true);
        $('#level4DropDown').selectmenu("enable");
        $('#problemCodeDropDown').selectmenu("enable");
        $('#problemCodeText').textinput('enable');
        $('#inspectionProblemDescriptionTextArea').textinput('enable');
        return;
    }

    var index = 0;
    for (index = 0; index < result.length; index++) {
        tag.setAttribute("value", result[index].Name);
        tag.innerHTML = result[index].Description;
        $('#level4DropDown').append(tag);
    }
    $('#level4DropDown option:eq(1)').attr('selected', 'selected');
    $('#level4DropDown').selectmenu("refresh", true);
    $('#level4DropDown').selectmenu("enable");
    $('#problemCodeDropDown').selectmenu("enable");
    $('#problemCodeText').textinput('enable');
    $('#inspectionProblemDescriptionTextArea').textinput('enable');
}

/// <summary>
/// Method to post error of level 4.
/// </summary>
function Level4PostError() {
    ////showError("Error getting level4 data");
    showError(GetTranslatedValue("ErrorLevel4"));
}

/// <summary>
/// Method to load problem code.
/// </summary>
function LoadProblemCode() {
    $("#problemCodeDropDown option:gt(0)").remove();
    $("#problemCodeDropDown").selectmenu("refresh", true);

    var searchText = jQuery.trim($('#problemCodeText').val());
    var pattern = /^[A-Za-z-]*$/;
    if (searchText.length >= 3) {
        var problemSearchText = searchText;
        dB.transaction(function (tx) {
            tx.executeSql("SELECT Distinct (ProblemCodeID), ProblemCodeDescription FROM ProblemTable WHERE (ProblemCodeDescription LIKE ?) ORDER BY ProblemCodeDescription", ["%" + problemSearchText + "%"], SetInspectionProblemCodeLocally, failureSQL);
        });
    }

    /// <summary>
    /// Method to success callback for getting ProblemCode details from Local DB.
    /// </summary>
    /// <param name="tx">To execute sql.</param>
    /// <param name="results">Holds the results data.</param>
    function SetInspectionProblemCodeLocally(tx, results) {
        var problemArray = [];
        var i = 0;
        for (i = 0; i < results.rows.length; i++) {
            //Dynamically creating object with key value properties.
            var obj = {};
            obj.Key = results.rows.item(i).ProblemCodeDescription;
            obj.Value = results.rows.item(i).ProblemCodeID;
            ////            obj.EstServiceCost = decryptStr(results.rows.item(i).EstServiceCost);
            ////            obj.CurrencyCode = results.rows.item(i).CurrencyCode;
            problemArray[i] = obj;
        }

        PopulateInspectionProblemCodeDD(problemArray);
    }

    /// <summary>
    /// Method to bind problem code dropdown.
    /// </summary>
    /// <param name="result">Holds the results data.</param>
    function PopulateInspectionProblemCodeDD(result) {
        var tag;
        var i = 0;
        $("#problemCodeDropDown option:gt(0)").remove();
        $("#problemCodeDropDown").selectmenu("refresh", true);

        if (result.length === 0) {
            tag = document.createElement('option');
            tag.setAttribute("value", "-2");
            tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
            $("#problemCodeDropDown").append(tag);
            $("#problemCodeDropDown").val("-2");
            $("#problemCodeDropDown").selectmenu("refresh", true);
        }
        else if (result.length == 1) {
            tag = document.createElement('option');
            tag.setAttribute("value", result[0].Value);
            tag.innerHTML = result[0].Key;
            $("#problemCodeDropDown").append(tag);
            $("#problemCodeDropDown").val(result[0].Value);
            $("#problemCodeDropDown").selectmenu("refresh", true);

            ////            $("#inspectionEstimatedServiceCostText").val(parseFloat(result[0].EstServiceCost, 10).toFixed(2));
            ////            $("#inspectionCurrencyCodeSelect").val(result[0].CurrencyCode);
            ////            $("#inspectionCurrencyCodeSelect").selectmenu("refresh", true);
            ////            $("#hiddenInspectionProblemCodeCurrencyCode").val(result[0].CurrencyCode);                     

            if (getLocal("WorkOrderOption") != "PlannedExpense") {
                BindPriorityOrderType();
                GetInspectionGroupSubgroupData();
            }
            else {
                GetInspectionGroupSubgroupData();
                InspGetMatrixData();
            }
        }
        else {
            var firstTag = document.createElement('option');
            firstTag.setAttribute("value", "-1");
            firstTag.innerHTML = "-- [ " + result.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            $("#problemCodeDropDown").append(firstTag);

            for (i = 0; i < result.length; i++) {
                tag = document.createElement('option');
                tag.setAttribute("value", result[i].Value);
                tag.innerHTML = result[i].Key;
                $("#problemCodeDropDown").append(tag);
            }
            $("#problemCodeDropDown").val('-1');
            $("#problemCodeDropDown").selectmenu("refresh", true);
        }
    }
}

/// <summary>
/// Method to bind priority order type.
/// </summary>
function BindPriorityOrderType() {
    selectedCode = $('#problemCodeDropDown :selected').text();
    var problemCode = $('#problemCodeDropDown option:selected').val();
    ResetGroupSubGroup();
    GetInspectionGroupSubgroupData();

    var data = iMFMJsonObject({
        "ItemID": getLocal("ItemId"),
        "InspectionNumber": getLocal("InspectionNumber"),
        "CallNumber": 'Second',
        "ProblemCodeNumber": problemCode,
        "Username": decryptStr(getLocal("Username")),
        "Sequence": getLocal("Sequence"),
        "WorkOrderNumber": getLocal("InspectionWorkOrderNumber")
    });

    var prioritycodeURL = standardAddress + "Inspection.ashx?methodname=GetProblemCodeOrderPriorityData";
    LoadOrderPriority(prioritycodeURL, data);
}

/// <summary>
/// Method to success callback for getting Group SubGroup details from Local DB.
/// </summary>
/// <param name="tx">To execute sql.</param>
/// <param name="results">Holds the results data.</param>
function SetInspectionGroupSubgroupLocally(tx, results) {
    var groupSubgroupArray = [];
    groupSubgroupArray[0] = results.rows.item(0).GroupDescription;
    groupSubgroupArray[1] = results.rows.item(0).GroupID;
    groupSubgroupArray[2] = results.rows.item(0).SubGroupDescription;
    groupSubgroupArray[3] = results.rows.item(0).SubGroupID;

    var checkForConfig = getLocal("iMFM_FetchNTEConfig");
    if (checkForConfig == "0") {
        //// This is where we have to load the Est Serv Cost and the Currency Code from the local database using the Problem Code. 
        //// *1. First get the currency code from the building. 
        //// *2. Using the currency code from the building and problem code selected, load the Est Cost and Currency Code. 

        // Step 1. Load the Building CUrrency Code.
        if (regionNumber !== '' && divisionNumber !== '') {
            dB.transaction(function (tx) {
                tx.executeSql("SELECT CurrencyCode FROM PropertyTable WHERE (RegionID = ? and PropertyID = ?)", [regionNumber, divisionNumber], GetBuildingCurrency, failureSQL);
            });
        }
        ////        $("#inspectionEstimatedServiceCostText").val(parseFloat(decryptStr(results.rows.item(0).EstServiceCost), 10).toFixed(2));
        ////        $("#inspectionCurrencyCodeSelect").val(results.rows.item(0).CurrencyCode);
        ////        $("#inspectionCurrencyCodeSelect").selectmenu("refresh", true);
        ////        $("#hiddenInspectionProblemCodeCurrencyCode").val(results.rows.item(0).CurrencyCode);
    }
    ////    else {
    ////        InspGetMatrixData();
    ////    }

    SetInspectionGroupSubgroupData(groupSubgroupArray);
}

/// <summary>
/// Method to success callback for getting currency from the Building.
/// </summary>
/// <param name="result">Holds the results data.</param>
function GetBuildingCurrency(tx, results) {
    if (results.rows.length == 1) {
        inspBuildingCurrency = results.rows.item(0).CurrencyCode;
    }

    // Step 2. Get the Est Cost from the Building Currency. 
    if ($('#problemCodeDropDown option:selected').val() != "-1") {
        var inspSelectedPC = $("#problemCodeDropDown option:selected").val();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT GroupID, GroupDescription, SubGroupID, SubGroupDescription,EstServiceCost,CurrencyCode FROM ProblemTable WHERE (ProblemCodeID = ? and CurrencyCode = ?)", [inspSelectedPC, inspBuildingCurrency], SetInspCostCurrencyLocally, failureSQL);
        });
    }
}

//====Success callback for getting Currency and Currency Code details from Local DB====
function SetInspCostCurrencyLocally(tx, results) {
    try {
        if (results.rows.length == 1) {
            InspLoadCostandCurrency(parseFloat(decryptStr(results.rows.item(0).EstServiceCost), 10).toFixed(2), results.rows.item(0).CurrencyCode);
        }
        else {
            InspLoadCostandCurrency("0.00", inspBuildingCurrency);
        }
    }
    catch (error) {
        InspLoadCostandCurrency("0.00", inspBuildingCurrency);
    }
}

/// <summary>
/// Method to success callback for getting Group SubGroup details.
/// </summary>
/// <param name="result">Holds the results data.</param>
function SetInspectionGroupSubgroupData(result) {
    var problemCodeText = $("#problemCodeDropDown option:selected").text();
    $("#groupHiddenField").val(result[1]);
    $("#subGroupHiddenField").val(result[3]);
    $("#HiddenProblemCodeDesc").val(problemCodeText + " : >");
}

/// <summary>
/// Method to bind problem code.
/// </summary>
/// <param name="data">Holds the result data.</param>
function BindProblemCodeData(data) {
    var i = 0;
    var tag;
    $('#problemCodeDropDown > option').remove();
    $('#problemCodeDropDown').selectmenu("refresh", true);

    if (data.length === 0) {
        tag = document.createElement('option');
        tag.setAttribute("value", "-2");
        tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
        $('#problemCodeDropDown').append(tag);
        $('#problemCodeDropDown option:eq(0)').attr('selected', 'selected');
        $('#problemCodeDropDown').selectmenu("refresh", true);
        $('#problemCodeText').focus();
        $("#loadingProblemCode").popup("close");
        return;
    }
    else if (data.length == 1) {
        var singleTag = document.createElement('option');
        singleTag.setAttribute("value", data[0].Value);
        singleTag.innerHTML = data[0].Key;
        $('#problemCodeDropDown').append(singleTag);
        $('#problemCodeDropDown').val(data[0].Value);
        $('#problemCodeDropDown').selectmenu("refresh", true);
        $("#loadingProblemCode").popup("close");
        BindSelectedValueToDropDown();
    }
    else {
        var firstTag = document.createElement('option');
        firstTag.setAttribute("value", "-1");
        firstTag.innerHTML = "-- [ " + data.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $('#problemCodeDropDown').append(firstTag);

        for (i = 0; i < data.length; i++) {
            tag = document.createElement('option');
            tag.setAttribute("value", data[i].Value);
            tag.innerHTML = data[i].Key;
            $('#problemCodeDropDown').append(tag);
        }
        $('#problemCodeDropDown option:eq(0)').attr('selected', 'selected');
        $('#problemCodeDropDown').selectmenu("refresh", true);
        $('#problemCodeText').focus();
        $("#loadingProblemCode").popup("close");
    }
}

/// <summary>
/// Method to bind selected value to dropdown.
/// </summary>
function BindSelectedValueToDropDown() {
    selectedCode = $('#problemCodeDropDown :selected').text();
    var problemCode = $('#problemCodeDropDown option:selected').val();
    ResetGroupSubGroup();
    GetInspectionGroupSubgroupData();

    var data = {
        itemId: getLocal("ItemId"),
        inspectionNumber: getLocal("InspectionNumber"),
        callNumber: "Second",
        "ProblemCodeNumber": problemCode
    };
}

/// <summary>
/// Method to load priority order.
/// </summary>
/// <param name="prioritycodeURL">Holds the priority url.</param>
/// <param name="data">Holds the result data.</param>
function LoadOrderPriority(prioritycodeURL, data) {
    $.postJSON(prioritycodeURL, data, function (result) {
        var i = 0;
        var codeArray = [];
        if (result.length !== 0) {
            $.each(result, function (i, data) {
                if (result[i].Tag == 4) {
                    codeArray.push(data);
                    OrderAndPrioritydropDownBind(result, codeArray);
                } // end of if
            });      // end of each function
        } // end of if
    });
}

/// <summary>
/// Method to post error of problem code.
/// </summary>
function ProblemCodePostError() {
    ////showError("Error in getting problem code");
    showError(GetTranslatedValue("ErrorProblemCode"));
}

/// <summary>
/// Method to post error of problem code.
/// </summary>
function LoadProblemCodeOrderPriorityPostError() {
    showError(GetCommonTranslatedValue("ErrorLoading"));
}

/// <summary>
/// Method to load problem code priority order.
/// </summary>
/// <param name="url">Holds the url value.</param>
/// <param name="data">Holds the result data.</param>
function LoadProblemCodeOrderPriority(url, data) {
    $.postJSON(url, data, function (result) {
        var i = 0;
        var jsonArray = [];
        var codeArray = [];

        if (result.length !== 0) {
            for (code = 0; code < result.length; code++) {
                if (result[code].Tag == 3 || result[code].Tag == 7) {
                    if (result[code].ProblemCodeNumber !== null || result[code].ProblemCodeNumber !== 0) {
                        jsonArray.push(result[code]);

                        // populate problem code
                        var problemCodeTag = document.createElement('option');
                        problemCodeTag.setAttribute("value", result[code].ProblemCodeNumber);
                        problemCodeTag.innerHTML = result[code].ProblemCode;
                        $('#problemCodeDropDown').append(problemCodeTag);
                        $('#problemCodeDropDown option:eq(1)').attr('selected', 'selected');
                        $('#problemCodeDropDown').selectmenu("refresh", true);
                        ResetGroupSubGroup();

                        // To get group and sub group data based on problem code
                        GetInspectionGroupSubgroupData();

                        // To get order and priority based on problem code
                        OrderAndPrioritydropDownBind(result, jsonArray);
                    }
                    else {
                        LoadOrderAndPriority(result, null);
                    } // end of else
                } // end of if
                if (result[code].Tag == 5) {
                    $('#level1Label').text(result[code].Level1 + ":" + " ");
                    $('#level2Label').text(result[code].Level2 + ":" + " ");
                    $('#level3Label').append(result[code].Level3 + ":" + " ");
                    $('#level4Label').append(result[code].Level4 + ":" + " ");
                } // end of if
            }          // end of for
        }
    });
}

/// <summary>
/// Method to bind order and priority to dropdown.
/// </summary>
function OrderAndPrioritydropDownBind(result, data) {
    LoadOrderAndPriority(result, data);
}

/// <summary>
/// Method to load order and priority.
/// </summary>
function LoadOrderAndPriority(result, data) {
    var length = result.length;
    var i = 0;
    $('#orderTypeDropDown').children('option:not(:first)').remove();
    $('#proirityCodeDropDown').children('option:not(:first)').remove();
    for (i = 0; i < length; i++) {
        if (result[i].Tag == 1) {
            var orderTypeTag = document.createElement('option');
            orderTypeTag.setAttribute("value", result[i].OrderTypeSequence);
            orderTypeTag.innerHTML = result[i].OrderType;
            $('#orderTypeDropDown').append(orderTypeTag);
            if (data === null) {
                $('#orderTypeDropDown option:eq(1)').attr('selected', 'selected');
            }
            else {
                $('#orderTypeDropDown').val(data[0].OrderTypeSequence);
            }

            $('#orderTypeDropDown').selectmenu("refresh", true);
        } // end of else
        else if (result[i].Tag == 2) {
            var priorityCodeTag = document.createElement('option');
            priorityCodeTag.setAttribute("value", result[i].PriorityKey);
            priorityCodeTag.innerHTML = result[i].PriorityKey + '-' + result[i].PriorityCode;
            $('#proirityCodeDropDown').append(priorityCodeTag);
            if (result[i].PriorityKey == 'P15') {
                plannedExpensePriority = result[i].PriorityKey;
            }

            if (data === null) {
                $('#proirityCodeDropDown option:eq(1)').attr('selected', 'selected');
            }
            else {
                $('#proirityCodeDropDown').val(data[0].PriorityKey);
            }

            $('#proirityCodeDropDown').selectmenu("refresh", true);
        } // end of else
        else if (result[i].Tag == 10) {
            if (result[i].OrderTypeSequence === 0) {
                selfGenOrderTypeSequence = -1;
            }
            else {
                selfGenOrderTypeSequence = result[i].OrderTypeSequence;
            }
        }
    } // end of for
    if (data[0].ProblemCodeNumber === 0 || data[0].ProblemCodeNumber === null) {
        GetTargetDate();
    }

    if (getLocal("WorkOrderOption") == "CorrectiveAction" || getLocal("WorkOrderOption") == "PlannedExpense") {
        SetPriorityAndOrderType();
    }

    InspGetMatrixData();
}

/// <summary>
/// Method to set priority and order types.
/// </summary>
function SetPriorityAndOrderType() {
    if (getLocal("WorkOrderOption") == "PlannedExpense") {
        $('#proirityCodeDropDown').val(plannedExpensePriority);
        $('#proirityCodeDropDown').selectmenu("disable");
        $('#proirityCodeDropDown').selectmenu("refresh", true);
    }

    if (getLocal("WorkOrderOption") == "CorrectiveAction" || getLocal("WorkOrderOption") == "PlannedExpense") {
        // selfGenOrderTypeSequence will be either -1 or a valid seq. if valid, use that like normal.
        if (selfGenOrderTypeSequence != -1) {
            $('#orderTypeDropDown').val(selfGenOrderTypeSequence);
            $('#orderTypeDropDown').selectmenu("disable");
        } else {
            var options = $('#orderTypeDropDown option[value!="-1"]');
            if (options.length === 1) {
                $("#orderTypeDropDown").val(options.val());
                $("#orderTypeDropDown").selectmenu("disable");
            }
        }

        $('#orderTypeDropDown').selectmenu("refresh", true);
    }
}

/// <summary>
/// Method to validate work order fields.
/// </summary>
function ValidateInspectionAddWOFields() {
    var isValid = false;
    if ($('#assignmentTypeDropDown').val() == "-1") {
        isValid = false;
    }
    else if ($('#assignmentDropDown').val() == "-1") {
        isValid = false;
    }
    else if ($('#level3DropDown').val() == "-1") {
        isValid = false;
    }
    else if ($('#level4DropDown').val() == "-1") {
        isValid = false;
    }
    else if (($('#problemCodeDropDown').val() == "-1") || ($('#problemCodeDropDown').val() === null)) {
        isValid = false;
    }
    else if ($('#proirityCodeDropDown').val() == "-1") {
        isValid = false;
    }
    else if ($('#orderTypeDropDown').val() == "-1") {
        isValid = false;
    }
    else if ($("#formInspectionAddWO textarea#inspectionProblemDescriptionTextArea").val().trim() === "") {
        isValid = false;
    }
    else if ($.trim($('#inspectionEstimatedServiceCostText').val()).length === 0 && $('#inspectionEstimatedServiceCostText').attr("requried") == "true") {
        isValid = false;
    }
    else if ($('#inspectionCurrencyCodeSelect').val() == "-1" && $('#inspectionCurrencyCodeSelect').attr("requried") == "true") {
        isValid = false;
    }
    else if ($('#callerNameTextBox').val().length == 0 && $('#callerNameTextBox').attr("data-requried") == "true") {
        isValid = false;
    }
    else if ($('#ExtAccountNumberTextBox').val().length == 0 && $('#ExtAccountNumberTextBox').attr("data-requried") == "true") {
        isValid = false;
    }
    else { isValid = true; }
    return isValid;

}

/// <summary>
/// Method to save work order.
/// </summary>
function SaveWorkOrder() {
    try {
        var regexEstimatedCost = new RegExp(/^[$]?([-][0-9]{1,2}([.][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([.][0-9]{1,2})$|^[$]?[0-9]{1,13}$/);
        var estimatedCostValue = regexEstimatedCost.test($.trim($('#inspectionEstimatedServiceCostText').val()));
        var pageID = "#" + $.mobile.activePage.attr("id");
        $(pageID + 'actionLoadingPopup h1').text(GetTranslatedValue("CreatingWO"));
        var validate = ValidateInspectionAddWOFields();
        if (!validate) {
            ////showError("Please fill all mandatory fields");
            showError(GetTranslatedValue("FillAll"));
        }
        else if ((!estimatedCostValue) && ($.trim($('#inspectionEstimatedServiceCostText').val()).length !== 0)) {
            ////showError("Estimated service Cost value given is invalid. Please enter valid currency value.");
            showError(GetTranslatedValue("InvalidServiceCost"));
        }
        else if ($('#CostCenterTextBox').is(':visible') && $.trim($('#CostCenterTextBox').val()).length === 0 && $(pageID).find('#CostCenterTextBox').attr("requried") == "true") {
            ////showError("Please enter cost center.");
            showError(GetTranslatedValue("EnterCostCenter"));
        }
        else if ($('#ServiceContractDropDownList').is(':visible') && $('#ServiceContractDropDownList').val() == "-1" && $(pageID).find('#ServiceContractDropDownList').attr("requried") == "true") {
            ////showError("Please enter the service contract.");
            showError(GetTranslatedValue("EnterServiceContract"));
        }
        else if (createWOAttachmentFlag && $('#workOrderAttachment').attr('src').length == 0) {
            showError(GetTranslatedValue("AttachImage"));
        }
        else if ($('#callerNameTextBox').is(':visible') && $('#callerNameTextBox').val().length == 0 && $('#callerNameTextBox').attr("requried") == "true") {
            showError(GetTranslatedValue("EnterCallerName"));
        }
        else if ($('#orderTypeDropDown').val() == "-1") {
            showError(GetTranslatedValue("EnterOrderType"));
        }
        else {
            if (closePopUP === true) {
                setTimeout(function () {
                    showActionPopupLoading();
                }, 500);
            }
            else {
                showActionPopupLoading();
            }
            $('#saveImage').addClass('ui-disabled');
            $('#cancelImage').addClass('ui-disabled');
            $("#hiddenDatabaseID").val(decryptStr(getLocal("DatabaseID")));
            $("#hiddenUsername").val(decryptStr(getLocal("Username")));
            $("#hiddenLanguage").val(getLocal("Language"));
            $("#hiddenEmployeeNumber").val(decryptStr(getLocal("EmployeeNumber")));
            $("#hiddenEmployeeName").val(decryptStr(getLocal("FullName")));
            $("#hiddenWorkOrderNumber").val(getLocal("InspectionWorkOrderNumber"));
            $("#hiddenPriorityCode").val($('#proirityCodeDropDown').val());
            $("#hiddenOrderType").val($('#orderTypeDropDown').val());
            $("#HiddenSourceField").val($("#WorkOrderSourceSelect").find('option:selected').text());
            $("#HiddenFieldCallerName").val($("#callerNameTextBox").val());
            $("#HiddenGPSLocation").val(GlobalLat + "," + GlobalLong);
            $("#HiddenSessionID").val(decryptStr(getLocal("SessionID")));

            // You also need the InspectionNumber and Inspection Item ID
            $("#InspectionNumberForLog").val(getLocal("InspectionNumber"));
            $("#InspectionItemSeqForLog").val(getLocal("Sequence"));

            var WOD = JSON.stringify($("#formInspectionAddWO").serializeArray());

            if (navigator.onLine) {
                var saveWOURL = standardAddress + "CreateWO.ashx?method=Save";
                AddWOSuccess(saveWOURL, WOD);
            }
            else {
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("InspectionOffline"));
                }, 1000);
            }
        }
    }
    catch (Error) {
        showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }

}

/// <summary>
/// Method to add success work order.
/// </summary>
/// <param name="saveWOURL">Holds the saved work order url.</param>
/// <param name="data">Holds the result data.</param>
function AddWOSuccess(saveWOURL, data) {
    try {
        var pageID = "#" + $.mobile.activePage.attr("id");
        var errorMessage;
        $.ajaxpostJSON(standardAddress + "CreateWO.ashx?method=Save", { WOData: data }, function (result) {
            if (createWOAttachmentFlag) {
                var WON = result.split(':');
                ////                setLocal("WorkOrderNumber", WON[1]);
                $('#CreateWODataBaseID').val(decryptStr(getLocal("DatabaseID")));
                $('#CreateWOUserName').val(decryptStr(getLocal("UserName")));
                $('#CreateWOLanguage').val(getLocal("Language"));
                $('#CreateWOEmployeeNumber').val(decryptStr(getLocal("EmployeeNumber")));
                $('#CreateWOEmployeeName').val(decryptStr(getLocal("EmployeeName")));
                $('#CreateWONumber').val(WON[1]);
                $('#CreateWOPriority').val(WON[2]);
                $('#GPSLocation').val(GlobalLat + "," + GlobalLong);
                $('#SessionID').val(decryptStr(getLocal("SessionID")));
                $('#AttachDispForCreateWO').click();
            }
            else {
                inspectionCreateWOAttachment(result);
            }
        });
    }
    catch (Error) {
        showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
    }
}

/// <summary>
/// Method to post error of added work order.
/// </summary>
function AddWOSuccessPostError() {
    ////showError("Error in creating work order");
    showError(GetTranslatedValue("ErrorCreate"));
}

/// <summary>
/// Method to success callback for getting Group SubGroup details.
/// </summary>
function GetInspectionGroupSubgroupData() {
    if ($('#problemCodeDropDown option:selected').val() == "-1") {
        $('#problemCodeDropDown').focus();
        return;
    }
    var problemCodeValue = $("#problemCodeDropDown option:selected").val();
    var problemCodeText = $('#problemCodeDropDown option:selected').text();
    db.transaction(function (tx) {
        tx.executeSql("SELECT GroupID, GroupDescription, SubGroupID, SubGroupDescription,EstServiceCost,CurrencyCode FROM ProblemTable WHERE (ProblemCodeID = ?)", [problemCodeValue], SetInspectionGroupSubgroupLocally, failureSQL);
    });
}

/// <summary>
/// Method to execute Sql failure callback.
/// </summary>
/// <param name="tx">To execute sql.</param>
/// <param name="error">Holds error message.</param>
function failureSQL(tx, error) {
    LogMessage("ExecuteSql Failed" + error.message);
}

/// <summary>
/// Method to post error of group subgroup. 
/// </summary>
function GroupSubgroupPostError() {
    ////showError("Error Getting Group/SubGroup Data");
    showError(GetTranslatedValue("ErrorGroupSubGroup"));
}

/// <summary>
/// Method to reset group subgroup. 
/// </summary>
function ResetGroupSubGroup() {
    $("#groupHiddenField").val('');
    $("#subGroupHiddenField").val('');
}

/// <summary>
/// Method to navigate back from add work order. 
/// </summary>
function NavigateBackFromAddWO() {
    var page = getLocal("InspectionPageName");
    if (page == "InspectionEditItem" || page == "InspectionItems") {
        NavigateBackToItems();
    }
    else {
        $.mobile.changePage("InspectionViewWorkOrders.html");
    }
}

/// <summary>
/// Method to get target date. 
/// </summary>
function GetTargetDate() {
    var priorityKeyValue = $('#proirityCodeDropDown').val();
    var roomValue = $('#level4DropDown').val();

    var data = iMFMJsonObject({
        "PriorityKey": priorityKeyValue,
        "Level4Value": roomValue,
        "Username": decryptStr(getLocal("Username"))
    });
    var priorityURL = standardAddress + "Inspection.ashx?methodname=GetTargetDateForPriorityCode";
    SetTargetDateData(priorityURL, data);
}

/// <summary>
/// Method to set target date and data.
/// </summary>
/// <param name="priorityURL">Holds the priority url.</param>
/// <param name="priorityData">Holds the priority data.</param>
function SetTargetDateData(priorityURL, priorityData) {
    $.postJSON(priorityURL, priorityData, function (date) {
        $('#formInspectionAddWO #targetCompleteDateHiddenField').val(date[0].TargetCompleteString + ' ' + date[0].TargetCompleteTimeString);
    });
}

/// <summary>
/// Method to post error of set target date and data.
/// </summary>
function SetTargetDateDataPostError() {
    ////showError("Error in getting target dates based on priority");
    showError(GetTranslatedValue("ErrorTargetDates"));
}

/// <summary>
/// Method to call when assignment type DD selected index changes.
/// </summary>
function BindAssignmentDropDownFromInspection() {
    pageID = "#" + $.mobile.activePage.attr('id');
    var tag;
    var selectedVallue = $(pageID + " #assignmentTypeDropDown").val();
    setLocal('VendorSelectedInspection', 0);
    var netStatus = checkNetworkStatus();
    switch (selectedVallue) {
        case 'Employee':
            InspectionBindAssignmentDropDownEmployee();
            break;
        case 'Vendor':
            InspectionBindAssignmentDropDownEmployee();
            setLocal('VendorSelectedInspection', 1);
            break;
        case 'CallCenter':
            $(pageID + " #assignmentDropDown").children('option:not(:first)').remove();
            tag = document.createElement('option');
            tag.setAttribute("value", "0");
            tag.innerHTML = GetTranslatedValue("CallCenter");
            $(pageID + " #assignmentDropDown").append(tag);
            break;
        case 'Manager':
            $(pageID).find("#assignmentDropDown option:gt(0)").remove();
            tag = document.createElement('option');
            tag.setAttribute("value", "FM");
            tag.innerHTML = GetTranslatedValue("FMLabel");
            $(pageID).find("#assignmentDropDown").append(tag);
            $(pageID).find("#assignmentDropDown").val("FM").selectmenu("refresh").selectmenu("enable");
            break;
        default:
            $(pageID + " #assignmentDropDown").selectmenu("disable");
            $(pageID + " #assignmentDropDown").children('option:not(:first)').remove();
            $(pageID + " #assignmentDropDown option:first").attr('selected', 'selected');
            $(pageID + " #assignmentDropDown").selectmenu("refresh", true);
    }
    BindServiceContractDDLForInspection();
}

/// <summary>
/// Method to bind assignment dropdown employee.
/// </summary>
function InspectionBindAssignmentDropDownEmployee() {
    var assignmentTypeID = $(pageID + " #assignmentTypeDropDown").val();
    var db = openDatabase('iMFMDB', '', null, null);
    db.transaction(function (tx) {
        tx.executeSql('SELECT AssignmentID, AssignmentText FROM AssignmentTable WHERE AssignmentTypeID = ?', [assignmentTypeID], InspectionPopulateAssignmentDDLocally, failureSQL);
    });
}

/// <summary>
/// Method to Populated AssignmentDD from local DB "STARTS".
/// </summary>
/// <param name="tx">To execute sql.</param>
/// <param name="results">Holds the results data.</param>
function InspectionPopulateAssignmentDDLocally(tx, results) {
    $(pageID + " #assignmentDropDown").selectmenu("enable", true);
    $(pageID + " #assignmentDropDown").children('option:not(:first)').remove();
    var i = 0;
    if (results.rows.length === 0) {
        $(pageID + " #assignmentDropDown").selectmenu("refresh", true);
        $(pageID + " #assignmentDropDown").selectmenu("disable", true);
        return false;
    }
    for (i = 0; i < results.rows.length; i++) {
        var tag = document.createElement('option');
        tag.setAttribute("value", results.rows.item(i).AssignmentID);
        tag.innerHTML = results.rows.item(i).AssignmentText;
        $(pageID + " #assignmentDropDown").append(tag);
    }
    $(pageID + " #assignmentDropDown").selectmenu("refresh", true);
}

/// <summary>
/// Method to inspect technical no.
/// </summary>
function InspectionTechnicalNo() {
    $(pageID + ' #inspectionHiddenAssignmentOverride').val('true');
    $('#inspectionTechnicianAvailableDiv').popup("close");
    closePopUP = true;
    $('#inspectionHiddenProcessStage').val("3");
    SaveWorkOrder();
}

/// <summary>
/// Method to inspect technical cancel.
/// </summary>
function InspectionTechnicalCancel() {
    $('#assignmentTypeDropDown').val('Manager').selectmenu('refresh', true);
    BindAssignmentDropDownFromInspection();
    closePopUP = true;
    setTimeout(function () {
        $('#assignmentDropDown').val('FM');
        $('#assignmentDropDown').selectmenu('refresh', true);
        $('#inspectionTechnicianAvailableDiv').popup("close");
        SaveWorkOrder();
    }, 1000);
}

/// <summary>
/// Method to inspect technical yes.
/// </summary>
function InspectionTechnicianYes() {
    var optType;
    var opt;
    if (employeeNumber !== null) {
        optType = '<option value="Employee"></option>';
        $('#assignmentTypeDropDown option:gt(0)').remove();
        $('#assignmentTypeDropDown').append(optType);
        $('#assignmentTypeDropDown').val('Employee').selectmenu('refresh', true);
        $('#assignmentDropDown option:gt(0)').remove();
        opt = '<option value="' + employeeNumber + '"></option>';
        $('#assignmentDropDown').append(opt);
        $('#assignmentDropDown').val(employeeNumber).selectmenu('refresh');
        $('#assignmentTypeDropDown').val('Employee').selectmenu('refresh', true);
    }
    else {
        optType = '<option value="Vendor"></option>';
        $('#assignmentTypeDropDown option:gt(0)').remove();
        $('#assignmentTypeDropDown').append(optType);
        $('#assignmentTypeDropDown').val('Vendor').selectmenu('refresh', true);
        $('#assignmentDropDown option:gt(0)').remove();
        opt = '<option value="' + vendorNumber + '"></option>';
        $('#assignmentDropDown').append(opt);
        $('#assignmentDropDown').val(vendorNumber).selectmenu('refresh');
    }

    $('#hiddenEmployeeNumber').val(employeeNumber);
    $(pageID + ' #inspectionHiddenAssignmentOverride').val('false');
    $('#inspectionTechnicianAvailableDiv').popup("close");
    closePopUP = true;
    $('#inspectionHiddenProcessStage').val("2");
    SaveWorkOrder();
}

/// <summary>
/// Method to bind service contractDDL for inspection.
/// </summary>
/// <param name="ddlValue">Holds ddl values.</param>
function BindServiceContractDDLForInspection(ddlValue) {
    var FilterSCValue = getLocal("FilterSCValue");
    var vendorSelected = 1;
    var selectedVendorNum = "";
    var serviceContractSelectQuery;
    selectedVendorNum = $(pageID + " #assignmentDropDown").val();
    vendorSelected = getLocal("VendorSelectedInspection");

    if ($("#GipPanelSecurityReqInspection").val() !== undefined) {
        if ($("#GipPanelSecurityReqInspection").val() == 1 && vendorSelected == 1) {
            $("#ServiceContractDropDownList").attr("Requried", "true");
            $("#ServiceContractRequiredLabel").show();
        }
        else {
            $("#ServiceContractDropDownList").attr("Requried", "false");
            $("#ServiceContractRequiredLabel").hide();
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

/// <summary>
/// Method to check cost center required for inspection.
/// </summary>
function CheckCostCenterRequiredForInspection() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var CompanyCoveredIsBillable = getLocal("CompanyCoveredIsBillable");
    if (CompanyCoveredIsBillable == 1 && $('#CompanyCoveredCheckBox').is(":checked")) {
        $(pageID + " #CostCenterRequiredLabel").show();
        $(pageID + " #CostCenterTextBox").attr("Requried", "true");
    }
    else if ($(pageID + " #GipPanelSecurityReq").val() === 0) {
        $(pageID + " #CostCenterTextBox").attr("Requried", "false");
        $(pageID + " #CostCenterRequiredLabel").hide();
    }
}

/// <summary>
/// Method to post inspection work order attachment.
/// </summary>
function PostInspectionWOAttachment(form) {
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
            datatype: "json",
            data: attachmentData,
            success: function (resultData) {
                if (resultData === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    createWOAttachmentFlag = false;
                    inspectionCreateWOAttachment(resultData);
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
                    }
                    else if (textStatus == 'error') {
                        errorMsg = GetCommonTranslatedValue("InternalError");
                    }
                    else if (textStatus == 'abort') {
                        errorMsg = GetCommonTranslatedValue("RequestAborted");
                    }
                    else if (textStatus == 'parsererror') {
                        errorMsg = GetCommonTranslatedValue("InternalParseError");
                    }
                    else {
                        errorMsg = GetCommonTranslatedValue("NetworkLost");
                    }
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetCommonTranslatedValue("AttachmentFail"));
                    }, 650);
                }
            }
        });
    }
    else {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(GetCommonTranslatedValue("NetworkDiscrepancy"));
        }, 1000);
    }
}

/// <summary>
/// Method to inspection create work order attachment.
/// </summary>
/// <param name="result">Holds the results data.</param>
function inspectionCreateWOAttachment(result) {
    var pageID = "#" + $.mobile.activePage.attr("id");
    if (createWOAttachmentFlag) {
        if (result.indexOf("SUCCESS") != -1) {
            var workOrderNumber = result.split(':');
            closeActionPopupLoading();
            $('#successMessageParagraph').html(GetTranslatedValue("WorkOrderCreated").replace("[WONUM]", workOrderNumber[1]));

            setTimeout(function () {
                $("#workOrderMessagePopUp").popup();
                $("#workOrderMessagePopUp").popup("open");
            }, 1000);
        }
        else {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(result);
            }, 1000);
        }
    }
    else {
        $(pageID).find("#inspectionAssignToFMButton").show();
        if (result.indexOf("SUCCESS") != -1) {
            var workOrderNumber = result.split(':');
            closeActionPopupLoading();
            $('#successMessageParagraph').html(GetTranslatedValue("WorkOrderCreated").replace("[WONUM]", workOrderNumber[1]));

            setTimeout(function () {
                $("#workOrderMessagePopUp").popup();
                $("#workOrderMessagePopUp").popup("open");
            }, 1000);
        }
        else if (result.indexOf('WARNING') != -1) {
            if ($.trim($(pageID).find("#assignmentTypeDropDown").val()).indexOf("Manager") != -1) {
                $(pageID).find("#inspectionAssignToFMButton").hide();
            }
            closeActionPopupLoading();
            if (result.indexOf(';') != -1) {
                errorMessage = result.split(';');
                $("#inspectionAvailablityMessageSpan").html(errorMessage[0]);
                employeeNumber = errorMessage[1];
                setTimeout(function () {
                    $("#inspectionTechnicianAvailableDiv").popup();
                    $("#inspectionTechnicianAvailableDiv").popup("open", { positionTo: "window", shadow: true, transition: "flip" });

                }, 1000);
            }
            else {
                errorMessage = result.split('$$');
                $("#inspectionAvailablityMessageSpan").html(errorMessage[0]);
                vendorNumber = errorMessage[1];
                setTimeout(function () {
                    $("#inspectionTechnicianAvailableDiv").popup();
                    $("#inspectionTechnicianAvailableDiv").popup("open", { positionTo: "window", shadow: true, transition: "flip" });

                }, 1000);
            }
        }
        else {
            if (result.indexOf(':COSTCENTER:') != -1) {
                $("#CostCenterTextBox").val('');
                result = result.replace(":COSTCENTER:", '');
            }
            else {
                BindInspectionAssignmentDropDown();
            }
            closeActionPopupLoading();
            setTimeout(function () {
                showError(result);
            }, 1000);
        }
        $('#saveImage').removeClass('ui-disabled');
        $('#cancelImage').removeClass('ui-disabled');
    }
}

/// <summary>
/// Method to security for caller name inspection.
/// </summary>
/// <param name="result">Holds the results data.</param>
function SecurityForCallerNameInsp(result) {
    for (var i = 0; i < result.length; i++) {
        if (result[i].CanAccess == 0 && result[i].SubTokenDescription == "CallerName") {
            $("#callerNameDiv").hide();
        }
        else if (result[i].CanAccess == 1 && result[i].SubTokenDescription == "CallerName") {
            $("#callerNameDiv").show();
            if (result[i].Required == 1) {
                $("#callerNameRequiredLabel").show();
                $("#callerNameTextBox").attr("data-requried", "true");
            }
            else {
                if (result[i].ReadOnly == 1) {
                    $("#callerNameRequiredLabel").hide();
                    $(pageID).find("#callerNameTextBox").prop('disabled', false);
                }
                else {
                    $("#callerNameRequiredLabel").hide();
                    $("#callerNameTextBox").prop('disabled', true);
                }
            } // end of else
        }
    }
}

/// <summary>
/// Method to call the translations.
/// </summary>
/// <param name="result">Holds the results data.</param>
function InspectionAddWorkOrder_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var logOutLabel = GetCommonTranslatedValue("LogOutLabel");
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var ProblemCodeDropDownValue = GetTranslatedValue("problemCodeDropDown");
    var ServiceContractLabel = GetTranslatedValue("inspectionServiceContractCoveredLbl");
    var NoImageLabel = GetTranslatedValue("NoAttachmentLabel");

    $(pageID).find("#InspectionAddWOLogoutButton .ui-btn-text").text(logOutLabel);
    $(pageID).find("#assignmentTypeDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#assignmentDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#level3DropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#level4DropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#problemCodeDropDown").html('<option value="-1">' + ProblemCodeDropDownValue + '</option>').selectmenu("refresh");
    $(pageID).find("#proirityCodeDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#orderTypeDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#inspectionCurrencyCodeSelect").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#ServiceContractDropDownList").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#workOrderAttachment").attr("alt", NoImageLabel);
    //$(pageID).find("#ServiceContractCoveredLabel .ui-btn-text").text(ServiceContractLabel);
    ////SR: Pentesting & JQM update
    $(pageID).find("#ServiceContractCoveredLabel").text(ServiceContractLabel);
    /////Attachment code implementation.
    //$(pageID).find("#attachmentCheckLabel .ui-btn-text").text(GetTranslatedValue("AttachmentCheckBoxLabel"));
    ////SR: Pentesting & JQM update
    $(pageID).find("#attachmentCheckLabel").text(GetTranslatedValue("AttachmentCheckBoxLabel"));
    $(pageID).find("#CreateAttachmentContainer").hide();
    $(pageID).find('#clearAttachmentSource').hide();
    $(pageID).find('#HiddenAttachmentFlag').val('false');
    $(pageID).find('#WorkOrderSourceLabel').text(GetTranslatedValue("WorkOrderSourceLabel"));
    BindWorkOrderSource("WorkOrderSourceSelect", pageID);
    BindCurrencyDropDown("inspectionCurrencyCodeSelect");
    $(pageID).find("#callerNameLabel").text(GetTranslatedValue("CallerNameLabel"));
}

///----Function to load the Est Cost from the Matrix based on the Configuration----////
/// <summary>
/// Method to Get the Matrix data for the inspection.
/// </summary>
/// <param name="result">Holds the results data.</param>
function InspGetMatrixData() {
    if ($("#problemCodeDropDown option:selected").val() == "-1") {
        $("#problemCodeDropDown").focus();
        return;
    }

    // Get the Data. 
    // Case 1: When the COmpany Default is set to 1 or 2
    var inspProblemCodeValue;
    var loadInspEstimatedServiceCostConfig = getLocal("iMFM_FetchNTEConfig");
    var inspMatrixEstimatedCost = "0.00";
    var inspMatrixCurrency = "USD";
    var estimatedCostActual = "0.00";
    var currencyActual = "USD";

    // First reset the NTE. 
    InspLoadCostandCurrency(estimatedCostActual, currencyActual);

    try {
        if (loadInspEstimatedServiceCostConfig == 1 || loadInspEstimatedServiceCostConfig == 2) {
            if (navigator.onLine) {
                var needDBHit = true;
                var MatrixFetchData = {
                    DatabaseId: decryptStr(localStorage.getItem("DatabaseID")),
                    Culture: localStorage.getItem("Language"),
                    EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                    SessionID: decryptStr(getLocal("SessionID")),
                    CustomerSiteNumber: $("#level4DropDown option:selected").val(),
                    ProblemCode: $("#problemCodeDropDown option:selected").val(),
                    CustomerNumber: null,
                    SearchString: getLocal("WorkOrderOption")
                };

                ////                if (getLocal("WorkOrderOption") == "PlannedExpense") {
                ////                    MatrixFetchData.CustomerNumber = getLocal("CustomerNumber");
                ////                    MatrixFetchData.CustomerSiteNumber = getLocal("CustomerSiteNumber");
                ////                }
                ////                else {
                if ($("#level4DropDown option:selected").val() == "-1") {
                    needDBHit = false;
                }
                ////}

                if (needDBHit) {
                    $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetMatrixBasedInformation", { MatrixFetchData: JSON.stringify(MatrixFetchData) }, function (result) {

                        if (result != null) {
                            inspMatrixEstimatedCost = result.EstServiceCost;
                            inspMatrixCurrency = result.CurrencyCode;
                            InspLoadCostandCurrency(parseFloat(result.EstServiceCost, 10).toFixed(2), result.CurrencyCode);
                        }
                        else {
                            InspLoadCostandCurrency(parseFloat(estimatedCostActual, 10).toFixed(2), currencyActual);
                        }
                    });
                }
            }
        }
        else {
            GetInspectionGroupSubgroupData();

        }
    }
    catch (error) {
        InspLoadCostandCurrency(estimatedCostActual, currencyActual);
    }

}

/// <summary>
/// Method to load the data into est cost and currency code.
/// </summary>
/// <param name="result">Holds the results data.</param>
function InspLoadCostandCurrency(estCostCalculated, currencyCalculated) {
    $("#inspectionEstimatedServiceCostText").val(estCostCalculated);
    $("#inspectionCurrencyCodeSelect").val(currencyCalculated);
    $("#inspectionCurrencyCodeSelect").selectmenu("refresh", true);
}

/////// <summary>
/////// Method to manage the data on the problem code change.
/////// </summary>
/////// <param name="result">Holds the results data.</param>
////function InspLoadPCRelatedData() {
////    InspGetMatrixData();
////}
