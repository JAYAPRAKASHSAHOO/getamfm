/**
 * Constructor to create a security question configuration panel.
 * @return {object} [The new panel with handlers to configure security questions anywhere.]
 */
function SecurityQuestionConfig(entity) {
    this.entity = $(entity);
    var that = this;
    this.entity.find('.security-submit').off('click');
    this.entity.find('.security-submit').on('click', function () {
        that.submitConfiguration.call(that);
    });
    return this;
};

/**
 * Callback function for the submit action. Typically used to update
 * UI elements after the submit has succeeded.
 */
SecurityQuestionConfig.submitCallback = null;

/**
 * Function to display the question configuration panel.
 */
SecurityQuestionConfig.prototype.showPanel = function () {
    $(this.entity).find('.security-question-panel').show();
};

/**
 * Function to hide and reset the question panel.
 */
SecurityQuestionConfig.prototype.hidePanel = function () {
    $(this.entity).find('.security-question-panel').hide();
    $(this.entity).find('select.security-question-dropdown').val(-1).selectmenu('refresh');
    $(this.entity).find('.security-answer').val('');
};

/**
 * Function to retrieve the questions from the database.
 * @return {Object} [The promise for the ajax call that contains a JsonResultData object that contains either security questions or error data]
 */
SecurityQuestionConfig.prototype.fetchQuestions = function () {
    var status = $.Deferred();
    var url = VerifyDatabaseID(standardAddress) + 'ChangePassword.ashx?methodname=FetchQuestions';
    var jsonObject = iMFMJsonObject({});
    
    $.postJSON(url, jsonObject, function (response) {
        if (compareKeys(response, new JsonResultData())) {
            if (response.Result) {
                status.resolve(response.Data);
            } else {
                status.reject(response.Data);
            }
        }
    });
    
    return status.promise();
};

/**
 * Retrieve and load translations for the configuration panel.
 */
SecurityQuestionConfig.prototype.loadTranslations = function () {
    var oldTranslatedStrings = translatedStrings;
    var that = this;
    LoadTranslation('changePassword', function () {
                    
        // Update messages and buttons.
        //that.entity.find('.security-prompt').text(GetTranslatedValue('securityQuestionPrompt'));
        $("#securityQuestionPrompt").text(GetTranslatedValue('securityQuestionPrompt'));
        //that.entity.find('.security-submit .ui-btn-text').text(GetTranslatedValue('QuestionSaveButton'));
        $("#QuestionSaveButton").text(GetTranslatedValue('QuestionSaveButton'));
        var errorMessage = GetTranslatedValue('SecurityQuestionError');
        var questionError = GetTranslatedValue('ThreeQuestionRequiredError');
        var distinctError = GetTranslatedValue('DistinctQuestionsError');
                    
        // Update the questions.
        $.each(that.entity.find('.security-question-setup'), function (index) {
            $(this).find('.security-question-label').text(GetTranslatedValue('SecurityQuestionLabel').replace('{0}', index + 1));
            $(this).find('.security-answer-label').text(GetTranslatedValue('SecurityAnswerLabel').replace('{0}', index + 1));
               
               if (index === $('.security-question-setup').length - 1) {
                translatedStrings = oldTranslatedStrings;
                translatedStrings['SecurityQuestionError'] = errorMessage;
                translatedStrings['ThreeQuestionRequiredError'] = questionError;
                translatedStrings['DistinctQuestionsError'] = distinctError;
            }
        });
    });
};

/**
 * Populate dropdowns with a given question list.
 * @param {Object[]} questionArray - The array of questions to populate into the list.
 */
SecurityQuestionConfig.prototype.initializeDropdowns = function (questionArray) {
    //console.log(this);
    var dropdown = this.entity.find('select.security-question-dropdown');
    dropdown.html('<option value="-1">' + GetCommonTranslatedValue('SelectLabel') + '</option>');
    $.each(questionArray, function () {
        dropdown.append($('<option />').val(this.SecurityQuestionId).text(this.SecurityQuestionText));
    });
    
    dropdown.append($('<optgroup label=""></optgroup>'));
    dropdown.val(dropdown.find(' option:first').val());
    dropdown.selectmenu('refresh');
    this.entity.find('.security-answer').val('');
};

/**
 * Validate the configuration panel to verify data is as expected.
 * @returns {string} [The error message relating to failed validation]
 */
SecurityQuestionConfig.prototype.validateSubmission = function () {
    // Verify that there are 3 questions are selected.
    // Verify all required fields (answers) are filled in.
    // Verify that the questions aren't duplicated.
    var errorResponse = "";
    var questions = [];
    this.entity.find('select.security-question-dropdown, .security-answer').each(function() {
        if (typeof $(this).find('option:selected').val() !== undefinedString) {
            questions.push($(this).find('option:selected').val());
        }
                                                                                
        if (IsStringNullOrEmpty($(this).val()) || $(this).val() === "-1") {
            errorResponse = GetTranslatedValue('ThreeQuestionRequiredError');
            return false;
        }
    });
    
    if (IsStringNullOrEmpty(errorResponse)) {
        if (questions.length !== 3) {
            errorResponse = GetTranslatedValue('SecurityQuestionError');
        } else {
            if (questions[0] === questions[1] ||
                questions[0] === questions[2] ||
                questions[1] === questions[2]) {
                errorResponse = GetTranslatedValue('DistinctQuestionsError');
            }
        }
    }
    
    return errorResponse;
};

/**
 * Function to process an update to the configuration panel.
 */
SecurityQuestionConfig.prototype.submitConfiguration = function () {
    var securityAnswers = [];
    var that = this;

    // Validate the security questions.
    var validation = that.validateSubmission();
    
    if (!IsStringNullOrEmpty(validation)) {
        showError(validation);
    } else {
        $.when.apply($, this.entity.find('ul').map(function() {
           // Go through each element and build a security answer, returning a promise that will update the array upon resolution.
            return that.buildSecurityAnswer(this).then(function (answer) {
                securityAnswers.push(answer);
            });
        }))
        .done(function () {
        
            var jsonObject = iMFMJsonObject({
                SecurityAnswers: JSON.stringify(securityAnswers)
            });
            //var url = VerifyDatabaseID(standardAddress) + 'ChangePassword.ashx?methodname=SubmitQuestionConfig';
            var url = VerifyDatabaseID(standardAddress) + 'ChangePassword.ashx?methodname=SubmitQuestionConfigNew';
            
            $.postJSON(url, jsonObject, function (response) {
                console.log(response);
                if (compareKeys(response, new JsonResultData())) {
                    if (response.Result) {
                        if (typeof that.submitCallback === "function") {
                            that.submitCallback();
                        }
                    }
                       
                    if (IsStringNullOrEmpty(response.Data) || response.Data === null) {
                       response.Data = GetTranslatedValue('SecurityQuestionError');
                    }
                       
                    showError(response.Data);
                }
            });
        });
    }
};

/**
 * Process to create an array of encrypted security answers to submit to the ajax call.
 * @param {Object} entity - The html entity which contains the answer elements.
 * @returns {Object} [A promise that contains the security answer json object]
 */
SecurityQuestionConfig.prototype.buildSecurityAnswer = function (entity) {
    var status = $.Deferred();
    //    $.when(RsaEncrypt(getLocal('PublicKey'), $(entity).find('input.ui-input-text').val()))
    //    .always(function (encryptedAnswer) {
    //        status.resolve({
    //            SecurityQuestionId: $(entity).find('.security-question-dropdown option:selected').val(),
    //            SecurityQuestionText: $(entity).find('.security-question-dropdown option:selected').text(),
    //            SecurityAnswer: encryptedAnswer
    //        });
    //    });

    //$.when(encryptStr($(entity).find('input.ui-input-text').val()))
   var aesKey = EncryptKey();
   $.when(CryptoJS.AES.encrypt($(entity).find('.ui-input-text .security-answer').val(), aesKey).toString())
    .always(function (encryptedAnswer) {
        status.resolve({
            SecurityQuestionId: $(entity).find('.security-question-dropdown option:selected').val(),
            SecurityQuestionText: $(entity).find('.security-question-dropdown option:selected').text(),
            SecurityAnswer: encryptedAnswer
        });
    });

    return status.promise();
};

