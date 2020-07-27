function InspectionItemsSuccess(inspectionUrl, inspectionItemDetails) {
    $.postJSON(inspectionUrl, inspectionItemDetails, function (inspectionItemsData) {
        if (inspectionItemsData.length === 0) {
            $("#itemsAreaName").html(getLocal("AreaName") + " >");
            $("#itemsCategName").html(getLocal("CategoryName") + " >");
            $("#noItemsDiv").html("No inspection items for this category.");
        }
        else {
            try {
                var length = inspectionItemsData.length;
                var imagePath = "css/images/pendingIcon.png";
                var dynamicList = '';
                for (var index = 0; index < length; index++) {
                    var rating = "";
                    var impact = "";
                    var ratingAttribute = "";
                    var impactAttribute = "";

                    if (inspectionItemsData[index].RatingDescription === null) {
                        rating = GetTranslatedValue("InspectionRatingNotSet");
                    }
                    else {
                        rating = inspectionItemsData[index].Rating + '-' + inspectionItemsData[index].RatingDescription;
                    }

                    if (inspectionItemsData[index].ImpactDescription === null) {
                        impact = GetTranslatedValue("InspectionImpactNotSet");
                    }
                    else {
                        impact = inspectionItemsData[index].Impact + '-' + inspectionItemsData[index].ImpactDescription;
                    }

                    if (inspectionItemsData[index].ImpactDescription === null && inspectionItemsData[index].Impact === 0) {
                        impactAttribute = "-1";
                    }
                    else {
                        impactAttribute = inspectionItemsData[index].ImpactCode;
                    }

                    if (inspectionItemsData[index].RatingDescription === null && inspectionItemsData[index].Rating === 0) {
                        ratingAttribute = "-1";
                    }
                    else {
                        ratingAttribute = inspectionItemsData[index].RatingCode;
                    }

                    dynamicList = dynamicList + ' <li  data-icon=custom  >' +
                                                '<a href="#" data-itemId=' + inspectionItemsData[index].ItemID + ' data-itemName=' + (inspectionItemsData[index].ItemDescription).replace(/\s/g, "") + ' id=edit' + index +
                                                '  data-inspectionNumber=' + inspectionItemsData[index].InspectionNumber + ' data-rating=' + ratingAttribute + ' data-impact=' + impactAttribute +
                                                ' data-sequence=' + inspectionItemsData[index].Sequence + ' data-PrimaryVendor=' + inspectionItemsData[index].PrimaryVendor + ' data-PrimaryVendorSite=' + inspectionItemsData[index].PrimaryVendorSite + ' data-Vendor="' + inspectionItemsData[index].Vendor + '" class="lightTheme" onclick="editInspection(this);" >' +
                                                '<h4>' + inspectionItemsData[index].ItemDescription + '</h4>' +
                                                '<p>' + rating + ' / ' + impact + ' </p>' +
                                                '<p>' + GetTranslatedValue('InspectionLabel') + inspectionItemsData[index].InspectionNumber + '-' + inspectionItemsData[index].Sequence + ' </p>' +
                                                '</a>' +
                                                '<a  data-itemId=' + inspectionItemsData[index].ItemID + '  data-inspectionNumber=' + inspectionItemsData[index].InspectionNumber +
                                                ' data-itemName=' + (inspectionItemsData[index].ItemDescription).replace(/\s/g, "") + '  data-pageName="InspectionItems"' + ' data-sequence=' + inspectionItemsData[index].Sequence + ' class="createWO" id=create' + index + ' onclick="addWO(this);"> </a>' +
                                                '</li>';
                } // end of For                             
                $('#dynamicItemslist').append(dynamicList);
                $('#dynamicItemslist').listview('refresh');
                var flag = $('.createWO').find('span .ui-icon-custom').css('background-image', 'url(' + imagePath + ')');
                closeLoading();
            } // end of try
            catch (e) {
                closeLoading();
            } // end of catch

            $("#itemsAreaName").html(getLocal("AreaName") + " >");
            $("#itemsCategName").html(getLocal("CategoryName") + " >");
        }
    });
} //end of function

function InspectionItemsPostError() {
    showError("Error");
}

function addWO(obj) {
    var itemId = $('#' + obj.id).attr("data-itemId");
    setLocal("ItemId", itemId);

    var itemName = $('#' + obj.id).attr("data-itemName");
    setLocal("ItemName", itemName);

    var inspectionNumber = $('#' + obj.id).attr("data-inspectionNumber");
    setLocal("InspectionNumber", inspectionNumber);

    var sequence = $('#' + obj.id).attr("data-sequence");
    setLocal("Sequence", sequence);

    var pageName = $('#' + obj.id).attr("data-pageName");
    setLocal("InspectionPageName", pageName);
    $("#workOrderCreateOptionsPopUp").popup("open");
}

function NavigateToWorkOrder(obj) {
    var workOrderOptionId = obj.id;
    if (workOrderOptionId == "correctiveActionWO") {
        setLocal("WorkOrderOption", "CorrectiveAction");
    }
    else if (workOrderOptionId == "plannedExpenseWO") {
        setLocal("WorkOrderOption", "PlannedExpense");
    }

    if (navigator.onLine) {
        if (workOrderOptionId == "displayWorkOrders") {
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

function editInspection(obj) {
    var itemId = $('#' + obj.id).attr("data-itemId");
    setLocal("ItemId", itemId);

    var itemName = $('#' + obj.id).attr("data-itemName");
    setLocal("ItemName", itemName);

    var rating = $('#' + obj.id).attr("data-rating");
    setLocal("Rating", rating);

    var impact = $('#' + obj.id).attr("data-impact");
    setLocal("Impact", impact);

    var inspectionNumber = $('#' + obj.id).attr("data-inspectionNumber");
    setLocal("InspectionNumber", inspectionNumber);

    var sequence = $('#' + obj.id).attr("data-sequence");
    setLocal("Sequence", sequence);

    var PrimaryVendorSite = $('#' + obj.id).attr("data-PrimaryVendorSite");
    setLocal("PrimaryVendorSite", PrimaryVendorSite);

    var PrimaryVendor = $('#' + obj.id).attr("data-PrimaryVendor");
    setLocal("PrimaryVendor", PrimaryVendor);

    var Vendor = $('#' + obj.id).attr("data-Vendor");
    setLocal("Vendor", Vendor);

    if (navigator.onLine) {
        ////        $.mobile.changePage("InspectionEditItem.html");
        $.mobile.changePage("NewInspectionItems.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }

}

function NavigateBackToArea() {
    if (navigator.onLine) {
        removePageFromBreadcrumb("inspectionAreas");
        $.mobile.changePage("InspectionAreas.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateBackToCategory() {
    if (navigator.onLine) {
        removePageFromBreadcrumb("categoryPage");
        $.mobile.changePage("InspectionCategories.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}