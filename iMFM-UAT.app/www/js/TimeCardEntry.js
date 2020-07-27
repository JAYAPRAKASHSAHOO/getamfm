function TimeCardEntryPageSecurity(SgstCollection) {
    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardEntryCollapsibleSet", "CanAccess")) {
        timeCardEntryCollapsible.show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardEntryCollapsibleSet", "ReadOnly")) {
            timeCardEntryCollapsible.addClass('ui-disabled');
        }
        else {
            timeCardEntryCollapsible.removeClass('ui-disabled');
        } // end of else
    }
    else {
        timeCardEntryCollapsible.hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "AddNAButton", "CanAccess")) {
        addNAButtonVisible = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "AddNAButton", "ReadOnly")) {
            addNAButtonEnabled = false;
        }
        else {
            addNAButtonEnabled = true;
        } // end of else
    }
    else {
        addNAButtonVisible = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "AddWOButton", "CanAccess")) {
        addWOButtonVisible = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "AddWOButton", "ReadOnly")) {
            addWOButtonEnabled = false;
        }
        else {
            addWOButtonEnabled = true;
        } // end of else
    }
    else {
        addWOButtonVisible = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "CanAccess")) {
        deleteButtonVisible = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "ReadOnly")) {
            deleteButtonEnabled = false;
        }
        else {
            deleteButtonEnabled = true;
        } // end of else
    }
    else {
        deleteButtonVisible = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "CanAccess")) {
        $("#TimeCardEntry_SaveButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "ReadOnly")) {
            $('#TimeCardEntry_SaveButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardEntry_SaveButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#TimeCardEntry_SaveButton").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "CanAccess")) {
        $("#TimeCardEntry_ResetButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "ReadOnly")) {
            $('#TimeCardEntry_ResetButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardEntry_ResetButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#TimeCardEntry_ResetButton").hide();
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "HoursValueLabel", "CanAccess")) {
        $("#CalculatedHoursRow").hide();
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "DateTextBox", "CanAccess")) {
        $("#DateRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "DateTextBox", "ReadOnly")) {
            $('#DateLabel').attr('readonly', 'readonly');
            $('#DateTextBox').attr('readonly', 'readonly');
        }

        else {
            $('#DateLabel').removeAttr("readonly");
            $('#DateTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "TimeInTextBox", "CanAccess")) {
        $("#TimeInRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "TimeInTextBox", "ReadOnly")) {
            $('#TimeInLabel').attr('readonly', 'readonly');
            $('#TimeInTextBox').attr('readonly', 'readonly');
        }

        else {
            $('#TimeInLabel').removeAttr("readonly");
            $('#TimeInTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "MealOutTextBox", "CanAccess")) {
        $("#MealOutRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "MealOutTextBox", "ReadOnly")) {
            $('#MealOutLabel').attr('readonly', 'readonly');
            $('#MealOutTextBox').attr('readonly', 'readonly');
        }

        else {
            $('#MealOutLabel').removeAttr("readonly");
            $('#MealOutTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "MealInTextBox", "CanAccess")) {
        $("#MealInRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "MealInTextBox", "ReadOnly")) {
            $('#MealInLabel').attr('readonly', 'readonly');
            $('#MealInTextBox').attr('readonly', 'readonly');
        }

        else {
            $('#MealInLabel').removeAttr("readonly");
            $('#MealInTextBox').removeAttr("readonly");
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "TimeOutTextBox", "CanAccess")) {
        $("#TimeOutRow").hide();
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "TimeOutTextBox", "ReadOnly")) {
            $('#TimeOutLabel').attr('readonly', 'readonly');
            $('#TimeOutMandatoryLabel').hide();
        }

        else {
            $('#TimeOutLabel').removeAttr("readonly");
            $('#TimeOutMandatoryLabel').show();
        }
    }

    LoadTranslation(timeCardEntryPageID, TimeCardEntry_TranslationLoadComplete);
}

function TimeCardEntry_TranslationLoadComplete() {
    addTimeCardHeaderTranslation = GetTranslatedValue("AddTimeCardEntryValue")
    editTimeCardHeaderTranslation = GetTranslatedValue("EditTimeCardEntryValue");
    noTimeCardEntryTranslation = GetTranslatedValue("NoTimeCardEntry");
    timeInTranslation = GetTranslatedValue("TimeInLabel");
    mealOutTranslation = GetTranslatedValue("MealOutLabel");
    mealInTranslation = GetTranslatedValue("MealInLabel");
    timeOutTranslation = GetTranslatedValue("TimeOutLabel");
    actionFailedTranslation = GetTranslatedValue("ActionfailedValue");
    requiredFieldTranslation = GetTranslatedValue("RequiredFieldValue");
    invalidDate1Translation = GetTranslatedValue("PleaseenteravalidValue");
    invalidDate2Translation = GetTranslatedValue("BetweenyearValue");
    invalidDate3Translation = GetTranslatedValue("AndValue");
    timeCardEntryPage.find("#TimeCardEntrySubHeaderLabel").text(getLocal("TimeCard_WeekRange"));
    noNetworkTranslation = GetTranslatedValue("NoNetwork");
    invalidHoursTranslation = GetTranslatedValue("InvalidHours").replace("[HOURS]", GetTranslatedValue("CalculatedHoursLabel"));
    negativeHoursTranslation = GetTranslatedValue("NegativeHours").replace("[HOURS]", GetTranslatedValue("CalculatedHoursLabel"));
    laterThanTranslation = GetTranslatedValue("LaterThan");
    overallTranslation = GetTranslatedValue("OverallHoursLabel");
    hoursTranslation = GetTranslatedValue("RegularHoursLabel");
    nonAppTranslation = GetTranslatedValue("NonAppliedHoursLabel");
    driveTranslation = GetTranslatedValue("DriveHoursLabel");

    if (getLocal("TimeCard_View") === "TCS_DailyViewButton"){
        timeCardEntryPage.find("#TimeCardEntryHeaderLabel").text(GetTranslatedValue("DailyViewHeaderLabel"));
    }
    GetTimeCardEntries(false);
}

function GetTimeCardEntries(navigateEntry) {
    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
        "SundayDate": getLocal("TimeCard_SundayDate"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress;

    if (getLocal("TimeCard_View") === "TCS_DailyViewButton") {
        accessURL += "TimeCard.ashx?Method=GetTimeCardDailyViewEntries";
    } else {
        accessURL += "TimeCard.ashx?Method=GetTimeCardEntries";
    }

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    var htmlContent = emptyString;
                    var isNoRecords = false;
                    var isDailyView = false;
                    var childrenContent = emptyString;
                    // Hour array contains 0 = Regular, 1 = NonApp, 2 = Drive Hrs
                    var childrenHours = [0,0,0];

                    if (data.length == 0) {
                        isNoRecords = true;

                        htmlContent +=
                                '<p><strong><label>' + noTimeCardEntryTranslation + '</label></strong></p>';
                    }
                    else {
                        timeCardEntryCollapsible.empty();
                        var isHeader;


                    if (getLocal("TimeCard_View") === "TCS_DailyViewButton") {
                        isDailyView = true;
                    }
                        for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                            isHeader = false;

                            data[arrayCount].DateWorked = GetDateObjectFromInvariantDateString(data[arrayCount].DateWorkedString);

                            // Need to verify values exist or break the split function.
                            if (isDailyView) {
                                if (!IsStringNullOrEmpty(data[arrayCount].ArrivalString)) {
                                    data[arrayCount].Arrival = GetDateObjectFromInvariantDateString(data[arrayCount].ArrivalString);
                                }

                                if (!IsStringNullOrEmpty(data[arrayCount].DepartureString)) {
                                    data[arrayCount].Departure = GetDateObjectFromInvariantDateString(data[arrayCount].DepartureString);
                                }
                            } else {
                            	data[arrayCount].TimeIn = GetDateObjectFromInvariantDateString(data[arrayCount].TimeInString);
                            	data[arrayCount].MealOut = GetDateObjectFromInvariantDateString(data[arrayCount].MealOutString);
                            	data[arrayCount].MealIn = GetDateObjectFromInvariantDateString(data[arrayCount].MealInString);
                            	data[arrayCount].TimeOut = GetDateObjectFromInvariantDateString(data[arrayCount].TimeOutString);

                            }

                            if (isDailyView) {
                                if (arrayCount == 0) {
                                isHeader = true;
                            	}
                                else if (data[arrayCount - 1].DateWorked.valueOf() != data[arrayCount].DateWorked.valueOf()) {
                                    // Add the aggregate calculations for the day followed by the children.
                                    htmlContent += GetCollapsibleChildrenAggregate(childrenHours) + childrenContent + '</ul></div>';
                                    childrenContent = emptyString;
                                    childrenHours[0] = 0;
                                    childrenHours[1] = 0;
                                    childrenHours[2] = 0;
                                    isHeader = true;
                                }
                   
                                if (isHeader) {
                                   htmlContent += GetCollapsibleHeaderHtml(data[arrayCount]);
                                }
                   
                                if (!IsStringNullOrEmpty(data[arrayCount].LaborHourNumber) && data[arrayCount].LaborHourNumber != 0) {
                                       childrenContent += GetCollapsibleChildrenHtml(data[arrayCount], arrayCount, isDailyView);
                                    // NonApp hours are identified by lack of a work order.
                                    if (!IsStringNullOrEmpty(data[arrayCount].WorkOrderNumber)) {
                                       childrenHours[0] += data[arrayCount].RegularHours;
                                    } else {
                                       childrenHours[1] += data[arrayCount].RegularHours;
                                    }
                                       childrenHours[2] += data[arrayCount].RegularDriveHours;
                                }
                   
                                if (arrayCount == data.length - 1) {
                                    // Add the aggregate calculations for the day followed by the children.
                                    htmlContent += GetCollapsibleChildrenAggregate(childrenHours) + childrenContent + '</ul></div>';
                                }
                            } else {
                                if (arrayCount == 0) {
                                    isHeader = true;
                                }
                                else if (data[arrayCount - 1].DateWorked.valueOf() != data[arrayCount].DateWorked.valueOf()) {
                                    htmlContent += "</div>";
                                    isHeader = true;
                                }

                                if (isHeader) {
                                    htmlContent += GetCollapsibleHeaderHtml(data[arrayCount]) + GetCollapsibleChildrenHtml(data[arrayCount], arrayCount, isDailyView);
                                }
                            	else {
                                    htmlContent += '<hr/>' + GetCollapsibleChildrenHtml(data[arrayCount], arrayCount, isDailyView);
                                }
                            }
                        }

                        timeCardEntry = data;

                        htmlContent += "</div>";
                    }

                    timeCardEntryCollapsible.html(htmlContent).trigger("create");
                }

                closeActionPopupLoading();

                if (isNoRecords) {
                    setTimeout(function () {
                        CreateTimeCardEntry();
                    }, 1500);
                }
                else if (navigateEntry) {
                    ShowEntries();
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
            showError(noNetworkTranslation);
        }, 650);
    }
}

function GetCollapsibleHeaderHtml(timeCardSingleEntry) {
    var htmlContent = emptyString;

    if (!IsObjectNullOrUndefined(timeCardSingleEntry)) {
        htmlContent +=
                    '<div data-role="collapsible" class="collapsibleBackground" data-inset="true">' +
                    '<h4><strong class="boldfont">' + timeCardSingleEntry.DateWorked.toLocaleDateString() + '</strong></h4>';
    }

    return htmlContent;
}

function GetCollapsibleChildrenAggregate(hourArray) {
    // Hour array contains 0 = Regular, 1 = NonApp, 2 = Drive Hrs
    var htmlContent = emptyString;
    var regularHoursValue = GetDecimal(hourArray[0], 2, true);
    var nonAppHoursValue = GetDecimal(hourArray[1], 2, true);
    var driveHoursValue = GetDecimal(hourArray[2], 2, true);
    var overallValue = (parseFloat(regularHoursValue) + parseFloat(nonAppHoursValue) + parseFloat(driveHoursValue)).toFixed(2);

    if (!IsObjectNullOrUndefined(hourArray)) {
        htmlContent +=
        '<ul data-role="listview" data-inset="false"><li>' +
        '<p class="ui-li-aside ui-li-desc" style="font-size:0.8em!important;margin:0px;"><strong>' + overallTranslation + '</strong> ' + overallValue + '<br /><strong>' +
            nonAppTranslation + '</strong> ' + nonAppHoursValue + '</p>' +
        '<span style="font-size: 0.8em"><strong>' + hoursTranslation + '</strong> ' + regularHoursValue + '</span><br />' +
        '<span style="font-size: 0.8em"><strong>' + driveTranslation + '</strong> ' + driveHoursValue + '</span></li>';
    }
    
    return htmlContent;
}

function GetCollapsibleChildrenHtml(timeCardSingleEntry, index, isDailyView) {
    var htmlContent = emptyString;

    if (!IsObjectNullOrUndefined(timeCardSingleEntry)) {
        if (isDailyView) {
            htmlContent +=
                '<li style="padding:0px!important">' +
                '<a id="' + timeCardSingleEntry.LaborHourNumber + '" href="#" onclick="Labor_Edit(' + index + ')"' +
                'class="ui-link-inherit">' +
                '<p class="ui-li-aside ui-li-desc">' + (parseFloat(timeCardSingleEntry.RegularHours) + parseFloat(timeCardSingleEntry.RegularDriveHours)).toFixed(2) + '</p>' +
                '<span style="font-size: 0.8em"><strong>' + (IsStringNullOrEmpty(timeCardSingleEntry.WorkOrderNumber) ?
                    timeCardSingleEntry.UnBilledClassification : timeCardSingleEntry.WorkOrderNumber) + '</strong></span><br />' +
                '<span style="font-size: 0.8em">' + GetInvariantTimeString(timeCardSingleEntry.Arrival, false) +
                    '-' + GetInvariantTimeString(timeCardSingleEntry.Departure, false) + '</span></a></li>';
        } else {
            htmlContent +=
                    '<img id ="TimeCardEntry_DeleteButton" class="img-delete-onpress' + (deleteButtonEnabled ? emptyString : ' ui-disabled') + '" style="float:right;' + (deleteButtonVisible ? emptyString : ' display: none;') + '" data-inline="true" onclick="DeleteConfirmation(' + index + ');" />' +
                    '<img id ="TimeCardEntry_AddNAButton" class="img-addna' + (addNAButtonEnabled ? emptyString : ' ui-disabled') + '" style="float:right; padding-right: 5px;' + (addNAButtonVisible ? emptyString : ' display: none;') + '" data-inline="true" onclick="AddNA(' + index + ');" />' +
                    '<img id ="TimeCardEntry_AddWOButton" class="img-addwo' + (addWOButtonEnabled ? emptyString : ' ui-disabled') + '" style="float:right; padding-right: 10px;' + (addWOButtonVisible ? emptyString : ' display: none;') + '" data-inline="true" onclick="AddWO(' + index + ');" />' +
                    '<table class="customTable" onclick="EditTimeCardEntry(' + index + ')">' +
                        '<tbody>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        timeInTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetInvariantTimeString(timeCardSingleEntry.TimeIn, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        mealOutTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetInvariantTimeString(timeCardSingleEntry.MealOut, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        mealInTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetInvariantTimeString(timeCardSingleEntry.MealIn, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td class="LabelTD">' +
                                    '<label>' +
                                        timeOutTranslation + ' : ' +
                                    '</label>' +
                                '</td>' +
                                '<td class="ValueTD">' +
                                    '<label>' +
                                        GetInvariantTimeString(timeCardSingleEntry.TimeOut, false) +
                                    '</label>' +
                                '</td>' +
                            '</tr>' +
                        '</tbody>' +
                    '</table>';
        }
    }

    return htmlContent;
}

function ClearEditTimeCardEntry() {
    deleteIndex = null;
    editTimeCardLabel.text(emptyString);
    indexHidden.val(emptyString);
    timeCardDetailNumberHidden.val(emptyString);
    dateTextBox.val(emptyString);
    timeInTextBox.val(emptyString);
    mealOutTextBox.val(emptyString);
    mealInTextBox.val(emptyString);
    timeOutTextBox.val(emptyString);
    calculatedHoursValueLabel.text(emptyString);

    SetSelectedDateForLink('DateTextBox', 'DateLink');
}

function CreateTimeCardEntry() {
    isCreateMode = true;
    ClearEditTimeCardEntry();
    editTimeCardLabel.text(addTimeCardHeaderTranslation);
    ShowCreate();
}

function EditTimeCardEntry(index) {
    isCreateMode = false;
    ClearEditTimeCardEntry();

    if (index >= 0 && index < timeCardEntry.length) {
        editTimeCardLabel.text(editTimeCardHeaderTranslation);
        indexHidden.val(index);
        timeCardDetailNumberHidden.val(timeCardEntry[index].TimeCardDetailNumber);
        timeInTextBox.val(GetInvariantTimeString(timeCardEntry[index].TimeIn, true));
        mealOutTextBox.val(GetInvariantTimeString(timeCardEntry[index].MealOut, true));
        mealInTextBox.val(GetInvariantTimeString(timeCardEntry[index].MealIn, true));
        timeOutTextBox.val(GetInvariantTimeString(timeCardEntry[index].TimeOut, true));

        dateTextBox.val(GetInvariantDateString(timeCardEntry[index].DateWorked));
        SetSelectedDateForLink('DateTextBox', 'DateLink');

        TimeCardEntry_UpdateHours();
    }

    ShowCreate();
}

function ShowEntries() {
    if (!isEntryVisible) {
        timeCardEntryPage.scrollTop(0);
        isEntryVisible = true;
        entryDiv.show();
        editDiv.hide();
        //entryDiv.show('slide', { direction: 'left' }, 500);
        //editDiv.hide('slide', { direction: 'right' }, 500);
    }
}

function ShowCreate() {
    if (isEntryVisible) {
        timeCardEntryPage.scrollTop(0);
        isEntryVisible = false;
        entryDiv.hide();
        editDiv.show();
        //entryDiv.hide('slide', { direction: 'left' }, 500);
        //editDiv.show('slide', { direction: 'right' }, 500);
    }
}

function ResetButtonClick() {
    if (isCreateMode) {
        CreateTimeCardEntry();
    }
    else {
        var index = indexHidden.val();
        if (!IsStringNullOrEmpty(index)) {
            index = Number(index);
            EditTimeCardEntry(index);
        }
    }
}

function SaveTimeCardEntry() {
    var validationMessage = emptyString;
    var validationSuccess = true;

    if (IsStringNullOrEmpty(dateTextBox.val())) {
        var dateString = GetTranslatedValue("DateLabel");
        validationMessage += "- " + dateString + " " + requiredFieldTranslation + " " + dateString + ".";
        validationSuccess = false;
    }
    else if (!ValidateInvariantDateString(dateTextBox.val())) {
        var dateString = GetTranslatedValue("DateLabel");
        validationMessage += "- " + invalidDate1Translation + " " + dateString + " " + invalidDate2Translation + " " + MinYear + " " + invalidDate3Translation + " " + MaxYear + ".";
        validationSuccess = false;
    }

    var timeInNullEmpty = IsStringNullOrEmpty(timeInTextBox.val());
    var mealOutNullEmpty = IsStringNullOrEmpty(mealOutTextBox.val());
    var mealInNullEmpty = IsStringNullOrEmpty(mealInTextBox.val());
    var timeOutNullEmpty = IsStringNullOrEmpty(timeOutTextBox.val());

    var timeInDate = null;
    var mealOutDate = null;
    var mealInDate = null;
    var timeOutDate = null;

    var validateMeal = true;

    if (!mealOutNullEmpty && !mealInNullEmpty) {
        mealOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealOutTextBox.val());
        mealInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealInTextBox.val());
        var defaultDateObj = GetDateObjectFromInvariantDateString(defaultDate + " " + defaultTime);

        if (mealOutDate.valueOf() == defaultDateObj.valueOf() && mealInDate.valueOf() == defaultDateObj.valueOf()) {
            validateMeal = false;
        } else if (mealOutDate.valueOf() == mealInDate.valueOf()) {
            validateMeal = false;
        }
    }

    if (timeInNullEmpty) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeInTranslation + " " + requiredFieldTranslation + " " + timeInTranslation + ".";
        validationSuccess = false;
    }
    else {
        timeInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + timeInTextBox.val());
    }

    if (validateMeal) {
        if (!timeInNullEmpty && !mealOutNullEmpty) {
            mealOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealOutTextBox.val());

            if (mealOutDate.valueOf() < timeInDate.valueOf()) {
                if (!IsStringNullOrEmpty(validationMessage)) {
                    validationMessage += "<br/>";
                }

                validationMessage += "- " + GetTranslatedValue("MealOutLabel") + laterThanTranslation + GetTranslatedValue("TimeInLabel") + "."; //"- meal out must be later than time in.";
                validationSuccess = false;
            }
        }
        else if (timeInNullEmpty && !mealOutNullEmpty) {
            mealOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealOutTextBox.val());

            validationMessage += "- " + GetTranslatedValue("MealOutLabel") + laterThanTranslation + GetTranslatedValue("TimeInLabel") + "."; //"- meal out must be later than time in.";
            validationSuccess = false;
        }
        else if (!mealOutNullEmpty) {
            mealOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealOutTextBox.val());
        }
    }

    if (validateMeal) {
        if (!mealOutNullEmpty && !mealInNullEmpty) {
            mealInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealInTextBox.val());

            if (mealInDate.valueOf() < mealOutDate.valueOf()) {
                if (!IsStringNullOrEmpty(validationMessage)) {
                    validationMessage += "<br/>";
                }

                validationMessage += "- " + GetTranslatedValue("MealInLabel") + laterThanTranslation + GetTranslatedValue("MealOutLabel") + "."; //"- meal in must be later than meal out.";
                validationSuccess = false;
            }
        }
        else if (mealOutNullEmpty && !mealInNullEmpty) {
            mealInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealInTextBox.val());

            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("MealInLabel") + laterThanTranslation + GetTranslatedValue("MealOutLabel") + "."; //"- meal in must be later than meal out.";
            validationSuccess = false;
        }
        else if (!mealOutNullEmpty && mealInNullEmpty) {
            mealInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + mealInTextBox.val());

            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("MealInLabel") + laterThanTranslation + GetTranslatedValue("MealOutLabel") + "."; //"- meal in must be later than meal out.";
            validationSuccess = false;
        }
    }

    if (timeOutNullEmpty) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeOutTranslation + " " + requiredFieldTranslation + " " + timeOutTranslation + ".";
        validationSuccess = false;
    }
    else if (validateMeal && !mealInNullEmpty && !timeOutNullEmpty) {
        timeOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + timeOutTextBox.val());

        if (timeOutDate.valueOf() < mealInDate.valueOf()) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("TimeOutLabel") + laterThanTranslation + GetTranslatedValue("MealInLabel") + "."; //"- time out must be later than meal in.";
            validationSuccess = false;
        }
    }
    else if (!timeInNullEmpty && !timeOutNullEmpty) {
        timeOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + timeOutTextBox.val());

        if (timeOutDate.valueOf() < timeInDate.valueOf()) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("TimeOutLabel") + laterThanTranslation + GetTranslatedValue("TimeInLabel") + "."; //"- time out must be later than time in.";
            validationSuccess = false;
        }
    }

    var hours = TimeCardEntry_CalculateHours();

    if (validationSuccess) {
        if (isNaN(hours)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + invalidHoursTranslation;
            validationSuccess = false;
        }
    }

    if (validationSuccess) {
        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "Optionstring": isCreateMode ? "I" : "U",
            "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
            "SundayDate": getLocal("TimeCard_SundayDate"),
            "DateWorked": (IsStringNullOrEmpty(dateTextBox.val()) ? defaultDate : dateTextBox.val()),
            "TimeIn": defaultDate + " " + (IsStringNullOrEmpty(timeInTextBox.val()) ? defaultTime : timeInTextBox.val()),
            "MealOut": defaultDate + " " + (IsStringNullOrEmpty(mealOutTextBox.val()) ? defaultTime : mealOutTextBox.val()),
            "MealIn": defaultDate + " " + (IsStringNullOrEmpty(mealInTextBox.val()) ? defaultTime : mealInTextBox.val()),
            "TimeOut": defaultDate + " " + (IsStringNullOrEmpty(timeOutTextBox.val()) ? defaultTime : timeOutTextBox.val()),
            "TimeCardDetailNumber": timeCardDetailNumberHidden.val(),
            "Hours": hours,
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        ModifyTimeCardEntry(myJSONobject);
    }
    else {
        showError(validationMessage);
    }
}

function TimeCardEntry_CalculateHours() {
    var timeInNullEmpty = IsStringNullOrEmpty(timeInTextBox.val());
    var mealOutNullEmpty = IsStringNullOrEmpty(mealOutTextBox.val());
    var mealInNullEmpty = IsStringNullOrEmpty(mealInTextBox.val());
    var timeOutNullEmpty = IsStringNullOrEmpty(timeOutTextBox.val());

    if (!timeInNullEmpty && !timeOutNullEmpty) {
        if ((!mealOutNullEmpty && mealInNullEmpty) || (mealOutNullEmpty && !mealInNullEmpty)) {
            return NaN;
        }

        var timeInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + (IsStringNullOrEmpty(timeInTextBox.val()) ? defaultTime : timeInTextBox.val()));
        var mealOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + (IsStringNullOrEmpty(mealOutTextBox.val()) ? defaultTime : mealOutTextBox.val()));
        var mealInDate = GetDateObjectFromInvariantDateString(defaultDate + " " + (IsStringNullOrEmpty(mealInTextBox.val()) ? defaultTime : mealInTextBox.val()));
        var timeOutDate = GetDateObjectFromInvariantDateString(defaultDate + " " + (IsStringNullOrEmpty(timeOutTextBox.val()) ? defaultTime : timeOutTextBox.val()));

        var totalHours = ((timeOutDate - timeInDate) - (mealInDate - mealOutDate)) / 36e5; // 36e5 is scientific notation for (1000 * 60 * 60).
        return GetDecimal(totalHours, 2, false);
    }

    return NaN;
}

function TimeCardEntry_UpdateHours() {
    var hours = TimeCardEntry_CalculateHours();
    calculatedHoursValueLabel.text(emptyString);

    if (!isNaN(hours)) {
        calculatedHoursValueLabel.text(hours);
    }
}

function DeleteConfirmation(index) {
    deleteIndex = index;
    showConfirmation(GetTranslatedValue("DeleteValue"), GetTranslatedValue("YesValue"), GetTranslatedValue("NoValue"), DeleteTimeCardEntry);
}

function DeleteTimeCardEntry(value) {
    if (value) {
        if (deleteIndex >= 0 && deleteIndex < timeCardEntry.length) {
            var myJSONobject = {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "Optionstring": "D",
                "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
                "SundayDate": getLocal("TimeCard_SundayDate"),
                "TimeCardDetailNumber": timeCardEntry[deleteIndex].TimeCardDetailNumber,
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "SessionID": decryptStr(getLocal("SessionID")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
            };

            ModifyTimeCardEntry(myJSONobject);
        }
    }

    deleteIndex = null;
}

function ModifyTimeCardEntry(myJSONobject) {
    var accessURL = standardAddress + "TimeCard.ashx?Method=SetTimeCardData";

    if (navigator.onLine) {
        showActionPopupLoading();
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    if (data.Status) {
                        GetTimeCardEntries(true);
                        //ShowEntries();
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
                    showError(data.Message);
                }, 650);
            }
        });
    }
    else {
        closeActionPopupLoading();

        setTimeout(function () {
            showError(noNetworkTranslation);
        }, 650);
    }
}

function TimeCardEntry_NavigatePrevious() {
    if (navigator.onLine) {
        $.mobile.changePage("TimeCardSummary.html");
    }
    else {
        showError(noNetworkTranslation);
    }
}

function AddNA(index) {
    if (navigator.onLine) {
        if (index >= 0 && index < timeCardEntry.length) {
            setLocal("TimeCard_TimeCardDetailNumber", timeCardEntry[index].TimeCardDetailNumber)
            setLocal("TimeCard_NonAppliedSource", "TimeCardEntry");
            $.mobile.changePage("TimeCardNA.html");
        }
    }
    else {
        showError(noNetworkTranslation);
    }
}

function AddWO(index) {
    if (navigator.onLine) {
        if (index >= 0 && index < timeCardEntry.length) {
            setLocal("TimeCard_TimeCardDetailNumber", timeCardEntry[index].TimeCardDetailNumber)
            setLocal("TimeCard_WorkOrderSource", "TimeCardEntry");
            $.mobile.changePage("TimeCardWO.html");
        }
    }
    else {
        showError(noNetworkTranslation);
    }
}

function Labor_Edit(index) {
    setLocal("LaborData", JSON.stringify(timeCardEntry));
    setLocal("LaborDataIndex", index);

    if (!IsStringNullOrEmpty(timeCardEntry[index].WorkOrderNumber)) {
        setLocal("TimeCard_WorkOrderSource", "DailyViewEntryEdit");
        setLocal("WorkOrderNumber", timeCardEntry[index].WorkOrderNumber);
        setLocal("TimeCard_WorkOrder", GetCommonTranslatedValue("WorkOrderNumLabel") + ' ' + getLocal("WorkOrderNumber"));
        $.mobile.changePage("TimeCardWO.html");
    } else {
        setLocal("TimeCard_NonAppliedSource", "DailyViewEntry");
        $.mobile.changePage("TimeCardNA.html");
    }
}