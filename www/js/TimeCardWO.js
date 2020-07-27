function TimeCardWOPageSecurity(SgstCollection) {
    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PostWOButton", "CanAccess")) {
        $('#TimeCardWO_PostWOButton').show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PostWOButton", "ReadOnly")) {
            $('#TimeCardWO_PostWOButton').addClass('ui-disabled');
            timeCardWO_PostWOButtonEnabled = false;
        }
        else {
            $('#TimeCardWO_PostWOButton').removeClass('ui-disabled');
            timeCardWO_PostWOButtonEnabled = true;
        } // end of else
    }
    else {
        $('#TimeCardWO_PostWOButton').hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WOEntryCollapsibleSet", "CanAccess")) {
        $('#TimeCardWO_EntryCollapsible').show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WOEntryCollapsibleSet", "ReadOnly")) {
            $('#TimeCardWO_EntryCollapsible').addClass('ui-disabled');
        }
        else {
            $('#TimeCardWO_EntryCollapsible').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $('#TimeCardWO_EntryCollapsible').hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WorkOrderNumberSearchTextBox", "CanAccess")) {
        $('#TimeCardWO_WOSearchDiv').show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WorkOrderNumberSearchTextBox", "ReadOnly")) {
            $('#TimeCardWO_WorkOrderNumberSearchTextBox').addClass('ui-disabled');
            timeCardWO_WorkOrderNumberDropDown.addClass('ui-disabled');
            timeCardWO_WorkOrderNumberDropDown.prop("disabled", true);
        }
        else {
            $('#TimeCardWO_WorkOrderNumberSearchTextBox').removeClass('ui-disabled');
            timeCardWO_WorkOrderNumberDropDown.removeClass('ui-disabled');
            timeCardWO_WorkOrderNumberDropDown.prop("disabled", false);
        } // end of else
    }
    else {
        $('#TimeCardWO_WOSearchDiv').hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "CanAccess")) {
        $('#TimeCardWO_SaveButton').show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "ReadOnly")) {
            $('#TimeCardWO_SaveButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardWO_SaveButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $('#TimeCardWO_SaveButton').hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "CanAccess")) {
        $('#TimeCardWO_ResetButton').show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "ReadOnly")) {
            $('#TimeCardWO_ResetButton').addClass('ui-disabled');
        }
        else {
            $('#TimeCardWO_ResetButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $('#TimeCardWO_ResetButton').hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "CanAccess")) {
        timeCardWO_DeleteButtonVisible = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeleteButton", "ReadOnly")) {
            timeCardWO_DeleteButtonEnabled = false;
        }
        else {
            timeCardWO_DeleteButtonEnabled = true;
        } // end of else
    }
    else {
        timeCardWO_DeleteButtonVisible = false;
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ArrivalTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.ArrivalTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.ArrivalTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ArrivalTextBox", "Required")) {
            timeCardWO_FieldsSecurity.ArrivalTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.ArrivalTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DepartureTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.DepartureTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.DepartureTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DepartureTextBox", "Required")) {
            timeCardWO_FieldsSecurity.DepartureTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.DepartureTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CompletedToggle", "ReadOnly")) {
        timeCardWO_FieldsSecurity.CompletedToggleEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.CompletedToggleEnabled = true;
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CompletedCommentTextArea", "ReadOnly")) {
        timeCardWO_FieldsSecurity.CompletedCommentTextAreaEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.CompletedCommentTextAreaEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CompletedCommentTextArea", "Required")) {
            timeCardWO_FieldsSecurity.CompletedCommentTextAreaRequired = true;
        } else {
            timeCardWO_FieldsSecurity.CompletedCommentTextAreaRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "MilesTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.MilesTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.MilesTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "MilesTextBox", "Required")) {
            timeCardWO_FieldsSecurity.MilesTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.MilesTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "RegularHoursTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.RegularHoursTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.RegularHoursTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "RegularHoursTextBox", "Required")) {
            timeCardWO_FieldsSecurity.RegularHoursTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.RegularHoursTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "RegularDriveTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.RegularDriveTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.RegularDriveTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "RegularDriveTextBox", "Required")) {
            timeCardWO_FieldsSecurity.RegularDriveTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.RegularDriveTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SpecialHoursTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.SpecialHoursTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.SpecialHoursTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SpecialHoursTextBox", "Required")) {
            timeCardWO_FieldsSecurity.SpecialHoursTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.SpecialHoursTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SpecialDriveTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.SpecialDriveTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.SpecialDriveTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SpecialDriveTextBox", "Required")) {
            timeCardWO_FieldsSecurity.SpecialDriveTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.SpecialDriveTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OverTimeHoursTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.OverTimeHoursTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.OverTimeHoursTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OverTimeHoursTextBox", "Required")) {
            timeCardWO_FieldsSecurity.OverTimeHoursTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.OverTimeHoursTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OverTimeDriveTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.OverTimeDriveTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.OverTimeDriveTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OverTimeDriveTextBox", "Required")) {
            timeCardWO_FieldsSecurity.OverTimeDriveTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.OverTimeDriveTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PremiumHoursTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.PremiumHoursTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.PremiumHoursTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PremiumHoursTextBox", "Required")) {
            timeCardWO_FieldsSecurity.PremiumHoursTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.PremiumHoursTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PremiumDriveTextBox", "ReadOnly")) {
        timeCardWO_FieldsSecurity.PremiumDriveTextBoxEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.PremiumDriveTextBoxEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PremiumDriveTextBox", "Required")) {
            timeCardWO_FieldsSecurity.PremiumDriveTextBoxRequired = true;
        } else {
            timeCardWO_FieldsSecurity.PremiumDriveTextBoxRequired = false;
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResolutionCodeDropDown", "ReadOnly")) {
        timeCardWO_FieldsSecurity.ResolutionCodeDropDownEnabled = false;
    }
    else {
        timeCardWO_FieldsSecurity.ResolutionCodeDropDownEnabled = true;
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResolutionCodeDropDown", "Required")) {
            timeCardWO_FieldsSecurity.ResolutionCodeDropDownRequired = true;
        } else {
            timeCardWO_FieldsSecurity.ResolutionCodeDropDownRequired = false;
        }
    }

    LoadTranslation(timeCardWO_PageID, TimeCardWO_TranslationLoadComplete);
}

function TimeCardWO_TranslationLoadComplete() {
    // timeCardWO_UserNameDropDown.children("option:eq(0)").text('test').val(defaultDropDownValue);

    timeCardWO_NoEntryTranslation = GetTranslatedValue("NoWorkOrderEntryValue");
    timeCardWO_AddHeaderTranslation = GetTranslatedValue("AddWorkOrderEntryValue");
    timeCardWO_EditHeaderTranslation = GetTranslatedValue("EditWorkOrderEntryValue");
    timeCardWO_PriorityTranslation = GetTranslatedValue("PriorityValue");
    timeCardWO_DetailNumberTranslation = GetTranslatedValue("DetailValue");
    timeCardWO_BillableTranslation = GetTranslatedValue("BillableValue");
    timeCardWO_StatusTranslation = GetTranslatedValue("StatusValue");
    timeCardWO_ProblemDescriptionTranslation = GetTranslatedValue("ProblemDescriptionValue");
    timeCardWO_ResolutionCodeTranslation = GetTranslatedValue("ResolutionCodeValue");
    timeCardWO_ArrivalTranslation = GetTranslatedValue("ArrivalValue");
    timeCardWO_DepartureTranslation = GetTranslatedValue("DepartureValue");
    timeCardWO_MilesTranslation = GetTranslatedValue("MilesValue");
    timeCardWO_HoursTableHeaderTranslation = GetTranslatedValue("HoursValue");
    timeCardWO_DriveTableHeaderTranslation = GetTranslatedValue("DriveValue");
    timeCardWO_RegularTranslation = GetTranslatedValue("RegularValue");
    timeCardWO_OverTimeTranslation = GetTranslatedValue("OverTimeValue");
    timeCardWO_PremiumTranslation = GetTranslatedValue("PremiumValue");
    timeCardWO_SpecialTranslation = GetTranslatedValue("SpecialValue");
    timeCardWO_CompletedTranslation = GetTranslatedValue("CompletedValue");
    timeCardWO_CommentsTranslation = GetTranslatedValue("CommentsValue");
    timeCardWO_ActionFailedTranslation = GetTranslatedValue("ActionfailedValue");
    timeCardWO_NotApplicableTranslation = GetTranslatedValue("NAValue");
    timeCardWO_DropDownSelectTranslation = GetTranslatedValue("Select");

    timeCardWO_RequiredTextBoxValidation = GetTranslatedValue("RequiredTextBoxValidation");
    timeCardWO_RequiredDropDownValidation = GetTranslatedValue("RequiredDropDownValidation");
    timeCardWO_InvalidDate1Translation = GetTranslatedValue("InvalidDate1");
    timeCardWO_InvalidDate2Translation = GetTranslatedValue("InvalidDate2");
    timeCardWO_InvalidDate3Translation = GetTranslatedValue("InvalidDate3");
    timeCardWO_InvalidWeekTranslation = GetTranslatedValue("InvalidWeek");
    timeCardWO_MustNumberTranslation = GetTranslatedValue("MustNumber");
    timeCardWO_DateGreaterTranslation = GetTranslatedValue("DateGreater");
    timeCardWO_NumberRange1Translation = GetTranslatedValue("NumberRange1");
    timeCardWO_NumberRange2Translation = GetTranslatedValue("NumberRange2");
    timeCardWO_NumberRange2Translation = timeCardWO_NumberRange2Translation.replace("[MIN]", timeCardWO_NumMin).replace("[MAX]", timeCardWO_NumMax);
    timeCardWO_TimeCardOverlapTranslation = GetTranslatedValue("TimeCardOverlap").replace("[ARRIVAL]", GetTranslatedValue("ArrivalValue")).replace("[DEPARTURE]", GetTranslatedValue("DepartureValue"));
    timeCardWO_NoNetworkTranslation = GetTranslatedValue("NoNetwork");
    timeCardWO_CompletionMonthWarningTranslation = GetTranslatedValue("CompletionMonthWarning");
    timeCardWO_CompletionMonthPreventionTranslation = GetTranslatedValue("CompletionMonthPrevention");
    timeCardWO_JobStepsPendingTranslation = GetTranslatedValue("JobStepsPendingMessage");
    timeCardWO_InspectionPendingTranslation = GetTranslatedValue("PMInspectionPendingMessage");
    timeCardWO_YesTranslation = GetTranslatedValue("YesValue");
    timeCardWO_NoTranslation = GetTranslatedValue("NoValue");

    timeCardWO_WorkOrderNumberSearchTextBox.prop("placeholder", GetTranslatedValue("TimeCardWO_WorkOrderNumberLabel"));

    timeCardWO_WorkOrderNumberDropDown.children("option:eq(0)").text(timeCardWO_DropDownSelectTranslation).val(defaultDropDownValue);
    timeCardWO_WorkOrderNumberDropDown.selectmenu("refresh", true);

    timeCardWO_Page.find("#TimeCardWO_SubHeaderLabel").text(getLocal("TimeCard_WeekRange"));
    timeCardWO_UserNameDropDown.children("option:eq(0)").text(GetTranslatedValue("timeCardWO_UserNameSelect")).val(defaultDropDownValue);

    TimeCardWO_GetTimeCardWOFields();

    if (timeCardWO_IsSourceWO) {
        $('#TimeCardWO_WOSearchDiv').hide();
        timeCardWO_Page.find("#TimeCardWO_SubHeaderLabel").text(getLocal("TimeCard_WorkOrder"));
        //TimeCardWO_LoadWODetailsForActionsPopup();
    }

    if (timeCardWO_IsSourceWO && getLocal("TimeCard_WorkOrderSource") === "ActionsPopup") {
        $("#TimeCardWO").find("#TimeCardWO_UserNameDiv").show()
    }
    else {
        $("#TimeCardWO").find("#TimeCardWO_UserNameDiv").hide()
    }
}

function TimeCardWO_GetTimeCardWOFields() {
    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetTimeCardWOFields";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    timeCardWO_Fields = data;
                    BuildEditFields();

                    if (!timeCardWO_IsCreateMode) {
                        BuildEntryTemplate();
                        TimeCardWO_GetEntries(false);
                    }
                    else {
                        TimeCardWO_Create();
                        closeActionPopupLoading();
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
            showError(timeCardWO_NoNetworkTranslation);
        }, 650);
    }
}

function TimeCardWO_GetResolutionCode(workOrderNumber, workOrderDetailNumber, problemDescription, selectedValue) {
    timeCardWO_ResCodeDropDown.children("option:not(:first)").remove();
    timeCardWO_ResCodeDropDown.val(defaultDropDownValue).selectmenu("refresh");

    if (!IsStringNullOrEmpty(workOrderNumber) && !IsStringNullOrEmpty(workOrderDetailNumber) && !IsStringNullOrEmpty(problemDescription)) {
        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
            "WorkOrderNumber": workOrderNumber,
            "WorkOrderDetailNumber": workOrderDetailNumber,
            "ProblemDescription": problemDescription,
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        var accessURL = standardAddress + "TimeCard.ashx?Method=GetResolutionCode";

        if (navigator.onLine) {
            $.postJSON(accessURL, myJSONobject, function (data) {
                if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                    if (data != null && data != "null") {
                        for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                            var option = document.createElement("option");
                            option.setAttribute("value", data[arrayCount].ResolutionCodeNumber);
                            option.innerHTML = data[arrayCount].ResolutionDescription;
                            timeCardWO_ResCodeDropDown.append(option);
                        }

                        if (selectedValue != null) {
                            timeCardWO_ResCodeDropDown.val(selectedValue).selectmenu("refresh");
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
                showError(timeCardWO_NoNetworkTranslation);
            }, 650);
        }
    }
}

function TimeCardWO_GetEntries(navigateEntry) {
    showActionPopupLoading();

    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
        "SundayDate": getLocal("TimeCard_SundayDate"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetWorkOrderEntries";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    var htmlContent = "";
                    var postWOEnableFlag = false;

                    if (data.length == 0) {
                        timeCardWO_PostWOButton.hide();
                        htmlContent +=
                                '<p><strong><label>' + timeCardWO_NoEntryTranslation + '</label></strong></p>';
                    }
                    else {
                        timeCardWO_EntryCollapsible.empty();

                        for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                            data[arrayCount].Arrival = GetDateObjectFromInvariantDateString(data[arrayCount].ArrivalString);
                            data[arrayCount].Departure = GetDateObjectFromInvariantDateString(data[arrayCount].DepartureString);

                            if (!IsStringNullOrEmpty(data[arrayCount].Status)) {
                                if (data[arrayCount].OrderComplete == true && data[arrayCount].Status.toUpperCase() != "CMP") {
                                    postWOEnableFlag = true;
                                }
                            }

                            isHeader = false;

                            if (arrayCount == 0) {
                                isHeader = true;
                            }
                            else if (data[arrayCount - 1].WorkOrderNumber != data[arrayCount].WorkOrderNumber) {
                                htmlContent += "</div>";
                                isHeader = true;
                            }

                            if (isHeader) {
                                htmlContent += TimeCardWO_GetCollapsibleHeaderHtml(data[arrayCount]) + TimeCardWO_GetCollapsibleChildrenHtml(data[arrayCount], arrayCount);
                            }
                            else {
                                htmlContent += '<hr />' + TimeCardWO_GetCollapsibleChildrenHtml(data[arrayCount], arrayCount);
                            }
                        }

                        timeCardWO_Entry = data;

                        htmlContent += "</div>";
                    }

                    if (postWOEnableFlag) {
                        if (timeCardWO_PostWOButtonEnabled) {
                            timeCardWO_PostWOButton.removeClass("ui-disabled");
                        }
                    }
                    else {
                        timeCardWO_PostWOButton.addClass("ui-disabled");
                    }

                    timeCardWO_EntryCollapsible.html(htmlContent).trigger("create");
                }

                closeActionPopupLoading();

                if (navigateEntry) {
                    TimeCardWO_ShowEntries();
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
            showError(timeCardWO_NoNetworkTranslation);
        }, 650);
    }
}

function TimeCardWO_GetCollapsibleHeaderHtml(timeCardWO_SingleEntry) {
    var htmlContent = "";

    if (!IsObjectNullOrUndefined(timeCardWO_SingleEntry)) {
        htmlContent +=
                    '<div id="TimeCardWO_EntryCollapsible" data-role="collapsible" class="collapsibleBackground" data-inset="true">' +
                    '<h4><strong class="boldfont">' + timeCardWO_SingleEntry.WorkOrderNumber + '</strong></h4>';
    }

    return htmlContent;
}

function BuildEntryTemplate() {
    var priorityEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_PriorityTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[PRIORITY]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var detailNumberEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_DetailNumberTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[DETAILNUMBER]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var billableEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_BillableTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<select disabled="disabled" data-role="slider">' +
                            '<option value="0">' + timeCardWO_NoTranslation + '</option>' +
                            '<option [BILLABLE] value="1">' + timeCardWO_YesTranslation + '</option>' +
                        '</select>' +
                    '</td>' +
                '</tr>';

    var statusEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_StatusTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[STATUS]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var problemDescriptionEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_ProblemDescriptionTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[PROBLEMDESCRIPTION]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var resolutionCodeEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_ResolutionCodeTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[RESOLUTIONCODE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var arrivalEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_ArrivalTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[ARRIVAL]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var departureEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_DepartureTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[DEPARTURE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var milesEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_MilesTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                            '[MILES]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var completedEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_CompletedTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<select disabled="true" data-role="slider">' +
                            '<option value="0">' + timeCardWO_NoTranslation + '</option>' +
                            '<option [COMPLETED] value="1">' + timeCardWO_YesTranslation + '</option>' +
                        '</select>' +
                    '</td>' +
                '</tr>';

    var commentsEntryRow =
                '<tr>' +
                    '<td class="LabelTD">' +
                        '<label>' +
                            timeCardWO_CommentsTranslation + ' : ' +
                        '</label>' +
                    '</td>' +
                    '<td class="ValueTD">' +
                        '<label>' +
                                '[COMPLETEDCOMMENTS]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var hoursDriveRow =
                '<tr>' +
                    '<td colspan="2">' +
                        '<table class="innerTable" border="1">' +
                            '<tr>' +
                                '<th style="width:33%;">' +
                                '</th>' +
                                '<th style="width:33%; display: [HOURSCOLUMNVISIBLE];">' +
                                    '<label>' +
                                        timeCardWO_HoursTableHeaderTranslation +
                                    '</label>' +
                                '</th>' +
                                '<th style="width:33%; display: [DRIVECOLUMNVISIBLE];">' +
                                    '<label>' +
                                        timeCardWO_DriveTableHeaderTranslation +
                                    '</label>' +
                                '</th>' +
                            '</tr>' +
                            '[ROWPLACEHOLDER]' +
                            '[ROWPLACEHOLDER]' +
                            '[ROWPLACEHOLDER]' +
                            '[ROWPLACEHOLDER]' +
                        '</table>' +
                    '</td>' +
                '</tr>';

    var regularHoursDriveRow =
                '<tr>' +
                    '<th>' +
                        '<label>' +
                            timeCardWO_RegularTranslation +
                        '</label>' +
                    '</th>' +
                    '<td style="display: [HOURSCOLUMNVISIBLE];">' +
                        '<label>' +
                            '[REGULARHOURS]' +
                        '</label>' +
                    '</td>' +
                    '<td style="display: [DRIVECOLUMNVISIBLE];">' +
                        '<label>' +
                            '[REGULARDRIVE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var overTimeHoursDriveRow =
                '<tr>' +
                    '<th>' +
                        '<label>' +
                            timeCardWO_OverTimeTranslation +
                        '</label>' +
                    '</th>' +
                    '<td style="display: [HOURSCOLUMNVISIBLE];">' +
                        '<label>' +
                            '[OVERTIMEHOURS]' +
                        '</label>' +
                    '</td>' +
                    '<td style="display: [DRIVECOLUMNVISIBLE];">' +
                        '<label>' +
                            '[OVERTIMEDRIVE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var premiumHoursDriveRow =
                '<tr>' +
                    '<th>' +
                        '<label>' +
                            timeCardWO_PremiumTranslation +
                        '</label>' +
                    '</th>' +
                    '<td style="display: [HOURSCOLUMNVISIBLE];">' +
                        '<label>' +
                            '[PREMIUMHOURS]' +
                        '</label>' +
                    '</td>' +
                    '<td style="display: [DRIVECOLUMNVISIBLE];">' +
                        '<label>' +
                            '[PREMIUMDRIVE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    var specialHoursDriveRow =
                '<tr>' +
                    '<th>' +
                        '<label>' +
                            timeCardWO_SpecialTranslation +
                        '</label>' +
                    '</th>' +
                    '<td style="display: [HOURSCOLUMNVISIBLE];">' +
                        '<label>' +
                            '[SPECIALHOURS]' +
                        '</label>' +
                    '</td>' +
                    '<td style="display: [DRIVECOLUMNVISIBLE];">' +
                        '<label>' +
                            '[SPECIALDRIVE]' +
                        '</label>' +
                    '</td>' +
                '</tr>';

    timeCardWO_EntryTemplate =
                    '<img id ="TimeCardWO_DeleteButton" class="img-delete-onpress' + (timeCardWO_DeleteButtonEnabled ? emptyString : ' ui-disabled') + '" style="float:right;' + (timeCardWO_DeleteButtonVisible ? emptyString : ' display: none;') + '" data-inline="true" onclick="TimeCardWO_DeleteConfirmation(' + '[INDEX]' + ');" />' +
                    '<table class="customTable" onclick="TimeCardWO_Edit(' + '[INDEX]' + ')">' +
                        '<tbody>';

    var isPreviousHoursDrive = false;
    var isRegularHoursDriveAppended = false;
    var isPremiumHoursDriveAppended = false;
    var isOverTimeHoursDriveAppended = false;
    var isSpecialHoursDriveAppended = false;
    var atLeastOneHour = false;
    var atLeastOneDrive = false;

    for (var index = 0; index < timeCardWO_Fields.length; index++) {
        if (timeCardWO_Fields[index].ColumnVisible == "1") {
            switch (timeCardWO_Fields[index].ColumnName.toUpperCase()) {
                case "PRIORITY":
                    timeCardWO_EntryTemplate += priorityEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "STATUS":
                    timeCardWO_EntryTemplate += statusEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "WORKORDERDETAILNUMBER":
                    timeCardWO_EntryTemplate += detailNumberEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "PROBLEMDESCRIPTION":
                    timeCardWO_EntryTemplate += problemDescriptionEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "BILLABLE":
                    timeCardWO_EntryTemplate += billableEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "RESOLUTIONCODE":
                    timeCardWO_EntryTemplate += resolutionCodeEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "ARRIVAL":
                    timeCardWO_EntryTemplate += arrivalEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "DEPARTURE":
                    timeCardWO_EntryTemplate += departureEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "MILES":
                    timeCardWO_EntryTemplate += milesEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "COMPLETED":
                    timeCardWO_EntryTemplate += completedEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "COMPLETEDCOMMENT":
                    timeCardWO_EntryTemplate += commentsEntryRow;
                    isPreviousHoursDrive = false;
                    break;

                case "REGULARDRIVE":
                    if (!isRegularHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', regularHoursDriveRow);
                    }

                    atLeastOneDrive = true;
                    isRegularHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "REGULARHOURS":
                    if (!isRegularHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', regularHoursDriveRow);
                    }

                    atLeastOneHour = true;
                    isRegularHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "PREMIUMDRIVE":
                    if (!isPremiumHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', premiumHoursDriveRow);
                    }

                    atLeastOneDrive = true;
                    isPremiumHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "PREMIUMHOURS":
                    if (!isPremiumHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', premiumHoursDriveRow);
                    }

                    atLeastOneHour = true;
                    isPremiumHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "OVERTIMEDRIVE":
                    if (!isOverTimeHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', overTimeHoursDriveRow);
                    }

                    atLeastOneDrive = true;
                    isOverTimeHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "OVERTIMEHOURS":
                    if (!isOverTimeHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', overTimeHoursDriveRow);
                    }

                    atLeastOneHour = true;
                    isOverTimeHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "SPECIALDRIVE":
                    if (!isSpecialHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', specialHoursDriveRow);
                    }

                    atLeastOneDrive = true;
                    isSpecialHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;

                case "SPECIALHOURS":
                    if (!isSpecialHoursDriveAppended) {
                        if (!isPreviousHoursDrive) {
                            timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);
                            timeCardWO_EntryTemplate += hoursDriveRow;
                        }

                        timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[ROWPLACEHOLDER]', specialHoursDriveRow);
                    }

                    atLeastOneHour = true;
                    isSpecialHoursDriveAppended = true;
                    isPreviousHoursDrive = true;
                    break;
            }
        }
    }

    for (var index = 0; index < timeCardWO_Fields.length; index++) {
        if (timeCardWO_Fields[index].ColumnVisible == "0") {
            switch (timeCardWO_Fields[index].ColumnName.toUpperCase()) {
                case "REGULARDRIVE":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[REGULARDRIVE]', timeCardWO_NotApplicableTranslation);
                    break;

                case "REGULARHOURS":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[REGULARHOURS]', timeCardWO_NotApplicableTranslation);
                    break;

                case "PREMIUMDRIVE":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[PREMIUMDRIVE]', timeCardWO_NotApplicableTranslation);
                    break;

                case "PREMIUMHOURS":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[PREMIUMHOURS]', timeCardWO_NotApplicableTranslation);
                    break;

                case "OVERTIMEDRIVE":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[OVERTIMEDRIVE]', timeCardWO_NotApplicableTranslation);
                    break;

                case "OVERTIMEHOURS":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[OVERTIMEHOURS]', timeCardWO_NotApplicableTranslation);
                    break;

                case "SPECIALDRIVE":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[SPECIALDRIVE]', timeCardWO_NotApplicableTranslation);
                    break;

                case "SPECIALHOURS":
                    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace('[SPECIALHOURS]', timeCardWO_NotApplicableTranslation);
                    break;
            }
        }
    }

    var hoursColumnVisible = atLeastOneHour ? "inline-grid" : "none";
    var driveColumnVisible = atLeastOneDrive ? "inline-grid" : "none";

    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[HOURSCOLUMNVISIBLE\]/g, hoursColumnVisible);
    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[DRIVECOLUMNVISIBLE\]/g, driveColumnVisible);
    timeCardWO_EntryTemplate = timeCardWO_EntryTemplate.replace(/\[ROWPLACEHOLDER\]/g, emptyString);

    timeCardWO_EntryTemplate +=
                        '</tbody>' +
                    '</table>';    
}

function BuildEditFields() {
    var priorityEditRow =
                '<div style="display: [PRIORITYVISIBLE]">' +
                    '<div>' +
                        '<label id="TimeCardWO_PriorityLabel">' +
                            timeCardWO_PriorityTranslation + ' : ' +
                        '</label>' +
                        '<span style="font-weight:bold">' +
                        '<label id="TimeCardWO_PriorityValueLabel">' +
                        '</label>' +
                    '</span>' +
                    '</div>' +
                '</div> <br />';

    var detailNumberEditRow =
                '<div style="display: [DETAILNUMBERVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_WODetailNumberLabel">' +
                            timeCardWO_DetailNumberTranslation + ' : ' +
                        '</label>' +
                        '<span style="font-weight:bold">' +
                        '<label id="TimeCardWO_WODetailNumberValueLabel">' +
                        '</label>' +
                    '</span>' +
                    '</div>' +
                '</div> <br />';

    var billableEditRow =
                '<div class="ui-grid-a" style="display: [BILLABLEVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_BillableLabel">' +
                            timeCardWO_BillableTranslation + ' : ' +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<select id="TimeCardWO_BillableToggle" disabled="disabled" data-role="slider">' +
                            '<option value="0">' + timeCardWO_NoTranslation + '</option>' +
                            '<option value="1">' + timeCardWO_YesTranslation + '</option>' +
                        '</select>' +
                    '</div>' +
                '</div>';

    var statusEditRow =
                '<div style="display: [STATUSVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_StatusLabel">' +
                            timeCardWO_StatusTranslation + ' : ' +
                        '</label>' +
                        '<span style="font-weight:bold">' +
                        '<label id="TimeCardWO_StatusValueLabel">  ' +

                        '</label>' +
                    '</span>' +
                    '</div>' +
                '</div> <br />';

    var problemDescriptionEditRow =
                '<div style="display: [PROBLEMDESCRIPTIONVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_ProblemDescriptionLabel">' +
                            timeCardWO_ProblemDescriptionTranslation + ' : ' +
                        '</label>' +
                    '</div>' +
                    '<div >' +
                        '<label id="TimeCardWO_ProblemDescriptionValueLabel">' +
                        '</label>' +
                    '</div>' +
                '</div>';

    var resolutionCodeEditRow =
                '<div style="display: [RESOLUTIONCODEVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_ResolutionCodeMandatoryLabel" style="color: Red;display:none">*</label>' +
                        '<label id="TimeCardWO_ResCodeLabel">' +
                            timeCardWO_ResolutionCodeTranslation + ' : ' +
                        '</label>' +
                    '</div>' +
                    '<div >' +
                        '<select id="TimeCardWO_ResCodeDropDown">' +
                            '<option value="-1">' + timeCardWO_DropDownSelectTranslation + '</option>' +
                        '</select>' +
                    '</div>' +
                '</div>';

    var arrivalEditRow =
                '<div style="display: [ARRIVALVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_ArrivalMandatoryLabel" style="color: Red;">*</label>' +
                        '<label id="TimeCardWO_ArrivalLabel">' +
                            timeCardWO_ArrivalTranslation + ' : ' +
                        '</label>' +
                    '</div>' +
                    '<div style="width:100%;">' +
                        '<input id="TimeCardWO_ArrivalTextBox" type="datetime-local" onchange="TimeCardWO_CalculateHours();" />' +
                    '</div>' +
                '</div>';

    var departureEditRow =
                '<div style="display: [DEPARTUREVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_DepartureMandatoryLabel" style="color: Red;">*</label>' +
                        '<label id="TimeCardWO_DepartureLabel">' +
                            timeCardWO_DepartureTranslation + ' : ' +
                        '</label>' +
                    '</div>' +
                    '<div style="width:100%;">' +
                        '<input id="TimeCardWO_DepartureTextBox" type="datetime-local" onchange="TimeCardWO_CalculateHours();" />' +
                    '</div>' +
                '</div>';

    var milesEditRow =
                '<div class="ui-grid-a" style="display: [MILESVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                    '<label id="TimeCardWO_MilesMandatoryLabel" style="color: Red;display:[MILESREQUIRED]">*</label>' +
                        '<label id="TimeCardWO_MilesLabel">' +
                            timeCardWO_MilesTranslation + ' : ' +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2" >' +
                        '<input  id="TimeCardWO_MilesTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var completedEditRow =
                '<div class="ui-grid-a" style="display: [COMPLETEDVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_CompletedLabel">' +
                            timeCardWO_CompletedTranslation + ' : ' +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<select id="TimeCardWO_CompletedToggle" data-role="slider" onchange="TimeCardWO_CompletedToggleChanged();">' +
                            '<option value="0">' + timeCardWO_NoTranslation + '</option>' +
                            '<option value="1">' + timeCardWO_YesTranslation + '</option>' +
                        '</select>' +
                    '</div>' +
                '</div>';

    var commentsEditRow =
                '<div style="display: [COMMENTSVISIBLE]">' +
                    '<div >' +
                        '<label id="TimeCardWO_CompletedCommentMandatoryLabel" style="color: Red; display: none">*</label>' +
                        '<label id="TimeCardWO_CompletedCommentLabel">' +
                            timeCardWO_CommentsTranslation + ' : ' +
                        '</label>' +
                    '</div>' +

                    '<div>' +
                        '<textarea id="TimeCardWO_CompletedCommentTextArea" class="CommentsScrollBar" rows="3" maxlength="2000"></textarea>' +
                    '</div>' +
                '</div>';

    var regularHoursEditRow =
                '<div class="ui-grid-a" style="display: [REGULARHOURSVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_RegularHoursMandatoryLabel" style="color: Red;display:[REGULARHOURSREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("RegularHours") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_RegHrsTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var regularDriveEditRow =
                '<div class="ui-grid-a" style="display: [REGULARDRIVEVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_RegularDriveMandatoryLabel" style="color: Red;display:[REGULARDRIVEREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("RegularDrive") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_RegDrvTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var overTimeDriveEditRow =
                '<div class="ui-grid-a" style="display: [OVERTIMEDRIVEVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_OverTimeDriveMandatoryLabel" style="color: Red;display:[OVERTIMEDRIVEREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("OverTimeDrive") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_OTDrvTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var overTimeHoursEditRow =
                '<div class="ui-grid-a" style="display: [OVERTIMEHOURSVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_OverTimeHoursMandatoryLabel" style="color: Red;display:[OVERTIMEHOURSREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("OverTimeHours") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_OTHrsTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var premiumDriveEditRow =
                '<div class="ui-grid-a" style="display: [PREMIUMDRIVEVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_PremiumDriveMandatoryLabel" style="color: Red;display:[PREMIUMDRIVEREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("PremiumDrive") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_PremDrvTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var premiumHoursEditRow =
                '<div class="ui-grid-a" style="display: [PREMIUMHOURSVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_PremiumHoursMandatoryLabel" style="color: Red;display:[PREMIUMHOURSREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("PremiumHours") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_PremHrsTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var specialDriveEditRow =
                '<div class="ui-grid-a" style="display: [SPECIALDRIVEVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_SpecialDriveMandatoryLabel" style="color: Red;display:[SPECIALDRIVEREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("SpecialDrive") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_SpecDrvTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var specialHoursEditRow =
                '<div class="ui-grid-a" style="display: [SPECIALHOURSVISIBLE]">' +

                    '<div class="ui-block-a2" style="margin-top:3px;padding-top:0.4em">' +
                        '<label id="TimeCardWO_SpecialHoursMandatoryLabel" style="color: Red;display:[SPECIALHOURSREQUIRED]">*</label>' +
                        '<label>' +
                            GetTranslatedValue("SpecialHours") + " : " +
                        '</label>' +
                    '</div>' +

                    '<div class="ui-block-b2">' +
                        '<input id="TimeCardWO_SpecHrsTextBox" type="number" step="any" min="' + timeCardWO_NumMin + '" max="' + timeCardWO_NumMax + '" onblur="FormatDecimalInTextBox(this);" onkeypress="return BlockNonNumbersInTextBox(this, event, true, false);" />' +
                    '</div>' +
                '</div>';

    var woEditTemplate = '<div id="TimeCardWO_WOFieldsTable" class="search-panel">';

    var ulTemplateLabor = '<ul data-role="listview" data-inset="true" class="SearchOrderUl"><li>';
    var ulTemplateReadOnlyDetails = '<ul data-role="listview" data-inset="true" class="SearchOrderUl"><li>';
    var ulTemplateDates = '<ul data-role="listview" data-inset="true" class="SearchOrderUl"><li>';
    var ulTemplateCompletion = '<ul data-role="listview" data-inset="true" class="SearchOrderUl"><li>';
    var closeUlTag = '</li></ul>';
    for (var index = 0; index < timeCardWO_Fields.length; index++) {
        var visible = timeCardWO_Fields[index].ColumnVisible == "1" ? "inline-grid" : "none";

        var required = "none";
        switch (timeCardWO_Fields[index].ColumnName.toUpperCase()) {
            case "PRIORITY":
                ulTemplateReadOnlyDetails += priorityEditRow.replace("[PRIORITYVISIBLE]", visible);
                break;

            case "STATUS":
                ulTemplateReadOnlyDetails += statusEditRow.replace("[STATUSVISIBLE]", visible);
                break;

            case "WORKORDERDETAILNUMBER":
                ulTemplateReadOnlyDetails += detailNumberEditRow.replace("[DETAILNUMBERVISIBLE]", visible);
                break;

            case "PROBLEMDESCRIPTION":
                ulTemplateReadOnlyDetails += problemDescriptionEditRow.replace("[PROBLEMDESCRIPTIONVISIBLE]", visible);
                break;

            case "BILLABLE":
                ulTemplateCompletion += billableEditRow.replace("[BILLABLEVISIBLE]", visible);
                break;

            case "RESOLUTIONCODE":
                if (timeCardWO_FieldsSecurity.ResolutionCodeDropDownRequired) {
                    required = "inline";
                }
                
                ulTemplateCompletion += resolutionCodeEditRow.replace("[RESOLUTIONCODEVISIBLE]", visible).replace("[RESOLUTIONCODEREQUIRED]", required);
                break;

            case "ARRIVAL":
                ulTemplateDates += arrivalEditRow.replace("[ARRIVALVISIBLE]", visible);
                break;

            case "DEPARTURE":
                ulTemplateDates += departureEditRow.replace("[DEPARTUREVISIBLE]", visible);
                break;

            case "MILES":
                if (timeCardWO_FieldsSecurity.MilesTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += milesEditRow.replace("[MILESVISIBLE]", visible).replace("[MILESREQUIRED]", required);
                break;

            case "COMPLETED":
                ulTemplateCompletion += completedEditRow.replace("[COMPLETEDVISIBLE]", visible);
                break;

            case "COMPLETEDCOMMENT":
                if (timeCardWO_FieldsSecurity.CompletedCommentTextAreaRequired) {
                    required = "inline";
                }
                
                ulTemplateCompletion += commentsEditRow.replace("[COMMENTVISIBLE]", visible).replace("[COMMENTSREQUIRED]", required);
                break;

            case "REGULARDRIVE":
                if (timeCardWO_FieldsSecurity.RegularDriveTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += regularDriveEditRow.replace("[REGULARDRIVEVISIBLE]", visible).replace("[REGULARDRIVEREQUIRED]", required);
                break;

            case "REGULARHOURS":
                if (timeCardWO_FieldsSecurity.RegularHoursTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += regularHoursEditRow.replace("[REGULARHOURSVISIBLE]", visible).replace("[REGULARHOURSREQUIRED]", required);
                break;

            case "PREMIUMDRIVE":
                if (timeCardWO_FieldsSecurity.PremiumDriveTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += premiumDriveEditRow.replace("[PREMIUMDRIVEVISIBLE]", visible).replace("[PREMIUMDRIVEREQUIRED]", required);
                break;

            case "PREMIUMHOURS":
                if (timeCardWO_FieldsSecurity.PremiumHoursTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += premiumHoursEditRow.replace("[PREMIUMHOURSVISIBLE]", visible).replace("[PREMIUMHOURSREQUIRED]", required);
                break;

            case "OVERTIMEDRIVE":
                if (timeCardWO_FieldsSecurity.OverTimeDriveTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += overTimeDriveEditRow.replace("[OVERTIMEDRIVEVISIBLE]", visible).replace("[OVERTIMEDRIVEREQUIRED]", required);
                break;

            case "OVERTIMEHOURS":
                if (timeCardWO_FieldsSecurity.OverTimeHoursTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += overTimeHoursEditRow.replace("[OVERTIMEHOURSVISIBLE]", visible).replace("[OVERTIMEHOURSREQUIRED]", required);
                break;

            case "SPECIALDRIVE":
                if (timeCardWO_FieldsSecurity.SpecialDriveTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += specialDriveEditRow.replace("[SPECIALDRIVEVISIBLE]", visible).replace("[SPECIALDRIVEREQUIRED]", required);
                break;

            case "SPECIALHOURS":
                if (timeCardWO_FieldsSecurity.SpecialHoursTextBoxRequired) {
                    required = "inline";
                }
                
                ulTemplateLabor += specialHoursEditRow.replace("[SPECIALHOURSVISIBLE]", visible).replace("[SPECIALHOURSREQUIRED]", required);
                break;
        }
    }

    

    ulTemplateDates += closeUlTag;
    ulTemplateLabor += closeUlTag;
    ulTemplateReadOnlyDetails += closeUlTag;
    ulTemplateCompletion += closeUlTag;
    woEditTemplate += ulTemplateReadOnlyDetails + ulTemplateDates + ulTemplateLabor + ulTemplateCompletion + '</div>';
    $("#TimeCardWO_WOFieldsDiv").html(woEditTemplate).trigger("create");

    timeCardWO_PriorityValueLabel = timeCardWO_Page.find("#TimeCardWO_PriorityValueLabel");
    timeCardWO_WODetailNumberValueLabel = timeCardWO_Page.find("#TimeCardWO_WODetailNumberValueLabel");
    timeCardWO_BillableToggle = timeCardWO_Page.find("#TimeCardWO_BillableToggle");
    timeCardWO_StatusValueLabel = timeCardWO_Page.find("#TimeCardWO_StatusValueLabel");
    timeCardWO_ProblemDescriptionValueLabel = timeCardWO_Page.find("#TimeCardWO_ProblemDescriptionValueLabel");
    timeCardWO_ResCodeDropDown = timeCardWO_Page.find("#TimeCardWO_ResCodeDropDown");
    timeCardWO_ArrivalTextBox = timeCardWO_Page.find("#TimeCardWO_ArrivalTextBox");
    timeCardWO_ArrivalLink = timeCardWO_Page.find("#TimeCardWO_ArrivalLink");
    timeCardWO_DepartureTextBox = timeCardWO_Page.find("#TimeCardWO_DepartureTextBox");
    timeCardWO_DepartureLink = timeCardWO_Page.find("#TimeCardWO_DepartureLink");
    timeCardWO_MilesTextBox = timeCardWO_Page.find("#TimeCardWO_MilesTextBox");
    timeCardWO_RegHrsTextBox = timeCardWO_Page.find("#TimeCardWO_RegHrsTextBox");
    timeCardWO_RegDrvTextBox = timeCardWO_Page.find("#TimeCardWO_RegDrvTextBox");
    timeCardWO_OTHrsTextBox = timeCardWO_Page.find("#TimeCardWO_OTHrsTextBox");
    timeCardWO_OTDrvTextBox = timeCardWO_Page.find("#TimeCardWO_OTDrvTextBox");
    timeCardWO_PremHrsTextBox = timeCardWO_Page.find("#TimeCardWO_PremHrsTextBox");
    timeCardWO_PremDrvTextBox = timeCardWO_Page.find("#TimeCardWO_PremDrvTextBox");
    timeCardWO_SpecHrsTextBox = timeCardWO_Page.find("#TimeCardWO_SpecHrsTextBox");
    timeCardWO_SpecDrvTextBox = timeCardWO_Page.find("#TimeCardWO_SpecDrvTextBox");
    timeCardWO_CompletedToggle = timeCardWO_Page.find("#TimeCardWO_CompletedToggle");
    timeCardWO_CompletedCommentTextArea = timeCardWO_Page.find("#TimeCardWO_CompletedCommentTextArea");
    timeCardWO_CompletedCommentMandatoryLabel = timeCardWO_Page.find("#TimeCardWO_CompletedCommentMandatoryLabel");

    timeCardWO_ResolutionCodeMandatoryLabel = timeCardWO_Page.find("#TimeCardWO_ResolutionCodeMandatoryLabel");
    if (!timeCardWO_FieldsSecurity.ArrivalTextBoxEnabled) {
        timeCardWO_ArrivalTextBox.addClass('ui-disabled');
        timeCardWO_ArrivalTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.DepartureTextBoxEnabled) {
        timeCardWO_DepartureTextBox.addClass('ui-disabled');
        timeCardWO_DepartureTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.CompletedToggleEnabled) {
        timeCardWO_CompletedToggle.slider("disable");
    }

    if (!timeCardWO_FieldsSecurity.CompletedCommentTextAreaEnabled) {
        timeCardWO_CompletedCommentTextArea.addClass('ui-disabled');
        timeCardWO_CompletedCommentTextArea.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.MilesTextBoxEnabled) {
        timeCardWO_MilesTextBox.addClass('ui-disabled');
        timeCardWO_MilesTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.RegularHoursTextBoxEnabled) {
        timeCardWO_RegHrsTextBox.addClass('ui-disabled');
        timeCardWO_RegHrsTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.RegularDriveTextBoxEnabled) {
        timeCardWO_RegDrvTextBox.addClass('ui-disabled');
        timeCardWO_RegDrvTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.SpecialHoursTextBoxEnabled) {
        timeCardWO_SpecHrsTextBox.addClass('ui-disabled');
        timeCardWO_SpecHrsTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.SpecialDriveTextBoxEnabled) {
        timeCardWO_SpecDrvTextBox.addClass('ui-disabled');
        timeCardWO_SpecDrvTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.OverTimeHoursTextBoxEnabled) {
        timeCardWO_OTHrsTextBox.addClass('ui-disabled');
        timeCardWO_OTHrsTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.OverTimeDriveTextBoxEnabled) {
        timeCardWO_OTDrvTextBox.addClass('ui-disabled');
        timeCardWO_OTDrvTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.PremiumHoursTextBoxEnabled) {
        timeCardWO_PremHrsTextBox.addClass('ui-disabled');
        timeCardWO_PremHrsTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.PremiumDriveTextBoxEnabled) {
        timeCardWO_PremDrvTextBox.addClass('ui-disabled');
        timeCardWO_PremDrvTextBox.prop("readonly", "readonly");
    }

    if (!timeCardWO_FieldsSecurity.ResolutionCodeDropDownEnabled) {
        timeCardWO_ResCodeDropDown.addClass('ui-disabled');
    }

    if (timeCardWO_FieldsSecurity.MilesTextBoxRequired) {
        timeCardWO_MilesTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.RegularHoursTextBoxRequired) {
        timeCardWO_RegHrsTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.RegularDriveTextBoxRequired) {
        timeCardWO_RegDrvTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.OverTimeHoursTextBoxRequired) {
        timeCardWO_OTHrsTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.OverTimeDriveTextBoxRequired) {
        timeCardWO_OTDrvTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.PremiumHoursTextBoxRequired) {
        timeCardWO_PremHrsTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.PremiumDriveTextBoxRequired) {
        timeCardWO_PremDrvTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.SpecialHoursTextBoxRequired) {
        timeCardWO_SpecHrsTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.SpecialDriveTextBoxRequired) {
        timeCardWO_SpecDrvTextBox.attr("data-required", "true");
    }
    
    if (timeCardWO_FieldsSecurity.ResolutionCodeDropDownRequired) {
        timeCardWO_ResCodeDropDown.attr("data-required", "true");
    }
    
    if (timeCardWO_IsSourceWO) {
        if (getLocal("TimeCard_WorkOrderSource") === "LaborEntryEdit" || getLocal("TimeCard_WorkOrderSource") === "DailyViewEntryEdit") {
            timeCardWO_Entry = JSON.parse(getLocal("LaborData"));

            for (var i = 0; i < timeCardWO_Entry.length; i++) {
                timeCardWO_Entry[i].Arrival = GetDateObjectFromInvariantDateString(timeCardWO_Entry[i].ArrivalString);
                timeCardWO_Entry[i].Departure = GetDateObjectFromInvariantDateString(timeCardWO_Entry[i].DepartureString);
            }

            TimeCardWO_Edit(Number(getLocal("LaborDataIndex")));
        }
        else {
            TimeCardWO_LoadWODetailsForActionsPopup();
        }
    }
}

function TimeCardWO_GetCollapsibleChildrenHtml(timeCardWO_SingleEntry, index) {
    var htmlContent = "";

    if (!IsObjectNullOrUndefined(timeCardWO_SingleEntry)) {
        htmlContent += timeCardWO_EntryTemplate
                                    .replace(/\[INDEX\]/g, index)
                                    .replace('[PRIORITY]', timeCardWO_SingleEntry.Priority)
                                    .replace('[DETAILNUMBER]', timeCardWO_SingleEntry.WorkOrderDetailNumber)
                                    .replace('[BILLABLE]', timeCardWO_SingleEntry.BillableBool ? "selected" : emptyString)
                                    .replace('[STATUS]', timeCardWO_SingleEntry.Status)
                                    .replace('[PROBLEMDESCRIPTION]', IsStringNullOrEmpty(timeCardWO_SingleEntry.ProblemDescription) ? emptyString : timeCardWO_SingleEntry.ProblemDescription)
                                    .replace('[RESOLUTIONCODE]', IsStringNullOrEmpty(timeCardWO_SingleEntry.ResolutionDescription) ? emptyString : timeCardWO_SingleEntry.ResolutionDescription)
                                    .replace('[ARRIVAL]', GetDateTimeText(timeCardWO_SingleEntry.Arrival, false))
                                    .replace('[DEPARTURE]', GetDateTimeText(timeCardWO_SingleEntry.Departure, false))
                                    .replace('[MILES]', GetDecimal(timeCardWO_SingleEntry.Miles, 2, true))
                                    .replace('[COMPLETED]', timeCardWO_SingleEntry.OrderComplete ? "selected" : emptyString)
                                    .replace('[COMPLETEDCOMMENTS]', IsStringNullOrEmpty(timeCardWO_SingleEntry.CompletionDescription) ? emptyString : timeCardWO_SingleEntry.CompletionDescription)
                                    .replace('[REGULARHOURS]', GetDecimal(timeCardWO_SingleEntry.RegularHours, 2, true))
                                    .replace('[REGULARDRIVE]', GetDecimal(timeCardWO_SingleEntry.RegularDriveHours, 2, true))
                                    .replace('[PREMIUMHOURS]', GetDecimal(timeCardWO_SingleEntry.PremiumHours, 2, true))
                                    .replace('[PREMIUMDRIVE]', GetDecimal(timeCardWO_SingleEntry.PremiumDriveHours, 2, true))
                                    .replace('[OVERTIMEHOURS]', GetDecimal(timeCardWO_SingleEntry.OverTimeHours, 2, true))
                                    .replace('[OVERTIMEDRIVE]', GetDecimal(timeCardWO_SingleEntry.OverTimeDriveHours, 2, true))
                                    .replace('[SPECIALHOURS]', GetDecimal(timeCardWO_SingleEntry.SpecialHours, 2, true))
                                    .replace('[SPECIALDRIVE]', GetDecimal(timeCardWO_SingleEntry.SpecialDriveHours, 2, true));
    }

    return htmlContent;
}

function TimeCardWO_WorkOrderSearch() {
    timeCardWO_WorkOrderNumberSearchTextBox.addClass('ui-disabled');
    timeCardWO_WorkOrderNumberSearchTextBox.attr("readonly", "readonly");
    timeCardWO_WorkOrderSearchButton.addClass('ui-disabled');
    timeCardWO_WorkOrderSearchButton.attr("readonly", "readonly");
    timeCardWO_WorkOrderNumberDropDown.selectmenu('disable');

    TimeCardWO_ClearWorkOrderFields();
    TimeCardWO_GetResolutionCode(null, null, null);
    timeCardWO_WorkOrderNumberDropDown.children("option:not(:first)").remove();
    timeCardWO_WorkOrderNumberDropDown.val(defaultDropDownValue).selectmenu("refresh");
    timeCardWO_WorkOrder = [];

    if (!IsStringNullOrEmpty(timeCardWO_WorkOrderNumberSearchTextBox.val())) {
        if (timeCardWO_WorkOrderNumberSearchTextBox.val().length >= 3) {
            var myJSONobject = {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
                "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
                "WorkOrderNumber": timeCardWO_WorkOrderNumberSearchTextBox.val(),
                "SessionID": decryptStr(getLocal("SessionID"))
            };

            if (timeCardWO_IsSourceWO) {
                var accessURL = standardAddress + "TimeCard.ashx?Method=WorkOrderSearchForLaborEntry";
            }
            else {
                var accessURL = standardAddress + "TimeCard.ashx?Method=WorkOrderSearch";
            }

            if (navigator.onLine) {
                $.postJSON(accessURL, myJSONobject, function (data) {
                    if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                        if (data != null && data != "null") {
                            timeCardWO_WorkOrder = data;

                            for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                                var option = document.createElement("option");
                                option.setAttribute("value", arrayCount);
                                option.innerHTML = data[arrayCount].WorkOrderNumber;
                                timeCardWO_WorkOrderNumberDropDown.append(option);
                            }
                        }
                    }

                    timeCardWO_WorkOrderNumberSearchTextBox.removeClass('ui-disabled');
                    timeCardWO_WorkOrderNumberSearchTextBox.removeAttr("readonly");
                    timeCardWO_WorkOrderSearchButton.removeClass('ui-disabled');
                    timeCardWO_WorkOrderSearchButton.removeAttr("readonly");
                    timeCardWO_WorkOrderNumberDropDown.selectmenu('enable');

                    if (timeCardWO_IsSourceWO) {
                        timeCardWO_WorkOrderNumberDropDown.val("0").selectmenu("refresh");
                        TimeCardWO_WorkOrderNumberSelected();
                    }
                });
            }
            else {
                closeActionPopupLoading();

                setTimeout(function () {
                    showError(timeCardWO_NoNetworkTranslation);
                }, 650);

                timeCardWO_WorkOrderNumberSearchTextBox.removeClass('ui-disabled');
                timeCardWO_WorkOrderNumberSearchTextBox.removeAttr("readonly");
                timeCardWO_WorkOrderSearchButton.removeClass('ui-disabled');
                timeCardWO_WorkOrderSearchButton.removeAttr("readonly");
                timeCardWO_WorkOrderNumberDropDown.selectmenu('enable');
            }
        }
        else {
            timeCardWO_WorkOrderNumberSearchTextBox.removeClass('ui-disabled');
            timeCardWO_WorkOrderNumberSearchTextBox.removeAttr("readonly");
            timeCardWO_WorkOrderSearchButton.removeClass('ui-disabled');
            timeCardWO_WorkOrderSearchButton.removeAttr("readonly");
            timeCardWO_WorkOrderNumberDropDown.selectmenu('enable');
        }
    }
    else {
        timeCardWO_WorkOrderNumberSearchTextBox.removeClass('ui-disabled');
        timeCardWO_WorkOrderNumberSearchTextBox.removeAttr("readonly");
        timeCardWO_WorkOrderSearchButton.removeClass('ui-disabled');
        timeCardWO_WorkOrderSearchButton.removeAttr("readonly");
        timeCardWO_WorkOrderNumberDropDown.selectmenu('enable');
    }
}

function TimeCardWO_WorkOrderNumberSelected() {
    var clearFields = true;
    var index = parseInt(timeCardWO_WorkOrderNumberDropDown.val());

    if (!isNaN(index)) {
        if (index != -1 && index < timeCardWO_WorkOrder.length) {
            timeCardWO_PriorityValueLabel.text(timeCardWO_WorkOrder[index].Priority);
            timeCardWO_WODetailNumberValueLabel.text(timeCardWO_WorkOrder[index].WorkOrderDetailNumber);

            timeCardWO_BillableToggle.val(timeCardWO_WorkOrder[index].BillableBool ? "1" : "0");
            timeCardWO_BillableToggle.slider("refresh");

            timeCardWO_StatusValueLabel.text(timeCardWO_WorkOrder[index].Status);
            timeCardWO_ProblemDescriptionValueLabel.text(timeCardWO_WorkOrder[index].ProblemDescription);
            timeCardWO_CompletedCommentTextArea.val(timeCardWO_WorkOrder[index].CompletionDescription);

            TimeCardWO_GetResolutionCode(timeCardWO_WorkOrder[index].WorkOrderNumber, timeCardWO_WorkOrder[index].WorkOrderDetailNumber, timeCardWO_WorkOrder[index].ProblemDescription, null)

            clearFields = false;
        }
    }

    if (clearFields) {
        TimeCardWO_ClearWorkOrderFields();
        TimeCardWO_GetResolutionCode(null, null, null, null);
    }
}

function TimeCardWO_ClearWorkOrderFields() {
    timeCardWO_PriorityValueLabel.text(emptyString);
    timeCardWO_WODetailNumberValueLabel.text(emptyString);

    timeCardWO_BillableToggle.val("0");
    timeCardWO_BillableToggle.slider("refresh");

    timeCardWO_StatusValueLabel.text(emptyString);
    timeCardWO_ProblemDescriptionValueLabel.text(emptyString);
    timeCardWO_CompletedCommentTextArea.val(emptyString);
    timeCardWO_CompletedCommentMandatoryLabel.hide();
}

function TimeCardWO_ClearEditControls() {    
    timeCardWO_DeleteIndex = null;

    timeCardWO_EditHeaderLabel.text(emptyString);
    timeCardWO_IndexHidden.val(emptyString);

    if (!timeCardWO_IsSourceWO) {
        timeCardWO_WorkOrderNumberSearchTextBox.val(emptyString);
        TimeCardWO_ClearWorkOrderFields();
        timeCardWO_WorkOrderNumberDropDown.children("option:not(:first)").remove();
        timeCardWO_WorkOrderNumberDropDown.val(defaultDropDownValue).selectmenu("refresh");
    }
    else if (timeCardWO_IsSourceWO) {
        if (!IsStringNullOrEmpty(userNameemployeeNumber)) {
            timeCardWO_UserNameDropDown.val(userNameemployeeNumber);
        }
        else {
            timeCardWO_UserNameDropDown.children("option:not(:first)").remove();
        }

        timeCardWO_UserNameDropDown.selectmenu("refresh", true);
    }

    timeCardWO_ResCodeDropDown.children("option:not(:first)").remove();
    timeCardWO_ResCodeDropDown.val(defaultDropDownValue).selectmenu("refresh");
    timeCardWO_ArrivalTextBox.val(emptyString);
    timeCardWO_DepartureTextBox.val(emptyString);
    timeCardWO_MilesTextBox.val(emptyString);
    timeCardWO_RegHrsTextBox.val(emptyString);
    timeCardWO_RegDrvTextBox.val(emptyString);
    timeCardWO_OTHrsTextBox.val(emptyString);
    timeCardWO_OTDrvTextBox.val(emptyString);
    timeCardWO_PremHrsTextBox.val(emptyString);
    timeCardWO_PremDrvTextBox.val(emptyString);
    timeCardWO_SpecHrsTextBox.val(emptyString);
    timeCardWO_SpecDrvTextBox.val(emptyString);

    timeCardWO_CompletedToggle.val("0");
    timeCardWO_CompletedToggle.slider("refresh");

    //    SetSelectedDateTimeForLink('TimeCardWO_ArrivalTextBox', 'TimeCardWO_ArrivalLink');
    //    SetSelectedDateTimeForLink('TimeCardWO_DepartureTextBox', 'TimeCardWO_DepartureLink');
}

function TimeCardWO_Create() {
    timeCardWO_IsCreateMode = true;

    if (getLocal("TimeCard_WorkOrderSource") !== "LaborEntryEdit" && getLocal("TimeCard_WorkOrderSource") !== "DailyViewEntryEdit") {
        TimeCardWO_ClearEditControls();
        timeCardWO_EditHeaderLabel.text(timeCardWO_AddHeaderTranslation);
    }
    else {
        timeCardWO_EditHeaderLabel.text(timeCardWO_EditHeaderTranslation);
    }

    if (!timeCardWO_IsCreateMode) {
        TimeCardWO_ShowCreate();
    }
    else {
        timeCardWO_IsEntryVisible = false;
        timeCardWO_EntryDiv.hide();
        timeCardWO_EditDiv.show();
    }
}

function TimeCardWO_Edit(index) {
    if (index >= 0 && index < timeCardWO_Entry.length) {
        if (!IsStringNullOrEmpty(timeCardWO_Entry[index].Status)) {
            if (timeCardWO_Entry[index].Status.toUpperCase() != "CMP") {
                if (!timeCardWO_IsSourceWO) {
                    timeCardWO_IsCreateMode = false;
                }

                TimeCardWO_ClearEditControls();

                timeCardWO_EditHeaderLabel.text(timeCardWO_EditHeaderTranslation);

                TimeCardWO_GetResolutionCode(timeCardWO_Entry[index].WorkOrderNumber, timeCardWO_Entry[index].WorkOrderDetailNumber, timeCardWO_Entry[index].ProblemDescription, timeCardWO_Entry[index].ResolutionCodeNumber)

                var option = document.createElement("option");
                option.setAttribute("value", "0");
                option.innerHTML = timeCardWO_Entry[index].WorkOrderNumber;
                timeCardWO_WorkOrderNumberDropDown.append(option);
                timeCardWO_WorkOrderNumberDropDown.val("0").selectmenu("refresh");

                var searchResult = new Object();
                searchResult.WorkOrderNumber = timeCardWO_Entry[index].WorkOrderNumber;
                searchResult.Priority = timeCardWO_Entry[index].Priority;
                searchResult.WorkOrderDetailNumber = timeCardWO_Entry[index].WorkOrderDetailNumber;
                searchResult.BillableBool = timeCardWO_Entry[index].BillableBool;
                searchResult.Status = timeCardWO_Entry[index].Status;
                searchResult.ProblemDescription = timeCardWO_Entry[index].ProblemDescription;
                searchResult.CompletionDescription = timeCardWO_Entry[index].CompletionDescription;
                timeCardWO_WorkOrder = [];
                timeCardWO_WorkOrder.push(searchResult);

                timeCardWO_IndexHidden.val(index);
                timeCardWO_WorkOrderNumberSearchTextBox.val(timeCardWO_Entry[index].WorkOrderNumber);
                timeCardWO_PriorityValueLabel.text(timeCardWO_Entry[index].Priority);
                timeCardWO_WODetailNumberValueLabel.text(timeCardWO_Entry[index].WorkOrderDetailNumber);
                timeCardWO_BillableToggle.val(timeCardWO_Entry[index].BillableBool ? "1" : "0");
                timeCardWO_BillableToggle.slider("refresh");
                timeCardWO_StatusValueLabel.text(timeCardWO_Entry[index].Status);
                timeCardWO_ProblemDescriptionValueLabel.text(timeCardWO_Entry[index].ProblemDescription);
                timeCardWO_CompletedToggle.val(timeCardWO_Entry[index].OrderComplete ? "1" : "0");

                if (timeCardWO_Entry[index].Status.toUpperCase().indexOf("C") == 0) {
                    timeCardWO_CompletedToggle.slider("disable");
                }
                else {
                    if (timeCardWO_FieldsSecurity.CompletedToggleEnabled) {
                        timeCardWO_CompletedToggle.slider("enable");
                    }
                }

                timeCardWO_CompletedToggle.slider("refresh");
                timeCardWO_CompletedCommentTextArea.val(timeCardWO_Entry[index].CompletionDescription);

                if (timeCardWO_Entry[index].OrderComplete) {
                    timeCardWO_CompletedCommentMandatoryLabel.show();
                }
                else {
                    timeCardWO_CompletedCommentMandatoryLabel.hide();
                }

                timeCardWO_ArrivalTextBox.val(IsStringNullOrEmpty(timeCardWO_Entry[index].Arrival) ? emptyString : GetInvariantDateTimeString_T(timeCardWO_Entry[index].Arrival));
                timeCardWO_DepartureTextBox.val(IsStringNullOrEmpty(timeCardWO_Entry[index].Departure) ? emptyString : GetInvariantDateTimeString_T(timeCardWO_Entry[index].Departure));
                timeCardWO_MilesTextBox.val(GetDecimal(timeCardWO_Entry[index].Miles, 2, false));
                timeCardWO_RegHrsTextBox.val(GetDecimal(timeCardWO_Entry[index].RegularHours, 2, false));
                timeCardWO_RegDrvTextBox.val(GetDecimal(timeCardWO_Entry[index].RegularDriveHours, 2, false));
                timeCardWO_OTHrsTextBox.val(GetDecimal(timeCardWO_Entry[index].OverTimeHours, 2, false));
                timeCardWO_OTDrvTextBox.val(GetDecimal(timeCardWO_Entry[index].OverTimeDriveHours, 2, false));
                timeCardWO_PremHrsTextBox.val(GetDecimal(timeCardWO_Entry[index].PremiumHours, 2, false));
                timeCardWO_PremDrvTextBox.val(GetDecimal(timeCardWO_Entry[index].PremiumDriveHours, 2, false));
                timeCardWO_SpecHrsTextBox.val(GetDecimal(timeCardWO_Entry[index].SpecialHours, 2, false));
                timeCardWO_SpecDrvTextBox.val(GetDecimal(timeCardWO_Entry[index].SpecialDriveHours, 2, false));
                TimeCardWO_ShowCreate();
            }
        }
    }
}

function TimeCardWO_ShowEntries() {
    if (!timeCardWO_IsEntryVisible) {
        timeCardWO_WorkOrderNumberSearchTextBox.blur();
        timeCardWO_MilesTextBox.blur();
        timeCardWO_RegHrsTextBox.blur();
        timeCardWO_RegDrvTextBox.blur();
        timeCardWO_OTHrsTextBox.blur();
        timeCardWO_OTDrvTextBox.blur();
        timeCardWO_PremHrsTextBox.blur();
        timeCardWO_PremDrvTextBox.blur();
        timeCardWO_SpecHrsTextBox.blur();
        timeCardWO_SpecDrvTextBox.blur();
        timeCardWO_CompletedCommentTextArea.blur();

        timeCardWO_Page.scrollTop(0);
        timeCardWO_IsEntryVisible = true;
        timeCardWO_EntryDiv.show();
        timeCardWO_EditDiv.hide();
        //timeCardWO_EntryDiv.show('slide', { direction: 'left' }, 500);
        //timeCardWO_EditDiv.hide('slide', { direction: 'right' }, 500);
    }
}

function TimeCardWO_ShowCreate() {
    if (timeCardWO_IsEntryVisible) {
        timeCardWO_Page.scrollTop(0);
        timeCardWO_IsEntryVisible = false;
        timeCardWO_EntryDiv.hide();
        timeCardWO_EditDiv.show();
        //timeCardWO_EntryDiv.hide('slide', { direction: 'left' }, 500);
        //timeCardWO_EditDiv.show('slide', { direction: 'right' }, 500);
    }
}

function TimeCardWO_Reset() {
    if (timeCardWO_IsSourceWO && (getLocal("TimeCard_WorkOrderSource") === "LaborEntryEdit" || getLocal("TimeCard_WorkOrderSource") === "DailyViewEntryEdit")) {
        var index = getLocal("LaborDataIndex");
        if (!IsStringNullOrEmpty(index)) {
            index = Number(index);
            TimeCardWO_Edit(index);
        }
    }
    else if (!timeCardWO_IsCreateMode) {
        var index = timeCardWO_IndexHidden.val();
        if (!IsStringNullOrEmpty(index)) {
            index = Number(index);
            TimeCardWO_Edit(index);
        }
    }
    else {
        TimeCardWO_Create();
    }
}

function TimeCardWO_Save() {
    timeCardWO_Page.scrollTop(0);

    var priorityVisible = false;
    var statusVisible = false;
    var workOrderDetailNumberVisible = false;
    var problemDescriptionVisible = false;
    var billableVisible = false;
    var resolutionCodeVisible = false;
    var arrivalVisible = false;
    var departureVisible = false;
    var milesVisible = false;
    var completedVisible = false;
    var completedCommentVisible = false;
    var regularDriveVisible = false;
    var regularHoursVisible = false;
    var premiumDriveVisible = false;
    var premiumHoursVisible = false;
    var overTimeDriveVisible = false;
    var overTimeHoursVisible = false;
    var specialDriveVisible = false;
    var specialHoursVisible = false;

    for (var index = 0; index < timeCardWO_Fields.length; index++) {
        if (timeCardWO_Fields[index].ColumnVisible == "1") {
            switch (timeCardWO_Fields[index].ColumnName.toUpperCase()) {
                case "PRIORITY":
                    priorityVisible = true;
                    break;

                case "STATUS":
                    statusVisible = true;
                    break;

                case "WORKORDERDETAILNUMBER":
                    workOrderDetailNumberVisible = true;
                    break;

                case "PROBLEMDESCRIPTION":
                    problemDescriptionVisible = true;
                    break;

                case "BILLABLE":
                    billableVisible = true;
                    break;

                case "RESOLUTIONCODE":
                    resolutionCodeVisible = true;
                    break;

                case "ARRIVAL":
                    arrivalVisible = true;
                    break;

                case "DEPARTURE":
                    departureVisible = true;
                    break;

                case "MILES":
                    milesVisible = true;
                    break;

                case "COMPLETED":
                    completedVisible = true;
                    break;

                case "COMPLETEDCOMMENT":
                    completedCommentVisible = true;
                    break;

                case "REGULARDRIVE":
                    regularDriveVisible = true;
                    break;

                case "REGULARHOURS":
                    regularHoursVisible = true;
                    break;

                case "PREMIUMDRIVE":
                    premiumDriveVisible = true;
                    break;

                case "PREMIUMHOURS":
                    premiumHoursVisible = true;
                    break;

                case "OVERTIMEDRIVE":
                    overTimeDriveVisible = true;
                    break;

                case "OVERTIMEHOURS":
                    overTimeHoursVisible = true;
                    break;

                case "SPECIALDRIVE":
                    specialDriveVisible = true;
                    break;

                case "SPECIALHOURS":
                    specialHoursVisible = true;
                    break;
            }
        }
    }

    var validationMessage = emptyString;
    var validationFlag = true;
    var arrivalValidationFlag = true;
    var departureValidationFlag = true;

    var woText = GetTranslatedValue("TimeCardWO_WorkOrderNumberLabel");
    var arrivalText = GetTranslatedValue("ArrivalValue");
    var departureText = GetTranslatedValue("DepartureValue");
    var completedCommentText = GetTranslatedValue("CommentsValue");
    var hoursText = GetTranslatedValue("HoursValue");
    var driveText = GetTranslatedValue("DriveValue");
    var milesText = GetTranslatedValue("MilesValue");
    var regularHours = GetTranslatedValue("RegularHours");
    var regularDrive = GetTranslatedValue("RegularDrive");
    var overtimeHours = GetTranslatedValue("OverTimeHours");
    var overtimeDrive = GetTranslatedValue("OverTimeDrive");
    var premiumHours = GetTranslatedValue("PremiumHours");
    var premiumDrive = GetTranslatedValue("PremiumDrive");
    var specialHours = GetTranslatedValue("SpecialHours");
    var specialDrive = GetTranslatedValue("SpecialDrive");
    var resolutionCodeText = GetTranslatedValue("ResolutionCodeValue");
    var userNameRequired = GetTranslatedValue("UserNameRequired");

    var weekFrom = GetDateObjectFromInvariantDateString(getLocal("TimeCard_WeekFrom") + " 00:00");
    var weekTo = GetDateObjectFromInvariantDateString(getLocal("TimeCard_WeekTo") + " 23:59");

    var arrival = GetDateObjectFromInvariantDateString(timeCardWO_ArrivalTextBox.val());
    var departure = GetDateObjectFromInvariantDateString(timeCardWO_DepartureTextBox.val());

    if (timeCardWO_WorkOrderNumberDropDown.val() == defaultDropDownValue) {
        validationMessage += "- " + woText + " " + timeCardWO_RequiredTextBoxValidation + " " + woText + ".";
        validationFlag = false;
    }

    if (IsStringNullOrEmpty(timeCardWO_ArrivalTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + arrivalText + " " + timeCardWO_RequiredTextBoxValidation + " " + arrivalText + ".";
        validationFlag = false;
        arrivalValidationFlag = false;
    }
    else if (!ValidateInvariantDateString(timeCardWO_ArrivalTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeCardWO_InvalidDate1Translation + " " + arrivalText + " " + timeCardWO_InvalidDate2Translation + " " + MinYear + " " + timeCardWO_InvalidDate3Translation + " " + MaxYear + ".";
        validationFlag = false;
        arrivalValidationFlag = false;
    }
    else {
        if (arrival != null) {
            if (timeCardWO_IsSourceWO) {
                // yet to write
            }
            else {
                if (arrival < weekFrom || arrival > weekTo) {
                    if (!IsStringNullOrEmpty(validationMessage)) {
                        validationMessage += "<br/>";
                    }

                    validationMessage += "- " + arrivalText + " " + timeCardWO_InvalidWeekTranslation;
                    validationFlag = false;
                    arrivalValidationFlag = false;
                }
            }
        }
    }

    if (IsStringNullOrEmpty(timeCardWO_DepartureTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + departureText + " " + timeCardWO_RequiredTextBoxValidation + " " + departureText + ".";
        validationFlag = false;
        departureValidationFlag = false;
    }
    else if (!ValidateInvariantDateString(timeCardWO_DepartureTextBox.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + timeCardWO_InvalidDate1Translation + " " + departureText + " " + timeCardWO_InvalidDate2Translation + " " + MinYear + " " + timeCardWO_InvalidDate3Translation + " " + MaxYear + ".";
        validationFlag = false;
        departureValidationFlag = false;
    }
    else {
        if (departure != null) {
            if (timeCardWO_IsSourceWO) {
                // yet to write
            }
            else {
                if (departure < weekFrom || departure > weekTo) {
                    if (!IsStringNullOrEmpty(validationMessage)) {
                        validationMessage += "<br/>";
                    }

                    validationMessage += "- " + departureText + " " + timeCardWO_InvalidWeekTranslation;
                    validationFlag = false;
                    departureValidationFlag = false;
                }
            }
        }
    }

    if (arrivalValidationFlag && departureValidationFlag) {
        if (arrival > departure) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + departureText + " " + timeCardWO_DateGreaterTranslation + " " + arrivalText + ".";
            validationFlag = false;
        }
    }

    if (timeCardWO_MilesTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_MilesTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + milesText + " " + timeCardWO_RequiredTextBoxValidation + " " + milesText + ".";
            validationFlag = false;
        }
    }
    
    if (!IsStringNullOrEmpty(timeCardWO_MilesTextBox.val()) && milesVisible) {
        var controlText = GetTranslatedValue("MilesValue");
        var hoursNumber = parseFloat(timeCardWO_MilesTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_RegHrsTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_RegHrsTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + regularHours + " " + timeCardWO_RequiredTextBoxValidation + " " + regularHours + ".";
            validationFlag = false;
        }
    }
    
    if (!IsStringNullOrEmpty(timeCardWO_RegHrsTextBox.val()) && regularHoursVisible) {
        var controlText = GetTranslatedValue("RegularValue");
        var hoursNumber = parseFloat(timeCardWO_RegHrsTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + hoursText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + hoursText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_RegDrvTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_RegDrvTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + regularDrive + " " + timeCardWO_RequiredTextBoxValidation + " " + regularDrive + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_RegDrvTextBox.val()) && regularDriveVisible) {
        var controlText = GetTranslatedValue("RegularValue");
        var hoursNumber = parseFloat(timeCardWO_RegDrvTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + driveText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + driveText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_OTHrsTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_OTHrsTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + overtimeHours + " " + timeCardWO_RequiredTextBoxValidation + " " + overtimeHours + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_OTHrsTextBox.val()) && overTimeHoursVisible) {
        var controlText = GetTranslatedValue("OverTimeValue");
        var hoursNumber = parseFloat(timeCardWO_OTHrsTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + hoursText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + hoursText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_OTDrvTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_OTDrvTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + overtimeDrive + " " + timeCardWO_RequiredTextBoxValidation + " " + overtimeDrive + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_OTDrvTextBox.val()) && overTimeDriveVisible) {
        var controlText = GetTranslatedValue("OverTimeValue");
        var hoursNumber = parseFloat(timeCardWO_OTDrvTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + driveText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + driveText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_PremHrsTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_PremHrsTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + premiumHours + " " + timeCardWO_RequiredTextBoxValidation + " " + premiumHours + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_PremHrsTextBox.val()) && premiumHoursVisible) {
        var controlText = GetTranslatedValue("PremiumValue");
        var hoursNumber = parseFloat(timeCardWO_PremHrsTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + hoursText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + hoursText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_PremDrvTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_PremDrvTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + premiumDrive + " " + timeCardWO_RequiredTextBoxValidation + " " + premiumDrive + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_PremDrvTextBox.val()) && premiumDriveVisible) {
        var controlText = GetTranslatedValue("PremiumValue");
        var hoursNumber = parseFloat(timeCardWO_PremDrvTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + driveText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + driveText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_SpecHrsTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_SpecHrsTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + specialHours + " " + timeCardWO_RequiredTextBoxValidation + " " + specialHours + ".";
            validationFlag = false;
        }
    }
        
    if (!IsStringNullOrEmpty(timeCardWO_SpecHrsTextBox.val()) && specialHoursVisible) {
        var controlText = GetTranslatedValue("SpecialValue");
        var hoursNumber = parseFloat(timeCardWO_SpecHrsTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + hoursText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + hoursText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_SpecDrvTextBox.prop("data-required") == "true") {
        if (IsStringNullOrEmpty(timeCardWO_SpecDrvTextBox.val())) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + specialDrive + " " + timeCardWO_RequiredTextBoxValidation + " " + specialDrive + ".";
            validationFlag = false;
        }
    }
    
    if (!IsStringNullOrEmpty(timeCardWO_SpecDrvTextBox.val()) && specialDriveVisible) {
        var controlText = GetTranslatedValue("SpecialValue");
        var hoursNumber = parseFloat(timeCardWO_SpecDrvTextBox.val());

        if (isNaN(hoursNumber)) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + controlText + " " + driveText + " " + timeCardWO_MustNumberTranslation;
            validationFlag = false;
        }
        else if (hoursNumber < timeCardWO_NumMin || hoursNumber > timeCardWO_NumMax) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + timeCardWO_NumberRange1Translation + " " + controlText + " " + driveText + " " + timeCardWO_NumberRange2Translation;
            validationFlag = false;
        }
    }

    if (timeCardWO_CompletedToggle.val() == "1" && IsStringNullOrEmpty(timeCardWO_CompletedCommentTextArea.val())) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + completedCommentText + " " + timeCardWO_RequiredTextBoxValidation + " " + completedCommentText + ".";
        validationFlag = false;
        }
    
    if (timeCardWO_ResCodeDropDown.attr("data-required") == "true") {
        if (timeCardWO_CompletedToggle.val() == "1" && timeCardWO_ResCodeDropDown.val() == "-1") {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }
            
            validationMessage += "- " + resolutionCodeText + " " + timeCardWO_RequiredDropDownValidation + " " + resolutionCodeText + ".";
            validationFlag = false;
        }
    }

    var entryIndex = IsStringNullOrEmpty(timeCardWO_IndexHidden.val()) ? -1 : parseInt(timeCardWO_IndexHidden.val());
    var woIndex = IsStringNullOrEmpty(timeCardWO_WorkOrderNumberDropDown.val()) ? -1 : parseInt(timeCardWO_WorkOrderNumberDropDown.val());
    validationFlag = validationFlag && woIndex >= 0 && woIndex < timeCardWO_WorkOrder.length;

    if (timeCardWO_IsSourceWO && (getLocal("TimeCard_WorkOrderSource") !== "LaborEntryEdit" && getLocal("TimeCard_WorkOrderSource") !== "DailyViewEntryEdit")) {
        var username = IsStringNullOrEmpty(timeCardWO_UserNameDropDown.val()) ? -1 : parseInt(timeCardWO_UserNameDropDown.val());
        if (username === -1) {
            validationMessage += "<br/>";
            validationMessage += "- " + userNameRequired + ".";
            validationFlag = false;
        }
    }

    if (!timeCardWO_IsCreateMode) {
        validationFlag = validationFlag && (entryIndex >= 0 && entryIndex < timeCardWO_Entry.length);
    }

    var timecardDetailNum = -1;
    var laborHourNumber = -1;
    var optionString = emptyString;
    var sundayDate = emptyString;

    if (timeCardWO_IsSourceWO) {
        switch (getLocal("TimeCard_WorkOrderSource")) {
            case "ActionsPopup":
                timecardDetailNum = -1;
                optionString = "I";
                laborHourNumber = null;
                break;
            case "LaborEntryEdit":
                timecardDetailNum = timeCardWO_Entry[entryIndex].TimecardDetailNumber;
                optionString = "U";
                laborHourNumber = timeCardWO_Entry[entryIndex].LaborHourNumber;
                sundayDate = timeCardWO_Entry[entryIndex].SundayDateString;
                setLocal("TimeCard_EmployeeNumber", timeCardWO_Entry[entryIndex].EmployeeNumber);
                break;
            case "DailyViewEntryEdit":
                // Need separate condition because of case for "TimeCardDetailNumber"
                timecardDetailNum = timeCardWO_Entry[entryIndex].TimeCardDetailNumber;
                optionString = "U";
                laborHourNumber = timeCardWO_Entry[entryIndex].LaborHourNumber;
                sundayDate = timeCardWO_Entry[entryIndex].SundayDateString;
                setLocal("TimeCard_EmployeeNumber", timeCardWO_Entry[entryIndex].EmployeeNumber);
                break;
        }
    }
    else {
        timecardDetailNum = timeCardWO_IsCreateMode ? getLocal("TimeCard_TimeCardDetailNumber") : timeCardWO_Entry[entryIndex].TimecardDetailNumber
        optionString = timeCardWO_IsCreateMode ? "I" : "U";
        laborHourNumber = timeCardWO_IsCreateMode ? null : timeCardWO_Entry[entryIndex].LaborHourNumber;
        sundayDate = getLocal("TimeCard_SundayDate");
    }

    if (validationFlag) {
        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
            "OptionString": optionString,
            "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
            "LaborHourNumber": laborHourNumber,
            "SundayDate": sundayDate,
            "TimeCardDetailNumber": timecardDetailNum,
            "WorkOrderNumber": timeCardWO_WorkOrder[woIndex].WorkOrderNumber,
            "WorkOrderDetailNumber": timeCardWO_WorkOrder[woIndex].WorkOrderDetailNumber,
            "Arrival": timeCardWO_ArrivalTextBox.val().replace("T", " "),
            "Departure": timeCardWO_DepartureTextBox.val().replace("T", " "),
            "OrderComplete": timeCardWO_CompletedToggle.val() == "1" ? true : false,
            //"CompletionDescription": timeCardWO_CompletedCommentTextArea.val(),
            "CompletionDescription": securityError(timeCardWO_CompletedCommentTextArea),
            "ResolutionCodeNumber": timeCardWO_ResCodeDropDown.val(),
            "Miles": timeCardWO_MilesTextBox.val(),
            "RegularHours": timeCardWO_RegHrsTextBox.val(),
            "RegularDriveHours": timeCardWO_RegDrvTextBox.val(),
            "OverTimeHours": timeCardWO_OTHrsTextBox.val(),
            "OverTimeDriveHours": timeCardWO_OTDrvTextBox.val(),
            "PremiumHours": timeCardWO_PremHrsTextBox.val(),
            "PremiumDriveHours": timeCardWO_PremDrvTextBox.val(),
            "SpecialHours": timeCardWO_SpecHrsTextBox.val(),
            "SpecialDriveHours": timeCardWO_SpecDrvTextBox.val(),
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID"))
        };

        TimeCardWO_ModifyEntry(myJSONobject);
    }
    else {
        showError(validationMessage);
    }
}

function TimeCardWO_CalculateHours() {
    if (!IsStringNullOrEmpty(timeCardWO_ArrivalTextBox.val()) && !IsStringNullOrEmpty(timeCardWO_DepartureTextBox.val())) {
        var arrival = GetDateObjectFromInvariantDateString(timeCardWO_ArrivalTextBox.val());
        var departure = GetDateObjectFromInvariantDateString(timeCardWO_DepartureTextBox.val());

        var totalHours = (departure - arrival) / 36e5; // 36e5 is scientific notation for (1000 * 60 * 60).

        if (totalHours >= 0) {
            timeCardWO_RegHrsTextBox.val(GetDecimal(totalHours, 2, false));
        }
    }
}

function TimeCardWO_DeleteConfirmation(index) {
    timeCardWO_DeleteIndex = index;
    showConfirmation(GetTranslatedValue("DeleteValue"), GetTranslatedValue("YesValue"), GetTranslatedValue("NoValue"), TimeCardWO_Delete);
}

function TimeCardWO_Delete(value) {
    if (value) {
        if (timeCardWO_DeleteIndex >= 0 && timeCardWO_DeleteIndex < timeCardWO_Entry.length) {
            var myJSONobject = {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
                "Optionstring": "D",
                "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
                "SundayDate": getLocal("TimeCard_SundayDate"),
                "LaborHourNumber": timeCardWO_Entry[timeCardWO_DeleteIndex].LaborHourNumber,
                "TimeCardDetailNumber": timeCardWO_Entry[timeCardWO_DeleteIndex].TimecardDetailNumber,
                "WorkOrderNumber": timeCardWO_Entry[timeCardWO_DeleteIndex].WorkOrderNumber,
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "SessionID": decryptStr(getLocal("SessionID"))
            };

            TimeCardWO_ModifyEntry(myJSONobject);
        }
    }

    timeCardWO_DeleteIndex = null;
}

function TimeCardWO_ModifyEntry(myJSONobject) {
    var accessURL = standardAddress + "TimeCard.ashx?Method=SetWorkOrder";

    if (navigator.onLine) {
        showActionPopupLoading();

        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    if (data.Status) {
                        if (data.CompletionMonthWarning) {
                            closeActionPopupLoading();

                            setTimeout(function () {
                                showError(timeCardWO_CompletionMonthWarningTranslation, TimeCardWO_AfterSave);
                            }, 650);
                        }
                        else {
                            TimeCardWO_AfterSave();
                        }
                    }
                    else {
                        closeActionPopupLoading();

                        setTimeout(function () {
                            showError(timeCardWO_ActionFailedTranslation);
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
                        showError(data.Message.replace("[OVERLAP]", timeCardWO_TimeCardOverlapTranslation).replace("[COMPLETIONMONTHPREVENTION]", 
                            timeCardWO_CompletionMonthPreventionTranslation).replace("[JOBSTEPSPENDING]", timeCardWO_JobStepsPendingTranslation).replace(
                            "[PMINSPECTIONPENDING]", timeCardWO_InspectionPendingTranslation));
                    }

                }, 650);
            }
        });
    }
    else {
        closeActionPopupLoading();

        setTimeout(function () {
            showError(timeCardWO_NoNetworkTranslation);
        }, 650);
    }
}

function TimeCardWO_AfterSave() {
    if (!timeCardWO_IsCreateMode) {
        TimeCardWO_GetEntries(true);
        //TimeCardWO_ShowEntries();
    }
    else {
        TimeCardWO_NavigatePrevious();
    }
}

function TimeCardWO_ConfirmPostWO() {
    showConfirmation(GetTranslatedValue("PostConfirm"), GetTranslatedValue("YesValue"), GetTranslatedValue("NoValue"), TimeCardWO_PostWO);
}

function TimeCardWO_PostWO(value) {
    if (value) {
        showActionPopupLoading();

        var workOrders = emptyString;

        for (var index = 0; index < timeCardWO_Entry.length; index++) {
            if (timeCardWO_Entry[index].OrderComplete == true && timeCardWO_Entry[index].Status.toUpperCase() != "CMP") {
                if (!IsStringNullOrEmpty(workOrders)) {
                    workOrders += "$";
                }

                workOrders += timeCardWO_Entry[index].WorkOrderNumber;
            }
        }

        if (!IsStringNullOrEmpty(workOrders)) {
            var myJSONobject = {
                "Language": getLocal("Language"),
                "DatabaseID": decryptStr(getLocal("DatabaseID")),
                "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
                "WorkOrderNumberString": workOrders,
                "SelectedEmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "SessionID": decryptStr(getLocal("SessionID")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
            };

            var accessURL = standardAddress + "TimeCard.ashx?Method=PostWorkOrder";

            if (navigator.onLine) {
                $.postJSON(accessURL, myJSONobject, function (data) {
                    if (data != null && data != "null") {
                        if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                            if (data.Status) {
                                TimeCardWO_GetEntries(false);
                            }
                            else {
                                closeActionPopupLoading();

                                setTimeout(function () {
                                    showError(timeCardWO_ActionFailedTranslation);
                                }, 650);
                            }
                        }
                        else {
                            closeActionPopupLoading();

                            setTimeout(function () {
                                showError(data.Message);
                            }, 650);
                        }
                    }
                    else {
                        closeActionPopupLoading();
                    }
                });
            }
            else {
                closeActionPopupLoading();

                setTimeout(function () {
                    showError(timeCardWO_NoNetworkTranslation);
                }, 650);
            }
        }
    }
}

function TimeCardWO_CompletedToggleChanged() {
    if (timeCardWO_CompletedToggle.val() == "1") {
        timeCardWO_CompletedCommentMandatoryLabel.show();
        if (timeCardWO_FieldsSecurity.ResolutionCodeDropDownRequired) {
            timeCardWO_ResolutionCodeMandatoryLabel.show();
        }
    }
    else {
        timeCardWO_CompletedCommentMandatoryLabel.hide();
        timeCardWO_ResolutionCodeMandatoryLabel.hide();
    }
}

function TimeCardWO_NavigatePrevious() {
    if (timeCardWO_IsSourceWO) {
        timeCardWO_IsSourceWO = false;

        if (getLocal("TimeCard_WorkOrderSource") === "LaborEntryEdit") {
            $.mobile.changePage("LaborDetails.html");
        }
        else if (getLocal("TimeCard_WorkOrderSource") === "DailyViewEntryEdit") {
            $.mobile.changePage("TimeCardEntry.html");
        }
        else {
            $.mobile.changePage("WorkOrderDetails.html");
        }
        return;
    }

    if (navigator.onLine) {
        if (!timeCardWO_IsCreateMode) {
            $.mobile.changePage("TimeCardSummary.html");
        }
        else {
            $.mobile.changePage("TimeCardEntry.html");
        }
    }
    else {
        showError(timeCardWO_NoNetworkTranslation);
    }
}

function TimeCardWO_LoadWODetailsForActionsPopup() {
    timeCardWO_UserNameDropDown.val(defaultDropDownValue);
    timeCardWO_UserNameDropDown.selectmenu("refresh", true);

    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetCostCenterEmployee";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null" && data.length > 0) {
                    for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                        var option = document.createElement("option");
                        option.setAttribute("value", data[arrayCount].EmployeeNumber);
                        option.innerHTML = data[arrayCount].LastName + ", " + data[arrayCount].FirstName;
                        timeCardWO_UserNameDropDown.append(option);
                    }

                    userNameemployeeNumber = decryptStr(getLocal("EmployeeNumber"));

                    if (!IsStringNullOrEmpty(userNameemployeeNumber)) {
                        timeCardWO_UserNameDropDown.val(userNameemployeeNumber);
                    }

                    timeCardWO_UserNameDropDown.selectmenu("refresh", true);
                }
                else {
                    var errorMsg = GetTranslatedValue("NotConfigured");
                    setTimeout(function () {
                        showError(errorMsg);
                    }, 500)
                }

                if (getLocal("TimeCard_WorkOrderSource") != "LaborEntryEdit" && getLocal("TimeCard_WorkOrderSource") !== "DailyViewEntryEdit") {
                    timeCardWO_WorkOrderNumberSearchTextBox.val(localStorage.getItem("WorkOrderNumber"));
                    TimeCardWO_WorkOrderSearch();
                }
            }
            else {
                showError(data.Message);
            }
        });
    }
    else {
        showError(noNetworkTranslation);
    }
}

function TimeCardWO_UserNameChanged() {
    setLocal("TimeCard_EmployeeNumber", timeCardWO_UserNameDropDown.val());
    timeCardWO_UserNameDropDown.selectmenu("refresh", true);
}
