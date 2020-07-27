///========**This PdaSearch.js file contains javascript code for PdaSearch.aspx file**========///
function BindFloor(result) {
    try {
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find('#SFloorValue option:gt(0)').remove();
        for (i = 0; i < result.length; i++) {
            tag = document.createElement('option');
            tag.setAttribute("value", result[i].Number);
            tag.innerHTML = result[i].Description;
            $("#" + pageID).find("#SFloorValue").append(tag);
        }
        $("#" + pageID).find('#SFloorValue').selectmenu("refresh");
    }
    catch (e) {
    }
}


function BindFloorLocal(ts, result) {
    try {
        var item;
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find('#SFloorValue option:gt(0)').remove();
        $("#" + pageID).find('#SRoomValue option:gt(0)').remove();
        if (result.rows.length === 1) {
            item = result.rows.item(0);
            tag = document.createElement('option');
            tag.setAttribute("value", decryptStr(item.FloorID));
            tag.innerHTML = decryptStr(item.FloorText);
            $("#" + pageID).find("#SFloorValue").append(tag);
            $("#" + pageID).find("#SFloorValue").val(decryptStr(item.FloorID)).selectmenu("refresh").change();
            $("#" + pageID).find('#SFloorValue').selectmenu("enable");
            return;
        }
        for (i = result.rows.length - 1; i >= 0; i--) {
            item = result.rows.item(i);
            var selected = decryptStr(result.rows.item(result.rows.length - 1).FloorID);
            tag = document.createElement('option');
            tag.setAttribute("value", decryptStr(item.FloorID));
            tag.innerHTML = decryptStr(item.FloorText);
            $("#" + pageID).find("#SFloorValue").append(tag);
        }

        if (getLocal("PreviousScreen") === "WOStepPage") {
            $("#" + pageID).find('#SFloorValue').val(getLocal("WOCustomerSiteNumber").split("{")[1].split("}")[0]);
            BindRoomDDL();
        }
        $("#" + pageID).find('#SFloorValue').selectmenu("enable");
        $("#" + pageID).find('#SFloorValue').selectmenu("refresh");
    }
    catch (e) {
    }
}

function HideLocation(tag) {
    try {
        var pID = $.mobile.activePage.attr('id');
        var tagID = "#" + tag.id;
        $("#" + pID).find("#LocationDiv").hide();
        if ($("#" + pID).find(tagID).is(':checked')) {
            $("#" + pID).find("#LocationDiv").show();
        }
    }
    catch (e) {
    }
}

function OrderSearchReset() {
    try {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID).find("#SWONumTextBox").val('').keyup();
        $("#" + pageID).find("#SPidTextBox").val('');

        $("#" + pageID).find("#VendorNameText").val('');

        if ($("#" + pageID).find("#DateSearchChk").is(":checked") === true) {
            $("#" + pageID).find("#DateSearchChk").click().checkboxradio("refresh");
        }

        if ($("#" + pageID).find("#chkSearchSite").is(":checked") === true) {
            $("#" + pageID).find("#chkSearchSite").click().checkboxradio("refresh");
        }

        $("#" + pageID).find("#SPidDDL option:gt(0)").remove();
        $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
        $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('AllLabel')).val(-1);
        $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('AllLabel')).val(-1);

        var selected = $("#" + pageID).find("#SCompletionDDL option:first").val();
        $("#" + pageID).find("#SCompletionDDL").val(selected).selectmenu("refresh");

        selected = $("#" + pageID).find("#SCategoryDDL option:first").val();
        $("#" + pageID).find("#SCategoryDDL").val(selected).selectmenu("refresh");

        selected = $("#" + pageID).find("#VendorTypeDDL option:first").val();
        $("#" + pageID).find("#VendorTypeDDL").val(selected).selectmenu("refresh");

        selected = $("#" + pageID).find("#DSDateDDL option:first").val();
        $("#" + pageID).find("#DSDateDDL").val(selected).selectmenu("refresh");

        $("#" + pageID).find("#SPidDDL option:gt(0)").remove();
        $("#" + pageID).find("#SPidDDL").val('-1').selectmenu("refresh");

        $("#" + pageID).find("#OrderTypeDDL").val('');
        $("#" + pageID).find('#OrderTypeDDL').selectmenu("refresh");


        $("#" + pageID).find("#setLocLocal").hide();

        $("#" + pageID).find("#SFloorValue").html('<option value="-1">' + GetCommonTranslatedValue('AllLabel') + '</option>').selectmenu("disable");
        $("#" + pageID).find("#SRoomValue").html('<option value="-1">' + GetCommonTranslatedValue('AllLabel') + '</option>').selectmenu("disable").selectmenu("refresh");


        setLocation();
        $.mobile.silentScroll(0);
        return false;
    }
    catch (e) {
    }
}

function StoreSearchCriteriaToLocalStorage() {
    try {
        var pageID = $.mobile.activePage.attr("id");
        setLocal("SWONumTextBox", $("#" + pageID).find("#SWONumTextBox").val());
        setLocal("OrederTypeValues", $("#" + pageID).find("#OrderTypeDDL").val());
        setLocal("SCompletionDDL", $("#" + pageID).find("#SCompletionDDL").val());
        setLocal("SPidTextBox", $("#" + pageID).find("#SPidTextBox").val());
        setLocal("SCategoryDDL", $("#" + pageID).find("#SCategoryDDL").val() > 0 ? $("#" + pageID).find("#SCategoryDDL").val() : 0);
        setLocal("DateSearchChk", $("#" + pageID).find("#DateSearchChk").is(":checked"));
        setLocal("SFromDateTextBox", $("#" + pageID).find("#SFromDateTextBox").val());
        setLocal("SToDateTextBox", $("#" + pageID).find("#SToDateTextBox").val());
        setLocal("SSortDDL", $("#" + pageID).find("#SSortDDL").val());
        setLocal("SSortDDLText", $("#" + pageID).find("#SSortDDL option:selected").text());
        setLocal("SCategoryDDLText", $("#" + pageID).find("#SCategoryDDL option:selected").text());
        setLocal("TodayDate", ($("#" + pageID).find("#todayDate").val()));

        setLocal("SL1_DropDownListValue", ($("#" + pageID).find("#SStCityValue").attr("data-value")));
        setLocal("SL1_DropDownListText", ($("#" + pageID).find("#SStCityValue").text()));

        setLocal("SL2_DropDownListValue", ($("#" + pageID).find("#SBuildingValue").attr("data-value")));
        setLocal("SL2_DropDownListText", ($("#" + pageID).find("#SBuildingValue").text()));

        setLocal("SL3_DropDownListValue", ($("#" + pageID).find("#SFloorValue option:selected").val()));
        setLocal("SL3_DropDownListText", ($("#" + pageID).find("#SFloorValue option:selected").text()));

        setLocal("SL4_DropDownListValue", ($("#" + pageID).find("#SRoomValue option:selected").val()));
        setLocal("SL4_DropDownListText", ($("#" + pageID).find("#SRoomValue option:selected").text()));

        setLocal("PdaDailySearchSelectedDate", ($("#" + pageID).find("#DSDateDDL option:selected").val()));
    }
    catch (e) {
    }
}

function BindRoom(result) {
    try {
        var selected;
        var tag;
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find('#SRoomValue').empty();
        tag = document.createElement('option');
        tag.setAttribute("value", -1);
        tag.innerHTML = GetCommonTranslatedValue("SelectLabel");
        $("#" + pageID).find("#SRoomValue").append(tag);
        for (i = 0; i < result.length; i++) {
            selected = result[0].Number;
            tag = document.createElement('option');
            tag.setAttribute("value", result[i].Number);
            tag.innerHTML = result[i].Description;
            $("#" + pageID).find("#SRoomValue").append(tag);
        }
        $("#" + pageID).find('#SRoomValue').val(selected).selectmenu("enable").selectmenu("refresh");
    }
    catch (e) {
    }
}


function BindRoomLocal(ts, result) {
    try {
        var item;
        var tag;
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find('#SRoomValue option:gt(0)').remove();
        if (result.rows.length === 1) {
            item = result.rows.item(0);
            tag = document.createElement('option');
            tag.setAttribute("value", decryptStr(item.RoomID));
            tag.innerHTML = decryptStr(item.RoomText);
            $("#" + pageID).find("#SRoomValue").append(tag);
            $("#" + pageID).find("#SRoomValue").val(decryptStr(item.RoomID)).selectmenu("refresh");
            $("#" + pageID).find('#SRoomValue').selectmenu("enable").selectmenu("refresh");
            if ($("#" + pageID).find('#ddlAssignmentType').val() == 'Current User') {
                AddLaborPopupOpen();
            }

            // We also need to load the Est Cost and Matrix if this is a Matrix based load. 
            var bindRoomLocalNTEConfig = getLocal("iMFM_FetchNTEConfig");
            if (bindRoomLocalNTEConfig == 1) {
                GetGroupSubgroupData();
            }

            return;
        }
        for (i = result.rows.length - 1; i >= 0; i--) {
            item = result.rows.item(i);
            tag = document.createElement('option');
            tag.setAttribute("value", decryptStr(item.RoomID));
            tag.innerHTML = decryptStr(item.RoomText);
            $("#" + pageID).find("#SRoomValue").append(tag);
        }
        if (getLocal("PreviousScreen") === "WOStepPage") {
            $("#" + pageID).find('#SRoomValue').val("-1|-1{-1}" + getLocal("WOCustomerSiteNumber").split("{")[1].split("}")[1]);
        }
        $("#" + pageID).find('#SRoomValue').selectmenu("enable").selectmenu("refresh");
        $("#" + pageID).find('#SRoomValue').selectmenu("refresh");
    }
    catch (e) {
    }
}

function BindStcity(data) {
    try {
        if (data !== '') {
            var pageID = $.mobile.activePage.attr("id");
            $("#" + pageID).find('#SStCityValue').text(data[0]);
            $("#" + pageID).find('#SStCityValue').attr("data-value", data[1]);
            $("#" + pageID).find('#SBuildingValue').text(data[2]);
            $("#" + pageID).find('#SBuildingValue').attr("data-value", data[3]);
            $("#" + pageID).find('#HiddenBuildingCurrency').text(data[4]);
            $("#" + pageID).find('#HiddenBuildingCurrency').attr("data-value", data[4]);

            SetPropertyIDHomeButtonVisiblity();
            SpopulateFloorDropDown(data[1], data[3]);
        }
        else {
            showError(GetCommonTranslatedValue("LocationNotFound"));
            ////showError(GetTranslatedValue("AddTheRating"));
        }
    }
    catch (e) {
    }
}

function SetPropertyIDHomeButtonVisiblity() {

    var pageID = $.mobile.activePage.attr('id');
    if (($("#" + pageID).find("#SStCityValue").attr("data-value") != "-1" || $("#" + pageID).find("#SStCityValue").attr("data-value") === "undefined") && ($("#" + pageID).find("#SBuildingValue").attr("data-value") != "-1") || $("#" + pageID).find("#SBuildingValue").attr("data-value") === "undefined") {
        // $("#" + pageID).find("#setLocLocal").hide();
    }
}

function BindStcityLocal(ts, results, flag) {
    var pageID = $.mobile.activePage.attr('id');
    try {
        var data = [];
        if (results.rows.length == 1) {
            if (flag === 'true' || flag === true) {
                $("#" + pageID).find("#setLocLocal").show();
            }

            var option = document.createElement('option');
            option.setAttribute("value", results.rows.item(0).PropertyID + '|' + results.rows.item(0).RegionID + '|' + results.rows.item(0).RegionText + '|' + results.rows.item(0).CurrencyCode);
            option.innerHTML = results.rows.item(0).PropertyText;
            $("#" + pageID).find("#SPidTextBox").val(results.rows.item(0).PropertyText);
            $("#" + pageID).find("#SPidDDL").append(option);
            $("#" + pageID).find("#SPidDDL").val(results.rows.item(0).PropertyID + '|' + results.rows.item(0).RegionID + '|' + results.rows.item(0).RegionText + '|' + results.rows.item(0).CurrencyCode);
            $("#" + pageID).find("#SPidDDL").selectmenu("refresh");

            data[0] = results.rows.item(0).RegionText;
            data[1] = results.rows.item(0).RegionID;
            data[2] = results.rows.item(0).PropertyText;
            data[3] = results.rows.item(0).PropertyID;
            data[4] = results.rows.item(0).CurrencyCode;

            BindStcity(data);
        }
        else {
            ////showError($("#" + pageID).find("#HTErrorNoLocation").val());
        }
    }
    catch (e) {
    }
}

//=====To get the GetState-City/BuildingData=======
function GetStCity(tag) {
    try {
        var pageID = $.mobile.activePage.attr('id');
        var enteredProperty = $.trim($("#" + pageID).find("#SPidTextBox").val());
        if (enteredProperty.length !== 0) {
            openDB();
            dB.transaction(function (tx) {
                tx.executeSql("SELECT RegionID, RegionText, PropertyID, PropertyText,TCC_Project_Number  FROM PropertyTable WHERE TCC_Project_Number = ? COLLATE NOCASE", [enteredProperty], function (ts, result) { BindStcityLocal(ts, result, true); }, function (e, m, s) { log(e.status); });
            });
        }
        else {
            return;
        }
    }
    catch (e) {
    }
}

function BindRoomDDL() {
    try {
        var pageID = $.mobile.activePage.attr("id");
        var cityValue = $("#" + pageID).find('#SStCityValue').attr("data-value");
        var buildingValue = $("#" + pageID).find('#SBuildingValue').attr("data-value");
        var selectedFloor = $("#" + pageID).find('#SFloorValue option:selected').val();
        if (selectedFloor == "-1") {
            $("#" + pageID).find('#SRoomValue option:gt(0)').remove();
            $("#" + pageID).find('#SRoomValue').selectmenu("refresh");
            $("#" + pageID).find("#SRoomValue").selectmenu("disable");
            return;
        }

        data = { cityDropDownValue: cityValue, buildingDropDownValue: buildingValue, floorDropDownValue: selectedFloor };
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT RoomID, RoomText FROM RoomTable WHERE PropertyID = ? and FloorID = ? and RegionID = ?", [buildingValue, selectedFloor, cityValue], BindRoomLocal, function (e, m, s) { });
        });
    }
    catch (e) {
    }
}

function BindDateTime() {
    try {

        // We also need to load the Est Cost and Matrix if this is a Matrix based load. 
        var pdaSearchNTEConfig = getLocal("iMFM_FetchNTEConfig");
        if (pdaSearchNTEConfig == 1) {
            GetGroupSubgroupData();
        }

        if ($('#ddlAssignmentType').val() == 'Current User') {
            AddLaborPopupOpen();
            return;
        }       
    }
    catch (e) {
    }
}

function SpopulateFloorDropDown(stCityValue, buildingValue) {
    try {
        var data = { cityDropDownValue: stCityValue, buildingDropDownValue: buildingValue };
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT FloorID, FloorText FROM FloorTable WHERE PropertyID = ? and RegionID = ? ORDER BY FloorID", [buildingValue, stCityValue], BindFloorLocal, function (e, m, s) { });
        });
    }
    catch (e) {
    }
}

function ResetPdaSearch() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID).find("input").val('');
}

function FillPropertyDetailsSearch(value) {
    var pageID = $.mobile.activePage.attr('id');
    if (value != -1) {
        $("#" + pageID).find("#setLocLocal").show();
        var valueArray = value.split('|');
        var data = [];
        data[0] = valueArray[2];
        data[1] = valueArray[1];
        data[2] = $("#" + pageID).find("#SPidDDL option:selected").html();
        data[3] = valueArray[0];
        data[4] = valueArray[3];
        BindStcity(data);
    }
}

function BindPidDropDown(ts, result) {
    var optiontag;
    var item;
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#setLocLocal").hide();
    $("#" + pageID).find("#SPidDDL option:gt(0)").remove();
    $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
    $("#" + pageID).find("#SFloorValue option:gt(0)").remove();
    $("#" + pageID).find("#SFloorValue").selectmenu("refresh");
    $("#" + pageID).find("#SRoomValue option:gt(0)").remove();
    $("#" + pageID).find("#SRoomValue").selectmenu("refresh");
    $("#" + pageID).find("#SStCityValue").html('');
    $("#" + pageID).find("#SStCityValue").attr('data-value', '-1');
    $("#" + pageID).find("#SBuildingValue").html('');
    $("#" + pageID).find("#SBuildingValue").attr('data-value', '-1');

    if (result.rows.length === 0) {
        var option = '<option value="-2">' + GetCommonTranslatedValue("LocationNotFound") + '</option>';
        $("#" + pageID).find("#SPidDDL").append(option);
        $("#" + pageID).find("#SPidDDL").val("-2");
        $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
        $("#" + pageID).find("#SFloorValue").selectmenu("disable");
        $("#" + pageID).find("#SRoomValue").selectmenu("disable");
        if (localStorage.getItem("ScreenName") == "OrderSearch" || localStorage.getItem("ScreenName") == "VendorSearch") {
            $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('AllLabel'));
            $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('AllLabel'));
        }
        return false;
    }
    if (result.rows.length == 1) {
        item = result.rows.item(0);
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText + '|' + item.CurrencyCode);
        optiontag.innerHTML = item.PropertyText;
        $("#" + pageID).find("#SPidDDL").append(optiontag);
        $("#" + pageID).find("#SPidDDL").val(item.PropertyID + '|' + item.RegionID + '|' + item.RegionText + '|' + item.CurrencyCode);
        $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
        FillPropertyDetailsSearch($("#" + pageID).find("#SPidDDL").val());
        return false;
    }
    if (result.rows.length > 1) {
        if (localStorage.getItem("ScreenName") == "OrderSearch" || localStorage.getItem("ScreenName") == "VendorSearch") {
            $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('AllLabel'));
            $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('AllLabel'));
        }
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", "-3");
        optiontag.innerHTML = "-- [ " + result.rows.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $("#" + pageID).find("#SPidDDL").append(optiontag);
        for (i = 0; i < result.rows.length; i++) {
            item = result.rows.item(i);
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText + '|' + item.CurrencyCode);
            optiontag.innerHTML = item.PropertyText;
            $("#" + pageID).find("#SPidDDL").append(optiontag);
        }
        $("#" + pageID).find("#SPidDDL").val("-3");
    }
    $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
}

function BindPidDDL(value) {
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#setLocLocal").hide();
    $("#" + pageID).find("#SPidDDL option:gt(0)").remove();
    $("#" + pageID).find("#SPidDDL").selectmenu("refresh");
    $("#" + pageID).find("#SFloorValue option:gt(0)").remove();
    $("#" + pageID).find("#SFloorValue").selectmenu("refresh");
    $("#" + pageID).find("#SRoomValue option:gt(0)").remove();
    $("#" + pageID).find("#SRoomValue").selectmenu("refresh");
    $("#" + pageID).find("#SStCityValue").html('');
    $("#" + pageID).find("#SStCityValue").attr('data-value', '-1');
    $("#" + pageID).find("#SBuildingValue").html('');
    $("#" + pageID).find("#SBuildingValue").attr('data-value', '-1');
    if (localStorage.getItem("ScreenName") == "OrderSearch" || localStorage.getItem("ScreenName") == "VendorSearch") {
        $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('AllLabel'));
        $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('AllLabel'));
    }
    if (value.length >= 3) {
        // Handled security error.
        var newValue;
        newValue = securityError($("#SPidTextBox"));
        if (newValue == "") {
            return false;
        }
        value = newValue;

        openDB();
        dB.transaction(function (ts) {
            ts.executeSql('SELECT PropertyID, RegionID, PropertyText,RegionText, CurrencyCode FROM PropertyTable WHERE TCC_Project_Number like ? or PropertyText like ? or RegionText like ? or AltKey like ? LIMIT 50 COLLATE NOCASE', ['%' + value + '%', '%' + value + '%', '%' + value + '%', '%' + value + '%'], BindPidDropDown, function (tx, error) {
            });
        });
    }
    else {
        $("#" + pageID).find("#SFloorValue").selectmenu("disable");
        $("#" + pageID).find("#SRoomValue").selectmenu("disable");
        return false;
    }
}

function BindVendorDDL(value) {
    var pageID = $.mobile.activePage.attr("id");


    if (value.length >= 3) {
        var jsonObject = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "Username": decryptStr(localStorage.getItem("Username")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
            "SearchString": value,
            "SessionID": decryptStr(getLocal("SessionID"))
        };

        var targetURL = standardAddress + "VendorSearch.ashx?method=GetVendorAutocomplete";
        if (navigator.onLine) {
            BuildVendorDropDown(jsonObject, targetURL);
        } else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else {
        return false;
    }
}

function BuildVendorDropDown(jsonObject, targetURL) {
    $.postJSON(targetURL, jsonObject, function (result) {
        var optiontag;
        var item;
        var pageID = $.mobile.activePage.attr("id");
        var ddlName;

        if (pageID == "ActionsPopup") {
            ddlName = "#ReassignAssignmentPickDDL";
        } else {
            ddlName = "#ddlAssignment";
        }

        $("#" + pageID).find(ddlName + " option:gt(0)").remove();
        $("#" + pageID).find(ddlName).selectmenu("enable");
        $("#" + pageID).find(ddlName).selectmenu("refresh");

        if (result.length === 0) {
            var option = '<option value="-2">' + GetTranslatedValue("VendorNotFound") + '</option>';
            $("#" + pageID).find(ddlName).append(option);
            $("#" + pageID).find(ddlName).val("-2");
            $("#" + pageID).find(ddlName).selectmenu("disable");
            $("#" + pageID).find(ddlName).selectmenu("refresh");

            if (pageID == "ActionsPopup") {
                $("#NoAssignments").show();
            }

            return false;
        }
        if (result.length == 1) {
            item = result[0];
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", item.AssignmentID);
            optiontag.innerHTML = item.AssignmentText;
            $("#" + pageID).find(ddlName).append(optiontag);
            $("#" + pageID).find(ddlName).val(item.AssignmentID);
            $("#" + pageID).find(ddlName).selectmenu("refresh");

            if (pageID == "ActionsPopup") {
                $("#NoAssignments").hide();
            }

            return false;
        }
        if (result.length > 1) {
            $("#" + pageID).find(ddlName).empty();
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", "-3");
            optiontag.innerHTML = "-- [ " + result.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            $("#" + pageID).find(ddlName).append(optiontag);
            for (i = 0; i < result.length; i++) {
                item = result[i];
                optiontag = document.createElement('option');
                optiontag.setAttribute("value", item.AssignmentID);
                optiontag.innerHTML = item.AssignmentText;
                $("#" + pageID).find(ddlName).append(optiontag);
            }
            $("#" + pageID).find(ddlName).val("-3");
        }
        $("#" + pageID).find(ddlName).selectmenu("refresh");
        $("#" + pageID).find(ddlName).selectmenu("enable");

        if (pageID == "ActionsPopup") {
            $("#NoAssignments").hide();
        }
    });
}

////function PopulateWOSortByDDl(data) {
////    try {
////        var selected;
////        $("#SSortDDL").empty();
////        for (i = 0; i < data.length; i++) {
////            var tag = document.createElement('option');
////            tag.setAttribute("value", data[i].Value);
////            tag.innerHTML = data[i].Text;
////            if (data[i].Selected === true) {
////                selected = data[i].Value;
////            }
////            $("#SSortDDL").append(tag);
////        }
////        $("#SSortDDL").val(selected).selectmenu("refresh");
////        $("#SRoomValue").selectmenu("disable").selectmenu("refresh");
////        $("#LocDiv").show();
////    }
////    catch (e) {        
////    }
////}

//function HideUl(tag) {
//    try {
//        var pageID = tag.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id;
//        $("#" + pageID).find("#CompletionDiv,#LocationDiv,#CategoryDiv,#DateBlockDiv,#SortByDiv").show();
//        if ($(tag).val().length > 0) {
//            $("#" + pageID).find("#CompletionDiv,#LocationDiv,#CategoryDiv,#DateBlockDiv,#SortByDiv").hide();
//        }
//    }
//    catch (e) {        
//    }
//}

////function TranslationData(result) {
////    try {
////        $("#SWONumberLabel").text(result.WONumberLabel);
////        $("#SCompletionLabel").text(result.CompletionLabel);
////        $("#OSPidLabel").text(result.LocationAreaSectionLabel);
////        $("#SCategoryLabel").text(result.CategoryLabel);
////        $("#DateSearchLabel .ui-btn-inner .ui-btn-text").html(result.DateSearchChkLabel);
////        $("#FromLabel").text(result.FromLabel);
////        $("#ToLabel").text(result.ToLabel);
////        $("#SortByLabel").text(result.SortByLabel);
////        $("#BottomSearch span span").text(result.BottomSearch);
////        $("#BottomReset span span").text(result.BottomReset);
////    }
////    catch (e) {        
////    }
////}

////function PopulateCategoryDDL(data) {
////    try {        
////        $("#OrderSearch").find("#SCategoryDDL").empty();
////        var tag = document.createElement('option');
////        tag.setAttribute("value", 0);
////        tag.innerHTML = "--Select--";
////        $("#OrderSearch").find("#SCategoryDDL").append(tag);
////        for (i = 0; i < data.length; i++) {
////            tag = document.createElement('option');
////            tag.setAttribute("value", data[i].EquipGroupNumber);
////            tag.innerHTML = data[i].Description;
////            $("#OrderSearch").find("#SCategoryDDL").append(tag);
////        }
////        $("#OrderSearch").find("#SCategoryDDL").selectmenu("refresh");
////    }
////    catch (e) {        
////    }
////}

////function HideDate() {
////    try {
////        if ($("#OrderSearch").find("#DateSearchChk").is(":checked")) {
////            $("#OrderSearch").find("#DateSearchDiv").show();
////        }
////        else {
////            $("#OrderSearch").find("#DateSearchDiv").hide();
////        }
////    }
////    catch (e) {       
////    }
////}

////function PopulateCompletionDDl(data) {
////    try {
////        var selected;
////        $("#SCompletionDDL").empty();
////        for (i = 0; i < data.length; i++) {
////            var tag = document.createElement('option');
////            tag.setAttribute("value", data[i].Value);
////            tag.innerHTML = data[i].Text;
////            if (data[i].Selected === true) {
////                selected = data[i].Value;
////            }
////            $("#SCompletionDDL").append(tag);
////        }
////        $("#SCompletionDDL").val(selected).selectmenu("refresh");
////    }
////    catch (e) {
////        log(e);
////    }
////}

////function PopulateDataDDL(data) {
////    try {        
////        $("#DSDateDDL").empty();
////        for (i = 0; i < data.length; i++) {
////            var tag = document.createElement('option');
////            tag.setAttribute("value", data[i].Value);
////            tag.innerHTML = data[i].Text;
////            $("#DSDateDDL").append(tag);
////        }
////        $("#DSDateDDL").selectmenu("refresh");
////    }
////    catch (e) {        
////    }
////}

////function PopulateDDL(result) {
////    try {
////        PopulateCategoryDDL(result.Category);
////        PopulateCompletionDDl(result.CompletionDDL);
////        PopulateWOSortByDDl(result.WOSortByDDL);
////        PopulateDataDDL(result.Date);
////    }
////    catch (e) {        
////    }
////}


