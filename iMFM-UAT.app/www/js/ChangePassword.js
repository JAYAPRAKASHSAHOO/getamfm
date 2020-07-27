/// <summary>
/// Method to change password.
/// </summary>
function ChangePasswordIMFM() {
    var secureOldPwd;
    var secureNewPwd;
    var confirmPwd;

    if ($("#OldPasswordTextBox").val() !== "") {
        secureOldPwd = securityError($("#OldPasswordTextBox"));
    }

    if ($("#NewPasswordTextBox").val() !== "") {
        secureNewPwd = securityError($("#NewPasswordTextBox"));
    }

    if ($("#ConfirmNewPasswordTextBox").val() !== "") {
        confirmPwd = securityError($("#ConfirmNewPasswordTextBox"));
        if (confirmPwd == "") {
            return false;
        }
    }

    if (secureOldPwd.length === 0 && secureNewPwd.length === 0 && confirmPwd.length === 0) {
        showError(GetTranslatedValue('AllMandatoryFields'));
        return false;
    }
    else if (secureOldPwd.length === 0) {
        showError(GetTranslatedValue('OldPasswordMandatory'));
        return false;
    }
    else if (secureNewPwd.length === 0) {
        showError(GetTranslatedValue('NewPasswordMandatory'));
        return false;
    }
    else if (confirmPwd.length === 0) {
        showError(GetTranslatedValue('ConfirmNewPasswordMandatory'));
        return false;
    }
    else {
        if (secureNewPwd !== confirmPwd) {
            showError(GetTranslatedValue('PasswordMisMatch'));
            return false;
        }
    }

    //    if ($("#EncryptedOldPassWord").val() !== "") {
    //        secureOldPwd = securityError($("#EncryptedOldPassWord"));
    //    }

    //    if ($("#EncryptedNewPassWord").val() !== "") {
    //        secureNewPwd = securityError($("#EncryptedNewPassWord"));
    //    }

    //    if ($("#EncryptedRepeatNewPassWord").val() !== "") {
    //        confirmPwd = securityError($("#EncryptedRepeatNewPassWord"));
    //        if (confirmPwd == "") {
    //            return false;
    //        }
    //    }

    var accessURL = standardAddress + "LoginAuthentication.ashx?methodname=GetKeys"
    $.postJSON(accessURL, null, function (data) {
        //        var oldPassword = RsaEncrypt(data, secureOldPwd);
        //        var newPassword = RsaEncrypt(data, secureNewPwd);
        //        var confirmNewPassword = RsaEncrypt(data, confirmPwd);
      
//        var oldPassword = CryptoJS.AES.encrypt(secureOldPwd, $.bluejay.scrubjay).toString();
//        var newPassword = CryptoJS.AES.encrypt(secureNewPwd, $.bluejay.scrubjay).toString();
//        var confirmNewPassword = CryptoJS.AES.encrypt(confirmPwd, $.bluejay.scrubjay).toString();
        ValidateChangePasswordIMFM(secureOldPwd, secureNewPwd, confirmPwd);
    });
}

/// <summary>
/// Method to validate change password.
/// </summary>
/// <param name="oldPassword">Holds old password. </param>
/// <param name="newPassword">Holds new password. </param>
/// <param name="confirmNewPassword">Holds new password. </param>
function ValidateChangePasswordIMFM(oldPassword, newPassword, confirmNewPassword) {
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "OldPswd": oldPassword,
        "NewPswd": newPassword,
        "ConfirmNewPswd": confirmNewPassword,
        "GPSLocation": GlobalLat + "," + GlobalLong,
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var accessURL = standardAddress + "ChangePassword.ashx?methodname=ChangePassword";
    showActionPopupLoading();
    $.postJSON(accessURL, myJSONobject, function (resultData) {
        var pswdChangeStatus = false;
        var failMessage = "";

        for (var i = 0; i < resultData.length; i++) {
            if (resultData[i].Key == "Success") {
                pswdChangeStatus = true;
            }
        }
        if (pswdChangeStatus == true) {
            $('#changePasswordMsg').html(resultData[0].Value);
            $("#changePasswordFailButton").hide();
            $("#changePasswordSuccessButton").show();
            closeActionPopupLoading();
            setTimeout(function () {
                $("#changePasswordPopup").attr('style', 'display:block');
                $('#changePasswordPopup').popup().popup('open');
            }, 1650);
        }
        else {
            for (var i = 0; i < resultData.length; i++) {
                failMessage = failMessage + '<p>' + resultData[i].Value + '</p>';
            }
            $('#OldPasswordTextBox').val('');
            $('#NewPasswordTextBox').val('');
            $('#ConfirmNewPasswordTextBox').val('');
            $('#changePasswordMsg').html(failMessage);
            $("#changePasswordFailButton").show();
            $("#changePasswordSuccessButton").hide();
            closeActionPopupLoading();
            setTimeout(function () {
                $("#changePasswordPopup").attr('style', 'display:block');
                $('#changePasswordPopup').popup().popup('open');
            }, 1650);
        }
    });
}