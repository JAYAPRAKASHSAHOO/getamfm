function SetSToDateTextBox(date) {
    if (date.length === 0) {
        $("#SearchOrder").find("#SFromDateTextBox").val(getTodayDate());
        return;
    }
    $("#SearchOrder").find("#SToDateTextBox").attr("min", date);
}

function loadCompletionDDL(completionData) {
    var selectedValue;
    var options = $("#SCompletionDDL");
    $.each(completionData, function () {
        options.append($("<option />").val(this.Value).text(this.Text));
        if (this.Selected) {
            selectedValue = this.Value;
        }
    });
    $("#SCompletionDDL").val(selectedValue);
    $('#SCompletionDDL').selectmenu("refresh");
}

function loadOrderTypeDDL(orderTypeData) {
    var selectedValue;
    var options = $("#OrderTypeDDL");
    $.each(orderTypeData, function () {
        options.append($("<option />").val(this.OrderTypeSeq).text(this.OrderTypeText));
        if (this.Selected) {
            selectedValue = this.Value;
        }
    });
    $("#OrderTypeDDL").val(selectedValue);
    $('#OrderTypeDDL').selectmenu("refresh");

    var previousValues = localStorage.getItem("OrederTypeValues");
    if (previousValues !== null && previousValues != "null") {
        previousValues = previousValues.split(',');
        $("#OrderTypeDDL").val(previousValues);
        $('#OrderTypeDDL').selectmenu("refresh");
    }
}

function loadSortByDDL(sortByData) {
    var selectedValue;
    var options = $("#SSortDDL");
    $.each(sortByData, function () {
        options.append($("<option />").val(this.Value).text(this.Text));
        if (this.Selected) {
            selectedValue = this.Value;
        }
    });
    $("#SSortDDL").val(selectedValue);
    $('#SSortDDL').selectmenu("refresh");
}

function loadCategoryDDL(categoryData) {
    var selectedValue;
    var options = $("#SCategoryDDL");
    options.html('<option value="0">' + GetCommonTranslatedValue('AllLabel') + '</option>');
    $.each(categoryData, function () {
        options.append($("<option />").val(this.EquipGroupNumber).text(this.Description));
        if (this.Selected) {
            selectedValue = this.EquipGroupNumber;
        }
    });
    $("#SCategoryDDL").val(selectedValue);
    $('#SCategoryDDL').selectmenu("refresh");
}

function loadCategoryDDL(entityName, categoryData) {
    var selectedValue;
    var options = $(entityName);
    options.html('<option value="-1">' + GetCommonTranslatedValue('AllLabel') + '</option>');
    $.each(categoryData, function () {
           options.append($("<option />").val(this.EquipGroupNumber).text(this.Description));
           if (this.Selected) {
           selectedValue = this.EquipGroupNumber;
           }
           });
    
    if (!IsStringNullOrEmpty(selectedValue)) {
        $(entityName).val(selectedValue);
    } else {
        $(entityName).val($(entityName).find(" option:first").val());
    }
    
    $(entityName).selectmenu("refresh");
}

function loadSubCategoryDDL(entityName, subCategoryData) {
    var selectedValue;
    var options = $(entityName);
    options.html('<option value="-1">' + GetCommonTranslatedValue('AllLabel') + '</option>');
    $.each(subCategoryData, function () {
           options.append($("<option />").val(this.EquipStyleNumber).text(this.Description).attr('data-equip-group', this.EquipGroupNumber));
           if (this.Selected) {
           selectedValue = this.EquipStyleNumber;
           }
           });
    
    if (!IsStringNullOrEmpty(selectedValue)) {
        $(entityName).val(selectedValue);
    } else {
        $(entityName).val($(entityName).find(" option:first").val());
    }
    
    $(entityName).selectmenu("refresh");
}

function loadEquipmentTypeDDL(entityName, equipmentTypeData) {
    var selectedValue;
    var options = $(entityName);
    options.html('<option value="-1">' + GetCommonTranslatedValue('AllLabel') + '</option>');
    $.each(equipmentTypeData, function () {
           options.append($("<option />").val(this.Value).text(this.Text));
           if (this.Selected) {
           selectedValue = this.Value;
           }
           });
    
    if (!IsStringNullOrEmpty(selectedValue)) {
        $(entityName).val(selectedValue);
    } else {
        $(entityName).val($(entityName).find(" option:first").val());
    }
    
    $(entityName).selectmenu("refresh");
}

function SetEquipGroupCriteria(subGroupEntity, groupEntityName) {
    if (subGroupEntity.value !== "-1") {
        var groupNumber = $(subGroupEntity).find(' option[value="' + $(subGroupEntity).val() + '"]').attr('data-equip-group');
        $(groupEntityName).val($(groupEntityName).find(' option[value="' + groupNumber + '"]').first().val());
        $(groupEntityName).selectmenu("refresh");
    }
}

/**
 * Hide/disable any Sub Group criteria for a given dropdown that does not roll up to the selected Group.
 * @param [object] groupEntity - The object/entity that contains the selected group to filter on.
 * @param [string] subGroupEntityName - The name of the dropdown entity that we're going to filter.
 */
function SetEquipSubGroupCriteria(groupEntity, subGroupEntityName) {
    var selectedVal = $(subGroupEntityName).val();
    $(subGroupEntityName).find('option')
    .each(function() {
        $(this).removeAttr('hidden');
        $(this).removeAttr('disabled');
        if (groupEntity.value !== "-1") {
            if (this.value !== "-1" && $(this).attr('data-equip-group') !== $(groupEntity).val()) {
                $(this).attr('hidden', 'hidden');
                $(this).attr('disabled', 'disabled');
            }
        }
    });

    // Reset the subGroup dropdown if the selected value is disabled/hidden.
    if ($(subGroupEntityName).find('option:selected:hidden:disabled')) {
        selectedVal = -1;
    }
    
    // Sort the non-disabled options to the top of the list (in case hidden is unsupported).
    var optionList = $(subGroupEntityName).find('option').sort(function(a,b) {
        return ($(a).attr('disabled') === $(b).attr('disabled')) ? 0 : ($(a).attr('disabled') == 'disabled' && $(b).attr('disabled') != 'disabled' ? 1 : -1); });
    
    $(subGroupEntityName).html(optionList);
    $(subGroupEntityName).val(selectedVal);
    $(subGroupEntityName).selectmenu("refresh");
}

function HideUl(ctrl) {
    try {
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find("#CompletionDiv,#LocationDiv,#CategoryDiv,#DateBlockDiv,#SortByDiv,#OrderTypeUL").show();
        if ($(ctrl).val().length > 0) {
            $("#" + pageID).find("#CompletionDiv,#LocationDiv,#CategoryDiv,#DateBlockDiv,#SortByDiv,#OrderTypeUL").hide();
        }
    }
    catch (e) {
    }
}

function PostSearchData() {
    var pageID = $.mobile.activePage.attr("id");
    if (pageID == "DailySearchOrder") {
        if (navigator.onLine) {
            StoreSearchCriteriaToLocalStorage();
            $.mobile.changePage('WorkOrdersView.html');
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    }
    else {
        try {
            if (navigator.onLine) {
                if ($("#" + pageID).find("#SWONumTextBox").val() === '') {
                    StoreSearchCriteriaToLocalStorage();
                    switch(getLocal("SSortDDL")) {
                        case "1":
                            //setLocal("WorkOrderViewGroupByValue", "PRIORITY");
                            break;
                        case "2":
                            setLocal("WorkOrderViewGroupByValue", "ENTEREDDATE");
                            break;
                        case "4":
                            setLocal("WorkOrderViewGroupByValue", "STATUS");
                            break;
                        case "5":
                            //setLocal("WorkOrderViewGroupByValue", "PRIORITY");
                            break;
                        case "6":
                            setLocal("WorkOrderViewGroupByValue", "ETADATE");
                            break;
                        default:
                            // Default is 3, priority sort.  Always.
                            setLocal("WorkOrderViewGroupByValue", "PRIORITY");
                            break;
                    }
                    
                    $.mobile.changePage('WorkOrdersView.html');
                }
                else {
                    if ($("#WODetails").length > 0) {
                        $("#WODetails").remove();
                    }
                    // var WorkOrderID = $.trim($("#" + pageID).find("#SWONumTextBox").val());
                    var WorkOrderID = securityError($("#" + pageID).find("#SWONumTextBox"));
                    localStorage.setItem("WorkOrderNumber", WorkOrderID);
                    $.mobile.changePage("WorkOrderDetails.html");
                }
            }

            else {
                ////showError("No network connection. Please try again when network is available.");
                showError(GetCommonTranslatedValue("NoNetworkCommon"));
            }
        } //try end
        catch (e) {
        }
    }   
}

function HideDate() {
    try {
        if ($("#SearchOrder").find("#DateSearchChk").is(":checked")) {
            $("#SearchOrder").find("#DateSearchDiv").show();
            $("#SearchOrder").find("#DateSearchDiv").attr('style','display:block !important');
        }
        else {
            $("#SearchOrder").find("#DateSearchDiv").hide();
            $("#SearchOrder").find("#DateSearchDiv").attr('style', 'display:hide');
        }
    }
    catch (e) {
    }
}