var Steps = {};

var inputDataTypeHTML = '<input type="hidden" id="attr[OBJECTID]DataType" value = "[OBJECTDATATYPE]">';
var inputDataHTML = '<input type="[INPUTTYPE]" id="attr[OBJECTID]" onfocusout="[UPDATEQUERY]" />';
var inputSelectHTML = '<select id="attr[OBJECTID]" onfocusout="[UPDATEQUERY]"><option value="-1">[SELECTTRANSLATE]</option>'
    + '<option value="0">[NOTRANSLATE]</option><option value="1">[YESTRANSLATE]</option></select>';
var imagePanel = '<span id="imgPanel" data-theme="none"><img id="attr[OBJECTID]spinner"  class="img-ajaxloader-inline" alt="Updating..." style="display:none;" />'
    + '<img id="attr[OBJECTID]updateSuccess" class="ui-icon ui-icon-check" data-role="icon" style="display:none;" />'
    + '<img id="attr[OBJECTID]updateFail" class="ui-icon ui-icon-alert" data-role="icon" style="display:none;" onclick="[UPDATEQUERY]" /></span>';

var stepData = "";

// This will navigate to the form. Used on the WO Details form.
function navigateToSteps(mode) {
    setLocal("RequestedAction", mode);
    $.mobile.changePage("WOStep.html");
}

function prepareStepDetails() {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "WorkOrderNumber": getLocal("WorkOrderNumber"),
        "RecordsPerPage": getLocal("RecordsPerPage")
    });
    stepData = [];
    var stepDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=StepPage";
    getStepdetails(stepDetailsURL, myJSONobject);
}

function prepareAttributeDetails(pageNumber) {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "TagNumber": getLocal("TagNumber"),
        "PageNumber": 1,
        "RecordsPerPage": getLocal("RecordsPerPage")
    });
    stepData = [];
    var attributeDetailsURL = standardAddress + "AssetManager.ashx?method=GetAttributes";
    getAttributesdetails(attributeDetailsURL, myJSONobject);
}



function getStepdetails(stepDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(stepDetailsURL, myJSONobject, function (data) {
            bindStepData(data);
        });
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function getAttributesdetails(attributeDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(attributeDetailsURL, myJSONobject, function (data) {
            // Dynamically create the html.
            // This is used for validations.
            bindAttributes(data);
        });
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

// This method will handle both Steps AND Attributes.
function GetMoreItems(step) {
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr('id');
            var id = step.id;
            var pageNum = parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1;
            var myJSONobject = iMFMJsonObject({
                "Username": decryptStr(getLocal("Username")),
                "TagNumber": getLocal("TagNumber"),
                "WorkOrderNumber": getLocal("WorkOrderNumber"),
                "PageNumber": pageNum,
                "RecordsPerPage": getLocal("RecordsPerPage")
            });

            if (getLocal("RequestedAction") === "Attributes") {
                var attributeDetailsURL = standardAddress + "AssetManager.ashx?method=GetAttributes";
                getAttributesdetails(attributeDetailsURL, myJSONobject);
            } else {
                var stepDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=GetNextStepList";
                getStepdetails(stepDetailsURL, myJSONobject);
            }

            $("#" + pageID).find("#" + id).attr('data-nextPage', parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1);
        }

        else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }

    }
    catch (e) {
        //log(e);
    }
}

// This function will take a step item and return a pair of LI items for grid binding.
function generateStepCode(step) {
    var HTSelect = GetCommonTranslatedValue("SelectLabel");
    var HTStatus = GetTranslatedValue("StatusLabel");
    var HTLastValue = GetTranslatedValue("LastValueLabel");
    var HTYes = GetCommonTranslatedValue("YesLabel");
    var HTNo = GetCommonTranslatedValue("NoLabel");
    var HTNA = GetCommonTranslatedValue("NALabel");
    var addComments = '';
    var dataValue;

    // Each step is styled into two LI items.  A header and details.  Header is included here.
    if (IsStringNullOrEmpty(step.Prompt)) {
        step.Prompt = '';
    }

    if (IsStringNullOrEmpty(step.Label)) {
        step.Label = '&lt;No Label&gt;';
    }
    var returnString = '<li data-role="list-divider"><p class="ui-li-aside">'
        + '<strong>' + HTStatus + '<label id="step' + step.StepID + 'Status" >' + step.Status + '</label></strong></p><span class="steps_header">' + step.Label + '</span></li>'
    // This is the detail LI item.
        + '<li style="padding:.7em 15px" ><p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>'
        + ConvertPhoneToLink(step.Prompt) + '</strong></p>';

    // Add a last value entry if this step has been used before.
    if (!IsStringNullOrEmpty(step.LastValue)) {
        returnString = returnString + '<p style="font-size:12px"><strong>' + HTLastValue + ':' + step.LastValue + '</strong></p>';
    }

    // Insert the input type depending on the dataType: Integer, Decimal, String, Date, Yes/No, Comment.

    switch (step.DataType.toLowerCase()) {
        case "string":
            returnString = returnString + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
                + '"><input type="text" id="step' + step.StepID + '" style = "width:57%;"';

            // If there is a default value.
//            if (!IsStringNullOrEmpty(step.Defaultvalue)) {
//                dataValue =
//                returnString = returnString + ' value="' + step.Defaultvalue + '"';
//            }
//            if (!IsStringNullOrEmpty(step.DataValueStr)) {
//                returnString = returnString + ' value="' + step.DataValueStr + '"';
//            }

            dataValue = IsStringNullOrEmpty(step.DataValueStr) ? (IsStringNullOrEmpty(step.Defaultvalue) ? '' : step.Defaultvalue) : step.DataValueStr;
            returnString = returnString + ' value="' + dataValue + '"';
            returnString = returnString + ' onfocusout="updateStep(' + step.StepID + ' , ' + false + ')" />';
            break;
        case "integer":
            returnString = returnString + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
                + '"><input type="number" id="step' + step.StepID + '" style = "width:57%;"';

            // If there is a default value.
//            if (!IsStringNullOrEmpty(step.Defaultvalue)) {
//                returnString = returnString + ' value="' + step.Defaultvalue + '"';
//            }
//            if (!IsStringNullOrEmpty(step.DataValueInt)) {
//                returnString = returnString + ' value="' + step.DataValueInt + '"';
//            }

            dataValue = IsStringNullOrEmpty(step.DataValueInt) ? (IsStringNullOrEmpty(step.Defaultvalue) ? '' : step.Defaultvalue) : step.DataValueInt;
            returnString = returnString + ' value="' + dataValue + '"';
            returnString = returnString + ' onfocusout="updateStep(' + step.StepID + ', ' + false + ')" />';            
            break;
        case "decimal":
            returnString = returnString + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
                + '"><input type="number" id="step' + step.StepID + '" style = "width:57%;"';

            // If there is a default value.
//            if (!IsStringNullOrEmpty(step.Defaultvalue)) {
//                returnString = returnString + ' value="' + step.Defaultvalue + '"';
//            }
//            if (!IsStringNullOrEmpty(step.DataValueDecimal)) {
//                returnString = returnString + ' value="' + step.DataValueDecimal + '"';
//            }

            dataValue = IsStringNullOrEmpty(step.DataValueDecimal) ? (IsStringNullOrEmpty(step.Defaultvalue) ? '' : step.Defaultvalue) : step.DataValueDecimal;
            returnString = returnString + ' value="' + dataValue + '"';
            returnString = returnString + ' onfocusout="updateStep(' + step.StepID + ', ' + false + ')" />';
            break;
        case "date":
            returnString = returnString + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
                + '"><input type="date" id="step' + step.StepID + '"';

            // If there is a default value, add it as the placeholder.
//            if (!IsStringNullOrEmpty(step.Defaultvalue)) {
//                returnString = returnString + ' value="' + step.Defaultvalue + '"';
//            }
//            if (!IsStringNullOrEmpty(step.DataValueDate)) {
//                returnString = returnString + ' value="' + step.DataValueDate + '"';
//            }

            dataValue = IsStringNullOrEmpty(step.DataValueDate) ? (IsStringNullOrEmpty(step.Defaultvalue) ? '' : step.Defaultvalue) : step.DataValueDate;
            dataValue = new Date(Date.parse(dataValue.replace(/([AP])/g, ' $1').trim()));
            dataValue = dataValue.toString().replace(' ', 'T');
            returnString = returnString + ' value="' + dataValue + '"';
            returnString = returnString + ' onfocusout="updateStep(' + step.StepID + ', ' + false + ')" />';
            break;
        case "yes/no":
        case "yes/no/n/a":
            returnString = returnString + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
                + '"><select id="step' + step.StepID + '" style = "width:57%;"';

            // If there is a default value, add it as the placeholder.
            if (step.Defaultvalue != null) {
                returnString = returnString + ' value="' + step.Defaultvalue + '"';
            }

            returnString = returnString + ' onfocusout="updateStep(' + step.StepID + ', ' + false + ')">';
            //returnString = returnString + ' value="' + step.DataValueBit + '" >'
            //+ '<option value="-1">' + "Select" + '</option>;
            var options = '<option value="-1">' + HTSelect + '</option>' +
                '<option value="1">' + HTYes + '</option>' +
                '<option value="0">' + HTNo + '</option>' +
                '<option value="N/A">' + HTNA + '</option></select>';

            if (step.Status == 'Open') {
                if (step.Defaultvalue != null && step.Defaultvalue.toLowerCase() == 'yes') {
                    returnString += options.replace('"1"', '"1" selected="true"');
                } else if (step.Defaultvalue != null && step.Defaultvalue.toLowerCase() == 'no') {
                    returnString += options.replace('"0"', '"0" selected="true"');
                } else if (step.Defaultvalue != null && step.Defaultvalue.toLowerCase() == 'n/a') {
                    returnString += options.replace('"N/A"', '"N/A" selected="true"');
                }
                else {
                    returnString += options.replace('"-1"', '"-1" selected="true"');
                }
            } else {
                if (IsStringNullOrEmpty(step.DataValueBit)) {
                    returnString += options.replace('"N/A"', '"N/A" selected="true"')
                }
                else if (step.DataValueBit) {
                    returnString += options.replace('"1"', '"1" selected="true"');
                } else {
                    returnString += options.replace('"0"', '"0" selected="true"');
                }
            }

            break;
    }

    returnString = returnString + '<span id="imgPanel" data-theme="none"><img id="step' + step.StepID
        + 'spinner"  class="img-ajaxloader-inline" alt="Updating..." style="display:none;" /><img id="step'
        + step.StepID + 'updateSuccess" class="ui-icon ui-icon-check" data-role="icon" style="display:none;" /><img id="step'
        + step.StepID + 'updateFail" class="ui-icon ui-icon-alert" data-role="icon" style="display:none;" onclick="updateStep('
        + step.StepID + ' , ' + false + ')" /></span>';

    addComments = IsStringNullOrEmpty(step.AdditionalComments) ? '' : step.AdditionalComments;

    if (getLocal('AdditionalCommentsTextBox') == "1") {
        returnString = returnString + '</br></br><label style="font-size: 13px;">Additional Comments</label></br><textarea id="' + step.StepID
        + 'textarea" style="margin-top:8px;width:57%;" onfocusout="updateStep(' + step.StepID + ', ' + true + ')" maxlength="500">' + addComments + '</textarea>';

        returnString = returnString + '<span id="imgPanelAddCom" data-theme="none"><img id="addComments' + step.StepID
        + 'spinner"  class="img-ajaxloader-inline" alt="Updating..." style="display:none;" /><img id="addCom'
        + step.StepID + 'updateSuccess" class="ui-icon ui-icon-check" data-role="icon" style="display:none;" /><img id="addCom'
        + step.StepID + 'updateFail" class="ui-icon ui-icon-alert" data-role="icon" style="display:none;" onclick="updateStep('
        + step.StepID + ', ' + true + ')" /></span>';
    }

    if (!IsStringNullOrEmpty(step.Units)) {
        returnString = returnString + '<span style="padding-left:10px; font-size:12px"><strong>' + step.Units + '</strong></p></li>';
    }

    return returnString;
}

// This function will take an attribute item and return a pair of LI items for grid binding.
function generateAttributeCode(attribute) {
    var HTSelect = GetCommonTranslatedValue("SelectLabel");
    var HTYes = GetCommonTranslatedValue("YesLabel");
    var HTNo = GetCommonTranslatedValue("NoLabel");

    var HTNotEditable = GetTranslatedValue("AttributeNotEditable");

    if (IsStringNullOrEmpty(attribute.Description)) {
        attribute.Description = '';
    }

    var returnString = '';
    // Each step is styled into two LI items.  A header and details.  Header is included here.
    if (attribute.LevelEdit == 'Part') {
        returnString = '<li data-role="list-divider" data-theme="r"><span style="font-size: 12px">' + attribute.Name
        + '<div id="attr' + attribute.MasterID + 'CurrentValue" style="display:[CANACCESS]">[VALUE]</div></span></li>'
        // This is the detail LI item.
            + '<li style="padding:.7em 15px" ><p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>'
        + ConvertPhoneToLink(attribute.Description) + '</strong>'
        + ' <img id="attr' + attribute.MasterID + 'Locked" class="ui-icon ui-icon-alert" data-role="icon" style="display:inline;" onclick=\'javascript:showError("' + HTNotEditable + '");\' /></p>';
    } else {
        returnString = '<li data-role="list-divider"><span style="font-size: 12px">' + attribute.Name
        + '<div id="attr' + attribute.MasterID + 'CurrentValue" style="display:[CANACCESS]">[VALUE]</div></span></li>'
        // This is the detail LI item.
            + '<li style="padding:.7em 15px" ><p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>'
            + ConvertPhoneToLink(attribute.Description) + '</strong></p>';
    }

    returnString = returnString + inputDataTypeHTML.replace("[OBJECTID]", attribute.MasterID).replace("[OBJECTDATATYPE]", attribute.DataType);


    // Insert the input type depending on the dataType: Integer, Decimal, String, Date, Yes/No, Comment.
    switch (attribute.DataType.toLowerCase()) {
        case "string":
            if (attribute.LevelEdit !== 'Part') {
                returnString = returnString + inputDataHTML.replace("[OBJECTID]", attribute.MasterID).replace("[INPUTTYPE]", "text").replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');");

            }

            if (IsStringNullOrEmpty(attribute.ValueString)) {
                returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            } else {
                returnString = returnString.replace("[CANACCESS]", "inline").replace("[VALUE]", " - " + attribute.ValueString);
            }

            break;
        case "integer":
            if (attribute.LevelEdit !== 'Part') {
                returnString = returnString + inputDataHTML.replace("[OBJECTID]", attribute.MasterID).replace("[INPUTTYPE]", "number").replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');");

            }

            if (IsStringNullOrEmpty(attribute.ValueInt)) {
                returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            } else {
                returnString = returnString.replace("[CANACCESS]", "inline").replace("[VALUE]", " - " + attribute.ValueInt);
            }

            break;
        case "decimal":
            if (attribute.LevelEdit !== 'Part') {
                returnString = returnString + inputDataHTML.replace("[OBJECTID]", attribute.MasterID).replace("[INPUTTYPE]", "number").replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');");

            }

            if (IsStringNullOrEmpty(attribute.ValueNum)) {
                returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            } else {
                returnString = returnString.replace("[CANACCESS]", "inline").replace("[VALUE]", " - " + attribute.ValueNum);
            }

            break;
        case "date":
            if (attribute.LevelEdit !== 'Part') {
                returnString = returnString + inputDataHTML.replace("[OBJECTID]", attribute.MasterID).replace("[INPUTTYPE]", "date").replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');");

            }

            if (IsStringNullOrEmpty(attribute.ValueDate)) {
                returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            } else {
                var ValueDateString = GetDateText(GetDateObjectFromInvariantDateString(attribute.ValueDate));
                returnString = returnString.replace("[CANACCESS]", "inline").replace("[VALUE]", " - " + ValueDateString);
            }

            break;
        case "yes/no":
            if (attribute.LevelEdit !== 'Part') {
                returnString = returnString + inputSelectHTML.replace("[OBJECTID]", attribute.MasterID).replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');").replace("[SELECTTRANSLATE]", HTSelect).replace("[YESTRANSLATE]", HTYes).replace("[NOTRANSLATE]", HTNo);

            }

            if (IsStringNullOrEmpty(attribute.ValueBit)) {
                returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            } else {
                returnString = returnString.replace("[CANACCESS]", "inline").replace("[VALUE]", " - " + (attribute.ValueBit ? HTYes : HTNo));
            }

            break;
        default:
            returnString = returnString.replace("[CANACCESS]", "none").replace("[VALUE]", "");
            break;
    }

    returnString = returnString + imagePanel.replace("[OBJECTID]", attribute.MasterID).replace("[UPDATEQUERY]", "javascript:updateAttributes('" + attribute.MasterID + "');");


    return returnString;
}

function bindStepData(data) {
    try {
        var d;
        var pageID = $.mobile.activePage.attr('id');
        var HTStepsWONum = GetTranslatedValue("StepsWONum");
        $("#StepsWONum").html(HTStepsWONum + ' ' + getLocal("WorkOrderNumber"));

        if (data.length === 0) {
            if ($("#StepList").find("li").length === 0) {
                $('#' + pageID).find('#NoStepsDiv').show();
            }
        }
        else {
            $('#' + pageID).find('#NoStepsDiv').hide();
            $('#' + pageID).find('#createWOButton').css('display', 'block');
            // stepitem will contain all html for the steps. It will be appended at the end when ALL steps are added.
            // Not once per step.
            var stepitem = "";
            for (var i = 0; i < data.length; i++) {
                d = data[i];

                stepData.push(d);
                stepitem = stepitem + generateStepCode(d);
            }

            $("#StepList").append(stepitem);
            $("#StepList").listview("refresh");
            $("#StepsWONum").append('<span class="badge">' + d.TotalRecords + '</span>');
            //$("#LogWONum span span").html('WO# ' + getLocal("WorkOrderNumber"));
            if ($("#StepList li").length / 2 == parseInt(d.TotalRecords)) {
                $("#StepNextButton").hide();
            }
        }
    }

    catch (e) {
        // log(e);
    }
}

function bindAttributes(data) {
    try {
        var d;
        var pageID = $.mobile.activePage.attr('id');
        var HTAttributesTagNum = GetTranslatedValue("StepsTagNum");
        $("#StepsWONum").html(HTAttributesTagNum + ' ' + getLocal("TagNumber"));
        if (data.length === 0) {
            if ($("#StepList").find("li").length === 0) {
                $('#' + pageID).find('#NoStepsDiv').show();
            }
        }
        else {

            $('#' + pageID).find('#NoStepsDiv').hide();
            // stepitem will contain all html for the attributes. It will be appended at the end when ALL attributes are added.
            // Not once per attribute.
            var stepitem = "";
            for (var i = 0; i < data.length; i++) {
                d = data[i];

                stepData.push(d);
                stepitem = stepitem + generateAttributeCode(d);
            }

            $("#StepList").append(stepitem);
            $("#StepList").listview("refresh");
            $("#StepsWONum").append('<span class="badge">' + d.TotalRecords + '</span>');
            //$("#LogWONum span span").html('WO# ' + getLocal("WorkOrderNumber"));
            if ($("#StepList li").length / 2 == parseInt(d.TotalRecords)) {
                $("#StepNextButton").hide();
            }
        }
    }

    catch (e) {
        // log(e);
    }
}

// This function will queue an update to the selected step.
function updateStep(step, isComment) {

    if ($("#step" + step).attr("data-handled") !== "true") {
        $("#step" + step).attr("data-handled", true);
        $("#step" + step + "updateSuccess").hide();
        $("#step" + step + "updateFail").hide();
        $("#addCom" + step + "updateSuccess").hide();
        $("#addCom" + step + "updateFail").hide();

        // Validate before updating
        var index = null;
        var executeUpdate = true;
        var dataType = $.trim($("#step" + step + "DataType").val().toLowerCase());
        ////var additionalCommentUpdate = false;
        var additionalCommentUpdate = isComment;

        for (i = 0; i < stepData.length; i++) {
            if (stepData[i].StepID === step) {
                switch (dataType.toLowerCase()) {
                    case "string":
                        if ((stepData[i].DataValueStr == $.trim($("#step" + step).val())) || ((IsStringNullOrEmpty(stepData[i].DataValueStr) && IsStringNullOrEmpty($.trim($("#step" + step).val()))))) {
                            executeUpdate = false;
                        }
                        break;
                    case "integer":
                        if ((stepData[i].Status != 'Open' && stepData[i].DataValueInt == $.trim($("#step" + step).val())) || IsStringNullOrEmpty($.trim($("#step" + step).val()))) {
                            executeUpdate = false;
                        }
                        break;
                    case "date":
                        if ((stepData[i].DataValueDate == $.trim($("#step" + step).val())) || ((IsStringNullOrEmpty(stepData[i].DataValueDate) && IsStringNullOrEmpty($.trim($("#step" + step).val())))) || IsStringNullOrEmpty($.trim($("#step" + step).val()))) {
                            executeUpdate = false;
                        }
                        break;
                    case "yes/no":
                    case "yes/no/n/a":
                        if (stepData[i].Status != 'Open' && stepData[i].DataValueBit == $.trim($("#step" + step).val()) || $.trim($("#step" + step).val()) == -1) {
                            executeUpdate = false;
                        }

                        break;
                    case "decimal":
                        if ((stepData[i].Status != 'Open' && stepData[i].DataValueDecimal == $.trim($("#step" + step).val())) || IsStringNullOrEmpty($.trim($("#step" + step).val()))) {
                            executeUpdate = false;
                        }
                        break;
                }

                // Check MaxVal/MinVal validation.
                if ((dataType.toLowerCase() === "integer" || dataType.toLowerCase() === "numeric" || dataType.toLowerCase() === "decimal") && !isComment) {
                    if (($.trim($("#step" + step).val()) > stepData[i].MaxVal) || ($.trim($("#step" + step).val()) < stepData[i].MinVal)) {
                        var HTError = GetTranslatedValue('InvalidValue').replace("[MIN]", stepData[i].MinVal).replace("[MAX]", stepData[i].MaxVal);
                        executeUpdate = false;
                        $("#step" + step + "spinner").hide();
                        $("#step" + step + "updateFail").show();
                        $("#step" + step + "updateFail").click(showError(HTError));
                    }
                }

                if ((dataType.toLowerCase() === "date") && !isComment) {
                    if (($.trim($("#step" + step).val()) > stepData[i].MaxDateVal) || ($.trim($("#step" + step).val()) < stepData[i].MinDateVal)) {
                        var HTError = GetTranslatedValue('InvalidValue').replace("[MIN]", stepData[i].MinDateVal).replace("[MAX]", stepData[i].MaxDateVal);
                        executeUpdate = false;
                        $("#step" + step + "spinner").hide();
                        $("#step" + step + "updateFail").show();
                        $("#step" + step + "updateFail").click(showError(HTError));
                    }
                }

                // Check update for Additional Comments
                if (getLocal('AdditionalCommentsTextBox') == "1") {
                    if (!IsStringNullOrEmpty(stepData[i].AdditionalComments) || !IsStringNullOrEmpty($.trim($("#" + step + "textarea").val())) &&
                     stepData[i].AdditionalComments != $.trim($("#" + step + "textarea").val())) {
                        executeUpdate = true;
                        ////additionalCommentUpdate = true;
                    }
                }
                index = i;
            }
        }

        if (executeUpdate) {
            if (navigator.onLine) {
                if (additionalCommentUpdate) {
                    $("#addComments" + step + "spinner").show();
                } else {
                    $("#step" + step + "spinner").show();
                }

                setLocal("RequestedAction", "UpdateSteps");
            }

            var jsondata = iMFMJsonObject({
                RequestedAction: "UpdateSteps",
                WONumber: $.trim(getLocal("WorkOrderNumber")),
                StepID: step,
                DateModified: $.trim(getLocal("DateModified")),
                DataValueInt: null,
                DataValueStr: '',
                DataValueBit: null,
                DataValueDate: null,
                DataValueDecimal: null,
                AdditionalComments: $.trim($("#" + step + "textarea").val()),
                AdditionalCommentUpdate: additionalCommentUpdate,
                GPSLocation: GlobalLat + "," + GlobalLong
            });

            if (!isComment) {



                // Add the DataValue fields
                switch ($.trim($("#step" + step + "DataType").val().toLowerCase())) {
                    case "string":
                        jsondata["DataValueStr"] = $.trim($("#step" + step).val());
                        break;
                    case "integer":
                        jsondata["DataValueInt"] = $.trim($("#step" + step).val());
                        break;
                    case "date":
                        jsondata["DataValueDate"] = $.trim($("#step" + step).val());
                        break;
                    case "yes/no":
                    case "yes/no/n/a":
                        if ($.trim($("#step" + step).val()) == 0) {
                            jsondata["DataValueBit"] = false;
                            jsondata["DataValueStr"] = $.trim($("#step" + step + " option:selected").text());
                        }

                        if ($.trim($("#step" + step).val()) == 1) {
                            jsondata["DataValueBit"] = true;
                            jsondata["DataValueStr"] = $.trim($("#step" + step + " option:selected").text());
                        }

                        if ($.trim($("#step" + step).val()) == "N/A") {
                            jsondata["DataValueBit"] = null;
                            jsondata["DataValueStr"] = $.trim($("#step" + step + " option:selected").text());
                        }

                        break;
                    case "decimal":
                        jsondata["DataValueDecimal"] = $.trim($("#step" + step).val());
                        break;
                }
            }

            jsondata["AdditionalComments"] = $.trim($("#" + step + "textarea").val());

            // If we're online, go ahead and try to update right now.  Otherwise we'll queue an update.
            if (navigator.onLine) {
                CheckPendingActions(jsondata, function (jsonResult) {
                    // The step ID from the transaction is being returned in the PdaSearch parameter
                    // because it can become desynced due to this being an async callback.
                    var stepID = jsonResult.PdaSearch;

                    if (additionalCommentUpdate) {
                        $("#addComments" + step + "spinner").hide();
                    } else {
                        $("#step" + stepID + "spinner").hide();
                    }


                    if (jsonResult.Result == true || jsonResult.Result == "true") {
                        if (additionalCommentUpdate) {
                            $("#addCom" + step + "updateSuccess").show();
                        } else {
                            $("#step" + stepID + "updateSuccess").show();
                        }

                        if (!isComment) {
                            $("#step" + stepID + "Status").text(GetTranslatedValue("CompletedValue"));
                        }

                        for (var i = 0; i < stepData.length; i++) {
                            if (stepData[i].StepID == stepID) {
                                stepData[i].Status = 'Complete';
                                stepData[i].DataValueBit = jsondata["DataValueBit"];
                                stepData[i].DataValueStr = jsondata["DataValueStr"];
                                stepData[i].DataValueInt = jsondata["DataValueInt"];
                                stepData[i].DataValueDate = jsondata["DataValueDate"];
                                stepData[i].DataValueDecimal = jsondata["DataValueDecimal"];
                                stepData[i].AdditionalComments = jsondata["AdditionalComments"];
                            }
                        }
                    }
                    else {
                        //showError(jsonResult.Data);
                        if (additionalCommentUpdate) {
                            $("#addCom" + step + "updateFail").show();
                            $("#addCom" + step + "updateFail").click(showError(jsonResult.Data));
                        } else {
                            $("#step" + stepID + "updateFail").show();
                            $("#step" + stepID + "updateFail").click(showError(jsonResult.Data));
                        }

                    }

                    $("#step" + stepID).removeAttr("data-handled");
                });
            }
            else {
                StoreActionLocal(jsondata);
                if (additionalCommentUpdate) {
                    $("#addCom" + step + "updateSuccess").show();
                } else {
                    $("#step" + step + "updateSuccess").show();
                }

                $("#step" + step).removeAttr("data-handled");
            }
        } else {
            $("#step" + step).removeAttr("data-handled");
        }
    }
}

// This function will queue an update to the selected attibute.
function updateAttributes(attribute) {

    $("#attr" + attribute + "updateSuccess").hide();
    $("#attr" + attribute + "updateFail").hide();

    // Validate before updating
    var executeUpdate = true;
    var dataType = $.trim($("#attr" + attribute + "DataType").val().toLowerCase());
    var attributeValue = $.trim($("#attr" + attribute).val());

    for (i = 0; i < stepData.length; i++) {
        if (stepData[i].MasterID == attribute) {
            if (attributeValue.length === 0) {
                executeUpdate = false;
            }

            switch (dataType.toLowerCase()) {
                case "string":
                    if (stepData[i].ValueString == attributeValue) {
                        executeUpdate = false;
                    }
                    break;
                case "integer":
                    if (stepData[i].ValueInt == attributeValue) {
                        executeUpdate = false;
                    }
                    break;
                case "date":
                    if (stepData[i].ValueDate == attributeValue) {
                        executeUpdate = false;
                    }
                    break;
                case "decimal":
                    if (stepData[i].ValueNum == attributeValue) {
                        executeUpdate = false;
                    }
                    break;
            }

            // Check MaxVal/MinVal validation.
            if (dataType.toLowerCase() == "integer") {
                if ((attributeValue > stepData[i].MaximumValue) || (attributeValue < stepData[i].MinimumValue)) {
                    var HTError = GetTranslatedValue('InvalidValue').replace("[MIN]", stepData[i].MinimumValue).replace("[MAX]", stepData[i].MaximumValue);
                    executeUpdate = false;
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateFail").show();
                    $("#attr" + attribute + "updateFail").click(showError(HTError));
                }
            }
            else if (dataType.toLowerCase() == "decimal") {
                if ((attributeValue > stepData[i].MaximumValueNum) || (attributeValue < stepData[i].MinimumValueNum)) {
                    var HTError = GetTranslatedValue('InvalidValue').replace("[MIN]", stepData[i].MinimumValueNum).replace("[MAX]", stepData[i].MaximumValueNum);
                    executeUpdate = false;
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateFail").show();
                    $("#attr" + attribute + "updateFail").click(showError(HTError));
                }
            }
            else if (dataType.toLowerCase() == "date") {
                if ((attributeValue > stepData[i].MaximumValueDate) || (attributeValue < stepData[i].MinimumValueDate)) {
                    var HTError = GetTranslatedValue('InvalidValue').replace("[MIN]", GetDateText(GetDateObjectFromInvariantDateString(stepData[i].MinimumValueDate))).replace("[MAX]", GetDateText(GetDateObjectFromInvariantDateString(stepData[i].MaximumValueDate)));
                    executeUpdate = false;
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateFail").show();
                    $("#attr" + attribute + "updateFail").click(showError(HTError));
                }
            }
            else if (dataType.toLowerCase() == "string") {
                if (attributeValue.length > stepData[i].MaximumLength) {
                    var HTError = GetTranslatedValue('InvalidLength').replace("[LEN]", attributeValue.length).replace("[MAX]", stepData[i].MaximumLength);
                    executeUpdate = false;
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateFail").show();
                    $("#attr" + attribute + "updateFail").click(showError(HTError));
                }
            }
        }
    }

    if (executeUpdate) {
        if (navigator.onLine) {
            $("#attr" + attribute + "spinner").show();
            setLocal("RequestedAction", "UpdateAttribute");
        }

        var jsondata = iMFMJsonObject({
            TagNumber: $.trim(getLocal("TagNumber")),
            MasterID: attribute,
            DataType: $.trim($("#attr" + attribute + "DataType").val()),
            ValueInt: 0,
            ValueString: null,
            ValueBit: false,
            ValueDate: null,
            ValueNum: 0,
            GPSLocation: GlobalLat + "," + GlobalLong
        });

        // Add the DataValue fields
        switch ($.trim($("#attr" + attribute + "DataType").val().toLowerCase())) {
            case "string":
                jsondata["ValueString"] = attributeValue;
                break;
            case "integer":
                jsondata["ValueInt"] = attributeValue;
                break;
            case "date":
                jsondata["ValueDate"] = attributeValue;
                break;
            case "yes/no":
                if (attributeValue == 0) {
                    jsondata["ValueBit"] = false;
                }

                if (attributeValue == 1) {
                    jsondata["ValueBit"] = true;
                }

                break;
            case "decimal":
                jsondata["ValueNum"] = attributeValue;
                break;
        }


        var attributeDetailsURL = standardAddress + "AssetManager.ashx?method=UpdateAttribute";
        // If we're online, go ahead and try to update right now.  Otherwise we'll queue an update.
        if (navigator.onLine) {
            $.postJSON(attributeDetailsURL, jsondata, function (jsonResult) {
                var HTYes = GetCommonTranslatedValue("YesLabel");
                var HTNo = GetCommonTranslatedValue("NoLabel");

                if (jsonResult.Result == true || jsonResult.Result == "true") {
                    var dataType = jsonResult.Data.DataType.toLowerCase();
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateSuccess").show();

                    switch (dataType) {
                        case "date":
                            var valueDate = GetDateText(GetDateObjectFromInvariantDateString(jsonResult.Data.ValueDate));
                            $("#attr" + attribute + "CurrentValue").text(" - " + valueDate);
                            $("#attr" + attribute).val("");
                            break;
                        case "string":
                            $("#attr" + attribute + "CurrentValue").text(" - " + jsonResult.Data.ValueString);
                            $("#attr" + attribute).val("");
                            break;
                        case "integer":
                            $("#attr" + attribute + "CurrentValue").text(" - " + jsonResult.Data.ValueInt);
                            $("#attr" + attribute).val("");
                            break;
                        case "yes/no":
                            $("#attr" + attribute + "CurrentValue").text(" - " + (jsonResult.Data.ValueBit ? HTYes : HTNo));
                            $("#attr" + attribute).val("-1");
                            break;
                        case "decimal":
                            $("#attr" + attribute + "CurrentValue").text(" - " + jsonResult.Data.ValueNum);
                            $("#attr" + attribute).val("");
                            break;
                    }

                    $("#attr" + attribute + "CurrentValue").attr("style", "display:inline");
                }
                else {
                    //showError(jsonResult.Data);
                    $("#attr" + attribute + "spinner").hide();
                    $("#attr" + attribute + "updateFail").show();
                    $("#attr" + attribute + "updateFail").click(showError(jsonResult.Data));
                }
            });
        }
        else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            $("#attr" + attribute + "updateFail").show();
        }
    }
}

// Set the common page translations based on the called form.
function StepPage_TranslationsCompleted() {
    var pageID = $.mobile.activePage.attr("id");

    if (getLocal("RequestedAction") == "Attributes") {
        $("#StepsWONum").text(GetTranslatedValue("StepsTagNum"));
        $("#NoStepsLabel").text(GetTranslatedValue("NoAttributesLabel"));
    }
}

/**
* This function displays the loading image to identify to the user that 
* the device is still processing.
* @param [bit] status - The status that we are updating the display to.
*/
Steps.DisplayLoading = function (status) {
    if (status == true) {
        $("#moreButton img#moreLoading").show();
    } else {
        $("#moreButton img#moreLoading").hide();
    }
}

/**
* This function prepares the input params and url for ajax request
* to populate the pre-start job steps for a given work order.
* @param [int] pageNumber - The expected page of results to get.
*/
Steps.PreparePreStartSteps = function (pageNumber) {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "WorkOrderNumber": getLocal("WorkOrderNumber"),
        "PageNumber": pageNumber,
        "RecordsPerPage": getLocal("RecordsPerPage"),
        "Mode": 1
    });
    var stepDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=GetNextStepList";

    // Get the steps, then bind them and apply them to the entity.
    Steps.GetPreStartSteps(stepDetailsURL, myJSONobject)
        .then(Steps.BindPreStartSteps)
        .then(
              function (stepHTML) {
                  $('form[data-action="prestart"]').find("div.ui-collapsible-set").append(stepHTML).collapsibleset("refresh");

                  // Remove more button if it exists, because we want to make sure it's not in the middle of list.
                  $('form[data-action="prestart"]').find("#moreButton").remove();

                  // Add the count to the header and then add the More button if necessary.
                  $("#PreStartCount").text($('form[data-action="prestart"]').find("div.ui-collapsible").length + "/" + getLocal("TotalRecords"));
                  if ($('form[data-action="prestart"]').find("div.ui-collapsible").length < parseInt(getLocal("TotalRecords"))) {
                      var stepDiv = '<div id="moreButton" data-role="collapsible" data-theme="c" class="ui-collapsible ui-collapsible-collapsed">' +
                          '<h4 class="ui-collapsible-heading ui-collapsible-heading-collapsed"><a href="#" class="ui-collapsible-heading-toggle' +
                          ' ui-btn ui-btn-up-c" data-corners="false" data-shadow="false" data-wrapperrels="span" data-theme="c" onclick=' +
                          '"Steps.DisplayLoading(true);Steps.PreparePreStartSteps(' + (pageNumber + 1) + ');"><span ' +
                          'class="ui-btn-inner" style="text-align:center" ><span class="ui-btn-text">' + GetTranslatedValue("PreStartLoadMore") +
                          '<img id="moreLoading" class="img-ajaxloader-inline" ' +
                          ' alt="Updating..." style="display:none;"/></span></span></a></h4></div>';
                      $('form[data-action="prestart"]').find("div.ui-collapsible-set").append(stepDiv);
                  }

                  $('form[data-action="prestart"]').find("div.ui-collapsible-set").collapsibleset("refresh");
              },
              function (error) {
                  if ((getLocal("PreStartPending") == 0 || getLocal("PreStartPending") == "false") || (navigator.onLine && error.toLowerCase().trim() == "no steps")) {
                      ConfigureStart();
                  } else {
                      setTimeout(showError(error), 500);
                  }
              });
}

/**
* Fetch and populate the Pre-Start job steps with user information.
* @param [string] url - The url for the ajax request.
* @param [object] params - This contains the input params for the ajax call.
* @returns [Deferred] - The status of the fetch process with the results from the ajax call.
*/
Steps.GetPreStartSteps = function (url, params) {
    var fetchStatus = $.Deferred();

    if (navigator.onLine) {
        $.postJSON(url, params, function (fetchResults) {
            try {
                if (fetchResults.length > 0) {
                    fetchStatus.resolve(fetchResults);
                } else {
                    fetchStatus.resolve();
                }
            } catch (ex) {
                fetchStatus.reject(ex);
            }
        });
    } else {
        fetchStatus.reject(GetCommonTranslatedValue("NoNetworkCommon"))
    }

    return fetchStatus.promise();
}

/**
* Fetch and populate the Pre-Start job steps with user information.
* @param [array] stepArray - The list of all the entities which we're generating HTML for.
* @returns [Deferred] - The HTML of the items we're adding.
*/
Steps.BindPreStartSteps = function (stepArray) {
    var fetchStatus = $.Deferred();

    if (!IsObjectNullOrUndefined(stepArray)) {
        // Iterate through the array
        var stepHTML = "";
        for (var i = 0; i < stepArray.length; i++) {
            d = stepArray[i];

            stepHTML = stepHTML + Steps.GenerateStepCode(d);
        }

        fetchStatus.resolve(stepHTML);
    } else {
        fetchStatus.reject("No Steps");
    }

    return fetchStatus.promise();
}

/**
* Generate the HTML for the step item.
* @param [object] step - This is the object which we're generating HTML for.
* @return [string] - The HTML representation of the step object.
*/
Steps.GenerateStepCode = function (step) {
    var HTSelect = GetCommonTranslatedValue("SelectLabel");
    var HTYes = GetCommonTranslatedValue("YesLabel");
    var HTNo = GetCommonTranslatedValue("NoLabel");
    // Sanitize the data for display
    if (IsStringNullOrEmpty(step.Prompt)) {
        step.Prompt = '';
    }

    if (IsStringNullOrEmpty(step.Label)) {
        step.Label = '&lt;' + GetTranslatedValue("PreStartNoLabel") + '&gt;';
    }

    // Create the collapsible entity to contain the entire step code.
    var stepDiv = document.createElement('div');
    stepDiv.setAttribute("data-role", "collapsible");
    stepDiv.setAttribute("data-theme", "c");

    // The div will contain two entities, header and ul.
    var h4 = document.createElement('h4');
    h4.setAttribute("id", step.StepID + "header");
    h4.setAttribute('class', 'ui-prestart-header');
    h4.innerHTML = step.Label + '<img id="' + step.StepID + 'value" />';
    //stepDiv.appendChild(h4);

    var ultag = document.createElement('ul');
    ultag.setAttribute("class", "ui-listview");
    ultag.setAttribute("data-role", "listview");

    // This var contains the contents of the UL tag.
    var appending = '<li style="padding:.7em 15px" ><p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>'
    + step.Prompt + '</strong></p>';
    appending = appending + '<input type="hidden" id="step' + step.StepID + 'DataType" value = "' + step.DataType
    + '"/><select name="' + step.StepID + '" id="' + step.StepID + '"';
    appending = appending + ' onfocusout="Steps.UpdateHeader(' + step.StepID + ')">';

    // Create the dropdown list based on the type of the step. Strings use the JobStepDropDown list
    switch (step.DataType.toLowerCase()) {
        case "yes/no":
            var options = '<option value="-1">' + HTSelect + '</option>' +
            '<option value="1">' + HTYes + '</option>' +
            '<option value="0">' + HTNo + '</option></select>';

            // Append the options and close tag.
            appending += options + '</li>';
            break;
        default:
            // Generate the options based on the company default value.
            var listItems = getLocal("JobStepsPickList").split(';');
            var options = '<option value="-1">' + HTSelect + '</option>';

            for (i = 0; i < listItems.length; i++) {
                // Replace both by using global regex.
                options = options + '<option value="LISTITEM">LISTITEM</option>'.replace(/LISTITEM/g, listItems[i]);
            }

            appending += options + '</li>';
            break;
    }

    ultag.innerHTML = ultag.innerHTML + appending;
    stepDiv.appendChild(h4);
    stepDiv.appendChild(ultag);
    setLocal("TotalRecords", step.TotalRecords);

    return stepDiv.outerHTML;
}

/**
* This will iterate through a given set of pre-start steps and reset the 
* values to not selected (-1)
*/
Steps.ResetPreStartSteps = function () {
    $('form[data-action="prestart"]').find("li select").each(function () {
        $(this).val(-1);
        // Do this to trigger the onchange event to reset the images?
        $(this).trigger("focusout");
    });
}

/**
* This function will update the header to show the user that a value 
* has been provided for the given stepID.
* @param [int] stepID - The step identifier that we are updating.
*/
Steps.UpdateHeader = function (stepID) {
    var stepValue = $("#" + stepID).val();

    // Reset the header
    $("#" + stepID + "value").removeAttr('class');
    $("#" + stepID + "value").text('   ');

    // Update the header
    if (stepValue != -1) {
        if (stepValue == 1 || stepValue.toLowerCase() == "yes") {
            $("#" + stepID + "value").attr('class', 'img-approve-left ui-icon ui-btn-icon-right');
        } else if (stepValue == 0 || stepValue.toLowerCase() == "no") {
            $("#" + stepID + "value").attr('class', 'img-reject-left ui-icon ui-btn-icon-right');
        } else if (stepValue.toLowerCase() == "n/a") {
            $("#" + stepID + "value").attr('class', 'img-notapplicable-left ui-icon ui-btn-icon-right');
        } else {
            $("#" + stepID + "value").text(" - " + stepValue);
        }
    }
}

/**
* Verify the pre-start steps are ready for submission and then submit the 
* transaction.
*/
Steps.ValidatePreStartSteps = function () {
    var stepCount = $("#PreStartCount").text().split("/");
    var steps = $('form[data-action="prestart"]').serializeArray();

    try {
        // Validate that all of the steps are displayed, if not, load more.
        if (stepCount[0] != stepCount[1]) {
            $('form[data-action="prestart"]').find("#moreButton a").click();
        } else {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i].value == "-1") {
                    // The form is not completely filled in, reject and fail.
                    showError(GetTranslatedValue("PreStartStepsRequired"));
                    return false;
                }
            }

            // Prepare the ajax call
            var myJSONobject = iMFMJsonObject({
                "Username": decryptStr(getLocal("Username")),
                "GPSLocation": GlobalLat + "," + GlobalLong,
                "WorkOrderNumber": getLocal("WorkOrderNumber"),
                "Steps": JSON.stringify(steps)
            });
            var preStartURL = standardAddress + "WorkOrderActions.ashx?methodname=PreStartSteps";

            showActionPopupLoading();
            Steps.SubmitPreStartSteps(myJSONobject, preStartURL)
            .then(function (results) {
                if (results.Result == false) {
                    // handle errors here.
                    if (results.Data.toLowerCase() != "unknownemail" || results.Data.toLowerCase() != "remove") {
                        // This isn't an "error" case, but the success case for reassigning and holding the order.
                        // Return the user to the previous place and remove the order from the user's offline DB.
                        RemoveWorkOrderFromDetailsTable(getLocal("WorkOrderNumber"));
                        navigateToPreviousPage();
                    } else if (results.Data.toLowerCase() == "unknownsupervisor") {
                        // This case will occur when the supervisor was unknown, so just put the order on hold.
                        UpDateWorkOrderDetailsTable(IsStringNullOrEmpty(getLocal("HoldStatus")) ? "DHD" : getLocal("HoldStatus"));
                        navigateToPreviousPage();
                    } else {
                        //GetTranslatedValue("PreStartError")
                        showError(results.Data);
                    }
                } else {
                    ConfigureStart();
                }

                closeActionPopupLoading();
            });
            //.then( closeActionPopupLoading());
        }
    } catch (ex) {
        showError(GetTranslatedValue("PreStartError")); // "An error occurred. Please try again."
    }
}

/**
* Submit the json object to the specified URL to complete PreStart steps.
* @param [object] jsonObject - The object of input params for the request.
* @param [string] ajaxURL - The URL for the request.
* @returns [object] The status of the transaction.
*/
Steps.SubmitPreStartSteps = function (jsonObject, ajaxURL) {
    var transactionStatus = $.Deferred();

    if (navigator.onLine) {
        $.postActionJSON(ajaxURL, jsonObject, function (data) {
            setLocal("DateModified", data.DateModified);
            transactionStatus.resolve(data);
        });
    } else {
        transactionStatus.reject(GetCommonTranslatedValue("NoNetworkCommon"));
    }

    return transactionStatus.promise();
}

/**
*  Navigate to Create Work Order for Dispatch screen. 
*/
Steps.NavigateToCreateWOD = function () {
    MasterID = "400006";
    ScreenName = "Create Work Order for Dispatch";
    setLocal("ScreenName", ScreenName);
    //setLocal("PreviousScreen", $.mobile.activePage.attr('id'));

    if (getLocal("SgtCollection") != "null" && getLocal("SgtCollection") != null) {
        $.mobile.changePage("CreateWOD.html");
    }
    else {
        pageID = $.mobile.activePage.attr("id");
        $("#" + pageID + "navigationPanel").panel("close");
        ////showError("Please sync the data completely, to navigate to this screen.");
        showError(GetCommonTranslatedValue("SyncCompletely"));
    }
    //$.mobile.changePage('CreateWOD.html');
}