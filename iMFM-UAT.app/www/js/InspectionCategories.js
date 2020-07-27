function CategorySuccess(inspectionUrl, inspectionCategoryDetails) {
    $.postJSON(inspectionUrl, inspectionCategoryDetails, function (categData) {
        try {
            var length = categData.length;
            var dynamicList = '';
            for (var index = 0; index < length; index++) {
                dynamicList = dynamicList + '<li id=' + index + ' data-categoryId=' + categData[index].CategoryID + ' data-categoryName=' + (categData[index].Category).replace(/\s/g, "") + ' onclick="NavigateToItems(this);"><a href="#">' + categData[index].Category +
                                            ' <span class="ui-li-count">' +
                                            categData[index].OpenInspectionsCount + '/' + categData[index].TotalInspectionCount + '</span></a></li>';
            }
            $('#dynamicCategoryList').append(dynamicList);
            $('#dynamicCategoryList').listview('refresh');
            closeLoading();
        }
        catch (e) {
            closeLoading();
        }
    });
    $("#CategoryAreaName").html(getLocal("AreaName") + " >");
}

function CategoryPostError() {
    showError("Error");
}

function NavigateToItems(obj) {
    var categoryId = $('#' + obj.id).attr("data-categoryId");
    setLocal("CategoryId", categoryId);

    var categoryName = $('#' + obj.id).attr("data-categoryName");
    setLocal("CategoryName", categoryName);

    if (navigator.onLine) {
        ////        $.mobile.changePage("InspectionItems.html");
        $.mobile.changePage("NewInspectionItems.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

