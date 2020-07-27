function navigateToLabor() {
    $.mobile.changePage("LaborDetails.html");
    ////    $.mobile.changePage("TimeCardWO.html");
    ////    setLocal("TimeCard_WorkOrderSource", "WODetails");
    ////    setLocal("TimeCard_WeekRange", workOrderNumber);
    ////    setLocal("TimeCard_EmployeeNumber", localStorage.getItem("EmployeeNumber"));
}

function getLabor() {
    var myJSONobject = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "WorkOrdernumber": getLocal("WorkOrderNumber"),
        "RecordsPerPage": getLocal("RecordsPerPage"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber"))
    };
    var laborDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=LaborDetailsPage";
    getLaborDetails(laborDetailsURL, myJSONobject);
}
var laborData = "";
function getLaborDetails(laborDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(laborDetailsURL, myJSONobject, function (data) {
            laborData = data;
            bindLaborData(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function bindLaborData(data) {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID).find("#LabourWONum span span").html(GetCommonTranslatedValue("WorkOrderNumLabel") + ' ' + getLocal("WorkOrderNumber"));
    if (data.length === 0) {
        $("#" + pageID).find("#NoLabourList").show();
    }
    else {

        $("#" + pageID).find("#NoLabourList").hide();
        var nameString = "";
        var count = 0;
        for (var i = 0; i < data.length; i++) {
            var divA;
            var RegularHours = data[i].RegularHours + data[i].RegularDriveHours;
            var OverTimeHours = data[i].OverTimeHours + data[i].OverTimeDriveHours;
            var PremiumHours = data[i].PremiumHours + data[i].PremiumDriveHours;
            var SpecialHours = data[i].SpecialHours + data[i].SpecialDriveHours;
            var total = RegularHours + OverTimeHours + PremiumHours + SpecialHours;

            var totalDrv = data[i].RegularDriveHours + data[i].OverTimeDriveHours + data[i].SpecialDriveHours + data[i].PremiumDriveHours;
            var totalLab = data[i].RegularHours + data[i].OverTimeHours + data[i].SpecialHours + data[i].PremiumHours;
            
            //New Fields
            var Arrival = data[i].ArrivalStringData;
            var Departure = data[i].DepartureStringData;
            var Miles = data[i].Miles;

            var dynamicStr = data[i].EmployeeNameLNF;

            if (dynamicStr != nameString) {
                collapsibleTag = '';
                nameString = dynamicStr;
                count++;
                
                divA = document.createElement('div');
                divA.setAttribute("data-role", "collapsible");
                if (i == 0) {
                    divA.setAttribute("data-collapsed", "false");
                }
                var h4 = document.createElement('h4');
                h4.innerHTML = GetTranslatedValue("NameLabel") + ' ' + data[i].EmployeeNameLNF;
                divA.appendChild(h4);
                
                ultag = document.createElement('ul');
                ultag.setAttribute("class", "ui-listview");
                ultag.setAttribute("data-role", "listview");
            }
            
            var collapsibleTag = '<li><a id="LaborListData href="#" onclick="WO_Edit(' + i + ')" class="ui-link-inherit">' +
            '<p class="ui-li-desc" ="width:50%"><strong>' + Arrival + ' - ' + Departure + '</strong></p>' +
            '<div class="ui-grid-a"><span class="ui-block-a" style="font-size:0.9em">' + GetTranslatedValue("MilesLabel") + ' ' + Miles + '</br>' + GetTranslatedValue("TotalLaborLabel") + ' ' + totalLab + '</span>' +
            '<span class="ui-block-b" style="font-size:0.9em">' + GetTranslatedValue("TotalTimeLabel") + ' ' + total + '</br>' + GetTranslatedValue("TotalDriveLabel") + ' ' + totalDrv + '</span></div></a></li>';
            
            ultag.innerHTML = ultag.innerHTML + collapsibleTag;
            divA.appendChild(ultag);

            $("#" + pageID).find("#OffLabourList").append(divA);
        }
        if (count > 1) {
            $("#" + pageID).find("#OffLabourList div[data-collapsed='false']")[0].setAttribute("data-collapsed", "true");
        }
        $("#" + pageID).find("#OffLabourList").trigger("create");
    }

    if (getLocal("WorkOrderStatus") != null || getLocal("WorkOrderStatus") != '') {
        if (getLocal("WorkOrderStatus") === "CMP" || getLocal("WorkOrderStatus") === "CAN") {
            setLocal("WorkOrderStatus", null);
            $("#laborDetailsPage #LabourListData").addClass("ui-disabled");
        }
    }
}

function WO_Edit(index) {
    setLocal("TimeCard_WorkOrderSource", "LaborEntryEdit");
    setLocal("TimeCard_WorkOrder", GetCommonTranslatedValue("WorkOrderNumLabel") + ' ' + getLocal("WorkOrderNumber"));
    setLocal("TimeCard_EmployeeNumber", decryptStr(getLocal("EmployeeNumber")));
    setLocal("LaborData", JSON.stringify(laborData));
    setLocal("LaborDataIndex", index);
    $.mobile.changePage("TimeCardWO.html");
}