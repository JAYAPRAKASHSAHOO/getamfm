$.GetSecuritySubBit = function (mID, tokenID, subtokenDesc, checkBit) {
    var sgtList = JSON.parse(localStorage.SgtCollection);
    var returnCode = false;
    if (sgtList === null) {
        return returnCode;
    }
    for (var i = 0; i < sgtList.length; i++) {
        var thisSgt = sgtList[i];
        if ((thisSgt.MasterID == mID) && (thisSgt.TokenID == tokenID)) {
            var thisSgst = thisSgt.SgstCollection;
            for (var j = 0; j < thisSgst.length; j++) {
                var subtoken = thisSgst[j];
                if (subtoken.SubTokenDescription == subtokenDesc) {
                    returnCode = (checkBit == "CanAccess" && subtoken.CanAccess == 1) ? true : returnCode;
                    returnCode = (checkBit == "CreateNew" && subtoken.CreateNew == 1) ? true : returnCode;
                    returnCode = (checkBit == "ReadOnly" && subtoken.ReadOnly == 1) ? true : returnCode;
                    returnCode = (checkBit == "Required" && subtoken.Required == 1) ? true : returnCode;
                    break;
                }
            }
        }
    }
    return returnCode;
};


$.GetSecuritySubTokens = function (mID, tokenID) {
    try {
        var sgtList = JSON.parse(localStorage.SgtCollection);
        for (var i = 0; i < sgtList.length; i++) {
            if (sgtList[i].MasterID == mID && sgtList[i].TokenID == tokenID) {
                return (sgtList[i]);
            }
        }
    }
    catch (e) {
    }
};


$.GetSecuritySubTokensBit = function (thisSgt, tokenID, subtokenDesc, checkBit) {
    var thisSgst = thisSgt.SgstCollection;
    var returnCode = false;
    for (var j = 0; j < thisSgst.length; j++) {
        var subtoken = thisSgst[j];
        if (subtoken.SubTokenDescription == subtokenDesc) {
            returnCode = (checkBit == "CanAccess" && subtoken.CanAccess == 1) ? true : returnCode;
            returnCode = (checkBit == "CreateNew" && subtoken.CreateNew == 1) ? true : returnCode;
            returnCode = (checkBit == "ReadOnly" && subtoken.ReadOnly == 1) ? true : returnCode;
            returnCode = (checkBit == "Required" && subtoken.Required == 1) ? true : returnCode;
            break;
        }
    }
    return returnCode;
};

$.GetSecurityAccessList = function (mID, tokenID, checkBit) {
    var returnList = [];
    var sgtList = JSON.parse(localStorage.SgtCollection);
    for (var i = 0; i < sgtList.length; i++) {
        if (sgtList[i].MasterID == mID && sgtList[i].TokenID == tokenID) {
            var thisSgst = sgtList[i].SgstCollection;
            for (var j = 0; j < thisSgst.length; j++) {
                var subtoken = thisSgst[j];
                if (((checkBit == "CanAccess" && subtoken.CanAccess == 1) || (checkBit == "CreateNew" && subtoken.CreateNew == 1) || (checkBit == "ReadOnly" && subtoken.ReadOnly == 1) || (checkBit == "Required" && subtoken.Required == 1))) {
                    returnList.push(subtoken.SubTokenDescription);
                }
            }
        }
    }
    return returnList;
};

$.BindAssignmentDropDown = function (mID, tokenID, checkBit) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var sgtList = JSON.parse(localStorage.SgtCollection);
    $(pageID).find("#ddlAssignmentType").html('<option value="-1">' + GetCommonTranslatedValue("SelectLabel") + '</option>');
    for (var i = 0; i < sgtList.length; i++) {
        if (sgtList[i].MasterID == mID && sgtList[i].TokenID == tokenID) {
            var thisSgst = sgtList[i].SgstCollection;
            for (var j = 0; j < thisSgst.length; j++) {
                var subtoken = thisSgst[j];
                if (((checkBit == "CanAccess" && subtoken.CanAccess == 1) || (checkBit == "CreateNew" && subtoken.CreateNew == 1) || (checkBit == "ReadOnly" && subtoken.ReadOnly == 1) || (checkBit == "Required" && subtoken.Required == 1))) {
                    var option = '<option value ="' + subtoken.SubTokenDescription + '">' + GetTranslatedValue(subtoken.SubTokenDescription) + '</option>';
                    $(pageID).find("#ddlAssignmentType").append(option);
                }
            }
        }
    }
    $(pageID).find("#ddlAssignmentType").selectmenu("refresh");
    $(pageID).find("#ddlAssignment").html('<option value="-1">' + GetCommonTranslatedValue("SelectLabel") + '</option>');
    $(pageID).find("#ddlAssignment").selectmenu("refresh");
    $(pageID).find("#ddlAssignment").selectmenu("disable");
};

$.GetOnlineSecuritySubTokens = function (mID, tokenID,functionname) {
    try {        
        var myJSONobject = {
            DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
            Language: localStorage.getItem("Language"),
            Username: decryptStr(localStorage.getItem("Username")),
            EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),            
            MasterID: mID,
            TokenID: tokenID,
            SessionID: decryptStr(getLocal("SessionID"))
        };
        var accessURL = standardAddress + "Dashboard.ashx?methodname=GetSecuritySubGroupToken";
        $.postJSON(accessURL, myJSONobject, functionname);
    }
    catch (e) {
    }
};

$.GetOnlineSecuritySubTokensBit = function (thisSgst, tokenID, subtokenDesc, checkBit) {
    var returnCode = false;
    for (var j = 0; j < thisSgst.length; j++) {
        var subtoken = thisSgst[j];
        if (subtoken.SubTokenDescription == subtokenDesc) {
            returnCode = (checkBit == "CanAccess" && subtoken.CanAccess == 1) ? true : returnCode;
            returnCode = (checkBit == "CreateNew" && subtoken.CreateNew == 1) ? true : returnCode;
            returnCode = (checkBit == "ReadOnly" && subtoken.ReadOnly == 1) ? true : returnCode;
            returnCode = (checkBit == "Required" && subtoken.Required == 1) ? true : returnCode;
            break;
        }
    }
    return returnCode;
};

// Function will search for div with the data-field equal to the security token and enforce tokens based on structure within
// that div.
function EnforceFieldSecurity(SgtCollection, tokenName, sysRequired) {
    // Sys required will override token checks, otherwise this will look for a div with the
    // data-field attribute of the security token name and update the fields appropriately based on tokens.
    if (sysRequired) {
        $('[data-field="' + tokenName + '"] .js-sToken').attr("data-requried", "true");
    } else {
        if ($.GetSecuritySubTokensBit(SgtCollection, 0, tokenName, "CanAccess")) {
            $('[data-field="' + tokenName + '"]').show();

            if ($.GetSecuritySubTokensBit(SgtCollection, 0, tokenName, "Required")) {
                $('[data-field="' + tokenName + '"] .mandatory').show();
                $('[data-field="' + tokenName + '"] .js-sToken').removeAttr("readonly");
                $('[data-field="' + tokenName + '"] select.js-sToken').removeAttr("disabled");
                $('[data-field="' + tokenName + '"] .js-sToken').attr("data-requried", "true");
            } else {
                $('[data-field="' + tokenName + '"] .mandatory').hide();
                $('[data-field="' + tokenName + '"] .js-sToken').removeAttr("data-requried");

                if ($.GetSecuritySubTokensBit(SgtCollection, 0, tokenName, "ReadOnly")) {
                    $('[data-field="' + tokenName + '"] .js-sToken').removeAttr("readonly");
                    $('[data-field="' + tokenName + '"] select.js-sToken').removeAttr("disabled");
                } else {
                    $('[data-field="' + tokenName + '"] .js-sToken').attr("readonly", "readonly");
                    $('[data-field="' + tokenName + '"] select.js-sToken').attr("disabled", true);
                    $('[data-field="' + tokenName + '"] a.js-sToken').hide();
                }
            }
        } else {
            $('[data-field="' + tokenName + '"]').hide();
            $('[data-field="' + tokenName + '"] .js-sToken').removeAttr("data-requried");
        }
    }
}