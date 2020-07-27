function BindPropertyDropDown(value, callback) {
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#propertyIDDropDown option:gt(0)").remove();
    $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
    if (value.length >= 3) {
        openDB();
        dB.transaction(function (ts) {
            // Callback is required and should have ts, result params.
            ts.executeSql('SELECT PropertyID, RegionID, PropertyText,RegionText FROM PropertyTable WHERE TCC_Project_Number like ? or PropertyText like ? or RegionText like ? or AltKey like ? LIMIT 50 COLLATE NOCASE', ['%' + value + '%', '%' + value + '%', '%' + value + '%', '%' + value + '%'], callback, function (tx, error) {

            });
        });
    }
    else {
        return false;
    }
}

function BindSelectedValueToPropertyDropDown(ts, result) {
    var item;
    var optiontag;
    var pageID = $.mobile.activePage.attr("id");
    $("#" + pageID).find("#propertyIDDropDown option:gt(0)").remove();
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
        GetPropertyDetails($("#" + pageID).find("#propertyIDDropDown").val());
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

    var previousPage = localStorage.getItem("InspPrevScreen");
    if (previousPage == "CapitalPlanning") {
        var RegionDescription = localStorage.getItem("RegionDescription"); // data[0]);
        var DivisionDescription = localStorage.getItem("DivisionDescription"); //, $("#" + pageID).find("#propertyIDDropDown option:selected").html());
        var RegionNumber = localStorage.getItem("RegionNumber"); //, data[1]);
        var DivisionNumber = localStorage.getItem("DivisionNumber"); //, data[3]);                    
        $("#" + pageID).find("#propertyIDDropDown").val(DivisionNumber + '|' + RegionNumber + '|' + RegionDescription);
        $("#" + pageID).find("#propertyIDDropDown").selectmenu("refresh");
        localStorage.setItem("InspPrevScreen", "");
    }

}


function GetPropertyDetailsWithOptions(obj) {
    var pageID = $.mobile.activePage.attr('id');
    
    // Set the options based on which control called this.
    if (obj.id === "capitalSortDropDown") {
        setLocal("CapitalItemSort", obj.value);
    } else if (obj.id === "excludeLockedStatusSwitch") {
        setLocal("CapitalItemExcludeLocked", obj.value);
    }

    GetPropertyDetails($("#" + pageID).find("#propertyIDDropDown").val());
}

function GetPropertyDetails(value) {
    var pageID = $.mobile.activePage.attr('id');
    if (value != -1) {
        var valueArray = value.split('|');
        var data = [];
        data[0] = valueArray[2];
        data[1] = valueArray[1];
        data[3] = valueArray[0];

        if (IsStringNullOrEmpty(getLocal("CapitalItemSort"))) {
            GetPropertyDetailsWithOptions($("#" + pageID).find("#capitalSortDropDown")[0]);
        } else if (IsStringNullOrEmpty(getLocal("CapitalItemExcludeLocked"))) {
            GetPropertyDetailsWithOptions($("#" + pageID).find("#excludeLockedStatusSwitch")[0]);
        } else {
            var searchText = $('#' + pageID).find('#propertyIDText').val();
            localStorage.setItem("capitalSearchText", searchText);
            localStorage.setItem("RegionDescription", data[0]);
            localStorage.setItem("DivisionDescription", $("#" + pageID).find("#propertyIDDropDown option:selected").html());
            localStorage.setItem("RegionNumber", data[1]);
            localStorage.setItem("DivisionNumber", data[3]);
            GetCapitalItems(data[1], data[3]);
        }
    }
}

function GetCapitalItems(level1Value, level2Value) {
    var data = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "RegionNumber": level1Value,
        "DivisionNumber": level2Value,
        "ItemID": null,
        "ScreenName": "",
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    var viewCapitalURL = standardAddress + "Inspection.ashx?methodname=GetCapitalDetails";
    DisplayCapitalCollapsible(viewCapitalURL, data);
}

////added the below code to make capital items collapsible
function DisplayCapitalCollapsible(viewCapitalURL, viewCapitalData) {
    $("#noCapitalItemsDiv").hide();
    var pageID = $.mobile.activePage.attr('id');
    var capitalItemRecords = false;
    var noCapitalItemRecords = true;
    $.postJSON(viewCapitalURL, viewCapitalData, function (resultData) {
        $('#dynamicCollapsible').empty();
        try {
            var length = resultData.length;
            // If levelInit is populated, default collapsibleLevel to that value, otherwise init to 1.
            var collapsibleLevel = 1;
            var dynamicCollapsibleList = '';
            var lastDiv = "";
            switch(getLocal("CapitalItemSort").toUpperCase()) {
                case "STATUS":
                    resultData.sort(sort_Orders("CapitalStatus", true, null, ""));
                    break;
                case "BUDGETYEAR":
                    resultData.sort(sort_Orders("BudgetYear", true, null, ""));
                    break;
                case "DESCRIPTION":
                default:
                    // In case we need to.
               	    //collapsibleLevel = 2;
                    //break;
            }
               
            for (var index = 0; index < length; index++) {
                if (resultData[index].Tag == 6) {
                    capitalItemRecords = true;
                    noCapitalItemRecords = false;
                    var newDiv = document.createElement('div');
                    var newH4 = document.createElement('h4');
                    $("#" + pageID).find('#dynamicCapitalCollapsible').empty();
               
                    var collapsibleNode = buildCollapsibleNode(resultData[index], lastDiv, collapsibleLevel);
                    dynamicCollapsibleList += collapsibleNode[0];
                    lastDiv = collapsibleNode[1];
                } // end of if
                else if (resultData[index].Tag == 4) {
                    localStorage.setItem("Level1Label", resultData[index].Level1 + ":" + " ");
                    localStorage.setItem("Level2Label", resultData[index].Level2 + ":" + " ");
                }
            } // end of for     

            $("#" + pageID).find('#dynamicCapitalCollapsible').empty();
            $("#" + pageID).find('#dynamicCapitalCollapsible').append(dynamicCollapsibleList);
            $("#" + pageID).find('#dynamicCapitalCollapsible').trigger('create');
        }
        catch (e) {
            //log(e);
        }

        if (capitalItemRecords === false && noCapitalItemRecords === true) {
            $("#noCapitalItemsDiv").show();
            // $('#noCapitalItemsDiv').html("No capital Items");
            $('#noCapitalItemsDiv').html(GetTranslatedValue('noCapitalItemsDiv'));
        }
               
        $("#createCapital").show();
    });
}


// Build the collapsible node for filtering/description lists.
function buildCollapsibleNode(resultData, lastDiv, level) {
    var noDiscription = "&lt " +  GetTranslatedValue("NoCapitalDescriptionLabel") + " &gt";
    var noBudgetYear = "&lt " +  GetTranslatedValue("NoBudgetYearLabel") + " &gt";
    var noStatus = "&lt " +  GetTranslatedValue("NoStatusLabel") + " &gt";
    var displayLabel = noDiscription;
    var dHTML = '';
    var returnValues = [];
    
    // Check for locked status, if locked, do nothing.
    if ( getLocal("CapitalItemExcludeLocked").toUpperCase() === "YES" && resultData.CapitalStatus === "Locked" ) {
        returnValues.push(dHTML);
        returnValues.push(lastDiv);
        return returnValues;
    }
    
    if (level == 2) {
        displayLabel = (!IsStringNullOrEmpty(resultData.CapitalProjectDescr)) ? resultData.CapitalProjectDescr : displayLabel;
    } else {
        switch(getLocal("CapitalItemSort").toUpperCase()) {
            case "STATUS":
                displayLabel = (!IsStringNullOrEmpty(resultData.CapitalStatus)) ? resultData.CapitalStatus : noStatus;
                break;
            case "BUDGETYEAR":
                displayLabel = (!IsStringNullOrEmpty(resultData.BudgetYear) && resultData.BudgetYear !== 0) ? resultData.BudgetYear : noBudgetYear;
                break;
            case "DESCRIPTION":
            default:
                displayLabel = (!IsStringNullOrEmpty(resultData.CapitalProjectDescr)) ? resultData.CapitalProjectDescr : displayLabel;
                break;
        }
    }
    
    if (resultData.CapSeq !== null && resultData.CapSeq != "null" && resultData.CapSeq != "0") {
        if (lastDiv != displayLabel) {
            lastDiv = displayLabel;
            dHTML = '<div data-role="collapsible" id=' + resultData.CapSeq + ' class="collapsibleBackground collapsibleCapital" data-filter=' + displayLabel + ' >' +
            '<h4 onclick="getCapitalCollapsibleData(this);"><strong class="boldfont">' + displayLabel + '</strong></h4></div>';
        }
    }
    else {
        if (lastDiv != displayLabel) {
            lastDiv = displayLabel;
            dHTML = '<div data-role="collapsible" id=' + resultData.CapSeq + ' class="collapsibleBackground collapsibleCapital" >' +
            '<h4><strong class="boldfont">' + displayLabel + '</strong></h4>' +
            '<p><strong>' + GetTranslatedValue('noCapitalItemsDiv') + '</strong></p>' +
            '</div>';
        }
    }
    
    if (level == 2) {
        // If this is the first level, replace onclick because it's already populated and rename the child collapsible so it doesn't
        // share name with parent.
        dHTML = dHTML.replace('onclick="getCapitalCollapsibleData(this);', '').replace(resultData.CapSeq, resultData.CapSeq + 'CI').replace('data-filter=' + displayLabel, '');
    }
    if (level == 1 && getLocal("CapitalItemSort").toUpperCase() === "DESCRIPTION") {
        // Remove just the data filter because it causes issues with getCapitalCollapsibleData.
        dHTML = dHTML.replace('data-filter=' + displayLabel, '');
    }
    
    returnValues.push(dHTML);
    returnValues.push(lastDiv);
    
    // Will return the dynamic HTML at index 0 and the updated lastDiv at 1.
    return returnValues;
}

function getCapitalCollapsibleData(obj) {
    var ItemID = obj.parentNode.id;
    var data = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "RegionNumber": localStorage.getItem("RegionNumber"),
        "DivisionNumber": localStorage.getItem("DivisionNumber"),
        "ItemID": ItemID,
        "ScreenName": getLocal("CapitalItemSort"),       
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    var viewCapitalURL = standardAddress + "Inspection.ashx?methodname=GetCapitalDetails";
    DisplayCapitalItems(viewCapitalURL, data, ItemID);
}

function DisplayCapitalItems(viewCapitalURL, viewCapitalData, ItemID) {
    var istag = false;
    $.postJSON(viewCapitalURL, viewCapitalData, function (resultData) {
        try {
            var length = resultData.length;
            var ultag = document.createElement('ul');
            ultag.setAttribute("data-role", "listview");
            //$('#' + ItemID + ' div').append(ultag);
               
            resultData = resultData.sort(sort_Orders("Tag", true, null, null));
            $("#dynamicCapitalCollapsible").collapsibleset("refresh");
            var noBudgetYear = "&lt " +  GetTranslatedValue("NoBudgetYearLabel") + " &gt";
            var noStatus = "&lt " +  GetTranslatedValue("NoStatusLabel") + " &gt";
            var itemList = [parseInt(ItemID)];
            var collapsibleList = [''];
            var dynamicList = [''];
            var assetList = [''];
            var capitalList = [''];
            var currentFilterVal = $('#' + ItemID).attr('data-filter') == '<' ? null : $('#' + ItemID).attr('data-filter');
            var currentFilter = getLocal("CapitalItemSort").toUpperCase();
            for (var index = 0; index < length; index++) {
               // Tag = 16 is specific to one of sort variants.
                if (resultData[index].Tag == 16) {
                    if (currentFilter === "BUDGETYEAR" && resultData[index].BudgetYear == currentFilterVal
                       && $.inArray(resultData[index].CapSeq, itemList) == -1) {
                    itemList.push(resultData[index].CapSeq);
                    collapsibleList.push('');
                    dynamicList.push('');
                    assetList.push('');
                    capitalList.push('');
                    }

                    if (currentFilter === "STATUS" && resultData[index].CapitalStatus == currentFilterVal
                       && $.inArray(resultData[index].CapSeq, itemList) == -1) {
                    	itemList.push(resultData[index].CapSeq);
                    	collapsibleList.push('');
                    	dynamicList.push('');
	                assetList.push('');
                    	capitalList.push('');
                    }
               
                    // If we're in a filter, create the collapsible div first.
                    if ($.inArray(resultData[index].CapSeq, itemList) > -1) {

                        var collapsibleHTML = buildCollapsibleNode(resultData[index], '', 2);
                        collapsibleList[$.inArray(resultData[index].CapSeq, itemList)] = collapsibleHTML[0];
                    //$('#' + ItemID + ' div').append(collapsibleDiv[0]);
                    }
                }

                if (resultData[index].Tag == 6) {
                    istag = true;
                    var rating = "";
                    var impact = "";
                    var capitalDesc = "";
                    var dateInspected = "";
                    if (resultData[index].RatingDescription === null) {
                        rating = GetTranslatedValue('CapitalRatingNotSet');
                    }
                    else {
                        rating = resultData[index].Rating + '-' + resultData[index].RatingDescription;
                    }

                    if (resultData[index].ImpactDescription === null) {
                        impact = GetTranslatedValue('CapitalImpactNotSet');
                    }
                    else {
                        impact = resultData[index].Impact + '-' + resultData[index].ImpactDescription;
                    }
                    if (resultData[index].DateInspectedString === null || resultData[index].DateInspectedString == 'null') {
                        dateInspected = '';
                    }
                    else {
                        dateInspected = resultData[index].DateInspectedString;
                    }

                    if (resultData[index].Item === "" || resultData[index].Item == "null" || resultData[index].Item === null) {

                    }
                    else {
                        //dynamicList = '<p class="capitalDescLabel"><strong> Item Description:</strong>' + resultData[index].Item + ' </p>';data-role="list-divider"
                        // dynamicList = '<li data-role="list-divider" style="color:black;"><strong> Item Description:</strong>' + resultData[index].Item + ' </li>'
                    }
                    dynamicList[$.inArray(resultData[index].CapSeq, itemList)] = /*dynamicList +*/ ' <li style="margin:0px 15px">' +
                                                                '<span style="font-size:0.8em">' + GetTranslatedValue('CapitalDateInspectedLabel') + ' ' + dateInspected + ' </span><br />' +
                                                                '<span style="font-size:0.8em">' + GetTranslatedValue('CapitalInspectionLabel') + ' ' + resultData[index].InspectionNumber + '-' + resultData[index].Sequence + ' </span><br />' +
                                                                '<span style="font-size:0.8em">' + rating + ' / ' + impact + ' </span>' +
                                                                '</li>';
                } // end of if
                else if (resultData[index].Tag == 4) {

                    localStorage.setItem("Level1Label", resultData[index].Level1 + ":" + " ");
                    localStorage.setItem("Level2Label", resultData[index].Level2 + ":" + " ");
                }

                else if (resultData[index].Tag == 10) {
                    var CapitalID = '';
                    var CapitalProjType = '';
                    var CapitalCosts = '';
                    var BudgetYear = '';
                    var ItemDescription = '';
                    if (resultData[index].CapSeq !== null && resultData[index].CapSeq != 'null') {
               		CapitalID = resultData[index].CapSeq;
                    }

                    if (resultData[index].CapitalProjectType !== null && resultData[index].CapitalProjectType != 'null') {
                        CapitalProjType = resultData[index].CapitalProjectType;
                    }

                    if (resultData[index].CapitalCosts !== null && resultData[index].CapitalCosts != 'null') {
                        CapitalCosts = resultData[index].CapitalCosts;
                    }

                    if (resultData[index].BudgetYear !== null && resultData[index].BudgetYear != 'null') {
                        BudgetYear = resultData[index].BudgetYear;
                    }

                    if (resultData[index].Item !== null && resultData[index].Item != 'null') {
                        ItemDescription = resultData[index].Item;
                    }

               capitalList[$.inArray(resultData[index].CapSeq, itemList)] = /*capitalList +*/ '<li class="ui-btn ui-btn-inner ui-li" style="margin:0px 15px">' +
               '<span style="font-size:0.9em">' + GetTranslatedValue('CapitalIDLabel') + ' ' + CapitalID + '</span><br />' +
                                                '<span style="font-size:0.8em">' + GetTranslatedValue('CapitalCategoryLabel')  + ' ' + CapitalProjType + '</span><br />' +
                                                '<span style="font-size:0.8em">' + GetTranslatedValue('CapitalBudgetAmountLabel') + ' ' + CapitalCosts + '</span><br />' +
                                                '<span style="font-size:0.8em">' + GetTranslatedValue('CapitalBudgetYearLabel') + ' ' + BudgetYear + '</span><br />' +
                                                '<span style="font-size:0.8em;white-space:normal">' + GetTranslatedValue('CapitalItemDescriptionLabel') + ' ' + ItemDescription + '</span><br />' +
               '<span class="ui-li-aside"><img class="editCapital img-start" onclick="NavigateToEditCapital(this);" id=' + resultData[index].CapSeq + ' /></span>' +
                                                '</li>';

                    if (resultData[index].EquipTagSeq !== "" && resultData[index].EquipTagSeq != "null" && resultData[index].EquipTagSeq !== null && resultData[index].EquipTagSeq != '0') {
                        assetList[$.inArray(resultData[index].CapSeq, itemList)] = /*assetList +*/ '<li class="lightTheme">' +
                                                '<p>' + GetTranslatedValue('CapitalAssetDescriptionLabel') + ' ' + resultData[index].InstalledDescription + '</p>' +
                                                '</li>';
                    }
                    //else {
                    //    assetList = '';
                    //}
                }
            } // end of for

            //if (istag === false) {
            //    dynamicList = '';
            //}

               $('#' + ItemID + ' ul').html('');
               if (currentFilter === "STATUS" || currentFilter === "BUDGETYEAR") {
               $('#' + ItemID + ' div').html('');
               for (var index = 0; index < itemList.length; index++) {
               var ulArraytag = document.createElement('ul');
               ulArraytag.setAttribute("data-role", "listview");
               ulArraytag.innerHTML += capitalList[index] + dynamicList[index] + assetList[index];
               $('#' + ItemID + ' > div').append(collapsibleList[index]);
               $('#' + itemList[index] + 'CI').append(ulArraytag);
               }

            } else {
            	//$('#' + ItemID + ' ul').html('');
            	ultag.innerHTML += capitalList[0] + dynamicList[0] + assetList[0];
            	$('#' + ItemID + ' div').append(ultag);
           }
               $("#dynamicCapitalCollapsible").trigger("create");
        }
        catch (e) {
            //log(e);
        }
    });
}

function NavigateToCapital(obj) {
    var itemId = $('#' + obj.id).attr("data-itemId");
    localStorage.setItem("ItemId", itemId);

    var itemName = $('#' + obj.id).attr("data-itemName");
    localStorage.setItem("ItemName", itemName);

    var rating = $('#' + obj.id).attr("data-rating");
    localStorage.setItem("Rating", rating);

    var impact = $('#' + obj.id).attr("data-impact");
    localStorage.setItem("Impact", impact);

    var inspectionNumber = $('#' + obj.id).attr("data-inspectionNumber");
    localStorage.setItem("InspectionNumber", inspectionNumber);

    var sequence = $('#' + obj.id).attr("data-sequence");
    localStorage.setItem("Sequence", sequence);

    if (navigator.onLine) {
        $.mobile.changePage("InspectionCapital.html");
    }
    else {
        ////showError("Inspection works only online.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateToEditCapital(obj) {
    var CapSeq = obj.id;
    localStorage.setItem("CapSeq", CapSeq);
    setLocal("CreateCapitalFlag", 0);
    IsCapitalScreenFlag = 1;
    if (navigator.onLine) {
        $.mobile.changePage("InspectionCapital.html");
    }
    else {
        ////showError("Inspection works only online.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NavigateBackToPriorPage() {
    if (navigator.onLine) {
        $.mobile.changePage($('#' + localStorage.getItem("InspectionPageId")));
    }
    else {
        ////showError("Inspection works only online.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function createCapitalFunc() {
    if (navigator.onLine) {
        setLocal("CreateCapitalFlag", "1");
        $.mobile.changePage("InspectionCapital.html");
    }
    else {
        ////showError("Inspection works only online.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function InspectionViewCapital_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var selectLabel = GetCommonTranslatedValue("SelectLabel");

    var DescriptionLabel = GetTranslatedValue("DescriptionLabel");
    var BudgetYearLabel = GetTranslatedValue("BudgetYearLabel");
    var StatusLabel = GetTranslatedValue("StatusLabel");
    var YesLabel = GetCommonTranslatedValue("YesLabel");
    var NoLabel = GetCommonTranslatedValue("NoLabel");
    $(pageID).find("#propertyIDDropDown").html('<option value="-1">' + selectLabel + '</option>').selectmenu("refresh");
    $(pageID).find("#capitalSortDropDown").html('<option value="DESCRIPTION">' + DescriptionLabel + '</option>' +
                                               '<option value="BUDGETYEAR">' + BudgetYearLabel + '</option>' +
                                               '<option value="STATUS">' + StatusLabel + '</option>'
                                               );
    $(pageID).find("#excludeLockedStatusSwitch").next().find(".ui-slider-label-a").text(YesLabel);
    $(pageID).find("#excludeLockedStatusSwitch").next().find(".ui-slider-label-b").text(NoLabel);
    
    if (!IsStringNullOrEmpty(getLocal("CapitalItemSort"))) {
        $(pageID).find("#capitalSortDropDown").val(getLocal("CapitalItemSort").toUpperCase());
    }
    
    if (!IsStringNullOrEmpty(getLocal("CapitalItemExcludeLocked"))) {
        $(pageID).find("#excludeLockedStatusSwitch").val(getLocal("CapitalItemExcludeLocked").toUpperCase()).slider("refresh");
    }

    $(pageID).find("#capitalSortDropDown").selectmenu("refresh");
}
