function WorkOrderDetailsPageShow(WONo, key) {
    try {
        $("body").attr("data-WONum", WONo);
        setLocal("WorkOrderNumber", WONo);
//        if (getLocal("ScreenName") == "OrderSearch") {
//            setLocal("ScreenName", "OrderSearch\WorkOrdersView");
//        }
//        else if (getLocal("ScreenName") == "DailyWorkOrder") {
//            setLocal("ScreenName", "DailyWorkOrder\WorkOrdersView");
//        }
        $.mobile.changePage("WorkOrderDetails.html");
    }
    catch (e) {
    }
}

function navigateToSearchScreen() {
    if (navigator.onLine) {
        if (getLocal("ScreenName") == "OrderSearch") {
            $.mobile.changePage("SearchOrder.html");
        }
        else if (getLocal("ScreenName") == "DailyWorkOrder") {
            $.mobile.changePage("DailySearch.html");
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function SearchBindCollapsible(data) {
    var dateSearch = getLocal("DateSearchChk");
    var enableGroupBy = data.showGroupByOptions;
    setLocal("enableGroupBy", enableGroupBy);
    if ((dateSearch == "true" || dateSearch === true) && enableGroupBy === false) {
        setLocal("WorkOrderViewGroupByValue", "EnteredDate");
        $('.dropDownList').hide();
    }
    else {
        $('.dropDownList').show();
    }
    try {
        var dataLength = "";
        var groupByData = "";
        var pageID = $.mobile.activePage.attr('id');
        $("#WorkOrderListDiv").empty();
        var HTPriority = GetTranslatedValue("PriorityDropDownOption");
        var HTStatus = GetTranslatedValue("StatusDropDownOption");
        var HTAssignment = GetTranslatedValue("AssignmentLabel");
        var HTProblemDescription = GetTranslatedValue("ProblemDescriptionLabel");

        var NOVALUE = GetTranslatedValue("NoDateNextArrivalSiteLabel");
        var headerMsg = GetTranslatedValue("NoOFWO");
        $("#" + pageID).find("#NoOFWO").html(headerMsg + ' (' + data.NumberOfRecords + ')');

        if (data.NumberOfRecords === 0) {
            $("#" + pageID).find(".NoOrders").show();
        }
        else {
            $("#" + pageID).find(".NoOrders").hide();
        }

        var resultThreshold = 200;
        if (!isNaN(getLocal("SearchResultThreshold")) && getLocal("SearchResultThreshold") != null && getLocal("SearchResultThreshold") != undefined) {
            resultThreshold = getLocal("SearchResultThreshold");
        }

        if (data.NumberOfRecords >= resultThreshold) {
            $("#" + pageID).find(".topSearch").show();
            var msg = $("#" + pageID).find("#topSearchMessage").text();
            msg = msg.replace("XXX", resultThreshold);
            $("#" + pageID).find("#topSearchMessage").text(msg);
        }
        else {
            $("#" + pageID).find(".topSearch").hide();
        }

        var WoGroupBy = getLocal("WorkOrderViewGroupByValue");

        if (WoGroupBy === null || WoGroupBy == "null") {
            var OrderListingGroupBy = getLocal('OrderListingGroupBy');
            if (OrderListingGroupBy.toUpperCase() == "PRIORITY") {
                dataLength = data.Priorty.length;
                groupByData = data.Priorty;
                groupByData.sort(sortAlphaNum);
            }
            else if (OrderListingGroupBy.toUpperCase() == "STATUS") {
                dataLength = data.Status.length;
                groupByData = data.Status;
                groupByData.sort();
            }
            else if (OrderListingGroupBy.toUpperCase() == "ENTEREDDATE") {
                dataLength = data.Data.length;
                groupByData = data.Data;
                groupByData.sort(sort_Orders("", true, Date.parse, "Date"));
            }
            else if (OrderListingGroupBy.toUpperCase() == "BUILDING") {
                dataLength = data.Location.length;
                groupByData = data.Location;
                groupByData.sort();
            }
            else if (OrderListingGroupBy.toUpperCase() == "TARGETDATE") {            
                dataLength = data.CompletionTarget.length;
                groupByData = data.CompletionTarget;
                groupByData.sort(sort_Orders("", false, Date.parse, "Date"));
            }
            else if (OrderListingGroupBy.toUpperCase() == "ETADATE") {
                dataLength = data.DateNextArrivalSite.length;
                groupByData = data.DateNextArrivalSite;
                groupByData.sort(sort_Orders("", false, Date.parse, "Date"));
            }
            else {
                dataLength = data.PropertyID.length;
                groupByData = data.PropertyID;
                groupByData.sort();
            }
        }
        else {
            if (WoGroupBy.toUpperCase() == "PRIORITY") {
                dataLength = data.Priorty.length;
                groupByData = data.Priorty;
                groupByData.sort(sortAlphaNum);
            }
            else if (WoGroupBy.toUpperCase() == "STATUS") {
                dataLength = data.Status.length;
                groupByData = data.Status;
                groupByData.sort();
            }
            else if (WoGroupBy.toUpperCase() == "ENTEREDDATE") {
                dataLength = data.Data.length;
                groupByData = data.Data;
                groupByData.sort(sort_Orders("", true, Date.parse, "Date"));
            }
            else if (WoGroupBy.toUpperCase() == "BUILDING") {
                dataLength = data.Location.length;
                groupByData = data.Location;
                groupByData.sort();
            }
            else if (WoGroupBy.toUpperCase() == "TARGETDATE") {               
                dataLength = data.CompletionTarget.length;
                groupByData = data.CompletionTarget;
                groupByData.sort(sort_Orders("", false, Date.parse, "Date"));
            }
            else if (WoGroupBy.toUpperCase() == "ETADATE") {
                dataLength = data.DateNextArrivalSite.length;
                groupByData = data.DateNextArrivalSite;
                groupByData.sort(sort_Orders("", false, Date.parse, "Date"));
            }
            else {
                dataLength = data.PropertyID.length;
                groupByData = data.PropertyID;
                groupByData.sort();
            }
        }

        var datestr = "";
        for (var i = 0; i < dataLength; i++) {
            var diva;
            var ultag;
            var appending;
            var count;
            if (groupByData[i] != datestr || groupByData[i] == "") {
                count = 0;
                appending = '';
                datestr = groupByData[i];
                var datestrVal = datestr

                if (IsObjectNullOrUndefined(datestr) || IsStringNullOrEmpty(datestr)) {
                    datestr = NOVALUE;
                    datestrVal = '';                 
                }
                
                diva = document.createElement('div');
                diva.setAttribute("data-role", "collapsible");
                diva.setAttribute("data-theme", "b");
                var divaId = datestr.replace(/ /g, '') + 'diva';
                divaId = divaId.replace(/'/g, "_");
                divaId = divaId.replace(/./g, "_");
                diva.setAttribute("id", divaId);
                var h4 = document.createElement('h4');
                h4.innerHTML = datestr;
                diva.appendChild(h4);
                h4.setAttribute('onclick', 'GetWOsForDiv("' + datestrVal + '", "' + divaId + '");');
            }

            $("#WorkOrderListDiv").append(diva);

            $("#WorkOrderListDiv").collapsibleset("refresh");
            $.mobile.loading("hide");
        }
    }
    catch (e) {
        // alert(e.message);
    }
}

function GetWOsForDiv(datestr, diva) {
    if (navigator.onLine) {
        showLoading();
        try {
            var pageID = $.mobile.activePage.attr('id');
            var HTPriority = GetTranslatedValue("PriorityDropDownOption");
            var HTStatus = GetTranslatedValue("StatusDropDownOption");
            var HTAssignment = GetTranslatedValue("AssignmentLabel");
            var HTETADate = GetTranslatedValue("DateNextArrivalSiteLabel");
            var HTProblemDescription = GetTranslatedValue("ProblemDescriptionLabel");
            var groupBy = getLocal("WorkOrderViewGroupByValue");
            if (groupBy === null || groupBy == "null") {
                groupBy = getLocal('OrderListingGroupBy');
            }
            groupBy = groupBy.toUpperCase();
            var appending = '';
            var ultag = document.createElement('ul');
            ultag.setAttribute("class", "ui-listview");
            ultag.setAttribute("data-role", "listview");
            ultag.innerHTML += GetCommonTranslatedValue("LoadingLabel");
            $('#' + diva + ' div').append(ultag);
            var myJSONobject = iMFMJsonObject({
                "Username": decryptStr(getLocal("Username")),
                "ScreenName": getLocal("ScreenName"),
                datestr: datestr,
                SWONumTextBox: getLocal("SWONumTextBox"),
                SCompletionDDL: getLocal("SCompletionDDL"),
                SPidTextBox: getLocal("SPidTextBox"),
                SCategoryDDL: getLocal("SCategoryDDL"),
                DateSearchChk: getLocal("DateSearchChk"),
                SFromDateTextBox: getLocal("SFromDateTextBox"),
                SToDateTextBox: getLocal("SToDateTextBox"),
                SSortDDL: getLocal("SSortDDL"),
                SSortDDLText: getLocal("SSortDDLText"),
                SCategoryDDLText: getLocal("SCategoryDDLText"),
                TodayDate: getLocal("TodayDate"),
                SL1_DropDownListValue: getLocal("SL1_DropDownListValue"),
                SL1_DropDownListText: getLocal("SL1_DropDownListText"),
                SL2_DropDownListValue: getLocal("SL2_DropDownListValue"),
                SL2_DropDownListText: getLocal("SL2_DropDownListText"),
                SL3_DropDownListValue: getLocal("SL3_DropDownListValue"),
                SL3_DropDownListText: getLocal("SL3_DropDownListText"),
                SL4_DropDownListValue: getLocal("SL4_DropDownListValue"),
                SL4_DropDownListText: getLocal("SL4_DropDownListText"),
                PdaDailySearchSelectedDate: getLocal("PdaDailySearchSelectedDate"),
                WOViewGroupBy: groupBy,
                OrderType: getLocal("OrederTypeValues")
                });
            
            $.postSearchJSON(standardAddress + "SearchOrder.ashx?method=GetWOsForDiv", myJSONobject, function (result) {
                closeLoading();
                ultag.innerHTML = '';
                if (result.Result == 'error') {
                    ultag.innerHTML = GetCommonTranslatedValue('ErrorLoading');
                    return true;
                }

                $('#' + diva + ' div').empty();
                for (var i = 0; i < result.length; i++) {
                    var wo = "'" + result[i].WorkOrderNumber + "'";
                    var key = "'" + result[i].OrderKey + "'";
                    var AssignName = result[i].AssignedName;
                    var ProblemDescription = result[i].ProblemDescription;
                    appending = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-iconpos="right" class="ui-link-inherit ui-btn"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a id="' + result[i].WorkOrderNumber + '" onclick="javascript:WorkOrderDetailsPageShow(' + wo + ',' + key + ')" class="ui-link-inherit ui-btn ui-btn-icon-right ui-icon-carat-r wocollapsiblecontainer"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ': ' + result[i].Priority + '</strong></p> <span style="font-size: 14px">' + result[i].WorkOrderNumber + '</span><br />' +
                                    '<span style="font-size: 12px">' + HTStatus + ': ' + result[i].Status + '</span><br />' +
                                    '<span style="font-size: 12px">' + HTAssignment + ': ' + AssignName + '</span><br />' +
                                    '<ETAPANEL>' + 
                                    '<span style="font-size: 12px">' + HTProblemDescription + ': ' + ProblemDescription + '</span><br />' +
                                    '<span style="font-size: 12px">' + result[i].Location + '</span></a></div></div></li>';

                    if (!IsNullOrUndefined(result[i].DateNextArrivalSite)) {
                    	var timeZoneStr = (IsObjectNullOrUndefined(result[i].SiteTZ) || IsStringNullOrEmpty(result[i].SiteTZ)) ? '' : ' ' + result[i].SiteTZ;
                        appending = appending.replace('<ETAPANEL>', '<span style="font-size: 0.8em">' + HTETADate + ' : ' + result[i].DateNextArrivalSiteStr + timeZoneStr + '</span><br />');
                    } else {
                        appending = appending.replace('<ETAPANEL>', '');
                    }
                             
                    ultag.innerHTML += appending;
                }
                $('#' + diva + ' div').append(ultag);
            });
        }
        catch (error) {
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function WOViewDataLoad() {
    if (navigator.onLine) {
        showLoading();
        var myJSONobject = iMFMJsonObject({
            "Username": decryptStr(getLocal("Username")),
            "ScreenName": getLocal("ScreenName"),
            SWONumTextBox: getLocal("SWONumTextBox"),
            SCompletionDDL: getLocal("SCompletionDDL"),
            SPidTextBox: getLocal("SPidTextBox"),
            SCategoryDDL: getLocal("SCategoryDDL"),
            DateSearchChk: getLocal("DateSearchChk"),
            SFromDateTextBox: getLocal("SFromDateTextBox"),
            SToDateTextBox: getLocal("SToDateTextBox"),
            SSortDDL: getLocal("SSortDDL"),
            SSortDDLText: getLocal("SSortDDLText"),
            SCategoryDDLText: getLocal("SCategoryDDLText"),
            TodayDate: getLocal("TodayDate"),
            SL1_DropDownListValue: getLocal("SL1_DropDownListValue"),
            SL1_DropDownListText: getLocal("SL1_DropDownListText"),
            SL2_DropDownListValue: getLocal("SL2_DropDownListValue"),
            SL2_DropDownListText: getLocal("SL2_DropDownListText"),
            SL3_DropDownListValue: getLocal("SL3_DropDownListValue"),
            SL3_DropDownListText: getLocal("SL3_DropDownListText"),
            SL4_DropDownListValue: getLocal("SL4_DropDownListValue"),
            SL4_DropDownListText: getLocal("SL4_DropDownListText"),
            PdaDailySearchSelectedDate: getLocal("PdaDailySearchSelectedDate"),
            WOViewGroupBy: getLocal("WorkOrderViewGroupByValue"),
            OrderType: getLocal("OrederTypeValues")
        });
        $.postSearchJSON(standardAddress + "SearchOrder.ashx?method=GetWorkOrders", myJSONobject, function (serverDATA) {
            closeLoading();
            SearchBindCollapsible(serverDATA);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function WOViewGroupBy(obj) {
    if (navigator.onLine) {
        var pageID = $.mobile.activePage.attr("id");
        var WOViewGroupByVal = $("#" + pageID).find("#" + obj.id + " option:selected").val();
        setLocal(pageID + "GroupByValue", WOViewGroupByVal);
        WOViewDataLoad();
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

///////////////////////////////// Work order details js////////////////////////////////////////////
function navigateToWorkOrders() {

    //Set this to allow unlocking of the selected WO
    AllowUnLock = true;

    switch (getLocal("ScreenName")) {
        case "PastDueorder":
            $.mobile.changePage("PastDueOrders.html");
            break;
        case "DemandOrders":
            $.mobile.changePage("DemandOrders.html");
            break;
        case "PMOrders":
            $.mobile.changePage("PMOrders.html");
            break;
        case "OrderSearch":
            $.mobile.changePage("SearchOrder.html");
            break;
        case "OrderSearch\WorkOrdersView":
            setLocal("ScreenName", "OrderSearch");
            $.mobile.changePage("WorkOrdersView.html");
            break;
        case "DailyWorkOrderWorkOrdersView":
            setLocal("ScreenName", "DailyWorkOrder");
            $.mobile.changePage("WorkOrdersView.html");
            break;
        case "Create Work Order for Dispatch":
            setLocal("ScreenName", "Create Work Order for Dispatch");
            $.mobile.changePage("CreateWOD.html");
            break;
        case "SelfGen2":
            setLocal("ScreenName", "SelfGen2");
            $.mobile.changePage("CreateWOC.html");
            break;
        case "SelfGen3":
            setLocal("ScreenName", "SelfGen3");
            $.mobile.changePage("CreateWOO.html");
            break;
        case "InspectionViewWorkOrders":
            $.mobile.changePage("InspectionViewWorkOrders.html");
            break;
        case "AssetList\AssetDashboard":
        case "SelfGenAsset":
            setLocal("ScreenName","AssetList");
            $.mobile.changePage("AssetDashboard.html");
            break;
        case "AssetList\AssetDashboard\SelfGenAsset":
    	    setLocal("ScreenName","AssetList\AssetDashboard");
    	    $.mobile.changePage("AssetDashboard.html");
    	    break;
        case "AssetSearch\\AssetDashboard":
        case "AssetSearch\AssetDashboard":
            setLocal("ScreenName", "AssetSearch");
            $.mobile.changePage("AssetDashboard.html");
            break;
        case "AssetSearch\\AssetDashboard\\SelfGenAsset":
        case "AssetSearch\AssetDashboard\SelfGenAsset":
            setLocal("ScreenName", "AssetSearch\\AssetDashboard");
            $.mobile.changePage("AssetDashboard.html");
            break;
        case "AssetSearch\\AssetList\\AssetDashboard\\SelfGenAsset":
        case "AssetSearch\AssetList\AssetDashboard\SelfGenAsset":
        case "AssetSearch\\AssetList\\AssetDashboard":
        case "AssetSearch\AssetList\AssetDashboard":
            setLocal('ScreenName', "AssetSearch\\AssetList");
            $.mobile.changePage("AssetDashboard.html");
            break;
    }
}
function OpenSubPopup() {
    var createSubText = GetTranslatedValue("SubPrompt").replace('[WONUM]', getLocal('WorkOrderNumber'));
    $('#createSubData').text(createSubText);
    $('#MenuPage').panel('close');
    $('#WOCreateSubPopup').popup('open');
}

function closeCreateSub() {
    $('#createSubData').text('');
    $('#WOCreateSubPopup').popup('close');
}
function CloseSuccessPopup() {
    $('#WOCreateSubSuccessPopup').popup('close');
}
function CloseSWOCreateCloseSubPopup() {
    $('#SWOCreateCloseSubPopup').popup('close');
}
function OpenMenu() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID).find("#MenuPage").panel("open");
}

function ClosePRLPopup() {
    $('#PRLWorkOrderPopup').popup('close');
}

function OpenPRLPopup(prlStatusMessage) {    
    $('#PRLStatusMessage').text(prlStatusMessage);
    $('#MenuPage').panel('close');
    $('#PRLWorkOrderPopup').popup('open');
}
