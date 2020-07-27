function InspectionAssetsSecurity(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr("id");
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 2, "AddAssetButton", "CanAccess")) {
        $(pageID).find("#addAssetButton").hide();
    }
}

function InspectionAssetSuccess(inspectionURL, inspectionAssetDetails) {
    $.postJSON(inspectionURL, inspectionAssetDetails, function (resultData) {
        try {
            var length = resultData.length;
            var dynamicList = '';
            if (length == 0) {
                $('#noAssetsMessage').show();
                closeLoading();
            }
            else {
                for (var index = 0; index < length; index++) {
                    var assetDescription = resultData[index].AssetDescription.split(":");
                    dynamicList = dynamicList + '<li id=' + index + ' data-equipTagNumber=' + resultData[index].EquipTagNumber +
                    ' data-equipPartNumber=' + resultData[index].EquipPartNumber.replace(/\s/g, ",") +
                                ' data-equipPartSeq=' + resultData[index].EquipPartSeq + '  onclick="NavigateToEditAssetPage(this)"; ><a href="#">' + assetDescription[1] +
                                '</span></a></li>';
                } // end of for
                $('#dynamicAssetList').append(dynamicList);
                $('#dynamicAssetList').listview('refresh');
                closeLoading();
            } // end of else
        } // end of try
        catch (e) {
            closeLoading();
        }
    });
}

function NavigateToEditAssetPage(obj) {
    var equipTagNumer = $('#' + obj.id).attr("data-equipTagNumber");
    var equipPartNumer = $('#' + obj.id).attr("data-equipPartNumber").replace(/\,/g, ' ');
    var equipPartSeq = $('#' + obj.id).attr("data-equipPartSeq");
    setLocal("EquipTagNumber", equipTagNumer);
    setLocal("EquipPartNumber", equipPartNumer);
    setLocal("EquipPartSequence", equipPartSeq);

    if (navigator.onLine) {
        $.mobile.changePage("InspectionEditAsset.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToAddAssetPage() {
    if (navigator.onLine) {
        setLocal("ScreenName", $.mobile.activePage.attr('id'));
        $.mobile.changePage("InspectionAddAsset.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function InspectionAssetPostError() {
    ////showError("Error in displaying Assets");
    showError(GetTranslatedValue("CannotBeEmpty"));
}
