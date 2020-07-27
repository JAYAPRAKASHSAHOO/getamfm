/// <summary>
/// Method to navigate to the form. Used on the work order Details form.
/// </summary>
function navigateToApprovalLog() {
    $.mobile.changePage("ApprovalLog.html");
}

/// <summary>
/// Method to Link Button click event.
/// </summary>
/// <param name="linkButtonId">Holds id of link button</param>
function ApprovalLinkButtonChangedEvent(linkButtonId) {
    ResetPageNumber();
    switch (linkButtonId.id) {
        case 'PreApprovalLink':
            setLocal('ApprovalCodeType', 'PreApproval');
            break;
        case 'InvoiceApprovalLink':
            setLocal('ApprovalCodeType', 'InvoiceApproval');
            break;
        case 'NTEApprovalLink':
            setLocal('ApprovalCodeType', 'NTEApproval');
            if ($('#LogType').val() == 'Chain') {
                $('#NTEChainDiv').show();
                LoadApprovalDetails(3);
                return;
            }

            break;
        default: break;
    }

    GetLogType();
}

/// <summary>
/// Method to Toggle Switch change event.
/// </summary>
function GetLogType() {
    $('#NTEChainDiv').hide();
    if ($('#LogType').val() == 'Log') {
        LoadApprovalDetails(1)
    }
    else if ($('#LogType').val() == 'Chain' && getLocal('ApprovalCodeType') == 'NTEApproval') {
        $('#NTEChainDiv').show();
        LoadApprovalDetails(3);
    }
    else {
        LoadApprovalDetails(2)
    }
}

/// <summary>
/// Method to NTEChainDDL change event.
/// </summary>
function GetSelectedChainNumber() {
    setLocal('ChainNumber', $('#NTEChain').val());
    LoadApprovalDetails(2);
}

/// <summary>
////Method to get approval log data.
/// </summary>
function LoadApprovalDetails(selectedView) {
    showLoading();

    var pageID = $.mobile.activePage.attr('id');
    var pageNum = parseInt($("#" + pageID).find("#ApprovallogNextButton").attr('data-nextPage'));

    if (pageNum <= 1) {
        $("#ApprovalLogList").empty();
    }

    var myJSONobject = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "SelectedView": selectedView,
        "WorkOrderNumber": getLocal("WorkOrderNumber"),
        "CodeType": getLocal('ApprovalCodeType'),
        "ChainNumber": getLocal('ChainNumber'),
        "PageNumber": pageNum,
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber"))
    };

    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=LoadApprovalLog";

    $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
        if (resultData.length == 0 && selectedView != 3) {
            ShowNoDataDiv();
            closeLoading();
            return;
        }

        $('#NoApprovalLogDiv').hide();
        switch (selectedView) {
            case 1: BindLogData(resultData);
                closeLoading();
                break;
            case 2: BindChainData(resultData);
                closeLoading();
                break;
            case 3: BindNTEChainSelectData(resultData);
                closeLoading();
                break;
        }
    });
}

/// <summary>
////Method to bind the Log View.
/// </summary>
/// <param name="resultData">Contains resultant data.</param>
function BindLogData(resultData) {
    try {
        var d;
        if (resultData.length === 0) {
            ShowNoDataDiv();
        }
        else {
            var approvalLogitem = "";
            for (var i = 0; i < resultData.length; i++) {
                d = resultData[i];
                var dt = (d.DateUpdatedStr == null || d.DateUpdatedStr == undefined) ? ' ' : d.DateUpdatedStr ////+ " " + d.TimeZone;
                approvalLogitem = approvalLogitem + '<li data-role="list-divider">' +
               '<span style="font-size: 12px">' + GetTranslatedValue('TransType') + ': ' + d.TransType + '</span></li>' +
               '<li><p style="font-size: 12px"><strong>' + GetTranslatedValue('LogDate') + ': ' + dt + '</strong></p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>' + d.Description + '</strong></p> </li>';
            }

            $("#ApprovalLogList").append(approvalLogitem);
            $("#ApprovalLogList").listview("refresh");
            $("#ApprovalLogWONum").append('<span class="badge">' + d.TotalRecordCount + '</span>');
            if ($("#ApprovalLogList li").length / 2 == parseInt(d.TotalRecordCount)) {
                $("#ApprovallogNextButton").hide();
            }
            else {
                $("#ApprovallogNextButton").show();
            }
        }
    }
    catch (e) {
        // log(e);
    }
}

/// <summary>
////Method to bind chain view.
/// </summary>
/// <param name="resultData">Contains resultant data.</param>
function BindChainData(resultData) {
    try {
        var d;
        if (resultData.length === 0) {
            ShowNoDataDiv();
        }
        else {
            var approvalLogitem = "";
            for (var i = 0; i < resultData.length; i++) {
                d = resultData[i];
                var dt = (d.ResultDate == null || d.ResultDate == undefined) ? ' ' : d.ResultDate + " " + d.TimeZone;
                approvalLogitem = approvalLogitem + '<li data-role="list-divider">' +
               '<span style="font-size: 12px">' + GetTranslatedValue('Approver') + ': ' + (IsStringNullOrEmpty(d.Approver) ? "" : d.Approver) + '</span></li>' +
               '<li><p style="font-size: 12px"><strong>' + GetTranslatedValue('ResultDate') + ': ' + dt + '</strong></p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>' + GetTranslatedValue('ApprovalResult') + ': ' + (IsStringNullOrEmpty(d.ApprovalResultText) ? GetCommonTranslatedValue("NotApplicableLabel") : d.ApprovalResultText) + '</strong></p> </li>';
            }
            
            $("#ApprovalLogList").append(approvalLogitem);
            $("#ApprovalLogList").listview("refresh");
            $("#ApprovalLogWONum").append('<span class="badge">' + d.TotalRecordCount + '</span>');
            if ($("#ApprovalLogList li").length / 2 == parseInt(d.TotalRecordCount)) {
                $("#ApprovallogNextButton").hide();
            }
            else {
                $("#ApprovallogNextButton").show();
            }
        }
    }
    catch (e) {
        // log(e);
    }
}

/// <summary>
////Method to bind NTEChainDDL.
/// </summary>
/// <param name="resultData">Contains resultant data.</param>
function BindNTEChainSelectData(resultData) {
    try {
        if (resultData.length === 0) {
            ShowNoDataDiv();
        }

        $('#NTEChain').children('option').remove();

////        var selectText = GetCommonTranslatedValue("SelectLabel");
////        $("#approvalLogPage").find("#NTEChain").html('<option value="-1">' + selectText + '</option>').selectmenu("refresh");

        var index = 0;
        for (index = 0; index < resultData.length; index++) {
            var ddlText = resultData[index].DateSubmittedStr + ' - ' + resultData[index].ApprovalResultText + ' - ' + resultData[index].ChainNumber;
            $('#NTEChain').append('<option value = ' + resultData[index].ChainNumber + '>' + ddlText + '</option>');
            $('#NTEChain').selectmenu("refresh", true);
        }

        $("#NTEChain option:first").attr('selected', 'selected');
        $("#NTEChain").selectmenu("refresh", true);

        $("#ApprovallogNextButton").hide();
        setLocal('ChainNumber', resultData[0].ChainNumber);
        LoadApprovalDetails(2);
    }
    catch (e) {
    }
}

/// <summary>
////Method to get next approval list.
/// </summary>
function ApprovalGetNextList(moreButton) {
    var pageNum = 1;
    var pageID = $.mobile.activePage.attr('id');
    pageNum = parseInt($("#" + pageID).find("#" + moreButton.id).attr('data-nextPage')) + 1;
    $("#" + pageID).find("#ApprovallogNextButton").attr('data-nextPage', pageNum);
    GetLogType();
}

/// <summary>
////Method to reset the page number.
/// </summary>
function ResetPageNumber() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID).find("#ApprovallogNextButton").attr('data-nextPage', 1);
}

/// <summary>
////Method to not show data div.
/// </summary>
function ShowNoDataDiv() {
    $('#NoApprovalLogDiv').show();
    $('#NoDataLi').text(GetTranslatedValue("NoDataLi"));
    $("#ApprovallogNextButton").hide();
    $('.badge').hide();
}

