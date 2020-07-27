// get the priority drop down and project type down values
var lowPriority = $.trim($("#priorityLowHiddenValue").val());
var mediumPriority = $.trim($("#priorityMediumHiddenValue").val());
var highPriority = $.trim($("#priorityHighHiddenValue").val());
var projectTypeA = $.trim($("#projectTypeAHiddenValue").val());
var projectTypeB = $.trim($("#projectTypeBHiddenValue").val());
var projectTypeC = $.trim($("#projectTypeCHiddenValue").val());
var capitalProjectTypeVisibility = "";
var renovateVisibility = false;
var clientVisibility = false;
var mandatoryVisibility = false;
var capitalPriorityVisibility = false;
var capitalCommentsVisibility = false;
var fciPriorityVisibility = false;
var fciCommentsVisibility = false;
var operation = "";
var budgetYearVisibility = false;
var statusVisibility = false;
var fciScoreVisibility = false;
var problemCodeVisibility = false;
var budgetYearText = "";
var regionFieldVisibility = false;
var divisionFieldVisibility = false;
var itemVisibility = false;
var capitalReferenceVisibility = false;
var assetFlag = false;
var itemFlag = false;
var CapitalLinkage = false;
var CapitalEquipTag = false;
var CapitalItem = false;
var pageID = "#" + $.mobile.activePage.attr('id');
////var db = openDatabase('iMFMDB', '', null, null);

function InspectionCapitalPageSecurity(SgstCollection) {
    $("#projectDescriptionTextArea").attr("Requried", "true");

    if (capitalProjectTypeVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalProjectTypeDropDownList", "Required")) {
            $("#projectTypeRequiredLabel").show();
            $("#projectTypeDropDown").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalProjectTypeDropDownList", "ReadOnly")) {
                $("#projectTypeRequiredLabel").hide();
                $('#projectTypeDropDown').prop("disabled", false);
            }
            else {
                $("#projectTypeRequiredLabel").hide();
                $('#projectTypeDropDown').prop("disabled", true);
            }
        } // end of else
    } // end of if               

    if (problemCodeVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ProblemCodeTextBox", "Required")) {
            $("#capitalProblemRequiredLabel").show();
            $('#capitalProblemCodeText').removeAttr("readonly");
            $("#capitalProblemCodeDropDown").attr("Requried", "true");
            $('#capitalProblemCodeDropDown').prop("disabled", false);
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "ProblemCodeTextBox", "ReadOnly")) {
                $("#capitalProblemRequiredLabel").hide();
                $('#capitalProblemCodeText').removeAttr("readonly");
                $('#capitalProblemCodeDropDown').prop("disabled", false);
            }
            else {
                $("#capitalProblemRequiredLabel").hide();
                $('#capitalProblemCodeText').attr('readonly', 'readonly');
                $('#capitalProblemCodeDropDown').prop("disabled", true);
            }
        } // end of else                  
    } // end of if

    if (renovateVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "Infra_Or_RenovateTextBox", "Required")) {
            $("#renovateRequiredLabel").show();
            $('#renovateText').removeAttr("readonly");
            $("#renovateText").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "Infra_Or_RenovateTextBox", "ReadOnly")) {
                $("#renovateRequiredLabel").hide();
                $('#renovateText').removeAttr("readonly");
            }
            else {
                $("#renovateRequiredLabel").hide();
                $('#renovateText').attr('readonly', 'readonly');
            }
        } // end of else                    
    } // end of if

    if (clientVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CRE_Or_ClientTextBox", "Required")) {
            $("#clientRequiredLabel").show();
            $('#clientText').removeAttr("readonly");
            $("#clientText").attr("Requried", "true");
        }

        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CRE_Or_ClientTextBox", "ReadOnly")) {
                $("#clientRequiredLabel").hide();
                $('#clientText').removeAttr("readonly");
            }
            else {
                $("#clientRequiredLabel").hide();
                $('#clientText').attr('readonly', 'readonly');
            }
        }  // end of else                   
    } // end of if

    if (capitalPriorityVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalPriorityDropDownList", "Required")) {
            $("#capitalPriorityRequiredLabel").show();
            $("#capitalPriorityDropDown").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalPriorityDropDownList", "ReadOnly")) {
                $("#capitalPriorityRequiredLabel").hide();
                $('#capitalPriorityDropDown').attr("disabled", false);
            }
            else {
                $("#capitalPriorityRequiredLabel").hide();
                $('#capitalPriorityDropDown').attr("disabled", true);
            }
        } // end of else                     
    } // end of if


    if (capitalCommentsVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalCommentsTextBox", "Required")) {
            $("#capitalCommentsRequiredLabel").show();
            $('#capitalCommentsTextArea').removeAttr("readonly");
            $("#capitalCommentsTextArea").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalCommentsTextBox", "ReadOnly")) {
                $("#capitalCommentsRequiredLabel").hide();
                $('#capitalCommentsTextArea').removeAttr("readonly");
            }
            else {
                $("#capitalCommentsRequiredLabel").hide();
                $('#capitalCommentsTextArea').attr('readonly', 'readonly');
            }
        } // end of else                    
    } // end of if

    if (fciScoreVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIScoreDropDownList", "Required")) {
            $("#fciScoreRequiredLabel").show();
            $("#fciScoreDropDown").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIScoreDropDownList", "ReadOnly")) {
                $("#fciScoreRequiredLabel").hide();
                $('#fciScoreDropDown').attr("disabled", false);
            }
            else {
                $("#fciScoreRequiredLabel").hide();
                $('#fciScoreDropDown').attr("disabled", true);
            }
        } // end of else 
    } // end of if


    if (fciPriorityVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIPriorityDropDownList", "Required")) {
            $("#fciPriorityRequiredLabel").show();
            $("#fciPriorityDropDown").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIPriorityDropDownList", "ReadOnly")) {
                $("#fciPriorityRequiredLabel").hide();
                $('#fciPriorityDropDown').attr("disabled", false);
            }
            else {
                $("#fciPriorityRequiredLabel").hide();
                $('#fciPriorityDropDown').attr("disabled", true);
            }
        } // end of else 
    } // end of if


    if (fciCommentsVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIReasonTextBox", "Required")) {
            $("#fciReasonRequiredLabel").show();
            $('#fciReasonTextArea').removeAttr("readonly");
            $("#fciReasonTextArea").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "FCIReasonTextBox", "ReadOnly")) {
                $("#fciReasonRequiredLabel").hide();
                $('#fciReasonTextArea').removeAttr("readonly");
            }
            else {
                $("#fciReasonRequiredLabel").hide();
                $('#fciReasonTextArea').attr('readonly', 'readonly');
            }
        }  // end of else                   
    } // end of if

    if (statusVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalStatusDropDownList", "Required")) {
            $("#capitalStatusRequiredLabel").show();
            $("#capitalStatusDropDown").attr("Requried", "true");
        }
        else {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalStatusDropDownList", "ReadOnly")) {
                $("#capitalStatusRequiredLabel").hide();
                $('#capitalStatusDropDown').attr("disabled", false);
            }
            else {
                $("#capitalStatusRequiredLabel").hide();
                $('#capitalStatusDropDown').attr("disabled", true);
            }
        } // end of else                     
    } // end of if

    if (capitalReferenceVisibility === true) {
        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalReferenceTextBox", "Required")) {
            $("#capitalReferenceRequiredLabel").show();
            $('#capitalReference').removeAttr("readonly");
            $("#capitalReference").attr("Requried", "true");
        }
        else if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalReferenceTextBox", "Required")) {
            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalReferenceTextBox", "ReadOnly")) {
                $("#capitalReferenceRequiredLabel").hide();
                $('#capitalReference').removeAttr("readonly");
            }
            else {
                $("#capitalReferenceRequiredLabel").hide();
                $('#capitalReference').attr('readonly', 'readonly');
            }
        } // end of else 

    } // end of if

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CostTextBox", "ReadOnly")) {
        $('#projectCostsText').attr('readonly', 'readonly');
    }
    else {
        $('#projectCostsText').removeAttr("readonly");
    } // end of else

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "BudgetYearTextBox", "ReadOnly")) {
        $('#budgetYearText').attr('readonly', 'readonly');
    }
    else {
        $('#budgetYearText').removeAttr("readonly");
    } // end of else

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "MandatoryCheckBox", "ReadOnly")) {
        $('#mandatoryLabel').addClass('ui-disabled');
        $('#mandatoryCheckBox').addClass('ui-disabled');
    }
    else {
        $('#mandatoryLabel').removeClass('ui-disabled');
        $('#mandatoryCheckBox').removeClass('ui-disabled');
    } // end of else

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PicturesButton", "CanAccess")) {
        if (getLocal("CreateCapitalFlag") != "1" && getLocal("CapSeq") != 'null') {
            $("#capitalPictureButton").show();

            if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "PicturesButton", "ReadOnly")) {
                $('#capitalPictureButton').addClass('ui-disabled');
            }
            else {
                $('#capitalPictureButton').removeClass('ui-disabled');
            } // end of else
        }
        else {
            $("#capitalPictureButton").hide();
            //setLocal("CreateCapitalFlag", "0");
        }

    }
    else {
        $("#capitalPictureButton").hide();
    }


    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "CanAccess")) {
        $("#capitalSaveImage").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "SaveButton", "ReadOnly")) {
            $('#capitalSaveImage').addClass('ui-disabled');
        }
        else {
            $('#capitalSaveImage').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#capitalSaveImage").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CancelButton", "CanAccess")) {
        $("#capitalCancelImage").show();

        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CancelButton", "ReadOnly")) {
            $('#capitalCancelImage').addClass('ui-disabled');
        }
        else {
            $('#capitalCancelImage').removeClass('ui-disabled');
        } // end of else
    }
    else {
        $("#capitalCancelImage").hide();
    }

    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "LogsButton", "CanAccess")) {
        if (getLocal("CreateCapitalFlag") != "1" && getLocal("CapSeq") != 'null') {
            $("#CapitalLogButton").show();

            if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "LogsButton", "ReadOnly")) {
                $('#CapitalLogButton').addClass('ui-disabled');
            }
            else {
                $('#CapitalLogButton').removeClass('ui-disabled');
            } // end of else
        }
        else {
            $("#CapitalLogButton").hide();
            //setLocal("CreateCapitalFlag", "0");
        }

    }
    else {
        $("#CapitalLogButton").hide();
    }

    //if (getLocal("InspectionPageName") != "EditAsset" && getLocal("InspectionPageName") != "InspectionEditItem") {

        if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalLinkageDropDownList", "CanAccess")) { ////security for linkage drop down
            CapitalLinkage = true;
            $('#linkageField').show();
            $("#linkageDropDownRequiredLabel").show();
            $("#linkageDropDown").attr("Requried", "true");

            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalLinkageDropDownList", "ReadOnly")) {
                $('#linkageDropDown').attr("disabled", false);
            }
            else {
                $('#linkageDropDown').attr("disabled", true);
            }

            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalItemDropDown", "CanAccess")) { //// security for Inspection item drop down
                CapitalItem = true;
                //                            $("#CapitalInspectionItemField").show();
                if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalItemDropDown", "Required")) {
                    $("#InspectionItemDropDownRequiredLabel").show();
                    $("#InspectionItemDropDown").attr("Requried", "true");
                }
                else {
                    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalEquipTagDropDown", "ReadOnly")) {
                        $("#InspectionItemDropDownRequiredLabel").hide();
                        $('#InspectionItemDropDown').attr("disabled", false);
                    }
                    else {
                        $("#InspectionItemDropDownRequiredLabel").hide();
                        $('#InspectionItemDropDown').attr("disabled", true);
                    }
                }
            }
            else {
                $("#CapitalInspectionItemField").hide();
            } ////end of security for Inspection item drop down

            if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalEquipTagDropDown", "CanAccess")) { //// security for EquipTag drop down
                CapitalEquipTag = true;
                if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalEquipTagDropDown", "Required")) {
                    $("#CapitalEquipTagDropDownRequiredLabel").show();
                    $("#CapitalEquipTagDropDown ").attr("Requried", "true");
                }
                else {
                    if ($.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "CapitalEquipTagDropDown", "ReadOnly")) {
                        $("#CapitalGroupDropDownRequiredLabel").hide();
                        $('#CapitalGroupDropDown').attr("disabled", false);

                        $("#CapitalSubGroupDropDownRequiredLabel").hide();
                        $('#CapitalSubGroupDropDown').attr("disabled", false);

                        $("#CapitalEquipTagDropDownRequiredLabel").hide();
                        $('#CapitalEquipTagDropDown').attr("disabled", false);
                    }
                    else {
                        $("#CapitalGroupDropDownRequiredLabel").hide();
                        $('#CapitalGroupDropDown').attr("disabled", true);

                        $("#CapitalSubGroupDropDownRequiredLabel").hide();
                        $('#CapitalSubGroupDropDown').attr("disabled", true);

                        $("#CapitalEquipTagDropDownRequiredLabel").hide();
                        $('#CapitalEquipTagDropDown').attr("disabled", true);
                    }
                } // end of else
            }
            else {
                $("#CapitalGroupField").hide();
                $("#CapitalSubGroupField").hide();
                $("#CapitalEquipTagField").hide();
            } ////end of security for EquipTag drop down

    
        InspectionCapital_LinkageConfig();
        }
        else {
            InspectionCapitalScreenNavigate = false;
            $('#linkageField').hide();
            $("#CapitalGroupField").hide();
            $("#CapitalSubGroupField").hide();
            $("#CapitalEquipTagField").hide();
        InspectionCapital_LinkageConfig();
        }
    //}

    //else {
    //    InspectionCapitalScreenNavigate = false;
    //    $('#linkageField').hide();
    //    $("#CapitalGroupField").hide();
    //    $("#CapitalSubGroupField").hide();
    //    $("#CapitalEquipTagField").hide();
    //}
    setLocal("CapitalItemsEditLocked", $.GetOnlineSecuritySubTokensBit(SgstCollection, 0, "Edit Locked Items", "ReadOnly"));
} // end of function            


function CapitalConfigurationData() {
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username"))
    });

    var capitalConfiguartionURL = standardAddress + "Inspection.ashx?methodname=GetConfigurationData";
    SetConfigurationData(capitalConfiguartionURL, data);
}

function SetConfigurationData(capitalConfiguartionURL, configurationData) {
    $.postJSON(capitalConfiguartionURL, configurationData, function (configurationResult) {

        $('#capitalLevel1Label').text(getLocal("Level1Label"));
        $('#capitalLevel2Label').text(getLocal("Level2Label"));

        for (configurationIndex = 0; configurationIndex < configurationResult.length; configurationIndex++) {

            if (configurationResult[configurationIndex].ColumnName == 'CapitalProjectType' && configurationResult[configurationIndex].ColumnVisible == "1") {
                capitalProjectTypeVisibility = true;
                $("#projectTypeLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#projectTypeField").show();
                //$("#projectTypeField").parent().show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'BudgetYear' && configurationResult[configurationIndex].ColumnVisible == "1") {
                budgetYearVisibility = true;
                $("#budgetYearLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                budgetYearText = configurationResult[configurationIndex].DisplayText;
                $("#budgetYearField").show();
                //$("#projectCostField").parent().show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'Mandatory' && configurationResult[configurationIndex].ColumnVisible == "1") {
                mandatoryVisibility = true;
                //$("#mandatoryLabel").find('.ui-btn-text').html(configurationResult[configurationIndex].DisplayText + ":" + " ");
                // Pen testing and JQM update
                $("#mandatoryCheckboxLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#mandatoryField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'CapitalPriority' && configurationResult[configurationIndex].ColumnVisible == "1") {
                capitalPriorityVisibility = true;
                $("#capitalPriorityLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#capitalPriorityField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'CapitalComments' && configurationResult[configurationIndex].ColumnVisible == "1") {
                capitalCommentsVisibility = true;
                $("#capitalCommentsLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#capitalCommentsField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'FCIPriority' && configurationResult[configurationIndex].ColumnVisible == "1") {
                fciPriorityVisibility = true;
                $("#fciPriorityLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#fciPriorityField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'FCIReason' && configurationResult[configurationIndex].ColumnVisible == "1") {
                fciCommentsVisibility = true;
                $("#fciReasonLabel").text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#fciReasonField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'ItemID' && configurationResult[configurationIndex].ColumnVisible == "1") {
                $("#itemField").show();
                itemVisibility = true;
            }
            else if (configurationResult[configurationIndex].ColumnName == 'Infra_Or_Renovate' && configurationResult[configurationIndex].ColumnVisible == "1") {
                renovateVisibility = true;
                $('#renovateLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#renovateField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'CRE_Or_Client' && configurationResult[configurationIndex].ColumnVisible == "1") {
                clientVisibility = true;
                $('#clientLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#clientField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'CapitalStatus' && configurationResult[configurationIndex].ColumnVisible == "1") {
                statusVisibility = true;
                $('#capitalStatusLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#capitalStatusField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'FCIScore' && configurationResult[configurationIndex].ColumnVisible == "1") {
                fciScoreVisibility = true;
                $('#fciScoreLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#fciScoreField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'ProblemCode' && configurationResult[configurationIndex].ColumnVisible == "1") {
                problemCodeVisibility = true;
                $('#capitalProblemCodeLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#capitalProblemCodeField").show();
            }
            else if (configurationResult[configurationIndex].ColumnName == 'Reference1' && configurationResult[configurationIndex].ColumnVisible == "1") {

                capitalReferenceVisibility = true;
                $('#capitalReferenceLabel').text(configurationResult[configurationIndex].DisplayText + ":" + " ");
                $("#ReferenceField").show();
            }

        } // end of for
    });
}

/**
 * This configures the dropdowns and data for the Capital Items page.
 * @param {Object} entity - Object that contains dropdown contents and/or data to populate the form.
 */
function InspectionCapital_DropdownConfig (entity) {
    var dropdown;
    var pageID = $.mobile.activePage.attr('id');
    switch(entity.Tag) {
    	// These cases (1,2,7,8,9) are DefaultValueStr dropdown population entries.
        case 1:
            dropdown = $('#capitalPriorityDropDown');
        case 2:
            dropdown = dropdown || $('#projectTypeDropDown');
        case 7:
            dropdown = dropdown || $('#capitalStatusDropDown');
        case 8:
            dropdown = dropdown || $('#fciPriorityDropDown');
        case 9:
            dropdown = dropdown || $('#fciScoreDropDown');
            if (entity.DefaultValueStr !== null) {
                entity.DefaultValueStr.split(';')
                .forEach( function CapitalItemDropDownPopulation(splitEntity) {
                         BindDropdown(dropdown, splitEntity);
                         });
                $(dropdown).find('option:eq(0)').attr('selected', 'selected');
                $(dropdown).selectmenu('refresh',true);
            }
            break;
        case 11:
            // This is populating the Equip Group Dropdown.
            dropdown = dropdown || $('#CapitalGroupDropDown');
            BindDropdown(dropdown, [entity.EquipGroupNumber, entity.EquipGroupDescription]);
            break;
        case 12:
            // This populates the Inspection Item linkage dropdown.
            dropdown = dropdown || $('#InspectionItemDropDown');
            BindDropdown(dropdown, [entity.ItemID, entity.ItemDescription]);
            break;
        case 4:
            // Site Labels handling.
            break;
        case 3:
            // This is for Tag case 3, which is the bulk of the logic.
            // Begin with establishing whether the capital item exists and perform security config.
            if (entity.CapSeq !== null && entity.CapSeq !== 0) {
                setLocal("CreateCapitalFlag", 0);
                setLocal("CapSeq", entity.CapSeq);
            }
            
            // Set the Item ID if this linked from an Item.
            if (entity.ItemID !== null && entity.ItemID !== 'null' && entity.ItemID !== 0) {
                itemFlag = true;
                setItemID = entity.ItemID;
            } else {
                itemFlag = false;
            }
            
            // Set the Asset info if this linked from an Asset.
            if (entity.EquipTagSeq !== null && entity.EquipTagSeq !== 'null' && entity.EquipTagSeq !== 0) {
                assetFlag = true;
                setGroupID = entity.EquipGroupNumber;
                setSubGroupID = entity.EquipStyleSeq;
                setSubGroupDesc = entity.EquipStyleDescription;
                EuipTagID = entity.EquipTagSeq;
                EuipTagDesc = entity.EquipTagSeqDescription;
            } else {
                assetFlag = false;
            }
            
            if (getLocal("CreateCapitalFlag") == 0) {
                var fciPriorityValue = "";
                var priorityValue = "";
                var projectTypeValue = "";
                var capitalLocked = false;
                $("#capitalSequenceHiddenValue").val(entity.CapSeq);
                
                if (entity.EquipTagSeq !== null) {
                    operation = 2;
                }
                
                for (parameter in entity) {
                    var field = null;
                    var type = null;
                    switch(parameter.toLowerCase()) {
                        case "item":
                            field = field || $('#itemDescriptionValueLabel');
                            type = type || "label";
                        case "capitalpriority":
                            field = field || $('#capitalPriorityDropDown');
                            type = type || "menu";
                        case "capitalprojecttype":
                            field = field || $('#projectTypeDropDown');
                            type = type || "menu";
                        case "fcipriority":
                            field = field || $('#fciPriorityDropDown');
                            type = type || "menu";
                        case "capitalprojectdescr":
                            field = field || $('#projectDescriptionTextArea');
                            type = type || "value";
                        case "capitalcosts":
                            field = field || $('#projectCostsText');
                            type = type || "value";
                        case "capitalcomments":
                            field = field || $('#capitalCommentsTextArea');
                            type = type || "value";
                        case "fcireason":
                            field = field || $('#fciReasonTextArea');
                            type = type || "value";
                        case "mandatory":
                            field = field || $('#mandatoryCheckBoxLabel');
                            type = type || "check";
                        case "renovate":
                            field = field || $('#renovateText');
                            type = type || "value";
                        case "client":
                            field = field || $('#clientText');
                            type = type || "value";
                        case "capitalreference":
                            field = field || $('#capitalReference');
                            type = type || "value";
                        case "item":
                            field = field || $('#itemDescriptionValueLabel');
                            type = type || "label";
                        case "budgetyear":
                            field = field || $('#budgetYearText');
                            if (type == null) {
                                if (entity[parameter] !== 0) {
                                    type = "value";
                                } else {
                                    type = "invalid";
                                }
                            }
                        case "problemcodenumber":
                            field = field || $('#capitalProblemCodeDropDown');
                            if (type == null) {
                                if (entity[parameter] !== 0) {
                                    type = "menu";
                                    // Create tag item to append to the dropdown later.
                                    var tag = document.createElement('option');
                                    tag.setAttribute("value", entity[parameter]);
                                    tag.innerHTML = entity.ProblemCode;
                                } else {
                                    type = "invalid";
                                }
                            }
                        case "fciscore":
                            field = field || $('#fciScoreDropDown');
                            if (type == null) {
                                if (entity[parameter] !== -1) {
                                    type = "menu";
                                } else {
                                    type = "invalid";
                                }
                            }
                        case "capitalstatus":
                            field = field || $('#capitalStatusDropDown');
                            if (type == null) {
                                if (entity[parameter] !== null) {
                                    type = "menu";
                                    capitalLocked = entity[parameter].toUpperCase() === "LOCKED" ? true : false;
                                } else {
                                    type = "invalid";
                                }
                            }
                        default:
                            // Add the info to the selected 'field' based on the type of the data.
                            if (typeof field !== "undefined" && typeof type !== "undefined") {
                                if (type === "value") {
                                    if (!IsStringNullOrEmpty(entity[parameter])) {
                                        $(field).val("");
                                        $(field).val(entity[parameter]);
                                    }
                                } else if (type === "check") {
                                    if (entity[parameter] === true) {
                                        $(field).attr('checked', true).checkboxradio('refresh');
                                        $(field).trigger('change');
                                    }
                                } else if (type === "label") {
                                    if (!IsStringNullOrEmpty(entity[parameter])) {
                                        $(field).text("");
                                        $(field).text(entity[parameter]);
                                    }
                                } else if (type === "menu") {
                                    if (typeof tag != 'undefined') {
                                        $(field).append(tag);
                                    }
                                    $(field).val(entity[parameter]);
                                    $(field).selectmenu("refresh", true);
                                }
                            }
                            break;
                    }
                }
            } // End of if CreateCapitalFlag == 0.
            
            // If capital is locked and user can't edit, lock whole form down.
            if (capitalLocked && getLocal("CapitalItemsEditLocked") == "false") {
                $("#projectTypeDropDown").attr("disabled", true);
                $("#projectDescriptionTextArea").attr('readonly', 'readonly');
                $("#capitalProblemCodeText").attr('readonly', 'readonly');
                $("#capitalProblemCodeDropDown").attr("disabled", true);
                $("#renovateText").attr('readonly', 'readonly');
                $("#clientText").attr('readonly', 'readonly');
                $("#projectCostsText").attr('readonly', 'readonly');
                $("#mandatoryCheckBoxLabel").attr("disabled", true);
                $("#capitalPriorityDropDown").attr("disabled", true);
                $("#capitalCommentsTextArea").attr('readonly', 'readonly');
                $("#fciScoreDropDown").attr("disabled", true);
                $("#fciPriorityDropDown").attr("disabled", true);
                $("#fciReasonTextArea").attr('readonly', 'readonly');
                $("#budgetYearText").attr('readonly', 'readonly');
                $("#capitalReference").attr('readonly', 'readonly');
                $("#capitalStatusDropDown").attr("disabled", true);
                $("#linkageDropDown").attr("disabled", true);
                $("#CapitalGroupDropDown").attr("disabled", true);
                $("#CapitalSubGroupDropDown").attr("disabled", true);
                $("#CapitalEquipTagDropDown").attr("disabled", true);
                $("#InspectionItemDropDown").attr("disabled", true);
                $("#capitalSaveImage").addClass('ui-disabled');
            }
        default:
            break;
    }
    
    // Refresh the dropdowns
    $("#" + pageID + " #CapitalGroupDropDown").selectmenu("refresh", true);
    $("#" + pageID).find("#InspectionItemDropDown").selectmenu("refresh", true);
    
    $("#" + pageID).find("#CapitalSubGroupDropDown").attr("disabled", true);
    $("#" + pageID).find("#CapitalSubGroupDropDown").selectmenu("refresh", true);
    
    $("#" + pageID).find("#CapitalEquipTagDropDown").attr("disabled", true);
    $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
};

/**
 * This will set up the linkage dropdowns for the Capital Items form.
 */
function InspectionCapital_LinkageConfig () {
    /** This process will use the following variables
     * showLinkage - Appears to be used to identify if the linkage dropdown is visible.
     * CapitalLinkage - This is the security token info for the linkage dropdown.
     * assetFlag  - This identifies if the page is currently linked to an asset.
     * itemFlag - This identifies if the page is currently linked to an item.
     * CapitalEquipTag - This is the security token CanAccess for the EquipTag linkage dropdown.
     * CapitalItem - This is the security token CanAccess for the Item linkage dropdown.
     */
    var showLinkage;
    var pageID = $.mobile.activePage.attr('id');
    // Show the linkage ONLY in these cases: CapitalLinkage security token is enabled and we are
    // 1. Editing a Capital Item. 2. Creating an unlinked Capital Item.
    if (CapitalLinkage && ((getLocal("InspectionPageName") != "EditAsset" && getLocal("InspectionPageName") != "InspectionEditItem") || getLocal("CreateCapitalFlag") != 1)) {
        showLinkage = true;
    } else {
        showLinkage = false;
    }
    
    // Show/hide linkage based on settings.
    $('#linkageField').toggle(showLinkage);
    
    // Security for Linkage is enabled. We can use these fields.
    // Check to fail out of the case first, then check for Equip Tag linkage, finally Insp Items.
    if (assetFlag || itemFlag) {
        // If the values are there, then check to make sure each type is enabled and handled.
        if (CapitalEquipTag && assetFlag) {
            // This will trigger if the security token for EquipTag linkage is enabled and this is a tag linkage.
            $("#" + pageID).find("#linkageDropDown").val("AssetTag");
            $("#" + pageID).find("#linkageDropDown").selectmenu("refresh", true);
            
            if (setGroupID.length !== 0) {
                $("#" + pageID).find("#CapitalGroupDropDown").val(setGroupID);
                $("#" + pageID).find("#CapitalGroupDropDown").selectmenu("refresh", true);
            }
            
            if (setSubGroupID.length !== 0) {
                tag = document.createElement('option');
                tag.setAttribute("value", setSubGroupID);
                tag.innerHTML = setSubGroupDesc;
                $("#" + pageID).find("#CapitalSubGroupDropDown").append(tag);
                $("#" + pageID).find("#CapitalSubGroupDropDown").val(setSubGroupID);
                $("#" + pageID).find("#CapitalSubGroupDropDown").removeAttr('disabled');
                $("#" + pageID).find("#CapitalSubGroupDropDown").selectmenu("refresh", true);
            }
            
            if (EuipTagID.length !== 0) {
                tag = document.createElement('option');
                tag.setAttribute("value", EuipTagID);
                tag.innerHTML = EuipTagDesc;
                $("#" + pageID).find("#CapitalEquipTagDropDown").append(tag);
                $("#" + pageID).find("#CapitalEquipTagDropDown").val(EuipTagID);
                $("#" + pageID).find("#CapitalEquipTagDropDown").removeAttr('disabled');
                $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
            }
            
            // The fields are only shown when editing the value OR creating from the Capital Items view.
            // So ShowLinkage should be set in those cases.
            $("#" + pageID).find('[data-linkage="AssetTag"]').toggle(showLinkage);
            
            assetFlag = false;
        } else {
            // Hide Asset dropdowns because there is asset linkage or there is no security for asset linkage.
            $("#" + pageID).find('[data-linkage="AssetTag"]').hide();
        }
        
        if (CapitalItem && itemFlag) {
            // This is an inspection linked Capital Item and the security for inspection linked capital items is enabled.
            $("#" + pageID).find("#linkageDropDown").val("InspectionItem");
            $("#" + pageID).find("#linkageDropDown").selectmenu("refresh", true);
            
            if (setItemID.length !== 0) {
                $("#" + pageID).find("#InspectionItemDropDown").val(setItemID);
            } else {
                $("#" + pageID).find('#InspectionItemDropDown option').each(function () {
                    if ($(this).text() == getLocal("ItemName")) {
                        $("#" + pageID).find("#InspectionItemDropDown").val($(this).val());
                    }
                });
            }
            
            $("#" + pageID).find("#InspectionItemDropDown").selectmenu("refresh", true);
            
            // The fields are only shown when editing the value OR creating from the Capital Items view.
            $("#" + pageID).find("#CapitalInspectionItemField").toggle(showLinkage);
        } else {
            // Hide Insp Item dropdowns because they either don't have security or have a link.
            $("#" + pageID).find('[data-linkage="InspectionItem"]').hide();
        }
    } else {
        // Neither linkage is applicable.
        $("#" + pageID).find("#linkageDropDown").val("NoLinkage");
        $("#" + pageID).find("#linkageDropDown").selectmenu("refresh", true);
        
        // Hide both sets of dropdowns because there is no linkage so far.
        $("#" + pageID).find('[data-linkage="AssetTag"],[data-linkage="InspectionItem"]').hide();
    }
};

function InspectionCapitalSuccess(capitalURL, capitalData) {
    var setItemID = '';
    var setGroupID = '';
    var setSubGroupID = '';
    var setSubGroupDesc = '';
    var EquipTagID = '';
    var EquipTagDesc = '';
    itemFlag = false;
    assetFlag = false;
    var tag;
    $('#mandatoryCheckBoxLabel').change( function () {
        if ($('#mandatoryCheckBoxLabel').prop('checked') == true) {
            $("#mandatoryHiddenValue").val("on");
            $('#mandatoryCheckBoxLabel').val("on");
        } else {
            $("#mandatoryHiddenValue").val("off");
            $('#mandatoryCheckBoxLabel').val("off");
        }
    });
    
    $.postJSON(capitalURL, capitalData, function (capitalResult) {

        setLocal("CreateCapitalFlag", 1);
        if (capitalResult.length > 0) {
            var pageID = $.mobile.activePage.attr('id');
            $('#' + pageID + " #CapitalGroupDropDown").children('option:not(:first)').remove();
            $('#' + pageID + " #InspectionItemDropDown").children('option:not(:first)').remove();

            // Sort by Tag and then handle each result in the DropdownConfig function.
            capitalResult
            .sort(function(a,b) {
                 // Sort ascending except for Tag 3, that needs to be at the end.
                 return a.Tag == 3 ? 1 : b.Tag == 3 ? -1 : a.Tag - b.Tag;
                 });

            capitalResult
            .forEach(InspectionCapital_DropdownConfig);

            $.GetOnlineSecuritySubTokens(400021, 0, InspectionCapitalPageSecurity);
            // Call LinkageConfig from within InspectionCapitalPageSecurity
            closeLoading();
        } // end of if
    });
}

function SetInspectionCapitalFieldValues() {
    setLocal("InspectionCapitalCategory", $('#projectTypeDropDown').val());
    setLocal("InspectionCapitalDescription", $('#projectDescriptionTextArea').val());
    setLocal("InspectionCapitalInfraOrRenovate", $('#renovateText').val());
    setLocal("InspectionCapitalClientOrCRE", $('#clientText').val());
    setLocal("InspectionCapitalBudgetAmount", $('#projectCostsText').val());
    setLocal("InspectionCapitalMandatory", $('#mandatoryHiddenValue').val());
    setLocal("InspectionCapitalPriority", $('#capitalPriorityDropDown').val());
    setLocal("InspectionCapitalComments", $('#capitalCommentsTextArea').val());
    setLocal("InspectionCapitalFCIPriority", $('#fciPriorityDropDown').val());
    setLocal("InspectionCapitalFCIComments", $('#fciReasonTextArea').val());
    setLocal("InspectionCapitalBudgetYear", $('#budgetYearText').val());
}

function ValidateInspectionCapitalFields() {
    var isValid = false;
    var regexTest = new RegExp(/^\d{0,13}(\.\d{0,2})?$/);
    var testedCostValue = regexTest.test($('#projectCostsText').val().trim());
    if ($('#projectCostsText').val().trim() === "") {
        isValid = false;
        ////showError("Please fill mandatory fields");
        showError(GetTranslatedValue("FillAll"));
        return false;
    }
    else if (!testedCostValue) {
        ////showError("Enter proper cost value");
        showError(GetTranslatedValue("EnterValidCost"));
        return false;
    }
}

function AddOrUpdateCapital() {

    var regexTest = new RegExp(/^\d{0,13}(\.\d{0,2})?$/);
    var yearRegEx = new RegExp(/^\d{0,4}$/);
    var testedCostValue = regexTest.test($('#projectCostsText').val().trim());
    var budgetYear = yearRegEx.test($('#budgetYearText').val().trim());

    if ($('#projectTypeDropDown').val() == "-1" && capitalProjectTypeVisibility === true && $('#projectTypeDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select Category.");
        showError(GetTranslatedValue("SelectCategory"));
        return false;
    }
    else if ($('#capitalProblemCodeDropDown').val() == "-1" && problemCodeVisibility === true && $('#capitalProblemCodeDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select problem code.");
        showError(GetTranslatedValue("SelectProblemCode"));
        return false;
    }
    else if ($.trim($('#renovateText').val()).length === 0 && renovateVisibility === true && $('#renovateText').attr("requried") == "true") {
        isValid = false;
        ////showError("Please enter infra or renovate text.");
        showError(GetTranslatedValue("SelectInfra"));
        return false;
    }
    else if ($.trim($('#clientText').val()).length === 0 && clientVisibility === true && $('#clientText').attr("requried") == "true") {
        isValid = false;
        ////showError("Please enter CRE or client text.");
        showError(GetTranslatedValue("EnterCRE"));
        return false;
    }
    else if ($.trim($('#projectCostsText').val()).length === 0) {
        isValid = false;
        ////showError("Please enter budget amount.");
        showError(GetTranslatedValue("EnterBudget"));
        return false;
    }
    else if (!testedCostValue) {
        ////showError("Please enter proper budget amount.");
        showError(GetTranslatedValue("EnterValidBudget"));
        return false;
    }
    else if ($('#capitalPriorityDropDown').val() == "-1" && capitalPriorityVisibility === true && $('#capitalPriorityDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select capital priority.");
        showError(GetTranslatedValue("EnterCapitalPriority"));
        return false;
    }
    else if ($.trim($('#capitalCommentsTextArea').val()).length === 0 && capitalCommentsVisibility === true && $('#capitalCommentsTextArea').attr("requried") == "true") {
        isValid = false;
        ////showError("Please enter capital comments.");
        showError(GetTranslatedValue("EnterCapitalComments"));
        return false;
    }
    else if ($('#fciScoreDropDown').val() == "-1" && fciScoreVisibility === true && $('#fciScoreDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select FCI Score.");
        showError(GetTranslatedValue("EnterFCI"));
        return false;
    }
    else if ($('#fciPriorityDropDown').val() == "-1" && fciPriorityVisibility === true && $('#fciPriorityDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select FCI priority.");
        showError(GetTranslatedValue("SelectFCIPriority"));
        return false;
    }
    else if ($.trim($('#fciReasonTextArea').val()).length === 0 && fciCommentsVisibility === true && $('#fciReasonTextArea').attr("requried") == "true") {
        isValid = false;
        ////showError("Please enter FCI reason.");
        showError(GetTranslatedValue("SelectFCIReason"));
        return false;
    }
    else if (!budgetYear) {
        ////showError("Enter proper budget year.");
        showError(GetTranslatedValue("EnterValidBudget"));
        return false;
    }

    else if ($.trim($('#projectDescriptionTextArea').val()).length === 0) {
        isValid = false;
        ////showError("Please enter Description.");
        showError(GetTranslatedValue("EnterDescription"));
        return false;
    }
    else if ($.trim($('#budgetYearText').val()).length === 0 && budgetYearVisibility === true) {
        isValid = false;
        showError(GetTranslatedValue("BudgetYearRequired").replace('[BUDGETYEAR]', budgetYearText));
        return false;
    }
    else if ($('#capitalStatusDropDown').val() == "-1" && fciPriorityVisibility === true && $('#capitalStatusDropDown').attr("requried") == "true") {
        isValid = false;
        ////showError("Please select capital status.");
        showError(GetTranslatedValue("SelectCapitalStatus"));
        return false;
    }
    else if ($.trim($('#capitalReference').val()).length === 0 && capitalReferenceVisibility === true && $('#capitalReference').attr("requried") == "true") {
        isValid = false;
        ////showError("Please enter capital reference.");
        showError(GetTranslatedValue("SelectCapitalRef"));
        return false;
    }
    else if ($('#linkageDropDown').val() == "AssetTag") {
        if (CapitalEquipTag === true && $('#CapitalEquipTagDropDown').val() == "-1" && $('#CapitalEquipTagDropDown').attr("requried") == "true") {
            isValid = false;
            ////showError("Please select Equip Tag.");
            showError(GetTranslatedValue("SelectEquipTag"));
            return false;
        }
        //else if ($('#InspectionItemDropDown').val() == "-1" && CapitalItem === true && $('#InspectionItemDropDown').attr("requried") == "true") {
        //    isValid = false;
            ////showError("Please select Inspection item.");
        //    showError(GetTranslatedValue("SelectInspItem"));
        //    return false;
        //}
    }
    else if ($('#InspectionItemDropDown').val() == "-1" && CapitalItem === true && $('#InspectionItemDropDown').attr("requried") == "true" && $('#linkageDropDown').val() == "InspectionItem") {
        isValid = false;
        ////showError("Please select Inspection item.");
        showError(GetTranslatedValue("SelectInspItem"));
        return false;
    }

    showActionPopupLoading();
    LoadMyLocation();
    $('#capitalSaveImage').addClass('ui-disabled');
    $('#capitalCancelImage').addClass('ui-disabled');

    $("#regionNumberHiddenValue").val(getLocal("RegionNumber"));
    $("#divisionNumberHiddenValue").val(getLocal("DivisionNumber"));

    $('#capitalCategoryHiddenValue').val($('#projectTypeDropDown').val());
    $('#capitalProblemCodeHiddenValue').val($('#capitalProblemCodeDropDown').val());
    $('#capitalPriorityHiddenValue').val($('#capitalPriorityDropDown').val());
    $('#FCIScoreHiddenValue').val($('#fciScoreDropDown').val());
    $('#FCIPriorityHiddenValue').val($('#fciPriorityDropDown').val());
    $('#CapitalStatusHiddenValue').val($('#capitalStatusDropDown').val());

    if (getLocal("InspectionPageName") == "EditAsset") {
        $("#itemIDHiddenValue").val(getLocal("ItemId"));
    }
    else if (getLocal("InspectionPageName") == "InspectionEditItem") {
        $("#itemIDHiddenValue").val(getLocal("ItemId"));
    }
    else {
        // Invalidate the opposing linkage if a value exists for linkage.  Only the value for the selected link should be stored.
        if ($('#linkageDropDown').val() == "NoLinkage") {
            $('#CapitalEquipTagDropDown').val('-1');
            $("#CapitalEquipTagDropDown").selectmenu("refresh", true);

            $('#InspectionItemDropDown').val('-1');
            $("#InspectionItemDropDown").selectmenu("refresh", true);
        }
        else if ($('#linkageDropDown').val() == "InspectionItem") {
            $('#CapitalEquipTagDropDown').val('-1');
            $("#CapitalEquipTagDropDown").selectmenu("refresh", true);
        }

        else if ($('#linkageDropDown').val() == "AssetTag") {
            $('#InspectionItemDropDown').val('-1');
            $("#InspectionItemDropDown").selectmenu("refresh", true);
        }
        var ItemId = $("#InspectionItemDropDown").val();
        if (ItemId == '-1') {
            ItemId = null;
        }
        $("#itemIDHiddenValue").val(ItemId);
        var disableEquipTagVal = $('#CapitalEquipTagDropDown').val();
        $("#CapitalEquipTagDropDown").attr("disabled", false);
        $('#CapitalEquipTagDropDown').val(disableEquipTagVal);
        $("#CapitalEquipTagDropDown").selectmenu("refresh", true);
    }


    if ($("#mandatoryHiddenValue").val() === "") {
        if ($('#mandatoryCheckBox').prop('checked') == true) {
            $("#mandatoryHiddenValue").val("on");
        }
        else {
            $("#mandatoryHiddenValue").val("off");
        }
    }

    if (operation === "" && getLocal("InspectionPageName") == "EditAsset") {

        $("#equipTagHiddenValue").val(getLocal("EquipTagNumber"));
        $("#operationNumberHiddenValue").val("3");
    }

    var data = $('#formInspectionCapital').serialize();
    data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(getLocal("DatabaseID")) + "&" +
                    "Language" + "=" + getLocal("Language") + "&" +
                    "Username" + "=" + decryptStr(getLocal("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(getLocal("EmployeeNumber")) + "&" +
                    "GPSLocation" + "=" + GlobalLat + "," + GlobalLong + "&" +
                    "InspectionWorkOrderNumber" + "=" + getLocal("InspectionWorkOrderNumber") + "&" +
                    "InspectionNumber" + "=" + getLocal("InspectionNumber") + "&" +
                    "SessionID" + "=" + decryptStr(getLocal("SessionID"))
                    );

    if (navigator.onLine) {
        var createCapitalURL = standardAddress + "Inspection.ashx?methodname=CreateCapitalPlan";
        CapitalSuccess(createCapitalURL, data);
    }
    else {
        ////showError('No network connection. Please try again when network is available.');
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function CapitalSuccess(createCapitalURL, createCapitalData) {
    $.ajaxpostJSON(createCapitalURL, createCapitalData, function (resultMessage) {
        closeActionPopupLoading();

        if (resultMessage.Status == "InsertSuccess") {
            //Save Success. Show Popup.
            $('#successInspectionCapitalMessageParagraph').html(GetTranslatedValue("CapitalInsertSuccess"));

            setTimeout(function () {
                $("#inspectionCapitalMessagePopUp").popup();
                $("#inspectionCapitalMessagePopUp").popup().popup("open");
            }, 2000);

            $('#capitalSaveImage').removeClass('ui-disabled');
            $('#capitalCancelImage').removeClass('ui-disabled');
        }
        else if (resultMessage.Status == "UpdateSuccess") {
            //Save Success. Show Popup.
            $('#successInspectionCapitalMessageParagraph').html(GetTranslatedValue("CapitalUpdateSuccess"));

            setTimeout(function () {
                $("#inspectionCapitalMessagePopUp").popup();
                $("#inspectionCapitalMessagePopUp").popup().popup("open");
            }, 1500);

            $('#capitalSaveImage').removeClass('ui-disabled');
            $('#capitalCancelImage').removeClass('ui-disabled');
        }
        else if (resultMessage.BudgetYear == "Invalid") {
            setTimeout(function () {
                showError(GetTranslatedValue("BudgetYearInvalid").replace('[BUDGETYEAR]', budgetYearText));
            }, 650);

            $('#capitalSaveImage').removeClass('ui-disabled');
            $('#capitalCancelImage').removeClass('ui-disabled');
        }
        else if (resultMessage.Status == "DuplicateExists") {
            setTimeout(function () {
                ////showError("Duplicate record exists.Cannot save record.");
                showError(GetTranslatedValue("DuplicateExists"));
            }, 650);

            $('#capitalSaveImage').removeClass('ui-disabled');
            $('#capitalCancelImage').removeClass('ui-disabled');
        }
        else {
            $('#capitalSaveImage').removeClass('ui-disabled');
            $('#capitalCancelImage').removeClass('ui-disabled');
            setTimeout(function () {
                ////showError("Operation failed, please try again");
                showError(GetTranslatedValue("OperationFailed"));
            }, 650);

        }
    });
}

function InspectionCapitalPostError() {
    ////showError("Error in getting capital details");
    showError(GetTranslatedValue("ErrorCapitalDetails"));
}

function NavigateBackFromCapital() {
    if (navigator.onLine) {
        removePageFromBreadcrumb();
        if (getLocal("InspectionPageName") == "InspectionEditItem") {
            $.mobile.changePage("NewInspectionItems.html");
        }
        else if (getLocal("InspectionPageName") == "NewInspectionItems") {
            $.mobile.changePage("NewInspectionItems.html");
        }
        else if (getLocal("InspectionPageName") == "ViewCapitalItems") {
            setLocal("InspPrevScreen", "CapitalPlanning");
            IsCapitalScreenFlag = 0;
            $.mobile.changePage("InspectionViewCapital.html");
        }
        else if (getLocal("InspectionPageName") == "EditAsset") {
            $.mobile.changePage("InspectionEditAsset.html");
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToPicturesScreen(obj) {
    var TableName = $('#' + obj.id).attr('data-tableName');
    setLocal("TableName", TableName);
    if (navigator.onLine) {
        capitalAutoSave();
        $.mobile.changePage('InspectionPictures.html');
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function capitalAutoSave() {

    var budgetValue = $('#projectCostsText').val().trim();
    if (budgetValue === "") {
        $('#projectCostsText').val(0);
    }

    if ($('#budgetYearText').val().trim() === "" && budgetYearVisibility === true) {
        var budgetYear = new Date();
        $('#budgetYearText').val(budgetYear.getFullYear());
    }
    LoadMyLocation();

    $("#regionNumberHiddenValue").val(getLocal("RegionNumber"));
    $("#divisionNumberHiddenValue").val(getLocal("DivisionNumber"));
    $("#itemIDHiddenValue").val(getLocal("ItemId"));
    $('#capitalCategoryHiddenValue').val($('#projectTypeDropDown').val());
    $('#capitalProblemCodeHiddenValue').val($('#capitalProblemCodeDropDown').val());
    $('#capitalPriorityHiddenValue').val($('#capitalPriorityDropDown').val());
    $('#FCIScoreHiddenValue').val($('#fciScoreDropDown').val());
    $('#FCIPriorityHiddenValue').val($('#fciPriorityDropDown').val());
    $('#CapitalStatusHiddenValue').val($('#capitalStatusDropDown').val());

    if ($("#mandatoryHiddenValue").val() === "") {
        if ($('#mandatoryCheckBox').prop('checked') == true) {
            $("#mandatoryHiddenValue").val("on");
        }
        else {
            $("#mandatoryHiddenValue").val("off");
        }
    }

    $("#regionNumberHiddenValue").val(getLocal("RegionNumber"));
    $("#divisionNumberHiddenValue").val(getLocal("DivisionNumber"));

    if (getLocal("InspectionPageName") == "EditAsset") {
        $("#itemIDHiddenValue").val(getLocal("ItemId"));
    }
    else if (getLocal("InspectionPageName") == "InspectionEditItem") {
        $("#itemIDHiddenValue").val(getLocal("ItemId"));
    }
    else {
        if ($('#linkageDropDown').val() == "NoLinkage") {
            $('#CapitalEquipTagDropDown').val('-1');
            $("#CapitalEquipTagDropDown").selectmenu("refresh", true);

            $('#InspectionItemDropDown').val('-1');
            $("#InspectionItemDropDown").selectmenu("refresh", true);
        }
        else if ($('#linkageDropDown').val() == "InspectionItem") {
            $('#CapitalEquipTagDropDown').val('-1');
            $("#CapitalEquipTagDropDown").selectmenu("refresh", true);
        }

        var ItemId = $("#InspectionItemDropDown").val();
        if (ItemId == '-1') {
            ItemId = null;
        }
        $("#itemIDHiddenValue").val(ItemId);
        var disableEquipTagVal = $('#CapitalEquipTagDropDown').val();
        $("#CapitalEquipTagDropDown").attr("disabled", false);
        $('#CapitalEquipTagDropDown').val(disableEquipTagVal);
        $("#CapitalEquipTagDropDown").selectmenu("refresh", true);
    }

    if (operation === "" && getLocal("InspectionPageName") == "EditAsset") {

        $("#equipTagHiddenValue").val(getLocal("EquipTagNumber"));
        $("#operationNumberHiddenValue").val("3");
    }

    var data = $('#formInspectionCapital').serialize();
    data = data.concat(
                    "&" + "DatabaseID" + "=" + decryptStr(getLocal("DatabaseID")) + "&" +
                    "Language" + "=" + getLocal("Language") + "&" +
                    "Username" + "=" + decryptStr(getLocal("Username")) + "&" +
                    "EmployeeNumber" + "=" + decryptStr(getLocal("EmployeeNumber")) + "&" +
                    "GPSLocation" + "=" + GlobalLat + "," + GlobalLong + "&" +
                    "SessionID" + "=" + decryptStr(getLocal("SessionID"))
                    );
    var createCapitalURL = standardAddress + "Inspection.ashx?methodname=CreateCapitalPlan";
    inspectionCapitalAutoSave(createCapitalURL, data);
}

function inspectionCapitalAutoSave(createCapitalURL, createCapitalData) {
    $.postJSON(createCapitalURL, createCapitalData, function (resultMessage) {

    });
}

// Load problem code
function LoadCapitalProblemCode() {
    $("#capitalProblemCodeDropDown option:gt(0)").remove();
    $("#capitalProblemCodeDropDown").selectmenu("refresh", true);

    var searchText = jQuery.trim($('#capitalProblemCodeText').val());
    var pattern = /^[A-Za-z-]*$/;
    if (searchText.length >= 3) {
        var problemCodeSearchText = searchText;
        dB.transaction(function (tx) {
            tx.executeSql("SELECT ProblemCodeID, ProblemCodeDescription FROM ProblemTable WHERE (ProblemCodeDescription LIKE ?) ORDER BY ProblemCodeDescription", ["%" + problemCodeSearchText + "%"], SetCapitalProblemCodeLocally, failureSQL);
        });
    }

    //====Success callback for getting ProblemCode details from Local DB====
    function SetCapitalProblemCodeLocally(tx, results) {
        var problemArray = [];
        var i = 0;
        for (i = 0; i < results.rows.length; i++) {
            //Dynamically creating object with key value properties.
            var obj = {};
            obj.Key = results.rows.item(i).ProblemCodeDescription;
            obj.Value = results.rows.item(i).ProblemCodeID;
            problemArray[i] = obj;
        }
        CapitalproblemCodeDD(problemArray);
    }

    //====Bind ProblemCode DropDown====
    function CapitalproblemCodeDD(result) {
        var capitalProblemCodeTag;
        $("#capitalProblemCodeDropDown option:gt(0)").remove();
        $("#capitalProblemCodeDropDown").selectmenu("refresh", true);

        if (result.length === 0) {
            capitalProblemCodeTag = document.createElement('option');
            capitalProblemCodeTag.setAttribute("value", "-2");
            capitalProblemCodeTag.innerHTML = GetCommonTranslatedValue('NoRecordFound');
            $("#capitalProblemCodeDropDown").append(capitalProblemCodeTag);
            ////alert("No Record Found");
            $("#capitalProblemCodeDropDown").val("-2");
            $("#capitalProblemCodeDropDown").selectmenu("refresh", true);
        }
        else if (result.length === 1) {
            capitalProblemCodeTag = document.createElement('option');
            capitalProblemCodeTag.setAttribute("value", result[0].Value);
            capitalProblemCodeTag.innerHTML = result[0].Key;
            $("#capitalProblemCodeDropDown").append(capitalProblemCodeTag);
            $("#capitalProblemCodeDropDown").val(result[0].Value);
            $("#capitalProblemCodeDropDown").selectmenu("refresh", true);
        }
        else {
            var firstTag = document.createElement('option');
            firstTag.setAttribute("value", "-1");
            firstTag.innerHTML = "-- [ " + result.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
            $("#capitalProblemCodeDropDown").append(firstTag);

            var i = 0;
            for (i = 0; i < result.length; i++) {
                var tag = document.createElement('option');
                tag.setAttribute("value", result[i].Value);
                tag.innerHTML = result[i].Key;
                $("#capitalProblemCodeDropDown").append(tag);
            }
            $("#capitalProblemCodeDropDown").val('-1');
            $("#capitalProblemCodeDropDown").selectmenu("refresh", true);
        }
    }
}

function getCapitalSubGroup(obj) {
    var value = $('#' + obj.id).val();
    if (value != -1) {
        data = iMFMJsonObject({
            "Sequence": getLocal("Sequence"),
            "InspectionNumber": getLocal("InspectionNumber"),
            "Username": decryptStr(getLocal("Username")),
            "EquipTagNumber": getLocal("EquipTagNumber"),
            "ScreenName": "Asset",
            "EquipGroupNumber": value,
            "EquipStyleSeq": null,
            "DivisionNumber": getLocal("DivisionNumber"),
            "RegionNumber": getLocal("RegionNumber")
        });
        var capitalURL = standardAddress + "Inspection.ashx?methodname=GetCapitalDetails";
        InspectionCapitalSubGroup(capitalURL, data);
    }
    else {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID).find("#CapitalSubGroupDropDown").val("-1");
        $("#" + pageID).find("#CapitalSubGroupDropDown").attr("disabled", true);
        $("#" + pageID).find("#CapitalSubGroupDropDown").selectmenu("refresh", true);

        $("#" + pageID).find("#CapitalEquipTagDropDown").val("-1");
        $("#" + pageID).find("#CapitalEquipTagDropDown").attr("disabled", true);
        $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
    }
}

function InspectionCapitalSubGroup(capitalURL, data) {
    $.postJSON(capitalURL, data, function (capitalResult) {

        if (capitalResult.length > 0) {
            var pageID = $.mobile.activePage.attr('id');
            $('#' + pageID + " #CapitalSubGroupDropDown").children('option:not(:first)').remove();
            for (capitalIndex = 0; capitalIndex < capitalResult.length; capitalIndex++) {
                if (capitalResult[capitalIndex].Tag == 13) {
                    var tag = document.createElement('option');
                    tag.setAttribute("value", capitalResult[capitalIndex].EquipStyleSeq);
                    tag.innerHTML = capitalResult[capitalIndex].EquipStyleDescription;
                    $("#" + pageID).find("#CapitalSubGroupDropDown").append(tag);
                }
            }

            $("#" + pageID).find("#CapitalSubGroupDropDown").attr("disabled", false);
            $("#" + pageID).find("#CapitalSubGroupDropDown").selectmenu("refresh", true);

            $("#" + pageID).find("#CapitalEquipTagDropDown").val("-1");
            $("#" + pageID).find("#CapitalEquipTagDropDown").attr("disabled", true);
            $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
        }
    });

}
function getCapitalEquipTag(obj) {
    var pageID = $.mobile.activePage.attr('id');
    var EquipGroupNumber = $("#" + pageID).find("#CapitalGroupDropDown").val();
    var value = $('#' + obj.id).val();
    if (value != -1) {
        data = iMFMJsonObject({
            "Sequence": getLocal("Sequence"),
            "InspectionNumber": getLocal("InspectionNumber"),
            "Username": decryptStr(getLocal("Username")),
            "EquipTagNumber": getLocal("EquipTagNumber"),
            "ScreenName": "Asset",
            "EquipGroupNumber": EquipGroupNumber,
            "EquipStyleSeq": value,
            "DivisionNumber": getLocal("DivisionNumber"),
            "RegionNumber": getLocal("RegionNumber")
        });

        var capitalURL = standardAddress + "Inspection.ashx?methodname=GetCapitalDetails";
        InspectionCapitalEquipTag(capitalURL, data);
    }
    else {

        $("#" + pageID).find("#CapitalEquipTagDropDown").val("-1");
        $("#" + pageID).find("#CapitalEquipTagDropDown").attr("disabled", true);
        $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
    }
}

function InspectionCapitalEquipTag(capitalURL, data) {
    $.postJSON(capitalURL, data, function (capitalResult) {
        if (capitalResult.length > 0) {
            var pageID = $.mobile.activePage.attr('id');
            $('#' + pageID + " #CapitalEquipTagDropDown").children('option:not(:first)').remove();
            for (capitalIndex = 0; capitalIndex < capitalResult.length; capitalIndex++) {
                if (capitalResult[capitalIndex].Tag == 14) {
                    var tag = document.createElement('option');
                    tag.setAttribute("value", capitalResult[capitalIndex].EquipTagSeq);
                    tag.innerHTML = capitalResult[capitalIndex].EquipTagSeqDescription;
                    $("#" + pageID).find("#CapitalEquipTagDropDown").append(tag);
                }
            }
            $("#" + pageID).find("#CapitalEquipTagDropDown").attr("disabled", false);
            $("#" + pageID).find("#CapitalEquipTagDropDown").selectmenu("refresh", true);
        }
    });
}

function hideCascadeDD(obj) {
    var value = $('#' + obj.id).val();
    var pageID = $.mobile.activePage.attr('id');
    if (value == "NoLinkage") {
        assetFlag = false;
        itemFlag = false;
        $("#" + pageID).find("#CapitalGroupField").hide();
        $("#" + pageID).find("#CapitalSubGroupField").hide();
        $("#" + pageID).find("#CapitalEquipTagField").hide();
        $("#" + pageID).find("#CapitalInspectionItemField").hide();
    }
    else if (value == "AssetTag") {
        assetFlag = true;
        itemFlag = false;
        if (CapitalEquipTag === true && CapitalItem === true) {
            $("#" + pageID).find("#CapitalGroupField").show();
            $("#" + pageID).find("#CapitalSubGroupField").show();
            $("#" + pageID).find("#CapitalEquipTagField").show();
            //$("#" + pageID).find("#CapitalInspectionItemField").show();
        }
        else if (CapitalEquipTag === true) {
            $("#" + pageID).find("#CapitalGroupField").show();
            $("#" + pageID).find("#CapitalSubGroupField").show();
            $("#" + pageID).find("#CapitalEquipTagField").show();
        }
        /*else if (CapitalItem === true) {
            $("#" + pageID).find("#CapitalInspectionItemField").show();
        }*/
    }
    else if (value == "InspectionItem") {
        assetFlag = false;
        itemFlag = true;
        if (CapitalItem === true) {
            $("#" + pageID).find("#CapitalGroupField").hide();
            $("#" + pageID).find("#CapitalSubGroupField").hide();
            $("#" + pageID).find("#CapitalEquipTagField").hide();
            $("#" + pageID).find("#CapitalInspectionItemField").show();
        }
    }
}

function InspectionCapital_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");
    var ProblemCodeDropDown = GetTranslatedValue("problemCodeDropDown");
    var NoLinkageLabel = GetTranslatedValue("NoLinkage");
    var AssetTagLabel = GetTranslatedValue("AssetTag");
    var InspectionItemLabel = GetTranslatedValue("InspectionItem");

    $(pageID).find("#projectTypeDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#capitalProblemCodeDropDown").html('<option value="-1">' + ProblemCodeDropDown + '</option>').selectmenu("refresh");
    $(pageID).find("#capitalPriorityDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#fciScoreDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#fciPriorityDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#capitalStatusDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#CapitalGroupDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#CapitalSubGroupDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#CapitalEquipTagDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#InspectionItemDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#CapitalGroupDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");

    $(pageID).find("#linkageDropDown").html('<option value="NoLinkage">' + NoLinkageLabel + '</option>'
                                        + '<option value="AssetTag">' + AssetTagLabel + '</option>'
                                        + '<option value="InspectionItem">' + InspectionItemLabel + '</option>');
    $(pageID).find("#linkageDropDown").selectmenu("refresh");
    
    $('#capitalLevel1ValueLabel').text(getLocal("RegionDescription"));
    $('#capitalLevel2ValueLabel').text(getLocal("DivisionDescription"));
    if (getLocal("ItemName") != null && getLocal("ItemName") != 'null' &&
        (getLocal("InspectionPageName") == "InspectionItem" || getLocal("InspectionPageName") == "InspectionEditItem")) {
        $('#itemDescriptionValueLabel').text(getLocal("ItemName"));
    }
    else {
        $('#itemDescriptionValueLabel').text('');
    }
}

