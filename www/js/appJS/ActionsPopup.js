function OpenActionsPopup(actionID, actionText) {

    var isCloseSubSupported = getLocal("IsCloseSubSupported");
    if (actionID == "Complete" && localStorage.getItem("closeSubs") == 2 && isCloseSubSupported == "true") {
        var myJSONobject = {
            DatabaseID: decryptStr(getLocal("DatabaseID")),
            Language: getLocal("Language"),
            Username: decryptStr(getLocal("Username")),
            EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
            WorkOrderNumber: getLocal("WorkOrderNumber"),
            SessionID: decryptStr(getLocal("SessionID"))
        };

        var ordersURL = standardAddress + "IMFMOrder.ashx?methodname=LoadSubOrders";

        if (navigator.onLine) {
            $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
                if (data.Table[0].DivisionNumber > 0) {
                    //alert(GetTranslatedValue("SubOrderPopUp") ? GetTranslatedValue("SubOrderPopUp") : "This work order has open subs. It cannot be closed until each sub is closed.");
                    clearTimeout(fallback);
                    var fallback = setTimeout(function () {
                        $('#MenuPage').panel('close');
                        $('#SWOCreateCloseSubMsg').text('');
                        var msg = GetTranslatedValue("SubOrderPopUp") ? GetTranslatedValue("SubOrderPopUp") : "This work order has open subs. It cannot be closed until each sub is closed.";
                        $('#SWOCreateCloseSubMsg').text(msg);
                        $("#SWOCreateCloseSubPopup").popup().popup("open");
                    }, 100);
                }
                else {
                    OpenActionsPopupNew(actionID, actionText);
                }
            });
        } else {
            OpenActionsPopupNew(actionID, actionText);
        }
    }
    else {
        OpenActionsPopupNew(actionID, actionText);
    }
}

function OpenActionsPopupNew(actionID, actionText) {
    CodeType = '';
    try {
        setLocal("RequestedAction", actionID);
        setLocal("RequestedActionText", actionText);

        if ((actionID.indexOf("AddAttachment") != -1 || actionID.indexOf("Reassign") != -1 ||
            actionID.indexOf("SetEquipmentTag") != -1 || actionID.indexOf("FieldPO") != -1 ||
            actionID.indexOf("Labor") != -1 || actionID.indexOf("PhoneFix") != -1 ||
            actionID.indexOf("PreApproval") != -1 || actionID.indexOf("InvoiceApproval") != -1 ||
            actionID.indexOf("NTEApproval") != -1 || actionID.indexOf("ReliabilityData") != -1 ||
            actionID.indexOf("MaterialPO") != -1 || actionID.indexOf("ChangePriority") != -1) && !navigator.onLine) {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            return false;
        }
        if (actionID.indexOf("Complete") != -1 && navigator.onLine) {
            if (getLocal("IsInspectionPending") == "true") {
                showError(GetTranslatedValue("InspectionPendingMessage"));
                return false;
            }
        }
        if (actionID.indexOf("Labor") != -1 && navigator.onLine) {
            SetDataForWorkOrderLaborEntry();
            $.mobile.changePage("TimeCardWO.html");
            return;
        }

        //// SIC 3051 displaying alert incase of wo PRL status and cancling work order in case of external po
        var statusPrl = document.getElementById("hiddenStatus") ? document.getElementById("hiddenStatus").getAttribute("value") ? document.getElementById("hiddenStatus").getAttribute("value") : "null" : "null";
        if (actionID == "PhoneFix" && (statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && statusPrl.toUpperCase() == getLocal("MyBuySpecialStatus").toUpperCase() || getLocal("IsExternalPO").toUpperCase() == "TRUE")) {

            var alertMessage = alertMessage = GetTranslatedValue("PhoneFixExternalPOMessage") ? GetTranslatedValue("PhoneFixExternalPOMessage") : "This work order cannot be phone fixed as it has an open PO against it.";
            
            if ((statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && getLocal("MyBuySpecialStatus").toUpperCase() == statusPrl)) {
                alertMessage = GetTranslatedValue("CASPRLPhoneFixPRLMessageMessage") ? GetTranslatedValue("PhoneFixPRLMessage").replace("xxx", getLocal("MyBuySpecialStatus")) : "This work order cannot be phone fixed as it is in " + getLocal("MyBuySpecialStatus") + " status.";
            }
            if (getLocal("IsExternalPO").toUpperCase() == "TRUE" && (statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && getLocal("MyBuySpecialStatus").toUpperCase() == statusPrl)) {
                alertMessage = GetTranslatedValue("CASPRLorExternalPOMessage") ? GetTranslatedValue("CASPRLorExternalPOMessage").replace("xxx", getLocal("MyBuySpecialStatus")) : "This work order cannot be phone fixed as it is in " + getLocal("MyBuySpecialStatus").toUpperCase() + " status or it has an open PO against it.";
            }
            OpenPRLPopup(alertMessage);
            return;
        }
        
        switch (actionText) {
            case 'PreApproval': CodeType = 'PreApproval';
                break;
            case 'InvoiceApproval': CodeType = 'InvoiceApproval';
                if (getLocal("WorkOrderStatus") == 'CIH') {
                    showError(GetTranslatedValue("InvoiceSubmissionMessage"));
                    return;
                }

                GetWorkOrderInvoiceAmount();
                return;
            case 'NTEApproval': CodeType = 'NTEApproval';
                break;
            default: if (CodeType != undefined) { delete CodeType; }
                break;
        }
	
        if (actionID.indexOf("SelfGenAsset") != -1) {
            setLocal("ScreenName", "AssetDashboard");
            $.mobile.changePage("CreateWOT.html");
        }
        else{
            $.mobile.changePage('ActionPage.html', { role: "dialog", transition: "flip" });
        }
    }
    catch (e) {
    }
}

function PopulateCommentDDL(actionID) {
    try {
        var pageID = $.mobile.activePage.attr('id');
        actionID = getLocal("RequestedAction");
        $("#ActionsPopup").find("select").parentsUntil("[class='ui-select']").show();
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
                else {
                    $("#AddCommentDDL").parentsUntil("[class='ui-select']").hide();
                }
            }, function (ts, e) { showError(e.message); });
        });
    }
    catch (e) {
    }
}

function FillCommentDDl(actionID, result) {
    try {
        $("#" + actionID + " option:gt(0)").remove();
        for (var i = 0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            var option = '<option>' + item.Comments + '</option>';
            $("#" + actionID).append(option);
        }
        $("#" + actionID).selectmenu("refresh");
    }
    catch (e) {
    }
}

function FillCommentDropDown(result) {
    try {
        $("#AddCommentDDL option:gt(0)").remove();
        for (var i = 0; i < result.rows.length; i++) {
            var item = result.rows.item(i);
            var option = '<option value="' + item.Comments + '">' + item.Comments + '</option>';
            $("#AddCommentDDL").append(option);
        }
        $("#AddCommentDDL").selectmenu("refresh");
        if ($("#AddCommentDDL option").length > 1) {
            $("#CommentDDLDiv").show();
        }
    }
    catch (e) {
    }
}

function BindDropDownList(data, ddl, text, value) {
    try {
        $(ddl).empty();
        if (data.length != 1) {
            $(ddl).html("<option value='0'><%:sessionObject.TransSelect %></option>");
        }
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            $.each(d, function (key) {
                if (key == text) {
                    var option = document.createElement("option");
                    option.innerHTML = d.text;
                    if (value !== '') {
                        option.setAttribute("value", d.value);
                    }
                    $(ddl).append(option);
                }
            });
        }
        $(ddl).selectmenu("refresh");
    }
    catch (e) {
        log(e);
    }
}

function FillCommentTB(ddl) {
    try {
        if ($("#" + ddl.id).val() !== 0) {
            $("#ReassignCommentsTA").val($("#" + ddl.id + " option:selected").text());
        }
        else {
            $("#ReassignCommentsTA").val('');
        }
    }
    catch (e) {
    }
}

function ValidateReassignPage(pagename) {
    try {
        if ($("#WOActionReassign_AssignTypeDDL option").length === 1 || $("#WOActionReassign_AssignTypeDDL option").length === 0) {
            $("#AssignTypeDIV").hide();
        }
        if ($("#WOActionReassign_AssignmentPickDDL option").length === 1 || $("#WOActionReassign_AssignmentPickDDL option").length === 0) {
            $("#AssignmentPickDIV").hide();
        }
        if ($("#WOActionReassign_CommentsDDL option").length === 1 || $("#WOActionReassign_CommentsDDL option").length === 0) {
            $("#CommentDDLDIV").hide();
        }
    }
    catch (e) {
    }
}

function LoadAssignmentPickDDL(ddl) {
    try {

        // $("#AssignTypeDIV").show();
        $("#AssignmentPickDIV").show();
        $("#ReassignAssignmentPickDDL").selectmenu("enable");
        $("#ReassignAssignmentPickDDL option:gt(0)").remove();
        $('#AssignmentPickDIV').addClass('ui-screen-hidden');
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
                }

                if (result.rows.length == 1) {
                    $("#ReassignAssignmentPickDDL").val(item.AssignmentID);
                    $("#AssignmentPickDIV").hide();
                }

                if (result.rows.length > 0) {
                    $('#AssignmentPickDIV').removeClass('ui-screen-hidden');
                }
            },
    function () {
        showError("error");
    });
        });
        SecurityForVendorSearch("Reassign_VendorSearch", 1);
    }
    catch (e) {
    }
}

function PopulateCurrentAssignmentDDL(result) {
    try {
        BindDropDownList(result.AssignmentPickDDL, "#WOActionReassign_AssignmentPickDDL", "EmployeeName", "EmployeeNumber");
    }
    catch (e) {
    }
}

function PopulateAssignmentPickDDL() {
    try {
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(query, [], function (result) {
            },
    function () {
        showError(GetTranslatedValue("ErrorMessage"));
    });
        });
    }
    catch (e) {
    }
}

function LoadReassignTranslation(result) {
    try {
        $("#WOActionReassign_CommentsLabel").html(result.Data.CommentsLabel);
        $("#WOActionReassign_SubmitButton").html(result.Data.SubmitButton);
        $("#WOActionReassign_AssignTypeLabel").html(result.Data.AssignType);
        $("#WOActionReassign_AssignmentPickLabel").html(result.Data.AssignmentPick);
        $("#WOActionReassign_HTReassignComment").html(result.Data.HTReassignComment);
        $("#WOActionReassign_HTReassignFail").html(result.Data.HTReassignFail);
        $("#WOActionReassign_HTCommentRequired").html(result.Data.HTCommentRequired);
        $("#WOActionReassign_HTAssignmentRequired").html(result.Data.HTAssignmentRequired);
        $("#WOActionReassign_HTManager").html(result.Data.HTManager);
        $("#WOActionReassign_HTCallCenter").html(result.Data.HTCallCenter);
        $("#WOActionReassign_HTTechnician").html(result.Data.HTTechnician);
        $("#WOActionReassign_HTVendor").html(result.Data.HTVendor);
        $("#WOActionReassign_HTRFM").html(result.Data.HTRFM);
        $("#WOActionReassign_HTFM").html(result.Data.HTFM);
        $("#WOActionReassign_HTAssignPickEmpty").html(result.Data.HTAssignPickEmpty);
        $("#WOActionReassign_hidSubvarAssignmentError").html(result.Data.hidSubvarAssignmentError);
        BindDropDownList(result.Data.CommentDDL, "#WOActionReassign_CommentsDDL", "Comments", "");
        BindDropDownList(result.Data.AssignTypeDDL, "#WOActionReassign_AssignTypeDDL", "Text", "Value");
        PopulateAssignmentPickDDL(result.Data.AssignmentPickDDL);
        ValidateReassignPage("<%:sessionObject.PdaRequestedScreen %>");
    }
    catch (e) {
    }
}

function SetDataForWorkOrderLaborEntry() {
    setLocal("TimeCard_WorkOrderSource", "ActionsPopup");
    setLocal("TimeCard_WorkOrder", GetCommonTranslatedValue("WorkOrderNumLabel") + " "+ localStorage.getItem("WorkOrderNumber"));
    setLocal("TimeCard_EmployeeNumber", decryptStr(localStorage.getItem("EmployeeNumber")));
}

function GetWorkOrderInvoiceAmount() {
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "WorkOrderActions.ashx?methodname=GetWorkOrderInvoiceAmount";
    $.postActionJSON(accessURL, myJSONobject, function (resultData) {
        if (resultData.JournalID == null) {
            showError(GetTranslatedValue("NoInvoiceMessage"));
            return;
        }
        else {
            $.mobile.changePage('ActionPage.html', { role: "dialog", transition: "flip" });
        }
    });
}
