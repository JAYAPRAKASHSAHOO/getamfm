var ajaxCalls = [];
var tempCalls = [];
$.postJSON = function (url, data, func, errorFunc) {
    var Logurl = url;
    var timeoutValue = 0;
    if (data && data.hasOwnProperty("SessionID") && (data.SessionID == "")) {
        timeoutValue = "5000"
    }
    setTimeout(function () {

        if (data && data.hasOwnProperty("SessionID") && (data.SessionID == "")) {
            data.SessionID = decryptStr(getLocal("SessionID"));
        }

        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
            {
                url: url,
                type: "post",
                //headers: { "cache-control": "no-cache" },
                headers: { "Origin": ORIGIN_HEADER },
                jsonp: "callback",
                datatype: "json",
                //timeout: parseInt(processTime),
                tryCount: 0,
                retryLimit: 3,
                //cache: false,
                data: data,
                success: function (result, textStatus, jqXHR) {
                    RemoveRequest(jqXHR.ID);
                    if (result[0] == "(" && result[result.length - 1] == ")") {
                        result = result.substring(1, result.length - 1);

                    }

                    if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                        LogoutCompletely();
                    } else {
                        if (result.length !== 0) {
                            result = JSON.parse(result);
                        }

                        func(result);
                    }
                },
                error: function (xhr, textStatus, jqXHR) {
                    if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                        LogoutCompletely();
                    } else {
                        var popupName;
                        RemoveRequest(jqXHR.ID);
                        var pageID = $.mobile.activePage.attr('id');
                        popupName = findPopupName(pageID);
                        var errorMsg = "";
                        if (textStatus == 'timeout') {
                            errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'error') {
                            errorMsg = GetCommonTranslatedValue("InternalError");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'abort') {
                            errorMsg = GetCommonTranslatedValue("RequestAborted");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'parsererror') {
                            errorMsg = GetCommonTranslatedValue("InternalParseError");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else {
                            errorMsg = GetCommonTranslatedValue("NetworkLost");
                            forcePopupClose(popupName, errorMsg);
                        }

                        if (errorFunc) {
                            errorFunc();
                        }
                        return;
                    }
                }
            });
        currentRequest.Request.ID = GenerateGuid();
        ajaxCalls.push(currentRequest);
    }, timeoutValue);
};

function findPopupName(pageID) {
    var myPopupName = "";
    if ($("#" + pageID + "loadingPopup").parent().hasClass("ui-popup-active")) {
        myPopupName = "loading";
    }
    else if ($("#" + pageID + "actionLoadingPopup").parent().hasClass("ui-popup-active")) {
        myPopupName = "processing";
    }
    else {
        myPopupName = "NoPopup";
    }
    return myPopupName;
}

function IsNetworkAlive() {
    setInterval(function () {
        data = iMFMJsonObject({});
        if (navigator.onLine) {
            $.ajax(
                       {
                           url: standardAddress + "Inspection.ashx?methodname=Connectivity",
                           type: "post",
                           headers: { "Origin": ORIGIN_HEADER },
                           jsonp: "callback",
                           datatype: "json",
                           timeout: 15000,
                           data: data,
                           success: function (result) {
                               if (result[0] == "(" && result[result.length - 1] == ")") {
                                   result = result.substring(1, result.length - 1);

                               }
                               if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                   LogoutCompletely();
                               } else {
                                   result = JSON.parse(result);
                               }
                           },
                           error: function (xhr, textStatus, jqXHR) {
                               if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                   LogoutCompletely();
                               } else {
                                   if (textStatus == 'timeout') {
                                   }
                               }
                           }
                       });
        }
    }, 8000);
}

function PostDone(data, textStatus, jqXHR) {
    RemoveRequest(jqXHR.ID);
}

function RemoveRequest(id) {
    //    for (var index = 0; index < ajaxCalls.length; index++) {
    //        if (ajaxCalls[index].Request.ID == id) {
    //            ajaxCalls.splice(index, 1);
    //            return true;
    //        }
    //    }
    //    return false;
}

function GenerateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

$.ajaxpostJSON = function (url, sdata, func) {
    $.ajax(
        {
            url: url,
            type: "post",
            //headers: { "cache-control": "no-cache" },
            headers: { "Origin": ORIGIN_HEADER },
            dataType: "json",
            //timeout: parseInt(processTime),
            //cache: false,
            data: sdata,
            success: function (result) {
                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    func(result);
                }
            },
            error: function (xhr, textStatus, jqXHR) {
                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    var pageID = $.mobile.activePage.attr('id');
                    var popupName = findPopupName(pageID);
                    var errorMsg = "";
                    if (textStatus == 'timeout') {
                        errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'error') {
                        errorMsg = GetCommonTranslatedValue("InternalError");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'abort') {
                        errorMsg = GetCommonTranslatedValue("RequestAborted");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else if (textStatus == 'parsererror') {
                        errorMsg = GetCommonTranslatedValue("InternalParseError");
                        forcePopupClose(popupName, errorMsg);
                    }
                    else {
                        errorMsg = GetCommonTranslatedValue("NetworkLost");
                        forcePopupClose(popupName, errorMsg);
                    }
                }
            }
        });
};

document.addEventListener("deviceready", init, false);
function init() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    document.addEventListener("online", checkConnection, false);
    document.addEventListener("offline", checkConnection, false);
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    var logValue = [];
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    if ($.mobile.activePage.attr('id') !== 'Login') {
        if (states[networkState] == 'WiFi connection') {
            if (tempCalls.length > 0) {

                setTimeout(function () {
                    showConfirmation
                           (GetCommonTranslatedValue("ResendRequestMessage"), GetCommonTranslatedValue("OkLabel"), GetCommonTranslatedValue("CancelLabel"), 'handleRequest');
                }, 500);
            }
        }
        else {
            if ($(".ui-page-active .ui-popup-active").length > 0) {
                closeActionPopupLoading();
                closeLoading();
                if ($(".ui-page-active #DashBoardsynchronizingPopup-popup").hasClass('ui-popup-active'))
                    closesynchronizing();
                setTimeout(function () {
                    ////showError('Network was lost during sync/processing. Please try a manual sync or reload the current screen.');
                    showError(GetCommonTranslatedValue("NetworkLostCommon"));
                }, 650);
            }

            //// below code will fire the request when back offline
            if (ajaxCalls.length > 0) {
                if (tempCalls.length > 0) {

                    for (var index = 0; index < tempCalls.length; index++) {
                        ajaxCalls.push(tempCalls[index]);
                    }

                }
                tempCalls = ajaxCalls;
                ajaxCalls = [];
                for (var index = 0; index < tempCalls.length; index++) {
                    tempCalls[index].Request.abort();
                }
            }
        }
    }
}

function handleErrorRequest(flag) {
    if (flag === true) {
        while (ajaxCalls.length > 0) {
            var currentTemp = ajaxCalls[0];
            ajaxCalls.splice(0, 1);
            $.postJSON(currentTemp.URL, currentTemp.Data, currentTemp.Func);
        }
    }
    else {
        ajaxCalls = [];
    }
}

function handleRequest(flag) {
    if (flag === true) {
        while (tempCalls.length > 0) {
            var currentTemp = tempCalls[0];
            tempCalls.splice(0, 1);
            $.postJSON(currentTemp.URL, currentTemp.Data, currentTemp.Func);
        }
    }
    else {
        ajaxCalls = [];
        tempCalls = [];
    }
}


var MasterID = null;
var GlobalLat;
var GlobalLong;
var DefaultDeleteIcon = "css/images/delete-onpress.png";
var AlterDeleteIcon = "css/images/delete.png";
var InspectionItemImg = 0;
var InspectionAssetsImg = 0;
var InspectionVendorImg = 0;
var InspectionCapitalImg = 0;
var workOrderAttachment = 0;
var autoSyncCompleted = 1;
var syncInProgress = 1;
var inspectionImageUpload = 0;
var menuItemCount = 0;
var undefinedString = 'undefined';
var nullString = 'null';
var emptyString = '';
var translatedStrings = new Object();
var createSubOrderFlag = 0;
var undefinedString = 'undefined';
var nullString = 'null';
var emptyString = '';
var defaultDropDownValue = "-1";
var commonStrings = [];
var IsCapitalScreenFlag = 0;
var MinYear = 1940;
var MaxYear = 2099;
var notSetTranslation = GetCommonTranslatedValue("NotSetLabel");
//var syncTime = 600000;
var processTime = 30000;
var pictureSource;
var destinationType;

// added after merging from V2.6
var allCallsComplete = 0;
var isDebugMode = true;
var isAlreadySynced;
var createWorkOrderFlag = false;
var newWorkOrderData;

//For Allocation Locking
var AllowUnLock = false;

//added after v2.7
var manualSync = false;

//added after v2.8
var createWOAttachmentFlag = false;

//added for 3.0
var isCanvasblank = false;
var NTEDefaultValueInt = 0;
var SelfGenYesOrNo = 0;
var InspectionCapitalScreenNavigate = false;

$(document).on("pagebeforeshow", function () {
    if (!IsStringNullOrEmpty(getLocal("Language"))) {
        Globalize.culture(getLocal("Language"));
    }
});

function NumberSortHelper(a, b) {
    return a - b;
}

function IsStringNullOrEmpty(value) {
    if (value === null || value == "null" || value === emptyString || value === undefinedString) {
        return true;
    }

    return false;
}

function IsObjectNullOrUndefined(value) {
    if (value === null || value === undefinedString || value === undefined) {
        return true;
    }

    return false;
}

function GetInvariantDateString(date) {
    if (date instanceof Date) {
        return Globalize.format(date, "yyyy-MM-dd");
    }

    return emptyString;
}

function GetInvariantTimeString(date, isMilitaryTime) {
    if (!IsStringNullOrEmpty(date) && (date instanceof Date)) {
        if (isMilitaryTime) {
            return Globalize.format(date, "HH:mm");
        }
        else {
            return Globalize.format(date, "hh:mm tt");
        }
    }

    return emptyString;
}

function GetInvariantDateTimeString_T(date) {
    if (!IsStringNullOrEmpty(date) && (date instanceof Date)) {
        return GetInvariantDateString(date) + "T" + GetInvariantTimeString(date, true);
    }

    return emptyString;
}

function GetDateText(date) {
    if (date instanceof Date) {
        return date.toDateString();
    }

    return emptyString;
}

function GetDateTimeText(date, isMilitaryTime) {
    if (date instanceof Date) {
        return date.toLocaleDateString() + " " + GetInvariantTimeString(date, isMilitaryTime);
        //return date.toDateString() + " " + GetInvariantTimeString(date, isMilitaryTime);
    }

    return emptyString;
}

function GetDateObjectFromInvariantDateString(value) {
    if (!IsStringNullOrEmpty(value)) {
        var date = NaN;
        var splitValue = value.split(/[^0-9]/);

        if (!IsObjectNullOrUndefined(splitValue)) {
            if (splitValue.length == 3) {
                //date = new Date(Date.UTC(splitValue[0], splitValue[1] - 1, splitValue[2], 0, 0, 0, 0));
                date = new Date(splitValue[0], splitValue[1] - 1, splitValue[2], 0, 0, 0, 0);
            }
            else if (splitValue.length == 5 || splitValue.length == 6 || splitValue.length == 7) {
                date = new Date(splitValue[0], splitValue[1] - 1, splitValue[2], splitValue[3], splitValue[4], 0, 0);
            }
        }

        if (!isNaN(date.valueOf())) {
            return date;
        }
    }

    return null;
}

function ValidateInvariantDateString(date) {
    var dateObj = GetDateObjectFromInvariantDateString(date);

    if (!IsObjectNullOrUndefined(dateObj)) {
        year = dateObj.getFullYear();

        if (year >= MinYear && year <= MaxYear) {
            return true;
        }
    }

    return false;
}

function SetSelectedDateForLink(dateTextBoxID, dateLinkID) {
    var page = $("#" + $.mobile.activePage.attr("id"));
    var tempDate = GetDateObjectFromInvariantDateString(page.find("#" + dateTextBoxID).val());
    var tempDateText = GetDateText(tempDate);

    if (IsStringNullOrEmpty(tempDateText)) {
        tempDateText = notSetTranslation;
    }

    page.find("#" + dateLinkID).text(tempDateText);
}

function SetSelectedDateTimeForLink(dateTextBoxID, dateLinkID) {
    var page = $("#" + $.mobile.activePage.attr("id"));
    var tempDate = GetDateObjectFromInvariantDateString(page.find("#" + dateTextBoxID).val());
    var tempDateText = GetDateTimeText(tempDate, false);

    if (IsStringNullOrEmpty(tempDateText)) {
        tempDateText = notSetTranslation;
    }

    page.find("#" + dateLinkID).text(tempDateText);
}

function GetDecimal(number, decimalDigits, isLocalFormat) {
    number = parseFloat(number);

    if (!isNaN(number)) {
        if (typeof number === 'number') {
            if (isLocalFormat) {
                return Globalize.format(number, "n" + decimalDigits);
            }
            else {
                return number.toFixed(decimalDigits);
            }
        }
    }

    return emptyString;
}

function GetUniqueElements(array) {
    if (array instanceof Array) {
        return array.filter(function (el, index, arr) {
            return index == arr.indexOf(el);
        });
    }
    return [];
}

function FormatDecimalInTextBox(textbox) {
    ////    var inputValue = textbox.value;
    ////    inputValue = data.value.replace(/(\.\d\d)\d+|([\d.]*)[^\d.]/, '$1$2');

    //    var value = GetDecimal(parseFloat(textbox.value), 2, false);

    //    if (isNaN(value)) {
    //        value = emptyString;
    //    }
    //    else if (IsStringNullOrEmpty(value)) {
    //        value = emptyString
    //    }

    //    textbox.value = value;

    textbox.value = GetDecimal(textbox.value, 2, false);
}

function BlockNonNumbersInTextBox(obj, e, allowDecimal, allowNegative) {
    var key;
    var isCtrl = false;
    var keychar;
    var reg;
    if (window.event) {
        key = e.keyCode;
        isCtrl = window.event.ctrlKey;
    }
    else if (e.which) {
        key = e.which;
        isCtrl = e.ctrlKey;
    }

    if (isNaN(key)) return true;

    keychar = String.fromCharCode(key);

    // check for backspace or delete, or if Ctrl was pressed
    if (key == 8 || isCtrl) {
        return true;
    }

    reg = /\d/;
    var isFirstN = allowNegative ? keychar == '-' && obj.value.indexOf('-') == -1 : false;
    var isFirstD = allowDecimal ? keychar == '.' && obj.value.indexOf('.') == -1 : false;
    var isFirstC = allowDecimal ? keychar == ',' && obj.value.indexOf(',') == -1 : false;
    return isFirstN || isFirstD || isFirstC || reg.test(keychar);
}

function LoadTranslation(screenName, callBack) {
    translatedStrings = new Object();

    var xmlString = getLocal("XmlTranslation");
    var language = getLocal("Language");
    var page = $("#" + screenName);

    if (!IsStringNullOrEmpty(screenName) && !IsStringNullOrEmpty(language)) {
        $(xmlString).find("major[MajorKey='" + screenName + "']").find("minor[MinorKey='" + language + "']").find("code").each(function () {
            if (!IsObjectNullOrUndefined($(this))) {
                var dataNode = $(this).find("data");
                var data = emptyString;
                if (!IsObjectNullOrUndefined(dataNode)) {
                    data = $(dataNode).text();
                }

                var valueNode = $(this).find("value");
                var value = emptyString;
                if (!IsObjectNullOrUndefined(valueNode)) {
                    value = $(valueNode).text();
                }

                // If the screen name is not common then load it to TranslatedStrings. 
                if (screenName !== 'Common') {
                    translatedStrings[data] = value;
                }
                else {
                    commonStrings[data] = value;
                }

                if (!IsStringNullOrEmpty(data)) {
                    var element = page.find("#" + data);

                    if (element.length > 0) {
                        //if (data.length > 6 && data.substring(data.length - 6, data.length) == "Button" && element.get(0).tagName == "A") {
                        if (element.get(0).tagName == "A" && element.attr("data-role") == "button") {
                            //element.find(".ui-btn-text").text(value);
                            ////SR: Pentesting & JQM update
                            element.text(value);
                        }
                        else if (element.attr('type') == "checkbox") {
                            element.siblings('label').find(".ui-btn-text").text(value);
                        }
                        else if (element.get(0).tagName == "H3" && element.attr("class").indexOf("ui-collapsible") > -1) {
                            element.find(".ui-btn-text").text(value);
                        }
                        else {
                            element.text(value);
                        }
                    }
                }
            }
        });

        if (callBack != null) {
            callBack();
        }

        return;
    }
}

function SyncTranslation(screenName, callBack) {
    if (!IsStringNullOrEmpty(getLocal("Language")) && (!IsStringNullOrEmpty(getLocal("DatabaseID")) || !IsStringNullOrEmpty(getLocal("PlainDatabaseID")))) {
        var databaseID = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
        var myJSONobject = {
            "Language": getLocal("Language"),
            "DatabaseID": databaseID ? databaseID : GetDatabaseID(),
            "XmlLastSyncDate": getLocal("XmlLastSyncDate"),
            "XmlLastSyncLanguage": getLocal("XmlLastSyncLanguage"),
            "XmlToDbFeature": getLocal("xmltodbSupported")
        };

        var accessURL = standardAddress;

        switch (screenName) {
            case "Login":
                accessURL = getLocal("URL_STANDARDADDRESS_STRING");
                accessURL += $.constants.DB_STRING + databaseID + "iMFM/";
                break;
        }

        accessURL += "LoginAuthentication.ashx?methodname=SyncTranslation";

        if (navigator.onLine) {
            $.postJSON(accessURL, myJSONobject, function (data) {
                if (!IsObjectNullOrUndefined(data) && data.isSyncRequired === true && !IsStringNullOrEmpty(data.xml)) {
                    setLocal("XmlTranslation", data.xml);
                    setLocal("XmlLastSyncDate", data.syncDate);
                    setLocal("XmlLastSyncLanguage", data.syncLanguage);
                }

                if (callBack != null) {
                    callBack();
                }

                return;
            });
        }
    }
}

function GetTranslatedValue(key) {
    if (!IsObjectNullOrUndefined(translatedStrings)) {
        var value = translatedStrings[key];

        if (!IsStringNullOrEmpty(value)) {
            return value;
        }
    }

    return emptyString;
}

function GetCommonTranslatedValue(key) {
    if (!IsObjectNullOrUndefined(commonStrings)) {
        var value = commonStrings[key];

        if (!IsStringNullOrEmpty(value)) {
            return value;
        }
    }

    return emptyString;
}

function login(loginURL, myJSONobject, DatabaseConnection) {
    setLocal("HideHeaderAndSecurityQuestion", "false");
    if (navigator.onLine) {
        $.postJSON(loginURL, myJSONobject, function (data) {
            loginResponse = data;
            if (data.Authentic == 5) {
                setLocal('SecurityQuestionsConfigured', data.SecurityQuestionsConfigured);
                setLocal('magpiejay', data.iMFMOfflineEncryption);
                setLocal("Username", encryptStr(data.Username));
                setLocal("EmployeeNumber", encryptStr(data.EmployeeNumber));
                setLocal("DatabaseID", IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? encryptStr(decryptResponse(getLocal("DatabaseID"))) : encryptStr(getLocal("PlainDatabaseID")));
                localStorage.removeItem("PlainDatabaseID");
                setLocal("RecordsPerPage", data.RecordsPerPage);
                if (data.SessionDetails.MissionCriticalUser === false) {
                    setLocal("missionCriticalUser", 0);
                }
                else {
                    setLocal("missionCriticalUser", 1);
                }
                setLocal('loginUser', encryptStr(data.EmployeeNumber));
                setLocal('LocID', data.SessionDetails.LocDivisionNumber);
                setLocal('RegionID', data.SessionDetails.LocRegionNumber);
                setLocal('DatabaseName', encryptStr(data.SessionDetails.DatabaseName));
                // setLocal("RecordsPerPage", data.RecordsPerPage);
                setLocal("EmployeeName", encryptStr(data.Username));
                setLocal("FullName", encryptStr(data.SessionDetails.FullName));
                setLocal("LoginUserSequenceNo", encryptStr(data.SeqNo));
                setLocal("TimeZoneData", data.SessionDetails.TimeZoneEntity.TimeZone);
                setLocal("TZCommonName", data.SessionDetails.TimeZoneEntity.CommonName);
                //setLocal("SessionID", encryptStr(data.SessionDetails.SessionID));
                ////SR
                var BlueJaySesssionKey = BlueJaySesssion();
                setLocal("SessionID", encryptStr(CryptoJS.AES.encrypt(data.SessionDetails.SessionID, BlueJaySesssionKey).toString()));
                setLocal("Timeout", encryptStr(data.TimeOut));
                $.mobile.loading("hide");
                //                IsNetworkAlive(); ////added to check network connectivity
                ////                $.mobile.changePage("Dashboard.html");  

                setTimeout(function () {
                    openDB();
                    var d = new Date();
                    dB.transaction(function (tsW) {
                        try {
                            // Fill Feature List Table 
                            if (isEmptyObject(data.SupportedFeatureList)) {
                                FillFeatureListTable(tsW, data.SupportedFeatureList, 1);
                            }
                        }
                        catch (ex) {
                            console.log(ex.message);
                        }
                    });
                }, 10000);

                $.mobile.changePage("InitialSync.html");
            }
            else if (data.Authentic == 4) {
                setLocal("DatabaseID", IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? encryptStr(decryptResponse(getLocal("DatabaseID"))) : encryptStr(getLocal("PlainDatabaseID")));
                setLocal("Language", getLocal("Language"));
                setLocal("Username", encryptStr(data.Username));
                setLocal("EmployeeNumber", encryptStr(data.EmployeeNumber));
                setLocal("GPSLocation", "");
                var BlueJaySesssionKey = BlueJaySesssion();
                setLocal("SessionID", encryptStr(CryptoJS.AES.encrypt(data.SessionDetails.SessionID, BlueJaySesssionKey).toString()));
                setLocal("HideHeaderAndSecurityQuestion", "true");
                setLocal("ScreenName", "ChangePassword");
                $.mobile.changePage("ChangePassword.html");
            }
            else {
                $.mobile.loading("hide");
                //$('#UserNameTextBox').val('');
                $('#PasswordTextBox').val('');

                if (data.Message == "Update Required") {
                    $('#UpdateClientPopUp').popup("open");
                } else {
                    if (!IsObjectNullOrUndefined(data.Message)) {
                        showError(data.Message);
                        if (getLocal("SSOUser") == "true") {
                            LoginSettings_OpenPopUp();
                        }

                    } else if (!IsObjectNullOrUndefined(data.Exception)) {
                        if (data.Exception == "Error while decrypting string.") {
                            data.Exception = "Session expired. Please provide login details.";
                        }
                        showError(data.Exception);
                        if (getLocal("SSOUser") == "true") {
                            LoginSettings_OpenPopUp();
                        }
                    } else {
                        showError(data);
                        if (getLocal("SSOUser") == "true") {
                            LoginSettings_OpenPopUp();
                        }
                    }
                }
            }
            //SR show and hide help icon
            if (data && (data.Status == 'L' || data.Status == 'AE' || data.Status == 'D')) {
                $("#NeedHelpContainer").show();
            }
            else {
                $("#NeedHelpContainer").hide();
            }
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

var sort_by = function (field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field];
    };
    return function (a, b) {
        if (a === null || a === "null") { a = "No string"; }
        if (b === null || b === "null") { b = "No string"; }
        var A = key(a), B = key(b);
        return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
    };
};

var sort_priority = function (field, reverse, primer) {
    var key = function (x) {
        return primer ? primer(x[field]) : x[field];
    };
    return function (a, b) {
        var reA = /^[a-zA-Z]$/;
        var re = new RegExp(reA);

        var A = key(a), B = key(b);

        A = A.replace("P", "");
        B = B.replace("P", "");
        A = parseInt(A);
        B = parseInt(B);
        return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
    };
};

function sort_Orders(field, reverse, primer, sortby) {
    var key;
    if (sortby === "Priority") {
        key = function (x) {
            return primer ? primer(x[field]) : x[field];
        };
        return function (a, b) {
            var reA = /^[a-zA-Z]$/;
            var re = new RegExp(reA);
            var A = key(a), B = key(b);
            A = A.replace("P", "");
            B = B.replace("P", "");
            A = parseInt(A);
            B = parseInt(B);
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
    else if (sortby === "Building") {
        key = function (x) { return primer ? primer(x[field]) : x[field]; };
        return function (a, b) {
            var L1 = key(a), L2 = key(b);
            L1 = L1.split("/");
            L2 = L2.split("/");
            var A = L1[1].trim();
            var B = L2[1].trim();
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
    else if (sortby === "Date") {
        // Pass this into .sort() to sort the field specified by dates. if the field is empty, it will sort the array passed in.
        if (field !== "") {
            key = function (x) { return primer ? primer(x[field]) : x[field]; };
        } else {
            key = function (x) { return primer ? primer(x) : x; };
        }

        return function (a, b) {
            if (a === null || a === "null") { a = "No string"; }
            if (b === null || b === "null") { b = "No string"; }
            if (field !== "") {
                if (a[field] === null || a[field] === "null") { a[field] = 0; }
                if (b[field] === null || b[field] === "null") { b[field] = 0; }
            }

            var A = key(a), B = key(b);
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
    else {
        key = function (x) { return primer ? primer(x[field]) : x[field]; };
        return function (a, b) {
            if (a === null || a === "null") { a = "No string"; }
            if (b === null || b === "null") { b = "No string"; }
            var A = key(a), B = key(b);
            return ((A > B) ? -1 : ((A < B) ? 1 : 0)) * [-1, 1][+!!reverse];
        };
    }
}

function CheckOnline(screenName, htmlpage) {
    if (!navigator.online) {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
        return false;
    }
    else {
        setLocal("ScreenName", screenName);
        $.mobile.changePage(htmlpage);
    }
}

function NavigateToWorkOrderPage(linkID, overrideAutoSync) {
    IsCapitalScreenFlag = 0;
    MasterID = linkID;
    var menuID = linkID;
    var ScreenName = "";
    var pageID;

    // Set this to allow unlocking a WO.
    AllowUnLock = true;

    setLocal("showLoading", "true");
    switch (menuID) {
        case "400004":
        case "400002":
        case "400003":
        case "400029":
        case "400034":
        case "400035":
        case "400033":
        case "400036":
        case "400041":
        case "400042":
        case "400045":
        case "400046":
            if (!navigator.onLine) {
                ////showError("No network connection. Please try again when network is available.");
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
                return false;
            }
    }

    if (menuID == "400001") {
        ScreenName = "PastDueorder";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("PastDueOrders.html");
    }
    else if (menuID == "400008") {
        ScreenName = "DemandOrders";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("DemandOrders.html");
    }
    else if (menuID == "400012") {
        ScreenName = "PMOrders";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("PMOrders.html");
    }
    else if (menuID == "400004") {
        ScreenName = "VendorSearch";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("VendorSearch.html");
    }
    else if (menuID == "400006") {
        ScreenName = "Create Work Order for Dispatch";
        setLocal("ScreenName", ScreenName);
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("CreateWOD.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }

    }
    else if (menuID == "400010") {
        ScreenName = "SelfGen2"; //Completed WorkOrders
        setLocal("ScreenName", ScreenName);
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("CreateWOC.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400011") {
        ScreenName = "SelfGen3"; // Other WorkOrders
        setLocal("ScreenName", ScreenName);
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("CreateWOO.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400002") {
        ScreenName = "OrderSearch";
        setLocal("ScreenName", ScreenName);
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("SearchOrder.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400003") {
        ScreenName = "DailyWorkOrder";
        setLocal("ScreenName", ScreenName);

        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("DailySearch.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400028") {
        pageID = $.mobile.activePage.attr("id");
        $("#" + pageID + "navigationPanel").panel("close");
        $("#MyLocationPopup").popup("open");
    }
    else if (menuID == "400029") {
        ScreenName = "TimeCard";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("TimeCard.html");
    }
    else if (menuID == "400030") {
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            if (navigator.onLine) {
                ScreenName = "InspectionAdhoc";
                setLocal("ScreenName", ScreenName);
                $.mobile.changePage("InspectionAdhoc.html");
            }
            else {
                ////showError("No network connection. Please try again when network is available.");
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
            }
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400033") {
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            if (navigator.onLine) {
                ScreenName = "IntDispOrders";
                setLocal("ScreenName", ScreenName);
                $.mobile.changePage("IntDispOrders.html");
            }
            else {
                ////showError("No network connection. Please try again when network is available.");
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
            }
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400032") {
        ScreenName = "AboutPage";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("About.html");
    }
    else if (menuID == "400034") {
        ScreenName = "ChangePassword";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("ChangePassword.html");
    }
    else if (menuID == "400035") {
        ScreenName = "ApprovalDashboard";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("ApprovalDashboard.html");
    }
    else if (menuID == "400041") {
        ScreenName = "SiteProfile";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("SiteProfile.html");
    }
    else if (menuID == "400042") {
        ScreenName = "TechnicianAvailabilityView";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("TechnicianAvailabilityView.html");
    }
    else if (menuID == "400036") {
        ScreenName = "AssetList";
        setLocal("ScreenName", ScreenName);
        setLocal("AssetListMode", "List");
        $.mobile.changePage("AssetsList.html");
    }
    else if (menuID == "400039") {
        scanBarcode();
    }
    else if (menuID == "400037") {
        //Dashboard from scan
        if (window.location.href.indexOf("AssetDashboard.html") == -1) {
            $.mobile.changePage("AssetDashboard.html", { transition: "none", allowSamePageTransition: true, reloadPage: true });
        }
        else {
            // Makeshift reload of the form.
            $("#TagScanPopupTopCloseButton").click();
            if (navigator.onLine) {
                showLoading();
                PrepareTagDetails();
            }
        }
    }
    else if (menuID == "400040") {
        ScreenName = "SelfGenAsset";
        setLocal("RequestedAction", ScreenName);
        setLocal("ScreenName", getLocal("ScreenName") + "\\AssetDashboard\\" + ScreenName);
        if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
            $.mobile.changePage("CreateWOT.html");
        }
        else {
            pageID = $.mobile.activePage.attr("id");
            $("#" + pageID + "navigationPanel").panel("close");
            ////showError("Please sync the data completely, to navigate to this screen.");
            showError(GetCommonTranslatedValue("SyncCompletely"));
        }
    }
    else if (menuID == "400043") {
        if (navigator.onLine) {
            setLocal("ScreenName", $.mobile.activePage.attr('id'));
            $.mobile.changePage("InspectionAddAsset.html");
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else if (menuID == "400045") {
        ScreenName = "AssetSearch";
        setLocal("ScreenName", ScreenName);
        $.mobile.changePage("AssetSearch.html");
    }
    else if (menuID == "400046") {
        // Get the list of statuses and pass them into the function to open popup.
        if (navigator.onLine) {
            ScreenName = "EmployeeStatus";
            setLocal("ScreenName", ScreenName);
            $.mobile.changePage("EmployeeStatus.html");
        } else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else if (menuID == "499999") {
        logout();
    }
}


function GetOrderList(pageID) {
    var myJSONobject = iMFMJsonObject({
        Username: decryptStr(getLocal("Username")),
        ScreenName: getLocal("ScreenName"),
        RecordsPerPage: getLocal("RecordsPerPage")
    });
    var ordersURL = standardAddress + "IMFMOrder.ashx?methodname=GetWODetails";

    if (navigator.onLine) {

        $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
            $("#" + pageID).find(".ordersPageTitle span.OrdersCount").html("(" + data.Table.length + ")");
            var resultThreshold = 200;
            if (!isNaN(getLocal("SearchResultThreshold")) && getLocal("SearchResultThreshold") != null && getLocal("SearchResultThreshold") != undefined) {
                resultThreshold = getLocal("SearchResultThreshold");
            }

            if (data.Table.length >= resultThreshold) {
                $("#" + pageID).find(".topSearch").show();
                var msg = $("#" + pageID).find("#topSearchMessage").text();
                msg = msg.replace("XXX", resultThreshold);
                $("#" + pageID).find("#topSearchMessage").text(msg);
            }
            else {
                $("#" + pageID).find(".topSearch").hide();
            }

            openDB();
            dB.transaction(function (tx) {
                var key = null;
                var queryList = [];
                switch (pageID) {
                    case "pastDueOrderPage": key = 1; break;
                    case "PMOrdersPage": key = 3; break;
                    case "demandOrdersPage": key = 2; break;
                    case "intDispOrderPage": key = 4; break;
                }
                queryList.push('DELETE FROM WorkOrderLogTable WHERE WorkOrderNumber IN (SELECT WorkOrderNumber FROM WorkOrderDetailsTable WHERE OrderKey = ' + key + ')');
                queryList.push('DELETE FROM WorkOrderAttachmentsTable WHERE WorkOrderNumber IN (SELECT WorkOrderNumber FROM WorkOrderDetailsTable WHERE OrderKey = ' + key + ')');
                queryList.push('DELETE FROM WorkOrderEquipmentTagTable WHERE WorkOrderNumber IN (SELECT WorkOrderNumber FROM WorkOrderDetailsTable WHERE OrderKey = ' + key + ')');
                queryList.push('DELETE FROM WorkOrderContactsTable WHERE WorkOrderNumber IN (SELECT WorkOrderNumber FROM WorkOrderDetailsTable WHERE OrderKey = ' + key + ')');
                queryList.push('DELETE FROM WorkOrderDetailsTable WHERE OrderKey = ' + key);
                ExecuteMutipleQueries(tx, queryList, 0, data, key, pageID);
            });

        });
    }
}


function ExecuteMutipleQueries(ts, queryList, i, data, key, pageID) {
    if (i < queryList.length) {
        ts.executeSql(queryList[i], [], function () {
            ExecuteMutipleQueries(ts, queryList, i + 1, data, key, pageID);
        },
        function () {

        });
    }
    else {
        if (data.Table.length !== 0) {
            FillDetailsTable(ts, data, key);
            if (pageID == "intDispOrderPage") {
                BindIntDispOrderList(pageID, data.Table);
            }
            else {
                BindOrderList(pageID, data.Table);
            }
        }
        else {
            ////NO WorkOrders.
            var NoOrdersID = "#" + $("#" + pageID).find(".NoOrders").attr('id');
            $(NoOrdersID).show();
            closeLoading();
        }
    }
}

function BindIntDispOrderList(pageID, result) {
    try {
        var HTPriority = GetTranslatedValue("PriorityDropDownOption");
        var HTStatus = GetTranslatedValue("StatusDropDownOption");
        var HTAssignment = GetTranslatedValue("AssignmentLabel");
        var key = 4;

        var resultSorted = result;

        // Intelligent Dispatch always sorts by Rank.
        resultSorted.sort(sort_Orders("Rank", false, parseInt, ""));

        var listID = "#" + $("#" + pageID).find(".WOListDiv").attr('id');
        ////        console.log(listID);
        ////        $(listID).show();
        var datestr = "";
        ////debugger;
        for (var i = 0; i < resultSorted.length; i++) {
            var diva;
            var ultag;
            var appending;
            var count;
            var dynamicStr = resultSorted[i].Rank;

            // Create the div that we will use for the WO list entry.
            diva = document.createElement('div');
            diva.setAttribute("class", "ui-panel-inner");
            ultag = document.createElement('ul');
            ultag.setAttribute("class", "ui-listview");
            ultag.setAttribute("data-role", "listview");

            var wo = "'" + resultSorted[i].workordernumber + "'";
            var AssignName = resultSorted[i].AssignedName;

            // Create the contents for the WO list entry.
            appending = '<li><a id="' + resultSorted[i].workordernumber + '"  href="#"  onclick="javascript:WorkOrderDetailsPage(' + wo + ',' + key + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ' : ' + resultSorted[i].Priority + '</strong></p>'
            + '<span style="font-size: 0.9em">' + '#' + resultSorted[i].Rank + ': ' + resultSorted[i].workordernumber + '</span><br />'
            + '<span style="font-size: 0.9em">' + HTStatus + ' : ' + resultSorted[i].Status + '</span><br />'
            + '<span style="font-size: 0.8em">' + HTAssignment + ' : ' + AssignName + '</span><br />'
            + '<span style="font-size: 0.8em">' + resultSorted[i].Location + '</span></a></li>';

            ultag.innerHTML = ultag.innerHTML + appending;
            diva.appendChild(ultag);

            $(listID).append(diva);
        }
        $(listID).trigger('create');
        ////        $(listID).collapsibleset("refresh");
        closeLoading();
    }
    catch (e) {
        console.log(e);
        console.log(e.message);
        log(e);
        closeLoading();
    }
}

function BindOrderList(pageID, result) {
    try {
        ////debugger
        var HTPriority = GetTranslatedValue("PriorityDropDownOption");
        var HTStatus = GetTranslatedValue("StatusDropDownOption");
        var HTAssignment = GetTranslatedValue("AssignmentLabel");
        HTProblemDescription = GetTranslatedValue("ProblemDescriptionLabel");
        var HTETADate = GetTranslatedValue("DateNextArrivalSiteLabel");
        var key = null;
        switch (pageID) {
            case "pastDueOrderPage": key = 1; break;
            case "PMOrdersPage": key = 3; break;
            case "demandOrdersPage": key = 2; break;
            case "intDispOrderPage": key = 4; break;
        }
        var resultSorted = result;
        var groupBy = getLocal(pageID + "GroupByValue");
        var OrderListingGroupBy = getLocal('OrderListingGroupBy');

        if (groupBy === null || groupBy === "null") {
            if (OrderListingGroupBy === null || OrderListingGroupBy === "null") {
                resultSorted.sort(sort_Orders("L2TCCProjectNumber", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
            }
            else {
                if (OrderListingGroupBy.toUpperCase() == "PROPERTYID") {
                    groupBy = "PROPERTYID";
                    resultSorted.sort(sort_Orders("L2TCCProjectNumber", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
                }
                else if (OrderListingGroupBy.toUpperCase() == "ENTEREDDATE") {
                    groupBy = "ENTEREDDATE";
                    ////                    resultSorted.sort(sort_Orders("EnteredDate", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
                }
                else if (OrderListingGroupBy.toUpperCase() == "PRIORITY") {
                    groupBy = "PRIORITY";
                    resultSorted.sort(sort_Orders("Priority", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, "Priority"));
                    var tempSort = resultSorted;
                    var sortedTemp = tempSort.sort(function (a, b) {
                        var nameA = a.Priority.toLowerCase(), nameB = b.Priority.toLowerCase()
                        if (nameA < nameB)
                            return -1;
                        if (nameA > nameB)
                            return 1;
                        return 0;
                    });
                    resultSorted = sortedTemp;
                }
                else if (OrderListingGroupBy.toUpperCase() == "BUILDING") {
                    groupBy = "BUILDING";
                    resultSorted.sort(sort_Orders("Location", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, "Building"));
                }
                else if (OrderListingGroupBy.toUpperCase() == "STATUS") {
                    groupBy = "STATUS";
                    resultSorted.sort(sort_Orders("Status", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
                }
                else if (OrderListingGroupBy.toUpperCase() == "TARGETDATE") {
                    groupBy = "TARGETDATE";
                    resultSorted.sort(sort_Orders("DiffDate", true, parseInt, ""));
                }
                else if (OrderListingGroupBy.toUpperCase() == "ETADATE") {
                    groupBy = "ETADATE";
                    resultSorted.sort(sort_Orders("DateNextArrivalSite", false, Date.parse, "Date"));
                }
            }
        }
        else if (groupBy.toUpperCase() == "PROPERTYID" || groupBy.toUpperCase() == "L2TCCPROJECTNUMBER") {
            resultSorted.sort(sort_Orders("L2TCCProjectNumber", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
        }
        else if (groupBy.toUpperCase() == "PRIORITY") {
            resultSorted.sort(sort_Orders("Priority", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, "Priority"));
            var tempSort = resultSorted;
            var sortedTemp = tempSort.sort(function (a, b) {
                var nameA = a.Priority.toLowerCase(), nameB = b.Priority.toLowerCase()
                if (nameA < nameB)
                    return -1;
                if (nameA > nameB)
                    return 1;
                return 0;
            });
            resultSorted = sortedTemp;
        }
        else if (groupBy.toUpperCase() == "BUILDING") {
            resultSorted.sort(sort_Orders("Location", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, "Building"));
        }
        else if (groupBy.toUpperCase() == "RANK") {
            // Sort by nothing.  It should be rank order.
        }
        else if (groupBy.toUpperCase() == "STATUS") {
            resultSorted.sort(sort_Orders("Status", false, function (a) { if (a === null || a === "null") { a = "No string"; } return a.toUpperCase(); }, ""));
        }
        else if (groupBy.toUpperCase() == "TARGETDATE") {
            groupBy = "TARGETDATE";
            resultSorted.sort(sort_Orders("DiffDate", true, parseInt, ""));
        }

        else if (groupBy.toUpperCase() == "ETADATE") {
            groupBy = "ETADATE";
            resultSorted.sort(sort_Orders("DateNextArrivalSite", false, Date.parse, "Date"));
        }

        var listID = "#" + $("#" + pageID).find(".WOListDiv").attr('id');
        var datestr = "";
        var noEtaDiv;
        for (var i = 0; i < resultSorted.length; i++) {
            var diva;
            var ultag;
            var appending;
            var count;
            var useNoEtaDiv = false;
            var dynamicStr = "";

            if (groupBy == "PRIORITY") {
                dynamicStr = resultSorted[i].Priority;
            }
            else if (groupBy == "STATUS") {
                dynamicStr = resultSorted[i].Status;
            }
            else if (groupBy == "ENTEREDDATE") {
                //                dynamicStr = cleanDate(resultSorted[i].DateEntered, "LocalDate");
                dynamicStr = (resultSorted[i].DateEnteredStr).substr(0, 12);
            }
            else if (groupBy == "BUILDING") {
                dynamicStr = resultSorted[i].Building.trim();
            }
            else if (groupBy == "TARGETDATE") {
                dynamicStr = resultSorted[i].DiffDate;
            }
            else if (groupBy == "ETADATE") {
                if (!IsStringNullOrEmpty(resultSorted[i].DateNextArrivalSiteStr)) {
                    dynamicStr = (resultSorted[i].DateNextArrivalSiteStr).substr(0, 12);
                } else {
                    dynamicStr = GetTranslatedValue("NoDateNextArrivalSiteLabel");
                    useNoEtaDiv = true;
                }
            }
            else if (groupBy == "Rank") {
                dynamicStr = "";
                // Basically do nothing, just make sure we don't hit the else case.
            }
            else {
                if (resultSorted[i].L2TCCProjectNumber === "" || resultSorted[i].L2TCCProjectNumber === "null" || resultSorted[i].L2TCCProjectNumber === null) {
                    dynamicStr = GetTranslatedValue("NoPropertyIDLabel");
                }
                else
                    dynamicStr = resultSorted[i].L2TCCProjectNumber;
            }

            if (groupBy == "Rank") {
                diva = document.createElement('div');
                diva.setAttribute("class", "ui-panel-inner");
                ultag = document.createElement('ul');
                ultag.setAttribute("class", "ui-listview");
                ultag.setAttribute("data-role", "listview");
            }
            else if (dynamicStr != datestr) {
                count = 0;
                appending = '';
                datestr = dynamicStr;
                diva = document.createElement('div');
                diva.setAttribute("data-role", "collapsible");
                var h4 = document.createElement('h4');

                if (groupBy == "STATUS") {
                    h4.innerHTML = dynamicStr + "-" + resultSorted[i].StatusDesc;
                }
                if (groupBy == "TARGETDATE") {
                    h4.innerHTML = (resultSorted[i].CompletionTarget).substr(0, 12);
                }
                else
                    h4.innerHTML = datestr;
                diva.appendChild(h4);
                ultag = document.createElement('ul');
                ultag.setAttribute("class", "ui-listview");
                ultag.setAttribute("data-role", "listview");
            }

            var wo = "'" + resultSorted[i].WorkOrderNumber + "'";
            var AssignName = resultSorted[i].AssignName;

            appending = '<li><a id="' + resultSorted[i].WorkOrderNumber + '"  href="#"  onclick="javascript:WorkOrderDetailsPage(' + wo + ',' + key + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ' : ' + resultSorted[i].Priority + '</strong></p>' +
                                        '<span style="font-size: 0.9em">' + resultSorted[i].WorkOrderNumber + '</span><br />' +
                                        '<span style="font-size: 0.9em">' + HTStatus + ' : ' + resultSorted[i].Status + '</span><br />' +
                                        '<span style="font-size: 0.8em">' + HTAssignment + ' : ' + AssignName + '</span><br />' +
                                        '<ETAPANEL>' +
                                        '<span style="font-size: 0.8em">' + HTProblemDescription + ' : ' + resultSorted[i].ProblemDescription + '</span><br />' +
                                        '<span style="font-size: 0.8em">' + resultSorted[i].Location + '</span></a></li>';


            if (!IsStringNullOrEmpty(resultSorted[i].DateNextArrivalSiteStr)) {
                var timeZoneStr = IsStringNullOrEmpty(resultSorted[i].SiteTZ) ? '' : ' ' + resultSorted[i].SiteTZ;
                appending = appending.replace('<ETAPANEL>', '<span style="font-size: 0.8em">' + HTETADate + ' : ' + resultSorted[i].DateNextArrivalSiteStr + timeZoneStr + '</span><br />');
            } else {
                appending = appending.replace('<ETAPANEL>', '');
            }
            ultag.innerHTML = ultag.innerHTML + appending;
            diva.appendChild(ultag);
            if (useNoEtaDiv) {
                noEtaDiv = diva;
            } else {
                $(listID).append(diva);
            }
        }

        if (noEtaDiv) {
            $(listID).append(noEtaDiv);
        }

        $(listID).trigger('create');
        closeLoading();
    }
    catch (e) {
        closeLoading();
    }
}

var orderResponse = "";
function getOrders(ordersURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(ordersURL, myJSONobject, function (data) {
            orderResponse = data;
            BindOrders(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function BindOrders(data) {
    var numberOfOrders = data.length;
    var collapsibleSetInside = '';
    var previousDate = '';

    try {
        var dynamicHeader = '';
        if (numberOfOrders === 0) {
            if (getLocal("ScreenName") == "PastDueorder") {
                $('#noPastDueOrder').show();
            }
            else if (getLocal("ScreenName") == "DemandOrders") {
                $('#noDemandOrder').show();
            }
            else if (getLocal("ScreenName") == "PMOrders") {
                $('#noPMOrder').show();
            }
        }
        else {
            for (var index = 0; index < numberOfOrders; index++) {
                collapsibleSetInside = '';
                if (previousDate != data[index].SortingDateEntered) {

                    if (index !== 0) {
                        dynamicHeader = dynamicHeader + '</ul></div>';
                    }

                    dynamicHeader = dynamicHeader +
                            '<div data-role="collapsible" data-inset="true">' +
                            '<h4>' + data[index].SortingDateEntered + '</h4>' +
                            '<ul data-role="listview">';
                    collapsibleSetInside = CreateList(data[index]);
                    dynamicHeader = dynamicHeader + collapsibleSetInside;
                }

                else {
                    collapsibleSetInside = CreateList(data[index]);
                    dynamicHeader = dynamicHeader + collapsibleSetInside;
                }
                previousDate = data[index].SortingDateEntered;
            } // end of for

            dynamicHeader = dynamicHeader + '</ul></div>';

            if (getLocal("ScreenName") == "PastDueorder") {
                $('#pastDueOrderWOListDiv').append(dynamicHeader);
                $('#pastDueOrderWOListDiv').trigger('create');
                $('#NoPastDueOrder').html('(' + numberOfOrders + ')');
            }
            else if (getLocal("ScreenName") == "DemandOrders") {
                $('#demandOrdersWOListDiv').append(dynamicHeader);
                $('#demandOrdersWOListDiv').trigger('create');
                $('#NoDemandOrders').html('(' + numberOfOrders + ')');
            }
            else if (getLocal("ScreenName") == "PMOrders") {
                $('#PMOrderWOListDiv').append(dynamicHeader);
                $('#PMOrderWOListDiv').trigger('create');
                $('#NoPMOrders').html('(' + numberOfOrders + ')');
            }

        } // end of else
        closeLoading();
    } // end of try
    catch (Error) {
        closeLoading();
        setTimeout(function () {
            showError(GetCommonTranslatedValue("ErrorDescription") + Error.message);
        }, 500);
    }
}

function CreateList(orderDetails) {
    var PriorityTranslation = GetTranslatedValue("PriorityDropDownOption");
    var StatusTranslation = GetTranslatedValue("StatusDropDownOption");
    var AssignmentTranslation = GetTranslatedValue("AssignmentLabel");
    var dynamicCollList = '';
    dynamicCollList = dynamicCollList +
                        '<li>' +
                            '<a id=' + orderDetails.WorkOrderNumber + ' href="#" onclick="navigateToWODetails(this)">' +
                            '<p class="ui-li-aside ui-li-desc"><strong>' +
                            PriorityTranslation + ' : ' + orderDetails.Priority + '</strong></p> ' +
                            '<p class="customPStyle">' + orderDetails.WorkOrderNumber + '</p>' +
                            '<p class="customPStyle">' + StatusTranslation + ' : ' + orderDetails.Status + '</p>' +
                            '<p class="customPStyle">' + AssignmentTranslation + ' : ' + orderDetails.AssignName + '</p>' +
                            '<p class="customPStyle">' + orderDetails.Location + '</p></a>' +
    '</li>';
    return dynamicCollList;
}

function links() {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username"))
    });
    var accessURL = standardAddress + "Dashboard.ashx?methodname=MenuItems";
    getLinks(accessURL, myJSONobject);
}

function getLinks(accessURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            appendPanelButtons(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function navigateTO(obj) {
    var linkID = obj.id;
    NavigateToWorkOrderPage(linkID);
}


function LogoutCompletely() {

    // Clear the Allocation Lock. Since we might lose the local storage here, added the functionality here itself. 
    var allocationJSONObject = iMFMJsonObject({
        WorkOrdernumber: getLocal("WorkOrderNumber"),
        Username: decryptStr(getLocal("Username")),
        LoginUserSequenceNo: decryptStr(getLocal("LoginUserSequenceNo"))
    });

    var manageAllocationURL = standardAddress + "IMFMOrder.ashx?methodname=AllocationLocks";
    $.postJSON(manageAllocationURL, allocationJSONObject, function (data) {
    });

    // Clear the Allocation Lock End. 

    var SSOToken_temp = getLocal("SSOToken");
    var SessionID_Value = getLocal("SessionID");

    var databaseID = getLocal("DatabaseID");
    var databaseName = getLocal("DatabaseName");
    ////    var pastDueGroupByValue = getLocal("pastDueOrderPageGroupByValue");
    ////    var demandOrderGroupByValue = getLocal("demandOrdersPageGroupByValue");
    ////    var pmOrderGroupByValue = getLocal("PMOrdersPageGroupByValue");
    ////    var woViewGroupByValue = getLocal("WorkOrderViewGroupByValue");
    var xmlTranslation = getLocal("XmlTranslation");
    var xmlLastSynceDate = getLocal("XmlLastSyncDate");
    var xmlLastSyncLanguage = getLocal("XmlLastSyncLanguage");
    var language = getLocal("Language");
    var languageName = getLocal("LanguageName");
    var supportedLanguages = getLocal("SupportedLanguages");
    var username = getLocal("Username");
    var iMFMOfflineEncryption = getLocal("magpiejay");
    var URL_STANDARDADDRESS_STRING_temp = getLocal("URL_STANDARDADDRESS_STRING");
    var Module_temp = getLocal("Module");
    var Version_temp = getLocal("Version");    

    //07-01-2019 
    var iMFM_NoOfDaysToExpireSSO_temp = getLocal("iMFM_NoOfDaysToExpireSSO");
    var iMFM_SSOAuthURL_temp = getLocal("iMFM_SSOAuthURL");
    var SSOUser_temp = getLocal("SSOUser");
    var PreviousScreen_temp = getLocal("PreviousScreen");
    var dayDifferenceValue = getLocal("dayDifference");
    var showLogutOption_temp = getLocal("ShowLogutOption");
    // 12-13-2019 RM
    var SafetyNetTimeOutInterval_temp = getLocal("SafetyNetTimeOutInterval");
    var SafetyNetRetryInterval_temp = getLocal("SafetyNetRetryInterval");
    var EnableSafetyNet_temp = getLocal("EnableSafetyNet");
    var SafetyNetTested_temp = getLocal("SafetyNetTested");
    var DateOfSafetyNetCheckDone_temp = getLocal("DateOfSafetyNetCheckDone");
    var employeeNumber = localStorage.getItem("EmployeeNumber");
    var xmlToDbFeatureTemp = getLocal("xmltodbSupported");

    localStorage.clear();

    setLocal("xmltodbSupported", xmlToDbFeatureTemp);
    setLocal("EmployeeNumber", employeeNumber);
    setLocal("SessionID", SessionID_Value);
    setLocal("SSOToken", SSOToken_temp);

    setLocal("DatabaseID", databaseID);
    setLocal("DatabaseName", databaseName);
    setLocal("URL_STANDARDADDRESS_STRING", URL_STANDARDADDRESS_STRING_temp);
    ////    setLocal("pastDueOrderPageGroupByValue", pastDueGroupByValue);
    ////    setLocal("demandOrdersPageGroupByValue", demandOrderGroupByValue);
    ////    setLocal("PMOrdersPageGroupByValue", pmOrderGroupByValue);
    ////    setLocal("WorkOrderViewGroupByValue", woViewGroupByValue);
    setLocal("XmlTranslation", xmlTranslation);
    setLocal("XmlLastSyncDate", xmlLastSynceDate);
    setLocal("XmlLastSyncLanguage", xmlLastSyncLanguage);
    setLocal("Language", language);
    setLocal("LanguageName", languageName);
    setLocal("SupportedLanguages", supportedLanguages);
    setLocal("Username", username);
    setLocal("magpiejay", iMFMOfflineEncryption);
    setLocal("Module", Module_temp);
    setLocal("Version", Version_temp);

    //07-01-2019 srk
    setLocal("iMFM_NoOfDaysToExpireSSO", iMFM_NoOfDaysToExpireSSO_temp);
    setLocal("iMFM_SSOAuthURL", iMFM_SSOAuthURL_temp);
    setLocal("SSOUser", SSOUser_temp);
    setLocal("PreviousScreen", PreviousScreen_temp);
    setLocal("dayDifference", dayDifferenceValue);
    setLocal("ShowLogutOption", showLogutOption_temp);
    // 12-13-2019 RM
    setLocal("SafetyNetTimeOutInterval", SafetyNetTimeOutInterval_temp);
    setLocal("SafetyNetRetryInterval", SafetyNetRetryInterval_temp);
    setLocal("EnableSafetyNet", EnableSafetyNet_temp);
    setLocal("SafetyNetTested", SafetyNetTested_temp);
    setLocal("DateOfSafetyNetCheckDone", DateOfSafetyNetCheckDone_temp);

    setTimeout(function () {
        window.location.href = "index.html";
        return;
    }, 1000);
}

function logout() {
    if (syncInProgress == 1) {
        setLocal("LogoutCompletly", "true");
        if (navigator.onLine) {
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql("SELECT COUNT(*) AS COUNT FROM JSONdataTable", [], function (te, result) {
                    if (result.rows.length >= 1) {
                        if (result.rows.item(0).COUNT > 0) {
                            ShowAutoSyncPopup();
                        }
                        else {
                            LogoutCompletely();
                        }
                    }
                    else {
                        LogoutCompletely();
                    }
                });
            });
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else {
        ////showError("Data Sync in progress. Please wait till the Sync completes.");
        showError(GetCommonTranslatedValue("WaitTillSync"));
    }
}

function NavigateToInspections(obj) {
    IsCapitalScreenFlag = 0;
    var navigationId = obj.id;

    // Set this to allow unlocking a WO.
    AllowUnLock = true;

    if (navigator.onLine) {
        if (navigationId == "400013") {
            $.mobile.changePage('OpenInspections.html');
        }
        if (navigationId == "400014") {
            $.mobile.changePage("InspectionStatus.html");
        }
        if (navigationId == "400021") {
            $.mobile.changePage("InspectionViewCapital.html");
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function navigateBackTOWODetails() {
    $.mobile.changePage("WorkOrderDetails.html");
}

function getPastDueCount() {
    var myJSONobject = iMFMJsonObject({});
    var pastDueCountURL = standardAddress + "DashBoard.ashx?methodname=GetPastDueOrdersCount";

    if (navigator.onLine) {
        $.postJSON(pastDueCountURL, myJSONobject, function (data) {
            var PastDueOrderCount = data.Table[0].Column1;
            var DemandOrderCount = data.Table1[0].Column1;
            var PMOrderCount = data.Table2[0].Column1;
            var pageID = $.mobile.activePage.attr('id');
            $("#" + pageID + "navigationPanel").find('#400001').html('Past Due Orders(' + PastDueOrderCount + ')');
            $("#" + pageID + "navigationPanel").find('#400008').html('WO View(' + DemandOrderCount + ')');
            $("#" + pageID + "navigationPanel").find('#400012').html('PM Orders(' + PMOrderCount + ')');
            $("#" + pageID + "navigationPanel").panel("open");
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function LoadMyLocation() {
    try {
        function handler(location) {
            messageLatitude = location.coords.latitude;
            messageLongitude = location.coords.longitude;
            document.getElementById('LatitudeValue').innerHTML = messageLatitude.toFixed(6);
            document.getElementById('LongitudeValue').innerHTML = messageLongitude.toFixed(6);
            // Added by Arpitha to be used in Inspections
            GlobalLat = messageLatitude.toFixed(6);
            GlobalLong = messageLongitude.toFixed(6);
        }
        navigator.geolocation.getCurrentPosition(handler);
    }
    catch (error) {
        showError(error.message);
    }
}


function getBarChartData() {
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql("SELECT orderkey, COUNT(*) as Count FROM WorkOrderDetailsTable group by orderkey", [], function (ts, result) {
            var pageID = $.mobile.activePage.attr('id');
            var pastdueOrdercount = 0;
            var demandOrderCount = 0;
            var PMOrdercount = 0;
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var rowitem = result.rows.item(i);
                    switch (rowitem.OrderKey) {
                        case 1: pastdueOrdercount = rowitem.Count;
                            break;
                        case 2: demandOrderCount = rowitem.Count;
                            break;
                        case 3: PMOrdercount = rowitem.Count;
                            break;
                    }
                }
                $("#" + pageID).find('#dashBoardpastDueOrder span').text('(' + pastdueOrdercount + ')');
                $("#" + pageID).find('#dashBoardDemandOrder span').text('(' + demandOrderCount + ')');
                $("#" + pageID).find('#dashBoardPMOrder span').text('(' + PMOrdercount + ')');
                drawChart(pastdueOrdercount, demandOrderCount, PMOrdercount);
            }
        });
    });
}

function SetDB() {
    if (getLocal("DatabaseID") !== undefined || getLocal("DatabaseID") !== '') {
        $("#DataBaseName").val(getLocal("DatabaseID"));
    }
}

var groupBy = "";
function changeGroup(obj) {
    var pageID = $.mobile.activePage.attr('id');
    groupBy = $("#" + pageID).find("#" + obj.id + " option:selected").val();
    setLocal(pageID + "GroupByValue", groupBy);
    //if (groupBy != "ENTEREDDATE") {
    //    var selectQuery = BuildGroupBySelectQuery(groupBy, pageID);
    //    executeQuery(selectQuery, BindGroupByCollapsible, function (ts, error) {    (GetTranslatedValue("ErrorMessage")); });
    //}
    //else {
    BindOfflineWorkOrderList(pageID);
    //}
}

function BuildGroupBySelectQuery(groupBy, pageID) {
    var selectQuery;
    try {
        if (pageID == "pastDueOrderPage") {
            if (groupBy == "PRIORITY") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,CAST(SUBSTR(D.Priority, 2,length(D.Priority))AS INT) as myprior,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered ,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C ,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 1 ) Order By myprior';
            }
            else if (groupBy == "BUILDING") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 1 ) Order By Location3';
            }
            else if (groupBy == "TARGETDATE") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.CompletionTarget as CompletionTarget, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 1 ) Order By DiffDate DESC';
            }
            else
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered ,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C ,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 1 ) Order By ' + groupBy;
            return selectQuery;
        }
        else if (pageID == "demandOrdersPage") {
            if (groupBy == "PRIORITY") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,CAST(SUBSTR(D.Priority, 2,length(D.Priority))AS INT) as myprior,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered ,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C ,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 2 ) Order By myprior';
            }
            else if (groupBy == "BUILDING") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 2 ) Order By Location3';
            }
            else if (groupBy == "TARGETDATE") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.CompletionTarget as CompletionTarget, D.DiffDate as DiffDate, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 2 ) Order By DiffDate DESC';
            }
            else
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 2 ) Order By ' + groupBy;
            return selectQuery;
        }
        else if (pageID == "PMOrdersPage") {
            if (groupBy == "PRIORITY") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,CAST(SUBSTR(D.Priority, 2,length(D.Priority))AS INT) as myprior,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered ,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C ,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 3 ) Order By myprior';
            }
            else if (groupBy == "BUILDING") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 3 ) Order By Location3';
            }
            else if (groupBy == "TARGETDATE") {
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered,C.Location1 as Location,C.Location3 as BuildingName,C.L2TCCProjectNumber as PropertyID, D.CompletionTarget as CompletionTarget, D.ETA as DateNextArrivalSite  FROM WorkOrderContactsTable C,WorkOrderDetailsTable D WHERE (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 3 ) Order By DiffDate DESC';
            }
            else
                selectQuery = 'SELECT D.WorkOrderNumber as WorkOrderNumber,D.EnteredDate as EnteredDate,D.OrderKey as OrderKey,D.Status as Status,D.StatusDesc as StatusDesc,D.Priority as Priority,D.Assignment_Name as Assignment_Name,D.ProblemDesc as ProblemDescription,D.SortingDateEntered as SortingDateEntered ,C.Location1 as Location,C.L2TCCProjectNumber as PropertyID, D.ETA as DateNextArrivalSite FROM WorkOrderContactsTable C , WorkOrderDetailsTable D ON (C.WorkOrderNumber = D.WorkOrderNumber AND D.OrderKey = 3 ) Order By ' + groupBy;
            return selectQuery;
        }
    }
    catch (error) {
    }
}

function BindGroupByCollapsible(ts, result) {
    try {
        var pageID = $.mobile.activePage.attr('id');
        var listID = "#" + $("#" + pageID).find(".WOListDiv").attr('id');
        $("#" + pageID).find(listID).empty();
        var HTPriority = GetTranslatedValue("PriorityDropDownOption");
        var HTStatus = GetTranslatedValue("StatusDropDownOption");
        var HTAssignment = GetTranslatedValue("AssignmentLabel");
        var HTProblemDescription = GetTranslatedValue("ProblemDescriptionLabel");
        if (result.rows.length === 0) {
            $("#" + pageID).find(".NoOrders").show();
            $(listID).hide();
        }
        else {
            var str = "";
            var i = 0;
            var diva;

            for (i = 0; i < result.rows.length; i++) {
                var data = result.rows.item(i);
                var ultag;
                var appending;
                var count;
                var dynamicStr = "";
                if (groupBy == "PRIORITY") {
                    dynamicStr = data.Priority;
                }
                else if (groupBy == "STATUS") {
                    dynamicStr = data.Status;
                }
                else if (groupBy == "BUILDING") {
                    dynamicStr = data.BuildingName;
                }
                else if (groupBy == "L2TCCProjectNumber") {
                    if (data.PropertyID === "" || data.PropertyID === "null" || data.PropertyID === null) {
                        dynamicStr = "No Property ID";
                    }
                    else
                        dynamicStr = data.PropertyID;
                }
                else if (groupBy == "TARGETDATE") {
                    dynamicStr = (decryptStr(data.CompletionTarget)).substr(0, 12);
                }
                else if (groupBy == "ETADATE") {
                    dynamicStr = (decryptStr(data.DateNextArrivalSite)).substr(0, 12);
                }
                if (dynamicStr != str) {
                    count = 0;
                    appending = '';
                    str = dynamicStr;
                    diva = document.createElement('div');
                    diva.setAttribute("data-role", "collapsible");
                    diva.setAttribute("data-theme", "e");
                    var h4 = document.createElement('h4');

                    if (groupBy == "STATUS") {
                        h4.innerHTML = data.Status + "-" + decryptStr(data.StatusDesc);
                    }
                    else
                        h4.innerHTML = dynamicStr;
                    diva.appendChild(h4);
                    ultag = document.createElement('ul');
                    ultag.setAttribute("class", "ui-listview");
                    ultag.setAttribute("data-role", "listview");
                }
                var wo = "'" + data.WorkOrderNumber + "'";
                var key = "'" + data.OrderKey + "'";
                appending = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-d"><div class="ui-btn-inner ui-li">' +
                                     '<div class="ui-btn-text"><a id="' + data.WorkOrderNumber + '" onclick="javascript:WorkOrderDetailsPage(' + wo + ',' + key + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ' : ' + data.Priority + '</strong></p> <span style="font-size: 0.9em">' + data.WorkOrderNumber + '</span><br />' +
                                     '<span style="font-size: 0.9em">' + HTStatus + ' : ' + data.Status + '</span><br />' +
                                     '<span style="font-size: 0.9em">' + HTAssignment + ' : ' + decryptStr(data.Assignment_Name) + '</span><br />' +
                                        '<ETAPANEL>' +
                                       '<span style="font-size: 0.9em">' + HTProblemDescription + ' : ' + decryptStr(data.ProblemDescription) + '</span><br />' +
                                     '<span style="font-size: 0.9em">' + decryptStr(data.Location) + '</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';

                if (!IsNullOrUndefined(data.DateNextArrivalSite)) {
                    appending = appending.replace('<ETAPANEL>', '<span style="font-size: 0.8em">' + HTETADate + ' : ' + data.DateNextArrivalSite + '</span><br />');
                } else {
                    appending = appending.replace('<ETAPANEL>', '');
                }
                ultag.innerHTML = ultag.innerHTML + appending;
                diva.appendChild(ultag);

                $("#" + pageID).find(listID).append(diva);
            }
            $("#" + pageID).find(listID).collapsibleset("refresh");
        }
    }
    catch (e) {
    }
}

var reA = /[^a-zA-Z]/g;
var reN = /[^0-9]/g;
function sortAlphaNum(a, b) {
    var aA = a.replace(reA, "");
    var bA = b.replace(reA, "");
    if (aA === bA) {
        var aN = parseInt(a.replace(reN, ""), 10);
        var bN = parseInt(b.replace(reN, ""), 10);
        return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
        return aA > bA ? 1 : -1;
    }
}

function hideShowSync() {
    if (autoSyncCompleted === 0) {
        $(".SyncNotification").show();
    }
    else {
        $(".SyncNotification").hide();
    }
}

function SelectOrderListingDD(PageID, DropDownID) {
    var companyDefGrouping = getLocal("OrderListingGroupBy");
    if (getLocal(PageID + "GroupByValue") === null || getLocal(PageID + "GroupByValue") === "null") {
        if (companyDefGrouping.toUpperCase() == "PROPERTYID") {
            $("#" + PageID).find(DropDownID).val("L2TCCProjectNumber");
            $("#" + PageID).find(DropDownID).selectmenu("refresh", true);
        }
        else {
            $("#" + PageID).find(DropDownID).val(companyDefGrouping.toUpperCase());
            $("#" + PageID).find(DropDownID).selectmenu("refresh", true);
        }
    }
    else {
        $("#" + PageID).find(DropDownID).val(getLocal(PageID + "GroupByValue"));
        $("#" + PageID).find(DropDownID).selectmenu("refresh", true);
    }
}

// *****************************************************************
// Function to Log the errors from the Client Side into the offline DB
function LogErrors(message) {
    try {
        if (isDebugMode == true) {
            var values = [];
            values.push(message);
            values.push(new Date());
            values.push(decryptStr(getLocal("EmployeeNumber")));
            var insertQuery = 'INSERT INTO ErrorLogTable(Error,CurrentDateTime,EmployeeNumber) VALUES (?,?,?)';
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql(insertQuery, values, function () {
                });
            });
        }
    }
    catch (ex) {
        console.log(ex.message);
    }
}
// *****************************************************************

//// code to handle sync request ///////////////////////////


$.postSyncJSON = function (url, requestFor, data, func) {
    var currentRequest = new Object();
    currentRequest.URL = url;
    currentRequest.Data = data;
    currentRequest.Func = func;
    currentRequest.Request = $.ajax(
        {
            url: url,
            type: "post",
            //headers: { "cache-control": "no-cache" },
            headers: { "Origin": ORIGIN_HEADER },
            //jsonp: "callback",
            dataType: "json",
            //contentType: 'application/json; charset=utf-8',
            //timeout: parseInt(processTime),
            //timeout: parseInt(syncTime),
            //crossDomain: true,       
            processData: true,
            cache: false,
            data: data,
            success: function (result, textStatus, jqXHR) {
                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    //                    try {
                    //                        result = JSON.parse(decryptResponse(result));
                    //                    }
                    //                    catch (ex) {
                    //                        syncErrorMethod(requestFor);
                    //                    }

                    RemoveRequest(jqXHR.ID);

                    //                    if (result[0] == "(" && result[result.length - 1] == ")") {
                    //                        result = result.substring(1, result.length - 1);
                    //                    }
                    func(result);
                }
            },
            error: function (xhr, textStatus, jqXHR) {
                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    RemoveRequest(xhr.ID);
                    syncErrorMethod(requestFor);
                    return;
                }
            }
        });
    currentRequest.Request.ID = GenerateGuid();
    ajaxCalls.push(currentRequest);
}

//// code to handle sync request ///////////////////////////

$.ajaxpostCreateJSON = function (url, sdata, func) {
    var Logurl = url;
    var createWOData = JSON.parse(sdata.WOData);
    $.ajax(
            {
                url: url,
                type: "post",
                //headers: { "cache-control": "no-cache" },
                headers: { "Origin": ORIGIN_HEADER },
                dataType: "json",
                //cache: false,
                data: sdata,
                success: function (result) {
                    if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                        LogoutCompletely();
                    } else {
                        func(result);
                    }
                },
                error: function (error, textStatus, jqXHR) {
                    if (error.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                        LogoutCompletely();
                    } else {
                        var pageID = $.mobile.activePage.attr('id');
                        var popupName = findPopupName(pageID);
                        var errorMsg = "";
                        if (textStatus == 'timeout') {
                            errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                            closeActionPopupLoading();
                            setTimeout(function () {
                                DumpintoLocalDB(createWOData);
                            }, 650);
                            //forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'error') {
                            errorMsg = GetCommonTranslatedValue("InternalError");
                            closeActionPopupLoading();
                            setTimeout(function () {
                                DumpintoLocalDB(createWOData);
                            }, 650);
                            //                        forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'abort') {
                            errorMsg = GetCommonTranslatedValue("RequestAborted");
                            closeActionPopupLoading();
                            setTimeout(function () {
                                DumpintoLocalDB(createWOData);
                            }, 650);
                            //                        forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'parsererror') {
                            errorMsg = GetCommonTranslatedValue("InternalParseError");
                            closeActionPopupLoading();
                            setTimeout(function () {
                                DumpintoLocalDB(createWOData);
                            }, 650);
                            //                        forcePopupClose(popupName, errorMsg);
                        }
                        else {
                            errorMsg = GetCommonTranslatedValue("NetworkLost");
                            closeActionPopupLoading();
                            setTimeout(function () {
                                DumpintoLocalDB(createWOData);
                            }, 650);
                            //                        forcePopupClose(popupName, errorMsg);
                        }
                        return;
                    }
                }
            });
}

$.ajaxpostOrderJSON = function (url, sdata, func) {
    if (splitUrl(url, 'UAT')) {
        $.ajax(
               {
                   url: url,
                   type: "post",
                   //headers: { "cache-control": "no-cache" },
                   headers: { "Origin": ORIGIN_HEADER },
                   dataType: "json",
                   //timeout: parseInt(processTime),
                   //           timeout: 1000,
                   //cache: false,
                   async: true,
                   data: sdata,
                   success: function (result) {
                       if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                           LogoutCompletely();
                       } else {
                           func(result);
                       }
                   },
                   error: function (xhr, textStatus, jqXHR) {
                       var pageID = $.mobile.activePage.attr('id');
                       if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                           LogoutCompletely();

                       } else {
                           BindOfflineWorkOrderList(pageID);

                       }
                   }
               });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }


}

$.postTagDetailsJSON = function (url, data, func) {
    if (splitUrl(url, 'UAT')) {
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
                                        {
                                            url: url,
                                            type: "post",
                                            //headers: { "cache-control": "no-cache" },
                                            headers: { "Origin": ORIGIN_HEADER },
                                            //jsonp: "callback",
                                            dataType: "json",
                                            //timeout: parseInt(processTime),
                                            //cache: false,
                                            async: true,
                                            data: data,
                                            success: function (result, textStatus, jqXHR) {
                                                RemoveRequest("success", jqXHR.ID);
                                                if (result[0] == "(" && result[result.length - 1] == ")") {
                                                    result = result.substring(1, result.length - 1);

                                                }
                                                //                                        result = JSON.parse(result);

                                                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    func(result);
                                                }
                                            },
                                            error: function (xhr, textStatus, jqXHR) {
                                                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    RemoveRequest("Error", xhr.ID);
                                                    var pageID = $.mobile.activePage.attr('id');
                                                    var popupName = findPopupName(pageID);
                                                    var errorMsg = "";
                                                    if (textStatus == 'timeout') {

                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Request timeout, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'error') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Internal error, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'abort') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Request aborted, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'parsererror') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Internal parse error, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Network is too slow or network was lost during data processing, please retry.";
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    return;
                                                }
                                            }
                                        });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

$.postPMDetailsJSON = function (url, data, func) {
    if (splitUrl(url, 'UAT')) {
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
                                        {
                                            url: url,
                                            type: "post",
                                            //headers: { "cache-control": "no-cache" },
                                            headers: { "Origin": ORIGIN_HEADER },
                                            //jsonp: "callback",
                                            dataType: "json",
                                            //timeout: parseInt(processTime),
                                            //cache: false,
                                            async: true,
                                            data: data,
                                            success: function (result, textStatus, jqXHR) {
                                                RemoveRequest("success", jqXHR.ID);
                                                if (result[0] == "(" && result[result.length - 1] == ")") {
                                                    result = result.substring(1, result.length - 1);

                                                }
                                                //                                        result = JSON.parse(result);

                                                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    func(result);
                                                }
                                            },
                                            error: function (xhr, textStatus, jqXHR) {

                                                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    RemoveRequest("Error", xhr.ID);
                                                    var pageID = $.mobile.activePage.attr('id');
                                                    closeLoading();
                                                    return;
                                                }
                                            }
                                        });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

$.postWODetailsJSON = function (url, data, func) {
    if (splitUrl(url, 'UAT')) {
        var currentRequest = new Object();
        currentRequest.URL = url;
        currentRequest.Data = data;
        currentRequest.Func = func;
        currentRequest.Request = $.ajax(
                                        {
                                            url: url,
                                            type: "post",
                                            //headers: { "cache-control": "no-cache" },
                                            headers: { "Origin": ORIGIN_HEADER },
                                            //jsonp: "callback",
                                            dataType: "json",
                                            //timeout: parseInt(processTime),
                                            cache: false,
                                            async: true,
                                            data: data,
                                            success: function (result, textStatus, jqXHR) {
                                                RemoveRequest("success", jqXHR.ID);
                                                if (result[0] == "(" && result[result.length - 1] == ")") {
                                                    result = result.substring(1, result.length - 1);

                                                }
                                                //                                        result = JSON.parse(result);

                                                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    func(result);
                                                }
                                            },
                                            error: function (xhr, textStatus, jqXHR) {
                                                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                                                    LogoutCompletely();
                                                } else {
                                                    RemoveRequest("Error", xhr.ID);
                                                    var pageID = $.mobile.activePage.attr('id');
                                                    var popupName = findPopupName(pageID);
                                                    var errorMsg = "";
                                                    if (textStatus == 'timeout') {

                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Request timeout, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'error') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Internal error, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'abort') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Request aborted, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else if (textStatus == 'parsererror') {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Internal parse error, please try again."+ " "+ xhr.status;
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    else {
                                                        closeLoading();
                                                        setTimeout(function () {
                                                            BindOfflineWorkOrderDetails();
                                                        }, 500);

                                                        //    errorMsg = "Network is too slow or network was lost during data processing, please retry.";
                                                        //    forcePopupClose(popupName,errorMsg);
                                                    }
                                                    return;
                                                }
                                            }
                                        });
    }
    else {
        showError(GetCommonTranslatedValue("InvalidURLMessage"));
    }
}

function splitUrl(urlIdentifier, codeIdentifier) {
    if (codeIdentifier == 'UAT') {
        urlIdentifier = urlIdentifier.split('UAT');
        if (urlIdentifier.length > 2) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        urlIdentifier = urlIdentifier.split('PRD');
        if (urlIdentifier.length > 2) {
            return false;
        }
        else {
            return true;
        }
    }
}

/////*************************** code to Log Requested Data ************************///////////
function fillRequestLogTable(FuncName, jData) {
    var values = [];
    values.push(encryptStr(FuncName));
    values.push(encryptStr(jData));
    values.push(encryptStr(new Date));

    var logInsertQuery = 'INSERT INTO RequestLogTable (FuncName,JsonData,CurrentDateTime) VALUES(?,?,?)';
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(logInsertQuery, values, function () { }, function (ts, error) { console.log(data.WorkOrderNumber + " " + error.message); });
    });
}
/////*************************** code to Log Requested Data ************************///////////

/////*************************** code to Log exception ************************///////////
function fillExceptionTable(Message) {
    var values = [];
    values.push(Message);
    values.push(new Date);

    var logInsertQuery = 'INSERT INTO ExceptionLogTable (ErrorMessage,CurrentDateTime) VALUES(?,?)';
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(logInsertQuery, values, function () { }, function (ts, error) { console.log(data.WorkOrderNumber + " " + error.message); });
    });
}

/////*************************** code to Log exception ************************///////////


//////////////////////////********** code for allocation lock ***************//////////////
$.postAllocationJSON = function (url, data, func) {
    $.ajax({
        url: url,
        type: "post",
        headers: { "cache-control": "no-cache", "Origin": ORIGIN_HEADER },
        jsonp: "callback",
        datatype: "json",
        timeout: parseInt(10000),
        cache: false,
        data: data,
        success: function (result, textStatus, jqXHR) {
            RemoveRequest(jqXHR.ID);
            if (result[0] == "(" && result[result.length - 1] == ")") {
                result = result.substring(1, result.length - 1);
            }
            if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                LogoutCompletely();
            } else {
                if (!IsStringNullOrEmpty(result)) {
                    result = JSON.parse(result);
                }
                func(result);
                ////do nothing for allocation lock
            }
        },
        error: function (xhr, textStatus, jqXHR) {
            if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                LogoutCompletely();
            } else {
                ////do nothing for allocation lock
                console.log(textStatus);
            }
        }
    });
};



///////////////////////////Retrying for search ////////////////////////////////////
$.postSearchJSON = function (url, data, func) {
    var Logurl = url;
    var currentRequest = new Object();
    currentRequest.URL = url;
    currentRequest.Data = data;
    currentRequest.Func = func;
    currentRequest.Request = $.ajax(
        {
            url: url,
            type: "post",
            //headers: { "cache-control": "no-cache" },
            headers: { "Origin": ORIGIN_HEADER },
            jsonp: "callback",
            datatype: "json",
            //timeout: parseInt(processTime),
            tryCount: 0,
            retryLimit: 2,
            //cache: false,
            data: data,
            success: function (result, textStatus, jqXHR) {
                RemoveRequest(jqXHR.ID);
                if (result[0] == "(" && result[result.length - 1] == ")") {
                    result = result.substring(1, result.length - 1);

                }
                if (result === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    result = JSON.parse(result);

                    func(result);
                }
            },
            error: function (xhr, textStatus, jqXHR) {
                if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                    LogoutCompletely();
                } else {
                    var pageID = $.mobile.activePage.attr('id');
                    this.tryCount++;
                    if (this.tryCount < this.retryLimit) {
                        //try again
                        $("#" + pageID + "loadingPopup").find('h1').text(GetCommonTranslatedValue("RetryingLabel"));
                        $.ajax(this);
                        return;
                    }
                    else {
                        var popupName;
                        RemoveRequest(xhr.ID);
                        popupName = findPopupName(pageID);
                        $("#" + pageID + "loadingPopup").find('h1').text(GetCommonTranslatedValue("LoadingLabel"));
                        var errorMsg = "";
                        if (textStatus == 'timeout') {
                            errorMsg = GetCommonTranslatedValue("TimeoutLabel");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'error') {
                            errorMsg = GetCommonTranslatedValue("InternalError");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'abort') {
                            errorMsg = GetCommonTranslatedValue("RequestAborted");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else if (textStatus == 'parsererror') {
                            errorMsg = GetCommonTranslatedValue("InternalParseError");
                            forcePopupClose(popupName, errorMsg);
                        }
                        else {
                            errorMsg = GetCommonTranslatedValue("NetworkLost");
                            forcePopupClose(popupName, errorMsg);
                        }
                    }
                    return;
                }
            }
        });
    currentRequest.Request.ID = GenerateGuid();
    ajaxCalls.push(currentRequest);
};


function resendSearchRequest(SearchReqID) {
    for (var index = 0; index < ajaxCalls.length; index++) {
        if (ajaxCalls[index].Request.ID == SearchReqID) {
            $.postSearchJSON(ajaxCalls[index].URL, ajaxCalls[index].Data, ajaxCalls[index].Func);
            ////            console.log(ajaxCalls[index].URL + '   ' + ajaxCalls[index].Data + '     ' + ajaxCalls[index].Func);           
        }
    }
}

function OrderList_TranslationsCompleted() {
    // Dynamically create the Group By dropdown values with translations.
    var pageID = "#" + $.mobile.activePage.attr("id");
    var optionString = '<option value="L2TCCProjectNumber">' + GetTranslatedValue('PropertyIdDropDownOption') + '</option>' +
                    '<option value="ENTEREDDATE">' + GetTranslatedValue('DateEnteredDropDownOption') + '</option>' +
                    '<option value="PRIORITY">' + GetTranslatedValue('PriorityDropDownOption') + '</option>' +
                    '<option value="STATUS">' + GetTranslatedValue('StatusDropDownOption') + '</option>' +
                    '<option value="BUILDING">' + GetTranslatedValue('BuildingDropDownOption') + '</option>' +
    		    '<option value="TARGETDATE">' + GetTranslatedValue('TargetDateDropDownOption') + '</option>' +
    		    '<option value="ETADATE">' + GetTranslatedValue('ETADateDropDownOption') + '</option>';

    $(pageID + "GroupBy").html(optionString);
}

function navigateToPreviousPage() {
    //Set this to allow unlocking of the selected WO
    AllowUnLock = true;

    // Retrieve the breadcrumb and remove the current page from it.
    var breadcrumb = getLocal("Breadcrumb").split(',')
    breadcrumb.pop();

    // Now retrieve the page we're navigating to.
    var pageID = breadcrumb.pop();

    //console.log(breadcrumb);
    // Set the breadcrumb again and then navigate to the page.
    setLocal("Breadcrumb", breadcrumb);
    switch (pageID) {
        case "approvalDashboardPage":
            $.mobile.changePage("ApprovalDashboard.html"); break;
        case "approvalDetailsPage":
            $.mobile.changePage("ApprovalDetails.html"); break;
        case "approvalLogPage":
            $.mobile.changePage("ApprovalLogPage.html");
            break;
        case "AssetDashboard":
            $.mobile.changePage("AssetDashboard.html");
            break;
        case "AssetSearch":
            $.mobile.changePage("AssetSearch.html");
            break;
        case "AssetsList":
            $.mobile.changePage("AssetsList.html");
            break;
        case "attachmentImage":
            $.mobile.changePage("Attachment.html");
            break;
        case "CreateWOC":
            $.mobile.changePage("CreateWOC.html");
            break;
        case "CreateWOD":
            $.mobile.changePage("CreateWOD.html");
            break;
        case "CreateWOO":
            $.mobile.changePage("CreateWOO.html");
            break;
        case "CreateWOT":
            $.mobile.changePage("CreateWOT.html");
            break;
        case "DailySearchOrder":
            $.mobile.changePage("DailySearch.html");
            break;
        case "DashBoard":
            $.mobile.changePage("Dashboard.html");
            break;
        case "demandOrdersPage":
            setLocal("ScreenName", $.constants.DEMANDORDERS);
            $.mobile.changePage("DemandOrders.html");
            break;
        case "employeeStatusPage":
            $.mobile.changePage("EmployeeStatus.html");
            break;
        case "inspectionAddAsset":
            $.mobile.changePage("InspectionAddAsset.html");
            break;
        case "inspectionAddWorkOrder":
            $.mobile.changePage("InspectionAddWO.html");
            break;
        case "InspectionAdhoc":
            $.mobile.changePage("InspectionAdhoc.html");
            break;
        case "inspectionAreas":
            $.mobile.changePage("InspectionAreas.html");
            break;
        case "inspectionAssets":
            $.mobile.changePage("InspectionAssets.html");
            break;
        case "inspectionCapital":
            $.mobile.changePage("InspectionCapital.html");
            break;
        case "InspectionCapitalLog":
            $.mobile.changePage("InspectionCapitalLog.html");
            break;
        case "categoryPage":
            $.mobile.changePage("InspectionCategories.html");
            break;
        case "inspectionEditAsset":
            $.mobile.changePage("InspectionEditAsset.html");
            break;
        case "editinspectionItemPage":
            $.mobile.changePage("InspectionEditItem.html");
            break;
        case "inspectionItemsPage":
            $.mobile.changePage("InspectionItems.html");
            break;
        case "inspectionAttachmentPage":
            $.mobile.changePage("InspectionPictures.html");
            break;
        case "InspStatusPage":
            $.mobile.changePage("InspectionStatus.html");
            break;
        case "inspectionVendor":
            $.mobile.changePage("InspectionVendor.html");
            break;
        case "inspectionViewCapital":
            $.mobile.changePage("InspectionViewCapital.html");
            break;
        case "viewInspectionWorkOrders":
            $.mobile.changePage("InspectionViewWorkOrders.html");
            break;
        case "intDispOrderPage":
            setLocal("ScreenName", $.constants.INTDISPORDERS);
            $.mobile.changePage("IntDispOrders.html");
            break;
        case "laborDetailsPage":
            $.mobile.changePage("LaborDetails.html");
            break;
        case "logPage":
            $.mobile.changePage("LogPage.html");
            break;
        case "materialPO":
            $.mobile.changePage("MaterialPO.html");
            break;
        case "NewInspectionItemsPage":
            $.mobile.changePage("NewInspectionItems.html");
            break;
        case "openInspection":
            $.mobile.changePage("OpenInspections.html");
            break;
        case "pastDueOrderPage":
            setLocal("ScreenName", $.constants.PASTDUEORDERS);
            $.mobile.changePage("PastDueOrders.html");
            break;
        case "pmjobViewPage":
            $.mobile.changePage("PMJobView.html");
            break;
        case "PMOrdersPage":
            setLocal("ScreenName", $.constants.PMORDERS);
            $.mobile.changePage("PMOrders.html");
            break;
        case "SearchOrder":
            $.mobile.changePage("SearchOrder.html");
            break;
        case "siteProfile":
            $.mobile.changePage("SiteProfile.html");
            break;
        case "TechnicianAvailabilityView":
            $.mobile.changePage("TechnicianAvailabilityView.html");
            break;
        case "TechnicianAvailableDetails":
            $.mobile.changePage("TechnicianAvailableDetails.html");
            break;
        case "TimeCard":
            $.mobile.changePage("TimeCard.html");
            break;
        case "TimeCardEntry":
            $.mobile.changePage("TimeCardEntry.html");
            break;
        case "TimeCardNA":
            $.mobile.changePage("TimeCardNA.html");
            break;
        case "TimeCardSummary":
            $.mobile.changePage("TimeCardSummary.html");
            break;
        case "TimeCardWO":
            $.mobile.changePage("TimeCardWO.html");
            break;
        case "VendorDetails":
            $.mobile.changePage("VendorDetails.html");
            break;
        case "VendorSearchPage":
            $.mobile.changePage("VendorSearch.html");
            break;
        case "VendorSearchResults":
            $.mobile.changePage("VendorSearchResults.html");
            break;
        case "WODetailsPage":
            $.mobile.changePage("WorkOrderDetails.html");
            break;
        case "WorkOrderView":
            $.mobile.changePage("WorkOrdersView.html");
            break;
        case "WOStepPage":
            $.mobile.changePage("WOStep.html");
            break;
        default:
            window.history.back();
            break;
    }
}

function navigateToLoginPage() {
    window.history.back();
}



//*******************To avoid security issues****************************
function securityError(textId) {
    var str = '';
    if (!IsStringNullOrEmpty(textId.val())) {
        str = textId.val();
    }

    str = str.replace(/<br>/gi, "\n");
    str = str.replace(/<p.*>/gi, "\n");
    str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str = str.replace(/<(?:.|\s)*?>/g, "");
    //    str = str.replace(/<b>/, "");
    //    str = str.replace("&lt;/b&gt;", "");
    //    str = str.replace("&lt;i&gt;", "");
    //    str = str.replace("&lt;/i&gt;", "");
    //    str = str.replace("&lt;", "");
    //    str = str.replace("&gt;", "");
    //    str = str.replace("&#39;", "");
    //    str = str.replace("&quot;", "");
    if ($.trim(str) == '') {
        setTimeout(function () {
            //hideImage();
            //showErrorPopUp(true, "Please Enter Valid Information");
            textId.val('');
        }, 1000);
    }
    return $.trim(str);
}

// Method to check whether the given string is Null or Undefined.
function IsNullOrUndefined(string) {
    if (string != null || string != undefined) {
        return false;
    }
    return true;
}

//***************************Session TimeOut*************************************//

var timeoutID;

/// <summary>
/// Method to setup the event handlers
/// </summary>
function setup() {
    this.addEventListener("mousemove", resetTimer, false);
    this.addEventListener("mousedown", resetTimer, false);
    this.addEventListener("keypress", resetTimer, false);
    this.addEventListener("DOMMouseScroll", resetTimer, false);
    this.addEventListener("mousewheel", resetTimer, false);
    this.addEventListener("touchmove", resetTimer, false);
    this.addEventListener("MSPointerMove", resetTimer, false);

    if (!IsStringNullOrEmpty(timeoutID)) {
        window.clearTimeout(timeoutID); //Before starting timer clear the the window timeout, if it is already present. 
    }

    startTimer();
}

/// <summary>
/// Method to start the session timer.
/// </summary>
function startTimer() {
    var tomeout = (decryptStr(getLocal("Timeout")) * 60) * 1000;
    timeoutID = window.setTimeout(goInactive, tomeout);
}

/// <summary>
/// Method to reset the timer.
/// </summary>
function resetTimer(e) {
    window.clearTimeout(timeoutID);
    startTimer();
}

/// <summary>
/// Method to call logout function on Session Timeout.
/// </summary>
function goInactive() {
    logout();
}

//***************************Session TimeOut End***********************************//

/**
* This function will populate dropdowns/form translations on a given form ID.
* @param [string] pageID - The page which we are populating.
*/
function LoadAdditionalFormTranslations(pageID) {
    var selectLabel = GetCommonTranslatedValue("SelectLabel");

    switch (pageID.toLowerCase()) {
        case "approvaldashboardpage":
        case "approvaldetailspage":
            Approval.GetInvoiceRejectionReasons()
                .always(function (dropdownItems) {
                    var rejectionDropdown = '<option value="-1">' + selectLabel + '</option>';
                    var addOptgroup = false;

                    for (var i = 0; i < dropdownItems.length; i++) {
                        rejectionDropdown += '<option value="' + dropdownItems[i].Description + '">' + dropdownItems[i].Description + '</option>';

                        if (dropdownItems[i].Description.length >= 30) {
                            addOptgroup = true;
                        }
                    }

                    if (addOptgroup) {
                        rejectionDropdown += '<optgroup label=""></optgroup>';
                    }

                    $("#" + pageID).find("#ReasonForRejectionDropDown").html(rejectionDropdown).selectmenu("refresh");
                });
            break;
        case "createwoc":
        case "createwod":
        case "createwoo":
        case "createwot":
            // For now, we're adding the population of the Order Type dropdown here.
            var orderTypeContents = '<option value="-1">' + selectLabel + '</option>';
            try {
                var orderTypes = JSON.parse(getLocal("OrderType"));
                orderTypes.forEach(function (orderType) {
                    orderTypeContents += '<option value="' + orderType.Seq + '">' + orderType.OrderType + '</option>';
                });
            } catch (err) {
                console.log(err);
                // If there's an issue with order type parsing or population, just put "SelfGen" hardcoded in there.
                orderTypeContents += '<option value="13">SelfGen</option>';
            }

            $("#" + pageID).find("#orderTypeDropDown").html(orderTypeContents);
            var options = $('#orderTypeDropDown option[value!="-1"]');
            if (options.length === 1) {
                $("#" + pageID).find("#orderTypeDropDown").val(options.val());
                $("#" + pageID).find("#orderTypeDropDown").selectmenu("disable");
            }

            $("#" + pageID).find("#orderTypeDropDown").selectmenu("refresh");
            break;
        default:
            break;
    }
}

/**
* This is a base object constructor for all json objects in the application to extend so
* they don't need to manually add all required params for ajax calls. It includes
* all common params that should be added to every json object for an ajax call.
* @param {Object} newParams - the new params that are being extended into the new json object.
* @returns {Object} - JSON object with required params.
*/
function iMFMJsonObject(newParams) {
    return $.extend({}, newParams, {
        "DatabaseID": GetDatabaseID(),
        "Language": getLocal("Language"),
        "EmployeeNumber": GetEmployeeNumber(),
        "SessionID": GetSessionID(),
        "Application": getLocal("Module")
    });
};

function ConvertPhoneToLink(text) {
    var regex = new RegExp(/(1\W*|\(|)([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})?/ig);
    var html = '<a href="tel:PHONENUMBER">PHONENUMBER</a>';
    var instances = [];

    // Total number of iterations for the string.
    instances = text.match(regex);
    var returnText = "";

    if (instances === null) {
        return text;
    }

    for (var i = 0; i < instances.length; i++) {
        var phonenumber = instances[i];
        var phoneIndex = text.indexOf(phonenumber) + phonenumber.length;

        // Construct the first linked part of the text.
        returnText += text.slice(0, phoneIndex).replace(phonenumber, html.replace(/PHONENUMBER/g, phonenumber));

        // Shave off the part of the return text that we just updated.
        text = text.slice(phoneIndex);
    }

    // Return text because it would contain the remainder of the full string.        
    return returnText + text;
};

/**
* This function will verify that the database ID is constructed correctly with a database
* identifier.
* @param {string} address - The address that we are validating.
* @returns {string} A valid output string for the address that we should be utilizing.
*/
function VerifyDatabaseID(address) {
    if (address == $.constants.STANDARDADDRESS_STRING) {
        // In the case of being logged out or not having a valid string to connect to, we will have to construct it manually.
        var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID"); //page.find("#DataBaseName").val();
        setLocal("DatabaseID", IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? encryptStr(decryptResponse(getLocal("DatabaseID"))) : encryptStr(getLocal("PlainDatabaseID")));

        address = standardAddress + $.constants.DB_STRING + Databasename + 'iMFM/';
    }

    return address;
};

/**
* Simple object comparison utility to verify if an object is the same as another object.
* @param {object} a - The first object to compare.
* @param {object} b - The second object to compare.
* @returns {bool} Whether object a is equal to object b
*/
function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

/**
* Constructor to create a result object in which our json responses should come as.
*/
function JsonResultData() {
    this.Result = false;
    this.Data = null;
    this.PdaSearch = null;
    return this;
}

/**
* Function to update the breadcrumb on the loading of a new page. This will push a new page onto the
* breadcrumb stack for when the user attempts to use the back button.
* @param {string} currentPage - The identifier of the page that we are loading.
* @param {bool} initialize - Boolean to identify if this is a new stack (does not have a back button)
*/
function updateBreadcrumb(currentPage, initialize) {
    if (initialize) {
        setLocal("Breadcrumb", "");
    }

    var breadcrumb = IsStringNullOrEmpty(getLocal("Breadcrumb")) ? [] : getLocal("Breadcrumb").split(',');

    if (breadcrumb[breadcrumb.length - 1] != currentPage) {
        breadcrumb.push(currentPage);
    }

    setLocal("Breadcrumb", breadcrumb);
}

/**
* This function will remove pages from the breadcrumb until it hits the designated page.  
* If no page is designated, it will remove the last page on the breadcrumb. 
* This is primarily used on the Inspection pages to allow the user 
*    to go from item level to area level and/or other similar jumps backward.
* @param {string} page - This is the page that we are removing everything up to.
*/
function removePageFromBreadcrumb(page) {
    var breadcrumb = IsStringNullOrEmpty(getLocal("Breadcrumb")) ? [] : getLocal("Breadcrumb").split(',');
    var breadcrumbLimit;

    // If page is undefined, we want to pop the current page.
    if (typeof page === "undefined") {
        breadcrumbLimit = 1;
    } else {
        breadcrumbLimit = breadcrumb.indexOf(page) !== -1 ? breadcrumb.length - breadcrumb.indexOf(page) : 0;
    }

    for (var i = 0; i < breadcrumbLimit; i++) {
        breadcrumb.pop();
    }

    setLocal("Breadcrumb", breadcrumb);
}

function Settings_OpenPopUp() {
    var page = $("#" + $.mobile.activePage.attr('id'));
    var databaseName = page.find("#DataBaseName");
    var databaseID = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");

    if (!IsObjectNullOrUndefined(databaseName) && !IsStringNullOrEmpty(databaseID)) {
        databaseName.val(databaseID);
    }
    else {
        databaseName.val("");
    }

    var data = [];
    supportedLanguagesTemp = getLocal("SupportedLanguages");

    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");
    supportedLanguagesDropDown.empty();

    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);
    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

    if (!IsStringNullOrEmpty(supportedLanguagesTemp)) {
        data = JSON.parse(supportedLanguagesTemp);

        if (!IsObjectNullOrUndefined(supportedLanguagesDropDown) && !IsObjectNullOrUndefined(data)) {
            for (var arrayCount = 0; arrayCount < data.length; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", data[arrayCount].LangAbbrv);
                option.innerHTML = data[arrayCount].LangAlias;
                supportedLanguagesDropDown.append(option);
            }
        }
    }

    supportedLanguagesDropDown.val(getLocal("Language"));
    supportedLanguagesDropDown.selectmenu("refresh", true);
    $("#" + $.mobile.activePage.attr('id') + "SettingsPopup").popup("open");
}

function configureSettingsButton(elementId) {
    if (getLocal("SSOUser") == "true") {
        $("#" + elementId).hide();
    } else {
        $("#" + elementId).hide();
    }
}

function isEmptyObject(obj) {

    if (typeof (obj) == "string" && (obj == "" || obj == "{}")) {
        return false;
    }
    return true;
}

function GetDatabaseID() {
    return decryptStr(getLocal("DatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("DatabaseID");
}

function GetEmployeeNumber() {
    return decryptStr(getLocal("EmployeeNumber")) ? decryptStr(getLocal("EmployeeNumber")) : getLocal("EmployeeNumber");
}

function GetSessionID() {
    return decryptStr(getLocal("SessionID")) ? decryptStr(getLocal("SessionID")) : getLocal("SessionID");
}

/** This is a safety net API call for device verification. 
* This method is going to make API call to google safetynet API
* and get the response and verify the same against sent data to confirm 
* the device is genuine also this method will show the harmful apps installed in the device.
*/
function safetyNetDeviceVerification() {
    if (device && device.platform == 'Android') {
        var isSafetyNetEnabled = getLocal("EnableSafetyNet");
        if (isSafetyNetEnabled == "True") {
            var safetyNetTested = getLocal("SafetyNetTested");
            if (safetyNetTested == null || safetyNetTested == "null" || isSafetyNetCheckTimedOut()) safetyNetTested = "False";
            if (safetyNetTested != "True" && isSafetyNetCheckTimedOut()) {
                var nonce = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 8; i++) {
                    nonce += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                var apiRequestTime = (new Date()).getTime();
                var safetyNetRetryInterval = getLocal("SafetyNetRetryInterval");
                var safetyNetRetryIntervalInt = 10 * 60 * 1000;
                if (safetyNetRetryInterval !== null) {
                    safetyNetRetryIntervalInt = Number(safetyNetRetryInterval) * 60 * 1000;
                }
                /* API Key “AIzaSyAT5wz37AMm5CKEC5n_koJ6fms5VnGvG6U“ need to be changed with API key generated from Manohar’s gmail account.*/
                window.safetynet.attest(nonce, "AIzaSyAu3QKHoEBDMs_Mlu68MwpoupyofdE4em8", function (safetyNetJSWResponse) {
                    //console.log(safetyNetJSWResponse);
                    if (safetyNetJSWResponse != null) {
                        //if verification is success call safety net at the comapny default interval.
                        var base64Url = safetyNetJSWResponse.split('.')[1];
                        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        var parsedResult = JSON.parse(jsonPayload);
                        var decodedNonce = atob(parsedResult.nonce);
                        var apiResponseTime = parsedResult.timestampMs;
                        //var array = atob(parsedResult.apkCertificateDigestSha256);
                        //var decodedSha56 = array[0];
                        //console.log(parsedResult);
                        //var decodedSha56 = atob(parsedResult.apkCertificateDigestSha256);
                        //console.log("printing Safetynet Success" + decodedNonce);
                        var timeDiff = apiResponseTime - apiRequestTime;
                        var maxTimeDiff = 2 * 60 * 1000;
                        if (parsedResult.basicIntegrity && parsedResult.ctsProfileMatch && (nonce == decodedNonce) && (parsedResult.apkPackageName == "com.mainstreamsasp.amfm") && (timeDiff < maxTimeDiff)) {
                            setLocal("SafetyNetTested", "True");
                            setLocal("DateOfSafetyNetCheckDone", (new Date()));
                            window.safetynet.enableAppVerification(function (enabledResponse) {
                                //console.log("app verification enabled" + enabledResponse);
                                window.safetynet.listHarmfulApps(function (harmFulAppsResponse) {
                                    //console.log(harmFulAppsResponse);                                
                                    if (harmFulAppsResponse.length > 0) {
                                        navigator.notification.confirm(
                                        'We found below listed potentially harmful apps on your device, please go to settings and uninstall the harmful apps or press continue ' + harmFulAppsResponse,  // message
                                        function onConfirm(buttonIndex) {
                                            if (buttonIndex == 1) {
                                                //Future use - COntinue button.
                                            } else {
                                                if (window.cordova && window.cordova.plugins.settings) {
                                                    //console.log('openNativeSettingsTest is active');
                                                    window.cordova.plugins.settings.open("application", function () {
                                                        //console.log('opened settings');
                                                    },
                                                    function () {
                                                        //console.log('failed to open settings');
                                                    }
                                                    );
                                                } else {
                                                    //console.log('openNativeSettingsTest is not active!');
                                                }
                                            }
                                        },
                                        'Found Harmful Apps',
                                        ['Continue', 'Go to Settings']
                                    );
                                        //console.log("printing list success");
                                    }
                                }, function (error) {
                                    //console.error(error);
                                    //console.log("printing list error");
                                });
                            }, function (error) {
                                //console.log("app verification not enabled" + error);
                                alert("App verification not enabled, please enable and try again.");
                                navigator.app.exitApp();
                            });
                        } else {
                            alert("Your device has not passed Device verificaton test. Try again!");
                            navigator.app.exitApp();
                        }
                    } else {
                        setTimeout(safetyNetDeviceVerification(), Number(safetyNetRetryIntervalInt));
                    }
                }, function (error) {
                    //console.error(error);
                    //console.log("printing Safetynet error");
                    setTimeout(safetyNetDeviceVerification(), Number(safetyNetRetryIntervalInt));
                });
            }
        }
    }
}

function isSafetyNetCheckTimedOut() {
    var safetyNetTimeout = getLocal("SafetyNetTimeOutInterval");
    var safetyNetTimeoutInt = 24;
    if (safetyNetTimeout !== null) {
        safetyNetTimeoutInt = Number(safetyNetTimeout);
    }
    var dateToCheck = getLocal("DateOfSafetyNetCheckDone");
    var actualDate = new Date();
    if (dateToCheck === null) {
        return true;
    } else {
        var oldDate = new Date(dateToCheck);
        var diff = actualDate.getTime() - oldDate.getTime();
        var daysElapsed = diff / (1000 * 3600 * 24);
        return daysElapsed >= (Number(safetyNetTimeoutInt) / 24);
    }
}

function commentsApproveRejectLimit(max) {
    var maxLength = max;
    $('textarea').keyup(function () {
        var length = $(this).val().length;
        var length = maxLength - length;
        $('#AddCommentCharLimitNos').text(length);
    });
}