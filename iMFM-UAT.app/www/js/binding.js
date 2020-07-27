
function ShowMenuItems() {
    ////below code is added is user navigates from log screen after completing action Comment.
    createWorkOrderFlag = false;
    ////the below code is to remove white menu
    var pageId = $.mobile.activePage.attr('id');
    $('#' + pageId + 'navigationPanel').find('div').removeClass('ui-li-static ui-btn-up-c');

    if (navigator.onLine) {
        if (menuItemCount === 0) {
            menuItemCount = 1;
            GetOfflinePastDueOrderCount();
        }
        else {
            GetOfflinePastDueOrderCount();
        }
    }
    else {
        GetOfflinePastDueOrderCount();
    }
    $.mobile.silentScroll(0);
}

function GoHome() {
    $.mobile.changePage($("#DashBoard"), { reverse: true, transition: "none" });
}


function appendPanelButtons(result) {
    var dynamicUl = '<li data-mini="true" id="navigationPanelHome" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-mini ui-btn-icon-right ui-li-has-arrow ui-li navigation-links">' +
    '<div class="ui-btn-inner ui-li">' +
    '<div class="ui-btn-text">' +
    '<a href="javascript:GoHome()"  style="font-size:smaller!important" class="ui-link-inherit">' + GetCommonTranslatedValue("HomeLabel") + '</a>' +
    '</div>' +
    '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
    '</div>' +
    '</li>';
    var pageId = $.mobile.activePage.attr('id');
    var AboutMasterId;

    for (i = 0; i < result.length; i++) {
        if (result[i].MasterId == "400041") {
            setLocal("SiteProfileScreenEditable", result[i].ReadOnly);
        }

        if (result[i].Description != GetCommonTranslatedValue("AboutPageTitle")) {
            dynamicUl = dynamicUl + createATag(result[i].MasterId, result[i].Description);
        }
        else {
            AboutMasterId = result[i].MasterId;
        }
    }

    dynamicUl = dynamicUl + '<li data-mini="true" id="navigationPanelSync" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-mini ui-btn-icon-right ui-li-has-arrow ui-li navigation-links">' +
    '<div class="ui-btn-inner ui-li">' +
    '<div class="ui-btn-text">' +
    '<a href="javascript:Synchronize()" style="font-size:smaller!important" class="ui-link-inherit">' + GetCommonTranslatedValue("SyncLabel") + '</a>' +
    '</div>' +
    '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
    '</div>' +
    '</li>' +
    createATag(AboutMasterId, GetCommonTranslatedValue("AboutPageTitle"));
    // 
    if (getLocal("SSOUser") != null && getLocal("SSOUser").toLowerCase() != "true") {
        dynamicUl = dynamicUl +
        '<li data-mini="true" id="navigationPanelLogout" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-mini ui-btn-icon-right ui-li-has-arrow ui-li navigation-links">' +
        '<div class="ui-btn-inner ui-li">' +
        '<div class="ui-btn-text">' +
        '<a href="javascript:logout()" style="font-size:smaller!important" class="ui-link-inherit">' + GetCommonTranslatedValue("LogOutLabel") + '</a>' +
        '</div>' +
        '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
        '</div>' +
        '</li>';
    }

    $("#" + pageId + "navigationPanel").find("ul").append(dynamicUl);

}

function addPanel() {
    var pageId = $.mobile.activePage.attr('id');
    var panel = $("#DashBoardnavigationPanel").html();
    var divelement = document.createElement('div');
    divelement.setAttribute('id', pageId + 'navigationPanel');
    divelement.setAttribute('class', 'ui-panel ui-panel-position-left ui-panel-display-push ui-body-c ui-panel-animate ui-panel-closed');
    divelement.setAttribute('data-role', 'panel');
    divelement.setAttribute('data-position', 'left');
    divelement.setAttribute('data-display', 'push');
    divelement.setAttribute("style", "display:block");
    $("#" + pageId).append(divelement);
    $("#" + pageId + 'navigationPanel').html(panel);
}

//------------Dynamic Error Poup----------//
function BinderrorPopup(pageId) {

    if ($("#" + pageId + "errorPopup").length > 0) {
        $("#" + pageId + "errorPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'errorPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-rel', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('style', 'width: 300px;display: none;padding:10px');
    popupdiv.setAttribute('data-transition', 'pop');

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    ////contentDiv.innerHTML = "<h4 style='text-align:center'>Alert</h4>";
    var errortext = document.createElement('div');
    ////SR: Pentesting & JQM update
    errortext.setAttribute('style', 'text-align:center;padding:10px');
    errortext.setAttribute('id', pageId + 'errortext');
    contentDiv.appendChild(errortext);

    var errorcloseBtn = document.createElement('a');
    errorcloseBtn.setAttribute('id', 'errorcloseBtn');
    errorcloseBtn.setAttribute('data-role', 'button');
    errorcloseBtn.setAttribute('data-theme', 'b');
    //errorcloseBtn.setAttribute('href', 'javascript:closeError()');
    ////SR: Pentesting & JQM update
    errorcloseBtn.setAttribute('style', 'text-align:center;border-radius:15px');
    errorcloseBtn.setAttribute('href', '#');
    errorcloseBtn.innerHTML = GetCommonTranslatedValue("OkLabel");

    if (errorcloseBtn.innerHTML === "undefined") {
        errorcloseBtn.innerHTML = "OK";
    }

    contentDiv.appendChild(errorcloseBtn);

    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content]').append(popupdiv);
}


function BindSettingsPopup(pageId) {
    // var pageId = $.mobile.activePage.attr('id');
    if ($("#" + pageId + "SettingsPopup").length > 0) {
        $("#" + pageId + "SettingsPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'SettingsPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-transition', 'pop');

    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('data-rel', 'popup');
    popupdiv.setAttribute('style', 'display: none');

    var headerDiv = document.createElement('div');
    headerDiv.setAttribute('data-role', 'header');
    headerDiv.setAttribute('class', 'popup-Header');

    var headerLabel = document.createElement('label');
    headerLabel.setAttribute('id', 'LogOnPopUpHeaderLabel');
    headerLabel.innerHTML = 'Settings';
    headerDiv.appendChild(headerLabel);
    popupdiv.appendChild(headerDiv);

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    var databaseNameText = document.createElement('input');
    databaseNameText.setAttribute('type', 'number');
    databaseNameText.setAttribute('id', 'DataBaseName');
    databaseNameText.setAttribute('name', 'DataBaseName');
    databaseNameText.setAttribute('placeholder', 'Customer ID');
    databaseNameText.setAttribute('min', '100');
    databaseNameText.setAttribute('max', '999');
    databaseNameText.setAttribute('onkeyup', 'LoginSettings_DatabaseNameChanged();');
    contentDiv.appendChild(databaseNameText);

    var languageDropdown = document.createElement('select');
    languageDropdown.setAttribute('id', 'SupportedLanguagesDropDown');
    languageDropdown.setAttribute('onchange', 'LoginSettings_SupportedLanguagesChanged();');
    contentDiv.appendChild(languageDropdown);

    var pleaseWaitLabel = document.createElement('label');
    pleaseWaitLabel.setAttribute('id', 'SettingsPopUpWaitLabel');
    pleaseWaitLabel.setAttribute('style', 'display: none;');
    pleaseWaitLabel.innerHTML = 'Please wait..';
    contentDiv.appendChild(pleaseWaitLabel);

    var invalidDbLabel = document.createElement('label');
    invalidDbLabel.setAttribute('id', 'SettingsPopUpMessageLabel');
    invalidDbLabel.setAttribute('style', 'display: none;');
    invalidDbLabel.innerHTML = invalidDatabaseTranslation;
    contentDiv.appendChild(invalidDbLabel);

    var ssoEnabledLabel = document.createElement('label');
    ssoEnabledLabel.setAttribute('id', 'SSOEnabledMessage');
    ssoEnabledLabel.setAttribute('style', 'display: none;');
    ssoEnabledLabel.innerHTML = invalidDatabaseTranslation;
    contentDiv.appendChild(ssoEnabledLabel);

    var breakLine = document.createElement('br');
    contentDiv.appendChild(breakLine);

    var saveButton = document.createElement('a');
    saveButton.setAttribute('data-role', 'button');
    saveButton.setAttribute('id', 'SaveButton');
    saveButton.setAttribute('data-inline', 'true');
    saveButton.setAttribute('data-theme', 'b');
    saveButton.setAttribute('onclick', 'LoginSettings_SaveButtonClick();');
    saveButton.innerHTML = 'Save';
    contentDiv.appendChild(saveButton);

    var cancelButton = document.createElement('a');
    cancelButton.setAttribute('data-role', 'button');
    cancelButton.setAttribute('id', 'CancelButton');
    cancelButton.setAttribute('data-inline', 'true');
    cancelButton.setAttribute('data-theme', 'b');
    cancelButton.setAttribute('data-rel', 'back');
    cancelButton.setAttribute('onclick', 'LoginSettings_CancelButtonClick();');
    cancelButton.innerHTML = 'Cancel';
    contentDiv.appendChild(cancelButton);
    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content]').append(popupdiv);
}

function BindFullTextPopup(pageId) {
    if ($("#" + pageId + "FullTextPopup").length > 0) {
        $("#" + pageId + "FullTextPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'FullTextPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('style', 'height:500px;display:none');
    popupdiv.setAttribute('data-transition', 'pop');

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    var fullText = document.createElement('div');
    fullText.setAttribute('style', 'text-align:center;overflow:scroll;height:430px;');
    fullText.setAttribute('id', pageId + 'fullText');
    contentDiv.appendChild(fullText);

    var closeBtn = document.createElement('a');
    closeBtn.setAttribute('id', 'fullTextCloseBtn');
    closeBtn.setAttribute('data-role', 'button');
    closeBtn.setAttribute('data-theme', 'b');
    closeBtn.setAttribute('href', '#');
    closeBtn.innerHTML = GetCommonTranslatedValue("OkLabel");
    contentDiv.appendChild(closeBtn);

    var topClose = document.createElement('a');
    topClose.setAttribute('id', 'topFullTextCloseBtn');
    topClose.setAttribute('data-role', 'button');
    topClose.setAttribute('data-theme', 'a');
    topClose.setAttribute('data-icon', 'delete');
    topClose.setAttribute('data-iconpos', 'notext');
    topClose.setAttribute('data-rel', 'back');
    topClose.setAttribute('style', 'float:right;position:absolute;top:-15px;right:-10px;');
    topClose.setAttribute('href', '#');
    contentDiv.appendChild(topClose);

    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('.content-container').append(popupdiv);
}

function showFullTextPopup(fullTextValue, callback) {
    var pageID = $.mobile.activePage.attr('id');
    document.getElementById(pageID + "fullText").innerHTML = fullTextValue;
    $("#" + pageID + "FullTextPopup").attr('style', 'display:block')
    $("#" + pageID + "FullTextPopup").popup().popup("open");
    $("#" + pageID).find("#fullTextCloseBtn").attr('onclick', 'closeFullText(' + callback + ')');
}

function closeFullText(callback) {
    var pageID = $.mobile.activePage.attr('id');
    $('div[id=' + pageID + "FullTextPopup" + ']').popup();
    $("#" + pageID + "FullTextPopup").popup("close");
    setTimeout(function () {
        if (callback != null) {
            callback();
        }
    }, 500);
}
//------------Dynamic Confirmation Poup----------//
function BindConfirmationPopup(pageId) {

    if ($("#" + pageId + "ConfirmationPopup").length > 0) {
        $("#" + pageId + "ConfirmationPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'ConfirmationPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'true');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('style', 'width: 300px;display:none');
    popupdiv.setAttribute('data-transition', 'pop');

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    var confirmationtext = document.createElement('div');
    confirmationtext.setAttribute('style', 'text-align:center');
    confirmationtext.setAttribute('id', pageId + 'ConfirmationText');
    contentDiv.appendChild(confirmationtext);

    var ConfirmParentGrid = document.createElement('div');
    ConfirmParentGrid.setAttribute('class', 'ui-grid-a');

    var yesBtnGrid = document.createElement('div');
    yesBtnGrid.setAttribute('class', 'ui-block-a');

    var noBtnGrid = document.createElement('div');
    noBtnGrid.setAttribute('class', 'ui-block-b');

    var confirmYesBtn = document.createElement('a');
    confirmYesBtn.setAttribute('id', pageId + 'confirmYesButton');
    confirmYesBtn.setAttribute('data-role', 'button');
    confirmYesBtn.setAttribute('class', 'primary-button ui-link ui-btn ui-shadow ui-corner-all');
    confirmYesBtn.setAttribute('href', '#');
    confirmYesBtn.innerHTML = GetCommonTranslatedValue("YesLabel");
    yesBtnGrid.appendChild(confirmYesBtn);

    var confirmNoBtn = document.createElement('a');
    confirmNoBtn.setAttribute('id', pageId + 'confirmNoButton');
    confirmNoBtn.setAttribute('data-role', 'button');
    confirmNoBtn.setAttribute('class', 'secondary-button ui-link ui-btn ui-shadow ui-corner-all');
    confirmNoBtn.setAttribute('href', '#');
    confirmNoBtn.innerHTML = GetCommonTranslatedValue("NoLabel");
    noBtnGrid.appendChild(confirmNoBtn);

    ConfirmParentGrid.appendChild(yesBtnGrid);
    ConfirmParentGrid.appendChild(noBtnGrid);

    contentDiv.appendChild(ConfirmParentGrid);

    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content]').append(popupdiv);
}

function BindAutoSyncPopup(pageId) {
    $.mobile.defaultPageTransition = 'none';
    var errorcloseBtn;
    if ($("#" + pageId + "AutoSyncPopup").length > 0) {
        $("#" + pageId + "AutoSyncPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'AutoSyncPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    popupdiv.setAttribute('style', 'width: 300px;');
    popupdiv.setAttribute('data-transition', 'pop');
    ////SR: Pentesting & JQM update
    //popupdiv.setAttribute('data-rel', 'popup');
    popupdiv.setAttribute('style', 'width: 300px;display:none');
    popupdiv.setAttribute('data-transition', 'pop');

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    contentDiv.innerHTML = "<h4 style='text-align:center'><p>" + GetCommonTranslatedValue("NetworkIdentifiedLabel") + "</p><p>" + GetCommonTranslatedValue("PerformSyncLabel") + "</p></h4>";


    errorcloseBtn = document.createElement('a');
    errorcloseBtn.setAttribute('id', 'AutoSyncOKBtn');
    errorcloseBtn.setAttribute('data-role', 'button');
    errorcloseBtn.setAttribute('class', 'primary-button ui-link ui-btn ui-shadow ui-corner-all');
    errorcloseBtn.setAttribute('data-theme', 'b');
    errorcloseBtn.setAttribute('href', 'javascript:AutoSynchronize()');
    errorcloseBtn.innerHTML = GetCommonTranslatedValue("OkLabel");
    contentDiv.appendChild(errorcloseBtn);

    errorcloseBtn = document.createElement('a');
    errorcloseBtn.setAttribute('id', 'AutoSyncCancelBtn');
    errorcloseBtn.setAttribute('data-role', 'button');
    errorcloseBtn.setAttribute('class', 'secondary-button ui-link ui-btn ui-shadow ui-corner-all');
    errorcloseBtn.setAttribute('data-theme', 'b');
    errorcloseBtn.setAttribute('href', 'javascript:CloseAutoSyncPopup()');
    errorcloseBtn.innerHTML = GetCommonTranslatedValue("CancelLabel");
    contentDiv.appendChild(errorcloseBtn);
    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content]').append(popupdiv);
}


function ShowAutoSyncPopup() {
    var pageID = $.mobile.activePage.attr('id');
    setTimeout(function () {
        var pop = $("#" + pageID + "AutoSyncPopup").popup();
        pop.attr('style', 'display:block');
        pop.popup("open");
    }, 3000);
    /*document.getElementById(pageID + "errorPopup-screen").addEventListener("touchstart", touchHandler, false);
    document.getElementById(pageID + "errorPopup-screen").addEventListener("touchmove", touchHandler, false);
    document.getElementById(pageID + "errorPopup-screen").addEventListener("touchend", touchHandler, false);
    document.getElementById(pageID + "errorPopup-screen").addEventListener("touchcancel", touchHandler, false);
    document.getElementById(pageID + "errorPopup-popup").addEventListener("touchmove", touchHandler, false);*/
}

function CloseAutoSyncPopup() {
    if (getLocal("LogoutCompletly") == "true") {

        var SessionID_Value = getLocal("SessionID");
        var SSOToken_temp = getLocal("SSOToken");
        var databaseID = getLocal("DatabaseID");
        var pastDueGroupByValue = getLocal("pastDueOrderPageGroupByValue");
        var demandOrderGroupByValue = getLocal("demandOrdersPageGroupByValue");
        var pmOrderGroupByValue = getLocal("PMOrdersPageGroupByValue");
        var woViewGroupByValue = getLocal("WorkOrderViewGroupByValue");
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
        var iMFMOfflineEncryption = getLocal("magpiejay");
        // 12-13-2019 RM
        var SafetyNetTimeOutInterval_temp = getLocal("SafetyNetTimeOutInterval");
        var SafetyNetRetryInterval_temp = getLocal("SafetyNetRetryInterval");
        var EnableSafetyNet_temp = getLocal("EnableSafetyNet");
        var SafetyNetTested_temp = getLocal("SafetyNetTested");
        var DateOfSafetyNetCheckDone_temp = getLocal("DateOfSafetyNetCheckDone");
        var xmlToDbFeatureTemp = getLocal("xmltodbSupported");

        localStorage.clear();

        setLocal("xmltodbSupported", xmlToDbFeatureTemp);
        setLocal("SessionID", SessionID_Value);
        setLocal("SSOToken", SSOToken_temp);

        setLocal("DatabaseID", databaseID);
        setLocal("pastDueOrderPageGroupByValue", pastDueGroupByValue);
        setLocal("demandOrdersPageGroupByValue", demandOrderGroupByValue);
        setLocal("PMOrdersPageGroupByValue", pmOrderGroupByValue);
        setLocal("WorkOrderViewGroupByValue", woViewGroupByValue);
        setLocal("URL_STANDARDADDRESS_STRING", URL_STANDARDADDRESS_STRING_temp);
        setLocal("Module", Module_temp);
        setLocal("Version", Version_temp);

        //07-01-2019
        setLocal("iMFM_NoOfDaysToExpireSSO", iMFM_NoOfDaysToExpireSSO_temp);
        setLocal("iMFM_SSOAuthURL", iMFM_SSOAuthURL_temp);
        setLocal("SSOUser", SSOUser_temp);
        setLocal("PreviousScreen", PreviousScreen_temp);
        setLocal("dayDifference", dayDifferenceValue);
        setLocal("ShowLogutOption", showLogutOption_temp);
        setLocal("magpiejay", iMFMOfflineEncryption);
        // 12-13-2019 RM
        setLocal("SafetyNetTimeOutInterval", SafetyNetTimeOutInterval_temp);
        setLocal("SafetyNetRetryInterval", SafetyNetRetryInterval_temp);
        setLocal("EnableSafetyNet", EnableSafetyNet_temp);
        setLocal("SafetyNetTested", SafetyNetTested_temp);
        setLocal("DateOfSafetyNetCheckDone", DateOfSafetyNetCheckDone_temp);

        window.location.href = "index.html";
        return;
    }
    setLocal("CancelAutoSync", "true");
    var pageID = $.mobile.activePage.attr('id');
    $('div[id=' + pageID + "AutoSyncPopup" + ']').popup();
    $("#" + pageID + "AutoSyncPopup").popup("close");
    ////NavigateToWorkOrderPage(MasterID, true);
}


function touchHandler(event) {
    var touches = event.changedTouches,
               first = touches[0],
               type = "";
    switch (event.type) {
        case "touchstart": type = "mousedown"; break;
        case "touchmove": type = "mousemove"; break;
        case "touchend": type = "mouseup"; break;
        default: return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1,
                                      first.screenX, first.screenY,
                                      first.clientX, first.clientY, false,
                                      false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    ////event.preventDefault();
    ////SR: Pentesting & JQM update on cancelable value true
    if (event.cancelable) {
        event.preventDefault();
    }
}

function showError(errorMessage, callback) {
    clearTimeout(fallback);
    var fallback = setTimeout(function () {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID + "errortext").text(errorMessage);
        //$("#" + pageID + "errortext").innerHTML = errorMessage;
        ////SR: Pentesting & JQM update
        $("#" + pageID + "errorPopup").attr('style', 'display: block');
        $("#" + pageID + "errorPopup").find("#errorcloseBtn").attr('onclick', 'closeError(' + callback + ')');
        //$("#" + pageID + "errorPopup").popup().popup("open");
        $("#" + pageID + "errorPopup").popup().popup("open");
        document.getElementById(pageID + "errorPopup-screen").addEventListener("touchstart", touchHandler, false);
        document.getElementById(pageID + "errorPopup-screen").addEventListener("touchmove", touchHandler, false);
        document.getElementById(pageID + "errorPopup-screen").addEventListener("touchend", touchHandler, false);
        document.getElementById(pageID + "errorPopup-screen").addEventListener("touchcancel", touchHandler, false);
        document.getElementById(pageID + "errorPopup-popup").addEventListener("touchmove", touchHandler, false);
    }, 1000); 
}


function showConfirmation(ConfirmationMessage, PrimaryConfirmText, SecondaryConfirmText, callback) {
    var pageID = $.mobile.activePage.attr('id');
    document.getElementById(pageID + "ConfirmationText").innerHTML = ConfirmationMessage;
    $("#" + pageID + 'confirmYesButton .ui-btn-inner .ui-btn-text').text(PrimaryConfirmText);
    $("#" + pageID + 'confirmNoButton .ui-btn-inner .ui-btn-text').text(SecondaryConfirmText);
    $("#" + pageID + 'confirmYesButton').attr('onclick', 'closeConfirmation(true, ' + callback + ')');
    $("#" + pageID + 'confirmNoButton').attr('onclick', 'closeConfirmation(false, ' + callback + ')');
    $("#" + pageID + "ConfirmationPopup").attr('style', 'display:block');
    $('div[id=' + pageID + "ConfirmationPopup" + ']').popup();
    $("#" + pageID + "ConfirmationPopup").popup("open");
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchstart", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchmove", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchend", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-screen").addEventListener("touchcancel", touchHandler, false);
    document.getElementById(pageID + "ConfirmationPopup-popup").addEventListener("touchmove", touchHandler, false);
}

function closeError(callback) {
    var pageID = $.mobile.activePage.attr('id');
    $('div[id=' + pageID + "errorPopup" + ']').popup();
    $("#" + pageID + "errorPopup").popup("close");

    setTimeout(function () {
        if (callback != null) {
            callback();
        }
    }, 500);
}

function closeConfirmation(value, callback) {
    var pageID = $.mobile.activePage.attr('id');
    $('div[id=' + pageID + "ConfirmationPopup" + ']').popup();
    $("#" + pageID + "ConfirmationPopup").popup("close");

    setTimeout(function () {
        if (callback != null) {
            callback(value);
        }
    }, 500);
}

function closeFieldPO(callback) {
    $('#FieldPOSuccessPopup').popup().popup('close');

    setTimeout(function () {
        if (callback != null) {
            callback();
        } else {
            window.history.back();
        }
    }, 500);
}

//------Function to Dynamically bind the Loading Popup in all the screens------//
function popupBinding(pageId) {
    if ($("#" + pageId + "loadingPopup").length > 0) {
        $("#" + pageId + "loadingPopup").remove();
    }
    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'loadingPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('data-rel', 'popup');
    popupdiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px; display:none');

    var h1tag = document.createElement('h1');
    h1tag.innerHTML = GetCommonTranslatedValue("LoadingLabel");
    popupdiv.appendChild(h1tag);

    $("#" + pageId).find('[data-role=content]').append(popupdiv);
}

//------Function to Dynamically bind the synchronizing Popup in all the screens------//
function synchronizBinding(pageId) {
    if ($("#" + pageId + "synchronizingPopup").length > 0) {
        $("#" + pageId + "synchronizingPopup").remove();
    }
    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'synchronizingPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('data-rel', 'popup');
    popupdiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px; display:none');

    var h1tag = document.createElement('h1');
    h1tag.innerHTML = GetCommonTranslatedValue("SyncNotifyingLabel");
    popupdiv.appendChild(h1tag);

    $("#" + pageId).find('[data-role=content]').append(popupdiv);
}

function showLoading() {
    var pageID = $.mobile.activePage.attr('id');
    var Id = "#" + pageID + "loadingPopup";

    if ($("#" + pageID + "loadingPopup").length > 0) {
        $("#" + pageID + "loadingPopup").remove();
    }
    //$(Id).popup().popup("open");

    ////SR: Pentesting & JQM update
    $("#" + pageID + "loadingPopup").css("display", "block")
    $('div[id=' + pageID + "loadingPopup" + ']').popup().popup("open");
}

function closeLoading() {
    // NOTE: for popup chaining, a small timeout delay upon completion of this promise is required. 

    var defer = $.Deferred();
    var pageID = $.mobile.activePage.attr('id');
    //setTimeout(function() {
    $('div[id=' + pageID + "loadingPopup" + ']').popup();
    $('div[id=' + pageID + "loadingPopup" + ']').popup("close");
    defer.resolve();
    //}, 300);
    return defer.promise();
}


function showsynchronizing() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "synchronizingPopup").popup().popup("open");
    //    setTimeout(function () {
    //        if ($(".ui-page-active #DashBoardsynchronizingPopup-popup").hasClass('ui-popup-active')) {
    //            var set = 'sync';
    //            forcePopupClose(set);
    //        }
    //    }, parseInt(syncTime));
}

function closesynchronizing() {
    var pageID = $.mobile.activePage.attr('id');
    $('div[id=' + pageID + "synchronizingPopup" + ']').popup();
    $("#" + pageID + "synchronizingPopup").popup("close");
}


//------------Function createAtag and panelBinding are used to bind the Navigation Panel------------//
function createATag(text, custData) {
    var thisText = 'this';
    var id = text;
    var dynamicLi;
    var liTag = document.createElement("li");
    liTag.setAttribute("data-mini", true);
    //var dataLength = custData.length;
    var dataLength = 0;
    if (custData.length) {
        dataLength = custData.length;
    }
    if (dataLength > 18) {
        custData = custData.substring(0, 20) + "...";
    }
    if (text == "400015" || text == "400013" || text == "400014" || text == "400021") {
        dynamicLi = '<li data-mini="true" id=menu' + id + ' data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-mini ui-btn-icon-right ui-li-has-arrow ui-li navigation-links">' +
        '<div class="ui-btn-inner ui-li">' +
        '<div class="ui-btn-text">' +
        '<a onclick="NavigateToInspections(this)" style="font-size:smaller!important" class="ui-link-inherit" id="' + id + '">' + custData + '</a>' +
        '</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
        '</div></li>';
    }
    else if (text != undefined) {
        dynamicLi = '<li data-mini="true" id=menu' + id + ' data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" class="ui-btn ui-mini ui-btn-icon-right ui-li-has-arrow ui-li navigation-links">' +
        '<div class="ui-btn-inner ui-li">' +
        '<div class="ui-btn-text">' +
        '<a onclick="navigateTO(this);" style="font-size:smaller!important" class="ui-link-inherit" id="' + id + '">' + custData + '<span id=' + id + 'Count></span></a>' +
        '</div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>' +
        '</div> </li>';
    }
    else {
        return "";
    }
    return dynamicLi;
}

function panelBinding(pageID) {
    var panelDiv = document.createElement('div');
    panelDiv.setAttribute('id', pageID + 'navigationPanel');
    panelDiv.setAttribute('data-role', 'panel');
    panelDiv.setAttribute('data-position', 'left');
    panelDiv.setAttribute('data-display', 'push');
    ////SR: Pentesting & JQM update
    panelDiv.setAttribute('data-rel', 'popup');
    panelDiv.setAttribute('style', 'display: none');

    $("#" + pageID).append(panelDiv);

    var ulTag = document.createElement('ul');
    ulTag.setAttribute('data-role', 'listview');

    panelDiv.appendChild(ulTag);
}

function ActionPopupBinding(pageId) {
    if ($("#" + pageId + "actionLoadingPopup").length > 0) {
        $("#" + pageId + "actionLoadingPopup").remove();
    }
    var actionLoadingPopupDiv = document.createElement('div');
    actionLoadingPopupDiv.setAttribute('id', pageId + 'actionLoadingPopup');
    actionLoadingPopupDiv.setAttribute('data-role', 'popup');
    actionLoadingPopupDiv.setAttribute('data-dismissible', 'false');
    actionLoadingPopupDiv.setAttribute('data-overlay-theme', 'a');
    ////SR: Pentesting & JQM update
    actionLoadingPopupDiv.setAttribute('style', 'padding-left: 10px; padding-right: 10px;display:none');

    var h1ActionTag = document.createElement('h1');
    h1ActionTag.innerHTML = GetCommonTranslatedValue("ProcessingLabel");
    actionLoadingPopupDiv.appendChild(h1ActionTag);

    $("#" + pageId).find('[data-role=content]').append(actionLoadingPopupDiv);
}

function showActionPopupLoading() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID + "actionLoadingPopup").attr("style", "display:block")
    $("#" + pageID + "actionLoadingPopup").popup().popup("open");
}

function closeActionPopupLoading() {
    var defer = $.Deferred();
    var pageID = $.mobile.activePage.attr('id');
    //$("#" + pageID + "actionLoadingPopup").popup("close");
    setTimeout(function () {
        $('div[id=' + pageID + "actionLoadingPopup" + ']').popup();
        $("#" + pageID + "actionLoadingPopup").popup("close");
        defer.resolve();
    }, 600);

    return defer.promise();
}
////////////added the below code to over come freeze issue///////////////////////
function forcePopupClose(set, errorMsg) {
    var logValue = [];
    var pageID;
    if (set == "sync") {
        pageID = $.mobile.activePage.attr('id');
        $('div[id=' + pageID + "synchronizingPopup" + ']').popup();
        $("#" + pageID + "synchronizingPopup").popup("close");
        setTimeout(function () {
            ////showError("Network was lost during the sync, please try a manual sync.");
            showError(GetCommonTranslatedValue("NetworkLostCommon"));
        }, 500);
    }
    else if (set == "processing") {
        pageID = $.mobile.activePage.attr('id');
        $('div[id=' + pageID + "actionLoadingPopup" + ']').popup();
        $("#" + pageID + "actionLoadingPopup").popup("close");
        setTimeout(function () {
            showError(errorMsg);
        }, 500);
    }

    else if (set == "loading") {
        pageID = $.mobile.activePage.attr('id');
        $('div[id=' + pageID + "loadingPopup" + ']').popup();
        $("#" + pageID + "loadingPopup").popup("close");
        setTimeout(function () {
            showError(errorMsg);
        }, 500);
    }
    else {
        setTimeout(function () {
            showError(errorMsg);
        }, 500);
    }

}

function prepareTagScanPopup() {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(localStorage.getItem("Username"))
    });
    var accessURL = standardAddress + "Dashboard.ashx?methodname=AllMasterItems";
    getMenuItems(accessURL, myJSONobject);
}

function getMenuItems(accessURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(accessURL, myJSONobject, function (data) {
            createTagScanPopupButtons(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

// Create the popup buttons for the Dashboard.  This will be added to each form like the menu.
function createTagScanPopupButtons(result) {
    var pageId = $.mobile.activePage.attr('id');
    var tagscanBtn = "";

    var buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('data-role', 'content');
    buttonDiv.setAttribute('id', pageId + 'TagScanPopupButtons');

    for (i = 0; i < result.length; i++) {
        if ((result[i].HelpPath.indexOf("AssetDashboard.html") > 0) || (result[i].HelpPath.indexOf("CreateWOT.html") > 0)) {
            tagscanBtn = tagscanBtn + "<a id='TagScanBtn" + result[i].MasterId + " data-role='button' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperrels='span' data-theme='b' class='ui-btn ui-shadow ui-btn-corner-all ui-btn-up-b' href='javascript:NavigateToWorkOrderPage(" + result[i].MasterId + ")' ><span class='ui-btn-inner ui-btn-corner-all'><span class='ui-btn-text' style='white-space:normal;'>" + result[i].Description + "</span></span></a>";
        }

        buttonDiv.innerHTML = tagscanBtn;
    }
    $("#" + pageId + "TagScanPopup").find('div[data-role="content"]').append(buttonDiv);
}

function BindTagScanPopup(pageId) {
    $.mobile.defaultPageTransition = 'none';
    //var pageId = $.mobile.activePage.attr('id');
    if (pageId == "DashBoard") {
        LoadTranslation("Common", null);
    }

    if ($("#" + pageId + "TagScanPopup").length > 0) {
        $("#" + pageId + "TagScanPopup").remove();
    }

    var popup = $("#DashBoardTagScanPopupButtons").html();

    var divelement = document.createElement('div');
    divelement.setAttribute('data-role', 'popup');
    divelement.setAttribute('data-dismissible', 'false');
    divelement.setAttribute('data-overlay-theme', 'a');
    divelement.setAttribute('style', 'width: 285px');

    ////SR: Pentesting & JQM update
    divelement.setAttribute('data-rel', 'popup');
    divelement.setAttribute('style', 'display: none');

    divelement.setAttribute('data-transition', 'pop');
    divelement.setAttribute('id', pageId + 'TagScanPopup');
    //style='float:right;position:absolute;top:-10px;right:-10px;background-position:-70px 50%'
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    contentDiv.innerHTML = "<a href='#' data-role='button' data-theme='a'  id='TagScanPopupTopCloseButton' data-icon='delete' data-iconpos='notext'" +
        " data-rel='back' style='float:right;position:absolute;top:-15px;right:-10px;' ></a>" +
        "<h4 style='text-align:center' id='" + pageId + "TagScanPopupSpan'><p style='-webkit-margin-before:0px;'>" + GetCommonTranslatedValue("AssetIdentified") +
        "</p><p id='" + pageId + "TagScanImageP' style='height:110px;' ></p><p>" + GetCommonTranslatedValue("TagNumberLabel") + "<span id='" + pageId + "TagScanPopupTagNumber'></span><br />" + GetCommonTranslatedValue("InstallDescrLabel") +
        "<span id='" + pageId + "TagScanPopupInstallDescr'></span><br />" + GetCommonTranslatedValue("PartDescrLabel") +
        "<span id='" + pageId + "TagScanPopupPartDescr'></span><br /><span id='" + pageId + "TagScanPopupLocation'></span></p><p>" + GetCommonTranslatedValue("WhatAction") + "</p></h4>";


    divelement.appendChild(contentDiv);

    $("#" + pageId).find('[data-role=content]').append(divelement);

    if (popup) {
        $("#" + pageId + "TagScanPopup").find("div").append(popup);
    }

    // Temporary fix for security check on the header bar.  This will be moved to a new function later.
    var SgtCollection = $.GetSecuritySubTokens(400039, 0);
    if (SgtCollection && SgtCollection.CanAccess != 1) {
        $("#" + pageId).find("#shortcut400039").hide();
    } else {
        $("#" + pageId).find("#shortcut400039").show();
    }

    if ($("#" + pageId + "ConfirmationPopup").length === 0) {
        BindConfirmationPopup(pageId);
    }
}

/**
* Create a popup to update the tech status.
* @param [string] pageId - The name of the entity that the popup will be bound to.
*/
function BindTechStatusPopup(pageId) {
    if ($("#" + pageId + "TechStatusPopup").length > 0) {
        $("#" + pageId + "TechStatusPopup").remove();
    }

    var popupdiv = document.createElement('div');
    popupdiv.setAttribute('id', pageId + 'TechStatusPopup');
    popupdiv.setAttribute('data-role', 'popup');
    popupdiv.setAttribute('data-dismissible', 'false');
    popupdiv.setAttribute('class', 'techstatus-popup');
    ////SR: Pentesting & JQM update
    popupdiv.setAttribute('style', 'width:285px;display:none');
    popupdiv.setAttribute('data-transition', 'pop');

    var headerDiv = document.createElement('div');
    headerDiv.setAttribute('data-role', 'header');
    headerDiv.setAttribute('class', 'popup-header');
    headerDiv.innerHTML = '<h1 class="ui-title" style="margin: 0.6em 10% 0.8em">' +
    '<span>' + GetCommonTranslatedValue('TechStatusHeader') + '</span></h1>';
    popupdiv.appendChild(headerDiv);

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('data-role', 'content');
    contentDiv.innerHTML = '<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" onclick="javascript:closeTechStatusPopup();"' +
    'style="float:right;position:absolute;top:-15px;right:-10px;" data-iconpos="notext" id="TechStatusTopClose"></a>' +
    '<select id="' + pageId + 'availableSlider" class="fullscreen-slider" data-reason="' + pageId + 'techStatus" style="width:100%" data-role="slider" onchange="showTechStatusReason(this);">' +
    '<option value="available">' + GetCommonTranslatedValue('Available') + '</option>' +
    '<option value="unavailable">' + GetCommonTranslatedValue('Unavailable') + '</option></select>' +
    '<div id="' + pageId + 'techStatusPane"><select id="' + pageId + 'techStatus"></select></div>' +
    '<a href="#" id="' + pageId + 'TechStatusUpdateBtn" data-role="button" onclick="saveTechStatus(\'' +
    pageId + 'techStatus\');" data-theme="b">' + GetCommonTranslatedValue('UpdateButton') + '</a></div>';

    popupdiv.appendChild(contentDiv);
    $('#' + pageId).find('[data-role=content].content-container').append(popupdiv);
}

/**
* Open a popup to update the tech status.
* @param [object] The list of statuses for the dropdown. 
*/
function showTechStatusPopup(statuses) {
    if (statuses === "empty") {
        showError(GetCommonTranslatedValue("NetworkLostCommon"));
        return;
    }

    var pageID = $.mobile.activePage.attr('id');
    var statusString = '';

    // Populate the status dropdown.
    $.each(statuses, function () {
        // Phase 1: Assume available = seq 1, everything else unavailable
        var availability = this.Seq == 1 ? "available" : "unavailable";
        statusString += '<option value="' + this.Seq + '" data-type="' + availability + '">' + this.Description + '</option>';
    });
    Availability.TechStatusOptions = $.parseHTML(statusString);
    $("#techStatus").html(statusString);
    // Update the popup to default to the current status.
    $("#techStatus").val(getLocal("TechnicianStatus"));
    //$("#" + pageID + "techStatus").parent().hide();
    //$("#" + pageID + "techStatus").selectmenu("refresh");
    $("#availableSlider").val($("#techStatus option:selected").attr('data-type')).slider("refresh").trigger("change");
    $("#techStatus").attr('disabled', 'disabled');
    $("#techStatus").selectmenu("refresh");
}

/**
* Close the popup for tech status.
* @param [function] callback - The callback method if there is one.
*/
function closeTechStatusPopup(callback) {
    var pageID = $.mobile.activePage.attr('id');
    document.activeElement.blur();
    $("#" + pageID + "techStatus").blur();
    navigateToPreviousPage();

    if (callback != null) {
        setTimeout(function () {
            callback();
        }, 650);
    }
}

/**
* Bind a dropdown with the provided information.
* @param {Object} entity - The entity which we are binding.
* @param {Object} contents - The contents which we are binding.
*/
function BindDropdown(entity, contents) {
    var option = document.createElement('option');

    if (typeof contents === "string") {
        option.setAttribute('value', contents);
        option.innerHTML = contents;
    } else {
        option.setAttribute('value', contents[0]);
        option.innerHTML = contents[1];
    }
    $(entity).append(option);
}

/**
* Bind all of the popups that are being added to a form.  This should be
* executed on the PageCreate event.
* @param [string] pageID - The ID of the page div that we're adding to.
*/
function BindFormPopups(pageID) {
    // These popups are on every form.
    BinderrorPopup(pageID);
    panelBinding(pageID);
    BindAutoSyncPopup(pageID);
    BindTagScanPopup(pageID);
    BindSettingsPopup(pageID);

    BinderrorPopup("WOStepPage");
    popupBinding("WOStepPage");
    panelBinding("WOStepPage");
    BindAutoSyncPopup("WOStepPage");
    BindTagScanPopup("WOStepPage");
    // This is for form specific popups and panels that need to be added.
    switch (pageID.toLowerCase()) {
        case "assetsearch":
        case "assetslist":
        case "attachmentpage":
        case "dailysearchorder":
        case "demandorderspage":
        case "employeestatuspage":
        case "exception":
        case "inspectionadhoc":
        case "inspectionareas":
        case "inspectionassets":
        case "inspectioncapitallog":
        case "categorypage":
        case "editinspectionitemspage":
        case "inspectionitemspage":
        case "intdisporderpage":
        case "labordetailspage":
        case "logpage":
        case "materialpo":
        case "pastdueorderpage":
        case "pmorderspage":
        case "searchorder":
        case "technicianavailabilityview":
        case "vendordetails":
        case "vendorsearchpage":
        case "vendorsearchresults":
        case "workorderview":
        case "wosteppage":
            popupBinding(pageID);
            break;
        case "inspectionaddasset":
        case "inspectionaddworkorder":
        case "inspectioneditasset":
        case "timecard":
            ActionPopupBinding(pageID);
            break;
        case "dashboard":
            synchronizBinding(pageID);
            popupBinding(pageID);

            break;
        case "approvaldashboardpage":
        case "approvaldetailspage":
        case "approvallogpage":
        case "assetdashboard":
        case "createwoc":
        case "createwod":
        case "createwoo":
        case "createwot":
        case "inspectioncapital":
        case "inspectionattachmentpage":
        case "pmjobviewpage":
            ActionPopupBinding(pageID);
            popupBinding(pageID);
            break;
        case "openinspection":
            BindConfirmationPopup(pageID);
            popupBinding(pageID);
            break;
        case "timecardentry":
        case "timecardna":
        case "timecardwo":
            BindConfirmationPopup(pageID);
            ActionPopupBinding(pageID);
        case "changepassword":
        case "newinspectionitemspage":
        case "timecardsummary":
        case "siteprofile":
            ActionPopupBinding(pageID);
            BindConfirmationPopup(pageID);
            popupBinding(pageID);
            break;
        case "wodetailspage":
            ActionPopupBinding(pageID);
            popupBinding(pageID);
            BindFullTextPopup(pageID);
            break;
        case "inspstatuspage":
        case "inspectionvendor":
        case "inspectionviewcapital":
        case "viewinspectionworkorders":
        case "technicianavailabledetails":
        default:
            break;
    }
}
