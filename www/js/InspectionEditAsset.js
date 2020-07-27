function LoadEditGroupDetails(editAssetUrl, editAssetData) {
    $.postJSON(editAssetUrl, editAssetData, function (groupResult) {
        if (groupResult.length > 0) {
            for (group = 0; group < groupResult.length; group++) {
                if (groupResult[group].Tag == 4) {
                    $('#editGroupValueLabel').text(groupResult[group].AssetGroup);
                    $('#equipGroupNumberHiddenValue').val(groupResult[group].EquipGroupNumber);
                    $('#editSubGroupValueLabel').text(groupResult[group].AssetSubGroup);
                    $('#editModelValueLabel').text(groupResult[group].AssetPart);
                    //                            $('#subGroupHiddenValue').val(groupResult[group].AssetSubGroup);
                    $('#equipStyleSequenceHiddenValue').val(groupResult[group].EquipStyleSeq);
                    //                            $('#partHiddenValue').val(groupResult[group].AssetPart);
                    $('#equipPartSequenceHiddenValue').val(groupResult[group].EquipPartSeq);
                    localStorage.setItem("EquipTagSequence", groupResult[group].EquipTagSeq);
                } // end of if
                if (groupResult[group].Tag == 7) {
                    HideFields();
                    var assetExpireDate = groupResult[group].AssetDateExpired.split('/');
                    var assetInstalledDate = groupResult[group].AssetDateInstalled.split(' ');

                    $('#editSerialNumberText').val("");
                    $('#editSerialNumberText').val(groupResult[group].SerialNumber);

                    $('#editInstDescriptionTextArea').val("");
                    $('#editInstDescriptionTextArea').val(groupResult[group].InstalledDescription);

                    if (groupResult[group].AssetDateExpired !== "") {
                        $('#lifeCycleExpiryValueLabel').text(groupResult[group].AssetDateExpired.split(' ')[0]);
                        $('#dateExpiredHiddenValue').val($('#lifeCycleExpiryValueLabel').text());
                    }

                    $('#dateInstalledValueText').val("");
                    $('#dateInstalledValueText').val(assetInstalledDate[0]);

                    $('#dateInstalledHiddenValue').val(assetInstalledDate[0]);

                    $('#tagConditionHiddenValue').val(groupResult[group].TagCondition);

                    if (groupResult[group].Feature1Label !== null) {
                        $('#feature1Field').show();
                        $('#feature1Label').append(groupResult[group].Feature1Label);
                        $('#feature1Text').val(groupResult[group].Feature1);
                    }

                    if (groupResult[group].Feature2Label !== null) {
                        $('#feature2Field').show();
                        $('#feature2Label').append(groupResult[group].Feature2Label);
                        $('#feature2Text').val(groupResult[group].Feature2);
                    }

                    if (groupResult[group].Feature3Label !== null) {
                        $('#feature3Field').show();
                        $('#feature3Label').append(groupResult[group].Feature3Label);
                        $('#feature3Text').val(groupResult[group].Feature3);
                    }

                    if (groupResult[group].Feature4Label !== null) {
                        $('#feature4Field').show();
                        $('#feature4Label').append(groupResult[group].Feature4Label);
                        $('#feature4Text').val(groupResult[group].Feature4);
                    }

                    if (groupResult[group].Feature5Label !== null) {
                        $('#feature5Field').show();
                        $('#feature5Label').append(groupResult[group].Feature5Label);
                        $('#feature5Text').val(groupResult[group].Feature5);
                    }

                    if (groupResult[group].Feature6Label !== null) {
                        $('#feature6Field').show();
                        $('#feature6Label').append(groupResult[group].Feature6Label);
                        $('#feature6Text').val(groupResult[group].Feature6);
                    }

                    if (groupResult[group].Feature7Label !== null) {
                        $('#feature7Field').show();
                        $('#feature7Label').append(groupResult[group].Feature7Label);
                        $('#feature7Text').val(groupResult[group].Feature7);
                    }

                    if (groupResult[group].Feature8Label !== null) {
                        $('#feature8Field').show();
                        $('#feature8Label').append(groupResult[group].Feature8Label);
                        $('#feature8Text').val(groupResult[group].Feature8);
                    }

                    if (groupResult[group].Feature9Label !== null) {
                        $('#feature9Field').show();
                        $('#feature9Label').append(groupResult[group].Feature9Label);
                        $('#feature9Text').val(groupResult[group].Feature9);
                    }

                    if (groupResult[group].Feature10Label !== null) {
                        $('#feature10Field').show();
                        $('#feature10Label').append(groupResult[group].Feature1Label0);
                        $('#feature10Text').val(groupResult[group].Feature10);
                    }
               
                    $('#manufacturerTextArea').val(groupResult[group].Manufacturer);
                    $('#modelTextArea').val(groupResult[group].Model);
                } // end of if
                if (groupResult[group].Tag == 9) {
                    var tagConditionArray = groupResult[group].DefaultValueStr.split(";");
                    for (conditionCount = 0; conditionCount < tagConditionArray.length; conditionCount++) {
                        var tagConditionTag = document.createElement('option');
                        tagConditionTag.setAttribute("value", tagConditionArray[conditionCount]);
                        if (tagConditionArray[conditionCount] !== "") {
                            tagConditionTag.innerHTML = tagConditionArray[conditionCount];
                        }
                        $('#tagConditionDropDown').append(tagConditionTag);
                    } // end of for
                    if ($('#tagConditionHiddenValue').val() !== "") {
                        $('#tagConditionDropDown').val($('#tagConditionHiddenValue').val());
                    }
                    else {
                        $('#tagConditionDropDown option:eq(0)').attr('selected', 'selected');
                    }
                    $('#tagConditionDropDown').selectmenu("refresh", true);
                } // end of if
            } // end of for
        } // end of if
    });
}

function HideFields() {
    $('#feature1Field').hide();
    $('#feature2Field').hide();
    $('#feature3Field').hide();
    $('#feature4Field').hide();
    $('#feature5Field').hide();
    $('#feature6Field').hide();
    $('#feature7Field').hide();
    $('#feature8Field').hide();
    $('#feature9Field').hide();
    $('#feature10Field').hide();
}

function ValidateInspectionEditAssetFields() {
    var isValid = false;
    if ($('#editSerialNumberText').val().trim() === "") {
        isValid = false;
    }
    else if ($('#editInstDescriptionTextArea').val().trim() === "") {
        isValid = false;
    }
    else if ($('#tagConditionDropDown').val().trim() == "-1") {
        isValid = false;
    }
    else if ($('#dateInstalledHiddenValue').val() === "") {
        isValid = false;
    }
    else if (!ValidateFields()) {
        isValid = false;
    }
    else { isValid = true; }
    return isValid;
}

function EditAsset() {
    var validate = ValidateInspectionEditAssetFields();
    if (!validate) {
        ////showError("Please fill all mandatory fields");
        showError(GetTranslatedValue("FillAll"));

    }
    else {
        LoadMyLocation();
        showActionPopupLoading();
        $('#editAssetSaveImage').addClass('ui-disabled');
        $('#editAssetCancelImage').addClass('ui-disabled');

        $("#editAssetCustomerNumberHiddenValue").val(localStorage.getItem("CustomerNumber"));
        $("#editAssetCustomerSiteNumberHiddenValue").val(localStorage.getItem("CustomerSiteNumber"));

        var data = $('#formEditAsset').serialize();
        //// to get the value of disabled fields
        $('select[disabled]').each(function () {
            data = data + '&' + $(this).attr('name') + '=' + $(this).val();
        });

        data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(localStorage.getItem("DatabaseID")) + "&" +
                    "Language" + "=" + localStorage.getItem("Language") + "&" +
                    "Username" + "=" + decryptStr(localStorage.getItem("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(localStorage.getItem("EmployeeNumber")) + "&" +
                    "GPSLocation" + "=" + GlobalLat + "," + GlobalLong + "&" +
                    "SessionID" + "=" + decryptStr(getLocal("SessionID"))
                    );

        if (navigator.onLine) {
            var editUrl = standardAddress + "Inspection.ashx?methodname=EditAsset";
            EditAssetSuccess(editUrl, data);
        }
        else {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError('No network connection. Please try again when network is available.');
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
            }, 650);

        }
    }
}

function EditAssetSuccess(editUrl, editAssetDetails) {
    $.postJSON(editUrl, editAssetDetails, function (resultMessage) {

        if (resultMessage.Status == 'Success') {
            closeActionPopupLoading();
            //Save Success. Show Popup.
            $('#successeditAssetMessageParagraph').html(GetTranslatedValue("UpdateSuccess"));
            setTimeout(function () {
                $("#editAssetMessagePopUp").popup();
                $("#editAssetMessagePopUp").popup("open");
            }, 650);

            $('#editAssetSaveImage').removeClass('ui-disabled');
            $('#editAssetCancelImage').removeClass('ui-disabled');
        }
        else if (resultMessage.Date == 'Invalid') {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Please enter a valid 'Date Installed' in 'mm/dd/yyyy' format between year 1940-2099");
                showError(GetTranslatedValue("ValidDateInstalled"));
            }, 650);


            $('#editAssetSaveImage').removeClass('ui-disabled');
            $('#editAssetCancelImage').removeClass('ui-disabled');
        }
        else if (resultMessage.SerialNumber == 'Exists') {
            closeActionPopupLoading();

            setTimeout(function () {
                ////showError("Serial Number already Exists");
                showError(GetTranslatedValue("SerialExists"));
            }, 650);

            $('#editAssetSaveImage').removeClass('ui-disabled');
            $('#editAssetCancelImage').removeClass('ui-disabled');
        }

        else {
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Failed to update, please try again");
                showError(GetTranslatedValue("FailtoUpdate"));
            }, 650);

            $('#editAssetSaveImage').removeClass('ui-disabled');
            $('#editAssetCancelImage').removeClass('ui-disabled');
        }
    });
}

function RetireAsset() {
    if (navigator.onLine) {
        $("#editAssetCustomerNumberHiddenValue").val(localStorage.getItem("CustomerNumber"));
        $("#editAssetCustomerSiteNumberHiddenValue").val(localStorage.getItem("CustomerSiteNumber"));
        showActionPopupLoading();

        var data = $('#formEditAsset').serialize();
        data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(localStorage.getItem("DatabaseID")) + "&" +
                    "Language" + "=" + localStorage.getItem("Language") + "&" +
                    "Username" + "=" + decryptStr(localStorage.getItem("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(localStorage.getItem("EmployeeNumber")) + "&" +
                    "SessionID" + "=" + decryptStr(getLocal("SessionID"))
                    );
        var retireAssetURL = standardAddress + "Inspection.ashx?methodname=RetireAssset";
        RetireAssetSuccess(retireAssetURL, data);
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function RetireAssetSuccess(retireAssetURL, retireData) {
    $.postJSON(retireAssetURL, retireData, function (result) {
        if (result.Status == 'Success') {
            closeActionPopupLoading();
            //Save Success. Show Popup.
            $('#successeditAssetMessageParagraph').html(GetTranslatedValue("AssetRetireSuccess"));

            setTimeout(function () {
                $("#editAssetMessagePopUp").popup();
                $("#editAssetMessagePopUp").popup("open");
            }, 650);
        }
        else {
            closeActionPopupLoading();
            closeActionPopupLoading();
            setTimeout(function () {
                ////showError("Failed to retire, please try again");
                showError(GetTranslatedValue("FailToRetire"));
            }, 650);

        }
    });
}

function LoadDetailsPostError() {
    ////showError("Error in loading details");
    showError(GetTranslatedValue("ErrorInLoading"));
}

function NavigateBackToAssets() {
    $.mobile.changePage("InspectionAssets.html");
}

function NavigateToPicturesScreenFromEditAsset(obj) {
    var TableName = $('#' + obj.id).attr('data-tableName');
    localStorage.setItem("TableName", TableName);

    if (navigator.onLine) {
        $.mobile.changePage('InspectionPictures.html');
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToCapitalFromEditAsset() {
    $.mobile.changePage("InspectionCapital.html");
}

function CallToRetireAsset() {
    $("#confirmRetirePopUp").popup("open");
}

function InspectionEditAsset_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");

    $(pageID).find("#tagConditionDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    // Handle security for the new fields.
    var SgtCollection = $.GetSecuritySubTokens(400044, 0);
    EnforceFieldSecurity(SgtCollection, "Manufacturer", false);
    EnforceFieldSecurity(SgtCollection, "Model", false);
}
