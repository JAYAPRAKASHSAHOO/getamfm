var openInspectionsCount = false;
var noInspectionsCount = true;
var rateInspectionNumber;
var rateAllParentID;
var rateAllExpandDiv = false;
var OpenInspSecurity = [];

function GetOpenInspectionDetails() {
    openInspectionsCount = false;
    noInspectionsCount = true;
    setTimeout(function () {
        showLoading();
    }, 200);  
    
    var myJSONobject = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "Language": getLocal("Language"),
        "Username": decryptStr(getLocal("Username")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    var inspectionURL = standardAddress + "Inspection.ashx?methodname=GetOpenInspectionDetails";
    BindInspectionDetails(inspectionURL, myJSONobject);
}

function NavigateToArea(obj) {
    var regionNumber = $("#" + obj.id).attr("data-regionNumber");
    setLocal("RegionNumber", regionNumber);

    var regionDescription = ($("#" + obj.id).attr("data-regionDescription")).replace(/\,/g, ' ');
    setLocal("RegionDescription", regionDescription);

    var divisionNumber = $("#" + obj.id).attr("data-divnumber");
    setLocal("DivisionNumber", divisionNumber);

    var divisionDescription = ($("#" + obj.id).attr("data-divDescription")).replace(/\,/g, ' ');
    setLocal("DivisionDescription", divisionDescription);

    var inspectionNumber = $("#" + obj.id).attr("data-inspectionNumber");
    setLocal("InspectionNumber", inspectionNumber);

    var workOrderNumber = $("#" + obj.id).attr("data-workOrderNumber");
    setLocal("InspectionWorkOrderNumber", workOrderNumber);

    if (navigator.onLine) {
        $.mobile.changePage("InspectionAreas.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function MarkComplete(obj) {
    if (navigator.onLine) {
        LoadMyLocation();
        var data = {
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "Language": getLocal("Language"),
            "Username": decryptStr(getLocal("Username")),
            "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
            "WorkOrderNumber": $("#" + obj.id).attr("data-WorkOrder"),
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };
        var inspectionCompleteURL = standardAddress + "Inspection.ashx?methodname=MarkInspectionComplete";
        SuccessMethod(inspectionCompleteURL, data);
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function SuccessMethod(url, completeData) {
    $.postJSON(url, completeData, function (resultData) {
        if (resultData.Status == 'Success') {
            //Save Success. Show Popup.
            $('#successCompletedInspectionMessageParagraph').html(GetTranslatedValue("InspectionComplete"));

            $('#completedInspectionMessagePopUp').popup("open");
        }
        else {
            $('#completedInspectionMessagePopUp').popup("close");
            ////showError("Failed to update, please try again");
            showError(GetTranslatedValue("FaileToUpdate"));
        }
    });
}

function BindInspectionDetails(inspectionUrl, inspectionDetails) {
    $.postJSON(inspectionUrl, inspectionDetails, function (data) {
        var collapsibleSetInside = '';
        var previousDivision = '';
        $('#dynamicCollapsible').empty();
        try {
            var length = data.length;
            var dynamicHeader = '';

            for (var index = 0; index < length; index++) {
                if (data[index].Tag == 1) {
                    openInspectionsCount = true;
                    noInspectionsCount = false;
                    collapsibleSetInside = '';
                    if (previousDivision != data[index].Division) {
                        if (index !== 0) {
                            dynamicHeader = dynamicHeader + '</ul></div>';
                        }
                        dynamicHeader = dynamicHeader +
                                        '<div data-role="collapsible" id=parentCollapsible' + index + ' class="collapsibleBackground" data-inset="true">' +
                                        '<h4><strong class="boldfont">' + data[index].Division + '</strong></h4>' +
                                        '<ul data-role="listview" class="collapsibleUl" data-theme = "c">';
                        collapsibleSetInside = CreateInspectionList(data[index], index);
                        dynamicHeader = dynamicHeader + collapsibleSetInside;
                    }
                    else {
                        collapsibleSetInside = CreateInspectionList(data[index], index);
                        dynamicHeader = dynamicHeader + collapsibleSetInside;
                    } // end of else
                    previousDivision = data[index].Division;
                } // end of if
                else if (data[index].Tag == 2) {
                    setLocal("Level1Label", data[index].Level1 + ":" + " ");
                    setLocal("Level2Label", data[index].Level2 + ":" + " ");
                    setLocal("Level3Label", data[index].Level3 + ":" + " ");
                    setLocal("Level4Label", data[index].Level4 + ":" + " ");
                }
            } // end of for

            dynamicHeader = dynamicHeader + '</ul></div>';
            $('#dynamicCollapsible').append(dynamicHeader);
            $('#dynamicCollapsible').trigger('create');

            if (rateAllExpandDiv === true) {
                $("#dynamicCollapsible").find("#" + rateAllParentID).trigger("expand");
                rateAllExpandDiv = false;
            }

            if (!$.GetOnlineSecuritySubTokensBit(OpenInspSecurity, 6, "RateAllButton", "CanAccess")) {
                $('#dynamicCollapsible').find(".rateAllImage").hide();
            }
        } // end of try
        catch (e) {
            setTimeout(function() { closeLoading();}, 250);
        }
        if (openInspectionsCount === false && noInspectionsCount === true) {
            $('#noInspectionsMessage').show();
        }
        setTimeout(function() { closeLoading();}, 250);
    });
}

function CreateInspectionList(inspectionDetails, index) {    
    var dynamicCollList = '';
    var completeInspectionButton = '';
    var inspectionNumber = $.trim($("#inspectionNumberLabel").val());
    var region = $.trim($("#regionLabel").val());
    var template = $.trim($("#templateLabel").val());
    var targetDate = $.trim($("#targetDateLabel").val());
    var score = $.trim($("#scoreLabel").val());
    var workOrderNumber = $.trim($("#workOrderLabel").val());
    var closedInspectionCount = "";
    if (inspectionDetails.OpenInspectionsCount === null) {
        closedInspectionCount = 0;
    }
    else {
        closedInspectionCount = inspectionDetails.OpenInspectionsCount;
    }

    if (closedInspectionCount == inspectionDetails.TotalInspectionCount) {
        completeInspectionButton = '<img class="completeImage img-complete" width="32px" height="32px" id= complete' + index +
                                    ' data-DivisionNumber=' + inspectionDetails.DivisionNumber + ' data-RegionNum=' + inspectionDetails.RegionNumber +
                                    ' data-Division=' + (inspectionDetails.Division).replace(/\s/g, ",") + ' data-Region=' + (inspectionDetails.Region).replace(/\s/g, ",") +
                                    ' data-InspNumber=' + inspectionDetails.InspectionNumber + ' data-WorkOrder=' + inspectionDetails.WorkOrderNumber +
                                    ' onclick="MarkComplete(this);" />';
    } else {
        completeInspectionButton = '<img class="rateAllImage img-notapplicable" width="32px" height="32px" id= rateInspection' + index +
                                    ' data-DivisionNumber=' + inspectionDetails.DivisionNumber + ' data-RegionNum=' + inspectionDetails.RegionNumber +
                                    ' data-Division=' + (inspectionDetails.Division).replace(/\s/g, ",") + ' data-Region=' + (inspectionDetails.Region).replace(/\s/g, ",") +
                                    ' data-InspNumber=' + inspectionDetails.InspectionNumber + ' data-WorkOrder=' + inspectionDetails.WorkOrderNumber +
                                    ' onclick="RateAll(this);" />';
    }
    
    // Create the list entity.
    dynamicCollList = dynamicCollList +
    '<li><p class="lable">' + GetTranslatedValue('InspectionNumberLabel') + ': <strong class="boldfont">' + inspectionDetails.InspectionNumber + '</strong></p>' +
    '<p class="lable">' + GetTranslatedValue('WONumberLabel') + ':<strong class="boldfont">' + inspectionDetails.WorkOrderNumber + '</strong></p>' +
    '<p class="lable">' + getLocal("Level1Label") + '<strong class="boldfont">' + inspectionDetails.Region + '</strong></p>' +
    '<p class="lable">' + getLocal("Level3Label") + '<strong class="boldfont">' + inspectionDetails.District + '</strong></p>' +
    '<p class="lable">' + getLocal("Level4Label") + '<strong class="boldfont">' + inspectionDetails.CustomerSite + '</strong></p>' +   
    '<p class="lable">' + GetTranslatedValue('TemplateLabel') + ':<strong class="boldfont">' + inspectionDetails.Template + '</strong></p>' +
    '<p class="lable">' + GetTranslatedValue('TargetDateLabel') + ':<strong class="boldfont">' + inspectionDetails.TargetDate + '</strong></p>' +
    '<p class="lable">' + GetTranslatedValue('ScoreLabel') + ':<strong class="boldfont">' + inspectionDetails.Score + '</strong></p>' +
    '<p class="lable">' + GetTranslatedValue('TotalItemsLabel') + ': <strong class="boldfont">' + inspectionDetails.TotalInspectionCount + '</strong></p>' +
    '<p class="lable">' + GetTranslatedValue('CompletedItemsLabel') + ': <strong class="boldfont">' + inspectionDetails.OpenInspectionsCount + '</strong></p>' +
    '<p>' +

    completeInspectionButton +

    '<img  class="startImage img-start" id=startImage' + index +
    ' data-divnumber=' + inspectionDetails.DivisionNumber + ' data-regionNumber=' + inspectionDetails.RegionNumber +
    ' data-divDescription=' + (inspectionDetails.Division).replace(/\s/g, ",") + ' data-regionDescription=' + (inspectionDetails.Region).replace(/\s/g, ",") +
    ' data-inspectionNumber=' + inspectionDetails.InspectionNumber +
    ' data-workOrderNumber=' + inspectionDetails.WorkOrderNumber +
    ' onclick="NavigateToArea(this);" />' +
    '</p>' +
    '</li>';

    return dynamicCollList;
}

function RateAll(obj) {
    if (navigator.onLine) {
        rateInspectionNumber = $("#" + obj.id).attr("data-inspnumber");
        rateAllParentID = $("#" + obj.id).parent().parent().parent().parent().parent().attr("id");
        showConfirmation(GetTranslatedValue("BulkUpdate1") + '<p>' + GetTranslatedValue("BulkUpdate2") + '</p>', GetCommonTranslatedValue('OkLabel'), GetCommonTranslatedValue('CancelLabel'), 'RateInspItems');
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function RateInspItems(flag) {
    if (flag === true) {
        var data = {
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "Language": getLocal("Language"),
            "Username": decryptStr(getLocal("Username")),
            "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
            "InspectionNumber": rateInspectionNumber,
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };
        var rateInspectionItemURL = standardAddress + "Inspection.ashx?methodname=RateUninspectedItem";
        rateInspectionItemSuccess(rateInspectionItemURL, data);
    }
    else {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID + "ConfirmationPopup").popup("close");
    }
}

function rateInspectionItemSuccess(rateInspectionItemURL, data) {
    $.postJSON(rateInspectionItemURL, data, function (resultData) {
        var count = resultData.Count;
        if (count.length !== 0) {
            count = parseInt(count);
        }
        else {
            count = -1;
        }
        if (count > 0) {
            $('#rateUninspectedMessage').html(count + ' ' + GetTranslatedValue("BulkUpdateComplete"));

            $('#rateUninspectedItemsMessagePopUp').popup("open");
            rateAllExpandDiv = true;
        }
        else if (count === -1) {
            ////showError("Please add the Rating with Code = 0 before setting an Item to N/A.");
            showError(GetTranslatedValue("AddTheRating"));
        }        
    });
}

function OpenInspPageSecurity(SgstCollection) {    
    OpenInspSecurity = SgstCollection;
}
