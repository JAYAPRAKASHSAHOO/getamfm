var serailNumberArray = [];

// Mode is either 0 (called from inspection form) or 1 (called via scanner/elsewhere).
var AddAssetMode;
var addAsset_addPartEnabled = false;

/// <summary>
/// Method to load group details.
/// </summary>
/// <param name="inspectionUrl">Holds the URL. </param>
/// <param name="inspectionAssetAddDetails">Holds details to be added. </param>
function LoadGroupDetails(inspectionUrl, inspectionAssetAddDetails) {
    $.postJSON(inspectionUrl, inspectionAssetAddDetails, function (groupResult) {
        if (groupResult.length > 0) {
            for (group = 0; group < groupResult.length; group++) {
                if (groupResult[group].Tag == 1 && groupResult[group].AssetGroup !== null) {
                    var groupTag = document.createElement('option');
                    groupTag.setAttribute("value", groupResult[group].EquipGroupNumber);
                    groupTag.innerHTML = groupResult[group].AssetGroup;
                    $('#groupDropDown').append(groupTag);
                    $('#groupDropDown option:eq(0)').attr('selected', 'selected');
                    $('#groupDropDown').selectmenu("refresh", true);
                } // end of if
                if (groupResult[group].Tag == 8) {
                    serailNumberArray.push(groupResult[group].SerialNumber);
                }
            } // end of for
        } // end of if
    });
}

/// <summary>
/// Method to load sub group details.
/// </summary>
function LoadSubGroupDetails() {
    $('#subGroupDropDown').children('option:not(:first)').remove();
    $('#subGroupDropDown option:eq(0)').attr('selected', 'selected');
    $('#subGroupDropDown').selectmenu("refresh", true);
    $('#modelDropDown').children('option:not(:first)').remove();
    $('#modelDropDown option:eq(0)').attr('selected', 'selected');
    $('#modelDropDown').selectmenu("refresh", true);

    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "EquipGroupNumber": $('#groupDropDown option:selected').val()
    });
    var inspectionURL = standardAddress + "Inspection.ashx?methodname=GetAddAssetDetails";
    LoadSubGroupResult(inspectionURL, data);
}

/// <summary>
/// Method to load group details.
/// </summary>
/// <param name="inspectionUrl">Holds the URL. </param>
/// <param name="inspectionAssetAddDetails">Holds details to be added. </param>
function LoadSubGroupResult(inspectionUrl, inspectionAssetAddDetails) {
    $.postJSON(inspectionUrl, inspectionAssetAddDetails, function (subGroupResult) {
        $('#subGroupDropDown').selectmenu("disable", true);
        $('#modelDropDown').selectmenu("disable", true);
        $('#AddNewPartButton').prop("disabled", true);
        $('#AddNewPartButton').addClass("ui-disabled");
        if (subGroupResult.length > 0) {           
            $('#subGroupDropDown').children('option:not(:first)').remove();
            for (index = 0; index < subGroupResult.length; index++) {
                if ($('#groupDropDown').val() != "-1") {
                    $('#subGroupDropDown').selectmenu("enable");
                }
                if (subGroupResult[index].Tag == 2 && subGroupResult[index].AssetSubGroup !== null) {
                    var subGroupTag = document.createElement('option');
                    subGroupTag.setAttribute("value", subGroupResult[index].EquipStyleSeq);
                    subGroupTag.innerHTML = subGroupResult[index].AssetSubGroup;
                    $('#subGroupDropDown').append(subGroupTag);
                    $('#subGroupDropDown option:eq(0)').attr('selected', 'selected');
                    $('#subGroupDropDown').selectmenu("refresh", true);
                } // end of if
            } // end of for
        } //end of if 
    });
}

/// <summary>
/// Method to load model details.
/// </summary>
function LoadModelDetails() {
    $('#modelDropDown').children('option:not(:first)').remove();
    $('#modelDropDown option:eq(0)').attr('selected', 'selected');
    $('#modelDropDown').selectmenu("refresh", true);

    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "EquipStyleSeq": $('#subGroupDropDown option:selected').val()
    });
    var inspectionURL = standardAddress + "Inspection.ashx?methodname=GetAddAssetDetails";
    LoadModelResult(inspectionURL, data);
}

/// <summary>
/// Method to load model result.
/// </summary>
/// <param name="inspectionUrl">Holds the URL. </param>
/// <param name="inspectionAssetAddDetails">Holds details to be added. </param>
function LoadModelResult(inspectionUrl, inspectionAssetAddDetails) {
    $.postJSON(inspectionUrl, inspectionAssetAddDetails, function (modelResult) {
        $('#modelDropDown').selectmenu("disable", true);
        if (modelResult.length > 0) {
            $('#modelDropDown').children('option:not(:first)').remove();
            for (index = 0; index < modelResult.length; index++) {
                if ($('#subGroupDropDown').val() != "-1") {
                    $('#modelDropDown').selectmenu("enable");
                    if (addAsset_addPartEnabled) {
                        $('#AddNewPartButton').removeAttr("disabled");
                        $('#AddNewPartButton').removeClass("ui-disabled");
                    }
                }
                if (modelResult[index].Tag == 3 && modelResult[index].AssetPart !== null) {
                    var partTag = document.createElement('option');
                    partTag.setAttribute("value", modelResult[index].EquipPartSeq);
                    partTag.innerHTML = modelResult[index].AssetPart;
                    $('#modelDropDown').append(partTag);
                    $('#modelDropDown option:eq(0)').attr('selected', 'selected');
                    $('#modelDropDown').selectmenu("refresh", true);
                } // end of if
            } // end of for
        } //end of if
    });
}

/// <summary>
/// Method to load details post error.
/// </summary>
function LoadDetailsPostError() {
    ////showError("Error in loading details");
    showError(GetTranslatedValue("CannotBeEmpty"));
}

/// <summary>
/// Method to Validate InspectionAdd AssetFields.
/// </summary>
function ValidateInspectionAddAssetFields() {
    if (AddAssetMode === 0) {
        var isValid = false;
        if ($('#groupDropDown').val() == "-1") {
            isValid = false;
        }
        else if ($('#subGroupDropDown').val() == "-1") {
            isValid = false;
        }
        else if ($('#modelDropDown').val() == "-1") {
            isValid = false;
        }
        else if ($('#serialNumberText').val().trim() === "") {
            isValid = false;
        }
        else if ($('#instDescriptionTextArea').val().trim() === "") {
            isValid = false;
        }
        else if ($('#assetDateInstalledDate').val() === "") {
            isValid = false;
        }
        else if ($('#tagDetailsTextArea').val().trim() === "") {
            isValid = false;
        }
        else if ($('#barcodeIDText').val().trim() === "") {
            isValid = false;
        }
        else if (!ValidateFields()) {
            isValid = false;
        }
        else { isValid = true; }
        return isValid;
    } else {
        return ValidateFields();
    }
}

/// <summary>
/// Method to Add AssetFields.
/// </summary>
function AddAsset() {
    var validate = ValidateInspectionAddAssetFields();
    var ifExists = jQuery.inArray(serailNumberArray, $('#serialNumberText').val().trim());
    if (!validate) {
        ////showError("Please fill all mandatory fields");
        showError(GetTranslatedValue("FillAll"));
    }
    else {
        showActionPopupLoading();
        $('#submitButton').addClass('ui-disabled');
        $('#cancelButton').addClass('ui-disabled');

        if (AddAssetMode == 0) {
        $("#customerNumberHiddenValue").val(getLocal("CustomerNumber"));
        $("#customerSiteNumberHiddenValue").val(getLocal("CustomerSiteNumber"));
        } else {
            var roomValue = $("#SRoomValue :selected").val();
            $("#customerNumberHiddenValue").val(roomValue.substring(roomValue.indexOf('}') + 1, roomValue.indexOf('[')));
            $("#customerSiteNumberHiddenValue").val(roomValue.substring(roomValue.indexOf('[') + 1));
        }
        $('#equipGroupDescriptionHiddenValue').val($('#groupDropDown option:selected').text());
        $('#equipStyleDescriptionHiddenValue').val($('#subGroupDropDown option:selected').text());
        var data = $('#formAddAsset').serialize();

        data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(getLocal("DatabaseID")) + "&" +
                    "Language" + "=" + getLocal("Language") + "&" +
                    "Username" + "=" + decryptStr(getLocal("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(getLocal("EmployeeNumber")) + "&" +
                    "GPSLocation"+ "=" + GlobalLat + "," + GlobalLong + "&" +
                    "SessionID"+ "=" + decryptStr(getLocal("SessionID"))
                    );

        if (navigator.onLine) {
            var inspectionURL = standardAddress + "Inspection.ashx?methodname=AddAsset";
            AddAssetSuccess(inspectionURL, data);
        }
        else {
            ////showError('No network connection. Please try again when network is available.');
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
}

/// <summary>
/// Method to add asset.
/// </summary>
/// <param name="inspectionUrl">Holds the URL. </param>
/// <param name="inspectionAddDetails">Holds details to be added. </param>
function AddAssetSuccess(inspectionUrl, inspectionAddDetails) {
    $.postJSON(inspectionUrl, inspectionAddDetails, function (resultMessage) {
        if (resultMessage.Status == 'Success') {
            closeActionPopupLoading();
            //Save Success. Show Popup.
            $('#successAddAssetMessageParagraph').html(GetTranslatedValue("AddAssetSuccess"));
            //setTimeout(function () {
                $("#addAssetMessagePopUp").attr('style', 'display:block !important');
                $("#addAssetMessagePopUp").popup();
                $("#addAssetMessagePopUp").popup("open");
                clearTimeout(fallback);
                var fallback = setTimeout(function () {
                    $("#addAssetMessagePopUp").popup().popup("open");
                }, 2000);
            //}, 650);

            $('#submitButton').removeClass('ui-disabled');
            $('#cancelButton').removeClass('ui-disabled');
        }
        else if (resultMessage.SerialNumber == 'Exists') {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Serial Number already Exists");
                showError(GetTranslatedValue("SerialExists"));
            }, 100);


            $('#submitButton').removeClass('ui-disabled');
            $('#cancelButton').removeClass('ui-disabled');
            return true;
        }
        else if (resultMessage.Date == 'Invalid') {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Please enter a valid 'Date Installed' in 'mm/dd/yyyy' format between year 1940-2099");
                showError(GetTranslatedValue("EnterValidDate"));
            }, 100);

            $('#submitButton').removeClass('ui-disabled');
            $('#cancelButton').removeClass('ui-disabled');
        }
        else if (resultMessage.PartNumber == 'Failed'){
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Failed to add part, please try again");
                showError(GetTranslatedValue("FailedPartAdd"));
            }, 100);
            $('#submitButton').removeClass('ui-disabled');
            $('#cancelButton').removeClass('ui-disabled');
        }
       else if (resultMessage.PartNumber == 'Unidentified'){
           closeActionPopupLoading();
           setTimeout(function () {
                      ////showError("Part could not be identified. Please choose again.");
                      showError(GetTranslatedValue("UnidentifiedPart"));
                      }, 100);
           $('#submitButton').removeClass('ui-disabled');
           $('#cancelButton').removeClass('ui-disabled');
       }
        else {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Failed to update, please try again");
                showError(GetTranslatedValue("FailedRetryAgain"));
            }, 100);

           $('#submitButton').removeClass('ui-disabled');
           $('#cancelButton').removeClass('ui-disabled');
        }
    });
}

/// <summary>
/// Method to navigate to pitctures screen from add asset.
/// </summary>
/// <param name="obj">Holds the object data. </param>
function NavigateToPicturesScreenFromAddAsset(obj) {
    var TableName = $('#' + obj.id).attr('data-tableName');
    setLocal("TableName", TableName);
    if (navigator.onLine) {
        $.mobile.changePage("InspectionPictures.html");
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function AddAsset_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");

    var selectPropertyLabel = GetTranslatedValue("SelectPropertyLabel");
    var saveLabel = GetTranslatedValue("submitButton");
    var closeLabel = GetCommonTranslatedValue("CancelLabel");
    
    $(pageID).find("#groupDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#subGroupDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#modelDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");

    $(pageID).find("#SPidDDL").html('<option value="-1">' + selectPropertyLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#SFloorValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
    $(pageID).find("#SRoomValue").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh").selectmenu("disable");
    
    BindSiteLabels();

    //$(pageID).find("#cancelButton .ui-btn-text").text(closeLabel);
    $(pageID).find("#cancelButton").text(closeLabel);
//    $(pageID).find("#AddPart_SaveButton .ui-btn-text").text(saveLabel);
//    $(pageID).find("#AddPart_CloseButton .ui-btn-text").text(closeLabel);
    $(pageID).find("#AddPart_SaveButton").text(saveLabel);
    $(pageID).find("#AddPart_CloseButton").text(closeLabel);
    
    InitializeAssetForm();
}

function showNewPartPanel() {
    $('#NewPartGroupValue').text($('#groupDropDown option:selected').text());
    $('#NewPartGroupValue').attr('data-value', $('#groupDropDown').val());
    $('#NewPartSubGroupValue').text($('#subGroupDropDown option:selected').text());
    $('#NewPartSubGroupValue').attr('data-value', $('#subGroupDropDown').val());
    $('#addPartContentDiv').popup("open");
}

function AddPartClose_Click() {
    $('#addPartContentDiv').popup("close");
}

function SaveNewPart() {
    var isValid = ValidateNewPartFields();
    
    if (!isValid) {
        showError(GetTranslatedValue("FillAll"));
    } else {
        var partTag = document.createElement('option');
        partTag.setAttribute("value", "new");
        partTag.innerHTML = $("#newPartNumber").val();
        $('#modelDropDown').children('option[value="new"]').remove();
        $('#modelDropDown').append(partTag);
        $('#modelDropDown option[value="new"]').attr('selected', 'selected');
        $('#modelDropDown').selectmenu("refresh", true);
        
        $("#newPartNumberHiddenValue").val($("#newPartNumber").val());
        $("#newPartDescriptionHiddenValue").val($("#newPartDescription").val());
        $("#newPartManufacturerHiddenValue").val($("#newPartManufacturer").val());
        $("#newPartModelHiddenValue").val($("#newPartModel").val());
        $('#addPartContentDiv').popup("close");
    }
}

//// This will set up the form based on whether it's being called from inspection or not.
function InitializeAssetForm() {
    var mode = getLocal("ScreenName");
    var pageID = $.mobile.activePage.attr('id');
    
    if (mode === "inspectionAssets") {
        // Location already known, so don't show the location panel.
        $("#LocationsUl").hide();

        AddAssetMode = 0;
        if (!addAsset_addPartEnabled) {
            $("#AddNewPartButton").hide();
            $("[class=ui-controlgroup-controls]").find("[class=ui-select]").attr("style", "width:100%!important");
        }
        // Handle security for the new fields.
        var SgtCollection = $.GetSecuritySubTokens(400043, 0);
        EnforceFieldSecurity(SgtCollection, "Manufacturer", false);
        EnforceFieldSecurity(SgtCollection, "Model", false);
    } else {
        AddAssetMode = 1;
        
        if (!IsStringNullOrEmpty(getLocal("ScannedValue"))) {
            $("#barcodeIDText").val(getLocal("ScannedValue"));
            setLocal("ScannedValue", "");
        }

        // Get Security for Add Part option.
        var SgtCollection = $.GetSecuritySubTokens(400043, 0);
        addAsset_addPartEnabled = $.GetSecuritySubTokensBit(SgtCollection, 0, "Add Part", "CanAccess");
        if (!addAsset_addPartEnabled) {
            $("#AddNewPartButton").hide();
            $("[class=ui-controlgroup-controls]").find("[class=ui-select]").attr("style", "width:100%!important");
        }

        // Get security for the rest of the form (except Part Panel, Location panel, and Serial # which are sys required).        
        EnforceFieldSecurity(SgtCollection, "Equip Part", true);
        EnforceFieldSecurity(SgtCollection, "Location", true)
        EnforceFieldSecurity(SgtCollection, "Serial Number", true);
        
        EnforceFieldSecurity(SgtCollection, "Installed Date", false);
        EnforceFieldSecurity(SgtCollection, "Tag Details", false);
        EnforceFieldSecurity(SgtCollection, "Barcode ID", false);        
        EnforceFieldSecurity(SgtCollection, "Installed Description", false);
        EnforceFieldSecurity(SgtCollection, "Manufacturer", false);
        EnforceFieldSecurity(SgtCollection, "Model", false);
    }
}

/// <summary>
/// Method to Validate the New Part Fields.
/// </summary>
function ValidateNewPartFields() {
    var isValid = false;
    if ($('#newPartNumber').val().trim() === "") {
        isValid = false;
    }
    else if ($('#newPartDescription').val().trim() === "") {
        isValid = false;
    }
    else if ($('#newPartManufacturer').val().trim() === "") {
        isValid = false;
    }
    else if ($('#newPartModel').val().trim() === "") {
        isValid = false;
    }
    else {isValid = true; }
    return isValid;
}
