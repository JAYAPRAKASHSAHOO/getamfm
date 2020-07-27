// These are connection variables for use with login validation.
var standardAddress = getLocal("URL_STANDARDADDRESS_STRING"); //$.constants.STANDARDADDRESS_STRING;
var DatabaseConnection = "";
var getActiveLanguagesResponse = null;
var supportedLanguagesTemp = null;

var cannotBeEmptyTranslation = " cannot be empty.";
var noNetworkTranslation = "No network connection. Please try again when network is available.";
var invalidDatabaseTranslation = "Invalid Customer ID.";
var customerIDTranslation = "Customer ID";
var userNameTranslation = "User Name";
var passwordTranslation = "Password";
var languageTranslation = "Language";
var langOptionTranslation = "-Language-";

var loginPageID = "Login";
var ref = "";

function setVersionAndModule() {
    cordova.getAppVersion.getVersionNumber(function (version) { setLocal("Version", version); });
    cordova.getAppVersion.getPackageName(function (package) { setLocal("Module", package); });
}

/// <summary>
/// Method to logon.
/// </summary>
function LogOnButtonClick() {
    if (navigator.onLine) {
        var page = $("#" + loginPageID);

        var userName = page.find('#UserNameTextBox').val();
        ////var password = page.find('#PasswordTextBox').val();
        var password = page.find('#EncryptedPassWordValue').val();
        var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID"); //page.find("#DataBaseName").val();
        //DatabaseConnection = "";
        var pattern = /[-!$%^#&*()_+|~=`{}\[\]:";'<>?,.\/]/;
        var isUserNameSpecialChar = pattern.test(userName);
        var isPasswordSpecialChar = pattern.test(password);

        var errorMessage = "";
        var validationSuccess = true;

        if (IsStringNullOrEmpty(Databasename)) {
            errorMessage += customerIDTranslation;
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(getLocal("Language"))) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }

            errorMessage += languageTranslation;
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(page.find("#UserNameTextBox").val())) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }

            errorMessage += userNameTranslation;
            validationSuccess = false;
        }

        if (IsStringNullOrEmpty(page.find("#PasswordTextBox").val())) {
            if (!IsStringNullOrEmpty(errorMessage)) {
                errorMessage += ", ";
            }

            errorMessage += passwordTranslation;
            validationSuccess = false;
        }

        if (validationSuccess) {
            try {
                cordova.getAppVersion.getVersionNumber(function (version) { setLocal("Version", version); });
                cordova.getAppVersion.getPackageName(function (package) {
                    setLocal("Module", package);
                    if (package.indexOf("amfm") > 0) {
                        $("#AppStoreLink").hide();
                        $("#GooglePlayLink").show();
                    } else {
                        $("#AppStoreLink").show();
                        $("#GooglePlayLink").hide();
                    }
                });
            } catch (ex) {
                setLocal("Module", '');
                setLocal("Version", '');
            }

            setLocal("UserName", userName);
            standardAddress = getLocal("URL_STANDARDADDRESS_STRING"); //$.constants.STANDARDADDRESS_STRING;
            standardAddress += $.constants.DB_STRING + Databasename + 'iMFM/';
            $.mobile.loading("show", {
                textVisible: false,
                theme: 'd'
            });
            getMyLocation();
            var lat = page.find('#LatitudeHiddenFieldValue').val();
            var long = page.find('#LongitudeHiddenFieldValue').val();

            DatabaseConnection = Databasename.charAt(0).toUpperCase(); //            

            // new method to get path.
            getKeys();
        }
        else {
            showError(errorMessage.trim() + ' ' + cannotBeEmptyTranslation);
        }
    }
    else {
        showError(noNetworkTranslation);
    }
}

/// <summary>
/// Method to get public key for encryption.
/// </summary>
function getKeys() {
    var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
    standardAddress = getLocal("URL_STANDARDADDRESS_STRING") ? getLocal("URL_STANDARDADDRESS_STRING") + $.constants.DB_STRING + Databasename + 'iMFM/' : "" + $.constants.DB_STRING + Databasename + 'iMFM/';
    if (navigator.onLine) {
        var accessURL = standardAddress + "LoginAuthentication.ashx?methodname=GetKeys"
        //        if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        //            accessURL = $.constants.SETTINGS_STRING + $.constants.localhost_DB_STRING + $.constants.localhost_DB_STRING_000 + "iMFM/LoginAuthentication.ashx?methodname=GetKeys";
        //        }

        var myJSONobject = {
            "DatabaseID": Databasename
        };
        $.postJSON(accessURL, myJSONobject, function (data) {

            var page = $("#" + loginPageID);
            var userName = page.find('#UserNameTextBox').val();

            var password = page.find('#PasswordTextBox').val();
            var loginURL = '';
            var myJSONobject = '';


            ////---- commented the code to remove RSA encryption as it is licensed version.------
            //            setLocal('PublicKey', data);
            //            var encryptedPassword = RsaEncrypt(data, password);

            Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
            DatabaseConnection = Databasename.charAt(0).toUpperCase();

            if (getLocal("SSOUser") === "true") {
                if (getLocal("Version") == null) {
                    setVersionAndModule();
                }
                setTimeout(function () {
                    //                    myJSONobject = {
                    //                        "Username": decryptStr(getLocal("SSOToken")),
                    //                        "Latitude": GlobalLat,
                    //                        "Longitude": GlobalLong,
                    //                        "DatabaseID": Databasename,
                    //                        "Language": getLocal("Language"),
                    //                        "Module": getLocal("Module"),
                    //                        "Version": getLocal("Version"),
                    //                        "RegistrationID": getLocal("RegistrationID")
                    //                    };
                    //                    if (ref && ref != undefined) {
                    //                        ref.close()
                    //                    }
                    //                    // To Authenticate SSO UserDB_STRING
                    //                    loginURL = standardAddress + "LoginAuthentication.ashx?methodname=AuthenticateSSOUser";

                    /*******************new method for novartis**********************/
                    myJSONobject = {
                        "Username": getLocal("SSOToken"),
                        "Latitude": GlobalLat,
                        "Longitude": GlobalLong,
                        "DatabaseID": Databasename,
                        "Language": getLocal("Language"),
                        "Module": getLocal("Module"),
                        "Version": getLocal("Version"),
                        "RegistrationID": getLocal("RegistrationID")
                    };
                    if (ref && ref != undefined) {
                        ref.close()
                    }
                    // To Authenticate SSO UserDB_STRING
                    loginURL = standardAddress + "LoginAuthentication.ashx?methodname=AuthenticateSSOUserNew";

                    login(loginURL, myJSONobject, DatabaseConnection);
                }, 100);
            } else {
                //-----------------------this method is commented for novartis pen testing -------------------------
                //                loginURL = standardAddress + "LoginAuthentication.ashx?methodname=Authenticate";
                //                myJSONobject = {
                //                    "Username": userName,
                //                    "Password": encryptedPassword,
                //                    "Latitude": GlobalLat,
                //                    "Longitude": GlobalLong,
                //                    "DatabaseID": Databasename,
                //                    "Language": getLocal("Language"),
                //                    "Module": getLocal("Module"),
                //                    "Version": getLocal("Version"),
                //                    "RegistrationID": getLocal("RegistrationID")
                //                };

                loginURL = standardAddress + "LoginAuthentication.ashx?methodname=AuthenticateNew";
                myJSONobject = {
                    "Username": userName,
                    "Password": password,
                    "Latitude": GlobalLat,
                    "Longitude": GlobalLong,
                    "DatabaseID": Databasename,
                    "Language": getLocal("Language"),
                    "Module": getLocal("Module"),
                    "Version": getLocal("Version"),
                    "RegistrationID": getLocal("RegistrationID")
                };

                login(loginURL, myJSONobject, DatabaseConnection);
            }


        });

    }
    else {
        showError(noNetworkTranslation);
    }
}

/// <summary>
/// Method to encrypt the data.
/// </summary>
function RsaEncrypt(xmlParams, text) {
    var rsa = new System.Security.Cryptography.RSACryptoServiceProvider();
    rsa.FromXmlString(xmlParams);

    // Encrypt
    var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(text);
    var doOaepPadding = true;
    var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
    var encryptedString = System.Convert.ToBase64String(encryptedBytes);
    return encryptedString;
}


/// <summary>
/// Method to get location.
/// </summary>
function getMyLocation() {
    try {
        function handler(location) {
            messageLatitude = location.coords.latitude;
            messageLongitude = location.coords.longitude;
            var page = $("#" + loginPageID);
            page.find('#LatitudeHiddenFieldValue').val(messageLatitude.toFixed(6));
            page.find('#LongitudeHiddenFieldValue').val(messageLongitude.toFixed(6));
            GlobalLat = messageLatitude.toFixed(6);
            GlobalLong = messageLongitude.toFixed(6);
        }
        navigator.geolocation.getCurrentPosition(handler);
    }
    catch (err) {
    }
}

/// <summary>
/// Method to change login database name.
/// </summary>
function getLangauges(databaseNameValue) {
    if (getActiveLanguagesResponse !== null && getActiveLanguagesResponse !== undefined) {
        getActiveLanguagesResponse.abort();
    }

    var page = $("#" + $.mobile.activePage.attr('id'));

    page.find("#SettingsPopUpWaitLabel").show();
    page.find("#SSOEnabledMessage").hide();

    var databaseName = page.find('#DataBaseName');
    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");
    settingsPopUpMessageLabel.hide();

    supportedLanguagesDropDown.empty();
    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);

    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);
    supportedLanguagesDropDown.selectmenu("disable", true).selectmenu("refresh");
    if (databaseName.val().length == 3 && navigator.onLine) {

        var myJSONobject = {
            "Databasename": databaseName.val(),
            "DatabaseID": databaseName.val(),
            "Language": getLocal("Language")
        };

        // Old accessURL
        //var accessURL = $.constants.STANDARDADDRESS_STRING + $.constants.DB_STRING + databaseName.val() + "iMFM/LoginAuthentication.ashx?methodname=GetActiveLanguages";

        var accessURL = getLocal("URL_STANDARDADDRESS_STRING") + $.constants.DB_STRING + databaseName.val() + "iMFM/LoginAuthentication.ashx?methodname=GetActiveLanguages";

        if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            $.constants.DB_STRING = $.constants.localhost_DB_STRING;
            setLocal("PlainDatabaseID", encryptStr($.constants.localhost_DB_STRING_000));
            setLocal("DatabaseID", encryptStr($.constants.localhost_DB_STRING_000));

            $.constants.STANDARDADDRESS_STRING = $.constants.localhost_DB_STRING;
            //databaseName = $.constants.localhost_DB_STRING_000;

            //accessURL = $.constants.SETTINGS_STRING + "TST00000iMFM/" + "LoginAuthentication.ashx?methodname=GetDatabaseServer";
            //accessURL = $.constants.SETTINGS_STRING + $.constants.localhost_DB_STRING + $.constants.localhost_DB_STRING_000 + "iMFM/LoginAuthentication.ashx?methodname=GetActiveLanguages";

            accessURL = getLocal("URL_STANDARDADDRESS_STRING") + $.constants.DB_STRING + databaseName.val() + "iMFM/LoginAuthentication.ashx?methodname=GetActiveLanguages";
        }

        getActiveLanguagesResponse = $.postJSON(accessURL, myJSONobject, function (data) {
            supportedLanguagesTemp = JSON.stringify(data);

            for (var arrayCount = 0; arrayCount < data.length - 1; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", data[arrayCount].LangAbbrv);
                option.innerHTML = data[arrayCount].LangAlias;
                supportedLanguagesDropDown.append(option);
            }

            //            valueImp = CryptoJS.AES.encrypt(data[2].Key, 'a1b2c3');
            //            valueABC = CryptoJS.AES.decrypt(valueImp, 'a1b2c3');

            //setLocal("magpiejay", valueABC);

            // Indicates whether the client is SSO enabled or not.
            if (data[data.length - 1].CompnayDefaults) {
                var companyDefaultItems = JSON.parse(data[data.length - 1].CompnayDefaults);

                setLocal("iMFM_NoOfDaysToExpireSSO", companyDefaultItems.iMFM_NoOfDaysToExpireSSO);
                setLocal("dayDifference", companyDefaultItems.iMFM_NoOfDaysToExpireSSO);
                setLocal("iMFM_SSOAuthURL", companyDefaultItems.iMFM_SSOAuthURL);
                setLocal("ShowLogutOption", false);
                setLocal("SSOUser", false);
                setLocal("SafetyNetTimeOutInterval", companyDefaultItems.SafetyNetTimeOutInterval);
                setLocal("SafetyNetRetryInterval", companyDefaultItems.SafetyNetRetryInterval);
                setLocal("EnableSafetyNet", companyDefaultItems.EnableSafetyNet);

                // Ravi - Adding 3 new company defaults - Backward compatible. SIC-91, SIC-2631
                if (companyDefaultItems.iMFM_AttachmentsOnFieldPO != undefined) {
                    setLocal("iMFM_AttachmentsOnFieldPO", companyDefaultItems.iMFM_AttachmentsOnFieldPO);
                } else {
                    setLocal("iMFM_AttachmentsOnFieldPO", 0);
                }

                if (companyDefaultItems.Approval_ShowApprovalReason != undefined && companyDefaultItems.Approval_ShowRejectionReason != undefined) {
                    setLocal("Approval_ShowApprovalReason", companyDefaultItems.Approval_ShowApprovalReason);
                    setLocal("Approval_ShowRejectionReason", companyDefaultItems.Approval_ShowRejectionReason);
                } else {
                    setLocal("Approval_ShowApprovalReason", 0);
                    setLocal("Approval_ShowRejectionReason", 1);
                }

                // Keeping folloing condition for future use.
                if (companyDefaultItems.iMFM_SSO_Logout_Visible != undefined) {
                    if (companyDefaultItems.iMFM_SSO_Logout_Visible.toLowerCase() == 'true') {
                        setLocal("ShowLogutOption", true);
                    }
                }
                if (!IsStringNullOrEmpty(companyDefaultItems.iMFM_IsSSOEnabled)) {
                    if (companyDefaultItems.iMFM_IsSSOEnabled.toLowerCase() == 'true') {
                        setLocal("SSOUser", true);
                    } else {
                        setLocal("SSOUser", false);
                    }
                }

                if (companyDefaultItems.XmltoDBFeatureLists) {
                    setLocal("xmltodbSupported", JSON.stringify(companyDefaultItems.XmltoDBFeatureLists));
                }
                else {
                    setLocal("xmltodbSupported", null);
                }

            } else {
                setLocal("SSOUser", false);
            }

            //setLocal("SSOUser", false);
            // setting a database name on entering dbid in language setting popup.
            supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
            page.find("#SettingsPopUpWaitLabel").hide();
            if (getLocal("SSOUser") == "true") {
                page.find("#SSOEnabledMessage").show();
                page.find("#SSOEnabledMessage").text("Your company has enabled single sign-on. We're redirecting you to company authentication service.");
            }
        }, function () {
            // Error function
            supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
            page.find("#SettingsPopUpWaitLabel").hide();
            settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
        });
    }
    else {
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
    }

    //supportedLanguagesDropDown.selectmenu("refresh", true);
}

/// <summary>
/// Method to change login database name, and updating dynamic URL's
/// </summary>
function LoginSettings_DatabaseNameChanged() {
    if (getActiveLanguagesResponse !== null && getActiveLanguagesResponse !== undefined) {
        getActiveLanguagesResponse.abort();
    }

    var page = $("#" + loginPageID);

    page.find("#SettingsPopUpWaitLabel").show();

    var databaseName = page.find('#DataBaseName');
    var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

    var settingsPopUpMessageLabel = page.find("#SettingsPopUpMessageLabel");
    settingsPopUpMessageLabel.hide();

    supportedLanguagesDropDown.empty();
    var selectOption = document.createElement("option");
    selectOption.setAttribute("value", "-1");
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);

    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);
    supportedLanguagesDropDown.selectmenu("disable", true).selectmenu("refresh");
    if (databaseName.val().length == 3 && navigator.onLine) {

        var accessURL = $.constants.SETTINGS_STRING + $.constants.DB_STRING + "000iMFM/LoginAuthentication.ashx?methodname=GetDatabaseServer";
        // Todo modification required to run in local machine
        if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            $.constants.DB_STRING = $.constants.localhost_DB_STRING;
            accessURL = $.constants.SETTINGS_STRING + $.constants.DB_STRING + databaseName.val() + "iMFM/LoginAuthentication.ashx?methodname=GetDatabaseServer";
        }
        var myJSONobject = {
            "Databasename": databaseName.val(),
            "DatabaseID": databaseName.val(),
            "Language": getLocal("Language")
        };

        $.postJSON(accessURL, myJSONobject, function (data) {
            if (!data || data.length === 0) {
                supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
                page.find("#SettingsPopUpWaitLabel").hide();
                settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
            }
            else if (data == "EMPTY_URL") {
                setLocal("URL_STANDARDADDRESS_STRING", $.constants.SETTINGS_STRING);
                getLangauges(databaseName.val());
            }
            else {
                var updated_Url = data ? data : $.constants.SETTINGS_STRING;
                setLocal("URL_STANDARDADDRESS_STRING", updated_Url);
                getLangauges(databaseName.val());
            }
        }, function () {
            // Error function
            supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
            page.find("#SettingsPopUpWaitLabel").hide();
            settingsPopUpMessageLabel.text(invalidDatabaseTranslation).show();
        });
    }
    else {
        supportedLanguagesDropDown.selectmenu("enable", true).selectmenu("refresh");
        page.find("#SettingsPopUpWaitLabel").hide();
    }

    //supportedLanguagesDropDown.selectmenu("refresh", true);
}

/// <summary>
/// Method to login data.
/// </summary>
function LoginSettings_SaveButtonClick() {
    var page = $("#" + $.mobile.activePage.attr('id'));
    page.find("#DataBaseName").blur();
    page.find("#SupportedLanguagesDropDown").blur();
    setLocal("XmlLastSyncDate", null);
    getMyLocation();

    if (navigator.onLine) {
        var databaseName = page.find('#DataBaseName');
        var supportedLanguagesDropDown = page.find("#SupportedLanguagesDropDown");

        if (!IsObjectNullOrUndefined(databaseName) && !IsObjectNullOrUndefined(supportedLanguagesDropDown)) {
            var errorMessage = "";
            var validationSuccess = true;

            if (IsStringNullOrEmpty(databaseName.val())) {
                if (IsObjectNullOrUndefined(customerIDTranslation)) {
                    customerIDTranslation = "Customer ID";
                }
                errorMessage += customerIDTranslation;
                validationSuccess = false;
            }

            if (IsStringNullOrEmpty(supportedLanguagesDropDown.val()) || supportedLanguagesDropDown.val() == "-1") {
                if (!IsStringNullOrEmpty(errorMessage)) {
                    errorMessage += ", ";
                }
                if (IsObjectNullOrUndefined(languageTranslation)) {
                    languageTranslation = "Language";
                }

                errorMessage += languageTranslation;
                validationSuccess = false;
            }

            if (validationSuccess) {
                page.find("#SSOEnabledMessage").hide();
                page.find("#SettingsPopUpWaitLabel").show();
                page.find("#DataBaseNameValueLabel").text(databaseName.val());
                setLocal("PlainDatabaseID", databaseName.val());
                setLocal("SupportedLanguages", supportedLanguagesTemp);
                setLocal("Language", $("#SupportedLanguagesDropDown").val());
                setLocal("LanguageName", $("#SupportedLanguagesDropDown").children(":selected").text());
                if (!IsStringNullOrEmpty(getLocal("PreviousDatabase"))) {
                    if (decryptStr(getLocal("PreviousDatabase")) != decryptStr(getLocal("PlainDatabaseID"))) {
                        setLocal("SSOToken", '');
                        setLocal("PreviousDatabase", getLocal("PlainDatabaseID"));
                    }
                } else {
                    setLocal("PreviousDatabase", getLocal("PlainDatabaseID"));
                }

                SyncTranslation(loginPageID, LoginSettings_SyncTranslationComplete);
            }
            else {
                if (IsObjectNullOrUndefined(cannotBeEmptyTranslation)) {
                    cannotBeEmptyTranslation = "cannot be empty.";
                }

                page.find("#SettingsPopUpMessageLabel").text(errorMessage + " " + cannotBeEmptyTranslation).show();
            }
        }
    }
    else {
        page.find("#SettingsPopUpMessageLabel").text(noNetworkTranslation).show();
    }
}

/// <summary>
/// Method to cancle login settings.
/// </summary>
function LoginSettings_CancelButtonClick() {
    var page = $("#" + $.mobile.activePage.attr('id'));
    page.find("#SupportedLanguagesDropDown").blur();
    page.find("#" + $.mobile.activePage.attr('id') + "SettingsPopUp").popup("close");
}

/// <summary>
/// Method to login settings popup.
/// </summary>
function LoginSettings_OpenPopUp() {
    var page = $("#" + $.mobile.activePage.attr('id'));
    var databaseName = page.find("#DataBaseName");
    var databaseID = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");

    page.find("#SettingsPopUpMessageLabel").hide();
    page.find("#SettingsPopUpWaitLabel").hide();
    page.find("#SSOEnabledMessage").hide();

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
    if (IsObjectNullOrUndefined(langOptionTranslation)) {
        langOptionTranslation = "-Language-";
    }
    selectOption.innerHTML = langOptionTranslation;
    supportedLanguagesDropDown.append(selectOption);
    supportedLanguagesDropDown.children("option:eq(0)").attr("selected", true);

    if (!IsStringNullOrEmpty(supportedLanguagesTemp)) {
        data = JSON.parse(supportedLanguagesTemp);

        if (!IsObjectNullOrUndefined(supportedLanguagesDropDown) && !IsObjectNullOrUndefined(data)) {
            for (var arrayCount = 0; arrayCount < data.length - 1; arrayCount++) {
                var option = document.createElement("option");
                option.setAttribute("value", data[arrayCount].LangAbbrv);
                option.innerHTML = data[arrayCount].LangAlias;
                supportedLanguagesDropDown.append(option);
            }
        }
    }

    supportedLanguagesDropDown.val(getLocal("Language") ? getLocal("Language") : -1);
    supportedLanguagesDropDown.selectmenu("refresh", true);
    if ($.mobile.activePage.attr('id').toLowerCase() == "login") {
        page.find("#LoginSettingsPopUp").popup("open");
    } else {
        $("#" + $.mobile.activePage.attr('id') + "SettingsPopup").popup("open");
    }
}

/// <summary>
/// Method to sync translations.
/// </summary>
function LoginSettings_SyncTranslationComplete() {
    var pageId = $.mobile.activePage.attr('id');
    var page = $("#" + $.mobile.activePage.attr('id'));
    if (pageId.toLowerCase() === "login") {
        LoadScreenTranslation();
    } else {
        page.find("#" + $.mobile.activePage.attr('id') + "SettingsPopUp").popup("close");
        $.mobile.changePage("index.html");
    }

    page.find("#" + $.mobile.activePage.attr('id') + "SettingsPopUp").popup("close");
}

/// <summary>
/// Method to load screen translation.
/// </summary>
function LoadScreenTranslation() {
    setTimeout(function () {
        LoadTranslation(loginPageID, LoginSettings_LoadTranslationComplete);
    }, 1000);
}

/// <summary>
/// Method to load translation completely.
/// </summary>
function LoginSettings_LoadTranslationComplete() {
    cannotBeEmptyTranslation = GetTranslatedValue("CannotBeEmpty");
    noNetworkTranslation = GetTranslatedValue("NoNetwork");
    invalidDatabaseTranslation = GetTranslatedValue("InvalidDatabase");
    customerIDTranslation = GetTranslatedValue("DataBaseName");
    userNameTranslation = GetTranslatedValue("UserName");
    passwordTranslation = GetTranslatedValue("Password");
    languageTranslation = GetTranslatedValue("Language");
    langOptionTranslation = GetTranslatedValue("SelectLanguage");
    var submitTranslation = GetTranslatedValue("SubmitButton");
    var cancelTranslation = GetTranslatedValue("CancelButton");
    var ForgotPasswordText = GetTranslatedValue("ForgotPassword");
    var NeedHelpLabelTranslation = GetTranslatedValue("NeedHelpMessage") ? GetTranslatedValue("NeedHelpMessage") : "If you require technical assistance with this site please contact the CBRE Help Desk.";

    var page = $("#" + loginPageID);
    var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID"); //page.find("#DataBaseName").val();

    page.find("#UserNameTextBox").prop("placeholder", userNameTranslation);
    page.find("#PasswordTextBox").prop("placeholder", passwordTranslation);
    page.find("#DataBaseName").prop("placeholder", customerIDTranslation);
    page.find("#SecuritySubmitButton .ui-btn-text").text(submitTranslation);
    page.find("#SecurityCancelButton .ui-btn-text").text(cancelTranslation);
    page.find("#NeedHelpLabel").text(NeedHelpLabelTranslation);

    if (!IsStringNullOrEmpty(Databasename)) {
        page.find("#DataBaseNameValueLabel").text(Databasename);
    }
    else {
        page.find("#DataBaseNameValueLabel").text(notSetTranslation);
    }

    if (!IsStringNullOrEmpty(getLocal("LanguageName"))) {
        page.find("#LanguageNameValueLabel").text(getLocal("LanguageName"));
    }
    else {
        page.find("#LanguageNameValueLabel").text(notSetTranslation);
    }
    if (ForgotPasswordText) {
        page.find("#ForgotPasswordLink").text(ForgotPasswordText);
    }

    if (getLocal("SSOUser") == "true") {
        //If SSO redirect it to Client URL to authenticate.
        if (!IsStringNullOrEmpty(getLocal("SSOToken"))) {
            // if (getLocal("PreviousDatabase") != getLocal("PlainDatabaseID")) {
            //     getSSOToken(getKeys);
            //     setLocal("PreviousDatabase", getLocal("PlainDatabaseID"));
            // } else {
            var diffDays = getSSODateDiff();
            if (diffDays >= parseInt(getLocal("dayDifference")) && !IsStringNullOrEmpty(decryptResponse(getLocal("SSOToken")))) {
                //alert("Login script getSSOToken");
                getSSOToken(getKeys);
            } else {
                getKeys();
            }
            //}
        } else {
            getSSOToken(getKeys);
            setLocal("PreviousDatabase", getLocal("PlainDatabaseID"));
        }
    } else {
        if ($.mobile.activePage.attr('id') != "Login") {
            $.mobile.changePage("index.html");
        }
    }

    //Sync the translations for CommonString all over the application.
    // This is done prior to binding error pages.  Doing it here causes fields to load as "undefined".
    //LoadTranslation("Common", null);

}

//function CommonTranslationsSync_Complete() {
//}

/// <summary>
/// Method to change supported language.
/// </summary>
function LoginSettings_SupportedLanguagesChanged() {
    $("#" + loginPageID).find("#SettingsPopUpMessageLabel").hide();
}

/// <summary>
/// Method to load current location for Log usage.
/// </summary>
function GetMyCurrentLocation() {
    try {
        function handler(location) {
            messageLatitude = location.coords.latitude;
            messageLongitude = location.coords.longitude;
            GlobalLat = messageLatitude.toFixed(6);
            GlobalLong = messageLongitude.toFixed(6);
        }
        navigator.geolocation.getCurrentPosition(handler);
    }
    catch (error) {
        showError(error.message);
    }
}

/**
* This will retrieve security questions for the user provided and begin the password retrieval process.
*/
function forgotPassword(userNameEntity) {
    var popup = new SecurityQuestionWindow($('#SecurityQuestionPopUp'));
    //    if (IsStringNullOrEmpty(getLocal('PublicKey'))) {
    //        getRSAKeys();
    //    }
    var validationMessage = validatePasswordRetrieval();
    if (IsStringNullOrEmpty(validationMessage)) {
        // Everything exists that needs to exist, so begin the process.

        popup.fetchQuestion(userNameEntity)
        .done(function (question) {
            popup.populateQuestion(question);
            popup.openWindow();
        })
        .fail(function (error) {
            if (typeof error === "object") {
                error.Exception = error.Exception ? error.Exception : error.Data;
                showError(error.Exception);
            }
        });
    } else {
        showError(validationMessage);
    }
}

/**
* Validate the required parameters that need to exist in order to attempt to retrieve
* password through questions.
* @returns {String} The error message for the invalid state of the form for password retrieval.
*/
function validatePasswordRetrieval() {
    var status = "";
    try {
        var databaseID = $('#DataBaseNameValueLabel').text().trim();
        var userName = $('#UserNameTextBox').val().trim();

        if (databaseID.length > 3 || databaseID.length === 0) {
            status = "Please select a database.";
        } else {
            if (IsStringNullOrEmpty(userName)) {
                status = "Please provide a username.";
            } else {
                // Success case, so do nothing. Probably delete this section at some point.
            }
        }
    } catch (error) {
        status = "An issue occurred with password recovery. Please contact your administrator.";
    }

    return status;
}

/// <summary>
/// Method to get the SSO token fron client.
/// </summary>
function getSSOToken(callback) {
    $.mobile.loading("show");
    setTimeout(function () {
        setLocal("SSOToken", null);

        var options = 'location=yes,clearsessioncache=yes,clearcache=yes,ignoresslerror=yes';
        var ref = cordova.InAppBrowser.open(getLocal("iMFM_SSOAuthURL") + "?d=" + getCurrentDate(), '_blank', options);
        //SA - 21st June 2019
        ref.addEventListener("loadstop", function (event) {
            //SA - 21st June 2019
            //Tidied up to use the event and capture the value from the SSOTokenHiddenField
            //Only catch here is that only the SSOTokenHiddenField should be on the url otherwise this will fail
            if (event.url.indexOf('SSOTokenHiddenField') > -1) {
                var tokenId = event.url.split('SSOTokenHiddenField')[1].replace('=', '');
                if (tokenId && decryptStr(getLocal("SSOToken")) != tokenId) {
                    setLocal("TempSSOToken", tokenId);
                    //setLocal("SSOToken", encryptStr(decodeURIComponent(tokenId)));
                    var aesKey = EncryptKeyForSSO();
                    setLocal("SSOToken", CryptoJS.AES.encrypt(decodeURIComponent(tokenId), aesKey).toString());
                    setLocal("SSOTokenLastUpdated", getCurrentDate());
                    var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
                    standardAddress = $.constants.STANDARDADDRESS_STRING;
                    standardAddress += $.constants.DB_STRING + Databasename + 'iMFM/';
                    //alert("on loadstop");
                    ref.close();
                    callback();
                }
                ref.close;
            }
        });
    }, 500);
}

/**
* Calculate thed difference between two dates.
* @returns {Int} Number of days.
*/
function getSSODateDiff() {
    var lastUpdated = new Date(getLocal("SSOTokenLastUpdated"));
    var currentDate = new Date(getCurrentDate());
    // var timeDiff = Math.abs(currentDate.getDate() - lastUpdated.getDate());
    // if(timeDiff == 0) {
    //     // For same date difference timeDiff value should be zero
    //     timeDiff = 0;
    // } else {
    //     // For Date difference is more than 0 then timeDiff is calculated from getTime.
    //     timeDiff = Math.abs(currentDate.getTime() - lastUpdated.getTime());
    // }    
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // var diffDays = Math.abs(currentDate - lastUpdated)/36e5/24; 

    // Converts day difference based on hours.
    //return Math.abs(currentDate - lastUpdated)/36e5/24;
    var timeDiff = Math.abs(currentDate.getDate() - lastUpdated.getDate());
    if (timeDiff == 0) {
        // For same date difference timeDiff value should be zero
        timeDiff = 0;
    } else {
        // For Date difference is more than 0 then timeDiff is calculated from getTime.
        timeDiff = Math.abs(currentDate.getTime() - lastUpdated.getTime());
    }
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}

/**
* To get the current date in MM/DD/YYYY format.
* @returns {string} current date.
*/
function getCurrentDate() {
    var currentDate = new Date();
    return currentDate; //(currentDate.getMonth() + 1) + "/" + currentDate.getDate() + "/" + currentDate.getFullYear();
}

///// <summary>
///// Method to get public key for encryption.
///// </summary>
//function getRSAKeys() {
//    if (navigator.onLine) {
//        var accessURL = VerifyDatabaseID(standardAddress) + "LoginAuthentication.ashx?methodname=GetKeys";
//        if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
//            accessURL = $.constants.SETTINGS_STRING + $.constants.localhost_DB_STRING + $.constants.localhost_DB_STRING_000 + "iMFM/LoginAuthentication.ashx?methodname=GetKeys";
//        }
//        $.postJSON(accessURL, null, function (data) {

//            var page = $("#" + loginPageID);
//            var userName = page.find('#UserNameTextBox').val();

//            var password = page.find('#PasswordTextBox').val();
//            var loginURL = '';
//            var myJSONobject = '';

//            setLocal('PublicKey', data);
//        });
//    }
//}

function NeedHelpPopup() {
    $("#" + $.mobile.activePage.attr('id') + "NeedHelpPopup").popup("open");
}

function CloseNeedHelpPopup() {
    var page = $("#" + $.mobile.activePage.attr('id'));    
    page.find("#" + $.mobile.activePage.attr('id') + "NeedHelpPopup").popup("close");
}
