function navigateToMaterialFieldPO() {
    if (navigator.onLine) {
        $.mobile.changePage("MaterialPO.html");
    }
}

function getMaterialPOList() {
    var data = {
        "SearchText": localStorage.getItem("WorkOrderNumber"),
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "PageNumber": 1,
        "PageSize": 6,
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
    };

    var materialPOListURL = standardAddress + "WorkOrderActions.ashx?methodname=GetMaterialView";
    if (navigator.onLine) {
        BindMaterialListData(materialPOListURL, data);
    }
    else {
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function BindMaterialListData(materialPOListURL, data) {
    $.postJSON(materialPOListURL, data, function (result) {
        var TotalRecord = result[result.length - 1].TotalRecords;
        var HTParentWONum = GetTranslatedValue("MaterialPOWONum");
        var HTWOMaterialNum = GetTranslatedValue("WorkOrderMaterialNumber");
        var HTWONum = GetTranslatedValue("WorkOrderNumber");
        var HTDatePosted = GetTranslatedValue("DatePosted");
        var HTShipType = GetTranslatedValue("ShipType");
        var HTNotes = GetTranslatedValue("Notes");
        var HTQuantity = GetTranslatedValue("Quantity");
        var HTQuantityShip = GetTranslatedValue("QuantityShipped");
        var HTBackOrdered = GetTranslatedValue("BackOrdered");
        var HTListPrice = GetTranslatedValue("ListPrice");
        var HTCostPerUnit = GetTranslatedValue("CostPerUnit");
        var HTAccount = GetTranslatedValue("Account");
        var HTDiscount = GetTranslatedValue("Discount");
        var HTWeight = GetTranslatedValue("Weight");
        var HTWarehouse = GetTranslatedValue("Warehouse");
        var HTVendorName = GetTranslatedValue("VendorName");

        $("#MaterialPOWONum").html(HTParentWONum + ' ' + localStorage.getItem("WorkOrderNumber"));
        $("#MaterialPOWONum").append('<span class="badge">' + TotalRecord + '</span>');
        if (TotalRecord === 0) {
            $('#NoMaterialPODiv').show();
        }
        else {
            var materialPOList = "";
            for (var i = 0; i < result.length - 1; i++) {
                var datePosted = result[i].DatePostedString + ' ' + result[i].TimeZone;
                var WareDesc = IsStringNullOrEmpty(result[i].WarehouseDescription) ? emptyString : result[i].WarehouseDescription;
                var VendorName = IsStringNullOrEmpty(result[i].VendorName) ? emptyString : result[i].VendorName;
                var Notes = IsStringNullOrEmpty(result[i].Notes) ? emptyString : result[i].Notes;

                materialPOList = materialPOList + '<li data-role="list-divider">' +
               '<span style="font-size: 12px">' + HTWOMaterialNum + ' ' + result[i].WorkOrderMaterialNumber + '</span></li>' +
               '<li><p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTWONum + ' ' + result[i].WorkOrderNumber + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTDatePosted + ' ' + datePosted + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTShipType + ' ' + result[i].ShipType + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTNotes + ' ' + Notes + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTQuantity + ' ' + result[i].Quantity + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTQuantityShip + ' ' + result[i].QuantityShipped + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTBackOrdered + ' ' + result[i].BackOrdered + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTListPrice + ' ' + result[i].ListPrice + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTCostPerUnit + ' ' + result[i].CostPerUnit + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTAccount + ' ' + result[i].GLAccount + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTDiscount + ' ' + result[i].Discount + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTWeight + ' ' + result[i].Weight + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTWarehouse + ' ' + WareDesc + '</p>' +
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;">' + HTVendorName + ' ' + VendorName + '</p>' +
               '</li>';
            }

            $("#MaterialPoList").append(materialPOList);
            $("#MaterialPoList").listview("refresh");
            if ($("#MaterialPoList li").length / 2 == parseInt(TotalRecord)) {
                $("#materialPONextButton").hide();
            }
            else {
                $("#materialPONextButton").show();
            }
        }
    });
}

function GetNextMaterialPOList(tag) {
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr('id');
            var id = tag.id;
            var pageNum = parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1;
            var data = {
                "SearchText": localStorage.getItem("WorkOrderNumber"),
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "PageNumber": pageNum,
                "PageSize": 6,
                "SessionID": decryptStr(getLocal("SessionID")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
            };
            $("#" + pageID).find("#" + id).attr('data-nextpage', parseInt($("#" + pageID).find("#" + id).attr('data-nextpage')) + 1);
            var materialPOListURL = standardAddress + "WorkOrderActions.ashx?methodname=GetMaterialView";
            BindMaterialListData(materialPOListURL, data);
        }

        else {
            ////showError("No network connection. Please try again when network is available.");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
        }

    }
    catch (e) {
        //log(e);
    }
}