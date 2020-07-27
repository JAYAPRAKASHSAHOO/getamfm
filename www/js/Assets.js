var Assets = {};

/**
* Store the Asset Search criteria into the local DB.
*/
Assets.StoreSearchCriteria = function () {
    try {
        var pageID = "#" + $.mobile.activePage.attr("id");

        // Reuse the existing L1-4 storage, then store the rest of the criteria in AS (AssetSearch) properties.
        setLocal("SL1_DropDownListValue", ($(pageID).find("#SStCityValue").attr("data-value")));
        setLocal("SL1_DropDownListText", ($(pageID).find("#SStCityValue").text()));

        setLocal("SL2_DropDownListValue", ($(pageID).find("#SBuildingValue").attr("data-value")));
        setLocal("SL2_DropDownListText", ($(pageID).find("#SBuildingValue").text()));

        setLocal("SL3_DropDownListValue", ($(pageID).find("#SFloorValue option:selected").val()));
        setLocal("SL3_DropDownListText", ($(pageID).find("#SFloorValue option:selected").text()));

        setLocal("SL4_DropDownListValue", ($(pageID).find("#SRoomValue option:selected").val()));
        setLocal("SL4_DropDownListText", ($(pageID).find("#SRoomValue option:selected").text()));

        setLocal("ASEquipGroupNumber", $(pageID).find("#EquipGroupDDL").val());
        setLocal("ASEquipStyleNumber", $(pageID).find("#EquipStyleDDL").val());
        setLocal("ASPartDescription", securityError($(pageID).find("#PartDescriptionTextBox")));
        setLocal("ASInstallDescription", securityError($(pageID).find("#InstalledDescriptionTextBox")));
        setLocal("ASManufacturer", securityError($(pageID).find("#ManufacturerTextBox")));
        setLocal("ASModel", securityError($(pageID).find("#ModelTextBox")));
        setLocal("ASPartType", $(pageID).find("#EquipTypeDDL").val());
        setLocal("ASPMJobNumber", securityError($(pageID).find("#PMJobTextBox")));
    }
    catch (e) {
    }
}

/**
* Configure the Asset Search criteria fields based on security.
*/
Assets.EnforceSearchParameterSecurity = function () {
    // Handle security for the new fields.
    var SgtCollection = $.GetSecuritySubTokens(400045, 0);

    EnforceFieldSecurity(SgtCollection, "Tag Number", false);
    EnforceFieldSecurity(SgtCollection, "Location", false);
    EnforceFieldSecurity(SgtCollection, "Equipment Group", false);
    EnforceFieldSecurity(SgtCollection, "Equipment Sub Group", false);
    EnforceFieldSecurity(SgtCollection, "Part Description", false);
    EnforceFieldSecurity(SgtCollection, "Installed Description", false);
    EnforceFieldSecurity(SgtCollection, "Manufacturer", false);
    EnforceFieldSecurity(SgtCollection, "Model", false);
    EnforceFieldSecurity(SgtCollection, "Equipment Type", false);
    EnforceFieldSecurity(SgtCollection, "PM Job", false);

    $('.SearchOrderUl').each(function () {
        if ($(this).find(':visible').length <= 1) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });
}

/**
* Validate the search criterion for Asset Searches.
* @returns [bool] - true if the criteria has at least one populated value.
*/
function ValidateSearchCriteria() {
    var isValid = false;
    var validCount = 0;

    // Criteria is only valid if there is at least one parameter.
    if (!IsStringNullOrEmpty(getLocal("SL1_DropDownListValue").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("SL2_DropDownListValue").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("SL3_DropDownListValue").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("SL4_DropDownListValue").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASEquipGroupNumber").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASEquipStyleNumber").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASPartDescription").replace(/%/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASInstallDescription").replace(/%/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASManufacturer").replace(/%/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASModel").replace(/%/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASPartType").replace(/-1/gi, '').trim())) {
        validCount++;
    }

    if (!IsStringNullOrEmpty(getLocal("ASPMJobNumber").replace(/%/gi, '').trim())) {
        validCount++;
    }

    if (validCount > 0) {
        isValid = true;
    }

    return isValid;
}

/**
* Populate the Search criteria for Asset Search into the local db and load the next page.
*/
Assets.PostSearchData = function () {
    var pageID = $.mobile.activePage.attr("id");
    try {
        if (navigator.onLine) {
            if ($("#" + pageID).find('[data-field="Tag Number"] textarea').val() === '') {
                Assets.StoreSearchCriteria();

                if (ValidateSearchCriteria()) {
                    setLocal("AssetListMode", "SearchResults");
                    $.mobile.changePage('AssetsList.html');
                } else {
                    showError(GetTranslatedValue("SearchCriteriaRequired"));
                }
            } else {
                setLocal("showLoading", "false");
                setLocal("TagNumber", securityError($("#" + pageID).find('[data-field="Tag Number"] textarea')));

                if (!IsStringNullOrEmpty(getLocal("TagNumber"))) {
                    $.mobile.changePage("AssetDashboard.html");
                } else {
                    showError(GetTranslatedValue("SearchCriteriaRequired"));
                }
            }
        } else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }
    } //try end
    catch (e) {
    }
}

/**
* Hide options with an expected criteria set of multiple results when the input is populated.
* @param [object] ctrl - A search criteria entity assumed to expect a single result upon completion.
*/
Assets.HideOptions = function (ctrl) {
    try {
        var pageID = $.mobile.activePage.attr("id");
        $("#" + pageID).find('[data-expected-results="multiple"]').show();
        if ($(ctrl).val().length > 0) {
            $("#" + pageID).find('[data-expected-results="multiple"]').hide();
        }
    } catch (e) {
    }
}

function GetAssetSearchResults() {
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "RegionNumber": getLocal("SL1_DropDownListValue"),
        "DivisionNumber": getLocal("SL2_DropDownListValue"),
        "DistrictNumber": getLocal("SL3_DropDownListValue"),
        "CustomerSiteNumber": getLocal("SL4_DropDownListValue"),
        "EquipGroupNumber": getLocal("ASEquipGroupNumber") == "null" ? null : getLocal("ASEquipGroupNumber"),
        "EquipStyleNumber": getLocal("ASEquipStyleNumber") == "null" ? null : getLocal("ASEquipStyleNumber"),
        "PartDescription": getLocal("ASPartDescription"),
        "InstallDescription": getLocal("ASInstallDescription"),
        "Manufacturer": getLocal("ASManufacturer"),
        "Model": getLocal("ASModel"),
        "PartType": getLocal("ASPartType") == "null" ? null : getLocal("ASPartType"),
        "PMJobNumber": getLocal("ASPMJobNumber")
    });
    var viewAssetsURL = standardAddress + "AssetManager.ashx?method=GetAssetSearchResults";
    showLoading();
    DisplayAssetsCollapsible(viewAssetsURL, myJSONobject).always(function () {
        closeLoading();
    });
}

/**
* Reset the existing search information on the current form.
*/
function ResetSearchCriteria() {
    var pageID = $.mobile.activePage.attr('id');
    try {

        $("[data-expected-results] input, [data-expected-results] select, [data-expected-results] textarea")
        .each(function () {
            switch (this.tagName.toLowerCase()) {
                case "input":
                    // Special case for deselecting checkboxes
                    if (this.type.toLowerCase() === "checkbox") {
                        if ($(this).is(":checked") === true) {
                            $(this).click().checkboxradio("refresh");
                        }
                    } else {
                        $(this).val('').keyup();
                    }

                    break;
                case "select":
                    var defaultSelection = '';
                    if ($(this).attr("multiple") !== "multiple") {
                        // Set the default value to the first selection.  In case of multiple selection, we want nothing.
                        defaultSelection = $(this).find(" option:first").val();
                    }

                    // The data-reset-clear-criteria attribute is for dropdowns that contain dynamically generated content and need to be cleared on reset.
                    if ($(this).attr('data-reset-clear-criteria') == true) {
                        $(this).find(" option:gt(0)").remove();
                    }

                    if (!IsObjectNullOrUndefined($(this).attr('data-default-label'))) {
                        switch ($(this).attr('data-default-label').toLowerCase()) {
                            case "all":
                                $(this).find(" option:eq(0)").text(GetCommonTranslatedValue('AllLabel'));

                                // Because of L1 and L2 being labels, we will assume that the default label value rolls up from L4 to L1 & L2.
                                if (this.id === "SRoomValue") {
                                    $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('AllLabel')).val(-1);
                                    $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('AllLabel')).val(-1);
                                }

                                break;
                            case "select":
                                $(this).find(" option:eq(0)").text(GetCommonTranslatedValue('SelectLabel'));

                                // Because of L1 and L2 being labels, we will assume that the default label value rolls up from L4 to L1 & L2.
                                if (this.id === "SRoomValue") {
                                    $("#" + pageID).find("#SStCityValue").html(GetCommonTranslatedValue('SelectLabel')).val(-1);
                                    $("#" + pageID).find("#SBuildingValue").html(GetCommonTranslatedValue('SelectLabel')).val(-1);
                                }

                                break;
                        }
                    }

                    $(this).val(defaultSelection).selectmenu("refresh");
                    break;
                case "textarea":
                    $(this).val('').keyup();
                    break;
            }
        });

        $("#" + pageID).find("#OrderTypeDDL").val('');
        $("#" + pageID).find('#OrderTypeDDL').selectmenu("refresh");

        setTimeout(function () {
            setLocation();
        }, 1001);
        $.mobile.silentScroll(0);
        return false;
    }
    catch (e) {
    }
}
function BindSelectedPropertyDropDown(ts, result) {
    var item;
    var optiontag;
    var pageID = $.mobile.activePage.attr("id");

    $("#" + pageID).find('[data-search-criteria="PropertyID"] option:gt(0)').remove();
    $("#" + pageID).find('[data-search-criteria="PropertyID"]').selectmenu("refresh");
    var selectedValue = "-2";
    if (result.rows.length === 0) {
        var option = '<option value="-2">' + GetCommonTranslatedValue("LocationNotFound") + '</option>';
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').append(option);
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').val("-2");
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').selectmenu("refresh");
        return false;
    }
    if (result.rows.length == 1) {
        selectedValue = "-1";
        item = result.rows.item(0);
        optiontag = document.createElement('option');
        optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
        optiontag.innerHTML = item.PropertyText;
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').append(optiontag);
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').val(item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
        $("#" + pageID).find('[data-search-criteria="PropertyID"]').selectmenu("refresh");
        GetPropertyAssets($("#" + pageID).find('[data-search-criteria="PropertyID"]').val());
        return false;
    }
    if (result.rows.length > 1) {
        selectedValue = "-2";
        var firstTag = document.createElement('option');
        firstTag.setAttribute("value", "-2");
        firstTag.innerHTML = "-- [ " + result.rows.length.toString() + " ]" + GetCommonTranslatedValue("RecordsFound");
        $('[data-search-criteria="PropertyID"]').append(firstTag);
        var i = 0;
        for (i = 0; i < result.rows.length; i++) {
            item = result.rows.item(i);
            optiontag = document.createElement('option');
            optiontag.setAttribute("value", item.PropertyID + '|' + item.RegionID + '|' + item.RegionText);
            optiontag.innerHTML = item.PropertyText;
            $("#" + pageID).find('[data-search-criteria="PropertyID"]').append(optiontag);
        }
    }
    $('[data-search-criteria="PropertyID"]').val(selectedValue);
    $("#" + pageID).find('[data-search-criteria="PropertyID"]').selectmenu("refresh");
}

function GetPropertyAssets(value) {
    var pageID = $.mobile.activePage.attr('id');
    if (value != -1) {
        var valueArray = value.split('|');
        var data = [];
        data[0] = valueArray[2];
        data[1] = valueArray[1];
        data[3] = valueArray[0];

        var searchText = $('#' + pageID).find('#propertyIDText').val();
        setLocal("assetLocationSearchText", searchText);
        setLocal("RegionDescription", data[0]);
        setLocal("DivisionDescription", $("#" + pageID).find("#propertyIDDropDown option:selected").html());
        setLocal("RegionNumber", data[1]);
        setLocal("DivisionNumber", data[3]);
        GetAssets(data[1], data[3]);
    }
};

function GetAssets(level1Value, level2Value) {
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "RegionNumber": level1Value,
        "DivisionNumber": level2Value,
        "TagNumber": null
    });
    var viewAssetsURL = standardAddress + "AssetManager.ashx?method=GetAssetDetails";
    DisplayAssetsCollapsible(viewAssetsURL, data);
};

////added the below code to make asset rows collapsible
function DisplayAssetsCollapsible(viewAssetsURL, viewAssetsData) {
    var progress = new $.Deferred();
    $("#noAssetsDiv").hide();
    var assetRecords = false;
    var noAssetRecords = true;
    $.postJSON(viewAssetsURL, viewAssetsData, function (resultData) {
        $('#dynamicCollapsible').empty();
        try {
            var length = resultData.length;
            //var dynamicCollapsibleList = '';
            var HTTagNumber = GetCommonTranslatedValue("TagNumberLabel");
            var HTPartDescription = GetTranslatedValue("PartDescriptionLabel");
            var HTInstallDescription = GetTranslatedValue("InstallDescriptionLabel");
            var HTInstallDate = GetTranslatedValue("installDateLabel");
            var dynamicList = '';
            var noDescription = "< " + GetTranslatedValue("NoAssetDescription") + " >";
            var ulTag = document.createElement('ul');
            ulTag.setAttribute("class", "ui-listview");
            ulTag.setAttribute("data-role", "listview");
            if (length > 0) {
                assetRecords = true;
                noAssetRecords = false;
            }

            for (var index = 0; index < length; index++) {
                // This is for collapsible lists
                // dynamicCollapsibleList = dynamicCollapsibleList + '<div data-role="collapsible" id=' + resultData[index].TagNumber + ' class="collapsibleBackground" data-inset="true">' +
                //     '<h4 onclick="getAssetCollapsibleData(this);"><strong class="boldfont">' + resultData[index].PartDescription + '</strong></h4></div>';

                if (resultData[index].PartDescription == null || resultData[index].PartDescription == undefined) {
                    resultData[index].PartDescription = "";
                }

                if (resultData[index].DateInstalled == null || resultData[index].DateInstalled == undefined) {
                    resultData[index].DateInstalled = "";
                }

                if (resultData[index].InstalledDescription == null || resultData[index].InstalledDescription == undefined) {
                    resultData[index].InstalledDescription = "";
                }

                // This is for a non-collapsible list.
                dynamicList = dynamicList + '<li><a id="' + resultData[index].TagNumber + '"  href="#"  onclick="javascript:NavigateToTagDashboard(' + resultData[index].TagNumber + ')" class="ui-link-inherit">'
                           + '<span style="font-size: 0.9em">' + HTTagNumber + ' ' + resultData[index].TagNumber + '</span><br />'
                           + '<span style="font-size: 0.9em">' + HTPartDescription + ' ' + resultData[index].PartDescription + '</span><br />'
                           + '<span style="font-size: 0.8em">' + HTInstallDate + ' ' + GetDateText(GetDateObjectFromInvariantDateString(resultData[index].DateInstalled)) + '</span><br />'
                           + '<span style="font-size: 0.8em;white-space:normal">' + HTInstallDescription + ' ' + resultData[index].InstalledDescription + '</span></a></li>';
            } // end of for     

            $('.equiptag-content').find('#dynamicAssetsCollapsible').empty();
            ulTag.innerHTML = ulTag.innerHTML + dynamicList;
            $('.equiptag-content').find('#dynamicAssetsCollapsible').append(ulTag);
            $('.equiptag-content').find('#dynamicAssetsCollapsible').trigger('create');
        }
        catch (e) {
            //log(e);
        }

        if (assetRecords === false && noAssetRecords === true) {
            $("#noAssetsDiv").show();
            //$('#AssetNotFound').html(GetTranslatedValue('noAssetsDiv'));
        }
        progress.resolve();
    })
    return progress.promise();
};

function getAssetCollapsibleData(obj) {
    var tagID = obj.parentNode.id;
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "RegionNumber": getLocal("RegionNumber"),
        "DivisionNumber": getLocal("DivisionNumber"),
        "TagNumber": tagID
    });

    var viewAssetURL = standardAddress + "AssetManager.ashx?method=GetAssetDetails";
    DisplayAssets(viewAssetURL, data, tagID);
};

function NavigateToTagDashboard(TagNumber) {
    setLocal("showLoading", "false");
    setLocal("TagNumber", TagNumber);
    if ($.mobile.activePage.attr('id') === "AssetsList" && getLocal("AssetListMode") === "SearchResults") {
        setLocal("ScreenName", getLocal("ScreenName") + "\\AssetList");
    }
    $.mobile.changePage("AssetDashboard.html");
};

function PrepareTagDetails() {
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "RegionNumber": IsStringNullOrEmpty(getLocal("RegionNumber")) ? "" : getLocal("RegionNumber"),
        "DivisionNumber": IsStringNullOrEmpty(getLocal("DivisionNumber")) ? "" : getLocal("DivisionNumber"),
        "TagNumber": getLocal("TagNumber")
    });

    var viewAssetURL = standardAddress + "AssetManager.ashx?method=GetAssetDetails";
    GetTagDetails(viewAssetURL, data);
}

var tagDetails = "";
function GetTagDetails(orderDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $("#NoTagDetails").hide();
        $("#TagDetailsCollapsible").show();
        $.postTagDetailsJSON(orderDetailsURL, myJSONobject, function (data) {

            if (data.TagNumber && data.TagNumber !== null) {
                tagDetails = data;
                FillTagDashboard(tagDetails);
                $('#TagNum').html(GetTranslatedValue("TagNum") + ' ' + getLocal("TagNumber"));
            }
            else {
                $("#NoTagDetails").show();
                $("#TagDetailsCollapsible").hide();
                $("#EquipTagLinks").hide();
                $('#TagNum').html(GetTranslatedValue("AssetDashboardLabel"));
                $("#TagMenuButton").addClass("ui-disabled");
                closeLoading();
            }
        });
    }
}

function FillTagDashboard(data) {
    $("#DetGroupNameVal").html(data.GroupDescription);
    $("#TagNumberTxt").html(data.TagNumber);
    $("#DetInstallDescriptionVal").html(data.InstalledDescription);
    $("#DetPartNumberVal").html(data.PartNumber);
    $("#DetInstalledDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.DateInstalled)));
    $("#DetPartDescriptionVal").html(data.PartDescription);
    $("#DetSerialNumberVal").html(data.SerialNumber);
    $("#DetWarrantyPartsVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.DateWarrantyParts)));
    $("#DetWarrantyLaborVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.DateWarrantyService)));
    $("#DetTagDetailsVal").html(data.TagDetails);
    $("#DetTagNotesVal").html(data.Notes);
    $("#DetMakeVal").html(data.Manufacturer || "");
    $("#DetaModelVal").html(data.Model || "");

    // Build the location from L1-4
    $("#DetLocationVal").html(data.CountryCity + '/<wbr>' + data.Building + '/<wbr>' + data.Floor + '/<wbr>' + data.Area);

    $("#LCTagConditionVal").html(data.TagCondition);
    // This is probably a boolean image check. add Checkmark or x style depending on flag.
    if (data.CriticalAsset) {
        $("#LCCriticalAssetImg").addClass('img-approve');
    }
    else {
        $("#LCCriticalAssetImg").addClass('img-reject');
    }

    $("#LCExpectedLifeAdjustmentVal").html(data.ExpectedLifeAdjust);
    $("#LCInstalledDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.DateInstalled)));
    setLocal("DateInstalled", data.DateInstalled);

    $("#LCCostDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.CostDate)));

    if (!IsStringNullOrEmpty(data.ReplacementCost) && !IsStringNullOrEmpty(data.CurrencyCode)) {
        $("#LCReplacementCostVal").html(data.ReplacementCost + " " + data.CurrencyCode);
    }

    $("#LCReplacementPartVal").html(data.ReplacementPart);
    $("#LCReplacementTypeVal").html(data.ReplacementType);

    if (data.ReplacementScheduled) {
        $("#LCReplacementScheduleImg").addClass('img-approve');
    }
    else {
        $("#LCReplacementScheduleImg").addClass('img-approve');
    }

    $("#LCOriginalExpirationVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.LifecycleExpireDate)));
    $("#LCMidlifeCheckVal").html(data.MidlifeCheck);
    $("#LCMidlifeDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.MidlifeDate)));
    $("#LCPlanningEvaluationVal").html(data.PlanningEvaluation);
    $("#LCPlanningDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.PlanningDate)));
    $("#LCScheduledReplacementVal").html(data.ScheduledReplacement);
    $("#LCScheduledDateVal").html(GetDateText(GetDateObjectFromInvariantDateString(data.ScheduledDate)));

    //$("#LCFooterVal").html(data.ConFMNameVal);
    TagPopupMenu('tagTasks');

    setLocal("InstalledDescription", data.InstalledDescription);
    setLocal("PartDescription", data.PartDescription);
    setLocal("TagNumber", data.TagNumber);
    setLocal("CountryCity", data.CountryCity);
    setLocal("Building", data.Building);
    setLocal("Floor", data.Floor);
    setLocal("Area", data.Area);
    setLocal("RegionNumber", data.RegionNumber);
    setLocal("DivisionNumber", data.DivisionNumber);
    setLocal("DistrictNumber", data.DistrictNumber);
    setLocal("CustomerNumber", data.CustomerNumber);
    setLocal("CustomerSiteNumber", data.CustomerSiteNumber);
    closeLoading();
}

function PrepareTagActions() {
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "RegionNumber": getLocal("RegionNumber"),
        "DivisionNumber": getLocal("DivisionNumber"),
        "TagNumber": getLocal("TagNumber")
    });

    var viewAssetURL = standardAddress + "AssetManager.ashx?method=GetAssetDetails";
    GetTagActions(viewAssetURL, data);
}

function GetTagActions(orderDetailsURL, myJSONobject) {
    var tagDetails = "";
    if (navigator.onLine) {
        $.postTagDetailsJSON(orderDetailsURL, myJSONobject, function (data) {

            if (data.TagNumber !== null) {
                tagDetails = data;
                FillTagActions(tagDetails);
            }
        });
    }
}

function FillTagActions(data) {
    $("#instDescrTextArea").val(data.InstalledDescription);
    $("#installDate").val(moment(data.DateInstalled).format('YYYY-MM-DD'));
    $("#serialNumberTextArea").val(data.SerialNumber);
    $("#barcodeIDTextArea").val(data.BarcodeId);
    $("#tagDetailsTextArea").val(data.TagDetails);
    $("#notesTextArea").val(data.Notes);
    $("#manufacturerTextArea").val(data.Manufacturer);
    $("#modelTextArea").val(data.Model);

    // Handle security for the new fields.
    var SgtCollection = $.GetSecuritySubTokens(400044, 0);
    // These are system required for now (first 5).
    EnforceFieldSecurity(SgtCollection, "Barcode ID", true);
    EnforceFieldSecurity(SgtCollection, "Installed Description", true);
    EnforceFieldSecurity(SgtCollection, "Serial Number", true);
    EnforceFieldSecurity(SgtCollection, "Tag Details", true);
    EnforceFieldSecurity(SgtCollection, "Notes", true);
    EnforceFieldSecurity(SgtCollection, "Manufacturer", false);
    EnforceFieldSecurity(SgtCollection, "Model", false);
}

// Submit transactions to server.
function UpdateTagDetails(json) {
    var updateURL = standardAddress + "AssetManager.ashx?method=" + getLocal("RequestedAction");

    if (navigator.onLine) {
        $.postTagDetailsJSON(updateURL, json, function (data) {

            closeActionPopupLoading();
            setTimeout(function () {
                ActionCallBack(data);
            }, 1000);
        });
    }
}

// Prepare the JSON for getting recent orders.
function PrepareRecentOrders(status) {
    var myJSONobject = iMFMJsonObject({
        Username: decryptStr(getLocal("Username")),
        Status: status,
        TagNumber: getLocal("TagNumber")
    });

    var ordersURL = standardAddress + "AssetManager.ashx?method=GetRecentOrders";

    GetRecentOrders(ordersURL, myJSONobject);
}

function GetRecentOrders(ordersURL, myJSONobject) {

    if (navigator.onLine) {
        $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
            BindRecentOrders(myJSONobject.Status, data.Table);
        });
    }
    else {

    }
}

function BindRecentOrders(orderStatus, result) {
    pageID = $.mobile.activePage.attr("id");
    var HTPriority = GetTranslatedValue("PriorityLabel");
    var HTStatus = GetTranslatedValue("StatusLabel");
    var HTAssignment = GetTranslatedValue("AssignmentLabel");
    var key = 0;
    var noOrders = true;
    var listID = "#" + $("#" + pageID).find(".Recent" + orderStatus + "WOListDiv").attr('id');

    if (result.length > 0) {
        noOrders = false;
    }

    // This ultag element is necessary for formatting.
    var ultag;
    ultag = document.createElement('ul');
    ultag.setAttribute("class", "ui-listview");
    ultag.setAttribute("data-role", "listview");

    for (var i = 0; i < result.length; i++) {
        var appending;
        var count;

        var wo = "'" + result[i].WorkOrderNumber + "'";
        var AssignName = result[i].AssignedName;

        // Create the contents for the WO list entry.
        appending = '<li><a id="' + result[i].WorkOrderNumber + '"  href="#"  onclick="javascript:navigateToWorkOrderDetailsPage(' + wo + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ' ' + result[i].Priority + '</strong></p>'
                + '<span style="font-size: 0.9em">' + result[i].WorkOrderNumber + '</span><br />'
                + '<span style="font-size: 0.9em">' + HTStatus + ' ' + result[i].Status + '</span><br />'
                + '<span style="font-size: 0.8em">' + HTAssignment + ' ' + AssignName + '</span><br />'
                + '<span style="font-size: 0.8em">' + result[i].Location + '</span></a></li>';

        ultag.innerHTML = ultag.innerHTML + appending;
    }

    $(listID).empty();
    $(listID).append(ultag);
    $(listID).trigger('create');

    if (noOrders) {
        $("#noRecent" + orderStatus + "Order").show();
    }
    //$(listID).collapsibleset("refresh");
}

function PrepareAssetPMJobs() {
    var myJSONobject = iMFMJsonObject({
        Username: decryptStr(getLocal("Username")),
        TagNumber: getLocal("TagNumber")
    });

    var ordersURL = standardAddress + "AssetManager.ashx?method=GetAssetPMJobs";

    GetAssetPMJobs(ordersURL, myJSONobject);
}

function GetAssetPMJobs(pmJobURL, myJSONobject) {
    if (navigator.onLine) {
        $.ajaxpostJSON(pmJobURL, myJSONobject, function (data) {
            BindAssetPMJobs(data.Table);
        });
    }
    else {

    }
}

function BindAssetPMJobs(result) {
    pageID = $.mobile.activePage.attr("id");
    var HTJobID = GetTranslatedValue("JobIDLabel");
    var HTJobKey = GetTranslatedValue("JobKeyLabel");
    var HTLib = GetTranslatedValue("JobLibraryLabel");
    var HTDescription = GetTranslatedValue("DescriptionLabel");
    var HTRunType = GetTranslatedValue("RunTypeLabel");
    var HTRunDate = GetTranslatedValue("NextRunDateLabel");
    var noOrders = true;
    var listID = "#" + $("#" + pageID).find(".PMJobListDiv").attr('id');

    if (result.length > 0) {
        noOrders = false;
    }

    // This ultag element is necessary for formatting.
    var ultag;
    ultag = document.createElement('ul');
    ultag.setAttribute("class", "ui-listview");
    ultag.setAttribute("data-role", "listview");

    for (var i = 0; i < result.length; i++) {

        var appending;
        var count;
        var dateText = GetDateObjectFromInvariantDateString(result[i].DateNextRun);
        var pm = "'" + result[i].PMLibSeq + "'";

        // Create the contents for the WO list entry.
//        appending = '<li><a id="' + result[i].PMSeq + '"  href="#"  onclick="javascript:navigateToPMJobDetailsPage(' + pm + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc">' + HTLib + ' ' + result[i].PMLibSeq + '</p>'
//                + '<span style="font-size: 0.9em">' + HTJobID + ' ' + result[i].PMSeq + '</span><br />'
//                + '<span style="font-size: 0.8em">' + HTJobKey + ' ' + result[i].AltKey + '</span><br />'
//                + '<span style="font-size: 0.8em">' + HTRunType + ' ' + result[i].RunType + '</span><br />'
//                + '<span style="font-size: 0.8em;white-space:normal">' + HTDescription + ' ' + result[i].Description + '</span><br />'
        //                + '<span style="font-size: 0.8em">' + HTRunDate + ' ' + GetDateTimeText(dateText, false) + '</span></a></li>';

        // Create the contents for the WO list entry.
        appending = '<li><a id="' + result[i].PMSeq + '"  href="#"  onclick="javascript:navigateToPMJobDetailsPage(' + pm + ')" class="ui-link-inherit">'
        + '<span class="ui-li-aside ui-li-desc">' + HTLib + ' ' + result[i].PMLibSeq + '</span><br />'
                + '<span style="font-size: 0.9em">' + HTJobID + ' ' + result[i].PMSeq + '</span><br />'
                + '<span style="font-size: 0.8em">' + HTJobKey + ' ' + result[i].AltKey + '</span><br />'
                + '<span style="font-size: 0.8em">' + HTRunType + ' ' + result[i].RunType + '</span><br />'
                + '<span style="font-size: 0.8em;white-space:normal">' + HTDescription + ' ' + result[i].Description + '</span><br />'
                + '<span style="font-size: 0.8em">' + HTRunDate + ' ' + GetDateTimeText(dateText, false) + '</span></a></li>';

        ultag.innerHTML = ultag.innerHTML + appending;
    }

    $(listID).empty();
    $(listID).append(ultag);
    $(listID).trigger('create');

    if (noOrders) {
        $("#noPMJobs").show();
    }
    //$(listID).collapsibleset("refresh");
}

function PrepareStatistics() {
    var myJSONobject = iMFMJsonObject({
        Username: decryptStr(getLocal("Username")),
        TagNumber: getLocal("TagNumber")
    });

    var ordersURL = standardAddress + "AssetManager.ashx?method=GetStatistics";

    GetAssetStats(ordersURL, myJSONobject);
}

function GetAssetStats(pmJobURL, myJSONobject) {
    if (navigator.onLine) {
        $.ajaxpostJSON(pmJobURL, myJSONobject, function (data) {
            BindAssetStats(data);
        });
    }
    else {
    }
}

function BindAssetStats(result) {
    // Set up the Problem code stats
    var noneLabel = GetTranslatedValue("NoneVal");
    var HTStats1Val = GetTranslatedValue("Stats1Val");
    var HTStats2Val = GetTranslatedValue("Stats2Val");
    var statHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + noneLabel;
    if (result.Table.length > 0) {
        statHTML = "";
        for (var i = 0; i < result.Table.length; i++) {
            statHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + result.Table[i].Description + ' : ' + result.Table[i].Cnt + '<br />';
        }
    }

    $("#Stats1Val").html(HTStats1Val + '<br />' + statHTML);

    // Set the next PM
    statHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + noneLabel;
    if (result.Table1.length > 0) {
        statHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + GetDateText(GetDateObjectFromInvariantDateString(result.Table1[0].DateNextRun)) + ' - ' + result.Table1[0].Description + '<br />';
    }

    $("#Stats2Val").html('<br />' + HTStats2Val + '<br />' + statHTML);
}

function navigateToWorkOrderDetailsPage(woNumber) {
    if (navigator.onLine) {
        setLocal("ScreenName", getLocal("ScreenName") + "\\AssetDashboard");
        setLocal("WorkOrderNumber", woNumber);
        $.mobile.changePage("WorkOrderDetails.html");
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function navigateToPMJobDetailsPage(pmSeq) {
    if (navigator.onLine) {
        setLocal("ScreenName", getLocal("ScreenName") + "\\AssetDashboard");
        setLocal("PMLibraryID", pmSeq);
        $.mobile.changePage("PMJobView.html");
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

// Prepare the JSON for getting full order history.
function PrepareOrderHistory(pageNum) {
    setLocal("PageNumber", pageNum);
    var myJSONobject = iMFMJsonObject({
        Username: decryptStr(getLocal("Username")),
        PageNumber: pageNum,
        TagNumber: getLocal("TagNumber")
    });

    var ordersURL = standardAddress + "AssetManager.ashx?method=GetOrderHistory";

    GetOrderHistory(ordersURL, myJSONobject);
}

function GetOrderHistory(ordersURL, myJSONobject) {

    if (navigator.onLine) {
        $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
            BindOrderHistory(data.Table, myJSONobject.PageNumber);
        });
    }
    else {

    }
}

function BindOrderHistory(result, pageNum) {
    pageID = $.mobile.activePage.attr("id");

    var key = 0;
    var noOrders = true;
    var listID = "#" + $("#" + pageID).find(".OrderHistoryWOListDiv").attr('id');

    if (result.length > 0) {
        noOrders = false;
    }

    // This ultag element is necessary for formatting.
    var ultag;
    ultag = document.createElement('ul');
    ultag.setAttribute("class", "ui-listview");
    ultag.setAttribute("data-role", "listview");

    var appending;
    if (pageNum > 1) {
        appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
        + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
        + '<a data-enhanced="true" id="prev" href="javascript:PrepareOrderHistory(' + (parseInt(getLocal("PageNumber")) - 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
        + '<span style="font-size: 0.9em" >Prev</span></a></div></li>';
        //<a id="prev" href="javascript:PrepareOrderHistory();" class="ui-link-inherit jscroll-prev"><span style="font-size: 0.9em">Prev</span></a></li>';
        ultag.innerHTML = ultag.innerHTML + appending;
    }
    for (var i = 0; i < result.length; i++) {
        //var appending;
        var count;

        var wo = "'" + result[i].WorkOrderNumber + "'";
        var AssignName = result[i].AssignedName;

        // Create the contents for the WO list entry.
        appending = '<li style="padding:0px;"><a id="' + result[i].WorkOrderNumber + '"  href="#"  onclick="javascript:navigateToWorkOrderDetailsPage(' + wo + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + result[i].Status + '</strong></p>'
                + '<span style="font-size: 0.9em">' + result[i].WorkOrderNumber + '</span><br />'
        //+ '<span style="font-size: 0.9em">' + HTStatus + ' : ' + result[i].Status + '</span><br />'
        + '<span style="font-size: 0.8em">' + GetDateText(GetDateObjectFromInvariantDateString(result[i].DateEntered)) + '</span><br />'
        + '<span style="font-size: 0.8em">' + result[i].ProblemDescription + '</span></a></li>';

        ultag.innerHTML = ultag.innerHTML + appending;
    }

    // Add the more button if there's more.
    var appending;

    if (result[0].TotalRecordCount > 5 * pageNum) {
        //appending = '<li style="padding:0px;"><a id="next" href="javascript:PrepareOrderHistory(' + (parseInt(getLocal("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-next"><span style="font-size: 0.9em">More</span></a></li>';
        appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
        + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
        + '<a data-enhanced="true" id="next" href="javascript:PrepareOrderHistory(' + (parseInt(getLocal("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
        + '<span style="font-size: 0.9em" >Next</span></a></div></li>';
        ultag.innerHTML = ultag.innerHTML + appending;

    }
    $(listID).empty();
    $(listID).append(ultag);
    $(listID).trigger('create');

    ////jscroller();

    //    if (noOrders) {
    //        $("#noRecent" + orderStatus + "Order").show();
    //    }
    $(listID).collapsibleset("refresh");
}

