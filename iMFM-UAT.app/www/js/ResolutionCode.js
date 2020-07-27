// X706262 - Resolution Code
function CheckSecurityForResolutionCode(SgtCollection) {
    var pageID = '#' + $.mobile.activePage.attr('id');
    switch (pageID) {
        case "#CreateWOC":
            // Hide or show Group sub group labels
            if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "RCGroup", "CanAccess")) {
                $(pageID).find("#RCGroupDiv").hide();
            }
            if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "RCSubGroup", "CanAccess")) {
                $(pageID).find("#RCSubGroupDiv").hide();
            }

            // Required Check on Resolution code dd.
            var resCodeFlag = $.GetSecuritySubTokensBit(SgtCollection, 0, "ResolutionCode", "Required");

            if (resCodeFlag == true) {
                // Rule - Override Read only.
                $(pageID + ' #ResolutionCodeRequiredFieldLabel').show();
                $(pageID + ' #ResolutionCodeDD').attr("Requried", "true");
                //                $(pageID + ' #ResolutionCodeDD').removeClass('ui-disabled');
                $(pageID + " #ResolutionCodeDD").parent().removeClass('ui-disabled');
            }
            else {
                $(pageID + ' #ResolutionCodeRequiredFieldLabel').hide();
                if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "ResolutionCode", "ReadOnly")) {
                    //                    $(pageID + ' #ResolutionCodeDD').addClass('ui-disabled');
                    $(pageID + " #ResolutionCodeDD").parent().addClass('ui-disabled');
                }
            }
            break;
        case "#ActionsPopup":
            // If selected action is complete.
            switch (getLocal("RequestedAction")) {
                case "Complete":
                    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Complete_ResolutionCode", "CanAccess")) {
                        $(pageID).find("#ResolutionCodeUI").hide();
                    }
                    else {
                        // Explicitly show up the Resolution code div. 
                        $(pageID).find("#ResolutionCodeUI").show();
                        // Hide or show Group sub group labels
                        if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Complete_RCGroup", "CanAccess")) {
                            $(pageID).find("#RCGroupDiv").hide();
                        }
                        if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Complete_RCSubGroup", "CanAccess")) {
                            $(pageID).find("#RCSubGroupDiv").hide();
                        }

                        // Required Check on Resolution code dd.
                        if ($.GetSecuritySubTokensBit(SgtCollection, 0, "Complete_ResolutionCode", "Required")) {
                            // Rule - Override Read only.
                            $(pageID + ' #ResolutionCodeRequiredFieldLabel').show();
                            $(pageID + ' #ResolutionCodeDD').attr("Requried", "true");
                            $(pageID).find("#ResolutionCodeDD").prop('disabled', false);
                            //  $(pageID + ' #ResolutionCodeDD').removeClass('ui-disabled');
                            $("#ResolutionCodeDD").parent().removeClass('ui-disabled');
                        }
                        else {
                            $(pageID + ' #ResolutionCodeRequiredFieldLabel').hide();
                            if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Complete_ResolutionCode", "ReadOnly")) {
                                // $(pageID + ' #ResolutionCodeDD').addClass('ui-disabled');
                                //   $(pageID).find("#ResolutionCodeUI").addClass('ui-disabled');
                                $("#ResolutionCodeDD").parent().addClass('ui-disabled');
                            }
                        }

                        BindResolutionCodeDD();
                    }
                    break;
                case "Stop":
                    var stopToggleValue = $.trim($('#stopToggleDropDown').val());
                    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Stop_ResolutionCode", "CanAccess")) {
                        $(pageID).find("#ResolutionCodeUI").hide();
                    }
                    else {
                        // Explicitly show up the Resolution code div. 
                        $(pageID).find("#ResolutionCodeUI").show();
                        // Hide or show Group sub group labels
                        if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Stop_RCGroup", "CanAccess")) {
                            $(pageID).find("#RCGroupDiv").hide();
                        }
                        if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Stop_RCSubGroup", "CanAccess")) {
                            $(pageID).find("#RCSubGroupDiv").hide();
                        }

                        // Required Check on Resolution code dd.
                        if ($.GetSecuritySubTokensBit(SgtCollection, 0, "Stop_ResolutionCode", "Required")) {
                            // Rule - Override Read only.
                            $(pageID + ' #ResolutionCodeRequiredFieldLabel').show();
                            $(pageID + ' #ResolutionCodeDD').attr("Requried", "true");
                            $("#ResolutionCodeDD").parent().removeClass('ui-disabled');
                        }
                        else {
                            $(pageID + ' #ResolutionCodeRequiredFieldLabel').hide();
                            if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "Stop_ResolutionCode", "ReadOnly")) {
                                $("#ResolutionCodeDD").parent().addClass('ui-disabled');
                            }
                        }

                        BindResolutionCodeDD();
                    }
                    break;
            }
            // If selected action is Stop.
            break;
    }
}

//==== Populate ProblemCodeDD====

function BindResolutionCodeDD() {
    var pageID = '#' + $.mobile.activePage.attr('id');
    ////First clear the Necessary fields.
    ////pageID = "#" + $.mobile.activePage.attr("id");
    ResetRCGroupSubGroupProblemDescTextArea();
    $(pageID + " #ResolutionCodeDD option:gt(0)").remove();
    $(pageID + " #ResolutionCodeDD").selectmenu("refresh", true);
    // Check company default to see if we need to filter CD. 7 for full list of codes, 9 for filtered.

    if (pageID == '#CreateWOC') {
        // For create Completed WO, there is not WO# yet, so have to grab the Group and Sub Group from PC. 
        if ($(pageID + " #problemCodeDD option:selected").val() != "-1") {
            GetDataFromLocalDB("11");
        }
    }
    else {
        if (getLocal("WOClose_ResCodeFilterByGroup") == 0) {
            GetDataFromLocalDB("7");
        } else if (getLocal("WOClose_ResCodeFilterByGroup") == 1) {
            GetDataFromLocalDB("9");
        } else if (getLocal("WOClose_ResCodeFilterByGroup") == 2) {
            GetDataFromLocalDB("10");
        }
    }
}

//====Success callback for getting ResolutionCode details from Local DB====
function SetResolutionCodeLocally(tx, results) {
    var ResolutionCodeArray = [];
    var i = 0;
    for (i = 0; i < results.rows.length; i++) {
        //Dynamically creating object with key value properties.
        var obj = {};
        obj.Key = decryptStr(results.rows.item(i).RCDescription);
        obj.Value = results.rows.item(i).ResolutionCodeNumber;
        ResolutionCodeArray[i] = obj;
    }

    PopulateResolutionCodeDD(ResolutionCodeArray);
}

//====Bind ResolutionCode DropDown====
function PopulateResolutionCodeDD(result) {
    var tag;
    var pageID = '#' + $.mobile.activePage.attr('id');
    $(pageID + " #ResolutionCodeDD option:gt(0)").remove();
    $(pageID + " #ResolutionCodeDD").selectmenu("refresh", true);

    if (result.length === 0) {
        tag = document.createElement('option');
        tag.setAttribute("value", "-2");
        tag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
        $(pageID + " #ResolutionCodeDD").append(tag);
        $(pageID + " #ResolutionCodeDD").val("-2");
        $(pageID + " #ResolutionCodeDD").selectmenu("refresh", true);
        return;
    }
    else if (result.length == 1) {
        $(pageID).find("#ResolutionCodeDD").html('<option value="-1">' + GetTranslatedValue("ResolutionCodeDDSelectLabel") + '</option>').selectmenu("refresh");

        tag = document.createElement('option');
        tag.setAttribute("value", result[0].Value);
        tag.innerHTML = result[0].Key;
        $(pageID + " #ResolutionCodeDD").append(tag);
        $(pageID + " #ResolutionCodeDD").val(result[0].Value);
        $(pageID + " #ResolutionCodeDD").selectmenu("refresh", true);
        ResetRCGroupSubGroupProblemDescTextArea();
        GetRCGroupSubgroupData();
        return;
    }
    else {
        ////var firstTag = document.createElement('option');
        ////firstTag.setAttribute("value", "-3");
        ////firstTag.innerHTML = "-- [ " + result.length.toString() + " ]" + "Records Found --";
        ////$(pageID + " #ResolutionCodeDD").append(firstTag);
        $(pageID).find("#ResolutionCodeDD").html('<option value="-1">' + GetTranslatedValue("ResolutionCodeDDSelectLabel") + '</option>').selectmenu("refresh");

        var i = 0;
        for (i = 0; i < result.length; i++) {
            tag = document.createElement('option');
            tag.setAttribute("value", result[i].Value);
            tag.innerHTML = result[i].Key;
            $(pageID + " #ResolutionCodeDD").append(tag);
        }
        $(pageID + " #ResolutionCodeDD").selectmenu("refresh", true);
    }
}

//====Reset Group Subgroup ProblemDescription TextArea====
function ResetRCGroupSubGroupProblemDescTextArea() {
    var pageID = '#' + $.mobile.activePage.attr('id');
    $(pageID + " #RCGroupValueLabel").text('');
    $(pageID + " #RCgroupHiddenField").val('');
    $(pageID + " #RCSubGroupValue").text('');
    $(pageID + " #RCsubGroupHiddenField").val('');
}

//====Getting the Group and SubGroup data from entered Problem code text====
function GetRCGroupSubgroupData() {
    var pageID = '#' + $.mobile.activePage.attr('id');
    if ($(pageID + " #ResolutionCodeDD option:selected").val() == "-1") {
        $(pageID + " #ResolutionCodeDD").focus();
        ResetRCGroupSubGroupProblemDescTextArea();
        return;
    }
    var resolutionCodeText = $(pageID + " #ResolutionCodeDD option:selected").text();
    var netStatus = checkNetworkStatus();
    GetDataFromLocalDB("8");
}

//====Success callback for getting Group SubGroup details from Local DB====
function SetRCGroupSubgroupLocally(tx, results) {
    var groupSubgroupArray = [];
    groupSubgroupArray[0] = decryptStr(results.rows.item(0).RCGroupDescription);
    groupSubgroupArray[1] = results.rows.item(0).RCGroupID;
    groupSubgroupArray[2] = results.rows.item(0).RCSubGroupDescription;
    groupSubgroupArray[3] = results.rows.item(0).RCSubGroupId;

    SetRCGroupSubgroupData(groupSubgroupArray);
}

//====Set Group and Sungroup Data====
function SetRCGroupSubgroupData(result) {
    var pageID = '#' + $.mobile.activePage.attr('id');
    $(pageID + " #RCGroupValueLabel").text(result[0]);
    $(pageID + " #RCgroupHiddenField").val(result[1]);
    $(pageID + " #RCSubGroupValue").text(result[2]);
    $(pageID + " #RCsubGroupHiddenField").val(result[3]);
}