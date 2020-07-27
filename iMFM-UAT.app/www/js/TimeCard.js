//var timeCardPageID = "TimeCard";
//var timeCardPage = $("#" + timeCardPageID);
//var yearDropDown = timeCardPage.find("#YearDropDown");
//var monthDropDown = timeCardPage.find("#MonthDropDown");
//var weekDropDown = timeCardPage.find("#WeekDropDown");
//var periodValueLabel = timeCardPage.find("#PeriodValueLabel");
//var userNameDropDown = timeCardPage.find("#UserNameDropDown");
//var timeCardPopup = timeCardPage.find("#TimeCardPopUp");
//var divisonSummary = timeCardPage.find("#DivisionSummaryButton");
//var costCenterSummary = timeCardPage.find("#CostCenterSummaryButton");
//var userNameSummary = timeCardPage.find("#UserNameSummaryButton");
//var divisionValueLabel = timeCardPage.find("#DivisionValueLabel");
//var divisionValueHidden = timeCardPage.find("#DivisionValueHidden");
//var costCenterValueLabel = timeCardPage.find("#CostCenterValueLabel");
//var costCenterValueHidden = timeCardPage.find("#CostCenterValueHidden");
//var popUpHeader2Label = timeCardPage.find("#PopUpHeader2Label");
//var accumulatedValueLabel = timeCardPage.find("#AccumulatedValueLabel");
//var billableValueLabel = timeCardPage.find("#BillableValueLabel");
//var contractValueLabel = timeCardPage.find("#ContractValueLabel");
//var nonAppliedValueLabel = timeCardPage.find("#NonAppliedValueLabel");
//var differenceValueLabel = timeCardPage.find("#DifferenceValueLabel");

//var divisionSummaryEnabled = true;
//var userNameSummaryEnabled = true;
//var costCenterSummaryEnabled = true;

//var glPeriod = [];
//var weekList = [];
//var monthName = [];
//var yearTranslation;
//var monthTranslation;
//var weekTranslation;
//var userNameTranslation;
//var cannotBeEmptyTranslation;
//var noNetworkTranslation;

function TimeCardPageSecurity(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr('id');

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "YearDropDown", "CanAccess")) {
        $(pageID).find("#YearDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "YearDropDown", "ReadOnly")) {
            $("#YearDropDown").attr("Requried", "true");
            $("#YearMandatoryLabel").show();
            $('#YearDropDown').prop("disabled", false);
        }
        else {
            $("#YearMandatoryLabel").hide();
            $('#YearDropDown').prop("disabled", true);
        }
    }


    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "MonthDropDown", "CanAccess")) {
        $(pageID).find("#MonthDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "MonthDropDown", "ReadOnly")) {
            $("#MonthDropDown").attr("Requried", "true");
            $("#MonthMandatoryLabel").show();
            $('#MonthDropDown').prop("disabled", false);
        }
        else {
            $(pageID).find("#MonthMandatoryLabel").hide();
            $(pageID).find('#MonthDropDown').prop("disabled", true);
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "UserNameDropDown", "CanAccess")) {
        $(pageID).find("#UserNameDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "UserNameDropDown", "ReadOnly")) {
            $("#UserNameDropDown").attr("Requried", "true");
            $("#UserNameMandatoryLabel").show();
            $('#UserNameDropDown').prop("disabled", false);
        }
        else {
            $(pageID).find("#UserNameMandatoryLabel").hide();
            $(pageID).find('#UserNameDropDown').prop("disabled", true);
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WeekDropDown", "CanAccess")) {
        $(pageID).find("#WeekDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WeekDropDown", "ReadOnly")) {
            $("#WeekDropDown").attr("Requried", "true");
            $("#WeekMandatoryLabel").show();
            $('#WeekDropDown').prop("disabled", false);
        }
        else {
            $(pageID).find("#WeekMandatoryLabel").hide();
            $(pageID).find('#WeekDropDown').prop("disabled", true);
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PeriodValueLabel", "CanAccess")) {
        $(pageID).find("#PeriodValueDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PeriodValueLabel", "ReadOnly")) {
            $('#PeriodValueLabel').removeAttr("readonly");
        }
        else {
            $('#PeriodValueLabel').attr('readonly', 'readonly');
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DivisionValueLabel", "CanAccess")) {
        $(pageID).find("#DivisionValueDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DivisionValueLabel", "ReadOnly")) {
            $('#DivisionValueLabel').removeAttr("readonly");
        }
        else {
            $('#DivisionValueLabel').attr('readonly', 'readonly');
        }
    }

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CostCenterValueLabel", "CanAccess")) {
        $(pageID).find("#CostCenterValueDiv").hide();
    }
    else {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CostCenterValueLabel", "ReadOnly")) {
            $('#CostCenterValueLabel').removeAttr("readonly");
        }
        else {
            $('#CostCenterValueLabel').attr('readonly', 'readonly');
        }
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DivisionSummaryButton", "CanAccess")) {
        $("#DivisionSummaryButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DivisionSummaryButton", "ReadOnly")) {
            $('#DivisionSummaryButton').addClass('ui-disabled');
            divisionSummaryEnabled = false;
        }
        else {
            $('#DivisionSummaryButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#DivisionSummaryButton").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CostCenterSummaryButton", "CanAccess")) {
        $("#CostCenterSummaryButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CostCenterSummaryButton", "ReadOnly")) {
            $('#CostCenterSummaryButton').addClass('ui-disabled');
            costCenterSummaryEnabled = false;
        }
        else {
            $('#CostCenterSummaryButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#CostCenterSummaryButton").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "UserNameSummaryButton", "CanAccess")) {
        $("#UserNameSummaryButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "UserNameSummaryButton", "ReadOnly")) {
            $('#UserNameSummaryButton').addClass('ui-disabled');
            userNameSummaryEnabled = false;
        }
        else {
            $('#UserNameSummaryButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#UserNameSummaryButton").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "NavigateNextButton", "CanAccess")) {
        $("#NavigateNextButton").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "NavigateNextButton", "ReadOnly")) {
            $('#NavigateNextButton').addClass('ui-disabled');
        }
        else {
            $('#NavigateNextButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#NavigateNextButton").hide();
    }

    LoadTranslation(timeCardPageID, TimeCard_TranslationLoadComplete);
}

function TimeCard_TranslationLoadComplete() {
    monthName[0] = GetTranslatedValue("January");
    monthName[1] = GetTranslatedValue("February");
    monthName[2] = GetTranslatedValue("March");
    monthName[3] = GetTranslatedValue("April");
    monthName[4] = GetTranslatedValue("May");
    monthName[5] = GetTranslatedValue("June");
    monthName[6] = GetTranslatedValue("July");
    monthName[7] = GetTranslatedValue("August");
    monthName[8] = GetTranslatedValue("September");
    monthName[9] = GetTranslatedValue("October");
    monthName[10] = GetTranslatedValue("November");
    monthName[11] = GetTranslatedValue("December");

    yearDropDown.children("option:eq(0)").text(GetTranslatedValue("YearSelect")).val(defaultDropDownValue);
    monthDropDown.children("option:eq(0)").text(GetTranslatedValue("MonthSelect")).val(defaultDropDownValue);
    weekDropDown.children("option:eq(0)").text(GetTranslatedValue("WeekSelect")).val(defaultDropDownValue);
    userNameDropDown.children("option:eq(0)").text(GetTranslatedValue("UserNameSelect")).val(defaultDropDownValue);

    yearTranslation = GetTranslatedValue("Year");
    monthTranslation = GetTranslatedValue("Month");
    weekTranslation = GetTranslatedValue("Week");
    userNameTranslation = GetTranslatedValue("UserName");
    cannotBeEmptyTranslation = GetTranslatedValue("CannotBeEmpty");
    noNetworkTranslation = GetTranslatedValue("NoNetwork");

    periodValueLabel.text(notSetTranslation);
    divisionValueLabel.text(notSetTranslation);
    costCenterValueLabel.text(notSetTranslation);

    var source = getLocal("TimeCard_Source");

    if (source == "TimeCardSummary") {
        localStorage.removeItem("TimeCard_Source");
    }
    else {
        localStorage.removeItem("TimeCard_Source");
        localStorage.removeItem("TimeCard_Year");
        localStorage.removeItem("TimeCard_Month");
        localStorage.removeItem("TimeCard_SundayDate");
        localStorage.removeItem("TimeCard_EmployeeNumber");
    }

    LoadGLPeriodYear();
    LoadCostCenterEmployee();
}

function LoadGLPeriodYear() {
    ClearGLPeriodValues(true, true, true);

    var yearArray = [];
    var arrayCount = 0;

    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetGLPeriod";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                var currentPeriodYear = null;

                if (data != null && data != "null" && data.length > 0) {
                    for (; arrayCount < data.length; arrayCount++) {
                        data[arrayCount].DateFrom = GetDateObjectFromInvariantDateString(data[arrayCount].DateFromString);
                        data[arrayCount].DateTo = GetDateObjectFromInvariantDateString(data[arrayCount].DateToString);

                        data[arrayCount].GLPeriodYear = Number(String(data[arrayCount].GLPeriodNumber).substring(0, 4));
                        data[arrayCount].GLPeriodMonth = Number(String(data[arrayCount].GLPeriodNumber).substring(4, 6));

                        yearArray.push(data[arrayCount].GLPeriodYear);

                        if (data[arrayCount].CurrentPeriod) {
                            currentPeriodYear = data[arrayCount].GLPeriodYear;
                        }
                    }

                    glPeriod = data;
                    yearArray = GetUniqueElements(yearArray);
                    yearArray.sort(NumberSortHelper);

                    for (arrayCount = 0; arrayCount < yearArray.length; arrayCount++) {
                        var option = document.createElement("option");
                        option.setAttribute("value", yearArray[arrayCount]);
                        option.innerHTML = yearArray[arrayCount];
                        yearDropDown.append(option);
                    }
                }

                var year = getLocal("TimeCard_Year");

                if (!IsStringNullOrEmpty(year)) {
                    yearDropDown.val(year);
                    yearDropDown.selectmenu("refresh", true);
                    LoadGLPeriodMonth();

                    localStorage.removeItem("TimeCard_Year");
                } else if (!IsStringNullOrEmpty(currentPeriodYear)) {
                    yearDropDown.val(currentPeriodYear);
                    yearDropDown.selectmenu("refresh", true);
                    LoadGLPeriodMonth();
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

function LoadGLPeriodMonth() {
    ClearGLPeriodValues(false, true, true);

    if (yearDropDown.val() != defaultDropDownValue) {
        var monthArray = [];
        var selectedYear = yearDropDown.val();
        var arrayCount = 0;
        var currentPeriodMonth = null;

        for (; arrayCount < glPeriod.length; arrayCount++) {
            if (glPeriod[arrayCount].GLPeriodYear == selectedYear) {
                monthArray.push(glPeriod[arrayCount].GLPeriodMonth);

                if (glPeriod[arrayCount].CurrentPeriod) {
                    currentPeriodMonth = glPeriod[arrayCount].GLPeriodMonth;
                }
            }
        }

        monthArray.sort(NumberSortHelper);

        for (arrayCount = 0; arrayCount < monthArray.length; arrayCount++) {
            var option = document.createElement("option");
            option.setAttribute("value", monthArray[arrayCount]);
            option.innerHTML = monthName[monthArray[arrayCount] - 1];
            monthDropDown.append(option);
        }

        var month = getLocal("TimeCard_Month");

        if (!IsStringNullOrEmpty(month)) {
            monthDropDown.val(month);
            monthDropDown.selectmenu("refresh", true);
            LoadGLPeriodWeek();

            localStorage.removeItem("TimeCard_Month");
        } else if (!IsStringNullOrEmpty(currentPeriodMonth)) {
            monthDropDown.val(currentPeriodMonth);
            monthDropDown.selectmenu("refresh", true);
            LoadGLPeriodWeek();
        }
        else {
            closeActionPopupLoading();
        }
    }
    else {
        closeActionPopupLoading();
    }

    RefreshSummaryButton();
}

function LoadGLPeriodWeek() {
    showActionPopupLoading();
    ClearGLPeriodValues(false, false, true);

    if (yearDropDown.val() != defaultDropDownValue && monthDropDown.val() != defaultDropDownValue) {
        var glPeriodObject = GetSelectedGLPeriod();

        if (IsStringNullOrEmpty(glPeriodObject.GLPeriodMonthRange)) {
            periodValueLabel.text(notSetTranslation);
        }
        else {
            periodValueLabel.text(glPeriodObject.GLPeriodMonthRange);
        }

        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "GLPeriod": glPeriodObject.GLPeriodNumber,
            "DateFrom": GetInvariantDateString(glPeriodObject.DateFrom),
            "DateTo": GetInvariantDateString(glPeriodObject.DateTo),
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };

        var accessURL = standardAddress + "TimeCard.ashx?Method=GetGLPeriodWeek";

        if (navigator.onLine) {
            $.postJSON(accessURL, myJSONobject, function (data) {
                if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                    if (data != null && data != "null" && data.length > 0) {
                        var sundayDate = GetDateObjectFromInvariantDateString(getLocal("TimeCard_SundayDate"));
                        var sundayDateString = GetInvariantDateString(sundayDate);

                        if (sundayDate != null) {
                            localStorage.removeItem("TimeCard_SundayDate");
                            localStorage.removeItem("TimeCard_WeekFrom");
                            localStorage.removeItem("TimeCard_WeekTo");
                        }

                        for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                            data[arrayCount].DateFrom = GetDateObjectFromInvariantDateString(data[arrayCount].DateFromString);
                            data[arrayCount].DateTo = GetDateObjectFromInvariantDateString(data[arrayCount].DateToString);
                            data[arrayCount].SundayDate = GetDateObjectFromInvariantDateString(data[arrayCount].SundayDateString);

                            var option = document.createElement("option");
                            option.setAttribute("value", arrayCount);
                            option.innerHTML = data[arrayCount].DateFrom.toLocaleDateString() + " - " + data[arrayCount].DateTo.toLocaleDateString();
                            weekDropDown.append(option);

                            if (sundayDate != null) {
                                if (GetInvariantDateString(data[arrayCount].SundayDate) == sundayDateString) {
                                    weekDropDown.val(arrayCount);
                                }
                            }
                        }

                        weekList = data;

                        weekDropDown.selectmenu("refresh", true);
                        closeActionPopupLoading();
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
    else {
        closeActionPopupLoading();
    }

    RefreshSummaryButton();
}

function UserNameChanged() {
    RefreshSummaryButton();
}

function GetSelectedGLPeriod() {
    var returnValue = new Object();
    returnValue.GLPeriodNumber;
    returnValue.DateFrom;
    returnValue.DateTo;
    returnValue.GLPeriodMonthRange = emptyString;

    var year = yearDropDown.val();
    var month = monthDropDown.val();

    if (!IsStringNullOrEmpty(year) && year != defaultDropDownValue && !IsStringNullOrEmpty(month) && month != defaultDropDownValue) {
        if (month.length == 1) {
            month = "0" + month;
        }

        returnValue.GLPeriodNumber = Number(year + month);

        for (var arrayCount = 0; arrayCount < glPeriod.length; arrayCount++) {
            if (glPeriod[arrayCount].GLPeriodNumber == returnValue.GLPeriodNumber) {
                returnValue.DateFrom = glPeriod[arrayCount].DateFrom;
                returnValue.DateTo = glPeriod[arrayCount].DateTo;
                break;
            }
        }

        returnValue.GLPeriodMonthRange = returnValue.DateFrom.toLocaleDateString() + " - " + returnValue.DateTo.toLocaleDateString();
    }

    return returnValue;
}

function ClearGLPeriodValues(clearYear, clearMonth, clearWeek) {
    if (clearYear) {
        yearDropDown.children("option:not(:first)").remove();
        yearDropDown.children("option:eq(0)").attr("selected", true);
        yearDropDown.selectmenu("refresh", true);
    }

    if (clearMonth) {
        monthDropDown.children("option:not(:first)").remove();
        monthDropDown.children("option:eq(0)").attr("selected", true);
        monthDropDown.selectmenu("refresh", true);

        periodValueLabel.text(notSetTranslation);
    }

    if (clearWeek) {
        weekDropDown.children("option:not(:first)").remove();
        weekDropDown.children("option:eq(0)").attr("selected", true);
        weekDropDown.selectmenu("refresh", true);
    }
}

function RefreshSummaryButton() {
    divisonSummary.addClass("ui-disabled");
    costCenterSummary.addClass("ui-disabled");
    userNameSummary.addClass("ui-disabled");

    var year = yearDropDown.val();
    var month = monthDropDown.val();
    var selectedEmployeeNumber = userNameDropDown.val();

    if (!IsStringNullOrEmpty(year) && year != defaultDropDownValue && !IsStringNullOrEmpty(month) && month != defaultDropDownValue) {
        if (!IsStringNullOrEmpty(divisionValueHidden.val())) {
            if (divisionSummaryEnabled) {
                divisonSummary.removeClass("ui-disabled");
            }
        }

        if (!IsStringNullOrEmpty(costCenterValueHidden.val())) {
            if (costCenterSummaryEnabled) {
                costCenterSummary.removeClass("ui-disabled");
            }
        }

        if (!IsStringNullOrEmpty(selectedEmployeeNumber) && selectedEmployeeNumber != defaultDropDownValue) {
            if (userNameSummaryEnabled) {
                userNameSummary.removeClass("ui-disabled");
            }
        }
    }
}

function LoadCostCenterEmployee() {
    userNameDropDown.val(defaultDropDownValue);
    userNameDropDown.selectmenu("refresh", true);

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
                        userNameDropDown.append(option);
                    }

                    var employeeNumber = getLocal("TimeCard_EmployeeNumber");

                    if (IsStringNullOrEmpty(employeeNumber)) {
                        employeeNumber = decryptStr(getLocal("EmployeeNumber"));

                        localStorage.removeItem("TimeCard_EmployeeNumber");
                    }

                    userNameDropDown.val(employeeNumber);
                    userNameDropDown.selectmenu("refresh", true);

                    divisionValueHidden.val(data[0].DivisionNumber);
                    divisionValueLabel.text(data[0].DivisionDescription);
                    costCenterValueHidden.val(data[0].CostCenterNumber);
                    costCenterValueLabel.text(data[0].CostCenterDescription);
                }
            }
            else {
                showError(data.Message);
            }

            RefreshSummaryButton();
        });
    }
    else {
        showError(noNetworkTranslation);
    }
}

function ShowSummary(option) {
    showActionPopupLoading();

    var divisionNumber = null;
    var costCenterNumber = null;
    var employeeNumber = null;

    var divisionNumberString = divisionValueHidden.val();

    if (!IsStringNullOrEmpty(divisionNumberString)) {
        divisionNumber = Number(divisionNumberString);
    }

    if (option >= 1) {
        var costCenterNumberString = costCenterValueHidden.val();

        if (!IsStringNullOrEmpty(costCenterNumberString)) {
            costCenterNumber = Number(costCenterNumberString);
        }
    }

    if (option == 2) {
        var employeeNumberString = userNameDropDown.val();

        if (!IsStringNullOrEmpty(employeeNumberString) && employeeNumberString != defaultDropDownValue) {
            employeeNumber = Number(employeeNumberString);
        }
    }

    var headerText = '';

    switch (option) {
        case 0:
            headerText = divisionValueLabel.text();
            break;

        case 1:
            headerText = costCenterValueLabel.text();
            break;

        case 2:
            headerText = userNameDropDown.children(":selected").text();
            break;
    }

    popUpHeader2Label.text(headerText);

    var glPeriodObject = GetSelectedGLPeriod();

    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "GLPeriod": glPeriodObject.GLPeriodNumber,
        "DateFrom": GetInvariantDateString(glPeriodObject.DateFrom),
        "DateTo": GetInvariantDateString(glPeriodObject.DateTo),
        "DivisionNumber": divisionNumber,
        "CostCenterNumber": costCenterNumber,
        "SelectedEmployeeNumber": employeeNumber,
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    var accessURL = standardAddress + "TimeCard.ashx?Method=GetSummary";

    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    accumulatedValueLabel.text(GetDecimal(data.TimeCardHours, 2, true));
                    billableValueLabel.text(GetDecimal(data.BillableHours, 2, true));
                    contractValueLabel.text(GetDecimal(data.ContractHours, 2, true));
                    nonAppliedValueLabel.text(GetDecimal(data.NonDistHours, 2, true));
                    differenceValueLabel.text(GetDecimal(data.BalanceSummary, 2, true));

                    closeActionPopupLoading();

                    setTimeout(function () {
                        timeCardPopup.popup("open");
                    }, 650);
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

function CloseTimeCardSummary() {
    timeCardPopup.popup("close");
}

function NavigateNext() {
    var validationMessage = emptyString;
    var validationSuccess = true;

    var year = yearDropDown.val();
    var month = monthDropDown.val();
    var week = weekDropDown.val();
    var userName = userNameDropDown.val();
    var division = divisionValueHidden.val();
    var costCenter = costCenterValueHidden.val();

    if (IsStringNullOrEmpty(division) || IsStringNullOrEmpty(costCenter)) {
        if (!IsStringNullOrEmpty(validationMessage)) {
            validationMessage += "<br/>";
        }

        validationMessage += "- " + GetTranslatedValue("NotConfigured");
        validationSuccess = false;
    }

    if (validationSuccess) {
        if (IsStringNullOrEmpty(year) || year == defaultDropDownValue) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("YearRequired");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(month) || month == defaultDropDownValue) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("MonthRequired");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(week) || week == defaultDropDownValue) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("WeekRequired");
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(userName) || userName == defaultDropDownValue) {
            if (!IsStringNullOrEmpty(validationMessage)) {
                validationMessage += "<br/>";
            }

            validationMessage += "- " + GetTranslatedValue("UserNameRequired");
            validationSuccess = false;
        }
    }

    if (validationSuccess) {
        setLocal("TimeCard_WeekRange", weekDropDown.children(":selected").text());
        setLocal("TimeCard_Year", yearDropDown.val());
        setLocal("TimeCard_Month", monthDropDown.val());
        setLocal("TimeCard_EmployeeNumber", userNameDropDown.val());

        var weekIndex = Number(weekDropDown.val());
        if (weekIndex >= 0 && weekIndex < weekList.length) {
            setLocal("TimeCard_SundayDate", GetInvariantDateString(weekList[weekIndex].SundayDate));
            setLocal("TimeCard_WeekFrom", GetInvariantDateString(weekList[weekIndex].DateFrom));
            setLocal("TimeCard_WeekTo", GetInvariantDateString(weekList[weekIndex].DateTo));
        }
        else {
            localStorage.removeItem("TimeCard_SundayDate");
            localStorage.removeItem("TimeCard_WeekFrom");
            localStorage.removeItem("TimeCard_WeekTo");
        }

        if (navigator.onLine) {
            $.mobile.changePage("TimeCardSummary.html");
        }
        else {
            showError(noNetworkTranslation);
        }
    }
    else {
        showError(validationMessage);
    }
}