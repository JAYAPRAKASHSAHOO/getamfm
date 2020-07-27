/**
* Constructor to create a SecurityQuestion popup.
* @return {object} [The new SecurityQuestionWindow popup with handlers to fetch
and validate security questions]
*/
function SecurityQuestionWindow(entity) {
    this.entity = $(entity);
    var that = this;
    this.entity.find('.security-submit').off('click');
    this.entity.find('.security-cancel').off('click');
    this.entity.find('.security-submit').on('click', function () {
        that.submitAnswer.call(that);
    });
    this.entity.find('.security-cancel').on('click', function () {
        that.closeWindow.call(that);
    });
    return this;
};

/**
* Open the popup to display the security questions.
*/
SecurityQuestionWindow.prototype.openWindow = function () {
    $(this.entity).find('.security-answer').val('');
    $(this.entity).find('.security-error').text('');
    $(this.entity).popup('open');
};

/**
* Close the popup for displaying security questions.
*/
SecurityQuestionWindow.prototype.closeWindow = function () {
    $(this.entity).popup('close');
};

/**
* Fetch a random security question for the user to answer.
* @param {string} userNameEntity - The identifier of a user name field to default to.
* @return {object} [The promise for the process with the question in the callback]
*/
SecurityQuestionWindow.prototype.fetchQuestion = function (userNameEntity) {
    if (typeof userNameEntity !== 'undefined') {
        setLocal('Username', $(userNameEntity).val().trim());
    }
    var url = VerifyDatabaseID(standardAddress) + 'LoginAuthentication.ashx?methodname=GetQuestion';
    var jsonObject = iMFMJsonObject({
        Username: getLocal('Username')
    });
    if (jsonObject.DatabaseID == "undefined") {
        jsonObject.DatabaseID == getLocal("PlainDatabaseID");
    }
    if ($.mobile.activePage.attr('id') == 'Login') {
        var DatabaseId = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
        jsonObject.DatabaseID = DatabaseId;
    }
    var status = $.Deferred();
    $.postJSON(url, jsonObject, function (securityQuestion) {
        if (securityQuestion.Result) {
            status.resolve(securityQuestion);
        } else {
            status.reject(securityQuestion);
        }
    }, function (error) {
        status.reject(error);
    });

    return status.promise();
};

/**
* Update the question on the popup from what was provided.
* @param {object} question [The question to be updated]
*/
SecurityQuestionWindow.prototype.populateQuestion = function (question) {
    // We expect the question to come in as a JsonResultData object.
    if (compareKeys(question, new JsonResultData())) {
        if (question.Result) {
            $(this.entity).find('.security-question').attr('data-security-question-id', question.Data.SecurityQuestionId);
            $(this.entity).find('.security-question').text(question.Data.SecurityQuestionText);
            $(this.entity).find('.security-submit').removeAttr('disabled');
        }
    } else {
        $(this.entity).find('.security-question').text(question);
    }
};

/**
* Take a provided value and encrypt it for secure transmission.
* @param {string} answer - The value in which we are encrypting.
* @returns {object} [A deferred object that will have the encrypted string in the
*    resolved args.
*/
SecurityQuestionWindow.prototype.encryptAnswer = function (answer) {
    var status = $.Deferred();
    //    var encryptedResponse = RsaEncrypt(getLocal('PublicKey'), answer);
//    var aesKey = EncryptKeyForgotPassword();
//    var encryptedResponse = CryptoJS.AES.encrypt(answer, aesKey).toString();
    status.resolve(answer);
    return status.promise();
};

/**
* Submit the answer to a question to the database and request a new password.
*/
SecurityQuestionWindow.prototype.submitAnswer = function () {
    var that = this;
    if ($(this.entity).find('.security-submit').attr('disabled') !== 'disabled') {
        if ($(this.entity).find('.security-answer').val() == "") {            
            return;
        }
        $(this.entity).find('.security-submit').attr('disabled', true);
        var questionID = $(this.entity).find('.security-question').attr('data-security-question-id');
        $.when(this.encryptAnswer($(this.entity).find('.security-answer').val()))
        .done(function (encryptedAnswer) {
            var jsonObject = iMFMJsonObject({
                Username: getLocal('Username'),
                SecurityQuestionID: questionID,
                SecurityAnswer: encryptedAnswer
            });

            //var url = VerifyDatabaseID(standardAddress) + 'LoginAuthentication.ashx?methodname=RequestPasswordReset';
            // SR Pentesting updated method name
            var url = VerifyDatabaseID(standardAddress) + 'LoginAuthentication.ashx?methodname=RequestPasswordResetNew';
            $.postJSON(url, jsonObject, function (response) {
                // Verify that the response is in a format we're expecting.
                if (compareKeys(response, new JsonResultData())) {
                    if (response.Result) {
                        that.closeWindow();
                        setTimeout(function () {
                            showError(response.Data);
                        }, 500);
                    } else {
                        // Show the error message on the question.
                        that.entity.find('.security-error').text(response.Data);
                    }
                }

                // Only unlock the submit button if the account is not locked.
                if (response.Data !== GetTranslatedValue('LockedUserMessage')) {
                    $(that.entity).find('.security-submit').removeAttr('disabled');
                }
            }, function (error) {
                // Unlock the submit button if there was an error.
                $(that.entity).find('.security-submit').removeAttr('disabled');
            });
        });
    }
};
