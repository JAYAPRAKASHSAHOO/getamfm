function TimeCardNAPageSecurity(SgstCollection) {
    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "CanAccess")) {
        timeCardNA_DeleteButtonVisible = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "ReadOnly")) {
            timeCardNA_DeleteButtonEnabled = false;
        }
        else {
            timeCardNA_DeleteButtonEnabled = true;
        } // end of else
    }
    else {
        timeCardNA_DeleteButtonVisible = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "CanAccess")) {
        $("#TimeCardNA_SaveButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "ReadOnly")) {
            $('#TimeCardNA_SaveButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardNA_SaveButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#TimeCardNA_SaveButton").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "CanAccess")) {
        $("#TimeCardNA_ResetButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "ReadOnly")) {
            $('#TimeCardNA_ResetButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardNA_ResetButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#TimeCardNA_ResetButton").hide();
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "EditHeaderLabel", "CanAccess")) {
        $("#timeCardNA_EditHeaderLabel").hide();
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ClassificationDropDown", "CanAccess")) {
        $("#ClassificationRow").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ClassificationDropDown", "ReadOnly")) {
            $("#ClassificationDropDown").attr("Requried", "true");
            $("#ClassificationMandatoryLabel").show();
            $('#ClassificationDropDown').prop("disabled", false);
            $('#ClassificationLabel').attr('readonly', 'readonly');
        }
        else {
            $("#ClassificationMandatoryLabel").hide();
            $('#ClassificationDropDown').prop("disabled", true);
            $('#ClassificationLabel').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ArrivalTextBox", "CanAccess")) {
        $("#ArrivalRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ArrivalTextBox", "ReadOnly")) {

            $("#ArrivalMandatoryLabel").hide();
            $('#ArrivalLabel').attr('readonly', 'readonly');
            $('#ArrivalTextBox').attr('readonly', 'readonly');
        }

        else {

            $("#ArrivalMandatoryLabel").show();
            $('#ArrivalLabel').removeAttr("readonly");
            $('#ArrivalTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "DepartureTextBox", "CanAccess")) {
        $("#DepartureRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "DepartureTextBox", "ReadOnly")) {
            $("#DepartureMandatoryLabel").hide();
            $('#DepartureLabel').attr('readonly', 'readonly');
            $('#DepartureTextBox').attr('readonly', 'readonly');
        }

        else {
            $("#DepartureMandatoryLabel").show();
            $('#DepartureLabel').removeAttr("readonly");
            $('#DepartureTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "HoursTextBox", "CanAccess")) {
        $("#HoursRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "HoursTextBox", "ReadOnly")) {
            $("#HoursMandatoryLabel").hide();
            $('#HoursLabel').attr('readonly', 'readonly');
            $('#HoursTextBox').attr('readonly', 'readonly');
        }

        else {
            $("#HoursMandatoryLabel").show();
            $('#HoursLabel').removeAttr("readonly");
            $('#HoursTextBox').removeAttr("readonly");
        }
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "EntryCollapsibleSet", "CanAccess")) {
        $("#TimeCardNA_EntryCollapsible").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "EntryCollapsibleSet", "ReadOnly")) {
            $('#TimeCardNA_EntryCollapsible').addClass('ui-disabled');
        }
        else {
            $('#TimeCardNA_EntryCollapsible').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#TimeCardNA_EntryCollapsible").hide();
    }

    LoadTranslation(timeCardNA_PageID, TimeCardNA_TranslationLoadComplete);
}

function TimeCardNA_TranslationLoadComplete() {
    timeCardNA_NoEntryTranslation = GetTranslatedValue("NoNon-AppliedEntryValue");
    timeCardNA_AddHeaderTranslation = GetTranslatedValue("AddNon-AppliedEntryValue");
    timeCardNA_EditHeaderTranslation = GetTranslatedValue("EditNon-AppliedEntryValue");
    timeCardNA_ArrivalTranslation = GetTranslatedValue("ArrivalLabel");
    timeCardNA_DepartureTranslation = GetTranslatedValue("DepartureLabel");
    timeCardNA_HoursTranslation = GetTranslatedValue("HoursLabel");
    actionFailedTranslation = GetTranslatedValue("ActionfailedValue");
    timeCardNA_RequiredTextBoxValidation = GetTranslatedValue("RequiredTextBoxValidation");
    timeCardNA_RequiredDropDownValidation = GetTranslatedValue("RequiredDropDownValidation");
    timeCardNA_InvalidDate1Translation = GetTranslatedValue("InvalidDate1");
    timeCardNA_InvalidDate2Translation = GetTranslatedValue("InvalidDate2");
    timeCardNA_InvalidDate3Translation = GetTranslatedValue("InvalidDate3");
    timeCardNA_InvalidWeekTranslation = GetTranslatedValue("InvalidWeek");
    timeCardNA_MustNumberTranslation = GetTranslatedValue("MustNumber");
    timeCardNA_DateGreaterTranslation = GetTranslatedValue("DateGreater");
    timeCardNA_NumberRange1Translation = GetTranslatedValue("NumberRange1");
    timeCardNA_NumberRange2Translation = GetTranslatedValue("NumberRange2");
    timeCardNA_NumberRange2Translation = timeCardNA_NumberRange2Translation.replace("[MIN]", timeCardNA_NumMin).replace("[MAX]", timeCardNA_NumMax);
    timeCardNA_NoNetworkTranslation = GetTranslatedValue("NoNetwork");
    timeCardNA_TimeCardOverlapTranslation = GetTranslatedValue("Overlap");

    timeCardNA_ClassificationDropDown.children("option:eq(0)").text(GetTranslatedValue("Select")).val(defaultDropDownValue);
    timeCardNA_ClassificationDropDown.selectmenu("refresh", true);

    timeCardNA_Page.find("#TimeCardNA_SubHeaderLabel").text(getLocal("TimeCard_WeekRange"));

    TimeCardNA_GetClassification();

    if (!timeCardNA_IsCreateMode) {
        if (getLocal("TimeCard_NonAppliedSource") == "DailyViewEntry") {
            timeCardNAEntry = JSON.parse(getLocal("LaborData"));

            for (var i = 0; i < timeCardNAEntry.length; i++) {
                timeCardNAEntry[i].Arrival = GetDateObjectFromInvariantDateString(timeCardNAEntry[i].ArrivalString);
                timeCardNAEntry[i].Departure = GetDateObjectFromInvariantDateString(timeCardNAEntry[i].DepartureString);
            }

            // Wait before loading the TimeCard details
            setTimeout( function() {
            	TimeCardNA_Edit(Number(getLocal("LaborDataIndex")));
            	closeActionPopupLoading();
                       }, 650);
        } else {
            TimeCardNA_GetEntries(false);
        }
    }
    else {
        TimeCardNA_Create();
        closeActionPopupLoading();
    }
}

function TimeCardNA_GetClassification() {
    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetClassification";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                        var option = document.createElement("option");
                        option.setAttribute("value", data[arrayCount].Classification);
                        option.innerHTML = data[arrayCount].Classification;
                        timeCardNA_ClassificationDropDown.append(option);
                    }
                }
            }
            else {
                closeActionPopupLoading();

                setTimeout(function () {
                    showError(data.Message);
                }, 650);
            }
        });
    }
    else {
        closeActionPopupLoading();

        setTimeout(function () {
            showError(timeCardNA_NoNetworkTranslation);
        }, 650);
    }
}

function TimeCardNA_GetEntries(navigateEntry) {
    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
        "SundayDate": getLocal("TimeCard_SundayDate"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetNonAppliedHours";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    var htmlContent = emptyString;

                    if (data.length == 0) {
                        htmlContent +=
                                '<p><strong><label>' + timeCardNA_NoEntryTranslation + '</label></strong></p>';
                    }
                    else {
                        timeCardNA_EntryCollapsible.empty();
                        var isHeader;

                        for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                            data[arrayCount].Arrival = GetDateObjectFromInvariantDateString(data[arrayCount].ArrivalString);
                            data[arrayCount].Departure = GetDateObjectFromInvariantDateString(data[arrayCount].DepartureString);

                            isHeader = false;

                            if (arrayCount == 0) {
                                isHeader = true;
                            }
                            else if (data[arrayCount - 1].UnBilledClassification != data[arrayCount].UnBilledClassification) {
                                htmlContent += "</div>";
                                isHeader = true;
                            }

                            if (isHeader) {
                                htmlContent += TimeCardNA_GetCollapsibleHeaderHtml(data[arrayCount]) + TimeCardNA_GetCollapsibleChildrenHtml(data[arrayCount], arrayCount);
                            }
                            else {
                                htmlContent += '<hr />' + TimeCardNA_GetCollapsibleChildrenHtml(data[arrayCount], arrayCount);
                            }
                        }

                        timeCardNAEntry = data;

                        htmlContent += "</div>";
                    }

                    timeCardNA_EntryCollapsible.html(htmlContent).trigger("create");
                }

                closeActionPopupLoading();

                if (navigateEntry) {
                    TimeCardNA_ShowEntries();
                }
            }
            else {
                closeActionPopupLoading();

                setTimeout(function () {
                    showError(data.Message);
                }, 650);
            }
        });
    }
    else {
        closeActionPopupLoading();

        setTimeout(function () {
            showError(timeCardNA_NoNetworkTranslation);
        }, 650);
    }
}

function TimeCardNA_GetCollapsibleHeaderHtml(timeCardNA_SingleEntry) {
    var htmlContent = emptyString;

    if (!IsObjectNullOrUndefined(timeCardNA_SingleEntry)) {
        htmlContent +=
                    '<div id="TimeCardNA_EntryCollapsibleSet" data-role="collapsible" class="collapsibleBackground" data-inset="true">' +
                    '<h4><strong class="boldfont">' + timeCardNA_SingleEntry.UnBilledClassification + '</strong></h4>';
    }

    return htmlContent;
}

function TimeCardNA_GetCollapsibleChildrenHtml(timeCardNA_SingleEntry, index) {
    var htmlContent = emptyString;

    if (!IsObjectNullOrUndefined(timeCardNA_SingleEntry)) {
        htmlContent +=
                    '<img id ="TimeCardNA_DeleteButton" class="img-delete-onpress' + (timeCardNA_DeleteButtonEnabled ? emptyString : ' ui-disabled') + '" style="float:right;' + (timeCardNA_DeleteButtonVisible ? emptyString : ' display: none;') + '" data-inline="true" onclick="TimeCardNA_DeleteConfirmation(' + index + ');" />' +
                    '<table class="customTable" onclick="TimeCardNA_Edit(' + index + ')">' +
                        '<tbody>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        timeCardNA_ArrivalTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetDateTimeText(timeCardNA_SingleEntry.Arrival, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        timeCardNA_DepartureTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetDateTimeText(timeCardNA_SingleEntry.Departure, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        timeCardNA_HoursTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetDecimal(timeCardNA_SingleEntry.RegularHours, 2, true) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>';
    }

    return htmlContent;
}

function TimeCardNA_ClearEditControls() {
    timeCardNA_DeleteIndex = null;
    timeCardNA_EditHeaderLabel.text(emptyString);
    timeCardNA_IndexHidden.val(emptyString);
    timeCardNA_TimeCardDetailNumberHidden.val(emptyString);
    timeCardNA_LaborHourNumberHidden.val(emptyString);
    timeCardNA_ClassificationDropDown.val(defaultDropDownValue);
    timeCardNA_ClassificationDropDown.selectmenu("refresh", true);
    timeCardNA_ArrivalTextBox.val(emptyString);
    timeCardNA_DepartureTextBox.val(emptyString);
    timeCardNA_HoursTextBox.val(emptyString);
}

function TimeCardNA_Create() {
    timeCardNA_IsCreateMode = true;
    TimeCardNA_ClearEditControls();
    timeCardNA_EditHeaderLabel.text(timeCardNA_AddHeaderTranslation);

    if (!timeCardNA_IsCreateMode) {
        TimeCardNA_ShowCreate();
    }
    else {
        timeCardNA_IsEntryVisible = false;
        timeCardNA_EntryDiv.hide();
        timeCardNA_EditDiv.show();
    }
}

function TimeCardNA_Edit(index) {
    timeCardNA_IsCreateMode = false;
    TimeCardNA_ClearEditControls();

    if (index >= 0 && index < timeCardNAEntry.length) {
        timeCardNA_EditHeaderLabel.text(timeCardNA_EditHeaderTranslation);
        timeCardNA_IndexHidden.val(index);
        timeCardNA_TimeCardDetailNumberHidden.val(timeCardNAEntry[index].TimecardDetailNumber);
        timeCardNA_LaborHourNumberHidden.val(timeCardNAEntry[index].LaborHourNumber);
        timeCardNA_ClassificationDropDown.val(timeCardNAEntry[index].UnBilledClassification);
        timeCardNA_ClassificationDropDown.selectmenu("refresh", true);
        timeCardNA_HoursTextBox.val(GetDecimal(timeCardNAEntry[index].RegularHours, 2, false));
        timeCardNA_ArrivalTextBox.val(GetInvariantDateTimeString_T(timeCardNAEntry[index].Arrival));
        timeCardNA_DepartureTextBox.val(GetInvariantDateTimeString_T(timeCardNAEntry[index].Departure));
    }

    TimeCardNA_ShowCreate();
}

function TimeCardNA_ShowEntries() {
    if (!timeCardNA_IsEntryVisible) {
        timeCardNA_HoursTextBox.blur();
        timeCardNA_Page.scrollTop(0);
        timeCardNA_IsEntryVisible = true;
        timeCardNA_EntryDiv.show();
        timeCardNA_EditDiv.hide();
        //timeCardNA_EntryDiv.show('slide', { direction: 'left' }, 250);
        //timeCardNA_EditDiv.hide('slide', { direction: 'right' }, 250);
    }
}

function TimeCardNA_ShowCreate() {
    if (timeCardNA_IsEntryVisible) {
        timeCardNA_Page.scrollTop(0);
        timeCardNA_IsEntryVisible = false;
        timeCardNA_EntryDiv.hide();
        timeCardNA_EditDiv.show();
        //timeCardNA_EntryDiv.hide('slide', { direction: 'left' }, 250);
        //timeCardNA_EditDiv.show('slide', { direction: 'right' }, 250);
    }
}

function TimeCardNA_Reset() {
    if (!timeCardNA_IsCreateMode) {
        var index = timeCardNA_IndexHidden.val();
        if (!IsStringNullOrEmpty(index)) {
            index = Number(index);
            TimeCardNA_Edit(index);
        }
    }
    else {
        TimeCardNA_Create();
    }
}

function TimeCardNA_Save() {
    var validationMessage = emptyString;
    var validationFlag = true;
    var arrivalValidationFlag = true;
    var departureValidationFlag = true;

    var weekFrom = GetDateObjectFromInvariantDateString(getLocal("TimeCard_WeekFrom") + " 00:00");
    var weekTo = GetDateObjectFromInvariantDateString(getLocal("TimeCard_WeekTo") + " 23:59");

    var classificationText = GetTranslatedValue("ClassificationLabel");
    var arrivalText = GetTranslatedValue("ArrivalLabel");
    var departureText = GetTranslatedValue("DepartureLabel");
    var hoursText = GetTranslatedValue("HoursLabel");

    var arrival = GetDateObjectFromInvariantDateString(timeCardNA_ArrivalTextBox.val());
    var departure = GetDateObjectFromInvariantDateString(timeCardNA_DepartureTextBox.val());

    if (timeCardNA_ClassificationDropDown.val() == defaultDropDownValue) {
        validationMessage += "- " + classificationText + " " + timeCardNA_RequiredDropDownValidation + " " + classificationText + ".";
        validationFlag = false;
    }

    if (IsStringNullOrEmpty(timeCardNA_ArrivalTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + arrivalText + " " + timeCardNA_RequiredTextBoxValidation + " " + arrivalText + ".";
        validationFlag = false;
        arrivalValidationFlag = false;
    }
    else if (!ValidateInvariantDateString(timeCardNA_ArrivalTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeCardNA_InvalidDate1Translation + " " + arrivalText + " " + timeCardNA_InvalidDate2Translation + " " + MinYear + " " + timeCardNA_InvalidDate3Translation + " " + MaxYear + ".";
        validationFlag = false;
        arrivalValidationFlag = false;
    }
    else {
        if (arrival != null) {
            if (arrival < weekFrom || arrival > weekTo) {
                if (!IsStringNullOrEmpty(validationMessage)) {
                    validationMessage += "<br/>";
                }

                validationMessage += "- " + arrivalText + " " + timeCardNA_InvalidWeekTranslation;
                validationFlag = false;
                arrivalValidationFlag = false;
            }
        }
    }

    if (IsStringNullOrEmpty(timeCardNA_DepartureTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + departureText + " " + timeCardNA_RequiredTextBoxValidation + " " + departureText + ".";
        validationFlag = false;
        departureValidationFlag = false;
    }
    else if (!ValidateInvariantDateString(timeCardNA_DepartureTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeCardNA_InvalidDate1Translation + " " + departureText + " " + timeCardNA_InvalidDate2Translation + " " + MinYear + " " + timeCardNA_InvalidDate3Translation + " " + MaxYear + ".";
        validationFlag = false;
        departureValidationFlag = false;
    }
    else {
        if (departure != null) {
            if (departure < weekFrom || departure > weekTo) {
                if (!IsStringNullOrEmpty(validationMessage)) {
                    validationMessage += "<br/>";
                }

                validationMessage += "- " + departureText + " " + timeCardNA_InvalidWeekTranslation;
                validationFlag = false;
                departureValidationFlag = false;
            }
        }
    }

    if (arrivalValidationFlag && departureValidationFlag) {
        if (arrival > departure) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + departureText + " " + timeCardNA_DateGreaterTranslation + " " + arrivalText + ".";
            validationFlag = false;
        }
    }

    if (IsStringNullOrEmpty(timeCardNA_HoursTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + hoursText + " " + timeCardNA_RequiredTextBoxValidation + " " + hoursText + ".";
        validationFlag = false;
    }
    else {
        var hoursNumber = parseFloat(timeCardNA_HoursTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + hoursText + " " + timeCardNA_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardNA_NumMin || hoursNumber > timeCardNA_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardNA_NumberRange1Translation + " " + hoursText + " " + timeCardNA_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (validationFlag) {
        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "Optionstring": timeCardNA_IsCreateMode ? "I" : "U",
            "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
            "SundayDate": getLocal("TimeCard_SundayDate"),
            "LaborHourNumber": timeCardNA_LaborHourNumberHidden.val(),
            "TimeCardDetailNumber": timeCardNA_IsCreateMode ? getLocal("TimeCard_TimeCardDetailNumber") : timeCardNA_TimeCardDetailNumberHidden.val(),
            "Classification": timeCardNA_ClassificationDropDown.val() == defaultDropDownValue ? emptyString : timeCardNA_ClassificationDropDown.val(),
            "Arrival": timeCardNA_ArrivalTextBox.val().replace("T", " "),
            "Departure": timeCardNA_DepartureTextBox.val().replace("T", " "),
            "RegularHours": timeCardNA_HoursTextBox.val(),
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        TimeCardNA_ModifyEntry(myJSONobject);
    }
    else {
        showError(validationMessage);
    }
}

function TimeCardNA_DeleteConfirmation(index) {
    timeCardNA_DeleteIndex = index;
    showConfirmation(GetTranslatedValue("DeleteValue"), GetTranslatedValue("YesValue"), GetTranslatedValue("NoValue"), TimeCardNA_Delete);
}

function TimeCardNA_Delete(value) {
    if (value) {
        if (timeCardNA_DeleteIndex >= 0 && timeCardNA_DeleteIndex < timeCardNAEntry.length) {
            var myJSONobject = {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "Optionstring": "D",
                "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
                "SundayDate": getLocal("TimeCard_SundayDate"),
                "LaborHourNumber": timeCardNAEntry[timeCardNA_DeleteIndex].LaborHourNumber,
                "TimeCardDetailNumber": timeCardNAEntry[timeCardNA_DeleteIndex].TimecardDetailNumber,
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "SessionID": decryptStr(getLocal("SessionID")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
            };

            TimeCardNA_ModifyEntry(myJSONobject);
        }
    }

    timeCardNA_DeleteIndex = null;
}

function TimeCardNA_ModifyEntry(myJSONobject) {
    var accessURL = standardAddress + "TimeCard.ashx?Method=SetNonAppliedHours";

    if (navigator.onLine) {
        showActionPopupLoading();
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    if (data.Status) {
	                   if (getLocal("TimeCard_NonAppliedSource") === "DailyViewEntry") {
	                   	TimeCardNA_NavigatePrevious();
	                   } else {
	                        if (!timeCardNA_IsCreateMode) {
	                            TimeCardNA_GetEntries(true);
	                            //TimeCardNA_ShowEntries();
	                        }
	                        else {
	                            TimeCardNA_NavigatePrevious();
	                        }
			  }
                    }
                    else {
                        closeActionPopupLoading();

                        setTimeout(function () {
                            showError(actionFailedTranslation);
                        }, 650);
                    }
                }
                else {
                    closeActionPopupLoading();
                }
            }
            else {
                closeActionPopupLoading();

                setTimeout(function () {
                    if (!IsStringNullOrEmpty(data.Message)) {
                        showError(data.Message.replace("[OVERLAP]", timeCardNA_TimeCardOverlapTranslation));
                    }
                }, 650);
            }
        });
    }
    else {
        showError(timeCardNA_NoNetworkTranslation);
    }
}

function TimeCardNA_CalculateHours() {
    var arrival = GetDateObjectFromInvariantDateString(timeCardNA_ArrivalTextBox.val());
    var departure = GetDateObjectFromInvariantDateString(timeCardNA_DepartureTextBox.val());

    if (arrival != null && departure != null && departure >= arrival) {
        var hours = GetDecimal((departure - arrival) / 36e5, 2, false);
        timeCardNA_HoursTextBox.val(hours);
    }
}

function TimeCardNA_NavigatePrevious() {
    if (navigator.onLine) {
        if (getLocal("TimeCard_NonAppliedSource") === "DailyViewEntry") {
            $.mobile.changePage("TimeCardEntry.html");
        } else {
            if (!timeCardNA_IsCreateMode) {
            	$.mobile.changePage("TimeCardSummary.html");
            }
            else {
            	$.mobile.changePage("TimeCardEntry.html");
            }
        }
    }
    else {
        showError(timeCardNA_NoNetworkTranslation);
    }
}