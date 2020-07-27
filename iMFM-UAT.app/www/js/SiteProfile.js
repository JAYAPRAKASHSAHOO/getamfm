function BindSiteProfilePropertyDropDown(value) {
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#propertyIDDropDown option:gt(0)").remove();
    $("#" + pageID).find("#propertyIDDropDown option[value='-1']").remove();
    $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
    if (value.length >= 3) {
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql('SELECT PropertyID, RegionID, PropertyText,RegionText FROM PropertyTable WHERE TCC_Project_Number like ? or PropertyText like ? or RegionText like ? or AltKey like ? LIMIT 50 COLLATE NOCASE', ['%' + value + '%', '%' + value + '%', '%' + value + '%', '%' + value + '%'], BindSelectedValueToSiteProfilePropertyDD, function (tx, error) {

            });
        });
    }
    else {
        var selectLabel = GetCommonTranslatedValue("SelectLabel");
        $("#" + pageID).find("#propertyIDDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
        return false;
    }
}

function BindSelectedValueToSiteProfilePropertyDD(ts, result) {
    var item;
    var optiontag;
    var pageID = $.mobile.activePage.attr("id");

    $("#" + pageID).find("#propertyIDDropDown option:gt(0)").remove();
    $("#" + pageID).find("#propertyIDDropDown option[value='-1']").remove();
    $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");

    if (result.rows.length === 0) {
        var option = '<option value="-2">' + GetCommonTranslatedValue("LocationNotFound") + '</option>';
        $("#" + pageID).find("#propertyIDDropDown").append(option);
        $("#" + pageID).find("#propertyIDDropDown").val("-2");
        $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
        return false;
    }
    if (result.rows.length == 1) {
        item = result.rows.item(0);
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
        optiontag.innerHTML = item.PropertyText;
        $("#" + pageID).find("#propertyIDDropDown").append(optiontag);
        $("#" + pageID).find("#propertyIDDropDown").val(item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
        $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
        GetSiteProfile(item.RegionID, item.PropertyID);
        return false;
    }
    if (result.rows.length > 1) {
        var firstTag = document.createElement('option');
        firstTag.setAttribute("value", "-1");
        firstTag.innerHTML = "-- [ " + result.rows.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $("#propertyIDDropDown").append(firstTag);
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
            item = result.rows.item(i);
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
            optiontag.innerHTML = item.PropertyText;
            $("#" + pageID).find("#propertyIDDropDown").append(optiontag);
        }
    }
    $("#propertyIDDropDown").val('-1');
    $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
}

function LoadSiteProfile(value) {
    var pageID = $.mobile.activePage.attr('id');
    if (value != -1) {
        var valueArray = value.split('|');
        var data = [];
        data[0] = valueArray[2];
        data[1] = valueArray[1];
        data[3] = valueArray[0];
        var searchText = $('#' + pageID).find('#siteProfilePropertyIDText').val();
        localStorage.setItem("RegionDescription", data[0]);
        localStorage.setItem("DivisionDescription", $("#" + pageID).find("#propertyIDDropDown option:selected").html());
        localStorage.setItem("RegionNumber", data[1]);
        localStorage.setItem("DivisionNumber", data[3]);
        GetSiteProfile(data[1], data[3]);
    }
}

function refreshSiteProfile() {
    GetSiteProfile(localStorage.getItem("RegionNumber"), localStorage.getItem("DivisionNumber"));
}

function GetSiteProfile(RegionNumber, DivisionNumber) {
    localStorage.setItem("RegionNumber", RegionNumber);
    localStorage.setItem("DivisionNumber", DivisionNumber);
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "Option": 0,
        "RegionNumber": RegionNumber,
        "DivisionNumber": DivisionNumber,
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    if (navigator.onLine) {
        showLoading();
        var accessURL = standardAddress + "SiteProfile.ashx?methodname=GetSiteProfile";
        $.ajaxpostJSON(accessURL, myJSONobject, function (resultData) {
            closeLoading();
            if (resultData.Table.length > 0) {
                $("#NoSiteProfile").css("display", "none");
                $('#SiteProfileList').empty();
                createDynamicSiteProfileList(resultData);
            }
            else {
                $('#SiteProfileList').empty();
                $("#NoSiteProfile p").text(GetTranslatedValue("NoSiteProfile"));
                $("#NoSiteProfile").css("display", "block");
            }

        });
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function createDynamicSiteProfileList(resultData) {
    var siteProfileLength = resultData.Table.length;
    var prevCategDesc = '';
    var dynamicHeader = '';
    for (var index = 0; index < siteProfileLength; index++) {
        if (prevCategDesc != resultData.Table[index].CategoryDescription) {
            if (index !== 0) {
                dynamicHeader = dynamicHeader + '</ul></div>';
            }

            dynamicHeader = dynamicHeader + '<div data-role="collapsible" id="' + (resultData.Table[index].CategoryDescription).replace(/\s/g, "") + '" class="collapsibleBackground" data-inset="true">' +
                            '<h4><strong class="boldfont">' + resultData.Table[index].CategoryDescription + '</strong></h4>' +
                            '<ul data-role="listview" class="collapsibleUl" data-theme = "c">';
            dynamicHeader = dynamicHeader + createSiteProfileList(resultData.Table[index], resultData.Table1);
        }
        else {
            dynamicHeader = dynamicHeader + createSiteProfileList(resultData.Table[index], resultData.Table1);
        } // end of else
        prevCategDesc = resultData.Table[index].CategoryDescription;
    }
    dynamicHeader = dynamicHeader + '</ul></div>';
    $('#SiteProfileList').append(dynamicHeader);
    $('#SiteProfileList').trigger('create');

    if (typeof (localStorage.getItem("siteProfileCategoryDesc")) != "undefined") {
        $("#SiteProfileList").find("#" + localStorage.getItem("siteProfileCategoryDesc")).trigger("expand");
    }

    if (typeof (localStorage.getItem("SiteProfileScreenEditable")) != "undefined") {
        if (localStorage.getItem("SiteProfileScreenEditable") == 0) {
            $(".siteProfileSaveIcon").addClass("ui-disabled");
            $(".dynamicElementContainer").addClass("ui-disabled");
        }
    }
}

function createSiteProfileList(siteProfileData, dropDownValues) {
    var siteProfileList = '';
    siteProfileList = siteProfileList +
                        '<li><p class="lable" style="font-size: 0.9em; white-space:normal; word-break:break-word;">' + GetTranslatedValue('siteProfileItemDescLabel') +
                        '<strong class="boldfont">' + (IsStringNullOrEmpty(siteProfileData.ItemDescription) ? "" : siteProfileData.ItemDescription) +
                        '</strong></p>' +
                        '<p class="lable" style="font-size: 0.9em; white-space:normal; word-break:break-word;">' + GetTranslatedValue('siteProfileItemIDLabel') + '-' + GetTranslatedValue('siteProfileSeqIDLabel') + ': ' +
                        '<strong class="boldfont">' + (IsStringNullOrEmpty(siteProfileData.ItemID) ? "" : siteProfileData.ItemID) + '-' +
                                                      (IsStringNullOrEmpty(siteProfileData.Seq) ? "" : siteProfileData.Seq) +
                        '</strong></p>';
    if (siteProfileData.DataType.toUpperCase() == "YES/NO") {
        var actCommentText = "";
        if (!IsStringNullOrEmpty(siteProfileData.ActionComment)) {
            if (siteProfileData.ActionComment == 0)
                actCommentText = GetCommonTranslatedValue("NoLabel");
            else
                actCommentText = GetCommonTranslatedValue("YesLabel");
        }

        siteProfileList = siteProfileList + '<p class="lable" style="font-size: 0.9em">' + GetTranslatedValue('siteProfileCommentLabel') +
                        '<strong class="boldfont">' + actCommentText +
                        '</strong></p>' +
                        '<p class="lable" style="font-size: 0.9em; white-space:normal; word-break:break-word;">' + GetTranslatedValue('siteProfilePromptLabel') +
                        '<strong class="boldfont">' + (IsStringNullOrEmpty(siteProfileData.Prompt) ? "" : siteProfileData.Prompt) +
                        '</strong></p>';
    }
    else {
        siteProfileList = siteProfileList + '<p class="lable" style="font-size: 0.9em; white-space:normal; word-break:break-word;">' + GetTranslatedValue('siteProfileCommentLabel') +
                        '<strong class="boldfont">' + (IsStringNullOrEmpty(siteProfileData.ActionComment) ? "" : siteProfileData.ActionComment) +
                        '</strong></p>' +
                        '<p class="lable" style="font-size: 0.9em; white-space:normal; word-break:break-word;">' + GetTranslatedValue('siteProfilePromptLabel') +
                        '<strong class="boldfont">' + (IsStringNullOrEmpty(siteProfileData.Prompt) ? "" : siteProfileData.Prompt) +
                        '</strong></p>';
    }

    siteProfileList = siteProfileList + createDynamicSiteField(siteProfileData, dropDownValues);
    siteProfileList = siteProfileList + '<p style="text-align:right;">' +
                        '<img width="32px" style="margin-right:2%;" height="32px" class="img-about" id=' + siteProfileData.Seq +
                        ' data-default=' + (IsStringNullOrEmpty(siteProfileData.DefaultValue) ? "null" : siteProfileData.DefaultValue) +
                        ' data-units=' + (IsStringNullOrEmpty(siteProfileData.Units) ? "null" : siteProfileData.Units) +
                        ' data-maxval=' + (IsStringNullOrEmpty(siteProfileData.MaximumValue) ? "null" : siteProfileData.MaximumValue) +
                        ' data-minval=' + (IsStringNullOrEmpty(siteProfileData.MinimumValue) ? "null" : siteProfileData.MinimumValue) +
                        ' data-maxlen=' + (IsStringNullOrEmpty(siteProfileData.MaxLength) ? "null" : siteProfileData.MaxLength) +
                        ' onclick="openSiteProfileHelpPopup(this);" />' +
                        '<img class="siteProfileSaveIcon img-approve" width="32px" height="32px" id=' + siteProfileData.ItemID +
                        ' data-validate =' + siteProfileData.ItemID + '_' + siteProfileData.Seq +
                        ' data-type ="' + siteProfileData.DataType + '"' +
                        ' data-categdesc="' + (siteProfileData.CategoryDescription).replace(/\s/g, "") + '"' +
                        ' onclick="saveSiteProfileData(this);" />'
    '</p>';
    siteProfileList = siteProfileList + '<li>';
    return siteProfileList;
}

function createDynamicSiteField(siteProfileData, dropDownValues) {
    var dataType = siteProfileData.DataType.toUpperCase();
    var dynamicElementID = siteProfileData.ItemID + '_' + siteProfileData.Seq;
    var dynamicElement = '';
    if (siteProfileData.Required)
    ////    dynamicElement = dynamicElement + '<p class="lable" style="font-size: 0.9em">' +
    ////                     '<label style="color: Red; margin-right:2%;>' + '*' + '</label>' +
    ////                     '<label>' + siteProfileData.Label + '</label>';
        dynamicElement = '<p class="lable dynamicElementContainer" style="font-size: 0.9em"><span style="color: Red">*&nbsp</span><label>' + siteProfileData.Label + '</label>';
    else
        dynamicElement = '<p class="lable dynamicElementContainer" style="font-size: 0.9em"><label>' + siteProfileData.Label + '</label>';

    switch (dataType) {
        case "PICKLIST":
            var dynamicDropDown = '<select class="picklistElement" onchange="highLightDropDown(this);" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '" >' +
                                  '<option value ="">' + GetCommonTranslatedValue("SelectLabel") + '</option>';
            var optiontag;
            var selectOption = "";
            if (IsStringNullOrEmpty(siteProfileData.ActionComment)) {
                selectOption = siteProfileData.DefaultValue;
            }
            else {
                selectOption = siteProfileData.ActionComment;
            }
            for (var index = 0; index < dropDownValues.length; index++) {
                if (dropDownValues[index].ItemSeq == siteProfileData.Seq) {
                    if (selectOption == dropDownValues[index].ValueItem) {
                        optiontag = '<option selected="selected" value ="' + dropDownValues[index].ValueItem + '">' +
                                dropDownValues[index].ValueItem + '</option>';
                    }
                    else {
                        optiontag = '<option value ="' + dropDownValues[index].ValueItem + '">' +
                                dropDownValues[index].ValueItem + '</option>';
                    }
                    dynamicDropDown = dynamicDropDown + optiontag;
                }
            }
            dynamicDropDown = dynamicElement + dynamicDropDown + '</select></p>';
            return dynamicDropDown;
            break;
        case "STRING":
        case "COMMENT":
            var defaultTextAreaVal = "";
            if (!IsStringNullOrEmpty(siteProfileData.ActionComment)) {
                defaultTextAreaVal = siteProfileData.ActionComment;
            }
            else if (!IsStringNullOrEmpty(siteProfileData.DefaultValue)) {
                defaultTextAreaVal = siteProfileData.DefaultValue;
            }
            var dynamictextarea = '<label>: (' + siteProfileData.MaxLength + ' ' + GetTranslatedValue("Available") + ')' + '</label>' + '<textarea cols="1" rows="8" maxlength=' + siteProfileData.MaxLength +
                                  ' value="' + defaultTextAreaVal +
                                  '" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '"' +
                                  ' class="CommentsScrollBar"' + '" onkeypress="return TextAreaOnKeyPress(this);">' + defaultTextAreaVal + '</textarea>';
            dynamictextarea = dynamicElement + dynamictextarea + '</p>';
            return dynamictextarea;
            break;
        case "INTEGER":
            var defaultIntVal = "";
            if (IsStringNullOrEmpty(siteProfileData.ActionComment)) {
                defaultIntVal = siteProfileData.DefaultValue;
            }
            else {
                defaultIntVal = siteProfileData.ActionComment;
            }
            var dynamicIntegerField = '<input class="integerElement" type="number" min="' + siteProfileData.MinimumValue + '" max="' +
                                      siteProfileData.MaximumValue + '"' + ' value="' + defaultIntVal +
                                      '" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '"' +
                                      '"  onkeypress="return BlockNonNumbersInSiteProfile(this, event, false, true);" />';
            dynamicIntegerField = dynamicElement + dynamicIntegerField + '</p>';
            return dynamicIntegerField;
            break;
        case "YES/NO":
            var dynamicYesNo = '<select onchange="highLightDropDown(this);" class="boolElement" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '" >' +
                               '<option value ="">' + GetCommonTranslatedValue("SelectLabel") + '</option>';
            if (siteProfileData.ActionComment == 0) {
                dynamicYesNo = dynamicYesNo + '<option value = "true">' + GetCommonTranslatedValue("YesLabel") + '</option>' +
                                              '<option value = "false" selected="selected">' + GetCommonTranslatedValue("NoLabel") + '</option></select></p>';
            }
            else if (siteProfileData.ActionComment == 1) {
                dynamicYesNo = dynamicYesNo + '<option value = "true" selected="selected">' + GetCommonTranslatedValue("YesLabel") + '</option>' +
                                              '<option value = "false">' + GetCommonTranslatedValue("NoLabel") + '</option></select></p>';
            }
            else {
                dynamicYesNo = dynamicYesNo + '<option value = "true" >' + GetCommonTranslatedValue("YesLabel") + '</option>' +
                                              '<option value = "false">' + GetCommonTranslatedValue("NoLabel") + '</option></select></p>';
            }

            dynamicYesNo = dynamicElement + dynamicYesNo;
            return dynamicYesNo;
            break;
        case "DATE":
            var DefaultDate = null;
            if (!IsStringNullOrEmpty(siteProfileData.ActionComment)) {
                DefaultDate = siteProfileData.ActionComment.split("/");
            }
            else if (!IsStringNullOrEmpty(siteProfileData.DefaultValue)) {
                DefaultDate = siteProfileData.DefaultValue.split("/");
                if (DefaultDate[0].length == 1 && DefaultDate[0] < 10) {
                    DefaultDate[0] = 0 + DefaultDate[0];
                }
            }

            if (DefaultDate != null) {
                if (DefaultDate.length > 0)
                    dynamicDate = '<input onchange="highLightDropDown(this);" class="dateElement" type="date" value="' + DefaultDate[2] + '-' + DefaultDate[0] + '-' + DefaultDate[1] + '"' +
                              ' id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '"' +
                              ' /></p>';
                else {
                    dynamicDate = '<input onchange="highLightDropDown(this);" class="dateElement" type="date" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '" /></p>';
                }
            }
            else {
                dynamicDate = '<input onchange="highLightDropDown(this);" class="dateElement" type="date" id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '" /></p>';
            }

            dynamicDate = dynamicElement + dynamicDate;
            return dynamicDate;
            break;
        case "DECIMAL":
            var defaultDecVal = "";
            if (IsStringNullOrEmpty(siteProfileData.ActionComment)) {
                defaultDecVal = siteProfileData.DefaultValue;
            }
            else {
                defaultDecVal = siteProfileData.ActionComment;
            }
            var dynamicDecimalField = '<input class="decimalElement" type="number" min="' + siteProfileData.MinimumValue + '" max="' +
                                      siteProfileData.MaximumValue + '"' + ' value="' + defaultDecVal + '"' +
                                      ' onblur="FormatTODecimalInTextBox(this);" onkeypress="return BlockNonNumbersInSiteProfile(this, event, true, true);"' +
                                      ' id ="' + dynamicElementID + '" data-required="' + siteProfileData.Required + '"' +
                                      ' />';
            dynamicDecimalField = dynamicElement + dynamicDecimalField + '</p>';
            return dynamicDecimalField;
            break;
    }
}

function focusFunction(obj) {
    $("#" + obj.id).css("border", "1px solid green");
}

function blurFunction(obj) {
    $("#" + obj.id).css("border", "1px solid red");
}

function highLightDropDown(obj) {
    $("#" + obj.id).parent().css("border", "1px solid red");
}

function FormatTODecimalInTextBox(textbox) {
    textbox.value = GetDecimal(textbox.value, 4, false);
}

function TextAreaOnKeyPress(obj) {
    $("#" + obj.id).css("border", "1px solid red");
}

function BlockNonNumbersInSiteProfile(obj, e, allowDecimal, allowNegative) {
    $("#" + obj.id).parent().css("border", "1px solid red");
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

function openSiteProfileHelpPopup(obj) {
    var helpBubble = '';
    helpBubble = helpBubble +
                 '<p> ' + GetTranslatedValue("DefaultValueLabel") + ' ' + (IsStringNullOrEmpty($("#" + obj.id).attr("data-default")) ? "" : $("#" + obj.id).attr("data-default")) + '</p>' +
                 '<p> ' + GetTranslatedValue("UnitsLabel") + ' ' + (IsStringNullOrEmpty($("#" + obj.id).attr("data-units")) ? "" : $("#" + obj.id).attr("data-units")) + '</p>' +
                 '<p> ' + GetTranslatedValue("MaximumValueLabel") + ' ' + (IsStringNullOrEmpty($("#" + obj.id).attr("data-maxval")) ? "" : $("#" + obj.id).attr("data-maxval")) + '</p>' +
                 '<p> ' + GetTranslatedValue("MinimumValueLabel") + ' ' + (IsStringNullOrEmpty($("#" + obj.id).attr("data-minval")) ? "" : $("#" + obj.id).attr("data-minval")) + '</p>' +
                 '<p> ' + GetTranslatedValue("MaximumLengthLabel") + ' ' + (IsStringNullOrEmpty($("#" + obj.id).attr("data-maxlen")) ? "" : $("#" + obj.id).attr("data-maxlen")) + '</p>';
    $('#siteProfileHelpBubbleDiv').html(helpBubble);
    $('#siteProfileHelpBubble').popup('open', { positionTo: "#" + obj.id });
}

function saveSiteProfileData(obj) {
    setLocal('siteProfileCategoryDesc', $("#" + obj.id).attr("data-categdesc"));
    var validateID = $("#" + obj.id).attr("data-validate");
    var dataType = $("#" + obj.id).attr("data-type").toUpperCase();
    var ItemId = validateID.split('_');
    var mandatoryCheck = false;
    var minVal;
    var maxVal;
    switch (dataType) {
        case "PICKLIST":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("PicklistRequiredMessage"));
                return;
            }
            break;
        case "STRING":
        case "COMMENT":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("StringRequiredMessage"));
                return;
            }
            break;
        case "INTEGER":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            minVal = parseInt($("#" + validateID).attr('min'));
            maxVal = parseInt($("#" + validateID).attr('max'));
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("IntegerRequiredMessage"));
                return;
            }

            if (!(parseInt($("#" + validateID).val()) <= maxVal && parseInt($("#" + validateID).val()) >= minVal)) {
                if ($.trim($("#" + validateID).val()).length != 0) {
                    showError(GetTranslatedValue("InvalidIntegerRangeMessage"));
                    return;
                }
            }

            break;
        case "YES/NO":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("YesNoRequiredMessage"));
                return;
            }
            break;
        case "DATE":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("DateRequiredMessage"));
                return;
            }
            break;
        case "DECIMAL":
            mandatoryCheck = $("#" + validateID).attr("data-required");
            minVal = parseFloat($("#" + validateID).attr('min')).toFixed(4);
            maxVal = parseFloat($("#" + validateID).attr('max')).toFixed(4);
            if ((mandatoryCheck == true || mandatoryCheck == "true") && $.trim($("#" + validateID).val()).length == 0) {
                showError(GetTranslatedValue("RequiredMessage") + " " + GetTranslatedValue("DecimalRequiredMessage"));
                return;
            }

            if (!(parseFloat($("#" + validateID).val()).toFixed(4) <= maxVal && parseFloat($("#" + validateID).val()).toFixed(4) >= minVal)) {
                if ($.trim($("#" + validateID).val()).length != 0) {
                    showError(GetTranslatedValue("InvalidDecimalRangeMessage"));
                    return;
                }
            }

            break;
    }

    ////    alert($("#" + validateID).val());
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "Option": 1,
        "RegionNumber": localStorage.getItem("RegionNumber"),
        "DivisionNumber": localStorage.getItem("DivisionNumber"),
        "ItemID": ItemId[0],
        //"Action": $("#" + validateID).val(),
        "Action": securityError($("#" + validateID)),
        "GPSLocation": GlobalLat + "," + GlobalLong,
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    if (navigator.onLine) {
        showLoading();
        var accessURL = standardAddress + "SiteProfile.ashx?methodname=SetSiteProfile";
        $.ajaxpostJSON(accessURL, myJSONobject, function (resultData) {
            if (resultData) {
                refreshSiteProfile();
            }
            else {
                $('#SiteProfileSavePopupDiv').text(GetTranslatedValue("FailedToUpdate"));
                setTimeout(function () {
                    $('#SiteProfileSavePopup').popup('open');
                }, 500);
            }
            closeLoading();
        });
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}
