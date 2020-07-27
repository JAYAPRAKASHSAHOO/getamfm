
function scanBarcode(){
    try {
        var scanned = scan();
        console.log('scan triggered', scanned);
    } catch (e) {
        showError(GetCommonTranslatedValue("ScannerError"));
    }
}

function readBarcodeToText(entityName){
    try {
        var pageID = $.mobile.activePage.attr('id');
        //var scanner = window.cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
        //var scanner = window.cordova.require("phonegap-plugin-barcodescanner.BarcodeScanner");
        cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                if (!IsStringNullOrEmpty(entityName)) {
                    //switch (getLocal("RequestedAction")) {
                    //    case "EditAsset":
                         $("#" + entityName).val(result.text);
                    //        break;
                    //    case "AddAsset":
                    //        break;
                    //}
                } else {
                    showError(GetCommonTranslatedValue("ScannerCouldntIdentifyMessage"));
                }
            }
        },
        function (error) {
            alert(GetCommonTranslatedValue("ErrorDescription") + error);
        },
        {
            preferFrontCamera: false, // iOS and Android
            showFlipCameraButton: true, // iOS and Android
            showTorchButton: true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt: "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            // For iOS comment this
            formats: "QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,PDF_417,RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
            //orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations: true, // iOS
            disableSuccessBeep: false // iOS and Android
        });
    } catch (e) {
        showError(GetCommonTranslatedValue("ErrorDescription") + e);
    }
}

function scan() {
    // documentation said the syntax was this:
    // var scanner = window.PhoneGap.require("cordova/plugin/BarcodeScanner");
    // but playing with options, seems like it should be this:
    //var scanner = window.cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
    //var scanner = window.cordova.require("phonegap-plugin-barcodescanner.BarcodeScanner");
    cordova.plugins.barcodeScanner.scan(
                 function (result) {                 
                     //if (result.text.indexOf("http") > -1) {
                     //window.open(result.text, '_system');
                     //}
                 
                     if (!result.cancelled) {
                         var jsonObject = iMFMJsonObject({
                            "Username": decryptStr(getLocal("Username")),
                            "BarcodeId": result.text
                         });
                 
                         var targetURL = standardAddress + "AssetManager.ashx?method=ScanAsset";
                         showLoading();
                         processTagScan(targetURL, jsonObject);
                     }
                 },
                 function (error) {
                 alert(GetCommonTranslatedValue("ErrorDescription") + error);
                 },
                 {
                     preferFrontCamera: false, // iOS and Android
                     showFlipCameraButton: true, // iOS and Android
                     showTorchButton: true, // iOS and Android
                     torchOn: false, // Android, launch with the torch switched on (if available)
                     saveHistory: true, // Android, save scan history (default false)
                     prompt: "Place a barcode inside the scan area", // Android
                     resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                     // For iOS comment this
                     formats: "QR_CODE,DATA_MATRIX,UPC_E,UPC_A,EAN_8,EAN_13,CODE_128,CODE_39,CODE_93,CODABAR,ITF,RSS14,PDF_417,RSS_EXPANDED", // default: all but PDF_417 and RSS_EXPANDED
                     //orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                     disableAnimations: true, // iOS
                     disableSuccessBeep: false // iOS and Android
                 }
    );
}

function processTagScan(targetURL, jsonObject) {
    if (jsonObject.BarcodeId) {
        $.postJSON(targetURL, jsonObject, function (scannedResults) {
            var pageID = $.mobile.activePage.attr('id');           
            $.when(closeLoading()).done(function () {
                setTimeout(function () {
                    // Wait until the Loading popup is closed before opening the other popups for assets.
                    if (scannedResults && scannedResults.TagNumber) {
                        if (pageID === "ActionsPopup") {
                            //switch (getLocal("RequestedAction")) {
                            //    case "SetEquipmentTag":
                            var scannedTagSelected = false;
                            $("#SetEquipmentTagDropDown option").each(function () {
                                if (this.value.substr(0, this.value.indexOf('[')) == scannedResults.TagNumber) {
                                    $("#" + pageID).find("#SetEquipmentTagDropDown").val(this.value);
                                    $("#" + pageID).find("#SetEquipmentTagDropDown").selectmenu("refresh");
                                    //this.selected = true;
                                    //$("#SetEquipmentTagDropDown").change();
                                    scannedTagSelected = true;
                                    return false;
                                }
                            });
                            if (!scannedTagSelected) {
                                showError(GetCommonTranslatedValue("AssetNotAtSiteMessage"));
                            }
                            //        break;
                            //}
                        } else {
                            displayTagPopup(scannedResults);
                        }
                    }
                    else {
                        var SgtCollection = $.GetSecuritySubTokens(400043, 0);

                        if (SgtCollection.CanAccess === 0 || pageID === "ActionsPopup") {
                            showError(GetCommonTranslatedValue("AssetNotIdentifiedMessage"));
                        } else {
                            setLocal("ScannedValue", scannedResults.BarcodeId);

                            showConfirmation(GetCommonTranslatedValue("AssetNotIdentifiedMessage") + "<br /><br />" + GetCommonTranslatedValue("CreateAssetMessage"), GetCommonTranslatedValue("YesLabel"), GetCommonTranslatedValue("NoLabel"), beginCreateAsset)
                        }
                    }
                }, 50);
            });
        });
    }
}
function beginCreateAsset(flag) {
    if (flag) {
        setLocal("ScreenName", $.mobile.activePage.attr('id'));
        $.mobile.changePage("InspectionAddAsset.html");
    }
}

// Function to populate and display the Tag Popup.
function displayTagPopup(scannedResults) {
    var pageID = $.mobile.activePage.attr('id');
    var imageContainer = $("#" + pageID + "TagScanImageP");
    document.getElementById(pageID + "TagScanPopupTagNumber").innerHTML = scannedResults.TagNumber;
    if (scannedResults.InstalledDescription && scannedResults.InstalledDescription.length !== 0) {
        document.getElementById(pageID + "TagScanPopupInstallDescr").innerHTML = scannedResults.InstalledDescription;
        setLocal("InstalledDescription", scannedResults.InstalledDescription);
    }

    if (scannedResults.PartDescription && scannedResults.PartDescription.length !== 0) {
        document.getElementById(pageID + "TagScanPopupPartDescr").innerHTML = scannedResults.PartDescription;
        setLocal("PartDescription", scannedResults.PartDescription);
    }

    if (scannedResults.CountryCity && scannedResults.CountryCity.length !== 0) {
        document.getElementById(pageID + "TagScanPopupLocation").innerHTML = scannedResults.CountryCity;
    }

    if (!IsStringNullOrEmpty(scannedResults.FileObjectString)) {
        imageContainer.empty();
        $('<img/>')
            .load(function () {
                if ($(this).height() > $(this).width()) {
                    $(this).attr("style", "width:100px;position:relative;top:-30px;-webkit-transform:rotate(90deg);transform:rotate(90deg);");
                }
            })
            .attr("style", "width:100px;")
            .attr("src", scannedResults.FileObjectString)
            .appendTo(imageContainer);
    } else {
        imageContainer.attr("style", "display:none");
    }

    setLocal("TagNumber", scannedResults.TagNumber);
    setLocal("CountryCity", scannedResults.CountryCity);
    setLocal("Building", scannedResults.Building);
    setLocal("Floor", scannedResults.Floor);
    setLocal("Area", scannedResults.Area);
    setLocal("RegionNumber", scannedResults.RegionNumber);
    setLocal("DivisionNumber", scannedResults.DivisionNumber);
    setLocal("DistrictNumber", scannedResults.DistrictNumber);
    setLocal("CustomerNumber", scannedResults.CustomerNumber);
    setLocal("CustomerSiteNumber", scannedResults.CustomerSiteNumber);
    $("#" + pageID + "TagScanPopup").css("display", "block")
    $('div[id=' + pageID + "TagScanPopup" + ']').popup().popup("open"); 
////    $("#" + pageID + "TagScanPopup").popup();
////    $("#" + pageID + "TagScanPopup").popup("open");
}
