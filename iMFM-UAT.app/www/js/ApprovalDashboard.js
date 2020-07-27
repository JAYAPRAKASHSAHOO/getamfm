var Approval = {}

$.ajaxApprovalPostJSON = function (url, sdata, func) {
    $.ajax(
        {
            url: url,
            type: "post",
            //headers: { "cache-control": "no-cache" },
            headers: { "Origin": ORIGIN_HEADER },
            dataType: "json",
            //timeout: parseInt(processTime),
            //cache: false,
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
                    if (textStatus == 'timeout') {
                        errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'error') {
                        errorMsg = GetCommonTranslatedValue("InternalError");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'abort') {
                        errorMsg = GetCommonTranslatedValue("RequestAborted");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'parsererror') {
                        errorMsg = GetCommonTranslatedValue("InternalParseError");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else {
                        errorMsg = GetCommonTranslatedValue("NetworkLost");
                        forcePopupClose(popupName, errorMsg);
                    }
                }
            }
        });
};

/// <summary>
/// Method to navigate to the approval dashboard.
/// </summary>
function navigateToApprovalDashboard() {
    $.mobile.changePage('ApprovalDashboard.html');
}


/// <summary>
/// Method to get the pre_approval orders.
/// </summary>
/// <param name="option">Contains types of approval.</param>
//// option 2 - Pre - Approval| 3- Invoice Approval. Option passed from ApprovalDashboard.html.
function GetPreApprovalOrders(option) {
    showLoading();
    GetCASLabelValue();
    switch (option) {
        case '1':
            $("#preApprovalList").empty(); $("#preApprovalList").hide();
            $("#invoiceApprovalList").empty(); $("#invoiceApprovalList").hide();
            $("#nteApprovalList").empty(); $("#nteApprovalList").hide();
            break;
        case '2':
            $('#allApprovalOrderList').empty(); $("#allApprovalOrderList").hide();
            $("#invoiceApprovalList").empty(); $("#invoiceApprovalList").hide();
            $("#nteApprovalList").empty(); $("#nteApprovalList").hide();
            break;
        case '3':
            $('#allApprovalOrderList').empty(); $("#allApprovalOrderList").hide();
            $("#preApprovalList").empty(); $("#preApprovalList").hide();
            $("#nteApprovalList").empty(); $("#nteApprovalList").hide();
            break;
        case '4':
            $('#allApprovalOrderList').empty(); $("#allApprovalOrderList").hide();
            $("#preApprovalList").empty(); $("#preApprovalList").hide();
            $("#invoiceApprovalList").empty(); $("#invoiceApprovalList").hide();
            break;
        default:
            break;
    }

    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "PageSize": "10",
        "PageNumber": "1",
        "Option": option,
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=PreApproval";
    $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
        if (resultData.Table.length > 0) {
            switch (myJSONobject.Option) {
                case '1': $('#NoApprovalOrders').css("display", "none");
                    BuildPreApprovalList(resultData, myJSONobject.Option);
                    closeLoading();
                    break;
                case '2': $('#NoApprovalOrders').css("display", "none");
                    BuildPreApprovalList(resultData, myJSONobject.Option);
                    closeLoading();
                    break;
                case '3': $('#NoApprovalOrders').css("display", "none");
                    ////BuildInvoiceApprovalList(resultData);
                    BuildPreApprovalList(resultData, myJSONobject.Option);
                    closeLoading();
                    break;
                case '4': $('#NoApprovalOrders').css("display", "none");
                    BuildPreApprovalList(resultData, myJSONobject.Option);
                    closeLoading();
                    break;
                default: break;
            }
        }
        else {
            switch (myJSONobject.Option) {
                case '1': $('#NoApprovalOrdersList').text(GetTranslatedValue("NoApprovalOrders1"));
                    $('#NoApprovalOrders').css("display", "block");
                    $('#approvalListMoreButton').hide();
                    $('#allApprovalOrderList').hide();
                    break;
                case '2': $('#NoApprovalOrdersList').text(GetTranslatedValue("NoApprovalOrders2"));
                    $('#NoApprovalOrders').css("display", "block");
                    $('#approvalListMoreButton').hide();
                    $('#preApprovalList').hide();
                    break;
                case '3': $('#NoApprovalOrdersList').text(GetTranslatedValue("NoApprovalOrders3"));
                    $('#NoApprovalOrders').css("display", "block");
                    $('#approvalListMoreButton').hide();
                    $('#invoiceApprovalList').hide();
                    break;
                case '4': $('#NoApprovalOrdersList').text(GetTranslatedValue("NoApprovalOrders4"));
                    $('#NoApprovalOrders').css("display", "block");
                    $('#approvalListMoreButton').hide();
                    $('#nteApprovalList').hide();
                    break;
                default: break;
            }
            closeLoading();
        }
    });
}

/// <summary>
///Method to build the pre_approval List.
/// </summary>
/// <param name="resultData">Holds approval results.</param>
/// <param name="approvalOption">Contains types of approval.</param>
function BuildPreApprovalList(resultData, approvalOption) {
    var approvalRecords = "";
    if (approvalOption != 1) {
        for (var approvalRecordLength = 0; approvalRecordLength < resultData.Table.length; approvalRecordLength++) {
            approvalRecords = approvalRecords + createAllApprovalList(resultData, approvalRecordLength);
        }
    }
    else {
        var preApprovalRecords = '<div data-role="collapsible" data-inset="true">' +
                                   '<h4><strong class="boldfont">' + GetTranslatedValue("dashboardPreApprovalIconText") + '</strong></h4>' +
                                   '<ul data-role="listview">';
        var invoiceApprovalRecords = '<div data-role="collapsible" data-inset="true">' +
                                   '<h4><strong class="boldfont">' + GetTranslatedValue("dashboardInvoiceApprovalIconText") + '</strong></h4>' +
                                   '<ul data-role="listview">';
        var nteApprovalRecords = '<div data-role="collapsible" data-inset="true">' +
                                   '<h4><strong class="boldfont">' + GetTranslatedValue("dashboardNteIconText") + '</strong></h4>' +
                                   '<ul data-role="listview">';
        var preApprovalRecordsExists = false;
        var invoiceApprovalRecordsExists = false;
        var nteApprovalRecordsExists = false;
        for (var approvalRecordLength = 0; approvalRecordLength < resultData.Table.length; approvalRecordLength++) {

            switch (resultData.Table[approvalRecordLength].ApprovalCodeDescription) {
                case "PreApproval":
                    preApprovalRecordsExists = true;
                    preApprovalRecords = preApprovalRecords + createAllApprovalList(resultData, approvalRecordLength);
                    break;
                case "InvoiceApproval":
                    invoiceApprovalRecordsExists = true;
                    invoiceApprovalRecords = invoiceApprovalRecords + createAllApprovalList(resultData, approvalRecordLength);
                    break;
                case "NTEApproval":
                    nteApprovalRecordsExists = true;
                    nteApprovalRecords = nteApprovalRecords + createAllApprovalList(resultData, approvalRecordLength);
                    break;
                default: break;
            }
        }

        if (preApprovalRecordsExists == true)
            approvalRecords = approvalRecords + preApprovalRecords + '</ul></div>';
        if (invoiceApprovalRecordsExists == true)
            approvalRecords = approvalRecords + invoiceApprovalRecords + '</ul></div>';
        if (nteApprovalRecordsExists == true)
            approvalRecords = approvalRecords + nteApprovalRecords + '</ul></div>';
    }

    switch (approvalOption) {
        case '2':
            localStorage.setItem("ApprovalTabType", "PreApproval");
            $("#preApprovalList").empty(); $("#preApprovalList").show();
            $("#preApprovalList").append(approvalRecords);
            $('#preApprovalList').listview('refresh');
            hideNShowMoreButton(resultData.Table1[0].Count);
            break;
        case '3':
            localStorage.setItem("ApprovalTabType", "InvoiceApproval");
            $("#invoiceApprovalList").empty(); $("#invoiceApprovalList").show();
            $("#invoiceApprovalList").append(approvalRecords);
            $('#invoiceApprovalList').listview('refresh');
            hideNShowMoreButton(resultData.Table1[0].Count);
            break;
        case '4': localStorage.setItem("ApprovalTabType", "NTEApproval");
            $("#nteApprovalList").empty(); $("#nteApprovalList").show();
            $("#nteApprovalList").append(approvalRecords);
            $('#nteApprovalList').listview('refresh');

            hideNShowMoreButton(resultData.Table1[0].Count);
            break;
        case '1': localStorage.setItem("ApprovalTabType", "All");
            $("#allApprovalOrderList").empty(); $("#allApprovalOrderList").show();
            $("#allApprovalOrderList").append(approvalRecords);
            $('#allApprovalOrderList').trigger('create');
            $('#approvalListMoreButton').hide();
            break;
        default: break;
    }
}

/// <summary>
///Method to hide and show on click of more Button.
/// </summary>
/// <param name="Count">Holds the count value.</param>
function hideNShowMoreButton(Count) {
    //// condition to display more button
    if (Count > 10)
        $('#approvalListMoreButton').show();
    else
        $('#approvalListMoreButton').hide();
}

/// <summary>
///Method to create all approval list.
/// </summary>
/// <param name="resultData">Holds approval results.</param>
/// <param name="approvalRecordLength">Holds the count of approval records.</param>
function createAllApprovalList(resultData, approvalRecordLength) {
    var woNum = "'" + resultData.Table[approvalRecordLength].WorkOrderNumber + "'";
    var approvalType = "'" + resultData.Table[approvalRecordLength].ApprovalCodeDescription + "'";
    var dynamicApprovalList = "";
    var projectFixedCost = '';
    var approvalTypeLabel = '';
    if (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].CostField) || resultData.Table[approvalRecordLength].CostField == 0) {
        projectFixedCost = '';
    }

    if (resultData.Table[approvalRecordLength].CostField == 1) {
        projectFixedCost = '<p class="lable" id= "projectfixedcostlabel">' + localStorage.getItem("ProjectFixedCostCASLabel") + ":" + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].projectfixedcost) ? "0" : resultData.Table[approvalRecordLength].projectfixedcost) +
                ' ' + (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].CurrencyCode) ? "" : resultData.Table[approvalRecordLength].CurrencyCode) + '</strong></p>';

        approvalTypeLabel = (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].ApprovalCodeDescription) ? "" : resultData.Table[approvalRecordLength].ApprovalCodeDescription) + " (" + localStorage.getItem("ProjectFixedCostCASLabel") + ")";
    }

    if (resultData.Table[approvalRecordLength].CostField == 0 || resultData.Table[approvalRecordLength].CostField == null || IsStringNullOrEmpty(resultData.Table[approvalRecordLength].CostField)) {
        approvalTypeLabel = (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].ApprovalCodeDescription) ? "" : resultData.Table[approvalRecordLength].ApprovalCodeDescription)
    }


    dynamicApprovalList = dynamicApprovalList + '<li id=' + resultData.Table[approvalRecordLength].WorkOrderNumber + '>' +
                '<p class="lable"><strong class="boldfont">' + (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].WorkOrderNumber) ? "" : resultData.Table[approvalRecordLength].WorkOrderNumber) + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('approvalTypeLabel') + '<strong class="boldfont">' + approvalTypeLabel + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('statusLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].Status) ? "" : resultData.Table[approvalRecordLength].Status) + " - " +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].StatusDescription) ? "" : resultData.Table[approvalRecordLength].StatusDescription) + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('dateTargetCompleteLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].DateTargetCompleteSiteStr) ? "" : resultData.Table[approvalRecordLength].DateTargetCompleteSiteStr) + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('dateEnteredLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].DateEnteredStr) ? "" : resultData.Table[approvalRecordLength].DateEnteredStr) + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('assignedNameLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].AssignedName) ? "" : resultData.Table[approvalRecordLength].AssignedName) + '</strong></p>' +
                '<p class="lable">' + GetTranslatedValue('estimatedLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].BidAmount) ? "" : resultData.Table[approvalRecordLength].BidAmount) +
                ' ' + (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].CurrencyCode) ? "" : resultData.Table[approvalRecordLength].CurrencyCode) + '</strong></p>' +

                projectFixedCost +

                '<p class="lable">' + GetTranslatedValue('problemDescriptionLabel') + '<strong class="boldfont">' +
                (IsStringNullOrEmpty(resultData.Table[approvalRecordLength].ProblemDescription) ? "" : resultData.Table[approvalRecordLength].ProblemDescription) + '</strong></p>' +
                '<p>' +
                '<img class="approveImage img-approve" id=approve' + approvalRecordLength + ' data-status="approve" data-WorkOrderNumber=' + resultData.Table[approvalRecordLength].WorkOrderNumber +
                ' data-approvalType=' + resultData.Table[approvalRecordLength].ApprovalCodeDescription + ' onclick="updateWOStatus(this);" />' +
                '<img class="rejectImage img-reject" style="margin-left: 10px;" id=reject' + approvalRecordLength + ' data-status="reject" data-WorkOrderNumber=' + resultData.Table[approvalRecordLength].WorkOrderNumber +
                ' data-approvalType=' + resultData.Table[approvalRecordLength].ApprovalCodeDescription + ' onclick="updateWOStatus(this);" />' +
                '<img class="approvalDetailsNavigation img-start" style="margin-left: 10px;" data-status="Reject"' +
                ' " onclick="javascript:NavigateTOApprovalOrderDetails(' + woNum + ',' + approvalType + ')" />' +
                '</p>' +
                '</li>';

    return dynamicApprovalList;
}

/// <summary>
///Method to navigate to the approval order details.
/// </summary>
/// <param name="WorkOrdernumber">Holds the work order number.</param>
/// <param name="ApprovalType">Holds the type of approval.</param>
function NavigateTOApprovalOrderDetails(WorkOrdernumber, ApprovalType) {
    localStorage.setItem("WorkOrderNumber", WorkOrdernumber);
    localStorage.setItem("ApprovalType", ApprovalType);
    $.mobile.changePage('ApprovalDetails.html');
}

/// <summary>
///Method to get the pre_approval order details.
/// </summary>
/// <param name="WorkOrdernumber">Holds the work order number.</param>
/// <param name="ApprovalType">Holds the type of approval.</param>
function GetPreApprovalOrderDetails(WorkOrdernumber, ApprovalType) {
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
        "ApprovalType": localStorage.getItem("ApprovalType"),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=ApprovalDetails";
    $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
        var AppType = localStorage.getItem("ApprovalType");
        $('.approveImage').attr('data-WorkOrderNumber', localStorage.getItem("WorkOrderNumber"));
        $('.rejectImage').attr('data-WorkOrderNumber', localStorage.getItem("WorkOrderNumber"));

        $('.approveImage').attr('data-approvalType', AppType);
        $('.rejectImage').attr('data-approvalType', AppType);
        if (AppType == 'PreApproval') {
            var approvalFinancialDetails = "";
            var approvalHistoryDetails = "";
            var approvalLocationDetails = "";
            var approvalDetails = "";
            $('#approvalDetailsHeading').text(GetTranslatedValue('preApprovalDetailsLabel') + localStorage.getItem("WorkOrderNumber"));
            approvalFinancialDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsFinancialLabel')) +
                                   CreateApprovalList("Financial", resultData) + '</ul></div>';
            approvalHistoryDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsHistoryLabel')) +
                                 CreateApprovalList("ApprovalHistory", resultData) + '</ul></div>';
            approvalLocationDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsLabel')) +
                                 CreateApprovalList("Details", resultData) + '</ul></div>';
            approvalDetails = approvalFinancialDetails + approvalHistoryDetails + approvalLocationDetails;
            $('#approvalDetailsList').append(approvalDetails);
            $('#approvalDetailsList').trigger('create');
            closeLoading();
        }
        else if (AppType == 'InvoiceApproval') {
            var approvalLocationDetails = "";
            var approvalHistoryDetails = "";
            var approvalInvoiceSummaryDetails = "";
            $('#approvalDetailsHeading').text(GetTranslatedValue('InvApprovalDetailsLabel') + localStorage.getItem("WorkOrderNumber"));
            approvalHistoryDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsHistoryLabel')) +
                                 CreateApprovalList("ApprovalHistory", resultData) + '</ul></div>';
            approvalLocationDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsLabel')) +
                                 CreateApprovalList("Details", resultData) + '</ul></div>';
            approvalInvoiceSummaryDetails = CreateApprovalHeader(GetTranslatedValue('InvoiceSummary')) +
                                 CreateApprovalList("InvoiceSummary", resultData) + '</ul></div>';
            approvalDetails = approvalLocationDetails + approvalInvoiceSummaryDetails + approvalHistoryDetails;
            $('#approvalDetailsList').append(approvalDetails);
            $('#approvalDetailsList').trigger('create');
            closeLoading();
        }
        else if (AppType == 'NTEApproval') {
            var approvalFinancialDetails = "";
            var approvalHistoryDetails = "";
            var approvalLocationDetails = "";
            var approvalDetails = "";
            $('#approvalDetailsHeading').text(GetTranslatedValue('NTEApprovalDetailsLabel') + localStorage.getItem("WorkOrderNumber"));
            approvalFinancialDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsFinancialLabel')) +
                                   CreateApprovalList("NTEFinancial", resultData) + '</ul></div>';
            approvalHistoryDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsHistoryLabel')) +
                                 CreateApprovalList("ApprovalHistory", resultData) + '</ul></div>';
            approvalLocationDetails = CreateApprovalHeader(GetTranslatedValue('approvalDetailsLabel')) +
                                 CreateApprovalList("Details", resultData) + '</ul></div>';
            approvalDetails = approvalFinancialDetails + approvalHistoryDetails + approvalLocationDetails;
            $('#approvalDetailsList').append(approvalDetails);
            $('#approvalDetailsList').trigger('create');
            closeLoading();
        }
    });
}

/// <summary>
///Method to update work order status.
/// </summary>
function updateWOStatus(obj) {
    var pageID = $.mobile.activePage.attr('id');
    var reasonforrejection;
    $("#hiddenWorkOrderNumber").val($("#" + obj.id).attr("data-WorkOrderNumber"));
    $("#hiddenStatus").val($("#" + obj.id).attr("data-status"));
    $("#hiddenApprovalType").val($("#" + obj.id).attr("data-approvalType"));
    if (navigator.onLine) {
        if ($("#hiddenRejectReason").val() == "") {
            //if ($("#" + obj.id).attr("data-approvalType") == "NTEApproval" || $("#" + obj.id).attr("data-approvalType") == "InvoiceApproval") {
                SavereasonForRejection($("#hiddenWorkOrderNumber").val(), $("#hiddenStatus").val(), $("#hiddenApprovalType").val());
            /*}
            else {
                showActionPopupLoading();

                var ApprovalStatus = $("#" + obj.id).attr("data-status");
                localStorage.setItem("ApprovalType", $("#" + obj.id).attr("data-approvalType"));
                var data = {
                    "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                    "Language": localStorage.getItem("Language"),
                    "Username": decryptStr(localStorage.getItem("Username")),
                    "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                    "WorkOrderNumber": $("#" + obj.id).attr("data-WorkOrderNumber"),
                    "ApprovalStatus": $("#" + obj.id).attr("data-status"),
                    "ApprovalType": localStorage.getItem("ApprovalType"),
                    "GPSLocation": GlobalLat + "," + GlobalLong,
                    "SessionID": decryptStr(getLocal("SessionID"))
                };
                var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=UpdateApprovalStatus";
                $.ajaxApprovalPostJSON(accessURL, data, function (resultData) {        
                    Approval.FinalizeApprovalProcess(ApprovalStatus, resultData);
                });
            }*/
        }
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
///Method to create approval header.
/// </summary>
/// <param name="HeaderText">Holds text of the header.</param>
function CreateApprovalHeader(HeaderText) {
    var approvalDetailsHeader = "";
    approvalDetailsHeader = approvalDetailsHeader +
                                   '<div data-role="collapsible" data-inset="true">' +
                                   '<h4><strong class="boldfont">' + HeaderText + '</strong></h4>' +
                                   '<ul data-role="listview">';
    return approvalDetailsHeader;
}

/// <summary>
///Method to create approval list.
/// </summary>
/// <param name="ListType">Holds type of list.</param>
function CreateApprovalList(ListType, data) {
    var approvalDetailsList = "";
    var currencySettings;
    
    if (typeof data.Table2[0] === "undefined" || IsStringNullOrEmpty(data.Table2[0].CurrencyCode)) {
        currencySettings = {
            maximumSignificantDigits: 2
        };
    } else {
        currencySettings = {
            style: "currency",
            currency: data.Table2[0].CurrencyCode
        }
    }
    
    if (ListType == "Financial") {

        approvalDetailsList = approvalDetailsList +
                              '<li><p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialEstimatedCostLabel') +
        '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].BidAmount) ? "" : data.Table2[0].BidAmount.toLocaleString(getLocal("Language"), currencySettings)) +
                              ' ' + (IsStringNullOrEmpty(data.Table2[0].CurrencyCode) ? "" : data.Table2[0].CurrencyCode) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialCostCenterLabel') +
                              '<strong class="boldfont" style="font-size: 0.9em">' + (IsStringNullOrEmpty(data.Table2[0].CostCenter) ? "" : data.Table2[0].CostCenter) + '</strong></p>' +
                              '<p class="lable"  style="font-size: 0.9em">' + GetTranslatedValue('FinancialReference1Label') +
                              '<strong class="boldfont" style="font-size: 0.9em">' + (IsStringNullOrEmpty(data.Table2[0].Reference) ? "" : data.Table2[0].Reference) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialReference2Label') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].Reference2) ? "" : data.Table2[0].Reference2) + '</strong></p>' +
                              '</li>';
    }

    else if (ListType == "Details") {
        var SiteLabels = getLocal("SiteLabels").split('$');
        approvalDetailsList = approvalDetailsList + '<li><p class="lable" style="font-size: 0.9em">' + SiteLabels[0] + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table[0].Level_1) ? "" : data.Table[0].Level_1) +
                              '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + SiteLabels[1] + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table[0].Level_2) ? "" : data.Table[0].Level_2) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDetailsAddressLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table[0].Address) ? "" : data.Table[0].Address) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDetailsBuildingIDLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table[0].BuildingID) ? "" : data.Table[0].BuildingID) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDetailsProjectLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table[0].ProjectNumber) ? "" : data.Table[0].ProjectNumber) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDetailsProblemDescriptionLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table1[0].ProblemDescription) ? "" : data.Table1[0].ProblemDescription) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDetailsCompletionDescriptionLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table1[0].CompletionDescription) ? "" : data.Table1[0].CompletionDescription) + '</strong></p>' +
                              '</li>';
    }

    else if (ListType == "InvoiceSummary") {
        if (data.Table2.length > 0) {
            approvalDetailsList = approvalDetailsList + '<li><p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('LaborAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalLabor) ? "" : data.Table2[0].TotalLabor.toLocaleString(getLocal('Language'), currencySettings)) +
                              '</strong></p>' +

                               '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('MaterialAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalMaterial) ? "" : data.Table2[0].TotalMaterial.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('MileageAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalMileage) ? "" : data.Table2[0].TotalMileage.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('TravelAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalTravel) ? "" : data.Table2[0].TotalTravel.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('TravelFlatFeeAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalTravelFee) ? "" : data.Table2[0].TotalTravelFee.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('MiscellaneousAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalMisc) ? "" : data.Table2[0].TotalMisc.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FreightAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TotalFreight) ? "" : data.Table2[0].TotalFreight.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('TaxAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].TaxAmount) ? "" : data.Table2[0].TaxAmount.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('NTE') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].BidAmount) ? "" : data.Table2[0].BidAmount.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('InvoiceAmount') + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].InvoiceAmount) ? "" : data.Table2[0].InvoiceAmount.toLocaleString(getLocal('Language'), currencySettings)) + '</strong></p>' +
                              '</li>';

        }
    }

    else if (ListType == "ApprovalHistory") {
        var approverTabelLength = data.Table3.length;
        if (approverTabelLength > 0) {
            for (var index = 0; index < approverTabelLength; index++) {
                approvalDetailsList = approvalDetailsList + '<li><p class="ui-li-aside ui-li-desc lable" style="font-size: 0.9em"">' + GetTranslatedValue('approvalStatusLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table3[index].ApprovalStatus) ? "" : data.Table3[index].ApprovalStatus) +
                              '</strong></p>' +
                              '<span class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalNameLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table3[index].ApproverName) ? "" : data.Table3[index].ApproverName) +
                              '</strong></span><br />' +
                              '<span class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalDateLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table3[index].ApprovalDate) ? "" : data.Table3[index].ApprovalDateStr) +
                              '</strong></span><br />' +
                              '<span class="lable" style="font-size: 0.9em">' + GetTranslatedValue('approvalMethodLabel') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table3[index].ApprovalMethod) ? "" : data.Table3[index].ApprovalMethod) +
                              '</strong></span><br /></li>';
            }
        }

    }
    else if (ListType == "NTEFinancial") {

        var projectFixedCost = '';
        var length = '';
        if (data.Table3 != null && data.Table3 != undefined) {
            length = data.Table3.length;
        }

        var proposedNteValue = GetTranslatedValue('ProposedNTELabel');
        var currentNteValue = GetTranslatedValue('CurrentNTELabel');

        if (data.Table3[length - 1].CostField == 0 || IsStringNullOrEmpty(data.Table3[length - 1]["CostField"])) {
            projectFixedCost = '<li><p class="lable" style="font-size: 0.9em">' + proposedNteValue + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].ProposedNTE) ? "" : data.Table2[0].ProposedNTE.toLocaleString(getLocal('Language'), currencySettings)) +
                              ' ' + (IsStringNullOrEmpty(data.Table2[0].CurrencyCode) ? "" : data.Table2[0].CurrencyCode) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + currentNteValue + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].BidAmount) ? "0" : data.Table2[0].BidAmount.toLocaleString(getLocal('Language'), currencySettings)) +
                              ' ' + (IsStringNullOrEmpty(data.Table2[0].CurrencyCode) ? "" : data.Table2[0].CurrencyCode) + '</strong></p>';
        }

        if (data.Table3[length - 1].CostField == 1) {
            projectFixedCost = '<li><p class="lable" style="font-size: 0.9em">' + proposedNteValue + '(' + localStorage.getItem("ProjectFixedCostCASLabel") + ')' + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].ProposedNTE) ? "" : data.Table2[0].ProposedNTE.toLocaleString(getLocal('Language'), currencySettings)) +
                              ' ' + (IsStringNullOrEmpty(data.Table2[0].CurrencyCode) ? "" : data.Table2[0].CurrencyCode) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + currentNteValue + '(' + localStorage.getItem("ProjectFixedCostCASLabel") + ')' + ': ' +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].ProjectFixedCost) ? "0" : data.Table2[0].ProjectFixedCost.toLocaleString(getLocal('Language'), currencySettings)) +
                              ' ' + (IsStringNullOrEmpty(data.Table2[0].CurrencyCode) ? "" : data.Table2[0].CurrencyCode) + '</strong></p>';
        }

        approvalDetailsList = approvalDetailsList + projectFixedCost +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialCostCenterLabel') +
                              '<strong class="boldfont" style="font-size: 0.9em">' + (IsStringNullOrEmpty(data.Table2[0].CostCenter) ? "" : data.Table2[0].CostCenter) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialReference1Label') +
                              '<strong class="boldfont" style="font-size: 0.9em">' + (IsStringNullOrEmpty(data.Table2[0].Reference) ? "" : data.Table2[0].Reference) + '</strong></p>' +
                              '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('FinancialReference2Label') +
                              '<strong class="boldfont">' + (IsStringNullOrEmpty(data.Table2[0].Reference2) ? "" : data.Table2[0].Reference2) + '</strong></p>' +
                              '</li>';
    }


    return approvalDetailsList;
}

/// <summary>
/// Method to refresh approval list.
/// </summary> 
function refreshApprovalList() {
    //// If localStorage.getItem("ApprovalType") is null the its the first time load. 
    if (localStorage.getItem("ApprovalTabType") != null) {
        switch (localStorage.getItem("ApprovalTabType")) {
            case "PreApproval": GetPreApprovalOrders('2');
                break;
            case "InvoiceApproval": GetPreApprovalOrders('3');
                break;
            case "NTEApproval": GetPreApprovalOrders('4');
                break;
            case "All": GetPreApprovalOrders('1');
                break;
            default: break;
        }
    }
    else {
        //// Take Company Default Value for first time load. and last selected ApprovalType for subsequent loads.
        if (localStorage.getItem("ApprovalDashboardStartsWith") == "InvoiceApproval") {
            GetPreApprovalOrders('3');
        }
        else if (localStorage.getItem("ApprovalDashboardStartsWith") == "PreApproval") {
            GetPreApprovalOrders('2');
        }
        else if (localStorage.getItem("ApprovalDashboardStartsWith") == "NTEApproval") {
            GetPreApprovalOrders('4');
        }
        else if (localStorage.getItem("ApprovalDashboardStartsWith") == "All") {
            GetPreApprovalOrders('1');
        }
    }
}


/// <summary>
/// Method to get next approval list.
/// </summary>
function GetNextApprovalList(obj) {
    var option = "";
    var pageNumber = parseInt($("#approvalDashboardPage").find("#" + obj.id).attr('data-nextPage')) + 1;
    switch (localStorage.getItem("ApprovalTabType")) {
        case "PreApproval":
            option = '2';
            break;
        case "InvoiceApproval":
            option = '3';
            break;
        case "NTEApproval":
            option = '4';
            break;
        default: break;
    }

    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "PageSize": "10",
        "PageNumber": pageNumber,
        "Option": option,
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    if (navigator.onLine) {
        showLoading();
        var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=PreApproval";
        $.ajaxApprovalPostJSON(accessURL, myJSONobject, function (resultData) {
            if (resultData.Table.length > 0) {
                $("#approvalDashboardPage").find("#approvalListMoreButton").attr('data-nextPage', parseInt($("#approvalDashboardPage").find("#approvalListMoreButton").attr('data-nextPage')) + 1);
                switch (myJSONobject.Option) {
                    case '2':
                        hideNShowMoreButton(resultData.Table.length);
                        BindMoreApprovalList(resultData, myJSONobject.Option);
                        closeLoading();
                        break;
                    case '3':
                        hideNShowMoreButton(resultData.Table.length);
                        BindMoreApprovalList(resultData, myJSONobject.Option);
                        closeLoading();
                        break;
                    case '4':
                        hideNShowMoreButton(resultData.Table.length);
                        BindMoreApprovalList(resultData, myJSONobject.Option);
                        closeLoading();
                        break;
                    default: break;
                }
            }
        });
    }
}

/// <summary>
/// Method to bind more approval list.
/// </summary>
/// <param name="resultData">Holds approval results.</param>
/// <param name="approvalOption">Contains types of approval.</param>
function BindMoreApprovalList(resultData, approvalOption) {
    var approvalRecords = "";
    for (var approvalRecordLength = 0; approvalRecordLength < resultData.Table.length; approvalRecordLength++) {
        approvalRecords = approvalRecords + createAllApprovalList(resultData, approvalRecordLength);
    }

    switch (approvalOption) {
        case '2':
            ////            localStorage.setItem("ApprovalTabType", "PreApproval");
            ////            $("#preApprovalList").empty(); $("#preApprovalList").show();
            $("#preApprovalList").append(approvalRecords);
            $('#preApprovalList').listview('refresh');
            if ($('#preApprovalList li').length == resultData.Table1[0].Count)
                $('#approvalListMoreButton').hide();
            break;
        case '3':
            ////            localStorage.setItem("ApprovalTabType", "InvoiceApproval");
            ////            $("#invoiceApprovalList").empty(); $("#invoiceApprovalList").show();
            $("#invoiceApprovalList").append(approvalRecords);
            $('#invoiceApprovalList').listview('refresh');
            if ($('#invoiceApprovalList li').length == resultData.Table1[0].Count)
                $('#approvalListMoreButton').hide();
            break;
        case '4':
            ////            localStorage.setItem("ApprovalTabType", "NTEApproval");
            ////            $("#nteApprovalList").empty(); $("#nteApprovalList").show();
            $("#nteApprovalList").append(approvalRecords);
            $('#nteApprovalList').listview('refresh');
            if ($('#nteApprovalList li').length == resultData.Table1[0].Count)
                $('#approvalListMoreButton').hide();
            break;
        default: break;
    }
}

/// <summary>
/// Method to save reason for rejection.
/// </summary>
/// <param name="workordernumber">Holds the work order number.</param>
/// <param name="status">Defines the status.</param>
/// <param name="approvaltype">Holds the type of approval.</param>
function SavereasonForRejection(workordernumber, status, approvaltype) {
    var pageID = $.mobile.activePage.attr('id');
    // Perform a blur on the DropDown to remove the dropdown list should it appear again.
    // Then a fixedtoolbar("show") is required because of a de-sync issue with the main header from the 
    // automatic selection of the dropdown list again.
    //$("#ReasonForRejectionDropDown").blur();  
      
    workordernumber = $("#hiddenWorkOrderNumber").val();
    status = $("#hiddenStatus").val();
    approvaltype = $("#hiddenApprovalType").val();
    if($("#hiddenStatus").val() != "approve"){
        $("#ResonForRejectionLabel").text(GetTranslatedValue('ResonForRejection'));
        $("#ResonForRejectionComment").html("<span style='color:red;'>*</span> " + "Comment");
    }else{
        $("#ResonForRejectionLabel").text("Please enter the Reason for Approval");
        $("#ResonForRejectionComment").text("Comment");
    }
    if ($("#hiddenRejectReason").val() == "" && $("#ResonForRejectionTextBox").val() == "") {
        if ($("#hiddenStatus").val() != "approve" && getLocal("Approval_ShowRejectionReason") == 1 && approvaltype.toLowerCase() == "invoiceapproval") {  
            //$("#" + pageID).find(" .page-header").fixedtoolbar("show");  
                $("rejectionReasonDropDownDiv").show(); 
                $("#ReasonForRejectionDropDown").parentsUntil(".ui-select").parent().show();                    
                $("#RejectionReasonDiv").popup("open");
                $("#SubmitButton").addClass("ui-disabled");
                return;            
        } else if (($("#hiddenStatus").val() != "approve" && getLocal("Approval_ShowRejectionReason") == 1) || ($("#hiddenStatus").val() == "approve" && getLocal("Approval_ShowApprovalReason") == 1) ) {
                if (approvaltype.toLowerCase() != "invoiceapproval") {
                    $("#rejectionReasonDiv").hide();
                    $("#ReasonForRejectionDropDown").parentsUntil(".ui-select").parent().hide();                    
                }
                if($("#hiddenStatus").val() == "approve"){
                    $("#rejectionReasonDiv").hide();
                    $("#ReasonForRejectionDropDown").parentsUntil(".ui-select").parent().hide();                    
                }
                
                $("#RejectionReasonDiv").popup("open");
                if($("#hiddenStatus").val() != "approve"){
                    $("#SubmitButton").addClass("ui-disabled");
                }else{
                    $("#SubmitButton").removeClass("ui-disabled");
                }
                return;        
        }else{
            SavereasonForRejectionFromPopUp();
        }
    }
}

/// <summary>
/// Method to approve/Reject order from popup.
/// </summary>
function SavereasonForRejectionFromPopUp(){
    $("#hiddenRejectReason").val($("#ResonForRejectionTextBox").val());    
    $('#RejectionReasonDiv').popup().popup("close");
    
    setTimeout(function () {
        showActionPopupLoading();
    }, 1000);

    workordernumber = $("#hiddenWorkOrderNumber").val();
    status = $("#hiddenStatus").val();
    approvaltype = $("#hiddenApprovalType").val();

    localStorage.setItem("ApprovalType", approvaltype);
    var data = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "WorkOrderNumber": workordernumber,
        "ApprovalStatus": status,
        "ApprovalType": approvaltype,
        "ReasonForRejectionDropDown": securityError($("#ReasonForRejectionDropDown")),
        "ReasonForRejection": securityError($("#hiddenRejectReason")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=UpdateApprovalStatus";
    $.ajaxApprovalPostJSON(accessURL, data, function (resultData) {
        Approval.FinalizeApprovalProcess(status, resultData);
    });

    $("#hiddenRejectReason").val("");
    $("#ResonForRejectionTextBox").val("");
    $("#AddCommentCharLimitNos").text("500");
    $("#ReasonForRejectionDropDown").val("-1").selectmenu("refresh");
}

/// <summary>
/// Method to clear rejection.
/// </summary>
function ClearRejection() {
    //$("#ReasonForRejectionDropDown").blur();
    $("#AddCommentCharLimitNos").text("500");
    $("#ReasonForRejectionDropDown").val("-1").selectmenu("refresh");
    $("#ResonForRejectionTextBox").val('');
}

/// <summary>
/// Method to save button enable.
/// </summary>
function SaveButtonEnable(max) {
    if(max != 0){
        var maxLength = max;
        $('textarea').keyup(function () {
            var length = $(this).val().length;
            var length = maxLength - length;
            $('#AddCommentCharLimitNos').text(length);
        });
    }
    if ($("#hiddenStatus").val() == "approve" || ($("#ResonForRejectionTextBox").val().length > 0 &&
        (($("#hiddenApprovalType").val().toLowerCase() != "invoiceapproval")
        || ($("#hiddenApprovalType").val().toLowerCase() == "invoiceapproval" && $("#ReasonForRejectionDropDown").val() !== "-1")))) {
        $("#SubmitButton").removeClass("ui-disabled");
    } else {
        $("#SubmitButton").addClass("ui-disabled");
    }
}

function GetCASLabelValue() {
    var data = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "Type": "7",
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=GetCASLabelValue";
    if (navigator.onLine) {
        showLoading();
        $.ajaxApprovalPostJSON(accessURL, data, function (result) {
            if (!IsStringNullOrEmpty(result)) {
                localStorage.setItem("ProjectFixedCostCASLabel", result);
            }
        });
    }
}

function setNavBarHeight() {
    var navBar = $(".ui-navbar ul li");
    var offset = 23;
    var maxInner = 0;

    // Reset the offset if the images in the bar have loaded. Otherwise they'll result in goofy heights.
    if ($(".tabicon").width() != 0) {
        offset = 0;
    }
    for (i = 0; i < navBar.length; i++) {
        var ih = $(navBar[i]).find(".ui-btn-inner").innerHeight();

        if (ih > maxInner) {
            maxInner = ih;
        }
    }

    navBar.each(function (index, li) {
        var innerObj = $(li).find(".ui-btn-inner");

        innerObj.innerHeight(maxInner+offset);
    });
}

/**
 * Retrieve the contents of the Invoice Rejection Reason dropdown.
 * @returns {Array} The objects that belong in the dropdown.
 */
Approval.GetInvoiceRejectionReasons = function () {
    var deferred = $.Deferred();
    
    var data = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID")),
    }
    
    var accessURL = standardAddress + "ApprovalDashboard.ashx?methodname=GetInvoiceRejectionReasons";
    $.ajaxApprovalPostJSON(accessURL, data, function(result) {
        if (typeof result.Table != "undefined") {
            deferred.resolve(result.Table);
        } else {
            deferred.reject();
        }
    });
    return deferred.promise();
}

/**
 * Handle the results from the updated approval process.
 * @param {String} status - String value of the status for the approval.
 * @param {Object} resultData - The result data from the approval submission.
 */
Approval.FinalizeApprovalProcess = function (status, resultData) {
    var approvalSuccessLabel = GetTranslatedValue('ApprovalStatusSuccess');
    var approvalRejectLabel = GetTranslatedValue('ApprovalStatusReject');
    var approvaltype = $("#hiddenApprovalType").val();
    if (approvaltype.toLowerCase() == "invoiceapproval") {
        approvalSuccessLabel = GetTranslatedValue('InvoiceStatusSuccess');
        approvalRejectLabel = GetTranslatedValue('InvoiceStatusReject');
    }
    
    if ($.mobile.activePage.attr('id') == "approvalDetailsPage") {
        if (status == "approve") {
            if (resultData.Status == 1) {
                $('#WOApprovalStatusMessage').text(approvalSuccessLabel);
            }
            else {
                $('#WOApprovalStatusMessage').text(GetTranslatedValue('WorkOrderApprovalFailure'));
            }
        }
        else {
            if (resultData.Status == 1) {
                $('#WOApprovalStatusMessage').text(approvalRejectLabel);
            }
            else {
                $('#WOApprovalStatusMessage').text(GetTranslatedValue('WorkOrderApprovalFailure'));
            }
        }
    }
    else {
        if (status == "approve") {
            if (resultData.Status == 1) {
                $('#WOApprovalStatusMessage').text(approvalSuccessLabel);
            }
            else {
                $('#WOApprovalStatusMessage').text(GetTranslatedValue('WorkOrderApprovalFailure'));
            }
        }
        else {
            if (resultData.Status == 1) {
                $('#WOApprovalStatusMessage').text(approvalRejectLabel);
            }
            else {
                $('#WOApprovalStatusMessage').text(GetTranslatedValue('WorkOrderApprovalFailure'));
            }
        }
    }
    closeActionPopupLoading();
    setTimeout(function () {
	$('#workOrderApprovalStatusPopup').popup('open');
    }, 1000);
}