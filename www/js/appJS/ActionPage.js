/// <summary>
/// Method to set DateTime.
/// </summary>
/// <param name="id">holds the value of the page id.</param>
function SetDateTime(id) {
    try {
        var ctrlId = "#" + id;
        nd = new Date();
        var param2 = GetCultureDateTime(nd);
        $(ctrlId).val(param2);
    }
    catch (e) {
    }
}

/// <summary>
/// Method to set DateTime when the user is online.
/// </summary>
/// <param name="id">holds the value of the page id.</param>
/// <param name="datetime">holds the value of datetime of current place.</param>
function SetOnlineTime(id, datetime) {
    try {
        var param1 = new Date(datetime);
        var date = strPad(param1.getDate(), 2);
        var month = strPad(param1.getMonth() + 1, 2);
        var year = param1.getFullYear();
        var hours = strPad(param1.getHours(), 2);
        var minutes = strPad(param1.getMinutes(), 2);
        var amPm = "";
        if (hours > 12) {
            amPm = GetCommonTranslatedValue("PMLabel");
        }
        else {
            amPm = GetCommonTranslatedValue("AMLabel");
        }
        var param2 = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
        $("#" + id).val(param2);
    }
    catch (e) {
    }
}

/// <summary>
/// Method to set DateTime when the user is offline.
/// </summary>
/// <param name="id">holds the value of the page id.</param>
function SetOfflineTime(id) {
    $("#" + id).val(GetcurrentDateTime());
}

/// <summary>
/// Method to set the site datetime and time zone.
/// </summary>
/// <param name="id">holds the value of the page id.</param>
function SetSiteTZDateTime(id) {
    try {
        var ctrlId = "#" + id;

        var offset = getLocal("SiteTZ").split('/')[0];
        var trueorFalse = getLocal("SiteTZ").split('/')[1];
        if (offset < 0 && (trueorFalse == 'true' || trueorFalse == 'True')) {
            offset = parseFloat(offset) + 1;
        }

        // create Date object for current location
        d = new Date();

        // convert to msec
        // add local time zone offset 
        // get UTC time in msec
        utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        nd = new Date(utc + (3600000 * offset));
        // return time as a string

        //return "The local time in " + city + " is " + nd.toLocaleString();

        var param2 = GetCultureDateTime(nd);

        $(ctrlId).val(param2);
    }
    catch (e) {
    }
}

/// <summary>
/// Method to fetch the datetime.
/// </summary>
function GetDateTime1() {
    try {
        //For Complete Link DateTextField
        var nd = new Date();
        var param2 = GetCultureDateTime(nd);
        return param2;
    }
    catch (e) {
    }
}

/// <summary>
/// Method to fetch the current datetime.
/// </summary>
function GetcurrentDateTime() {
    try {
        var param1 = new Date();
        var date = strPad(param1.getDate(), 2);
        var month = strPad(param1.getMonth() + 1, 2);
        var year = param1.getFullYear();
        var hours = strPad(param1.getHours(), 2);
        var minutes = strPad(param1.getMinutes(), 2);
        var amPm = "";
        if (hours > 12) {
            amPm = GetCommonTranslatedValue("PMLabel");
        }
        else {
            amPm = GetCommonTranslatedValue("AMLabel");
        }
        var param2 = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
        return param2;
    }
    catch (e) {
    }
}

/// <summary>
/// Method to get current datetime.
/// </summary>
/// <param name="nd">holds the value of date and time.</param>
function GetCultureDateTime(nd) {
    try {
        var param1 = nd;
        var date = strPad(param1.getDate(), 2);
        var month = strPad(param1.getMonth() + 1, 2);
        var year = param1.getFullYear();
        var hours = strPad(param1.getHours(), 2);
        var minutes = strPad(param1.getMinutes(), 2);
        var amPm = "";
        if (hours > 12) {
            amPm = GetCommonTranslatedValue("PMLabel");
        }
        else {
            amPm = GetCommonTranslatedValue("AMLabel");
        }
        var param2 = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
        return param2;
    }
    catch (e) {
        log(e);
    }
}

/// <summary>
/// Method to enable padding of specific no of digits.
/// </summary>
/// <param name="i">holds the specified no of digits.</param>
function strPad(i, l) {
    try {
        var o = i.toString();
        var s = '0';
        while (o.length < l) {
            o = s + o;
        }
        return o;
    }
    catch (e) {
        log(e);
    }
}

/// <summary>
/// Method to close the pop page.
/// </summary>
function CloseActionPopup() {
    switch (getLocal("RequestedAction")) {
        case "AddComment": if (getLocal("logpage") == "true") { setLocal("logpage", "false"); $.mobile.changePage("LogPage.html"); } break;
        case "ConditionAssessment":
        case "EditAsset":
            //$.mobile.changePage("AssetDashboard.html"); break;
        case "AddAttachment_Tag": $.mobile.changePage("AssetDashboard.html"); break;
        case "UpdateSteps":
            break;
        default: $.mobile.changePage("WorkOrderDetails.html"); break;
    }
}

function closeAndFetchWorkorder() {
    var myJSONobject = {
        DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
        Language: localStorage.getItem("Language"),
        //Username: decryptStr(localStorage.getItem("Username")),
        EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
        WorkOrdernumber: localStorage.getItem("WorkOrderNumber"),
        SessionID: decryptStr(getLocal("SessionID"))
    };
    var orderDetailsURL = standardAddress + "IMFMOrder.ashx?methodname=LoadWorkOrderDetails";
    if (navigator.onLine) {
        $.postWODetailsJSON(orderDetailsURL, myJSONobject, function (data) {
            if (data.DetWONumberVal !== null) {
                createWorkOrderFlag = true;
                newWorkOrderData = data;
                localStorage.setItem("WorkOrderNumber", data.DetWONumberVal);
                CloseActionPopup();
            }
        });
    }
}
/// <summary>
/// Method to call back the result set of an action.
/// </summary>
/// <param name="jsonResult">holds the value of result set.</param>
function ActionCallBack(jsonResult) {
    if (jsonResult.DetWONumberVal != null && jsonResult.DetWONumberVal != "undefined") {
        createWorkOrderFlag = true;
        newWorkOrderData = jsonResult;
        localStorage.setItem("WorkOrderNumber", jsonResult.DetWONumberVal);
        CloseActionPopup();
    }
    else if (jsonResult.Result === true || jsonResult.Result === "true") {
        if (jsonResult.Data.length !== 0) {
            $("#AlertMessageText").html(jsonResult.Data);
            setTimeout(function () {
                $("#AlertMessage").popup().popup("open");
            }, 650);
            return;
        }
        CloseActionPopup();
    }
    else {
        setTimeout(function () {
            showError(jsonResult.Data);
        }, 650);
    }

    CanvasWidth();
}

/// <summary>
/// Method to check if any pending actions left.
/// </summary>
/// <param name="jsondata">holds the value of result set.</param>
/// <param name="successcalback">holds the value true or false.</param>
function CheckPendingActions(jsondata, successcalback) {
    var SubWONum;
    var query = "SELECT COUNT(*) AS COUNT FROM JSONdataTable WHERE WorkOrderNumber = '" + getLocal("WorkOrderNumber") + "'";
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, [], function (ts, result) {
            var count = result.rows.item(0).COUNT;
            if (count === 0) {
                var arrayData = [];
                arrayData.push(jsondata);
                ActionCallBackClose = ActionCallBack;
                if (successcalback !== undefined) {
                    ActionCallBackClose = successcalback;
                }
                $.postActionJSON(standardAddress + "WorkOrderActions.ashx", { jsondata: JSON.stringify(arrayData) }, function (data) {
                    if (createSubOrderFlag == 1) {
                        if (data.Data.length !== 0) {
                            SubWONum = GetCommonTranslatedValue("SubWOSuccess").replace('[SUB]', data.Data);
                            $('#SubOrderSuccessMsg').text('');
                            $('#SubOrderSuccessMsg').text(SubWONum);
                            closeActionPopupLoading();
                            // Timeout needs to be longer than closeActionPopup, otherwise this will not show.
                            $("#WOCreateSubSuccessPopup").popup().popup("open");
                            // Clear the fallback
                            clearTimeout(fallback);
                            // Fallback in case the browser doesn't fire a load event
                            var fallback = setTimeout(function () {
                                $("#WOCreateSubSuccessPopup").popup().popup("open");
                            }, 2000);
                            ////                            setTimeout(function () {
                            ////                                $('#WOCreateSubSuccessPopup').attr("style", "display:block");
                            ////                                $('#WOCreateSubSuccessPopup').popup().popup('open');
                            ////                            }, 650);
                            createSubOrderFlag = 0;
                        }
                        else {
                            SubWONum = GetCommonTranslatedValue("SubWOFail");
                            $('#SubOrderSuccessMsg').text('');
                            $('#SubOrderSuccessMsg').text(SubWONum);
                            closeActionPopupLoading();
                            //setTimeout(function () {
                                //$('#WOCreateSubSuccessPopup').attr("style", "display:block");
                            $('#WOCreateSubSuccessPopup').popup().popup('open');
                            clearTimeout(fallback);
                            var fallback = setTimeout(function () {
                                $("#WOCreateSubSuccessPopup").popup().popup("open");
                            }, 2000);
                            //}, 500);
                            createSubOrderFlag = 0;
                        }
                    }
                    else {
                        localStorage.setItem("PdaSearchComplete", data.PdaSearch);
                        closeActionPopupLoading();
                        setTimeout(function () {
                            ActionCallBackClose(data);
                        }, 1000);
                    }
                });
            }
            else {
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("ActionsNotSyncedMessage"));
                }, 1000);
            }
        });
    });
}

/// <summary>
/// Method to Store Offline data to LocalDB.
/// </summary>
/// <param name="jsonData">holds the value of result set.</param>
function StoreActionLocal(jsonData) {
    try {
        var data = [];
        openDB();
        dB.transaction(function (ts) {
            var rowidquery = "SELECT COUNT(*) as ROWID FROM JSONdataTable";
            ts.executeSql(rowidquery, [], function (ts, rowresult) {
                var rowID = 0;
                if (rowresult.rows.length !== 0) {
                    rowID = rowresult.rows.item(0).ROWID;
                }
                data.push(rowID + 1);
                data.push(jsonData.WONumber);
                var query1 = "SELECT MAX(SequenceNumber) as SequenceNumber FROM JSONdataTable WHERE WorkOrderNumber = '" + jsonData.WONumber + "'";
                ts.executeSql(query1, [], function (ts, result) {
                    if (result.rows.length > 0) {
                        var row = result.rows.item(0);
                        var num = row.SequenceNumber;
                        var query = 'INSERT INTO JSONdataTable (ROW,WorkOrderNumber, SequenceNumber, urlID, jsondata) VALUES (?,?,?,?,?)';
                        data.push(num + 1);
                        data.push(2);
                        if (typeof (jsonData) == 'object') {
                            data.push(JSON.stringify(jsonData));
                        }
                        ts.executeSql(query, data, function () {
                            $.mobile.loading("hide");
                            $("#WillbeprocessedonsyncDiv").popup().popup("open");
                        }, function () {
                            ////alert("Error");
                        });
                    }
                }, function () { });
            }, function (ts, e) { log(e); });
        });
    }
    catch (e) {
        log(e);
    }
}

/// <summary>
/// Method to load the assignment details for the reassign action.
/// </summary>
/// <param name="ddl"> holds the value of assignment type.</param>
function LoadAssignmentPickDDL(ddl) {
    try {

        localStorage.setItem("PdaSearchComplete", "Begin");
        $("#NoAssignments").hide();
        $("#AssignmentPickDIV").show();
        $("#ReassignAssignmentPickDDL").selectmenu("enable");
        $("#ReassignAssignmentPickDDL option:gt(0)").remove();
        $('#AssignmentPickDIV').addClass('ui-screen-hidden');
        SecurityForVendorSearch("Reassign_VendorSearch", 1);

        if ($('#' + ddl.id).val() != "-1") {
            var selectAssignmentQuery = "SELECT * FROM AssignmentTable WHERE AssignmentTypeID = '" + $('#' + ddl.id).val() + "'";
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql(selectAssignmentQuery, [], function (te, result) {
                    var item;
                    for (var i = 0; i < result.rows.length; i++) {
                        item = result.rows.item(i);
                        $("#ReassignAssignmentPickDDL").append("<option value='" + item.AssignmentID + "'>" + item.AssignmentText + "</option>");
                    }
                    $("#ReassignAssignmentPickDDL").selectmenu("refresh");

                    if (result.rows.length === 0) {
                        $("#ReassignAssignmentPickDDL").selectmenu("disable");
                        ////$("#NoAssignments").show();
                    }

                    if (result.rows.length == 1) {
                        $("#ReassignAssignmentPickDDL").val(item.AssignmentID);
                        $("#AssignmentPickDIV").hide();
                    }

                    if (result.rows.length > 0) {
                        $('#AssignmentPickDIV').removeClass('ui-screen-hidden');
                    }
                });
            });
        } else {
            $("#NoAssignments").hide();
            $("#AssignmentPickDIV").hide();
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to fill the comment details to the comment control.
/// </summary>
function PopulateCommentDDL() {
    try {
        var pageID = $.mobile.activePage.attr('id');
        actionID = getLocal("RequestedAction");
        var selectCommentQuery = 'SELECT DISTINCT(Comments) FROM ActionCommentsTable WHERE actionName LIKE ?';
        var aID = null;
        var actionArray = [];
        actionArray.push("%" + actionID);
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(selectCommentQuery, actionArray, function (ts, result) {
                if (decryptStr(result.rows.length) > 1) {
                    FillCommentDropDown(result);
                }
            }, function (ts, e) { showError(e.message); });
        });
    }
    catch (e) {
    }
}

/// <summary>
/// Method to fill the comment details to the comment control.
/// </summary>
/// <param name="result">holds the details of comment control.</param>
function FillCommentDDl(result) {
    try {
        $("#AddCommentDDL option:gt(0)").remove();
        for (var i = 0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            var option = '<option>' + item.Comments + '</option>';
            $("#AddCommentDDL").append(option);
        }
        $("#" + actionID).selectmenu("refresh");
    }
    catch (e) {
    }
}

/// <summary>
/// Method to post Estimated time of arrival.
/// </summary>
function PostETA() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        if ($("#WOActionETADateTime").val().length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("ETADateTimeRequiredMessage"));
            }, 1000);
            return false;
        }
        var jsondata = {
            Date: $.trim($("#WOActionETADateTime").val()),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'ETA',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            UpDateWorkOrderDetailsTable("DEA");
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to create sub orders.
/// </summary>
function CreateSubOrder() {
    try {
        $('#createSubData').text('');
        $('#WOCreateSubPopup').popup('close');
        setTimeout(function () {
            showActionPopupLoading();
        }, 500);
        createSubOrderFlag = 1;
        var jsondata = {
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'SUB',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            FeatureList: getLocal("featuresListAll"),
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to update the work order details.
/// </summary>
/// <param name="status">holds the details of the work order.</param>
function UpDateWorkOrderDetailsTable(status) {
    var query = 'UPDATE WorkOrderDetailsTable SET Status = ?, StatusDesc = ? WHERE WorkOrderNumber = ?';
    var values = [];
    values.push(encryptStr(status));
    values.push('');
    values.push($.trim(getLocal("WorkOrderNumber")));
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, values, null, function () { alert(GetTranslatedValue("ErrorMessage")); });
    });
}


/**
* Remove a specified work order from the offline database.
* @param [string] workOrderNumber - The work order to remove from the offline DB.
*/
function RemoveWorkOrderFromDetailsTable(workOrderNumber) {
    var query = 'DELETE FROM WorkOrderDetailsTable WHERE WorkOrderNumber = ?';
    var values = [];
    values.push($.trim(workOrderNumber));
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, values, null, function () { alert(GetTranslatedValue("ErrorMessage")); });
    });
}

/// <summary>
/// Method to post Enrouting.
/// </summary>
function PostEnroute() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        if ($("#WOActionEnrouteDateTime").val().length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("DateRequiredMessage"));
            }, 1000);
            return false;
        }
        var jsondata = {
            Date: $.trim($("#WOActionEnrouteDateTime").val()),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'Enroute',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };
        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            UpDateWorkOrderDetailsTable("DEN");
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to post add comment.
/// </summary>
function PostAddComment() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        if ($.trim($("#AddCommentLabelTA").val()).length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("CommentsValidationMessage"));
            }, 1000);
            return;
        }
        var jsondata = {
            Date: GetDateTime1(),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'AddComment',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            FeatureList: getLocal("featuresListAll"),
            SessionID: decryptStr(getLocal("SessionID"))
        };
        if (navigator.onLine) {
            setLocal("logpage", "true");
            CheckPendingActions(jsondata);
        }
        else {
            StoreActionLocal(jsondata);
        }
    } catch (e) {
    }
}

/// <summary>
/// Method to post details on arrival.
/// </summary>
function PostArrived() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        if ($("#ArrivedDate").val().length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("DateRequiredMessage"));
            }, 1000);
            return false;
        }
        var jsondata = {
            Date: $.trim($("#ArrivedDate").val()),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'Arrived',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };
        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            UpDateWorkOrderDetailsTable("DAR");
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to post the cancelation workorder.
/// </summary>
function PostCancel() {
    var secAddComntsLbl = '';
    if ($("#AddCommentLabelTA").val() !== "") {
        secAddComntsLbl = securityError($("#AddCommentLabelTA"));
        $('#AddCommentLabelTA').val(secAddComntsLbl);
    }
    var pageID = $.mobile.activePage.attr('id');
    if ($("#AddCommentLabelTA").val().length === 0) {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(GetTranslatedValue("CommentsValidationMessage"));
        }, 1000);
        return;
    }

    var jsondata = {
        Comment: secAddComntsLbl, //$("#AddCommentLabelTA").val(),
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        RequestedAction: 'Cancel',
        WONumber: $.trim(getLocal("WorkOrderNumber")),
        KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
        DateModified: $.trim(getLocal("DateModified")),
        GPSLocation: GlobalLat + "," + GlobalLong,
        SessionID: decryptStr(getLocal("SessionID"))
    };
    if (navigator.onLine) {
        CheckPendingActions(jsondata);
    }
    else {
        UpDateWorkOrderDetailsTable("CAN");
        StoreActionLocal(jsondata);
    }
}

/// <summary>
/// Method to post the reassignment of workorder.
/// </summary>
function PostReassign() {

    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        if (!navigator.onLine) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
            }, 1000);
            return false;
        }

        if ($.trim($("#ReassignAssignTypeDDL option:selected").val()) == -1) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("AssignmentTypeRequiredMessage"));
            }, 1000);
            return false;
        }

        if ($.trim($("#ReassignAssignmentPickDDL option:selected").val()) == -1) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("AssignmentRequiredMessage"));
            }, 1000);
            return false;
        }

        var jsondata = {
            AssignType: $.trim($("#ReassignAssignTypeDDL option:selected").val()),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            AssignTypeText: $.trim($("#ReassignAssignTypeDDL option:selected").text()),
            AssignmentPick: $.trim($("#ReassignAssignmentPickDDL option:selected").val()),
            AssignmentPickText: $.trim($("#ReassignAssignmentPickDDL option:selected").text()),
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            RequestedAction: 'Reassign',
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            PdaSearchComplete: localStorage.getItem("PdaSearchComplete"),
            AssignmentOptionsCount: $("#ReassignAssignmentPickDDL").find('option:not(:first)').length,
            IncludeAttachments: $('[data-field="Include_Attachments"] .js-Token').is(":checked"),
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };
        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to save the Start action details.
/// </summary>
function PostStart() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        var pattern = /^[^<>]*$/;
        //var isSpecialChar = pattern.test($.trim($("#AddCommentLabelTA").val()));
        var isSpecialChar = pattern.test(secAddComntsLbl);
        if (!isSpecialChar) {
            $("#AddCommentLabelTA").focus();
            closeActionPopupLoading();
            return;
        }

        var startDate = $.trim($("#startLinkDate").val());
        if (startDate === '' && startDate.length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("DateValidationMessage"));
            }, 1000);
            return;
        }

        var jsondata = {
            RequestedAction: "Start",
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Date: startDate,
            Comment: secAddComntsLbl, //$.trim($("#AddCommentLabelTA").val()),
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            UpDateWorkOrderDetailsTable("DST");
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to Stop Toggle Functionality.
/// </summary>
function StopToggleAction() {
    try {
        var stopToggleValue = $.trim($('#stopToggleDropDown').val());
        $("#Complete").addClass("ui-screen-hidden");
        $("#AddCommentSubmitButton").html($("#stopButoon").html());
        if (stopToggleValue == "1") {
            if (getLocal("IsInspectionPending") == "true" && navigator.onLine) {
                showError(GetTranslatedValue("InspectionPendingMessage"));
                return false;
            }
            $("#Complete").removeClass("ui-screen-hidden");
            $("#signature1").empty();
            var CanWidth = $("#signature1").width();
            $("#signature1").jSignature({ color: "#000000", "background-color": "#ffffff", height: 200, width: CanWidth });
            $("#AddCommentSubmitButton").html($("#stopcompletebutton").html());

            if (getLocal('WOLaborHour') != null && getLocal('WOLaborHour') != "undefined") {
                $("#totalLaborValueLabel").html(getLocal('WOLaborHour'));
            }
            else {
                BindLaborHours();
            }

            if (getLocal('WOMaterilaCost') != null && getLocal('WOMaterilaCost') != "undefined") {
                $("#totalMaterialValueLabel").append(getLocal('WOMaterilaCost') + ' ' + getLocal('CASCurrencyCode'));
            }
            else {
                BindMaterialTotal();
            }
        }
    }
    catch (e) {
    }
}

/// <summary>
/// Method to set the width of canvas.
/// </summary>
function CanvasWidth() {
    $("#signature1").empty();
    var CanWidth = $("#signature1").width();
    $("#signature1").jSignature({ color: "#000000", "background-color": "#ffffff", height: 200, width: CanWidth });
}

/// <summary>
/// Method to validate and save.
/// </summary>
function ValidateandSave() {
    try {
        var secAddComntsLbl = '';
        if ($("#AddCommentLabelTA").val() !== "") {
            secAddComntsLbl = securityError($("#AddCommentLabelTA"));
            $('#AddCommentLabelTA').val(secAddComntsLbl);
        }
        var seccompDescTxtArea = '';
        if ($("#compDescTextArea").val() !== "") {
            seccompDescTxtArea = securityError($("#compDescTextArea"));
            $('#compDescTextArea').val(seccompDescTxtArea);
        }
        var secSignedByValue = '';
        if ($("#signedByValue").val() !== "") {
            secSignedByValue = securityError($("#signedByValue"));
            $('#signedByValue').val(secSignedByValue);
        }
        var secLicenseNumVal = '';
        if ($("#licenseNumberValue").val() !== "") {
            secLicenseNumVal = securityError($("#licenseNumberValue"));
            $('#licenseNumberValue').val(secLicenseNumVal);
        }
        var pattern = /^[^<>]*$/;
        var stopToggleValue = $('#stopToggleDropDown').val();
        var stopDate = $.trim($("#stopDate").val());
        var stopCompDate = $.trim($("#compDate").val());
        // var comment = $("#AddCommentLabelTA").val();
        var comment = secAddComntsLbl;
        //var completeDesc = $("#compDescTextArea").val();
        var completeDesc = seccompDescTxtArea;
        //var signedByName = $("#signedByValue").val();
        var signedByName = secSignedByValue;
        //        var licenseNumber = $("#licenseNumberValue").val();
        var licenseNumber = secLicenseNumVal;
        var ResolutionCodeNumber = $("#ActionsPopup #ResolutionCodeDD").val();
        var condition = $("#CompConditionDropDown").val();

        var refrigerantUsed = $("#RefrigerantUsedToggles").val() == 1 ? true : false;
        var leakFound = $("#RefrigerantLeakToggles").val() == 1 ? true : false;
        var refrigerantPartSeq = $("#ActionsPopup #RefrigerantDropDown").val();
        var refrigerantQty = $("#RefrigerantQuantityValue").val();
        var signature = "";
        if (isCanvasblank == true) {
            if ($("#signature1").width() > 0 && $("#signature1").height() > 0) {
                var $sigdiv = $("#signature1");
                $sigdiv.jSignature();  // inits the jSignature widget.
                // Getting signature as SVG and rendering the SVG within the browser. 
                // (!!! inline SVG rendering from IMG element does not work in all browsers !!!)
                // this export plugin returns an array of [mimetype, base64-encoded string of SVG of the signature strokes]
                signature = $sigdiv.jSignature("getData");
                var i = new Image();
                i.src = "data:" + signature[0] + "," + signature[1];
                $(i).appendTo($("#someelement"));  // append the image (SVG) to DOM.     
            }
        }


        if ($('#ActionsPopup #ResolutionCodeDD').is(':visible') && $('#ActionsPopup #ResolutionCodeDD').val() == "-1" && $('#ActionsPopup #ResolutionCodeDD').attr("requried") == "true") {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("EnterResolutionCode"));
            }, 1000);
            CanvasWidth();
            return;
        }

        if (getLocal("RequestedAction") == "Stop") {
            switch (stopToggleValue) {
                case "0":
                    if (stopDate.length === 0) {
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetTranslatedValue("ValidStopDate"));
                        }, 1000);
                        CanvasWidth();
                        return;
                    }
                    break;
                case "1":
                    if (stopDate.length === 0) {
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetTranslatedValue("ValidStopDate"));
                        }, 1000);
                        CanvasWidth();
                        return;
                    }
                    if (stopCompDate.length === 0) {
                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetTranslatedValue("CompletionDateValidationMessage"));
                        }, 1000);
                        CanvasWidth();
                        return;
                    }
                    if (completeDesc.length === 0) {
                        closeActionPopupLoading();
                        setTimeout(function () {
                            // showError("Please enter a Complete descrpiton.");
                            showError(GetTranslatedValue("EnterCompleteDescription"));
                        }, 1000);
                        CanvasWidth();
                        return;
                    }
                    if ($("#ActionsPopup" + " #Signature_Capture").attr("data-Required") == "true" && isCanvasblank == false) {
                        if (signedByName.length === 0) {
                            closeActionPopupLoading();
                            setTimeout(function () {
                                showError(GetTranslatedValue("SignedByRequiredMessage"));
                            }, 1000);
                            CanvasWidth();
                            return;
                        }

                        closeActionPopupLoading();
                        setTimeout(function () {
                            showError(GetTranslatedValue("SignatureRequiredMessage"));
                        }, 1000);
                        CanvasWidth();
                        return;
                    }

                    if ($("#ActionsPopup" + " #LicenseNumber").attr("data-Required") == "true" && isCanvasblank == false) {
                        if (licenseNumber.length === 0) {
                            closeActionPopupLoading();
                            setTimeout(function () {
                                showError(GetTranslatedValue("LicenseRequiredMessage"));
                            }, 1000);
                            CanvasWidth();
                            return;
                        }
                    }
                    break;
                default: break;
            }
        }
        else if (getLocal("RequestedAction") == "Complete") {
            if (stopCompDate.length === 0) {
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("CompletionDateValidationMessage"));
                }, 1000);
                CanvasWidth();
                return;
            }
            if (completeDesc.length === 0) {
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("EnterCompleteDescription"));
                }, 1000);
                CanvasWidth();
                return;
            }
            if ($("#ActionsPopup" + " #Signature_Capture").attr("data-Required") == "true" && isCanvasblank == false) {
                if (signedByName.length === 0) {
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetTranslatedValue("SignedByRequiredMessage"));
                    }, 1000);
                    CanvasWidth();
                    return;
                }

                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("SignatureRequiredMessage"));
                }, 1000);
                CanvasWidth();
                return;
            }

            if ($("#ActionsPopup" + " #LicenseNumber").attr("data-Required") == "true" && isCanvasblank == false) {
                if (licenseNumber.length === 0) {
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetTranslatedValue("LicenseRequiredMessage"));
                    }, 1000);
                    CanvasWidth();
                    return;
                }
            }
        }



        // If Hold is selected, then Only comment is required. Else completion description is required.
        // We use 'completionDescTxt' parameter to send the above values.
        // In server side we will get the required textArea value from 'completionDescTxt' only.
        var descriptionOrCommentText;
        if (stopToggleValue == "0") {
            // descriptionOrCommentText = $('#AddCommentLabelTA').val();
            descriptionOrCommentText = secAddComntsLbl;
        }
        else {
            //            descriptionOrCommentText = $('#compDescTextArea').val();
            descriptionOrCommentText = seccompDescTxtArea;
        }

        var jsondata = {
            RequestedAction: $.trim(getLocal("RequestedAction")),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            Date: stopDate,
            StopDate: stopDate,
            CompletionDate: stopCompDate,
            Comment: comment,
            stopToggleValue: parseInt(stopToggleValue),
            CompletionDescTxt: completeDesc,
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
            DateModified: $.trim(getLocal("DateModified")),
            SignatureObject: signature,
            SignedByName: signedByName,
            LicenseNumber: licenseNumber,
            ResolutionCodeNumber: ResolutionCodeNumber,
            TagNumber: getLocal("TagNumber"),
            Condition: condition,
            RefrigerantUsed: refrigerantUsed,
            RefrigerantLeak: leakFound,
            RefrigerantPartSeq: refrigerantPartSeq,
            RefrigerantQuantity: refrigerantQty,
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            CheckPendingActions(jsondata);
        }
        else {
            switch (stopToggleValue) {
                case "0": UpDateWorkOrderDetailsTable(IsStringNullOrEmpty(getLocal("HoldStatus")) ? "DHD" : getLocal("HoldStatus")); break;
                case "1": UpDateWorkOrderDetailsTable("CBT"); break;
            }
            StoreActionLocal(jsondata);
        }
    }
    catch (e) {
        log(e);
    }
}


function EstablishConnection() {
    if (navigator.onLine) {
        showActionPopupLoading();
        return true;
    }

    if (!navigator.onLine) {
        switch ($.trim(getLocal("RequestedAction"))) {
            case "Reassign":
            case "Reassign_CallCenter":
            case "Reassign_Manager":
            case "Reassign_Tech":
            case "Reassign_Vendor":
            case "AddAttachment":
            case "ConditionAssessment":
            case "EditAsset":
            case "SetSource":
            case "ReliabilityData":
            case "ChangePriority":
            case "SetEquipmentTag": showError(GetCommonTranslatedValue("NoNetworkCommon")); return false;
        }
    }
}

/// <summary>
/// Method to submit data.
/// </summary>
function SubmitData() {

    EstablishConnection();

    switch ($.trim(getLocal("RequestedAction"))) {
        case "ETA": PostETA(); break;
        case "Enroute": PostEnroute(); break;
        case "AddComment": PostAddComment(); break;
        case "Arrived": PostArrived(); break;
        case "Reassign":
        case "Reassign_CallCenter":
        case "Reassign_Manager":
        case "Reassign_Tech":
        case "Reassign_Vendor": PostReassign(); break;
        case "Cancel_Manager":
        case "Cancel_Tech":
        case "Cancel": PostCancel(); break;
        case "Start": PostStart(); break;
        case "Stop":
        case "Complete":
        case "Hold": ValidateandSave(); break;
        case "Duplicate": PostDuplicate(); break;
        case "AddAttachment":
        case "AddAttachment_Tag": PostAttachment(); break;
        case "SetEquipmentTag": PostEquipmentTag(); break;
        case "ConditionAssessment": PostConditionAssessment(); break;
        case "EditAsset": PostEditAsset(); break;
        case "SetSource": PostSourceUpdate(); break;
        case "ReliabilityData": PostReliabilityDataUpdate(); break;
        case "ChangePriority": PostChangePriorityUpdate(); break;
        default: break;
    }
}

/// <summary>
/// Method to post equipment tag.
/// </summary>
function PostEquipmentTag() {
    if ($("#SetEquipmentTagDropDown").val() == "-1") {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(GetTranslatedValue("EquipmentTagRequiredMessage"));
        }, 1000);
        return;
    }
    var DateDiff = $("#SetEquipmentTagDropDown").val().split('|');
    var jsondata = {
        SelectTagDDL: $.trim($("#SetEquipmentTagDropDown").val().substr(0, $("#SetEquipmentTagDropDown").val().indexOf('['))),
        WONumber: $.trim(getLocal("WorkOrderNumber")),
        KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
        DateModified: $.trim(getLocal("DateModified")),
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        RequestedAction: $.trim(getLocal("RequestedAction")),
        WarrantyDate: DateDiff[1],
        GPSLocation: GlobalLat + "," + GlobalLong,
        FeatureList: getLocal("featuresListAll"),
        SessionID: decryptStr(getLocal("SessionID"))
    };

    if (navigator.onLine) {
        CheckPendingActions(jsondata);
    }
    else {
        StoreActionLocal(jsondata);
    }
}

/// <summary>
/// Method to post the attachement.
/// </summary>
/// <param name="form">holds the attachment.</param>
function PostAttachment(form) {
    var secAddComntsLbl = '';
    if ($("#AddCommentLabelTA").val() !== "") {
        secAddComntsLbl = securityError($("#AddCommentLabelTA"));
        $('#AddCommentLabelTA').val(secAddComntsLbl);
    }
    if (!navigator.onLine) {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
        return false;
    }
    var pageID = $.mobile.activePage.attr('id');
    //var fileName;
    //var fileSize;
    //var comment = $("#" + pageID).find("#AddCommentLabelTA").val();
    var comment = secAddComntsLbl;
    //var fileObject;
    //var file = AttachmentFile;

    if ($('#AttachmentFile').val().length != 0) {
        workOrderAttachment = 1;
        CloseActionPopup();
        //file = file[0];
        //fileName = file.name;
        //fileSize = file.size;
        var AttachmentData = new FormData(form);
        //        $.ajaxpostJSON(standardAddress + "WorkOrderActions.ashx?methodname=AddAttachment", new FormData(form), function () {
        //            workOrderAttachment = 0;
        //        });

        $.ajax({
            processData: false,
            contentType: false,
            cache: false,
            url: standardAddress + "WorkOrderActions.ashx?methodname=AddAttachment",
            type: "POST",
            headers: { "Origin": ORIGIN_HEADER },
            datatype: "json",
            data: AttachmentData,
            success: function (result) {
                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    workOrderAttachment = 0;
                    setLocal("HOrderNumber", null);
                    if (getLocal("RequestedAction") == 'Tag' || getLocal("RequestedAction") == 'WorkOrder') {
                        $("#WOUploadIdentifier").hide();

                        if (navigator.onLine) {
                            AttacmentDetails();
                        } else {
                            BindOfflineAttachments();
                        }
                    }
                }
            },
            error: function () {
                showError(GetTranslatedValue("AddingAttachmentError"));

            }
        });
    }
    else {
        showError(GetTranslatedValue("ImageRequiredMessage"));
        $.mobile.loading("hide");
        return false;
    }
}

/// <summary>
/// Method to post the duplicate data.
/// </summary>
function PostDuplicate() {
    var secAddComntsLbl = '';
    if ($("#AddCommentLabelTA").val() !== "") {
        secAddComntsLbl = securityError($("#AddCommentLabelTA"));
        $('#AddCommentLabelTA').val(secAddComntsLbl);
    }
    var pageID = $.mobile.activePage.attr('id');
    var message = GetTranslatedValue("AllFieldsRequiredMessage");
    if ($("#" + pageID).find("#SStCityValue").attr("data-value") == -1) {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(message);
        }, 1000);
        return;
    }

    if ($("#" + pageID).find("#SBuildingValue").attr("data-value") == -1) {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(message);
        }, 1000);
        return;
    }

    if ($("#" + pageID).find("#SFloorValue option:selected").val() == -1) {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(message);
        }, 1000);
        return;
    }

    if ($("#" + pageID).find("#SRoomValue option:selected").val() == -1) {
        closeActionPopupLoading();
        setTimeout(function () {
            showError(message);
        }, 1000);
        return;
    }

    var jsondata = { SL1_DropDownListValue: $("#" + pageID).find("#SStCityValue").attr("data-value"),
        SL2_DropDownListValue: $("#" + pageID).find("#SBuildingValue").attr("data-value"),
        SL3_DropDownListValue: $("#" + pageID).find("#SFloorValue option:selected").val(),
        SL4_DropDownListValue: $("#" + pageID).find("#SRoomValue option:selected").val(),
        Comment: secAddComntsLbl, //$.trim($("#" + pageID).find("#AddCommentLabelTA").val()),
        WONumber: $.trim(getLocal("WorkOrderNumber")),
        KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")),
        DateModified: $.trim(getLocal("DateModified")),
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        RequestedAction: $.trim(getLocal("RequestedAction")),
        FullName: decryptStr(getLocal("FullName")),
        GPSLocation: GlobalLat + "," + GlobalLong,
        FeatureList : getLocal("featuresListAll"),
        SessionID: decryptStr(getLocal("SessionID"))
    };

    if (navigator.onLine) {
        CheckPendingActions(jsondata, DuplicateSuccess);
    }
    else {
        StoreActionLocal(jsondata);
    }
}

/// <summary>
/// Method to state duplicate Success.
/// </summary>
/// <param name="data">holds the status.</param>
function DuplicateSuccess(data) {
    if (data.DetWONumberVal != null && data.DetWONumberVal != "undefined") {
        createWorkOrderFlag = true;
        newWorkOrderData = data;
        localStorage.setItem("WorkOrderNumber", data.DetWONumberVal);
        CloseActionPopup();
    }
    else if (data.Result === true || data.Result === "true") {
        setLocal("WorkOrderNumber", data.Data);
        CloseActionPopup();
    }
    else {
        showError(data.Data);
    }
}

/// <summary>
/// Method to confirm the fix through the phone.
/// </summary>
function PhoneFixConfirm() {
    if ($.trim($("#PhoneFixDescription").val()).length != 0) {
        showConfirmation(GetTranslatedValue("PhoneFixConfirmation"), GetCommonTranslatedValue("OkLabel"), GetCommonTranslatedValue("CancelLabel"), "PhoneFix");
    }
    else {
        showError(GetTranslatedValue("EnterCompleteDescription"));
    }

}

/// <summary>
/// Method to phone fix.
/// </summary>
/// <param name="flag">holds value of flag.</param>
function PhoneFix(flag) {
    if (flag) {
        var SecPhoneFixDesc;
        var SecPhoneFixComnts;
        if ($("#PhoneFixDescription").val() !== "") {
            SecPhoneFixDesc = securityError($("#PhoneFixDescription"));
            $("#PhoneFixDescription").val(SecPhoneFixDesc);
        }
        if ($("#PhoneFixComments").val() !== "") {
            SecPhoneFixComnts = securityError($("#PhoneFixComments"));
            $("#PhoneFixComments").val(SecPhoneFixComnts);
        }
        //var completeDesc = $.trim($("#PhoneFixDescription").val());
        var completeDesc = SecPhoneFixDesc;
        //var comments = $.trim($("#PhoneFixComments").val());
        var comments = SecPhoneFixComnts;
        var jsondata = {
            WONumber: $.trim(getLocal("WorkOrderNumber")),
            KeyFieldDateModified: $.trim(getLocal("KeyFieldDateModified")), 
            DateModified: $.trim(getLocal("DateModified")),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            RequestedAction: 'PhoneFix',
            EmployeeName: decryptStr(getLocal("Username")),
            CompletionDescTxt: completeDesc,
            Comment: comments,
            FullName: decryptStr(localStorage.getItem("FullName")),
            GPSLocation: GlobalLat + "," + GlobalLong,
            FeatureList: getLocal("featuresListAll"),
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            showActionPopupLoading();
            CheckPendingActions(jsondata);
        }
    }
}

/// <summary>
/// Method to post the the condition of the assessment.
/// </summary>
function PostConditionAssessment() {
    var SecCondNotesTxtArea;
    if ($("#conditionNotesTextArea").val() !== "") {
        SecCondNotesTxtArea = securityError($("#conditionNotesTextArea"));
        $("#conditionNotesTextArea").val(SecCondNotesTxtArea);
    }
    var pageID = $.mobile.activePage.attr('id');
    //    var notes = $.trim($("#conditionNotesTextArea").val());
    var notes = SecCondNotesTxtArea;
    var condition = $("#" + pageID).find("#conditionDropDown option:selected").val();

    var jsondata = {
        TagNumber: $.trim(getLocal("TagNumber")),
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        RequestedAction: getLocal("RequestedAction"),
        EmployeeName: decryptStr(getLocal("Username")),
        Condition: condition,
        TagNotes: notes,
        GPSLocation: GlobalLat + "," + GlobalLong,
        SessionID: decryptStr(getLocal("SessionID"))
    };

    if (navigator.onLine) {
        showActionPopupLoading();
        UpdateTagDetails(jsondata);
    }
}

/// <summary>
/// Method to post the edited assessment.
/// </summary>
function PostEditAsset() {
    var SecinstDescTxtArea;
    if ($("#instDescrTextArea").val() !== "") {
        SecinstDescTxtArea = securityError($("#instDescrTextArea"));
        $("#instDescrTextArea").val(SecinstDescTxtArea);
    }
    var SecSerialNumTxtArea;
    if ($("#serialNumberTextArea").val() !== "") {
        SecSerialNumTxtArea = securityError($("#serialNumberTextArea"));
        $("#serialNumberTextArea").val(SecSerialNumTxtArea);
    }
    var SecBarcodeTxtArea;
    if ($("#barcodeIDTextArea").val() !== "") {
        SecBarcodeTxtArea = securityError($("#barcodeIDTextArea"));
        $("#barcodeIDTextArea").val(SecBarcodeTxtArea);
    }
    var SecTagDetlTxtArea;
    if ($("#tagDetailsTextArea").val() !== "") {
        SecTagDetlTxtArea = securityError($("#tagDetailsTextArea"));
        $("#tagDetailsTextArea").val(SecTagDetlTxtArea);
    }
    var secManufacturerVal = '';
    if ($("#manufacturerTextArea").val() !== "") {
        secManufacturerVal = securityError($("#manufacturerTextArea"));
        $('#manufacturerTextArea').val(secManufacturerVal);
    }
    var secModelVal = '';
    if ($("#modelTextArea").val() !== "") {
        secModelVal = securityError($("#modelTextArea"));
        $('#modelTextArea').val(secModelVal);
    }
    if (ValidateFields()) {
        //var instDescr = $.trim($("#instDescrTextArea").val());
        var instDescr = SecinstDescTxtArea;
        var instDate = $.trim($("#installDate").val());
        //var serialNumber = $.trim($("#serialNumberTextArea").val());
        var serialNumber = SecSerialNumTxtArea;
        //var barcodeID = $.trim($("#barcodeIDTextArea").val());
        var barcodeID = SecBarcodeTxtArea;
        //var tagDetails = $.trim($("#tagDetailsTextArea").val());
        var tagDetails = SecTagDetlTxtArea;
        var notes = $.trim($("#notesTextArea").val());
        var jsondata = {
            TagNumber: $.trim(getLocal("TagNumber")),
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            RequestedAction: getLocal("RequestedAction"),
            EmployeeName: decryptStr(getLocal("Username")),
            InstalledDescription: instDescr,
            DateInstalled: instDate,
            BarcodeID: barcodeID,
            SerialNumber: serialNumber,
            TagDetails: tagDetails,
            TagNotes: notes,
            Manufacturer: secManufacturerVal,
            Model: secModelVal,
            GPSLocation: GlobalLat + "," + GlobalLong,
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            showActionPopupLoading();
            UpdateTagDetails(jsondata);
        }
    } else {
        // Not valid data set.
        closeActionPopupLoading();
        setTimeout(function () {
            showError(GetTranslatedValue("AllFieldsRequiredMessage"));
        }, 1000);
        return;
    }
}

/// <summary>
/// Method to change the re assignment pic DDL.
/// </summary>
function OnReassignAssignmentPickDDLChange() {
    localStorage.setItem("PdaSearchComplete", "Begin");
}

///////////////////////////////////////////Action Page /////////////////////////////////////////////

/// <summary>
/// Method to config action page.
/// </summary>
function ActionPageConfig() {
    try {
        var pageID = "#" + $.mobile.activePage.attr("id");
        var actionID = getLocal("RequestedAction");
        var actionText = getLocal("RequestedActionText");
        $(".DeviceTimeLabel").hide();
        $(pageID).find("#AssignTypeDIV").hide();
        $(pageID).find('#AssignmentPickDIV').addClass('ui-screen-hidden');

        $(".actionDiv").addClass("ui-screen-hidden");
        $("#CommentDDLDiv").hide();
        $(".SiteTZLabel").html(getLocal("SiteTZ"));
        $("#totalLaborValueLabel").html(getLocal("WOLaborHour"));

        if (actionID.indexOf("Cancel") > -1) {
            actionID = "Cancel";
        }

        if (actionID.indexOf("Reassign") != -1) {
            actionID = "Reassign";
        }

        if (actionID.indexOf("AddAttachment") != -1) {
            actionID = "AddAttachment";
        }

        if (actionID.indexOf("AddComment") == -1) {
            $("#" + actionID).removeClass("ui-screen-hidden");
        }
        if (actionID.indexOf("AddAttachment") == -1 && actionID.indexOf("FieldPO") == -1 && actionID.indexOf("PhoneFix") == -1
            && actionID.indexOf("PreApproval") == -1 && actionID.indexOf("InvoiceApproval") == -1 && actionID.indexOf("NTEApproval") == -1
            && actionID.indexOf("NTEIncrease") == -1 && actionID.indexOf("MaterialPO") == -1) {
            $("#AddComment").removeClass("ui-screen-hidden");
        }

        $("#AddCommentSubmitButton").html($("#" + actionID).find(".hidden-a-tag").html());
        $("#selectedAction").html(actionText);

        $(pageID).find("#commentstarIcon").hide();

        $(pageID).find("textarea").val('');

        var data = {
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            CustSiteKey: getLocal("CustomerSiteNumber"),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            SessionID: decryptStr(getLocal("SessionID"))
        };

        if (actionID != "FieldPO" || actionID != "PhoneFix" || actionID != "MaterialPO") {
            if (navigator.onLine) {
                $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetCurrentDateTime", { CustomerSiteNumber: JSON.stringify(data) }, function (result) {

                    SetOnlineTime("WOActionETADateTime", result);
                    SetOnlineTime("WOActionEnrouteDateTime", result);
                    SetOnlineTime("ArrivedDate", result);
                    SetOnlineTime("startLinkDate", result);
                    SetOnlineTime("stopDate", result);
                    SetOnlineTime("compDate", result);
                });
            }
            else {
                $(".DeviceTimeLabel").show();
                SetOfflineTime("WOActionETADateTime");
                SetOfflineTime("WOActionEnrouteDateTime");
                SetOfflineTime("ArrivedDate");
                SetOfflineTime("startLinkDate");
                SetOfflineTime("stopDate");
                SetOfflineTime("compDate");
            }
        }

        switch (getLocal("RequestedAction")) {
            case "Cancel":
            case "Cancel_Manager":
            case "Cancel_Tech":
            case "AddComment": $("#commentstarIcon").show(); break;
            case "Complete": $("#stopToggleDropDown").val("1").selectmenu("refresh");
                if (getLocal('WOLaborHour') != null && getLocal('WOLaborHour') != "undefined") {
                    $("#totalLaborValueLabel").html(getLocal('WOLaborHour'));
                }
                else {
                    BindLaborHours();
                }

                if (getLocal('WOMaterilaCost') != null && getLocal('WOMaterilaCost') != "undefined") {
                    $("#totalMaterialValueLabel").append(getLocal('WOMaterilaCost') + ' ' + getLocal('CASCurrencyCode'));
                }
                else {
                    BindMaterialTotal();
                }

                if (getLocal("TagNumber") != "None") {
                    // Defer execution of this block until you have tag/condition info.
                    $.when(GetTagConditionInfo()).done(function (tagInfo) {

                        var woData = tagInfo.Data;
                        var conditions = tagInfo.PdaSearch;
                        $("#CompEquipTagNumber").html(woData.TagNumber);
                        $("#CompEquipTagInstDescr").html(woData.InstalledDescription);

                        for (index = 0; index < conditions.length; index++) {
                            var listItem = document.createElement('option');
                            if (!IsStringNullOrEmpty(conditions[index])) {
                                listItem.setAttribute("value", conditions[index]);
                                listItem.innerHTML = conditions[index];
                                $('#CompConditionDropDown').append(listItem);
                            }
                        }
                        $("#CompConditionDropDown").val(woData.TagCondition).selectmenu("refresh");
                    });

                    if (getLocal("IsRefrigerantEligible") === 'true') {
                        PopulateRefrigerantDropdown();
                    }
                }
                break;
            case 'Stop':
                if (getLocal("TagNumber") != "None") {
                    // Defer execution of this block until you have tag/condition info.
                    $.when(GetTagConditionInfo()).done(function (tagInfo) {
                        var woData = tagInfo.Data;
                        var conditions = tagInfo.PdaSearch;
                        $("#CompEquipTagNumber").html(woData.TagNumber);
                        $("#CompEquipTagInstDescr").html(woData.InstalledDescription);

                        for (index = 0; index < conditions.length; index++) {
                            var listItem = document.createElement('option');
                            if (!IsStringNullOrEmpty(conditions[index])) {
                                listItem.setAttribute("value", conditions[index]);
                                listItem.innerHTML = conditions[index];
                                $('#CompConditionDropDown').append(listItem);
                            }
                        }
                        $("#CompConditionDropDown").val(woData.TagCondition).selectmenu("refresh");
                    });

                    if (getLocal("IsRefrigerantEligible") === 'true') {
                        PopulateRefrigerantDropdown();
                    }
                }
                break;
            case 'Reassign':
                $("#ReassignAssignTypeDDL").val("-1").selectmenu("refresh");
                $("#AssignTypeDIV").show();
                SecurityForVendorSearch("Reassign_VendorSearch", 1);
                break;
            case 'Reassign_CallCenter':
                $("#ReassignAssignTypeDDL").val("CallCenter").selectmenu("refresh").trigger('change');
                $("#AssignTypeDIV").hide();
                break;
            case 'Reassign_Manager':
                $("#ReassignAssignTypeDDL").val("Manager").selectmenu("refresh").trigger('change');
                $("#AssignTypeDIV").hide();
                break;
            case 'Reassign_Tech':
                $("#ReassignAssignTypeDDL").val("Employee").selectmenu("refresh").trigger('change');
                $("#AssignTypeDIV").hide();
                break;
            case 'Reassign_Vendor':
                $("#ReassignAssignTypeDDL").val("Vendor").selectmenu("refresh").trigger('change');
                $("#AssignTypeDIV").hide();
                SecurityForVendorSearch("Reassign_VendorSearch", 1);
                break;
            ////setLocation(); break;                                                                                                                                                                                          
            case "Duplicate": $(pageID).find("#setLocLocal").hide();
                setLocation();
                if ($(pageID).find("#SStCityValue").attr("data-value") == -1) {
                    $(pageID).find("#SFloorValue").selectmenu("disable");
                    $(pageID).find("#SRoomValue").selectmenu("disable");
                }
                break;


            case "SetEquipmentTag":
                var data = { "WONumber": $.trim(getLocal("WorkOrderNumber")),
                    "Date": $.trim($("#WOActionETADateTime").val()),
                    "DatabaseID": decryptStr(getLocal("DatabaseID")),
                    "Language": getLocal("Language"),
                    "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
                    "FeatureList": getLocal("featuresListAll"),
                    "SessionID": decryptStr(getLocal("SessionID"))
                };
                $.ajaxpostJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetEquipmentTag", data, function (result) {
                    var jsonData = result.Data;
                    var SetEquipmentTagDropDownOptions = '';
                    for (var i = 0; i < jsonData.length; i++) {
                        var item = jsonData[i];
                        SetEquipmentTagDropDownOptions += '<option value=\'' + item.TagNumber + '[' + item.PartNumber + ']' + '|' + item.WarrentyDateDiff + '\'>' + item.InstalledDescription + '</option>';
                    }
                    $("#SetEquipmentTagDropDown option:gt(0)").remove();
                    $("#SetEquipmentTagDropDown").append(SetEquipmentTagDropDownOptions);
                    $("#SetEquipmentTagDropDown").selectmenu('refresh');
                });
                break;
            case "AddAttachment":
            case "AddAttachment_Tag":
                LoadAttachmentInfo(pageID);
                break;
            case "FieldPO":
                setLocal("HOrderNumber", null);
                LoadAttachmentInfo(pageID);
                BindCurrencyDropDown("FieldPOCurrencyCode");
                var data = {
                    DatabaseID: decryptStr(getLocal("DatabaseID")),
                    Language: getLocal("Language"),
                    "SearchText": null,
                    "PageNumber": 0,
                    "PageSize": 0,
                    "SessionID": decryptStr(getLocal("SessionID")),
                    "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
                };
                $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetGLAccountDropDown", data, function (result) {
                    for (index = 0; index < result.length; index++) {
                        var tag = document.createElement('option');
                        tag.setAttribute("value", result[index].GLAccountNumber);
                        tag.innerHTML = result[index].GLDescription;
                        $('#GLAccountDropDown').append(tag);
                    }

                    $('#GLAccountDropDown').val(result[0].GLAccountNumber);
                    $("#GLAccountDropDown").selectmenu('refresh');
                });
                break;
            case "MaterialPO":
                BindCurrencyDropDown("materialPOCurrencyCode");
                $("#materialPOCurrencyCode").val(getLocal("CASCurrencyCode"));
                $("#materialPOCurrencyCode").selectmenu("refresh");
                Inventory.PrepareMaterialPO();
                break;
            case "PreApproval":
                var myJSONobject = {
                    "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                    "Language": localStorage.getItem("Language"),
                    "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                    "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                    "CodeType": "PreApproval",
                    "SelectedView": "1",
                    "SessionID": decryptStr(getLocal("SessionID"))
                };

                var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetPreApprovalCode";
                $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
                    bindApprovalPopupData(resultData);
                });
                break;
            case "InvoiceApproval":
                var myJSONobject = {
                    "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                    "Language": localStorage.getItem("Language"),
                    "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                    "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                    "CodeType": "InvoiceApproval",
                    "SelectedView": "1",
                    "SessionID": decryptStr(getLocal("SessionID"))
                };

                var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetPreApprovalCode";
                $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
                    bindApprovalPopupData(resultData);
                });
                break;
            case "NTEApproval":
                var myJSONobject = {
                    "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                    "Language": localStorage.getItem("Language"),
                    "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                    "CodeType": "NTEApproval",
                    "SelectedView": "1",
                    "SessionID": decryptStr(getLocal("SessionID")),
                    "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
                };

                var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetPreApprovalCode";
                $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
                    bindApprovalPopupData(resultData);
                });
            case "NTEIncrease":
                var myJSONobject = {
                    DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                    Language: localStorage.getItem("Language"),
                    Username: decryptStr(localStorage.getItem("Username")),
                    EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                    WorkOrdernumber: localStorage.getItem("WorkOrderNumber"),
                    "SelectedView": "5",
                    SessionID: decryptStr(getLocal("SessionID"))
                };
                var orderDetailsURL = standardAddress + "WorkOrderActions.ashx?methodname=CheckDefaultValueForNTE";
                $.ajaxApprovalPostJSON(orderDetailsURL, myJSONobject, function (data) {
                    if (data.Table[0]["DefaultValueInt"] != 0) {
                        $("#ApprovalDropDownMainDiv").hide();
                        NTEDefaultValueInt = 1;
                    }
                    else {
                        $("#ApprovalDropDownMainDiv").show();
                        NTEDefaultValueInt = 0;
                    }

                    FetchCurrentNTE();
                });
            case "ConditionAssessment":
                $('#AddCommentsLabel').hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();
                $('#selectedAction').attr('style', 'padding-right:25px;');

                // Defer execution of this block until you have tag/condition info.
                $.when(GetTagConditionInfo()).done(function (tagInfo) {
                    var woData = tagInfo.Data;
                    var conditions = tagInfo.PdaSearch;

                    for (index = 0; index < conditions.length; index++) {
                        var listItem = document.createElement('option');
                        if (!IsStringNullOrEmpty(conditions[index])) {
                            listItem.setAttribute("value", conditions[index]);
                            listItem.innerHTML = conditions[index];
                            $('#conditionDropDown').append(listItem);
                        }
                    }

                    $("#conditionDropDown").val(woData.TagCondition).selectmenu("refresh");
                    $("#conditionNotesTextArea").val(woData.Notes);
                });
                break;
            case "EditAsset":
                $('#AddCommentsLabel').hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();
                PrepareTagActions();
                break;
            case "SetSource":
                $('#AddCommentsLabel').hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();
                PrepareSource();
                break;
            case "Start":
                $(".actionDiv").addClass("ui-screen-hidden");
                $("#PreStart").removeClass("ui-screen-hidden");
                Steps.PreparePreStartSteps(1);
                break;
            case "ReliabilityData":
                $('#AddCommentsLabel').hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();
                PrepareReliabilityData();
                break;
            case "ChangePriority":
                // Update data from work order.
                $('#PriorityDropDown option').remove();
                var priorityItem = document.createElement('option');
                priorityItem.setAttribute('value', '-1');
                priorityItem.innerHTML = orderDtails.DetPriorityVal;
                $('#PriorityDropDown').append(priorityItem);
                $('#PriorityDropDown option:first').attr('selected', 'selected');
                $('#responseTargetDate').val(moment(orderDtails.ResponseTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm'));
                $('#responseTargetDate').prop('disabled', true);
                $('#completionTargetDate').val(moment(orderDtails.CompletionTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm'));
                $('#completionTargetDate').prop('disabled', true);

                // Initialize the dropdowns
                PrepareChangePriorityDropDowns();

                // Enforce security and configure the form
                var SgtCollection = $.GetSecuritySubTokens(400009, 1);
                EnforceFieldSecurity(SgtCollection, 'ChangePriorityDropDown', false);
                EnforceFieldSecurity(SgtCollection, 'ChangePriorityResponseTarget', false);
                EnforceFieldSecurity(SgtCollection, 'ChangePriorityCompletionTarget', false);
                // These are all required if they are visible.
                if ($('[data-field="ChangePriorityDropDown"]').css('display') != 'none') {
                    $('[data-field="ChangePriorityDropDown"] .mandatory').show();
                    $('[data-field="ChangePriorityDropDown"] .js-sToken').attr("data-requried", "true");
                }

                if ($('[data-field="ChangePriorityResponseTarget"]:visible').css('display') != 'none') {
                    $('[data-field="ChangePriorityResponseTarget"] .mandatory').show();
                    $('[data-field="ChangePriorityResponseTarget"] .js-sToken').attr("data-requried", "true");
                }

                if ($('[data-field="ChangePriorityCompletionTarget"]:visible').css('display') != 'none') {
                    $('[data-field="ChangePriorityCompletionTarget"] .mandatory').show();
                    $('[data-field="ChangePriorityCompletionTarget"] .js-sToken').attr("data-requried", "true");
                }

                $('#AddCommentsLabel').text(GetTranslatedValue('ReasonForChangeLabel')).hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();

                break;
        }

        if (getLocal("RequestedAction") !== "ConditionAssessment" &&
            getLocal("RequestedAction") !== "EditAsset" &&
            getLocal("RequestedAction") !== "ChangePriority") {
            PopulateCommentDDL();
        }

        BindSiteLabels();
    }
    catch (e) {
        log(e);
    }
}

function LoadAttachmentInfo(pageID) {
    $(pageID).find("#DatabaseID").val(decryptStr(getLocal("DatabaseID")));
    $(pageID).find("#Username").val(decryptStr(getLocal("Username")));
    $(pageID).find("#Language").val(getLocal("Language"));
    $(pageID).find("#EmployeeNumber").val(decryptStr(getLocal("EmployeeNumber")));
    $(pageID).find("#EmployeeName").val(decryptStr(getLocal("FullName")));

    if (getLocal("RequestedAction") === "AddAttachment" || getLocal("RequestedAction") === "FieldPO") {
        if ((getLocal("iMFM_AttachmentsOnFieldPO") == 1) && !IsStringNullOrEmpty(getLocal("HOrderNumber"))) {
            $(pageID).find("#WorkOrderNumber").val(getLocal("HOrderNumber"));
        } else {
            $(pageID).find("#WorkOrderNumber").val(getLocal("WorkOrderNumber"));
        }
    } else {
        $(pageID).find("#EquipTagNumber").val(getLocal("TagNumber"));
    }

    $(pageID).find("#GPSLocation").val(GlobalLat + "," + GlobalLong);
    $(pageID).find("#SessionID").val(decryptStr(getLocal("SessionID")));
}

/// <summary>
/// Method to fetch the current NTE.
/// </summary>
function FetchCurrentNTE() {
    var myJSONobject = {
        DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
        Language: localStorage.getItem("Language"),
        Username: decryptStr(localStorage.getItem("Username")),
        EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
        WorkOrdernumber: localStorage.getItem("WorkOrderNumber"),
        SessionID: decryptStr(getLocal("SessionID"))
    };
    var currentNTE = standardAddress + "WorkOrderActions.ashx?methodname=FetchCurrentNTE";
    $.ajaxApprovalPostJSON(currentNTE, myJSONobject, function (resultData) {
        if (resultData.Table[0]["CurrentNTE"] != 0) {
            var CurrentNTEVal = $("#CurrentNTE");
            CurrentNTEVal.append(resultData.Table[0]["CurrentNTE"]);
        }

        $("#NTESubmitButton").addClass('ui-disabled');
        if (resultData.Table[0].hasOwnProperty('ApprovalResult')) {
            if (NTEDefaultValueInt == 0 && resultData.Table[0]["ApprovalResult"] == null) {
                setTimeout(function () {
                    showError(GetTranslatedValue("NTEIncreasePendingMessage"));
                }, 1000);
                $("#NTESubmitButton").addClass('ui-disabled');
                return;
            }
            else {
                $("#NTESubmitButton").removeClass('ui-disabled');
            }
        }
        else {
            $("#NTESubmitButton").removeClass('ui-disabled');
        }
    });
}

/// <summary>
/// Method to capture the signature.
/// </summary>
/// <param name="pageId">holds the Id of the page.</param>
function SignatureCapture(pageId) {
    var pageID = pageId;
    var SgtCollection = $.GetSecuritySubTokens(400009, 2);
    for (var i = 0; i < SgtCollection.SgstCollection.length; i++) {
        $("#" + SgtCollection.SgstCollection[i].SubTokenDescription.toLowerCase().replace(/\s/g, "")).hide();
        if (SgtCollection.SgstCollection[i].CanAccess == 1) {
            $("#" + SgtCollection.SgstCollection[i].SubTokenDescription.toLowerCase().replace(/\s/g, "")).show();
            switch (SgtCollection.SgstCollection[i].SubTokenDescription) {
                case "Signature_Capture":
                    $(pageID + " #Signature_Capture").show();
                    if (SgtCollection.SgstCollection[i].Required == 1) {
                        $(pageID + " #Signature_Capture").attr("data-Required", "true");
                        $(pageID + " #signatureRequiredLabel").show();
                        $(pageID + " #signedByRequiredLabel").show();
                    }
                    else {
                        $(pageID + " #Signature_Capture").attr("data-Required", "false");
                        $(pageID + " #signatureRequiredLabel").hide();
                        $(pageID + " #signedByRequiredLabel").hide();
                    }
                    break;
                case "LicenseNumber":
                    $(pageID + " #LicenseNumber").show();
                    if (SgtCollection.SgstCollection[i].Required == 1) {
                        $(pageID + " #LicenseNumber").attr("data-Required", "true");
                        $(pageID + " #licenseNumberRequiredLabel").show();
                    }
                    else {
                        $(pageID + " #LicenseNumber").attr("data-Required", "false");
                        $(pageID + " #licenseNumberRequiredLabel").hide();
                    }

                    if (SgtCollection.SgstCollection[i].ReadOnly == 1) {
                        $("textarea[name='licenseNumberValue']").prop('disabled', false);

                    }
                    else {
                        $("#licenseNumberRequiredLabel").hide();
                        $("textarea[name='licenseNumberValue']").prop('disabled', true);
                    }

                    break;
            }
        }
        else {

            switch (SgtCollection.SgstCollection[i].SubTokenDescription) {
                case "Signature_Capture":
                    $(pageID + " #Signature_Capture").hide();
                    break;
                case "Total_LaborHours":
                    $(pageID + " #totalLaborLabel").hide();
                    $(pageID + " #totalLaborValueLabel").hide();
                    break;
                case "Total_Material":
                    $(pageID + " #totalMaterialLabel").hide();
                    $(pageID + " #totalMaterialValueLabel").hide();
                    break;
                case "LicenseNumber":
                    $(pageID + " #LicenseNumber").hide();
                    break;
            }
        }
    }
}

/// <summary>
/// Method to load the NTE approvers.
/// </summary>
function LoadNTEIncreaseApprovers() {
    var SecSerchApprName;
    if ($("#SearchApproverNameTextBox").val() !== "") {
        SecSerchApprName = securityError($("#SearchApproverNameTextBox"));
        $("#SearchApproverNameTextBox").val(SecSerchApprName);
    }
    if (navigator.onLine) {
        $("#ApproverListDropDown option:gt(0)").remove();
        $("#ApproverListDropDown").selectmenu("refresh", true);

        //var searchText = jQuery.trim($('#SearchApproverNameTextBox').val());
        var searchText = SecSerchApprName;
        //    var pattern = /^[A-Za-z- ]*$/; || !pattern.test(searchText)
        if (searchText === null || searchText === '' || searchText.length < 3) {
            $('#SearchApproverNameTextBox').focus();
            return;
        }

        var data = {
            "SearchText": searchText,
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "PageNumber": 0,
            "PageSize": 0,
            "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
            "ProposedNTE": $("#ProposedNTEValue").val(),
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        var nteIncreaseURL = standardAddress + "WorkOrderActions.ashx?methodname=FetchEmployeeDetails";
        if (navigator.onLine) {
            BindNTEApproverList(nteIncreaseURL, data);
        }
        else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to bind NTE approver list.
/// </summary>
/// <param name="nteIncreaseURL">holds the URL.</param>
/// <param name="data">holds the value.</param>
function BindNTEApproverList(nteIncreaseURL, data) {
    $.postJSON(nteIncreaseURL, data, function (nteResult) {
        var tag;
        if (nteResult.length === 0) {
            tag = document.createElement('option');
            tag.setAttribute("value", "-2");
            tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
            $('#ApproverListDropDown').append(tag);
            $('#ApproverListDropDown').val("-2");
            $('#ApproverListDropDown').selectmenu("refresh", true);
            $('#SearchApproverNameTextBox').focus();
            return;
        }
        else if (nteResult.length == 1) {
            $("#ApproverListDropDown option:gt(0)").remove();
            $("#ApproverListDropDown").selectmenu("refresh", true);
            tag = document.createElement('option');
            tag.setAttribute("value", nteResult[0].EmployeeNumber);
            tag.innerHTML = nteResult[0].OnlyEmployeeName;
            $("#ApproverListDropDown").append(tag);
            $("#ApproverListDropDown").selectmenu("refresh", true);
        }
        else {
            $("#ApproverListDropDown option:gt(0)").remove();
            $("#ApproverListDropDown").selectmenu("refresh", true);
            var firstTag = document.createElement('option');
            firstTag.setAttribute("value", "-2");
            firstTag.innerHTML = "-- [ " + nteResult.Table.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            console.log(firstTag);
            $('#ApproverListDropDown').append(firstTag);
            var i = 0;
            for (i = 0; i < nteResult.Table.length; i++) {
                tag = document.createElement('option');
                tag.setAttribute("value", nteResult.Table[i].EmployeeNumber);
                tag.innerHTML = nteResult.Table[i].OnlyEmployeeName;
                $('#ApproverListDropDown').append(tag);
            } // end of for
            $('#ApproverListDropDown').val('-2');
            $('#ApproverListDropDown').selectmenu("refresh", true);
        }
    });
}

/// <summary>
/// Method to load the POVender list.
/// </summary>
function LoadFieldPOVendorList() {
    var secFielPOVendorSearch;
    if ($("#FielPOVendorSearchTextBox").val() !== "") {
        secFielPOVendorSearch = securityError($("#FielPOVendorSearchTextBox"));
        $('#FielPOVendorSearchTextBox').val(secFielPOVendorSearch);
    }
    $("#FieldPOVendorList option:gt(0)").remove();
    $("#FieldPOVendorList").selectmenu("refresh", true);

    //    var searchText = jQuery.trim($('#FielPOVendorSearchTextBox').val());
    var searchText = secFielPOVendorSearch;
    //    var pattern = /^[A-Za-z- ]*$/; || !pattern.test(searchText)
    if (searchText === null || searchText === '' || searchText.length < 3) {
        $('#FielPOVendorSearchTextBox').focus();
        return;
    }

    var data = {
        "SearchText": searchText,
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "PageNumber": 0,
        "PageSize": 0,
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var fieldPOVendorListURL = standardAddress + "WorkOrderActions.ashx?methodname=GetVendors";
    if (navigator.onLine) {
        BindFieldPOVendorListData(fieldPOVendorListURL, data);
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to bind POVender list data.
/// </summary>
/// <param name="fieldPOVendorListURL">holds the URL.</param>
/// <param name="data">holds the value.</param>
function BindFieldPOVendorListData(fieldPOVendorListURL, data) {
    $.postJSON(fieldPOVendorListURL, data, function (vendorResult) {
        var tag;
        if (vendorResult.length === 0) {
            tag = document.createElement('option');
            tag.setAttribute("value", "-2");
            tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
            $('#FieldPOVendorList').append(tag);
            $('#FieldPOVendorList').val("-2");
            $('#FieldPOVendorList').selectmenu("refresh", true);
            $('#FielPOVendorSearchTextBox').focus();
            return;
        }
        else if (vendorResult.length == 1) {
            $("#FieldPOVendorList option:gt(0)").remove();
            $("#FieldPOVendorList").selectmenu("refresh", true);
            tag = document.createElement('option');
            tag.setAttribute("value", vendorResult[0].VendorNumber + "|" + vendorResult[0].CurrencyCode);
            tag.innerHTML = vendorResult[0].VendorSiteName;
            $("#FieldPOVendorList").append(tag);
            $("#FieldPOVendorList").selectmenu("refresh", true);
        }
        else {
            $("#FieldPOVendorList option:gt(0)").remove();
            $("#FieldPOVendorList").selectmenu("refresh", true);
            var firstTag = document.createElement('option');
            firstTag.setAttribute("value", "-2");
            firstTag.innerHTML = "-- [ " + vendorResult.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            $('#FieldPOVendorList').append(firstTag);
            var i = 0;
            for (i = 0; i < vendorResult.length; i++) {
                tag = document.createElement('option');
                tag.setAttribute("value", vendorResult[i].VendorNumber + "|" + vendorResult[i].CurrencyCode);
                tag.innerHTML = vendorResult[i].VendorSiteName;
                $('#FieldPOVendorList').append(tag);
            } // end of for
            $('#FieldPOVendorList').val('-2');
            $('#FieldPOVendorList').selectmenu("refresh", true);
        }
    });
}

/// <summary>
/// Method to create field PO.
/// </summary>
function CreateFieldPO(warningStatus) {
    var secFieldPOPrice;
    if ($("#FieldPOPrice").val() !== "") {
        secFieldPOPrice = securityError($("#FieldPOPrice"));
        $('#FieldPOPrice').val(secFieldPOPrice);
    }
    var secFieldPONumber;
    if ($("#FieldPONumber").val() !== "") {
        secFieldPONumber = securityError($("#FieldPONumber"));
        $('#FieldPONumber').val(secFieldPONumber);
    }
    var secFieldPOPCardNumber;
    if ($("#FieldPOPCardNumber").val() !== "") {
        secFieldPOPCardNumber = securityError($("#FieldPOPCardNumber"));
        $('#FieldPOPCardNumber').val(secFieldPOPCardNumber);
    }
    var secFieldPODescription;
    if ($("#FieldPODescription").val() !== "") {
        secFieldPODescription = securityError($("#FieldPODescription"));
        $('#FieldPODescription').val(secFieldPODescription);
    }
    var POPattern = /[-!$%^#&*()_+|~=`{}\[\]:";'<>?,.\/]/;
    var vendorNumber = $('#FieldPOVendorList').val().split('|');
    // var costPerUnit = $('#FieldPOPrice').val().trim
    var costPerUnit = secFieldPOPrice;
    // var PONumber = $('#FieldPONumber').val().trim();
    var PONumber = secFieldPONumber;
    // var PCardNumber = $('#FieldPOPCardNumber').val().trim();
    var PCardNumber = secFieldPOPCardNumber;
    var glAccountNumber = $('#GLAccountDropDown').val();
    //var fieldPODescription = $('#FieldPODescription').val().trim();
    var fieldPODescription = secFieldPODescription;
    var createPOFlag;
    if ($('#createPOCheckBox').is(":checked") === true) {
        createPOFlag = true;
    }
    else if ($('#createPOCheckBox').is(":checked") === false) {
        createPOFlag = false;
    }
    var createPOAttachment = $('#AttachmentRequiredCheckBox').is(':checked');

    var currencyCode = $('#FieldPOCurrencyCode').val();

    if ($('#FieldPOVendorList').val() == "-1" || $('#FieldPOVendorList').val() == "-2") {
        showError(GetTranslatedValue("VendorRequiredMessage"));
        return false;
    }
    else if (costPerUnit.length === 0) {
        showError(GetTranslatedValue("UnitPriceRequiredMessage"));
        return false;
    }
    else if ($('#GLAccountDropDown').val() == "-1") {
        showError(GetTranslatedValue("GLAccountRequiredMessage"));
        return false;
    }
    else if (PONumber.length === 0) {
        showError(GetTranslatedValue("PONumRequiredMessage"));
        return false;
    }
    else if (POPattern.test(PONumber)) {
        showError(GetTranslatedValue("PONumInvalidMessage"));
        return false;
    }
    else if (fieldPODescription.length === 0) {
        showError(GetTranslatedValue("ItemDescriptionRequiredMessage"));
        return false;
    }

    if ($('#FieldPOPCardNumberRequiredLabel').visible == true && PCardNumber.length === 0) {
        showError(GetTranslatedValue("PCardRequiredMessage"));
        return false;
    }

    if (createPOAttachment && $('#AttachmentFile').val().length === 0) {
        showError(GetTranslatedValue("ImageRequiredMessage"));
        return false;
    }

    // Warn the user if the price is negative.
    if (typeof warningStatus === undefinedString) {
        if (Number(costPerUnit) >= 0) {
            warningStatus = true;
        } else {
            showConfirmation(GetTranslatedValue("NegativeDollarPOMessage"), GetCommonTranslatedValue("YesLabel"), GetCommonTranslatedValue("NoLabel"), CreateFieldPO);
        }
    }

    if (warningStatus) {
        var data = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
            "CostPerUnit": costPerUnit,
            "VendorNumber": vendorNumber[0],
            "CreatePO": createPOFlag,
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
            "Description": fieldPODescription,
            "GLAccount": glAccountNumber,
            "CurrencyCode": currencyCode,
            "PONumber": PONumber,
            "PCardNumber": PCardNumber,
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };

        if (navigator.onLine) {
            CheckPendingActions();
            $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=AddFieldPO", data, function (result) {

                if (result.WorkOrderNumber != null && result.WorkOrderNumber != "null" && result.WorkOrderNumber.length != 0 && result.WorkOrderNumber != "") {
                    var successMessage = GetTranslatedValue("FieldPOSuccessMessage").replace('[WONUM]', result.WorkOrderNumber) +
                                      '<p>' + GetTranslatedValue("ParentWOMessage") + localStorage.WorkOrderNumber + '</p>' +
                                      '<p>' + GetTranslatedValue("ChildWOMessage") + result.WorkOrderNumber + '</p>';
                    if (getLocal("iMFM_AttachmentsOnFieldPO") == 1) {
                        setLocal("HOrderNumber", result.WorkOrderNumber);
                    }
                    var pageID = "#" + $.mobile.activePage.attr("id");
                    LoadAttachmentInfo(pageID);
                    $('#FieldPOSuccessMessage').html(successMessage);
                    closeActionPopupLoading();
                    setTimeout(function () {
                        $("#FieldPOSuccessPopup").popup().popup("open");
                        // This is the handler for closing the popup and navigating back to the previous page.
                        $('.fieldpo-success').on('click', function () {
                            if (createPOAttachment) {
                                closeFieldPO(function () {
                                    $('#AttachmentForm').find('input[type="button"]').click();
                                });
                            } else {
                                closeFieldPO();
                            }
                        });
                    }, 500);

                }
                else if (!IsStringNullOrEmpty(result.SelectMessage)) {
                    $('#FieldPOSuccessMessage').html(result.SelectMessage);
                    closeActionPopupLoading();
                    setTimeout(function () {
                        $("#FieldPOSuccessPopup").popup("open");
                        $('.fieldpo-success').on('click', function () {
                            closeFieldPO();
                        });
                    }, 100);
                }
                else {
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetTranslatedValue("ErrorMessage"));
                    }, 500);

                }
            });
        }
        else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
}

/// <summary>
/// Method to bind vender list CC.
/// </summary>
function BindVendorListCC() {
    if ($('#FieldPOVendorList').val() != "-1" || $('#FieldPOVendorList').val() != "-2") {
        var currencyCode = $('#FieldPOVendorList').val().split('|');
        $('#FieldPOCurrencyCode').val(currencyCode[1]);
        $('#FieldPOCurrencyCode').selectmenu("refresh", true);
    }
}

/// code to handle action request for regions ////////////////////////
$.postActionJSON = function (url, data, func) {
    var Logurl = url;
    if (splitUrl(url, 'WEB')) {
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
                                        {
                                            url: url,
                                            type: "post",
                                            // headers: { "cache-control": "no-cache" },
                                            headers: { "Origin": ORIGIN_HEADER },
                                            //            jsonp: "callback",
                                            dataType: "json",
                                            //timeout: parseInt(processTime),
                                            //cache: false,
                                            async: true,
                                            data: data,
                                            beforeSend: function () {
                                                fillRequestLogTable("Action before send - " + ' ' + Logurl, JSON.stringify(data));
                                            },
                                            success: function (result, textStatus, jqXHR) {
                                                RemoveRequest("success", jqXHR.ID);

                                                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    func(result);
                                                }
                                            },
                                            error: function (xhr, textStatus, jqXHR) {

                                                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    RemoveRequest("error", xhr.ID);
                                                    var pageID = $.mobile.activePage.attr('id');
                                                    var popupName = findPopupName(pageID);
                                                    var errorMsg = "";
                                                    if (textStatus == 'timeout') {
                                                        fillRequestLogTable(getLocal("RequestedAction"), Logurl);
                                                        errorMsg = GetCommonTranslatedValue("TimeoutLabel") + " " + xhr.status;
                                                        closeActionPopupLoading();
                                                        setTimeout(function () {
                                                            StoreRegionActionLocal(JSON.parse(currentRequest.Data.jsondata));
                                                        }, 500);
                                                        //forcePopupClose(popupName, errorMsg);
                                                    }
                                                    else if (textStatus == 'error') {
                                                        errorMsg = GetCommonTranslatedValue("InternalError") + " " + xhr.status;
                                                        closeActionPopupLoading();
                                                        setTimeout(function () {
                                                            StoreRegionActionLocal(JSON.parse(currentRequest.Data.jsondata));
                                                        }, 500);
                                                        //forcePopupClose(popupName, errorMsg);
                                                    }
                                                    else if (textStatus == 'abort') {
                                                        errorMsg = GetCommonTranslatedValue("RequestAborted") + " " + xhr.status;
                                                        closeActionPopupLoading();
                                                        setTimeout(function () {
                                                            StoreRegionActionLocal(JSON.parse(currentRequest.Data.jsondata));
                                                        }, 500);
                                                        //                                    forcePopupClose(popupName, errorMsg);
                                                    }
                                                    else if (textStatus == 'parsererror') {
                                                        errorMsg = GetCommonTranslatedValue("InternalParseError") + " " + xhr.status;
                                                        closeActionPopupLoading();
                                                        setTimeout(function () {
                                                            StoreRegionActionLocal(JSON.parse(currentRequest.Data.jsondata));
                                                        }, 500);
                                                        //                                    forcePopupClose(popupName, errorMsg);
                                                    }
                                                    else {
                                                        errorMsg = GetCommonTranslatedValue("NetworkLost");
                                                        closeActionPopupLoading();
                                                        setTimeout(function () {
                                                            StoreRegionActionLocal(JSON.parse(currentRequest.Data.jsondata));
                                                        }, 500);
                                                        //                                    forcePopupClose(popupName, errorMsg);
                                                    }
                                                    return;
                                                }
                                            }
                                        });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

/// <summary>
/// Method to store Region action.
/// </summary>
/// <param name="jsonData">holds the Result set.</param>
function StoreRegionActionLocal(jsonData) {
    try {
        var data = new Array();
        openDB();
        dB.transaction(function (ts) {
            var rowidquery = "SELECT COUNT(*) as ROWID FROM JSONdataTable";
            ts.executeSql(rowidquery, [], function (ts, rowresult) {
                var rowID = 0;
                if (rowresult.rows.length != 0) {
                    rowID = rowresult.rows.item(0).ROWID;
                }
                data.push(rowID + 1);
                data.push(jsonData[0].WONumber);
                var query1 = "SELECT MAX(SequenceNumber) as SequenceNumber FROM JSONdataTable WHERE WorkOrderNumber = '" + jsonData.WONumber + "'";
                ts.executeSql(query1, [], function (ts, result) {
                    if (result.rows.length > 0) {
                        var row = result.rows.item(0);
                        var num = row["SequenceNumber"];
                        var query = 'INSERT INTO JSONdataTable (ROW,WorkOrderNumber, SequenceNumber, urlID, jsondata) VALUES (?,?,?,?,?)';
                        data.push(num + 1);
                        data.push(2);
                        if (typeof (jsonData) == 'object') {
                            data.push(encryptStr(JSON.stringify(jsonData[0])));
                        }
                        ts.executeSql(query, data, function () {
                            //$.mobile.loading("hide");
                            $("#WillbeprocessedonsyncDiv").popup().popup("open");
                            setTimeout(function () {
                                CloseActionPopup()
                            }, 2000);
                        }, function () {
                            ////alert("Error");
                        });
                    }
                }, function () { });
            }, function (ts, e) { log(e); });
        });
    }
    catch (e) {
        fillExceptionTable(e.stack);
    }
}

$.postActionSTimeJSON = function (url, data, func) {
    if (splitUrl(url, 'UAT')) {
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
                                        {
                                            url: url,
                                            type: "post",
                                            headers: { "Origin": ORIGIN_HEADER },
                                            //headers: { "cache-control": "no-cache" },
                                            //jsonp: "callback",
                                            datatype: "json",
                                            //timeout: parseInt(processTime),
                                            //cache: false,
                                            async: true,
                                            data: data,
                                            success: function (result, textStatus, jqXHR) {

                                                RemoveRequest("success", jqXHR.ID);
                                                if (result[0] == "(" && result[result.length - 1] == ")") {
                                                    result = result.substring(1, result.length - 1);

                                                }

                                                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    result = JSON.parse(result);

                                                    func(result);
                                                }
                                            },
                                            error: function (xhr, textStatus, jqXHR) {

                                                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    //$.mobile.loading("hide");
                                                    RemoveRequest("Error", xhr.ID);
                                                    var pageID = $.mobile.activePage.attr('id');
                                                    var popupName = findPopupName(pageID);
                                                    var errorMsg = "";
                                                    if (textStatus == 'timeout') {
                                                        setActionOfflineDate();
                                                        //        errorMsg = "Request timeout, please try again."+ " "+ xhr.status;
                                                        //        forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'error') {
                                                        setActionOfflineDate();
                                                        //        errorMsg = "Internal error, please try again."+ " "+ xhr.status;
                                                        //        forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'abort') {
                                                        setActionOfflineDate();
                                                        //        errorMsg = "Request aborted, please try again."+ " "+ xhr.status;
                                                        //        forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'parsererror') {
                                                        setActionOfflineDate();
                                                        //        errorMsg = "Internal parse error, please try again."+ " "+ xhr.status;
                                                        //        forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else {
                                                        setActionOfflineDate();
                                                        //        errorMsg = "Network is too slow or network was lost during data processing, please retry.";
                                                        //        forcePopupClose(popupName,errorMsg);
                                                    }
                                                    return;
                                                }
                                            }
                                        });
        currentRequest.Request.ID = GenerateGuid();
        ajaxCalls.push(currentRequest);
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

/// <summary>
/// Method to set action offline.
/// </summary>
function setActionOfflineDate() {
    $(".DeviceTimeLabel").show();
    SetOfflineTime("WOActionETADateTime");
    SetOfflineTime("WOActionEnrouteDateTime");
    SetOfflineTime("ArrivedDate");
    SetOfflineTime("startLinkDate");
    SetOfflineTime("stopDate");
    SetOfflineTime("compDate");
}

$.ajaxAutoSyncPostJSON = function (url, sdata, func) {
    if (splitUrl(url, 'WEB')) {
        $.ajax(
               {
                   url: url,
                   type: "post",
                   headers: { "Origin": ORIGIN_HEADER },
                   //headers: { "cache-control": "no-cache" },
                   dataType: "json",
                   //timeout: parseInt(processTime),
                   //cache: false,
                   async: true,
                   data: sdata,
                   success: function (result) {
                       if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                           LogoutCompletely();
                       } else {
                           func(result);
                       }
                   },
                   error: function (xhr, textStatus, jqXHR) {
                       if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                           LogoutCompletely();
                       } else {
                           var pageID = $.mobile.activePage.attr('id');
                           var popupName = findPopupName(pageID);
                           var errorMsg = "";
                           if (textStatus == 'timeout' ||
                               textStatus == 'error' ||
                               textStatus == 'abort' ||
                               textStatus == 'parsererror') {
                               AutoSyncFailCount++;
                               autoSyncErrorHandling();
                           } else {
                               errorMsg = GetCommonTranslatedValue("NetworkLost");
                               forcePopupClose(popupName, errorMsg);
                           }
                       }
                   }
               });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

/// <summary>
/// Method to handel error during auto sync.
/// </summary>
function autoSyncErrorHandling() {
    autoSyncCompleted = 1;
    syncInProgress = 1;
    $(".SyncNotification").hide();
    if (AutoSyncFailCount == 1) {
        setTimeout(function () {
            $('#AutoSyncStatusPopup').popup('open');
        }, 500);
    }
    else if (AutoSyncFailCount == 2) {
        setTimeout(function () {
            showError(GetCommonTranslatedValue("AutoSyncError1") + '<p>' + GetCommonTranslatedValue("AutoSyncError2") + '</p>');
        }, 500);
        AutoSyncFailCount = 0;
    }
}
//// code to handle action request for regions ////////////////////////

////// code for Pre approval attachment //////////////////////////////

///<summary>
/// Method to get approver details.
/// </summary>
function GetApproverDetails(CodeType) {
    if (navigator.onLine) {
        var approvalCodeValue, appCodeControlId, approvalDetailDiv
        switch (CodeType) {
            case 'PreApproval':
                appCodeControlId = $('#PreApprovalCode');
                approvalCodeValue = $('#PreApprovalCode').val();
                approvalDetailDiv = $('#NewApprovalDetail');
                break;
            case 'InvoiceApproval':
                appCodeControlId = $('#InvoiceApprovalCode');
                approvalCodeValue = $('#InvoiceApprovalCode').val();
                approvalDetailDiv = $('#InvoiceNewApprovalDetail');
                break;
            case 'NTEApproval':
                appCodeControlId = $('#NTEApprovalCode');
                approvalCodeValue = $('#NTEApprovalCode').val();
                approvalDetailDiv = $('#NewNTEApproverDetails');
                break;
            default: console.log("The CodeType value is: " + CodeType);
                return;
        }
        if (approvalCodeValue == -1) {
            approvalDetailDiv.empty();
            return;
        }
        var myJSONobject = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
            "ApprovalCode": approvalCodeValue,
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetApproverDetails";
        showActionPopupLoading();
        $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
            closeActionPopupLoading();
            var ApprovalType, CurrentApproverData, controlName;
            ApprovalType = appCodeControlId.find('option:selected').attr('data-approvaltype');
            CurrentApproverData = createApprovalGrid(ApprovalType, resultData.Table, CodeType);
            approvalDetailDiv.html(CurrentApproverData);
            approvalDetailDiv.trigger('create');
        });
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to attach approval code.
/// </summary>
function AttachApprovalCode(CodeType) {
    if (navigator.onLine) {
        switch (CodeType) {
            case 'PreApproval':
                approvalCodeValue = $('#PreApprovalCode').val();
                break;
            case 'InvoiceApproval':
                approvalCodeValue = $('#InvoiceApprovalCode').val();
                break;
            case 'NTEApproval':
                approvalCodeValue = $('#NTEApprovalCode').val();
                break;
            default: console.log("The CodeType value is: " + CodeType);
                return;
        }
        if (approvalCodeValue == -1) {
            showError(GetTranslatedValue("ApprovalCodeRequiredMessage"));
            return;
        }
        var myJSONobject = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
            "SelectedView": "1",
            "CodeType": CodeType,
            "EmployeeName": decryptStr(getLocal("Username")),
            "ApprovalCode": approvalCodeValue,
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };

        var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=AttachApprovalCode";
        showActionPopupLoading();
        $.postActionJSON(accessURL, myJSONobject, function (resultData) {
            closeActionPopupLoading();
            ActionCallBack(resultData);
        });
    }

    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to create the approvers list on selection of approval code.
/// </summary>
/// <param name="ApprovalType">holds the value of approvaltype.</param>
/// <param name="data">holds the details.</param>
/// <param name="CodeType">holds the type of approval.</param>
function createApprovalGrid(ApprovalType, data, CodeType) {
    var approverContent = "";
    var blockA = "";
    var blockHeader = "";
    var blockData = "";

    /// <summary>
    /// Below condition will diable the save button if there are no approvers attached to selcted approval code.
    /// </summary>
    if (data.length == 0) {
        switch (CodeType) {
            case 'PreApproval':
                $('#NoPreApproverMessageDiv').css("display", "block");
                $('#PreApprovalSaveButton').addClass('ui-disabled');
                break;
            case 'InvoiceApproval':
                $('#NoInvoiceApproverMessageDiv').css("display", "block");
                $('#InvoiceApprovalSaveButton').addClass('ui-disabled');
                break;
            case 'NTEApproval':
                $('#NoNTEApproverMessageDiv').css("display", "block");
                $('#NTEApprovalSaveButton').addClass('ui-disabled');
                break;
            default:
                break;
        }
        return approverContent;
    }
    else {
        switch (CodeType) {
            case 'PreApproval':
                $('#NoPreApproverMessageDiv').css("display", "none");
                $('#PreApprovalSaveButton').removeClass('ui-disabled');
                break;
            case 'InvoiceApproval':
                $('#NoInvoiceApproverMessageDiv').css("display", "none");
                $('InvoiceApprovalSaveButton').removeClass('ui-disabled');
                break;
            case 'NTEApproval':
                $('#NoNTEApproverMessageDiv').css("display", "none");
                $('#NTEApprovalSaveButton').removeClass('ui-disabled');
                break;
            default:
                break;
        }
    }

    if (ApprovalType == 0) { ////Role based
        blockA = '<div class="ui-grid-a">';
        blockHeader = '<div class="ui-block-a"><strong>' + GetTranslatedValue("ApproverLabel") + '</strong></div>' +
                         '<div class="ui-block-b"></div>';
        if (data.length > 0) {
            for (var index = 0; index < data.length; index++) {
                blockData = blockData + '<div class="ui-block-a">' + data[index].Approver + '</div>' +
                            '<div class="ui-block-b"></div>';
            }
        }
        approverContent = blockA + blockHeader + blockData + '</div>';
    }
    else { //// Limit based
        blockA = '<div class="ui-grid-a">';
        blockHeader = '<div class="ui-block-a"><strong>' + GetTranslatedValue("ApproverLabel") + '</strong></div>' +
                         '<div class="ui-block-b"><strong>' + GetTranslatedValue("ThresholdLimitLabel") + '</strong></div>';
        if (data.length > 0) {
            for (var index = 0; index < data.length; index++) {
                blockData = blockData + '<div class="ui-block-a">' + data[index].Approver + '</div>' +
                            '<div class="ui-block-b">' + data[index].ThresholdAmount + ' ' + data[index].CurrencyCode + '</div>';
            }
        }
        approverContent = blockA + blockHeader + blockData + '</div>';
    }
    return approverContent;
}

/// <summary>
/// Method to bind approval codes to drop down and populate current approvers list if any.
/// </summary>
/// <param name="resultData">holds the resultant value.</param>
function bindApprovalPopupData(resultData) {
    var approvalCodeId, currentApprovalCodeId, CurrentApproverDetailsId;
    var CodeType = getLocal("RequestedAction");
    switch (CodeType) {
        case 'PreApproval':
            approvalCodeId = $('#PreApprovalCode');
            currentApprovalCodeID = $('#currentApprovalCode');
            CurrentApproverDetailsId = $('#CurrentApproverDetails');
            break;
        case 'InvoiceApproval':
            approvalCodeId = $('#InvoiceApprovalCode');
            currentApprovalCodeID = $('#InvoiceCurrentApprovalCode');
            CurrentApproverDetailsId = $('#InvoiceCurrentApproverDetails');
            break;
        case 'NTEApproval':
            approvalCodeId = $('#NTEApprovalCode');
            currentApprovalCodeID = $('#CurrentNTEApprovalCode');
            CurrentApproverDetailsId = $('#CurrentNTEApproverDetails');
            break;
        default: console.log("The CodeType value is: " + CodeType);
            return;
    }

    var approvalCodelength = resultData.Table1.length;
    var approverListLength = resultData.Table.length;

    if (approvalCodelength > 0) {
        for (index = 0; index < approvalCodelength; index++) {
            var tag = document.createElement('option');
            tag.setAttribute("value", resultData.Table1[index].ApprovalCode);
            tag.setAttribute("data-approvaltype", resultData.Table1[index].ApprovalType);
            tag.innerHTML = resultData.Table1[index].Description;
            approvalCodeId.append(tag);
        }
    }

    if (approverListLength > 0) {
        if (CodeType != 'NTEApproval') {
            approvalCodeId.val(resultData.Table[0].ApprCode);
            approvalCodeId.selectmenu('refresh');
            approvalCodeId.find('option:selected').attr('data-approvaltype');
            currentApprovalCodeID.append(approvalCodeId.find('option:selected').text());
            var currentApproverData = createCurrentApproverList(resultData.Table, approvalCodeId.find('option:selected').attr('data-approvaltype'));
            CurrentApproverDetailsId.html(currentApproverData);
            CurrentApproverDetailsId.trigger('create');
        }
        else {
            approvalCodeId.val(resultData.Table[0].ApprovalCode);
            approvalCodeId.selectmenu('refresh');
            approvalCodeId.find('option:selected').attr('data-approvaltype');
            currentApprovalCodeID.append(approvalCodeId.find('option:selected').text());
            var currentApproverData = createCurrentApproverList(resultData.Table, approvalCodeId.find('option:selected').attr('data-approvaltype'));
            CurrentApproverDetailsId.html(currentApproverData);
            CurrentApproverDetailsId.trigger('create');
        }
    }
    else {
        approvalCodeId.val('-1');
        approvalCodeId.selectmenu('refresh');
    }
}

/// <summary>
/// Method to create the approvers list on selection of approval code.
/// </summary>
/// <param name="approverList">holds the value of approvaltype.</param>
/// <param name="type">holds the value of approvaltype.</param>
function createCurrentApproverList(approverList, type) {
    var approverContent = "";
    var blockB = "";
    var blockHeader = "";
    var blockData = "";

    blockB = '<div class="ui-grid-b">';
    blockHeader = '<div class="ui-block-a"><strong>' + GetTranslatedValue("ApproverLabel") + '</strong></div>' +
                  '<div class="ui-block-b"><strong>' + GetTranslatedValue("ApprovalResultLabel") + '</strong></div>' +
                  '<div class="ui-block-c"><strong>' + GetTranslatedValue("ResultDateLabel") + '</strong></div>';

    for (var index = 0; index < approverList.length; index++) {
        blockData = blockData + '<div class="ui-block-a">' + (IsStringNullOrEmpty(approverList[index].Approver) ? "" : approverList[index].Approver) + '</div>' +
                        '<div class="ui-block-b">' + (IsStringNullOrEmpty(approverList[index].ApprovalResultText) ? GetCommonTranslatedValue("NotApplicableLabel") : approverList[index].ApprovalResultText) + '</div>' +
                        '<div class="ui-block-c">' + (IsStringNullOrEmpty(approverList[index].ResultDate) ? "" : approverList[index].ResultDate + ' ' + approverList[index].TimeZone) + '</div>';
    }
    approverContent = blockB + blockHeader + blockData + '</div>';
    return approverContent;
}
////// code for Pre approval attachment //////////////////////////////
/// <summary>
/// Method to bind labour hours.
/// </summary>
function BindLaborHours() {
    try {
        var logSelectQuery = "SELECT distinct WOLaborHour FROM WorkOrderDetailsTable  WHERE WorkOrderNumber = '" + getLocal("WorkOrderNumber") + "'";
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(logSelectQuery, [], function (te, result) {
                if (result.rows.length != 0) {
                    $("#totalLaborValueLabel").html(decryptStr(result.rows.item(0).WOLaborHour));
                }
            });
        });
    }
    catch (e) {
    }
}

/// <summary>
/// Method to bind material total.
/// </summary>
function BindMaterialTotal() {
    try {
        var parentCurrencyCode;
        var parentConversionRate;
        var childCurrencyCode;
        var parentOrderQuery = "SELECT ParentWorkorder,CurrencyCode, ParentCurrency, ParentConversionRate, GrandTotal  FROM WOMaterialTable WHERE WorkOrderNumber = '" + getLocal("WorkOrderNumber") + "'";
        var childOrderQuery = "SELECT GrandTotal FROM WOMaterialTable  WHERE ParentWorkOrder = '" + getLocal("WorkOrderNumber") + "'";
        var childOrderGrandTotal = parseFloat(0.00);
        openDB();

        dB.transaction(function (ts) {
            ts.executeSql(parentOrderQuery, [], function (te, result) {
                if (result.rows.length != 0) {
                    if (result.rows.item(0).ParentWorkorder != null) {
                        childCurrencyCode = decryptStr(result.rows.item(0).CurrencyCode);
                        parentCurrencyCode = decryptStr(result.rows.item(0).ParentCurrency);
                        parentConversionRate = decryptStr(result.rows.item(0).ParentConversionRate);
                        if (parentCurrencyCode != childCurrencyCode) {
                            var total = (parseFloat(decryptStr(result.rows.item(0).GrandTotal)) / parseFloat(parentConversionRate)).toFixed(2);
                        }

                        $("#totalMaterialValueLabel").append(total).toFixed(2);
                    }
                }
                else {
                    dB.transaction(function (tc) {
                        tc.executeSql(childOrderQuery, [], function (te, result) {
                            if (result.rows.length != 0) {
                                for (var childOrder = 0; childOrder < result.rows.length; childOrder++) {
                                    childOrderGrandTotal = (parseFloat(childOrderGrandTotal) + parseFloat(decryptStr(result.rows.item(childOrder).GrandTotal))).toFixed(2);
                                }
                                $("#totalMaterialValueLabel").append(childOrderGrandTotal);
                            }
                        });
                    });
                }
            });
        });
    }
    catch (e) {
    }
}

/// <summary>
/// Method to submit NTE increase.
/// </summary>
function SubmitNTEIncrease() {
    if (navigator.onLine) {
        if (NTEDefaultValueInt == 1) {
            NTEIncreaseApproval();
        }
        else {
            var SelectViewFlag;
            if ($('#ApproverListDropDown').val() == -1) {
                SelectViewFlag = "2";
            }
            else {
                SelectViewFlag = "1";
            }


            if ($("#ProposedNTEValue").val().length == 0) {
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("ProposedNTERequiredMessage"));
                }, 1000);
                return;
            }

            if (!$("#ApprovalDropDownMainDiv").hasClass("ui-disabled")) {
                if ($('#ApproverListDropDown').val() == "-1" || $('#ApproverListDropDown').val() == "-2") {
                    closeActionPopupLoading();
                    setTimeout(function () {
                        showError(GetTranslatedValue("ApproverRequiredMessage"));
                    }, 1000);
                    return;
                }
            }

            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                "SelectedView": SelectViewFlag,
                "ProposedNTE": $("#ProposedNTEValue").val(),
                "ApproverListDropDownVal": $('#ApproverListDropDown').val(),
                "CodeType": "NTEIncrease",
                "TransType": "NTEIncrease",
                "NTEIncreaseComment": $("#NTECommentsTextarea").val(),
                "NTEApprovalCode": getLocal("NTEApprovalCodeVal"),
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "SessionID": decryptStr(getLocal("SessionID"))
            };

            var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=SetNTEIncrease";
            showActionPopupLoading();
            $.postActionJSON(accessURL, myJSONobject, function (resultData) {
                closeActionPopupLoading();
                ActionCallBack(resultData);
            });
        }
    }
}

/// <summary>
/// Method to check deligation of authority.
/// </summary>
function CheckDelegationOfAuthority() {
    if (navigator.onLine) {
        if (NTEDefaultValueInt == 0) {
            var costPerUnit = $('#ProposedNTEValue').val().trim();
            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                "ProposedNTEVal": costPerUnit,
                "SessionID": decryptStr(getLocal("SessionID"))
            };

            var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=CheckDelegationOfAuthority";
            $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
                if (resultData != null) {
                    if (resultData.Table[0]["CalculatedDelegationAmount"] != null) {
                        $('#ApprovalDropDownMainDiv').addClass('ui-disabled');
                    }
                    else {
                        $('#ApprovalDropDownMainDiv').removeClass('ui-disabled');
                    }
                }
                else {
                    $('#ApprovalDropDownMainDiv').removeClass('ui-disabled');
                }
            });
        }
        else {
            var costPerUnit = $('#ProposedNTEValue').val().trim();
            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                "ProposedNTEVal": costPerUnit,
                "SeletedView": 6,
                "SessionID": decryptStr(getLocal("SessionID"))
            };

            var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=FetchCurrentNTE";
            $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
                if (resultData != null) {
                    if (resultData.Table[0]["MaxAmountLimit"] != null) {
                        if (costPerUnit > resultData.Table[0]["MaxAmountLimit"]) {
                            showError(GetTranslatedValue("NTEExceedDelegationMessage"));
                            $("#ProposedNTEValue").val('');
                            $("#NTESubmitButton").addClass('ui-disabled');
                            return;
                        }
                        else {
                            $("#NTESubmitButton").removeClass('ui-disabled');
                        }
                    }
                }
            });
        }
    }
}

/// <summary>
/// Method to increase NIT approval.
/// </summary>
function NTEIncreaseApproval() {
    if (navigator.onLine) {

        if ($("#ProposedNTEValue").val().length === 0) {
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("ProposedNTERequiredMessage"));
            }, 1000);
            return;
        }

        var myJSONobject = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
            "CodeType": "NTEApproval",
            "SelectedView": 1,
            "ProposedNTE": $("#ProposedNTEValue").val(),
            "NTEIncreaseComment": $("#NTECommentsTextarea").val(),
            "NTEApprovalCode": getLocal("NTEApprovalCodeVal"),
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };

        var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=SetNTEIncrease";
        showActionPopupLoading();
        $.postActionJSON(accessURL, myJSONobject, function (resultData) {
            closeActionPopupLoading();
            ActionCallBack(resultData);
        });
    }
}

/// <summary>
/// Method to create the approvers list on selection of approval code.
/// </summary>
function BindNTEDropDownData() {
    if ($('#ApproverListDropDown').val() != "-1" || $('#ApproverListDropDown').val() != "-2") {
        var currencyCode = $('#ApproverListDropDown').val();
        $('#ApproverListDropDown').val(currencyCode);
        $('#ApproverListDropDown').selectmenu("refresh", true);
    }
}

/// <summary>
/// Method to validate entered Complete DateTime
/// </summary>
function ValidateDateTime() {
    var now = new Date();
    var completeTime = $.trim(getLocal('CompleteTime'));
    now.setMinutes(now.getMinutes() + parseInt(completeTime));
    var selectedDate = GetDateObjectFromInvariantDateString($("#compDate").val());
    if (selectedDate > now) {
        $("#compDate").val(dateControler.currentDate)
        showError(GetTranslatedValue("InvalidDateMessage") + " " + GetDateTimeToDisplay(now) + ".");
        //showError("Actual Complete date should not be greater than" + " " + GetDateTimeToDisplay(now) + ".");
    } else {
        dateControler.currentDate = $("#compDate").val();
    }
}

/// <summary>
/// Method to convert the datetime to display
/// </summary>
function GetDateTimeToDisplay(data) {
    try {
        var param1 = new Date(data);
        var date = strPad(param1.getDate(), 2);
        var month = strPad(param1.getMonth() + 1, 2);
        var year = param1.getFullYear();
        var minutes = strPad(param1.getMinutes(), 2);
        var amPm = "";
        var monthToDisp = "";
        var hours;
        if (param1.getHours() == 12) {
            hours = 12;
        }
        else {
            hours = strPad(param1.getHours(), 2) % 12;
        }

        if (hours > 12 || param1.getHours() == 12) {
            amPm = GetCommonTranslatedValue("PMLabel");
        }
        else {
            amPm = GetCommonTranslatedValue("AMLabel");
        }
        switch (month) {
            case '01': monthToDisp = GetCommonTranslatedValue("JanuaryShort");
                break;
            case '02': monthToDisp = GetCommonTranslatedValue("FebruaryShort");
                break;
            case '03': monthToDisp = GetCommonTranslatedValue("MarchShort");
                break;
            case '04': monthToDisp = GetCommonTranslatedValue("AprilShort");
                break;
            case '05': monthToDisp = GetCommonTranslatedValue("MayShort");
                break;
            case '06': monthToDisp = GetCommonTranslatedValue("JuneShort");
                break;
            case '07': monthToDisp = GetCommonTranslatedValue("JulyShort");
                break;
            case '08': monthToDisp = GetCommonTranslatedValue("AugustShort");
                break;
            case '09': monthToDisp = GetCommonTranslatedValue("SeptemberShort");
                break;
            case '10': monthToDisp = GetCommonTranslatedValue("OctoberShort");
                break;
            case '11': monthToDisp = GetCommonTranslatedValue("NovemberShort");
                break;
            case '12': monthToDisp = GetCommonTranslatedValue("DecemberShort");
                break;
        }
        var param2 = monthToDisp + ' ' + date + ' ' + year + ' ' + hours + ':' + minutes + ' ' + amPm;
        return param2;
    }
    catch (e) {
        log(e);
    }
}

/// <summary>
/// Method to validate Start Date
/// </summary>
function ValidateStartDate() {
    var now = new Date();
    var selectedDate = GetDateObjectFromInvariantDateString($("#startLinkDate").val());
    if (selectedDate > now) {
        showError(GetTranslatedValue("StartDateLinkInvalid"));
        //showError("Start date should not be in future.");
        $("#startLinkDate").val(dateControler.currentStartDate);
    }
    else {
        dateControler.currentStartDate = $("#startLinkDate").val();
    }
}

// Configure all dropdowns and shared translation objects.
function ActionsPopup_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var deviceTime = GetTranslatedValue("DeviceTimeLabel");
    var dateTimeLabel = GetTranslatedValue("DateTimeLabel");
    var assignmentTypeLabel = GetTranslatedValue("AssignTypeDDLOption");
    var employeeLabel = GetTranslatedValue("EmployeeDDLOption");
    var managerLabel = GetTranslatedValue("ManagerDDLOption");
    var vendorLabel = GetTranslatedValue("VendorDDLOption");
    var callCenterLabel = GetTranslatedValue("CallCenterDDLOption");
    var assignmentLabel = GetTranslatedValue("ReassignAssignmentPickDDLOption");
    var reassignAttachmentsLabel = GetTranslatedValue("IncludeAttachmentsLabel");
    var holdLabel = GetTranslatedValue("HoldStopToggleDDLOption");
    var completeLabel = GetTranslatedValue("CompleteStopToggleDDLOption");
    var selectPropertyLabel = GetTranslatedValue("SelectPropertyDropDownOptions");
    var setEquipmentTagLabel = GetTranslatedValue("SetEquipmentTagDropDownOption");
    var okButtonLabel = GetCommonTranslatedValue("OkLabel");
    var alertMessage = GetTranslatedValue("WillBeProcessedMessage");
    var resolutionCodeLabel = GetTranslatedValue("ResolutionCodeDDSelectLabel");
    var changeApprovalLabel = GetTranslatedValue("ChangeApprovalCodeLabel");
    var noApproverLabel = GetTranslatedValue("NoApproverMessage");
    var saveButton = GetTranslatedValue("ApprovalSaveButton");
    var currentApprovalLabel = GetTranslatedValue("CurrentApprovalCode");
    var addCommentsButtonLabel = GetTranslatedValue("AddCommentsSubmitButton");
    var addAttachmentButtonLabel = GetTranslatedValue("AttachmentSubmitBtn");
    var submitButton = GetTranslatedValue("NTESubmitButton");
    var commentsLabel = GetTranslatedValue("AddCommentsLabel");
    var conditionLabel = GetTranslatedValue("conditionLabel");
    var yesLabel = GetCommonTranslatedValue("YesLabel");
    var noLabel = GetCommonTranslatedValue("NoLabel");
    var selectPartLabel = GetTranslatedValue("EquipPartNumberDropDown");
    var selectWarehouseLabel = GetTranslatedValue("WarehouseNumberDropDown");
    var selectBinLabel = GetTranslatedValue("BinNumberDropDown");
    var selectHTMLOpen = '<option value="-1">';
    var optionClose = '</option>';

    var reassignAssignTypeHTML = selectHTMLOpen + assignmentTypeLabel + optionClose;
    var stopToggleHTML = '<option value="0" selected="selected">' + holdLabel + optionClose
                        + '<option value="1">' + completeLabel + optionClose;
    var genericSelectHTML = selectHTMLOpen + selectLabel + optionClose;
    var propertySelectHTML = selectHTMLOpen + selectPropertyLabel + optionClose;
    var selectTagHTML = selectHTMLOpen + setEquipmentTagLabel + optionClose;
    var resolutionCodeSelectHTML = selectHTMLOpen + resolutionCodeLabel + optionClose;
    var conditionSelectHTML = selectHTMLOpen + conditionLabel + optionClose;

    var partSelectHTML = selectHTMLOpen + selectPartLabel + optionClose;
    var warehouseSelectHTML = selectHTMLOpen + selectWarehouseLabel + optionClose;
    var binSelectHTML = selectHTMLOpen + selectBinLabel + optionClose;

    $(pageID).find("#ETADeviceTimeLabel").text(deviceTime);
    $(pageID).find("#ETADateTimeLabel").text(dateTimeLabel);
    $(pageID).find("#EnrouteDeviceTimeLabel").text(deviceTime);
    $(pageID).find("#EnrouteDateTimeLabel").text(dateTimeLabel);
    $(pageID).find("#ArrivedDeviceTimeLabel").text(deviceTime);
    $(pageID).find("#ArrivedDateTimeLabel").text(dateTimeLabel);
    $(pageID).find("#StartDeviceTimeLabel").text(deviceTime);
    $(pageID).find("#startDateLabel").text(dateTimeLabel);
    $(pageID).find("#StopDeviceTimeLabel").text(deviceTime);
    $(pageID).find("#StopDateTimeLabel").text(dateTimeLabel);
    $(pageID).find("#CompleteDeviceTimeLabel").text(deviceTime);
    $(pageID).find("#CompleteDateTimeLabel").text(dateTimeLabel);
    $(pageID).find("#ReassignAssignTypeDDL").html(reassignAssignTypeHTML).selectmenu("refresh");
    $(pageID).find("#ReassignAssignmentPickDDL").html(genericSelectHTML.replace(selectLabel, assignmentLabel)).selectmenu("refresh");
    $(pageID).find('[data-field="Include_Attachments"] .ui-btn-text').text(reassignAttachmentsLabel);
    $(pageID).find("#stopToggleDropDown").html(stopToggleHTML).selectmenu("refresh");
    $(pageID).find("#RefrigerantUsedToggles").next().find(".ui-slider-label-a").text(yesLabel);
    $(pageID).find("#RefrigerantUsedToggles").next().find(".ui-slider-label-b").text(noLabel);
    $(pageID).find("#RefrigerantLeakToggles").next().find(".ui-slider-label-a").text(yesLabel);
    $(pageID).find("#RefrigerantLeakToggles").next().find(".ui-slider-label-b").text(noLabel);
    $(pageID).find("#ResolutionCodeDD").html(resolutionCodeSelectHTML).selectmenu("refresh");
    $(pageID).find("#SPidDDL").html(propertySelectHTML).selectmenu("refresh");
    $(pageID).find("#SFloorValue").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#SRoomValue").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#SetEquipmentTagDropDown").html(selectTagHTML).selectmenu("refresh");
    $(pageID).find("#FieldPOVendorList").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#PhoneFixCommentsLabel").text(commentsLabel);
    $(pageID).find("#NTECommentsLabel").text(commentsLabel);
    $(pageID).find("#SourceDropDown").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#attachmentCheckLabel").text(addAttachmentButtonLabel);

    // Approval stuff
    $(pageID).find("#currentApprovalCode").text(currentApprovalLabel);
    $(pageID).find("#PreApprovalCodeLabel").text(changeApprovalLabel);
    $(pageID).find("#PreApprovalCode").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#NoPreApproverMessage").text(noApproverLabel);
    $(pageID).find("#PreApprovalSaveButton").text(saveButton);

    $(pageID).find("#InvoiceCurrentApprovalCode").text(currentApprovalLabel);
    $(pageID).find("#InvoiceApprovalCodeLabel").text(changeApprovalLabel);
    $(pageID).find("#InvoiceApprovalCode").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#NoInvoiceApproverMessage").text(noApproverLabel);
    $(pageID).find("#InvoiceApprovalSaveButton").text(saveButton);

    $(pageID).find("#CurrentNTEApprovalCode").text(currentApprovalLabel);
    $(pageID).find("#NTEApprovalCodeLabel").text(changeApprovalLabel);
    $(pageID).find("#NTEApprovalCode").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#NoNTEApproverMessage").text(noApproverLabel);
    $(pageID).find("#NTEApprovalSaveButton").text(saveButton);

    // End Approval stuff
    $(pageID).find("#ApproverListDropDown").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#conditionDropDown").html(conditionSelectHTML).selectmenu("refresh");
    $(pageID).find("#CompConditionDropDown").html(conditionSelectHTML).selectmenu("refresh");
    $(pageID).find("#ReliabilityProblemDropDown").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#ReliabilityCauseDropDown").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#ReliabilityResolutionDropDown").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#AddCommentDDL").html(genericSelectHTML).selectmenu("refresh");
    $(pageID).find("#AlertMessageText1").text(alertMessage);
    $(pageID).find("#AlertMessageText2").text(alertMessage);
    $(pageID).find("#okButton1").text(okButtonLabel);
    $(pageID).find("#okButton2").text(okButtonLabel);
    $(pageID).find("#okButton3").text(okButtonLabel);


    // Material PO
    $(pageID).find('#EquipPartNumberDropDown').html(partSelectHTML).selectmenu("refresh");
    $(pageID).find('#WarehouseNumberDropDown').html(warehouseSelectHTML).selectmenu("refresh");
    $(pageID).find('#BinNumberDropDown').html(binSelectHTML).selectmenu("refresh");
    if (getLocal("RequestedAction").indexOf("AddAttachment") != -1) {
        $(pageID).find("#AddCommentSubmitButton").html(addAttachmentButtonLabel);
    } else if (getLocal("RequestedAction").indexOf("AddComment") != -1) {
        $(pageID).find("#AddCommentSubmitButton").html(addCommentsButtonLabel);
    }

    BindReassignmentDropDown(400009, 2, "CanAccess");
}

function BindReassignmentDropDown(mID, tokenID, checkBit) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var tokens = $.GetSecuritySubTokens(mID, tokenID);
    $(pageID).find("#ReassignAssignTypeDDL").html('<option value="-1">' + GetTranslatedValue("AssignTypeDDLOption") + '</option>');

    if ($.GetSecuritySubTokensBit(tokens, tokenID, "Reassign_Type_Tech", checkBit)) {
        $(pageID).find("#ReassignAssignTypeDDL").append('<option value="Employee">' + GetTranslatedValue("EmployeeDDLOption") + '</option>');
    }
    if ($.GetSecuritySubTokensBit(tokens, tokenID, "Reassign_Type_Manager", checkBit)) {
        $(pageID).find("#ReassignAssignTypeDDL").append('<option value="Manager">' + GetTranslatedValue("ManagerDDLOption") + '</option>');
    }
    if ($.GetSecuritySubTokensBit(tokens, tokenID, "Reassign_Type_Vendor", checkBit)) {
        $(pageID).find("#ReassignAssignTypeDDL").append('<option value="Vendor">' + GetTranslatedValue("VendorDDLOption") + '</option>');
    }
    if ($.GetSecuritySubTokensBit(tokens, tokenID, "Reassign_Type_CallCenter", checkBit)) {
        $(pageID).find("#ReassignAssignTypeDDL").append('<option value="CallCenter">' + GetTranslatedValue("CallCenterDDLOption") + '</option>');
    }

    $(pageID).find("#ReassignAssignTypeDDL").selectmenu("refresh");
    $(pageID).find("#ReassignAssignmentPickDDL").html('<option value="-1">' + GetTranslatedValue("ReassignAssignmentPickDDLOption") + '</option>');
    $(pageID).find("#ReassignAssignmentPickDDL").selectmenu("refresh");
    $(pageID).find("#ReassignAssignmentPickDDL").selectmenu("disable");

}

function CheckSecurityForConditionAssessment(SgtCollection) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    switch (getLocal("RequestedAction")) {
        case "Complete":
            if ($.GetSecuritySubTokensBit(SgtCollection, 2, "Complete:Condition Assessment", "CanAccess")) {
                $(pageID).find("#CompleteConditionAssessmentPanel").show();
            } else {
                $(pageID).find("#CompleteConditionAssessmentPanel").hide();
            }
            break;
        case "Stop":
            if ($.GetSecuritySubTokensBit(SgtCollection, 2, "Stop:Condition Assessment", "CanAccess")) {
                $(pageID).find("#CompleteConditionAssessmentPanel").show();
            } else {
                $(pageID).find("#CompleteConditionAssessmentPanel").hide();
            }
            break;
    }
}

function CheckSecurityForRefrigerant(SgtCollection) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    switch (getLocal("RequestedAction")) {
        case "Complete":
            if ($.GetSecuritySubTokensBit(SgtCollection, 2, "Complete:Refrigerant Entry", "CanAccess") && getLocal("IsRefrigerantEligible") === 'true') {
                $(pageID).find("#RefrigerantPanel").show();
            } else {
                $(pageID).find("#RefrigerantPanel").hide();
            }
            break;
        case "Stop":
            if ($.GetSecuritySubTokensBit(SgtCollection, 2, "Stop:Refrigerant Entry", "CanAccess") && getLocal("IsRefrigerantEligible") === 'true') {
                $(pageID).find("#RefrigerantPanel").show();
            } else {
                $(pageID).find("#RefrigerantPanel").hide();
            }
            break;
    }
}

function CheckRefrigerant() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    try {
        if ($(pageID + " #RefrigerantUsedToggles").val() == "1") {
            $(pageID + " #RefrigerantContainer").show();
        }
        else {
            $(pageID + " #RefrigerantContainer").hide();
        }
    }
    catch (e) {
    }
}

/**
* Fetch and return a list of available conditions and information about the current tag.
* @returns [Deferred] Object that contains the status of the function and a result object of the two entities.
*/
function GetTagConditionInfo() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var asyncStatus = $.Deferred();
    var jsonData = {
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        SessionID: decryptStr(getLocal("SessionID")),
        Language: getLocal("Language"),
        Option: 5,
        TagNumber: getLocal("TagNumber")
    };

    $.postJSON(standardAddress + "AssetManager.ashx?method=GetWOCondition", jsonData, function (result) {
        var jsonResult = {};
        try {
            jsonResult.Data = $.parseJSON(result.Data);
            jsonResult.PdaSearch = $.parseJSON(result.PdaSearch);
        } catch (e) {

        }

        asyncStatus.resolve(jsonResult);
    });

    return asyncStatus.promise();
}

function PopulateRefrigerantDropdown() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var jsonData = {
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        SessionID: decryptStr(getLocal("SessionID"))
    };

    $.postJSON(standardAddress + "AssetManager.ashx?method=GetRefrigerant", jsonData, function (result) {

        for (var index = 0; index < result.length; index++) {
            var listitem = document.createElement('option');
            listitem.innerHTML = result[index].PODescription;
            listitem.setAttribute("value", result[index].EquipPartSeq);
            $(pageID + " #RefrigerantDropDown").append(listitem);
        }
        $(pageID + " #RefrigerantDropDown option:first").attr('selected', 'selected');
        $(pageID + " #RefrigerantDropDown").selectmenu("refresh");
    });
}
function PrepareSource() {
    var data = {
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        SessionID: decryptStr(getLocal("SessionID"))
    };

    $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetSource", data, function (result) {
        for (index = 0; index < result.Table.length; index++) {
            var listItem = document.createElement('option');
            if (!IsStringNullOrEmpty(result.Table[index].SourceName)) {
                listItem.setAttribute("value", result.Table[index].SourceName);
                listItem.innerHTML = result.Table[index].SourceName;
                $('#SourceDropDown').append(listItem);
            }
        }

        $('#SourceDropDown').val(getLocal("WOSource")).selectmenu("refresh");
        // Get work order values and populate them.
        $("#CallerNameValue").val(getLocal("RequestedBy"));
        $('#SetSource').show();
        if ($('#SourceDropDown').val() === "TOS") {
            $("#CallerNameContainer").show();
        } else {
            $("#CallerNameContainer").hide();
        }
    });
}

function PostSourceUpdate() {
    try {
        var cleanRequestedByVal = '';
        var cleanReasonForChangeVal = '';

        // Validate and cleanse the data.
        if ($("#CallerNameValue").val() !== "") {
            cleanRequestedByVal = securityError($("#CallerNameValue"));
            $("#CallerNameValue").val(cleanRequestedByVal);
        }

        if ($("#ReasonForChangeValue").val() !== "") {
            cleanReasonForChangeVal = securityError($("#ReasonForChangeValue"));
            $("#ReasonForChangeValue").val(cleanReasonForChangeVal);
        }

        if ($("#SourceDropDown").val() != -1 && cleanReasonForChangeVal != '') {
            if (($("#SourceDropDown").val() === "TOS" && cleanRequestedByVal != '') || $("#SourceDropDown").val() !== "TOS") {
                // Process and submit update.
                var jsondata = {
                    DatabaseID: decryptStr(getLocal("DatabaseID")),
                    Language: getLocal("Language"),
                    EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
                    Source: $("#SourceDropDown").val(),
                    RequestedBy: cleanRequestedByVal,
                    ReasonForChange: cleanReasonForChangeVal,
                    WorkOrderNumber: $.trim(getLocal("WorkOrderNumber")),
                    GPSLocation: GlobalLat + "," + GlobalLong,
                    SessionID: decryptStr(getLocal("SessionID"))
                };
                var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=SetSource";
                $.postActionJSON(accessURL, jsondata, function (resultData) {
                    closeActionPopupLoading();
                    ActionCallBack(resultData);
                });
            } else {
                // TOS Source has special handling. Still invalid.
                closeActionPopupLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("AllFieldsRequiredMessage"));
                }, 1000);
                return;
            }
        } else {
            // Not valid data set.
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("AllFieldsRequiredMessage"));
            }, 1000);
            return;
        }
    }
    catch (e) {
    }
}

function UpdateSource() {
    if ($('#SourceDropDown').val() === "TOS") {
        $("#CallerNameContainer").show();
    } else {
        $("#CallerNameContainer").hide();
    }
}

/**
* This will reconfigure the start pane after completing a pre-start action.
*/
function ConfigureStart() {
    var actionText = getLocal("RequestedActionText");
    $(".actionDiv").addClass("ui-screen-hidden");
    $("#CommentDDLDiv").hide();
    $(".SiteTZLabel").html(getLocal("SiteTZ"));
    $("#totalLaborValueLabel").html(getLocal("WOLaborHour"));
    var actionID = getLocal("RequestedAction");
    if (actionID.indexOf("AddComment") == -1) {
        $("#" + actionID).removeClass("ui-screen-hidden");
    }

    if (actionID.indexOf("AddAttachment") == -1 && actionID.indexOf("FieldPO") == -1 && actionID.indexOf("PhoneFix") == -1
      && actionID.indexOf("PreApproval") == -1 && actionID.indexOf("InvoiceApproval") == -1 && actionID.indexOf("NTEApproval") == -1
      && actionID.indexOf("NTEIncrease") == -1 && actionID.indexOf("MaterialPO") == -1) {
        $("#AddComment").removeClass("ui-screen-hidden");
    }

    $("#AddCommentSubmitButton").html($("#" + actionID).find(".hidden-a-tag").html());
    $("#selectedAction").html(actionText);

    $(pageID).find("#commentstarIcon").hide();

    $(pageID).find("textarea").val('');
    PopulateCommentDDL();
}

// This is the array to store dropdown information for the ReliabilityData.
var ReliabilityData = {};

/**
* This will configure the dropdowns and set up the array for use with the Reliability Data action.
*/
function PrepareReliabilityData() {
    var data = {
        DatabaseID: decryptStr(getLocal("DatabaseID")),
        Language: getLocal("Language"),
        SessionID: decryptStr(getLocal("SessionID")),
        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
        WorkOrderNumber: getLocal("WorkOrderNumber")
    };

    $.postJSON(standardAddress + "WorkOrderActions.ashx?methodname=GetReliabilityData", data, function (result) {
        ReliabilityData = result.DropDownCollection;

        PopulateReliabilityDropDown($("#ReliabilityProblemDropDown"));
        PopulateReliabilityDropDown($("#ReliabilityCauseDropDown"));
        PopulateReliabilityDropDown($("#ReliabilityResolutionDropDown"));

        // Now update the dropdowns with the provided value from the work order.
        if (result.ProblemID != null) {
            $("#ReliabilityProblemDropDown").val(result.ProblemID).selectmenu("refresh");
        }

        if (result.CauseID != null) {
            $("#ReliabilityCauseDropDown").val(result.CauseID).selectmenu("refresh");
        }

        if (result.ResolutionID != null) {
            $("#ReliabilityResolutionDropDown").val(result.ResolutionID).selectmenu("refresh");
        }
    });
}

/**
* This will populate a given dropdown with expected level of the three Reliability Data tables.
* @param {Object} dropDownEntity - The object to populate.
*/
function PopulateReliabilityDropDown(dropDownEntity) {
    var dropDownParam = $(dropDownEntity).attr('data-dropdown-result');
    var dropDownDescription;
    var filteredData;
    $(dropDownEntity).find("option:gt(0)").remove();

    // Default case will assume we're populating the top level dropdown. Otherwise, filter the data so we know what to
    // populate and identify which field is the description.
    switch (dropDownParam) {
        case "CauseID":
            filteredData = ReliabilityData.filter(function (arrayItem) {
                return arrayItem.TypeID == 1;
            });
            break;
        case "ResolutionID":
            filteredData = ReliabilityData.filter(function (arrayItem) {
                return arrayItem.TypeID == 2;
            });
            break;
        default:
            filteredData = ReliabilityData.filter(function (arrayItem) {
                return arrayItem.TypeID == 0;
            });
            break;
    }

    // Create each distinct entity and add it to the dropdown.
    filteredData.forEach(function (entity) {
        if ($(dropDownEntity).find('option[value="' + entity.ReliabilityID + '"]').length == 0 &&
            entity.ReliabilityID != null) {
            var optionTag = document.createElement('option');
            optionTag.setAttribute("value", entity.ReliabilityID);
            optionTag.innerHTML = entity.Description;

            $(dropDownEntity).append(optionTag);
            $(dropDownEntity).selectmenu("refresh");
        }
    });
    if ($(dropDownEntity).find(' option:gt(0)').length == 1) {
        $(dropDownEntity).val($(dropDownEntity).find(' option:gt(0)').val());
        $(dropDownEntity).selectmenu("refresh");
    }
}

/**
* This submits and handles the update of the reliability data ajax call.
*/
function PostReliabilityDataUpdate() {
    try {
        if ($(' [data-dropdown-result="ProblemID"]').val() != -1 &&
            $(' [data-dropdown-result="CauseID"]').val() != -1 &&
            $(' [data-dropdown-result="ResolutionID"]').val() != -1) {

            // Process and submit update.
            var jsondata = {
                DatabaseID: decryptStr(getLocal("DatabaseID")),
                Language: getLocal("Language"),
                EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
                WorkOrderNumber: $.trim(getLocal("WorkOrderNumber")),
                GPSLocation: GlobalLat + "," + GlobalLong,
                SessionID: decryptStr(getLocal("SessionID")),
                ProblemID: $(' [data-dropdown-result="ProblemID"]').val(),
                CauseID: $(' [data-dropdown-result="CauseID"]').val(),
                FeatureList: getLocal("featuresListAll"),
                ResolutionID: $(' [data-dropdown-result="ResolutionID"]').val()
            };
            var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=SetReliabilityData";
            $.postActionJSON(accessURL, jsondata, function (resultData) {
                closeActionPopupLoading();
                ActionCallBack(resultData);
            });
        } else {
            // Error handling message.
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("AllFieldsRequiredMessage"));
            }, 1000);
            return;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
* This will fetch and populate the dropdowns for the Change Priority action.
*/
function PrepareChangePriorityDropDowns() {
    var jsondata = iMFMJsonObject();
    var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetPriorityTargets";

    $.postJSON(accessURL, jsondata, function (results) {
        // Trim the results.
        priorities = results.Table;
        reasons = results.Table1[0].DefaultValueStr.split(';');
        $('#PriorityDropDown option:gt(0)').remove();
        $('#AddCommentDDL option:gt(0)').remove();
        $.each(priorities, function () {
            var priorityKey = '(' + this.PriorityKey + ')';
            if (orderDtails.DetPriorityVal.indexOf(priorityKey) !== 0) {
                var priorityItem = document.createElement('option');
                priorityItem.setAttribute('value', this.PriorityKey);
                priorityItem.setAttribute('data-edit-targets', this.AllowUserEdit);
                priorityItem.setAttribute('data-current-priority', 'false');
                priorityItem.innerHTML = priorityKey + ' ' + this.Description;
                $('#PriorityDropDown').append(priorityItem);
            } else {
                // Update the existing entry with the values related to this priority.
                var firstEntry = $('#PriorityDropDown option:first');
                $(firstEntry).attr('value', this.PriorityKey);
                $(firstEntry).attr('data-edit-targets', this.AllowUserEdit);
                $(firstEntry).attr('data-current-priority', 'true');

                if (this.AllowUserEdit) {
                    $('#responseTargetDate[readonly!=readonly]').removeAttr('disabled');
                    $('#completionTargetDate[readonly!=readonly]').removeAttr('disabled');
                }
            }

            $('#PriorityDropDown').selectmenu('refresh', true);
        });

        $.each(reasons, function () {
            var reasonItem = document.createElement('option');
            reasonItem.setAttribute('value', this);
            reasonItem.innerHTML = this;
            $('#AddCommentDDL').append(reasonItem);
            $('#AddCommentDDL').selectmenu('refresh', true);
        });
    });
}

/**
* This will calculate and update the targets for a given priority.
* @param {Object} priorityDropDown - The dropdown with the value that designates the priority to calculate targets for.
*/
function calculatePriorityTarget(priorityDropDown) {
    var jsondata = iMFMJsonObject({
        Priority: $(priorityDropDown).val(),
        CustomerSiteNumber: getLocal("CustomerSiteNumber")
    });
    var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetPriorityTargets";

    if (!navigator.onLine) {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    } else {
        $.postJSON(accessURL, jsondata, function (results) {
            $('#responseTargetDate').val(results.Data.TargetDate);
            $('#completionTargetDate').val(results.Data.TargetCompl);
            $('#responseTargetDate').attr('disabled', 'true');
            $('#completionTargetDate').attr('disabled', 'true');

            if ($(priorityDropDown).find('option:selected').attr('data-edit-targets') === 'true') {
                $('#responseTargetDate[readonly!=readonly]').removeAttr('disabled');
                $('#completionTargetDate[readonly!=readonly]').removeAttr('disabled');
            }

            if ($(priorityDropDown).find('option:selected').attr('data-current-priority') === 'false') {
                $('#commentstarIcon').show();
                $('#AddCommentLabelTA').show();
                $('#AddCommentsLabel').show();
                if ($('#AddCommentDDL option').length > 1) {
                    $('#CommentDDLDiv').show();
                }
            } else {
                // If this is the default priority, set the targets to the old ones and hide the reason for change dropdown.
                $('#responseTargetDate').val(moment(orderDtails.ResponseTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm'));
                $('#completionTargetDate').val(moment(orderDtails.CompletionTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm'));
                $('#commentstarIcon').hide();
                $('#CommentDDLDiv').hide();
                $('#AddCommentLabelTA').hide();
                $('#AddCommentsLabel').hide();
            }
        });
    }
}

/**
* This will validate the change priority form and then submit the update to the database.
*/
function PostChangePriorityUpdate() {
    try {
        // Validate the data.
        if (($('#PriorityDropDown option:selected').attr('data-current-priority') === 'true' ||
            $('#AddCommentLabelTA').val() != "") &&
            $('#responseTargetDate').val() != "" &&
            $('#completionTargetDate').val() != "") {

            // Validate something changed.
            if ($('#PriorityDropDown option:selected').text() === orderDtails.DetPriorityVal &&
                $('#responseTargetDate').val() === moment(orderDtails.ResponseTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm') &&
                $('#completionTargetDate').val() === moment(orderDtails.CompletionTarget, 'MMM DD YYYY  h:mmA zz').format('YYYY-MM-DDThh:mm')) {
                CloseActionPopup();
            } else {
                // Process and submit update.
                var jsondata = iMFMJsonObject({
                    WorkOrderNumber: $.trim(getLocal("WorkOrderNumber")),
                    GPSLocation: GlobalLat + "," + GlobalLong,
                    Priority: $('#PriorityDropDown').val(),
                    ResponseTarget: $('#responseTargetDate').val(),
                    CompletionTarget: $('#completionTargetDate').val(),
                    FeatureList: getLocal("featuresListAll"),
                    ReasonForChange: $('#AddCommentLabelTA').val()
                });
                var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=PostChangePriority";
                console.log(jsondata);
                console.log(accessURL);
                $.postActionJSON(accessURL, jsondata, function (resultData) {
                    closeActionPopupLoading();
                    ActionCallBack(resultData);
                });
            }
        } else {
            // Error handling message.
            closeActionPopupLoading();
            setTimeout(function () {
                showError(GetTranslatedValue("AllFieldsRequiredMessage"));
            }, 1000);
            return;
        }
    } catch (e) {
        console.log(e);
    }
}
