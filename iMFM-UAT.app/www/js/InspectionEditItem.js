function EditinspectionItemsPageSecurity(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ImpactDropDownList", "CanAccess")) {
        $(pageID).find("#ImapactDiv").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ImpactDropDownList", "Required")) {
            $(pageID).find("#ImpactRequriedLabel").hide();
        }
        else {
            $(pageID).find("#impact").attr("Requried", "true");
        }
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "RatingDropDownList", "CanAccess")) {
        $(pageID).find("#RatingDiv").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "RatingDropDownList", "Required")) {
            $(pageID).find("#RatingRequriedLabel").hide();
        }
        else {
            $(pageID).find("#rating").attr("Requried", "true");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "CommentTextArea", "CanAccess")) {
        $(pageID).find("#CommentTextAreaDiv").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "CommentTextArea", "Required")) {
            $(pageID).find("#commentsRequriedLabel").hide();
        }

        else {
            $(pageID).find("#comments").attr("Requried", "true");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "PicturesButton", "CanAccess")) {
        $(pageID).find("#editItemPictureButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "WOButton", "CanAccess")) {
        $(pageID).find("#editItemCreateWOButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "AssetsButton", "CanAccess")) {
        $(pageID).find("#editItemAssetsButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "VendorsButton", "CanAccess")) {
        $(pageID).find("#editItemVendorButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "CapitalButton", "CanAccess")) {
        $(pageID).find("#editItemCapitalButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "SaveButton", "CanAccess")) {
        $(pageID).find("#saveEditItemImage").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "CancelButton", "CanAccess")) {
        $(pageID).find("#cancelEditItemImage").hide();
    }
}

function InspectionEditItemSuccess(inspectionUrl, inspectionEditItemDetails) {
    $.postJSON(inspectionUrl, inspectionEditItemDetails, function (inspectionEditItemsData) {
        try {
            var length = inspectionEditItemsData.length;
            $('#rating').children('option:not(:first)').remove();
            $('#impact').children('option:not(:first)').remove();

            for (var index = 0; index < length; index++) {
                if (inspectionEditItemsData[index].Tag == 1) {
                    var impactTag = document.createElement('option');
                    impactTag.setAttribute("value", inspectionEditItemsData[index].ImpactCode);
                    impactTag.innerHTML = inspectionEditItemsData[index].Impact + '-' + inspectionEditItemsData[index].ImpactDescription;
                    $('#impact').append(impactTag);
                } // end of if

                else if (inspectionEditItemsData[index].Tag == 2) {

                    var ratingTag = document.createElement('option');
                    ratingTag.setAttribute("value", inspectionEditItemsData[index].RatingCode);
                    ratingTag.innerHTML = inspectionEditItemsData[index].Rating + '-' + inspectionEditItemsData[index].RatingDescription;
                    $('#rating').append(ratingTag);
                }

                else if (inspectionEditItemsData[index].Tag == 3) {

                    $('#editItemVendorButton').attr('data-CustomerNumber', inspectionEditItemsData[index].CustomerNumber);
                    $('#editItemVendorButton').attr('data-CustomerSiteNumber', inspectionEditItemsData[index].CustomerSiteNumber);
                    $('#editItemVendorButton').attr('data-ProblemCodeNumber', inspectionEditItemsData[index].ProblemCodeNumber);
                    $('#editItemAssetsButton').attr('data-CustomerNumber', inspectionEditItemsData[index].CustomerNumber);
                    $('#editItemAssetsButton').attr('data-CustomerSiteNumber', inspectionEditItemsData[index].CustomerSiteNumber);
                    $('#comments').val(inspectionEditItemsData[index].Comments);

                    if (inspectionEditItemsData[index].Capital === false) {
                        $('#editItemCapitalButton').hide();
                        setLocal("InspectionCapitalButtonRequired", "false");
                    } else {
                        setLocal("InspectionCapitalButtonRequired", "true");
                    }

                    if (inspectionEditItemsData[index].EquipStyleSeq === null) {
                        $('#editItemAssetsButton').hide();
                    }

                    if (inspectionEditItemsData[index].ProblemCodeNumber === null) {
                        $('#editItemVendorButton').hide();
                    }
                    setLocal("CapSeq", inspectionEditItemsData[index].CapSeqNumber);
                }

            } // end of For
            $('#rating').val(getLocal("Rating"));
            $('#rating').selectmenu("refresh", true);
            $('#impact').val(getLocal("Impact"));
            $('#impact').selectmenu("refresh", true);
            closeLoading();
        } // end of try
        catch (e) {
            closeLoading();
        }
    });
    $("#editAreaName").html(getLocal("AreaName") + " >");
    $("#editCategName").html(getLocal("CategoryName") + " >");
    $("#editItemName").html(getLocal("ItemName") + " >");
}

function InspectionEditItemPostError() {
    showError(GetCommonTranslatedValue("ErrorMessage"));
}

function NavigateBackToItems() {
    if (navigator.onLine) {
        removePageFromBreadcrumb("NewInspectionItemsPage");
        $.mobile.changePage("NewInspectionItems.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function editInspectionItem() {
    var validate = ValidateEDitItemFields();
    if (!validate) {
        ////showError("Please fill all mandatory fields");
        showError(GetTranslatedValue("MandatoryMessage"));
    }
    else {
        LoadMyLocation();
        var rating = $('#rating').val();
        var impact = $('#impact').val();
        var comments = $("textarea#comments").val();
        var data = iMFMJsonObject({
            "Username": decryptStr(getLocal("Username")),
            "InspectionNumber": getLocal("InspectionNumber"),
            "Rating": rating,
            "Impact": impact,
            "ItemID": getLocal("ItemId"),
            "Comments": comments,
            "Sequence": getLocal("Sequence"),
            "GPSLocation": GlobalLat + "," + GlobalLong
        });
        if (navigator.onLine) {
            var inspectionURL = standardAddress + "Inspection.ashx?methodname=UpdateInspection";
            InspectionUpdateEditItemSuccess(inspectionURL, data);
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
}

function InspectionUpdateEditItemSuccess(inspectionUrl, inspectionUpdateItemDetails) {
    $.postJSON(inspectionUrl, inspectionUpdateItemDetails, function (resultData) {
        if (resultData[0].Status == 'success') {
            $.mobile.changePage("NewInspectionItems.html");
        }
        else {
            ////showError("Failed to update, please try again");
            showError(GetTranslatedValue("FailedToUpdate"));
        }
    });
}

function InspectionUpdateEditItemPostError() {
    showError(GetCommonTranslatedValue("ErrorMessage"));
}

function ValidateEDitItemFields() {
    var pageID = "#" + $.mobile.activePage.attr("id");
    var isValid = false;
    if ($(pageID).find('#rating').attr("requried") == "true" && $(pageID).find('#rating').val() == "-1") {
        isValid = false;
    }
    else if ($(pageID).find('#impact').attr("requried") == "true" && $(pageID).find('#impact').val() == "-1") {
        isValid = false;
    }
    else if ($(pageID).find('#comments').attr("requried") == "true" && $.trim($(pageID).find('#comments').val()).length === 0) {
        isValid = false;
    }
    else {
        isValid = true;
    }
    return isValid;
}

function NavigateEditToPicturesScreen(TableName) {        
        setLocal("TableName", TableName);
        if (navigator.onLine) {            
            $.mobile.changePage('InspectionPictures.html');
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
}

function NavigateToCreateWO(obj) {
    var workOrderOptionId = obj.id;
    if (workOrderOptionId == "correctiveAction") {
        setLocal("WorkOrderOption", "CorrectiveAction");
    }
    else if (workOrderOptionId == "plannedExpense") {
        setLocal("WorkOrderOption", "PlannedExpense");
    }

    if (navigator.onLine) {
        editAutoSave();
        if (workOrderOptionId == "viewWorkOrders") {
            setLocal("WorkOrderOption", "ViewWorkOrders");
            $.mobile.changePage("InspectionViewWorkOrders.html");
        }
        else {
            $.mobile.changePage("InspectionAddWO.html");
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToAssets() {
////    var CustomerNumber = $('#' + obj.id).attr('data-CustomerNumber');
////    var CustomerSiteNumber = $('#' + obj.id).attr('data-CustomerSiteNumber');

////    setLocal("CustomerNumber", CustomerNumber);
////    setLocal("CustomerSiteNumber", CustomerSiteNumber);

    if (navigator.onLine) {
////        editAutoSave();
        $.mobile.changePage("InspectionAssets.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToCapitalScreen() {
    if (navigator.onLine) {
////        editAutoSave();
        setLocal("InspectionCapitalCategory", "");
        setLocal("InspectionCapitalDescription", "");
        setLocal("InspectionCapitalInfraOrRenovate", "");
        setLocal("InspectionCapitalClientOrCRE", "");
        setLocal("InspectionCapitalBudgetAmount", "");
        setLocal("InspectionCapitalMandatory", "");
        setLocal("InspectionCapitalPriority", "");
        setLocal("InspectionCapitalComments", "");
        setLocal("InspectionCapitalFCIPriority", "");
        setLocal("InspectionCapitalFCIComments", "");
        setLocal("InspectionCapitalBudgetYear", "");
        $.mobile.changePage("InspectionCapital.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        InspectionCapitalScreenNavigate = false;
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToVendor() {
////    var CustomerNumber = $('#' + obj.id).attr('data-CustomerNumber');
////    var CustomerSiteNumber = $('#' + obj.id).attr('data-CustomerSiteNumber');
////    var ProblemCodeNumber = $('#' + obj.id).attr('data-ProblemCodeNumber');

////    setLocal("CustomerNumber", CustomerNumber);
////    setLocal("CustomerSiteNumber", CustomerSiteNumber);
////    setLocal("ProblemCodeNumber", ProblemCodeNumber);

    if (navigator.onLine) {
////        editAutoSave();
        $.mobile.changePage("InspectionVendor.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}
function editAutoSave() {
    LoadMyLocation();
    var rating = $('#rating').val();
    setLocal("Rating", rating);

    var impact = $('#impact').val();
    setLocal("Impact", impact);

    if ($('#rating').val() == "-1") {
        rating = null;
    }
    if ($('#impact').val() == "-1") {
        impact = null;
    }

    if (rating || impact) {
        var comments = $("textarea#comments").val();
        var data = iMFMJsonObject({
            "Username": decryptStr(getLocal("Username")),
            "InspectionNumber": getLocal("InspectionNumber"),
            "Rating": rating,
            "Impact": impact,
            "ItemID": getLocal("ItemId"),
            "Comments": comments,
            "Sequence": getLocal("Sequence"),
            "GPSLocation": GlobalLat + "," + GlobalLong
        });
        if (navigator.onLine) {
            var inspectionURL = standardAddress + "Inspection.ashx?methodname=UpdateInspection";
            InspectionEditAutoSave(inspectionURL, data);
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }

}

function InspectionEditAutoSave(inspectionURL, data) {
    $.postJSON(inspectionURL, data, function (resultData) {
    });
}
