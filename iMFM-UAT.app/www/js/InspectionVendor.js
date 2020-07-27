var vendorArray = [];
var vendorRatedFlag = 0;
var primaryVendorFlag = 0;
function InspectionVendorPageSecurity(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr("id");
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorDropDownList", "CanAccess")) {
        $(pageID).find("#InspectionVendorDiv").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorDropDownList", "Required")) {
            $(pageID).find("#vendorRequriedLabel").hide();
        }
        else {
            $(pageID).find("#vendorDropDown").attr("Requried", "true");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorRatingDropDownList", "CanAccess")) {
        $(pageID).find("#InspectionVendorRatingDiv").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorRatingDropDownList", "Required")) {
            $(pageID).find("#ratingRequriedLabel").hide();
        }
        else {
            $(pageID).find("#ratingDropDown").attr("Requried", "true");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorPictureButton", "CanAccess")) {
        $(pageID).find("#vendorPictureButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorSaveButton", "CanAccess")) {
        $(pageID).find("#saveImage").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 4, "VendorCancelButton", "CanAccess")) {
        $(pageID).find("#cancelImage").hide();
    }
}

function BindVendor(vendorUrl, vendorData) {
    $.postJSON(vendorUrl, vendorData, function (result) {
        if (result.length !== 0) {
            $('#ratingDropDown').children('option:not(:first)').remove();
            for (index = 0; index < result.length; index++) {
                if (result[index].Tag == 1) {
                    vendorRatedFlag = 1;
                    vendorArray.push(result[0]);
                } // end of if
                else if (result[index].Tag == 3) {
                    var tag = document.createElement('option');
                    tag.setAttribute("value", result[index].Rating);
                    tag.innerHTML = result[index].VendorRating + "-" + result[index].RatingDescription;
                    $('#ratingDropDown').append(tag);
                }
                else if (result[index].Tag == 4) {
                    primaryVendorFlag = 1;
                }
            } // end of for
            PrimaryVendorData(vendorRatedFlag, primaryVendorFlag, vendorArray, result);
        } // end of if
    });
}

function PrimaryVendorData(vendorRatedFlag, primaryVendorFlag, vendorArray, result) {
    if (vendorRatedFlag == 1) {
        for (index = 0; index < result.length; index++) {
            if (result[index].Tag == 1) {
                $("#vendorText").val(result[0].Vendor);
                $("#primaryVendorHiddenValue").val(result[0].AssignedVendor);
                $("#primaryVendorSiteHiddenValue").val(result[0].AssignedVendorSite);
                $("#vendorDropDown").parent().hide();
            } // end of if.                        
        } //end of for.
    } //end of vendorRatedFlag if.
    else {
        if (primaryVendorFlag == 1) {
            for (index = 0; index < result.length; index++) {
                if (result[index].Tag == 4) {
                    $("#vendorText").val(result[index].Vendor);
                    $("#primaryVendorHiddenValue").val(result[index].PrimaryVendor);
                    $("#primaryVendorSiteHiddenValue").val(result[index].PrimaryVendorSite);
                    $("#vendorDropDown").parent().hide();
                } // end of if.
            } //end of for.
        } //end of primaryVendorFlag if.
    } // end of else.
    if (vendorArray == [] || vendorArray.length === 0) {
        $('#ratingDropDown option:eq(0)').attr('selected', 'selected');
    }
    else {
        $('#ratingDropDown').val(vendorArray[0].Rating);
    }
    $('#ratingDropDown').selectmenu("refresh", true);
    vendorRatedFlag = 0;
    primaryVendorFlag = 0;
}

function LoadVendorList() {
    $("#vendorDropDown option:gt(0)").remove();
    $("#vendorDropDown").selectmenu("refresh", true);

    var searchText = jQuery.trim($('#vendorText').val());
    var pattern = /^[A-Za-z- ]*$/;
    if (searchText === null || searchText === '' || searchText.length < 3 || !pattern.test(searchText)) {
        $('#vendorText').focus();
        return;
    }

    var data = {
        "SearchText": searchText,
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var vendorListURL = standardAddress + "Inspection.ashx?methodname=GetVendorsList";
    BindVendorListData(vendorListURL, data);
}

function BindVendorListData(vendorListUrl, vendorListData) {
    var tag;
    $('#vendorDropDown option:gt(0)').remove();
    $('#vendorDropDown').selectmenu("refresh", true);
    
    $.postJSON(vendorListUrl, vendorListData, function (vendorResult) {
        $("#vendorDropDown").parent().show();
        $('#vendorDropDown option:gt(0)').remove();
        $('#vendorDropDown').selectmenu("refresh", true);

        if (vendorResult.length === 0) {
            tag = document.createElement('option');
            tag.setAttribute("value", "-2");
            tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
            $('#vendorDropDown').append(tag);
            $('#vendorDropDown').val("-2");
            $('#vendorDropDown').selectmenu("refresh", true);
            $('#vendorText').focus();
            return;
        }
        else if (vendorResult.length == 1) {
            tag = document.createElement('option');
            tag.setAttribute("value", vendorResult[0].Value);
            tag.innerHTML = vendorResult[0].Key;
            $("#vendorDropDown").append(tag);
            $("#vendorDropDown").val(vendorResult[0].Value);
            $("#vendorDropDown").selectmenu("refresh", true);
            $("#vendorText").val(vendorResult[0].Key);
        }
        else {
            var firstTag = document.createElement('option');
            firstTag.setAttribute("value", "-1");
            firstTag.innerHTML = "-- [ " + vendorResult.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            $('#vendorDropDown').append(firstTag);
            var i = 0;
            for (i = 0; i < vendorResult.length; i++) {
                tag = document.createElement('option');
                tag.setAttribute("value", vendorResult[i].Value);
                tag.innerHTML = vendorResult[i].Key;
                $('#vendorDropDown').append(tag);
            } // end of for
            $('#vendorDropDown').val('-1');
            $('#vendorDropDown').selectmenu("refresh", true);
            //$("#loadingVendor").popup("close");
            $('#vendorText').focus();
        } // end of else
    });
}

function BindSelectedValueToVendorDropDown() {
    var selectedCode = $('#vendorDropDown :selected').text();
    var vendorCode = $('#vendorDropDown option:selected').val();

    if (vendorCode != -1) {
        var vendorCodeDetails = vendorCode.split("-");
        $("#primaryVendorHiddenValue").val(vendorCodeDetails[0]);
        $("#primaryVendorSiteHiddenValue").val(vendorCodeDetails[1]);

        $('#vendorText').val("");
        $('#vendorText').val(selectedCode);
    }
}

function ValidateInspectionVendorFields(pageID) {
    var isValid = false;

    if ($(pageID).find('#vendorDropDown').val() == "-1" && $(pageID).find('#vendorDropDown').is(':visible')) {
        isValid = false;
    }
    else if ($(pageID).find('#ratingDropDown').val() == "-1") {
        isValid = false;
    }
    else {
        isValid = true;
    }
    return isValid;
}

function SaveVendorDetails() {
    var pageID = '#' + $.mobile.activePage.attr('id');
    var validate = ValidateInspectionVendorFields(pageID);
    if (!validate) {
        ////showError("Please fill all mandatory fields");
        showError(GetTranslatedValue("FillAll"));
    }
    else {
        showActionPopupLoading();
        LoadMyLocation();
        $('#saveImage').addClass('ui-disabled');
        $('#cancelImage').addClass('ui-disabled');

        $("#vendorRatingHiddenValue").val($('#ratingDropDown').val());
        $("#itemSequenceHiddenValue").val(localStorage.getItem("Sequence"));
        $("#problemCodeHiddenValue").val(localStorage.getItem("ProblemCodeNumber"));
        $("#customerNumberHiddenValue").val(localStorage.getItem("CustomerNumber"));
        $("#customerSiteNumberHiddenValue").val(localStorage.getItem("CustomerSiteNumber"));
        $("#primaryInspectionNumberHiddenValue").val(localStorage.getItem("InspectionNumber"));

        if ($('#vendorDropDown').val() != "-1") {
            var vendorCode = $('#vendorDropDown option:selected').val();
            var vendorCodeDetails = vendorCode.split("-");
            $("#primaryVendorHiddenValue").val(vendorCodeDetails[0]);
            $("#primaryVendorSiteHiddenValue").val(vendorCodeDetails[1]);
        }
        var data = $('#formInspectionVendor').serialize();
        data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(localStorage.getItem("DatabaseID")) + "&" +
                    "Language" + "=" + localStorage.getItem("Language") + "&" +
                    "Username" + "=" + decryptStr(localStorage.getItem("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(localStorage.getItem("EmployeeNumber")) + "&" +
                    "GPSLocation" + "=" + GlobalLat + "," + GlobalLong + "&" +
                    "SessionID" + "=" + decryptStr(getLocal("SessionID"))
                    );
        if (navigator.onLine) {
            var vendorSaveURL = standardAddress + "Inspection.ashx?methodname=Save";
            UpdateVendorSuccess(vendorSaveURL, data);
        }
        else {
            ////showError('No network connection. Please try again when network is available.');
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
}

function UpdateVendorSuccess(vendorSaveUrl, vendorSaveData) {
    $.postJSON(vendorSaveUrl, vendorSaveData, function (resultData) {
        if (resultData.Status == 'Success') {
            //Save Success. Show Popup.
            closeActionPopupLoading();
            $('#successVendorMessageParagraph').html(GetTranslatedValue("VendorUpdateSuccess"));
            if ($('#vendorDropDown').val() != "-1") {
                var vendorCode = $('#vendorDropDown option:selected').val();
                var vendorCodeDetails = vendorCode.split("-");
                localStorage.setItem("PrimaryVendor", vendorCodeDetails[0]);
                localStorage.setItem("PrimaryVendorSite", vendorCodeDetails[0]);
                localStorage.setItem("Vendor", $('#vendorDropDown option:selected').text());
            }
            setTimeout(function () {
                $("#vendorMessagePopUp").popup();
                $('#vendorMessagePopUp').popup("open");
            }, 650);
            $('#saveImage').removeClass('ui-disabled');
            $('#cancelImage').removeClass('ui-disabled');
        }
        else {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Failed to update, please try again");
                showError(GetTranslatedValue("FailedToUpdate"));
            }, 650);
        }
    });
}

function UpdateVendorPostError() {
    showError(GetCommonTranslatedValue("ErrorMessage"));
}

function BindVendorListPostError() {
    ////showError("Error in getting vendor list");
    showError(GetTranslatedValue("ErrorInVendor"));
}

function BindVendorPostError() {
    ////showError("Error in getting vendor details");
    showError(GetTranslatedValue("ErrorInVendor"));
}

function NavigateBackFromVendor() {
    if (navigator.onLine) {
        ////        $.mobile.changePage("InspectionEditItem.html");
        $.mobile.changePage("NewInspectionItems.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToPicturesScreenFromVendor(obj) {
    var TableName = $('#' + obj.id).attr('data-tableName');
    localStorage.setItem("TableName", TableName);
    if (navigator.onLine) {
        $.mobile.changePage("InspectionPictures.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function InspectionVendor_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");

    $(pageID).find("#vendorDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#ratingDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
}