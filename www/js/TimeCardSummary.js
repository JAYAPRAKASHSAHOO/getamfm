function TCS_TanslationComplete() {
    TCS_NoNetworkTranslation = GetTranslatedValue("NoNetwork");
}

function TimeCardSummaryPageSecurity(SgstCollection) {
    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CreateButton", "CanAccess")) {
        CreateButton = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CreateButton", "ReadOnly")) {
            $('#TCS_TimeCardCreateButton').addClass('ui-disabled');
        }
        else {
            $('#TCS_TimeCardCreateButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        CreateButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardDailyView", "CanAccess")) {
        TimeCardDailyView = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardDailyView", "ReadOnly")) {
            $('#TCS_DailyView').addClass('ui-disabled');
        } else {
            $('#TCS_DailyView').removeClass('ui-disabled');
        }
    } else {
        TimeCardDailyView = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "EntryButton", "CanAccess")) {
        EntryButton = true;
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "EntryButton", "ReadOnly")) {
            $('#TCS_ViewWorkOrder').addClass('ui-disabled');
        }
        else {
            $('#TCS_ViewWorkOrder').removeClass('ui-disabled');
        } // end of else
    }
    else {
        EntryButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WorkOrderButton", "CanAccess")) {
        WorkOrderButton = true;
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "WorkOrderButton", "ReadOnly")) {
            $('#TCS_WorkOrderDetails').addClass('ui-disabled');
        }
        else {
            $('#TCS_WorkOrderDetails').removeClass('ui-disabled');
        } // end of else
    }
    else {
        WorkOrderButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "NonAppliedButton", "CanAccess")) {
        NonAppliedButton = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "NonAppliedButton", "ReadOnly")) {
            $('#TCS_NonApplied').addClass('ui-disabled');
        }
        else {
            $('#TCS_NonApplied').removeClass('ui-disabled');
        } // end of else
    }
    else {
        NonAppliedButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "CanAccess")) {
        SaveButton = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "ReadOnly")) {
            $('#TCS_DollarsSaveButton').addClass('ui-disabled');
        }
        else {
            $('#TCS_DollarsSaveButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        SaveButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "CanAccess")) {
        ResetButton = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ResetButton", "ReadOnly")) {
            $('#TCS_DollarsCancelButton').addClass('ui-disabled');
        }
        else {
            $('#TCS_DollarsCancelButton').removeClass('ui-disabled');
        } // end of else
    }
    else {
        ResetButton = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardCollapsibleSet", "CanAccess")) {
        TimeCardCollapsibleSet = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardCollapsibleSet", "ReadOnly")) {
            $('#TCS_TimeCardData').addClass('ui-disabled');
        }
        else {
            $('#TCS_TimeCardData').removeClass('ui-disabled');
        } // end of else
    }
    else {
        TimeCardCollapsibleSet = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "HoursCollapsibleSet", "CanAccess")) {
        HoursCollapsibleSet = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "HoursCollapsibleSet", "ReadOnly")) {
            $('#TCS_HoursData').addClass('ui-disabled');
        }
        else {
            $('#TCS_HoursData').removeClass('ui-disabled');
        } // end of else
    }
    else {
        HoursCollapsibleSet = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DollarsCollapsibleSet", "CanAccess")) {
        DollarsCollapsibleSet = true;

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DollarsCollapsibleSet", "ReadOnly")) {
            $('#TCS_DollarsData').addClass('ui-disabled');
        }
        else {
            $('#TCS_DollarsData').removeClass('ui-disabled');
        } // end of else
    }
    else {
        DollarsCollapsibleSet = false;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "NonAppliedLabel", "CanAccess")) {
        NonAppliedLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OrdersLabel", "CanAccess")) {
        OrdersLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "BalanceLabel", "CanAccess")) {
        BalanceLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "RegularHoursLabel", "CanAccess")) {
        RegularHoursLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "OverTimeHoursLabel", "CanAccess")) {
        OverTimeHoursLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "TimeCardHoursLabel", "CanAccess")) {
        TimeCardHoursLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "AdjustmentsValueLabel", "CanAccess")) {
        AdjustmentsValueLabel = true;
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "BonusValueTextBox", "CanAccess")) {
        BonusValueTextBox = true;
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "BonusValueTextBox", "ReadOnly")) {
            $('#TCS_BonusLabel').attr('readonly', 'readonly');
            $('#TCS_BonusValueInput').attr('readonly', 'readonly');
        }

        else {
            $('#TCS_BonusLabel').removeAttr("readonly");
            $('#TCS_BonusValueInput').removeAttr("readonly");
        }
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SpecialValueTextBox", "CanAccess")) {
        SpecialValueTextBox = true;
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "SpecialValueTextBox", "ReadOnly")) {
            $('#TCS_SpecialLabel').attr('readonly', 'readonly');
            $('#TCS_SpecialValueInput').attr('readonly', 'readonly');
        }

        else {
            $('#TCS_SpecialLabel').removeAttr("readonly");
            $('#TCS_SpecialValueInput').removeAttr("readonly");
        }
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "DeductValueTextBox", "CanAccess")) {
        DeductValueTextBox = true;
    }
    else {
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "DeductValueTextBox", "ReadOnly")) {
            $('#TCS_DeductLabel').attr('readonly', 'readonly');
            $('#TCS_DeductValueInput').attr('readonly', 'readonly');
        }

        else {
            $('#TCS_DeductLabel').removeAttr("readonly");
            $('#TCS_DeductValueInput').removeAttr("readonly");
        }
    }

}

function HideShowControls(showLabel) {
    switch (showLabel) {
        case "HideAll":
            $('#TCS_TimeCardCreateButton').hide();
            $('#TCS_DailyView').hide();
            $('#TCS_ViewWorkOrder').hide();
            $('#TCS_WorkOrderDetails').hide();
            $('#TCS_NonApplied').hide();

            $('#TCS_TimeCardData').hide();
            $('#TCS_NonAppl').hide();
            $('#TCS_Order').hide();
            $('#TCS_Balance').hide();

            $('#TCS_HoursData').hide();
            $('#TCS_RegHours').hide();
            $('#TCS_OT').hide();
            $('#TCS_TimeCardTotal').hide();

            $('#TCS_DollarsData').hide();
            $('#TCS_Adjustments').hide();
            $('#TCS_Bonus').hide();
            $('#TCS_Special').hide();
            $('#TCS_Deduct').hide();
            $('#TCS_DollarsSaveButton').hide();
            $('#TCS_DollarsCancelButton').hide();

            break;
        case "ShowAll":
            $('#TCS_TimeCardCreateButton').hide();

            if (TimeCardDailyView == true) {
                $('#TCS_DailyView').show();
            }

            if (EntryButton == true) {
                $('#TCS_ViewWorkOrder').show();
            }

            if (WorkOrderButton == true) {
                $('#TCS_WorkOrderDetails').show();
            }

            if (NonAppliedButton == true) {
                $('#TCS_NonApplied').show();
            }

            if (TimeCardCollapsibleSet == true) {
                $('#TCS_TimeCardData').show();
            }

            if (NonAppliedLabel == true) {
                $('#TCS_NonAppl').show();
            }

            if (OrdersLabel == true) {
                $('#TCS_Order').show();
            }

            if (BalanceLabel == true) {
                $('#TCS_Balance').show();
            }


            if (HoursCollapsibleSet == true) {
                $('#TCS_HoursData').show();
            }

            if (RegularHoursLabel == true) {
                $('#TCS_RegHours').show();
            }

            if (OverTimeHoursLabel == true) {
                $('#TCS_OT').show();
            }

            if (TimeCardHoursLabel == true) {
                $('#TCS_TimeCardTotal').show();
            }

            if (DollarsCollapsibleSet == true) {
                $('#TCS_DollarsData').show();
            }

            if (AdjustmentsValueLabel == true) {
                $('#TCS_Adjustments').show();
            }

            if (BonusValueTextBox == true) {
                $('#TCS_Bonus').show();
            }

            if (SpecialValueTextBox == true) {
                $('#TCS_Special').show();
            }

            if (DeductValueTextBox == true) {
                $('#TCS_Deduct').show();
            }

            if (SaveButton == true) {
                $('#TCS_DollarsSaveButton').show();
            }

            if (ResetButton == true) {
                $('#TCS_DollarsCancelButton').show();
            }

            break;
        case "NoTimeCard":

            if (CreateButton == true) {
                $('#TCS_TimeCardCreateButton').show();
            }

            $('#TCS_DailyView').hide();
            $('#TCS_ViewWorkOrder').hide();
            $('#TCS_WorkOrderDetails').hide();
            $('#TCS_NonApplied').hide();

            if (TimeCardCollapsibleSet == true) {
                $('#TCS_TimeCardData').show();
            }

            if (NonAppliedLabel == true) {
                $('#TCS_NonAppl').show();
            }

            $('#TCS_Order').hide();
            $('#TCS_Balance').hide();

            $('#TCS_HoursData').hide();
            $('#TCS_RegHours').hide();
            $('#TCS_OT').hide();
            $('#TCS_TimeCardTotal').hide();

            $('#TCS_DollarsData').hide();
            $('#TCS_Adjustments').hide();
            $('#TCS_Bonus').hide();
            $('#TCS_Special').hide();
            $('#TCS_Deduct').hide();
            $('#TCS_DollarsSaveButton').hide();
            $('#TCS_DollarsCancelButton').hide();

            break;
    }
}

function TCS_NavigateNext(control) {
    if (navigator.onLine) {
        switch (control.id) {
            case "TCS_DailyViewButton":
            case "TCS_ViewWorkOrderButton":
                setLocal("TimeCard_View", control.id);
                $.mobile.changePage("TimeCardEntry.html");
                break;
            case "TCS_WorkOrderDetailsButton":
                setLocal("TimeCard_WorkOrderSource", "TimeCardSummary");
                $.mobile.changePage("TimeCardWO.html");
                break;
            case "TCS_NonAppliedButton":
                setLocal("TimeCard_NonAppliedSource", "TimeCardSummary");
                $.mobile.changePage("TimeCardNA.html");
                break;
            case "TCSbackButton":
                setLocal("TimeCard_Source", "TimeCardSummary");
                $.mobile.changePage("TimeCard.html");
                break;
        }
    }
    else {
        showError(TCS_NoNetworkTranslation);
    }
}

function SetCreate() {
    var myJSONobject = {
        "Language": getLocal("Language"),
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "TimeCard_EmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
        "TimeCard_SundayDate": getLocal("TimeCard_SundayDate"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
    };

    $('#TCS_SubHeaderLabel').text(getLocal("TimeCard_WeekRange"));
    var accessURL = standardAddress + "TimeCard.ashx?Method=SetCreate";
    if (navigator.onLine) {
        showLoading();
        $.postJSON(accessURL, myJSONobject, function (data) {
            if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                if (data != null && data != "null") {
                    $('#TCS_TimeCardHeader').text(GetTranslatedValue("TCS_TimeCardHeader"));
                    $('#TCS_TimeCardDefaultTimings').val(data.TimeCardDefaultTimings);
                    if (data.TimeCardEntryExists) {
                        HideShowControls("ShowAll");
                        BindTimeCardData(data);
                    }
                    else {
                        closeLoading();
                        HideShowControls("NoTimeCard");
                        $('#TCS_NonApplValueLabel').text("0.00");
                    }
                }
            }
            else {
                closeLoading();
                setTimeout(function () {
                    showError(data.Message);
                }, 500);

            }
        });
    }
    else {
        showError(TCS_NoNetworkTranslation);
    }
}

function CreateTimeCard(control) {
    var TCSpageID = $.mobile.activePage.attr('id');

    var type;
    switch (control) {
        case true:
            type = "Standard";
            break;
        case false:
            type = "NonStandard";
            break;
        case "SaveDollars":
            var errMsg = ValidateInput();
            if (errMsg == '') {
                type = "DollarsUpdate";
            }
            else {
                showError(errMsg);
                return;
            }
            break;
    }

    if (type != '' || type != undefined || type != null) {

        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": decryptStr(getLocal("DatabaseID")),
            "TimeCard_EmployeeNumber": getLocal("TimeCard_EmployeeNumber"),
            "TimeCard_SundayDate": getLocal("TimeCard_SundayDate"),
            "Type": type,
            "Bonus": $('#TCS_BonusValueInput').val(),
            "Special": $('#TCS_SpecialValueInput').val(),
            "Deduct": $('#TCS_DeductValueInput').val(),
            "TimeIn": $('#TCS_DefaultTimeIn').val(),
            "MealOut": $('#TCS_DefaultMealOut').val(),
            "MealIn": $('#TCS_DefaultMealIn').val(),
            "TimeOut": $('#TCS_DefaultTimeOut').val(),
            "GPSLocation": GlobalLat + "," + GlobalLong,
            "SessionID": decryptStr(getLocal("SessionID")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
        };
        
        var accessURL = standardAddress + "TimeCard.ashx?Method=SetTimecardAdd";
        if (navigator.onLine) {
            showLoading();
            $.postJSON(accessURL, myJSONobject, function (data) {
                if (IsObjectNullOrUndefined(data.ErrorOrException)) {
                    if (data != null && data != "null") {
                        switch (data) {
                            case "DollarsUpdateSuccess":
                                DollarUpdateFields('Updated');
                                closeLoading();
                                setTimeout(function () {
                                    ////showError("Updated successfully");
                                    showError(GetTranslatedValue("UpdateSuccess"));
                                }, 500);
                                break;
                            case "DollarsUpdateFailed":
                                DollarUpdateFields('cancel');
                                closeLoading();
                                setTimeout(function () {
                                    ////showError("Update failed.");
                                    showError(GetTranslatedValue("UpdateFail"));
                                }, 500);
                                break;
                            case "TimeCardAddFailed":
                                closeLoading();
                                setTimeout(function () {
                                    ////showError("Time card entry failed.");
                                    showError(GetTranslatedValue("TimeCardFail"));
                                }, 500);
                                break;
                            default:
                                $("#" + "cmpPopup").popup("close");
                                HideShowControls("ShowAll");
                                BindTimeCardData(data);
                                break;
                        }
                    }
                }
                else {
                    closeLoading();
                    setTimeout(function () {
                        showError(data.Message);
                    }, 500);
                }
            });
        }
        else {
            showError(TCS_NoNetworkTranslation);
        }
    }
}

function BindTimeCardData(data) {
    $('#TCS_RegHoursValueLabel').text(GetDecimal(data.Regular, 2, true));
    $('#TCS_OTValueLabel').text(GetDecimal(data.OT, 2, true));
    $('#TCS_TimeCardTotalValueLabel').text(GetDecimal(data.TimeCardTotal, 2, true));

    $('#TCS_NonApplValueLabel').text(GetDecimal(data.NonApplied, 2, true));
    $('#TCS_OrdersValueLabel').text(GetDecimal(data.OrdersSum, 2, true));
    $('#TCS_BalanceValueLabel').text(GetDecimal(data.Balance, 2, true));

    $('#TCS_BonusValueInput').val(GetDecimal(data.Bonus, 2, false));
    $('#TCS_SpecialValueInput').val(GetDecimal(data.Special, 2, false));
    $('#TCS_DeductValueInput').val(GetDecimal(data.Deduct, 2, false));

    $('#TCS_BonusHidden').val(GetDecimal(data.Bonus, 2, false));
    $('#TCS_SpecialHidden').val(GetDecimal(data.Special, 2, false));
    $('#TCS_DeductHidden').val(GetDecimal(data.Deduct, 2, false));

    CalcSumAdjust();
    closeLoading();
}

function AskCreateQuestion() {
    var pageID = $.mobile.activePage.attr('id');
    var page = $("#" + pageID);
    var message = $('#TCS_CreateTimeCardMessage').text();
    var defaultTime = $('#TCS_TimeCardDefaultTimings').val()
////    message = message.replace('XX', defaultTime);
    message = message.replace('XX', '');
    var primaryBtnLabel = $('#TCS_PopUpPrimaryBtnLabel').text();
    var secondaryBtnLabel = $('#TCS_PopUpSecondaryBtnLabel').text();

    var timeinddl = page.find("#TCS_DefaultTimeIn");
    var mealoutddl = page.find("#TCS_DefaultMealOut");
    var mealinddl = page.find("#TCS_DefaultMealIn");
    var timeoutddl = page.find("#TCS_DefaultTimeOut");

    var timeData = defaultTime.split("-");

    var timein = timeData[0].split(";");
    var timeout = timeData[1].split(";");
    var mealin = timeData[2].split(";");
    var mealout = timeData[3].split(";");

    timeinddl.empty(); mealoutddl.empty(); mealinddl.empty(); timeoutddl.empty();
        for (var arrayCount = 0; arrayCount < timein.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", timein[arrayCount]);
                option.innerHTML = timein[arrayCount];
                timeinddl.append(option);
            }
        for (var arrayCount = 0; arrayCount < timein.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", mealout[arrayCount]);
                option.innerHTML = mealout[arrayCount];
                mealoutddl.append(option);
            }

        for (var arrayCount = 0; arrayCount < timein.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", mealin[arrayCount]);
                option.innerHTML = mealin[arrayCount];
                mealinddl.append(option);
            }
        for (var arrayCount = 0; arrayCount < timein.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", timeout[arrayCount]);
                option.innerHTML = timeout[arrayCount];
                timeoutddl.append(option);
            }


    $("#" + pageID + " #TCS_DefaultTimeIn option:first").attr('selected', 'selected');
    $("#" + pageID + " #TCS_DefaultTimeIn").selectmenu("refresh", true);
    $("#" + pageID + " #TCS_DefaultMealOut option:first").attr('selected', 'selected');
    $("#" + pageID + " #TCS_DefaultMealOut").selectmenu("refresh", true);
    $("#" + pageID + " #TCS_DefaultMealIn option:first").attr('selected', 'selected');
    $("#" + pageID + " #TCS_DefaultMealIn").selectmenu("refresh", true);
    $("#" + pageID + " #TCS_DefaultTimeOut option:first").attr('selected', 'selected');
    $("#" + pageID + " #TCS_DefaultTimeOut").selectmenu("refresh", true);

    ////    showConfirmation(message, primaryBtnLabel, secondaryBtnLabel, 'CreateTimeCard');
    showTimeCardConfirmation(message, primaryBtnLabel, secondaryBtnLabel, 'ShowDefaultTime','CreateTimeCard');
}

function CalcSumAdjust() {
    var bonus = $('#TCS_BonusValueInput').val();
    var special = $('#TCS_SpecialValueInput').val();
    var deduct = $('#TCS_DeductValueInput').val();

    if (bonus == '') {
        $('#TCS_BonusValueInput').val("0.00");
        bonus = 0.00;
    }
    else {
        $('#TCS_BonusValueInput').val(GetDecimal(bonus, 2, false));
    }

    if (special == '') {
        $('#TCS_SpecialValueInput').val("0.00");
        special = 0.00;
    }
    else {
        $('#TCS_SpecialValueInput').val(GetDecimal(special, 2, false));
    }

    if (deduct == '') {
        $('#TCS_DeductValueInput').val("0.00");
        deduct = 0.00;
    }
    else {
        $('#TCS_DeductValueInput').val(GetDecimal(deduct, 2, false));
    }

    var total = 0.0;
    try {
        total = (parseFloat(bonus) + parseFloat(special)) - parseFloat(deduct);
        if (isNaN(total)) {
            total = 0.0;
        }

        $('#TCS_AdjustmentsTotal').text(GetDecimal(total, 2, true));
    }
    catch (Error) {
        $('#TCS_AdjustmentsTotal').text("0.00");
        showerror(Error.Message);
    }

    return total;
}

function DollarUpdateFields(action) {
    switch (action) {
        case "cancel":
            $('#TCS_BonusValueInput').val($('#TCS_BonusHidden').val());
            $('#TCS_SpecialValueInput').val($('#TCS_SpecialHidden').val());
            $('#TCS_DeductValueInput').val($('#TCS_DeductHidden').val());
            CalcSumAdjust();
            break;
        case "Updated":
            $('#TCS_BonusHidden').val($('#TCS_BonusValueInput').val());
            $('#TCS_SpecialHidden').val($('#TCS_SpecialValueInput').val());
            $('#TCS_DeductHidden').val($('#TCS_DeductValueInput').val());
            break;
    }
}

function ValidateInput() {
    var bonus = $('#TCS_BonusValueInput').val();
    var special = $('#TCS_SpecialValueInput').val();
    var deduct = $('#TCS_DeductValueInput').val();
    var errorMessage = '';

    if (bonus == '' || bonus < 0 || bonus > 99999.99 || bonus == undefined) {
        errorMessage = GetTranslatedValue('TCS_BonusValueInputErrorMsg');
    }

    if (special == '' || special < 0 || special > 99999.99 || special == undefined) {
        errorMessage = errorMessage + '<br />' + GetTranslatedValue('TCS_SpecialValueInputErrorMsg');
    }

    if (deduct == '' || deduct < 0 || deduct > 99999.99 || deduct == undefined) {
        errorMessage = errorMessage + '<br />' + GetTranslatedValue('TCS_DeductValueInputErrorMsg');
    }
    return errorMessage;
}

function ShowDefaultTime() {
 var TCSpageID = $.mobile.activePage.attr('id');
    $("#" + TCSpageID + "ConfirmationPopup-screen").hide();
    $("#"+ "cmpPopup").popup("open");
}

function showTimeCardConfirmation(ConfirmationMessage, PrimaryConfirmText, SecondaryConfirmText, yesCallback, noCallback) {
    var pageID = $.mobile.activePage.attr('id');
    document.getElementById(pageID + "ConfirmationText").innerHTML = ConfirmationMessage;
    $("#" + pageID + 'confirmYesButton .ui-btn-inner .ui-btn-text').text(PrimaryConfirmText);
    $("#" + pageID + 'confirmNoButton .ui-btn-inner .ui-btn-text').text(SecondaryConfirmText);
    $("#" + pageID + 'confirmYesButton').attr('onclick', 'closeConfirmation(true, ' + yesCallback + ')');
    $("#" + pageID + 'confirmNoButton').attr('onclick', 'closeConfirmation(false, ' + noCallback + ')');
    //$("#" + pageID + "ConfirmationPopup").popup("open");
    $("#" + pageID + "ConfirmationPopup").attr('style', 'display:block');
    $("#" + pageID + "ConfirmationPopup").popup().popup("open");
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchstart", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchmove", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchend", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchcancel", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-popup").addEventListener("touchmove", touchHandler, false);
}