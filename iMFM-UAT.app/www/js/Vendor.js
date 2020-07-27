/////////////////////////////////////////////////vendo Details js ///////////////////////////////////////////////////////
function BackToVendorList() {
    $.mobile.changePage("VendorSearchResults.html");
}

function GetVendorDetails() {

    var vendorNumber = getLocal("VendorDetailsPostData");
    $.postJSON(standardAddress + "VendorSearch.ashx?method=GetVendorDetails", { VendorNumberKey: vendorNumber, SessionID: decryptStr(getLocal("SessionID")), EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")) }, function (vendorDetails) {
        var stcity = setNull(vendorDetails[0]["StreetCity"]);
        if (setNull(vendorDetails[0]["StreetCity"]) != '' && setNull(vendorDetails[0]["StreetCityState"]) != '') {
            stcity = stcity + ',' + setNull(vendorDetails[0]["StreetCityState"]);
        }
        stcity = stcity + ' ' + setNull(vendorDetails[0]["StreetPostalCode"]);
        $("#VendorName").html(vendorDetails[0]["VendorName"]);
        $("#VendorType").html(setNull(vendorDetails[0]["Type"]));
        $("#VendorAdd1").html(setNull(vendorDetails[0]["StreetAddress1"]));
        $("#VendorAdd2").html(setNull(vendorDetails[0]["StreetAddress2"]));
        $("#VendorAdd3").html(stcity);
        $("#VendorAdd4").html(setNull(vendorDetails[0]["StreetCountryCode"]));
        $("#VoicePhone1").html("<a href='tel:" + setNull(vendorDetails[0]["VoicePhone1"]) + "'>" + setNull(vendorDetails[0]["VoicePhone1"]) + "</a>");
        $("#VoicePhone2").html("<a href='tel:" + setNull(vendorDetails[0]["VoicePhone2"]) + "'>" + setNull(vendorDetails[0]["VoicePhone2"]) + "</a>");
        $("#Fax").html("<a href='tel:" + setNull(vendorDetails[0]["Fax"]) + "'>" + setNull(vendorDetails[0]["Fax"]) + "</a>");
        $("#CarPhone").html("<a href='tel:" + setNull(vendorDetails[0]["CarPhone"]) + "'>" + setNull(vendorDetails[0]["CarPhone"]) + "</a>");
        $("#EmailAddress").html('<a href="mailto:' + setNull(vendorDetails[0]["EmailAddress"]) + '">' + 
            setNull(vendorDetails[0]["EmailAddress"].replace(/\@/g, "@<wbr>").replace(/\./g, ".<wbr>").replace(/\;/g, ";<wbr>")) + '</a>');
        $("#VendorContactName").html(setNull(vendorDetails[0]["VendorContactName"]));
    });
}

////////////////////////////////////////////////////////// vendor Search js /////////////////////////////////////////
function PostVendorSearchData(tag) {
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr("id");
            var searchData = { VendorName: securityError($("#" + pageID).find("#VendorNameText")),
                VendorType: $("#" + pageID).find("#VendorTypeDDL option:selected").val(),
                chkSearchSite: $("#" + pageID).find("#chkSearchSite").is(":checked"),
                VendorQualified: $("#" + pageID).find("#VendorQualified").is(":checked"),
                SL1_DropDownListValue: $("#" + pageID).find("#SStCityValue").attr("data-value"),
                SL2_DropDownListValue: $("#" + pageID).find("#SBuildingValue").attr("data-value"),
                SL3_DropDownListValue: $("#" + pageID).find("#SFloorValue option:selected").val(),
                SL4_DropDownListValue: $("#" + pageID).find("#SRoomValue option:selected").val(),
                DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                Language: localStorage.getItem("Language"),
                Username: decryptStr(localStorage.getItem("Username")),
                EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                SessionID: decryptStr(getLocal("SessionID"))
            }
            setLocal("PostData", JSON.stringify(searchData));
            $.mobile.changePage("VendorSearchResults.html");
        }
        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }

    }
    catch (e) {
        log(e);
    }
}


function GetVendorTypes() {
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };

    $.postJSON(standardAddress + "VendorSearch.ashx?method=GetVendorTypes", myJSONobject, function (serverDATA) {
        var types = serverDATA.split(";");

        var options = '';

        $.each(types, function (key, value) {
            options += '<option value="' + value + '">' + value + '</option>';
        });

        $('#VendorTypeDDL option:gt(0)').remove();
        $('#VendorTypeDDL').append(options);
    });
}


function GetProperty() {
    var propertyID = $("#SPidTextBox").val();
    $.postJSON(standardAddress + "VendorSearch.ashx?method=GetProperty", { "PropertyID": propertyID, "SessionID": decryptStr(getLocal("SessionID")), "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) }, function (serverDATA) {
        //alert(serverDATA);

        $("#" + pageID).find('#SStCityValue').text(serverDATA.RegionDescription);
        $("#" + pageID).find('#SStCityValue').attr("data-value", serverDATA.RegionNumber);

        $("#" + pageID).find('#SBuildingValue').text(serverDATA.DivisionDescription);
        $("#" + pageID).find('#SBuildingValue').attr("data-value", serverDATA.DivisionNumber);
    });
}

/////////////////////////////////////////////////////////////// vendor Search Results js ////////////////////////////////////////
function BachToVendorSearch() {
    $.mobile.changePage("VendorSearch.html");
}

function BindList() {
    var getPostData = getLocal("PostData");
    getPostData = JSON.parse(getPostData);

    // To Get the SiteLabels.
    var buildingLabel = '';
    var pageID = "#" + $.mobile.activePage.attr('id');
    var SiteLabels = getLocal("SiteLabels").split('$');
    if (SiteLabels[0].length > 0) {
        buildingLabel = SiteLabels[0] + ' : ';
    }

    $.postSearchJSON(standardAddress + "VendorSearch.ashx?method=BindList", getPostData, function (vendorCollection) {
        $("#NoVendors").hide();
        $("#VendorList").show();
        if (vendorCollection == null) {
            showError(GetCommonTranslatedValue("ErrorLoading"));
            return;
        }

        var HTVendorNumber = GetTranslatedValue("VendorNumberLabel");
        var HTVendorName = GetTranslatedValue("VendorNameLabel");
        var HTVoicePhone1 = GetTranslatedValue("VoicePhone1Label");
        var HTQualified = GetTranslatedValue("QualifiedLabel");
 
        if (vendorCollection.length == 0) {
            $("#NoVendors").show();
            $("#VendorList").hide();
        }
        for (var i = 0; i < vendorCollection.length; i++) {
            var vendor = vendorCollection[i];
            var stcity = setNull(vendor["StreetCity"]);
            if (setNull(vendor["StreetCity"]) != '' && setNull(vendor["StreetCityState"]) != '') {
                stcity = stcity + ',' + setNull(vendor["StreetCityState"]);
            }

            var qualifiedImagePath = vendor["Qualified"] ? '<img class="img-approve ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all" data-inline="true" style="padding-left:4px"/>' : '<img class="img-reject ui-btn ui-icon-edit ui-btn-icon-notext ui-corner-all" data-inline="true" style="padding-left:4px"/>';

            var listItem = "<li><a id='' href='javascript:VendorDetails(" + vendor["VendorNumber"] + "," + vendor["VendorSiteNumber"] + ")'><span style='font-size: 0.9em'>" + HTVendorNumber + ": " + vendor["VendorNumber"] + "</span><br />" +
                            "<span style='font-size: 0.8em'>" + HTVendorName + ": " + setNull(vendor["VendorName"]) + "</span><br />" +
                            "<span style='font-size:  0.8em'>" + HTVoicePhone1 + ": " + setNull(vendor["VoicePhone1"]) + "</span><br />" +
                            "<span style='font-size:  0.8em'>" + buildingLabel + stcity + "</span><br />" +
                            "<span style='font-size:  0.8em; padding-top:13px' class='ui-block-a'>" + HTQualified + ":</span> " + "<span class='ui-block-b'>" + qualifiedImagePath + "</span></a></li>";

            $("#VendorList").append(listItem);
        }
        $('#VendorList').listview('refresh');
        closeLoading();
    });
}

function VendorDetails(vendorNumber, vendorSiteNumber) {
    var sJsonPostData = { VendorNumber: vendorNumber, VendorSiteNumber: vendorSiteNumber, "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    setLocal("VendorDetailsPostData", JSON.stringify(sJsonPostData));
    $.mobile.changePage("VendorDetails.html");
}