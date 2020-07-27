function InspectionAreaSuccess(inspectionUrl, inspectionAreaDetails) {
    $.postJSON(inspectionUrl, inspectionAreaDetails, function (resultData) {
        try {
            var length = resultData.length;
            var dynamicList = '';
            for (var index = 0; index < length; index++) {
                dynamicList = dynamicList + '<li id=' + index + ' data-areaId=' + resultData[index].AreaID + ' data-areaName=' + (resultData[index].Area).replace(/\s/g, ",") + ' onclick="NavigateToCategories(this)"; ><a href="#">' + resultData[index].Area +
                             ' <span class="ui-li-count">' +
                              resultData[index].OpenInspectionsCount + '/' + resultData[index].TotalInspectionCount + '</span></a></li>';
            }
            $('#dynamicAreaList').append(dynamicList);
            $('#dynamicAreaList').listview('refresh');
            closeLoading();
        }
        catch (e) {
            closeLoading();
        }
    });
}

function InspectionAreaPostError() {
    showError();
}

function NavigateToCategories(obj) {
    var areaId = $('#' + obj.id).attr("data-areaId");
    localStorage.setItem("AreaId", areaId);
    var areaName = $('#' + obj.id).attr("data-areaName").replace(/\,/g, ' ');
    localStorage.setItem("AreaName", areaName);
    if (navigator.onLine) {
        $.mobile.changePage("InspectionCategories.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateFromAreasToInspections() {
    if (navigator.onLine) {
        $.mobile.changePage("OpenInspections.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}