var impactArray = [];
var ratingArray = [];
var modifiedItems = [];
var ItemSelectionFlag = false;
var itemsRatingDisplayFlag = true;
var itemsImpactDisplayFlag = true;
var itemsRatingDisableFlag = true;
var itemsImpactDisableFlag = true;
var rateAllItemFlag = false;
var inspectionNumberDisplayFlag = true;
var rateCategoryItems;

function CheckPendingActionsForInspections() {
    if (!ItemSelectionFlag) {
        showError(GetTranslatedValue("ItemSelectionError"));
        return;
    }
    var pageId = "#" + $.mobile.activePage.attr('id');
    if (modifiedItems.length > 0) {
        showConfirmation(GetTranslatedValue("SavePrompt"), GetCommonTranslatedValue('YesLabel'), GetCommonTranslatedValue('NoLabel'), 'SaveAndNavigate');
    }
    else {
        SaveAndNavigate(false);
    }
}

function SaveAndNavigate(flag) {
    var pageId = "#" + $.mobile.activePage.attr('id');
    if (flag) {
        SaveAllInspectionItemChanges();
    }

    switch (getLocal("NewInspItem_ActionButton")) {
        case "PicturesTab":
            NavigateEditToPicturesScreen('InspectionItem');
            break;
        case "WorkOrdersTab":
            $("#NewInspectionItemsPage #WorkOrdersTab a").attr("href", "#workOrderOptionsPopUp");
            $("#NewInspectionItemsPage #WorkOrdersTab a").click();
            break;
        case "AssetsTab":
            NavigateToAssets();
            break;
        case "VendorTab":
            NavigateToVendor(this);
            break;
        case "CapitalsTab":
            NavigateToCapitalScreen()
            break;
        default: break;
    }

    if (getLocal("NewInspItem_ActionButton") == "WorkOrdersTab") {
        $("#NewInspectionItemsPage #WorkOrdersTab a").attr("href", "#");
    }
}

function NewinspectionItemsPageSecurity(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr('id');
    itemsRatingDisplayFlag = true;
    itemsImpactDisplayFlag = true;
    itemsRatingDisableFlag = true;
    itemsImpactDisableFlag = true;
    // Security for Buttons in the footer 

    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "PicturesButton", "CanAccess")) {
        $(pageID).find("#PicturesTab").hide();
        $(pageID).find("#PicturesTab").attr('data-security', '1');
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "WOButton", "CanAccess")) {
        $(pageID).find("#WorkOrdersTab").hide();
        $(pageID).find("#WorkOrdersTab").attr('data-security', '1');
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "AssetsButton", "CanAccess")) {
        $(pageID).find("#AssetsTab").hide();
        $(pageID).find("#AssetsTab").attr('data-security', '1');
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "VendorsButton", "CanAccess")) {
        $(pageID).find("#VendorTab").hide();
        $(pageID).find("#VendorTab").attr('data-security', '1');
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "CapitalButton", "CanAccess")) {
        $(pageID).find("#CapitalsTab").hide();
        $(pageID).find("#CapitalsTab").attr('data-security', '1');
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ImpactDropDownList", "CanAccess")) {
        itemsImpactDisplayFlag = false;
    }
    else {
        itemsImpactDisplayFlag = true;
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "ImpactDropDownList", "ReadOnly")) {
            itemsImpactDisableFlag = false;
        }
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "RatingDropDownList", "CanAccess")) {
        itemsRatingDisplayFlag = false;
    }
    else {
        itemsRatingDisplayFlag = true;
        if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "RatingDropDownList", "ReadOnly")) {
            itemsRatingDisableFlag = false;
        }
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "InspectionNumberLabel", "CanAccess")) {
        inspectionNumberDisplayFlag = false;
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 1, "NAButton", "CanAccess")) {
        $(pageID).find("#NAImage").hide();
    }
    
    //Update styles on the footer based on how many disabled buttons there are.
    switch ($(pageID).find("[data-security=1]").length) {
        case 1:
            $(pageID).find("#InspActionButtons").toggleClass('ui-grid-c ui-grid-d');
            break;
        case 2:
            $(pageID).find("#InspActionButtons").toggleClass('ui-grid-b ui-grid-d');
            break;
        case 3:
            $(pageID).find("#InspActionButtons").toggleClass('ui-grid-a ui-grid-d');
            break;
        case 4:
            $(pageID).find("#InspActionButtons").toggleClass('ui-grid-solo ui-grid-d');
            break;
        default:
            break;
    }
    
    // Reorganize the buttons based on how many are enabled.
    var buttons = $(pageID).find("[data-security=0]");
    if (buttons.length > 0) {
        var blockClasses = ['ui-block-a','ui-block-b','ui-block-c','ui-block-d','ui-block-e'];
        buttons.removeClass('ui-block-a ui-block-b ui-block-c ui-block-d ui-block-e');
        
        for (var i = 0; i < buttons.length; i++) {
            $(buttons[i]).addClass(blockClasses[i]);
        }
    }
}

//// function to create dynamic items list
function newInspectionItemsSuccess(inspectionUrl, inspectionItemDetails) {
    $.postJSON(inspectionUrl, inspectionItemDetails, function (inspectionItemsData) {
        if (inspectionItemsData.length === 0) {
            $("#itemsAreaName").html(getLocal("AreaName") + " >");
            $("#itemsCategName").html(getLocal("CategoryName") + " >");
            $("#noItemsDiv").html(GetTranslatedValue("NoItems"));
        }
        else {
            try {
                var length = inspectionItemsData.length;
                var dynamicList = '';
                var selectIconIndex = 0;
                var prevItemSeq;
                impactArray = [];
                ratingArray = [];
                modifiedItems = [];
                ItemSelectionFlag = false;
                $('#dynamicItemslist').empty();
                for (var index = 0; index < length; index++) {
                    if (inspectionItemsData[index].Tag == 1) {
                        item = {};
                        item.value = inspectionItemsData[index].ImpactCode;
                        item.text = inspectionItemsData[index].Impact + '-' + inspectionItemsData[index].ImpactDescription;
                        impactArray.push(item);
                    }

                    if (inspectionItemsData[index].Tag == 2) {
                        item = {};
                        item.value = inspectionItemsData[index].RatingCode;
                        item.text = inspectionItemsData[index].Rating + '-' + inspectionItemsData[index].RatingDescription;
                        ratingArray.push(item);
                    }

                    if (inspectionItemsData[index].Tag == 3) {
                        if (prevItemSeq != inspectionItemsData[index].Sequence) {
                            dynamicList = dynamicList + createDynamicNewItemlist(inspectionItemsData[index], selectIconIndex);
                            selectIconIndex++;
                        }
                        prevItemSeq = inspectionItemsData[index].Sequence;

                    }
                } // end of For                             
                $('#dynamicItemslist').append(dynamicList);
                $('#dynamicItemslist').trigger('create');

                if (!itemsImpactDisplayFlag) {
                    $(".itemImpactBlock").css("display", "none");
                }
                else {
                    if (!itemsImpactDisableFlag) {
                        $(".itemImpactIcon").addClass("ui-disabled");
                    }
                }
                if (!itemsRatingDisplayFlag) {
                    $(".itemRatingBlock").css("display", "none");
                }
                else {
                    if (!itemsRatingDisableFlag) {
                        $(".itemRatingIcon").addClass("ui-disabled");
                    }
                }
                if (!inspectionNumberDisplayFlag) {
                    $(".inspectionNumber").css("display", "none");
                }

                closeLoading();
            } // end of try
            catch (e) {
                closeLoading();
            } // end of catch

            $("#itemsAreaName").html(getLocal("AreaName") + " >");
            $("#itemsCategName").html(getLocal("CategoryName") + " >");
        }
    });
} //end of function


function createDynamicNewItemlist(inspectionItemsData, iconIndex) {
    //    var itemDesc = (inspectionItemsData.ItemDescription).replace(/\s/g, "");
    var itemDesc = (inspectionItemsData.ItemDescription);

    var ratingList = '<li><div class="ui-grid-a parentItemDiv">';
    ratingList = ratingList + '<div class="ui-block-a selectItemDiv" style="width:7%;">' +
                                '<img data-default="0" data-itemID="' + inspectionItemsData.ItemID + '" data-seq="' + inspectionItemsData.Sequence +
                                '" id="' + iconIndex + '" class="selectItem img-circle-gray" data-customernumber="' + inspectionItemsData.CustomerNumber
                                + '" data-customersitenumber="' + inspectionItemsData.CustomerSiteNumber
                                + '" data-problemcodenumber="' + inspectionItemsData.ProblemCodeNumber
                                + '" data-capital="' + inspectionItemsData.Capital
                                + '" data-equipstyleseq="' + inspectionItemsData.EquipStyleSeq
                                + '" data-capseqnumber="' + inspectionItemsData.CapSeqNumber + '" data-inspnumber="' + inspectionItemsData.InspectionNumber
                                + '" data-itemname="' + itemDesc + '" onclick="selectItemTOModify(this);"/>' +
                                '</div>' + //// end of block a
                                '<div class="ui-block-b itemRatingDiv"  style="width:90%;">' +
                                '<p class="tabBarIconText">' + inspectionItemsData.ItemDescription + '</p>' +
                                '<label class="inspectionNumber">' + GetTranslatedValue("InspectionLabel") + ' ' + inspectionItemsData.InspectionNumber + '-' + inspectionItemsData.Sequence + '</label>'
    //                                '<div class="ui-grid-a">' +
    //                                '<div class="ui-block-a itemsRatingBlock" style="width:90%;">';
    ratingList = ratingList + createRatingImpactNode(inspectionItemsData, 'Rating');
    // ratingList = ratingList + '</div>' + //// end of block a
    //                           '<div class="ui-block-b itemsImpactBlock" style="width:90%;">';
    ratingList = ratingList + createRatingImpactNode(inspectionItemsData, 'Impact');
    //    ratingList = ratingList + '</div>' + //// end of block b
    //                                '</div>';
    ratingList = ratingList + createTextAreaIcon(inspectionItemsData);
    ratingList = ratingList +
    // + '</div>' + //// end of block b                                
    //                                '</div>' +
                                '</li>';
    return ratingList;
}

function createRatingImpactNode(inspectionItemsData, type) {
    var imageTag = "";
    var rating;
    var impact;
    var dynamicElement;
    switch (type) {
        case "Rating":
            if (inspectionItemsData.RatingDescription === null) {
                rating = GetTranslatedValue("RatingNotSet");
                for (var index = 0; index < ratingArray.length; index++) {
                    imageTag = imageTag + '<img class="itemRatingIcon img-star-gray" data-seq="' + inspectionItemsData.Sequence + '" data-index="' + ratingArray[index].value + '" data-value="' + ratingArray[index].value +
                                          '" data-text="' + ratingArray[index].text + '" id="' + inspectionItemsData.ItemID + '_' + ratingArray[index].value +
                                          '" onclick="changeRatingIcon(this);" />';
                }
            }
            else {
                rating = inspectionItemsData.Rating + '-' + inspectionItemsData.RatingDescription;
                var starImage = GetObjectValueIndex(ratingArray, inspectionItemsData.RatingCode);
                starImage = IsStringNullOrEmpty(starImage) ? "" : starImage;
                if (starImage.length != 0) {
                    for (var index = 0; index < ratingArray.length; index++) {
                        if (index <= starImage) {
                            imageTag = imageTag + '<img class="itemRatingIcon img-star-green" data-seq="' + inspectionItemsData.Sequence + '" data-index="' + ratingArray[index].value + '" data-value="' + ratingArray[index].value +
                                          '" data-text="' + ratingArray[index].text + '" id="' + inspectionItemsData.ItemID + '_' + ratingArray[index].value +
                                          '" onclick="changeRatingIcon(this);" />';
                        }
                        else {
                            imageTag = imageTag + '<img class="itemRatingIcon img-star-gray" data-seq="' + inspectionItemsData.Sequence + '" data-index="' + ratingArray[index].value + '" data-value="' + ratingArray[index].value +
                                          '" data-text="' + ratingArray[index].text + '" id="' + inspectionItemsData.ItemID + '_' + ratingArray[index].value +
                                          '" onclick="changeRatingIcon(this);" />';
                        }
                    }

                }
                else {
                    for (var index = 0; index < ratingArray.length; index++) {
                        imageTag = imageTag + '<img class="itemRatingIcon img-star-gray" data-seq="' + inspectionItemsData.Sequence + '" data-index="' + ratingArray[index].value + '" data-value="' + ratingArray[index].value +
                                          '" data-text="' + ratingArray[index].text + '" id="' + inspectionItemsData.ItemID + '_' + ratingArray[index].value +
                                          '" onclick="changeRatingIcon(this);" />';
                    }
                }
            }
            dynamicElement = '<div class="itemRatingBlock"><p>' + GetTranslatedValue("RatingLabel") + '<span id="' + inspectionItemsData.ItemID + "RatingText" +
                             '" >' + rating + '</span></p>' +
                             '<p>' + imageTag + '</p></div>';
            return dynamicElement;
            break;
        case "Impact":
            if (inspectionItemsData.ImpactDescription === null) {
                impact = GetTranslatedValue("ImpactNotSet");
                for (var index = 0; index < impactArray.length; index++) {
                    imageTag = imageTag + '<img class="itemImpactIcon img-impact-gray" data-itemid="' + inspectionItemsData.ItemID + '" data-index="' + impactArray[index].value + '" data-value="' + impactArray[index].value +
                                          '" data-text="' + impactArray[index].text + '" id="' + inspectionItemsData.Sequence + '_' + impactArray[index].value +
                                          '" onclick="changeImpactIcon(this);" />';
                }
            }
            else {
                impact = inspectionItemsData.Impact + '-' + inspectionItemsData.ImpactDescription;
                var starImage = GetObjectValueIndex(impactArray, inspectionItemsData.ImpactCode);
                starImage = IsStringNullOrEmpty(starImage) ? "" : starImage;
                if (starImage.length != 0) {
                    for (var index = 0; index < impactArray.length; index++) {
                        if (index <= starImage) {
                            imageTag = imageTag + '<img class="itemImpactIcon img-impact-green" data-itemid="' + inspectionItemsData.ItemID + '" data-index="' + impactArray[index].value + '" data-value="' + impactArray[index].value +
                                          '" data-text="' + impactArray[index].text + '" id="' + inspectionItemsData.Sequence + '_' + impactArray[index].value +
                                          '" onclick="changeImpactIcon(this);" />';
                        }
                        else {
                            imageTag = imageTag + '<img class="itemImpactIcon img-impact-gray" data-itemid="' + inspectionItemsData.ItemID + '" data-index="' + impactArray[index].value + '" data-value="' + impactArray[index].value +
                                          '" data-text="' + impactArray[index].text + '" id="' + inspectionItemsData.Sequence + '_' + impactArray[index].value +
                                          '" onclick="changeImpactIcon(this);" />';
                        }
                    }

                }
                else {
                    for (var index = 0; index < impactArray.length; index++) {
                        imageTag = imageTag + '<img class="itemImpactIcon img-impact-gray" data-itemid="' + inspectionItemsData.ItemID + '" data-index="' + impactArray[index].value + '" data-value="' + impactArray[index].value +
                                          '" data-text="' + impactArray[index].text + '" id="' + inspectionItemsData.Sequence + '_' + impactArray[index].value +
                                          '" onclick="changeImpactIcon(this);" />';
                    }
                }
            }
            dynamicElement = '<div class="itemImpactBlock"><p>' + GetTranslatedValue("ImpactLabel") + '<span id="' + inspectionItemsData.Sequence + "ImpactText" +
                             '" >' + impact + '</span></p>' +
                             '<p>' + imageTag + '</p></div>';
            return dynamicElement;
            break;

    }
}

function changeRatingIcon(obj) {
    var starId = obj.id;
    var ratingIndex = starId.split('_');
    var imageIndex = $("#" + obj.id).attr('data-index');
    var imgClass = 'img-star-green';
    for (var index = 0; index < ratingArray.length; index++) {
        $('#' + ratingIndex[0] + '_' + ratingArray[index].value).removeClass('img-star-gray img-star-green');
        $('#' + ratingIndex[0] + '_' + ratingArray[index].value).addClass(imgClass);
        if (ratingArray[index].value == imageIndex) {
            imgClass = 'img-star-gray';
        }

    }
    $("#" + ratingIndex[0] + 'RatingText').text($("#" + obj.id).attr('data-text'));
    $('#' + ratingIndex[0] + '_' + $("#" + obj.id).attr('data-seq')).attr('data-rating', $("#" + obj.id).attr('data-value'));
    verifyItemIDSeq(ratingIndex[0], $("#" + obj.id).attr('data-seq'), modifiedItems);
}

function changeImpactIcon(obj) {
    var starId = obj.id;
    var ratingIndex = starId.split('_');
    var imageIndex = $("#" + obj.id).attr('data-index');
    var imgClass = 'img-impact-green';
    for (var index = 0; index < impactArray.length; index++) {
        $('#' + ratingIndex[0] + '_' + impactArray[index].value).removeClass('img-impact-gray img-impact-green');
        $('#' + ratingIndex[0] + '_' + impactArray[index].value).addClass(imgClass);
        if (impactArray[index].value == imageIndex) {
            imgClass = 'img-impact-gray';
        }
    }
    $("#" + ratingIndex[0] + 'ImpactText').text($("#" + obj.id).attr('data-text'));
    $('#' + $("#" + obj.id).attr('data-itemid') + '_' + ratingIndex[0]).attr('data-impact', $("#" + obj.id).attr('data-value'));
    verifyItemIDSeq($("#" + obj.id).attr('data-itemid'), ratingIndex[0], modifiedItems);
}

function saveItemComments(obj) {
    var textAreaID = obj.id.split('_');
    verifyItemIDSeq(textAreaID[0], textAreaID[1], modifiedItems);
}

function selectItemTOModify(obj) {
    var totalListElement = $('#dynamicItemslist li').length;
    ItemSelectionFlag = true;

    if ($('#' + obj.id).attr('data-default') == '1') {
        $("#footerNav").hide();
        $('#' + obj.id).removeClass('img-circle-green');
        $('#' + obj.id).addClass('img-circle-gray');
        $('#' + obj.id).attr('data-default', '0');
        ItemSelectionFlag = false;
        modifyNavigationBarSecurity();
    }
    else {
        for (var index = 0; index < totalListElement; index++) {
            $("#footerNav").show();
            if (index == obj.id) {
                $('#' + obj.id).removeClass('img-circle-gray');
                $('#' + obj.id).addClass('img-circle-green');
                $('#' + obj.id).attr('data-default', '1');
                if ($('#' + obj.id).attr('data-capital') == false || $('#' + obj.id).attr('data-capital') == "false") {
                    $("#CapitalsTab").hide();
                }
                else {
                    if ($("#CapitalsTab").attr('data-security') == 0) {
                        $("#CapitalsTab").show();
                    }
                }
                if (IsStringNullOrEmpty($('#' + obj.id).attr('data-equipstyleseq'))) {
                    $("#AssetsTab").hide();
                }
                else {
                    if ($("#AssetsTab").attr('data-security') == 0) {
                        $("#AssetsTab").show();
                    }
                }

                if (IsStringNullOrEmpty($('#' + obj.id).attr('data-problemcodenumber'))) {
                    $("#VendorTab").hide();
                }
                else {
                    if ($("#VendorTab").attr('data-security') == 0) {
                        $("#VendorTab").show();
                    }
                }
                setLocal('ItemId', $('#' + obj.id).attr('data-itemID'));
                setLocal('Sequence', $('#' + obj.id).attr('data-seq'));
                setLocal('CapSeq', $('#' + obj.id).attr('data-capseqnumber'));
                setLocal("CustomerNumber", $('#' + obj.id).attr('data-customernumber'));
                setLocal("CustomerSiteNumber", $('#' + obj.id).attr('data-customersitenumber'));
                setLocal("ProblemCodeNumber", $('#' + obj.id).attr('data-problemcodenumber'));
                setLocal("InspectionNumber", $('#' + obj.id).attr('data-inspnumber'));
                setLocal("ItemName", $('#' + obj.id).attr('data-itemname'));
            } else {
                $('#' + index).removeClass('img-circle-green');
                $('#' + index).addClass('img-circle-gray');
                $('#' + index).attr('data-default', '0');
            }
        }
    }

}

function modifyNavigationBarSecurity() {
    if ($("#PicturesTab").attr('data-security') == 1) {
        $("#PicturesTab").hide();
    }
    else {
        $("#PicturesTab").show();
    }
    if ($("#WorkOrdersTab").attr('data-security') == 1) {
        $("#WorkOrdersTab").hide();
    }
    else {
        $("#WorkOrdersTab").show();
    }
    if ($("#AssetsTab").attr('data-security') == 1) {
        $("#AssetsTab").hide();
    }
    else {
        $("#AssetsTab").show();
    }
    if ($("#VendorTab").attr('data-security') == 1) {
        $("#VendorTab").hide();
    }
    else {
        $("#VendorTab").show();
    }
    if ($("#CapitalsTab").attr('data-security') == 1) {
        $("#CapitalsTab").hide();
    }
    else {
        $("#CapitalsTab").show();
    }
}

function createTextAreaIcon(inspectionItemsData) {
    var textAreaElement = "";
    var raingVal, imapactVal;
    var commentsText = IsStringNullOrEmpty($.trim(inspectionItemsData.Comments)) ? "" : $.trim(inspectionItemsData.Comments);
    if (inspectionItemsData.RatingDescription === null) {
        raingVal = -1;
    }
    else {
        raingVal = inspectionItemsData.RatingCode;
    }

    if (inspectionItemsData.ImpactDescription == null) {
        imapactVal = -1;
    }
    else {
        imapactVal = inspectionItemsData.ImpactCode;
    }
    textAreaElement = textAreaElement + '<div class="ui-grid-a">' +
                      '<div class="ui-block-a" style="width:85%">' +
                                '<textarea cols="40" id="' + inspectionItemsData.ItemID + '_' + inspectionItemsData.Sequence + "_comment" +
                                '" rows="8" name="comments" maxlength="500" class="CommentsScrollBar" onblur="saveItemComments(this);">' +
                                commentsText + '</textarea>' +
                                '</div>' +
                                '<div class="ui-block-b" style="width:6%;margin-left:2%">' +
                                '<img class="itemSaveIcon img-square-green" data-modified="0" id="' + inspectionItemsData.ItemID + '_' + inspectionItemsData.Sequence +
                                '" data-rating="' + raingVal + '" data-impact="' + imapactVal + '"' +
                                '" data-inspnum="' + inspectionItemsData.InspectionNumber + '" onclick="saveRatingImpact(this);"/>' +
                                '</div>' +
                                '</div>';
    return textAreaElement;
}

function GetObjectValueIndex(obj, keyToFind) {
    var i = 0, value;
    for (value in obj) {
        ////        if (value == keyToFind) {
        ////            return i;
        ////        }
        if (obj[value].value == keyToFind) {
            return i;
        }
        i++;
    }
    return null;
}

function verifyItemIDSeq(itemID, Seq, modifiedItems) {
    var i = 0, value;
    var valueExists = false;
    item = {};
    item.itemID = itemID;
    item.seq = Seq;
    if (modifiedItems.length == 0) {
        modifiedItems.push(item);
    }
    else {
        for (value in modifiedItems) {
            if (modifiedItems[value].itemID == itemID) {
                valueExists = true;
            }
        }
        if (valueExists == false) {
            modifiedItems.push(item);
        }
    }
}

function saveRatingImpact(obj) {
    LoadMyLocation();
    var saveIconID = obj.id;
    var itemID = saveIconID.split('_');
    //var comments = $.trim($('#' + obj.id + '_comment').val());
    var comments = securityError($('#' + obj.id + '_comment'));
    var data = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "InspectionNumber": $("#" + obj.id).attr('data-inspnum'),
        "Rating": $("#" + obj.id).attr('data-rating'),
        "Impact": $("#" + obj.id).attr('data-impact'),
        "ItemID": itemID[0],
        "Comments": comments,
        "Sequence": itemID[1],
        "GPSLocation": GlobalLat + "," + GlobalLong
    });
    if (navigator.onLine) {
        showLoading();
        var inspectionURL = standardAddress + "Inspection.ashx?methodname=UpdateInspection";
        $.postJSON(inspectionURL, data, function (resultData) {
            if (resultData[0].Status == 'success') {
                refreshItemsList();
            }
            else {
                ////showError("Failed to update, please try again");
                closeLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("FailedToUpdate"));
                }, 500);

            }
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function refreshItemsList() {
    var data = iMFMJsonObject({
        "RegionNumber": getLocal("RegionNumber"),
        "DivisionNumber": getLocal("DivisionNumber"),
        "Username": decryptStr(getLocal("Username")),
        "InspectionNumber": getLocal("InspectionNumber"),
        "AreaID": getLocal("AreaId"),
        "CategoryID": getLocal("CategoryId"),
        "AreaDescription": getLocal("AreaName")
    });
    var inspectionURL = standardAddress + "Inspection.ashx?methodname=GetInspectionItems";
    newInspectionItemsSuccess(inspectionURL, data);
}

function SaveAllInspectionItemChanges() {
    var inspectionJsonArray = '';
    inspectionJsonArray = createMultipleItemsArray();
    var data = iMFMJsonObject({
        inspJsondata: JSON.stringify(inspectionJsonArray)
    });

    if (navigator.onLine) {
        var inspectionURL = standardAddress + "Inspection.ashx?methodname=BulkUpdateInspection";
        NewInspectionUpdateItemsSuccess(inspectionURL, data);
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function NewInspectionUpdateItemsSuccess(inspectionUrl, inspectionUpdateItemDetails) {
    $.postJSON(inspectionUrl, inspectionUpdateItemDetails, function (resultData) {
        if (resultData[0].Status == 'success') {
            if (rateAllItemFlag == true) {
                rateAllItemFlag = false;
                refreshItemsList();
            }
            ////$.mobile.changePage("NewInspectionItems.html");
        }
        else {
            if (rateAllItemFlag == true) {
                rateAllItemFlag = false;
                closeLoading();
                setTimeout(function () {
                    showError(GetTranslatedValue("FailedToUpdate"));
                }, 500);
            }
        }
    });
}

function createMultipleItemsArray() {
    var changedItemsArray = [];
    if (modifiedItems.length > 0) {
        LoadMyLocation();
        for (var index = 0; index < modifiedItems.length; index++) {
            var modifiedItemsObject = {};
            modifiedItemsObject.Username = decryptStr(getLocal("Username"));
            modifiedItemsObject.EmployeeNumber = decryptStr(getLocal("EmployeeNumber"));
            modifiedItemsObject.InspectionNumber = $("#" + modifiedItems[index].itemID + '_' + modifiedItems[index].seq).attr('data-inspnum');
            modifiedItemsObject.Rating = $("#" + modifiedItems[index].itemID + '_' + modifiedItems[index].seq).attr('data-rating');
            modifiedItemsObject.Impact = $("#" + modifiedItems[index].itemID + '_' + modifiedItems[index].seq).attr('data-impact');
            modifiedItemsObject.ItemID = modifiedItems[index].itemID;
            modifiedItemsObject.Comments = $.trim($("#" + modifiedItems[index].itemID + '_' + modifiedItems[index].seq + '_comment').val());
            modifiedItemsObject.Sequence = modifiedItems[index].seq;
            modifiedItemsObject.GPSLocation = GlobalLat + "," + GlobalLong;
            modifiedItemsObject.SessionID = decryptStr(getLocal("SessionID"));
            changedItemsArray.push(modifiedItemsObject);
        }
    }
    return changedItemsArray;
}

function rateAllInspectionItems() {
    if (modifiedItems.length == 0) {
        showError(GetTranslatedValue("NoItemsModified"));
        return;
    }
    else {
        if (navigator.onLine) {
            showLoading();
            rateAllItemFlag = true;
            SaveAllInspectionItemChanges();
        }
        else {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            return;
        }

    }
}

function RateAllItems() {
    if (navigator.onLine) {
        rateCategoryItems = getLocal("CategoryId");
        showConfirmation(GetTranslatedValue("RateAllItemsConfirmation1") + '<p>' + GetTranslatedValue("RateAllItemsConfirmation2") + '</p>', GetCommonTranslatedValue('OkLabel'), GetCommonTranslatedValue('CancelLabel'), 'RateCategoryItems');        
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function RateCategoryItems(flag) {
    if (flag === true) {
        var data = iMFMJsonObject({
            "RegionNumber": getLocal("RegionNumber"),
            "DivisionNumber": getLocal("DivisionNumber"),
            "Username": decryptStr(getLocal("Username")),
            "InspectionNumber": getLocal("InspectionNumber"),
            "AreaID": getLocal("AreaId"),
            "AreaDescription": getLocal("AreaName"),
            "Category": rateCategoryItems,
            "GPSLocation": GlobalLat + "," + GlobalLong
        });
        var rateCategoryItemURL = standardAddress + "Inspection.ashx?methodname=RateCategoryItems";
        rateCategoryItemSuccess(rateCategoryItemURL, data);
    }
    else {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID + "ConfirmationPopup").popup("close");
    }
}

function rateCategoryItemSuccess(rateCategoryItemURL, data) {
    $.postJSON(rateCategoryItemURL, data, function (resultData) {
        var result = resultData;
        if (result[0].Status.length != 0) {
            if (result[0].Status == "Success") {
                $('#rateCategoryRatingMessage').html(GetTranslatedValue("BulkRateSuccess"));
                $('#rateCategoryItemsMessagePopUp').popup("open");
                refreshItemsList();
                $("#footerNav").hide();
            }
            else {
                showError(GetTranslatedValue("NoItemsModified"));
            }
        }
    });
}