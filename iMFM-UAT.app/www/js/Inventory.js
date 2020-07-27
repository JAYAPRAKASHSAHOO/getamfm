var Inventory = {};

// A collection of parts in the user's assigned warehouses based on the search criteria provided by the user.
Inventory.PartSearchResults = {};

// Temporary storage for inventory transactions that reference a selected part.
Inventory.SelectedPartNumber = null;

// Temporary storage for inventory transactions that reference a selected warehouse.
Inventory.SelectedWarehouseNumber = null;

// Temporary storage for inventory transactions that reference a selected bin.
Inventory.SelectedBinNumber = null;

// Temporary storage for inventory transactions that reference a selected part's serial number.
Inventory.SelectedSerialNumber = null;

/**
*  Load/Configure the ActionPage.html security for
*  creating a stock PO (depleting inventory)
*/
Inventory.PrepareMaterialPO = function () {
    var SgtCollection = $.GetSecuritySubTokens(400009, 1);

    EnforceFieldSecurity(SgtCollection, "EquipPartNumber", true);
    EnforceFieldSecurity(SgtCollection, "WarehouseNumber", true);
    EnforceFieldSecurity(SgtCollection, "BinNumber", true);
    // Quantity On Hand would be here, but this is non-editable data.
    EnforceFieldSecurity(SgtCollection, "Quantity", true);
    EnforceFieldSecurity(SgtCollection, "PricePerUnit", true);
    EnforceFieldSecurity(SgtCollection, "CurrencyCode", true);
    //EnforceFieldSecurity(SgtCollection, "SerialNumber", false);

    // Add handler for highlighting Price/Qty on button press.
    $('[data-field="Quantity"] input.js-sToken, [data-field="PricePerUnit"] input.js-sToken').on('focus', function () {
        var $this = $(this)
            .one('mouseup.mouseupSelect', function () {
                //debugger
                console.log(".one mouseup");
                this.selectionStart = 0;
                this.selectionEnd = 9999;
                return false;
            });
        this.selectionStart = 0;
        this.selectionEnd = 9999;
    });
};

/**
* Fetch and populate the Inventory.PartSearchResults collection with user information.
* @param [string] searchCriteria - value to search user's warehouses for
* @returns [Deferred] The status of the fetch process
*/
Inventory.FetchPartInformation = function (searchCriteria) {
    var fetchStatus = $.Deferred();
    var jsonParams = {
        "DatabaseID": decryptStr(getLocal("DatabaseID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber")),
        "SessionID": decryptStr(getLocal("SessionID")),
        "Language": getLocal("Language"),
        "SearchString": searchCriteria
    };

    var fetchURL = standardAddress + "Inventory.ashx?methodname=GetParts";

    $.postJSON(fetchURL, jsonParams, function (fetchResults) {
        try {
            if (fetchResults.Table.length > 0) {
                Inventory.PartSearchResults = fetchResults.Table;
            } else {
                Inventory.PartSearchResults = {};
            }
        } catch (ex) {
            Inventory.PartSearchResults = {};

        } finally {
            fetchStatus.resolve();
        }
    });

    return fetchStatus.promise();
};

/**
*  Populate dropdown for part information as provided by user.
*  @param [Object] searchField - Entity which contains the value to search warehouse's part number & description for
*/
Inventory.LoadPartNumber = function (searchField) {
    // We only fetch data after at least 3 characters.
    if (searchField.value.length >= 3) {
        //Inventory.FetchPartInformation(searchField.value);

        $.when(Inventory.FetchPartInformation(searchField.value)).done(function () {
            // Populate the dropdown(s) that contain data-search values with Part # and Description.
            $('[data-search="' + searchField.id + '"]').each(function () {
                var totalCount = 0;
                $(this).find(' option:gt(0)').remove();

                for (i = 0; i < Inventory.PartSearchResults.length; i++) {
                    var optionExists = false;
                    $(this).find(' option').each(function () {
                        if (this.value === Inventory.PartSearchResults[i].EquipPartNumber) {
                            optionExists = true;
                            return false;
                        }
                    });

                    if (!optionExists) {
                        var optionTag = document.createElement('option');
                        optionTag.setAttribute("value", Inventory.PartSearchResults[i].EquipPartNumber);
                        optionTag.innerHTML = "[" + Inventory.PartSearchResults[i].EquipPartNumber + "] " + Inventory.PartSearchResults[i].PartDescription;
                        $(this).append(optionTag);
                        totalCount++;
                    }
                }

                // Update the Select Part option to have the count.
                if (totalCount === 0) {
                    $(this).find(' option[value=-1]')[0].innerHTML = GetTranslatedValue("PartNotFound");
                } else {
                    $(this).find(' option[value=-1]')[0].innerHTML = "-- [ " + totalCount.toString() + " ] " + GetCommonTranslatedValue("RecordsFound");
                }

                // Set the value if there's only one.
                if ($(this).children('option').length === 2) {
                    $(this).val($(this).find(' option')[1].value);
                    $(this).selectmenu("refresh");
                    //$(this).trigger("change");
                } else {
                    $(this).selectmenu("refresh");
                }

                $(this).trigger("change");
            });
        });
    }
};

/**
*  Load the Warehouse dropdown for the selected part.
*  @param [object] parentEntity - The parent of this dropdown, which contains the value and dropdown to load.
*/
Inventory.LoadWarehouseData = function (parentEntity) {

    console.log("WarehouseData: " + parentEntity.value);
    Inventory.SelectedPartNumber = parentEntity.value;
    $('[data-search="' + parentEntity.id + '"]').each(function () {
        var totalCount = 0;
        var partArr = $.grep(Inventory.PartSearchResults, function (part) { return (part.EquipPartNumber == parentEntity.value); });
        $(this).find(' option:gt(0)').remove();

        for (i = 0; i < partArr.length; i++) {
            var optionExists = false;
            $(this).find(' option').each(function () {
                if (this.value == partArr[i].WarehouseNumber) {
                    optionExists = true;
                    return false;
                }
            });

            if (!optionExists && Inventory.SelectedPartNumber !== "-1") {
                var optionTag = document.createElement('option');
                optionTag.setAttribute("value", partArr[i].WarehouseNumber);
                optionTag.innerHTML = partArr[i].WarehouseDescription;
                $(this).append(optionTag);
                totalCount++;
            }
        }

        // Update the Select Part option to have the count.
        if (totalCount === 0) {
            $(this).find(' option[value=-1]')[0].innerHTML = GetTranslatedValue("WarehouseNotFound");
        } else {
            $(this).find(' option[value=-1]')[0].innerHTML = "-- [ " + totalCount.toString() + " ] " + GetCommonTranslatedValue("RecordsFound");
        }

        // Set the value if there's only one.
        if ($(this).children('option').length === 2) {
            $(this).val($(this).find(' option')[1].value);
            $(this).selectmenu("refresh");
            //$(this).trigger("change");
        }

        // Trigger next level if there are no results in the dropdown or if there is only one.
        //if ($(this).children('option').length <= 2){
        $(this).trigger("change");
        //}

        // If this is a multi level dropdown, assume that the entity will be wrapped in two divs.
        if (Inventory.SelectedPartNumber === "-1") {
            $(this).parents().eq(3).hide();
        } else {
            $(this).parents().eq(3).show();
        }

        $(this).selectmenu("refresh");
    });
};

/**
*  Load the Bin dropdown for the selected warehouse.
*  @param [object] parentEntity - Dropdown entity which we are populating, contains the value of the previous level to load into the dropdown.
*/
Inventory.LoadBinData = function (parentEntity) {

    console.log("BinData: " + parentEntity.value);
    Inventory.SelectedWarehouseNumber = parseInt(parentEntity.value);
    $('[data-search="' + parentEntity.id + '"]').each(function () {
        var totalCount = 0;
        //var partNumber = $("#" + $(parentEntity).attr('data-search')).val();

        var partArr = $.grep(Inventory.PartSearchResults, function (part) { return (part.WarehouseNumber === Inventory.SelectedWarehouseNumber) && (part.EquipPartNumber === Inventory.SelectedPartNumber); });
        $(this).find(' option:gt(0)').remove();

        for (i = 0; i < partArr.length; i++) {
            var optionExists = false;
            $(this).find(' option').each(function () {
                if (this.value == partArr[i].BinNumber) {
                    optionExists = true;
                    return false;
                }
            });

            if (!optionExists) {
                var optionTag = document.createElement('option');
                optionTag.setAttribute("value", partArr[i].BinNumber);
                optionTag.innerHTML = partArr[i].BinDescription;
                $(this).append(optionTag);
                totalCount++;
            }
        }

        // Update the Select Part option to have the count.
        if (totalCount === 0) {
            $(this).find(' option[value=-1]')[0].innerHTML = GetTranslatedValue("BinNotFound");
        } else {
            $(this).find(' option[value=-1]')[0].innerHTML = "-- [ " + totalCount.toString() + " ] " + GetCommonTranslatedValue("RecordsFound");
        }

        // Set the value if there's only one.
        if ($(this).children('option').length === 2) {
            $(this).val($(this).find(' option').eq(1).val());
            $(this).selectmenu("refresh");
            //$(this).trigger("change");
        }

        $(this).trigger("change");

        // If this is a multi level dropdown, assume that the entity will be wrapped in two divs.
        if (Inventory.SelectedWarehouseNumber === -1) {
            $(this).parents().eq(3).hide();
        } else {
            $(this).parents().eq(3).show();
        }

        $(this).selectmenu("refresh");
    });
};

/**
*  Load the serial number data into the specified dropdown.
*  @param [object] parentEntity - Dropdown which we are populating, contains the value of the previous level to load into the dropdown.
*/
Inventory.LoadSerialNumberData = function (parentEntity) {
    console.log("LoadSerialNumberData");
    var SgtCollection = $.GetSecuritySubTokens(400009, 1);
    Inventory.SelectedBinNumber = parseInt(parentEntity.value);
    var partArr = $.grep(Inventory.PartSearchResults, function (part) {
        return (part.EquipPartNumber === Inventory.SelectedPartNumber) && (part.WarehouseNumber === Inventory.SelectedWarehouseNumber) && (part.BinNumber === Inventory.SelectedBinNumber);
    });

    $('[data-search="' + parentEntity.id + '"]').each(function () {
        var totalCount = 0;
        $(this).find(' option:gt(0)').remove();

        // Check for PartType.
        if (IsObjectNullOrUndefined(partArr) || partArr.length === 0) {
            $(this).find(' option[value=-1]')[0].innerHTML = GetTranslatedValue("SerialNotFound");
            $(this).val($(this).find(' option').eq(1).val());
            $(this).selectmenu("refresh");

            // Assume the multi level dropdown needs to be hidden and is wrapped in two divs.
            $(this).parents().eq(3).hide();
            return false;
        }

        if (partArr[0].PartType === "Serial") {
            EnforceFieldSecurity(SgtCollection, "SerialNumber", true);

            for (i = 0; i < partArr.length; i++) {
                var optionExists = false;
                $(this).find(' option').each(function () {
                    if (this.value == partArr[i].SerialNumber) {
                        optionExists = true;
                        return false;
                    }
                });

                if (!optionExists) {
                    var optionTag = document.createElement('option');
                    optionTag.setAttribute("value", partArr[i].SerialNumber);
                    optionTag.innerHTML = partArr[i].SerialNumber;
                    $(this).append(optionTag);
                    totalCount++;
                }
            }

            // Update the Select Part option to have the count.
            if (totalCount === 0) {
                $(this).find(' option[value=-1]')[0].innerHTML = GetTranslatedValue("SerialNotFound");
            } else {
                $(this).find(' option[value=-1]')[0].innerHTML = "-- [ " + totalCount.toString() + " ] " + GetCommonTranslatedValue("RecordsFound");
            }

            // Set the value if there's only one.
            if ($(this).children('option').length === 2) {
                $(this).val($(this).find(' option').eq(1).val());
                $(this).selectmenu("refresh");
                //$(this).trigger("change");
            }

            $(this).trigger("change");

            // If this is a multi level dropdown, assume that the entity will be wrapped in two divs.
            if (Inventory.SelectedBinNumber === -1) {
                $(this).parents().eq(3).hide();
            } else {
                $(this).parents().eq(3).show();
            }
        } else {
            // For non-serial parts, make the field not required, leave it with no value and trigger the LoadPartData function.
            EnforceFieldSecurity(SgtCollection, "SerialNumber", false);
            $(this).val(-1);
            $(this).trigger("change");
        }
    });
};

/**
*  Retrieve part information from server to populate remaining fields on form (Quantity On Hand,
*  Price, Currency Code, etc.)
*  @param [object] parentEntity - Dropdown which we are populating, contains the value of the previous level to load into the dropdown.
*/
Inventory.LoadPartData = function (parentEntity) {
    console.log("LoadPartData");
    Inventory.SelectedSerialNumber = parentEntity.value;
    var selectedPart = $.grep(Inventory.PartSearchResults, function (part) {
        return (part.EquipPartNumber === Inventory.SelectedPartNumber) && (part.WarehouseNumber === Inventory.SelectedWarehouseNumber) && (part.BinNumber === Inventory.SelectedBinNumber);
    });

    // Strip out the non-matches for serial number if it's there
    selectedPart = $.grep(selectedPart, function (part) {
        return ("-1" === Inventory.SelectedSerialNumber || part.SerialNumber === Inventory.SelectedSerialNumber);
    });

    // Take the first value, as there should only be one left.
    selectedPart = selectedPart[0];

    if (IsObjectNullOrUndefined(selectedPart)) {
        $('[data-field="QuantityOnHand"]:not(:hidden)').hide();
        return false;
    } else {
        // Make any of the fields that we're populating (QOH, Price, CurencyCode) visible if they aren't already.
        $('[data-field="QuantityOnHand"]:hidden').show();
        $('[data-field="PricePerUnit"]:hidden').show();
        $('[data-field="CurrencyCode"]:hidden').show();
    }


    $('[data-field="QuantityOnHand"] .js-sToken').val(selectedPart.QuantityOnHand);
    $('[data-field="PricePerUnit"] .ui-block-a .js-sToken').val(selectedPart.ListPrice);

    // If part is serialized, only one can be depleted at a time.
    if (Inventory.SelectedSerialNumber !== "-1") {
        $('[data-field="Quantity"] .js-sToken').val(1);
        $('[data-field="Quantity"] .js-sToken').attr('readonly', 'readonly');
    } else {
        $('[data-field="Quantity"] .js-sToken').removeAttr('readonly');
    }
    //$('[data-field="CurrencyCode"] .js-sToken').find(' option').each(function () {
    //    if (this.value == selectedPart.CurrencyCode) {
    //        this.parent.val(this.value);
    //        return false;
    //    }
    //});
};

/**
* Prepare the submission process for the inventory module.
* @param [string] submissionProcess - The form in which we're submitting.
*/
Inventory.SubmitForm = function (submissionProcess) {
    ////var results = {};
    showActionPopupLoading();

    switch (submissionProcess) {
        case "MaterialPO":
            // Expecting a results object that will return a message related to the result of the submission.
            Inventory.SubmitMaterialPO().always(function (results) {

                closeActionPopupLoading();
                setTimeout(function () {

                    if (results.status.toUpperCase() === "SUCCESS") {
                        if (results.message != undefined)
                            showError(GetTranslatedValue("MaterialPOSuccessMessage").replace("[WONUM]", results.message), CloseActionPopup);
                        else
                            showError(GetTranslatedValue("MaterialPOSuccessMessage").replace(" # [WONUM]", ""), CloseActionPopup);
                    } else {
                        if (!IsStringNullOrEmpty(results.message)) {
                            showError(results.message);
                        }
                    }
                }, 1000);
            });
            break;
        default: closeActionPopupLoading();
    };
};

/** 
* Validate and prepare MaterialPO form for submission.
* @returns [promise] The object will contain a message with the work order number of the created sub, or an error message.
*/
Inventory.SubmitMaterialPO = function () {
    var results = { status: "ERROR", message: null, name: null };
    var submissionProgress = new $.Deferred();

    try {
        var quantity = parseInt(securityError($('[data-field="Quantity"] .js-sToken').first()));
        var quantityOnHand = parseInt(securityError($('[data-field="QuantityOnHand"] .js-sToken').first()));
        var price = parseFloat(securityError($('[data-field="PricePerUnit"] .js-sToken').first()));
        var serialNumber = $('[data-field="SerialNumber"] .js-sToken').first().text();
        var currencyCode = $('[data-field="CurrencyCode"] .js-sToken').first().text();

        // Sanitize fields
        $('[data-field="Quantity"] .js-sToken').first().val(quantity);
        $('[data-field="PricePerUnit"] .js-sToken').first().val(price);
        $('[data-field="SerialNumber"] .js-sToken').first().val(serialNumber);

        if (ValidateFields()) {

            // Validate the values are within anticipated ranges.
            if (isNaN(quantity) || isNaN(quantityOnHand) || isNaN(price) || quantity < 1) {
                results.message = GetTranslatedValue("InvalidValuesMessage");
            } else if (quantity > quantityOnHand) {
                results.message = GetTranslatedValue("QuantityGreaterThanOnHand");
            } else if (price <= 0) {
                results.message = GetTranslatedValue("PriceGreaterThanZero");
            }

            // Attempt to submit the transaction to the database.
            if (IsStringNullOrEmpty(results.message)) {
                if (navigator.onLine) {

                    var jsondata = {
                        DatabaseID: decryptStr(getLocal("DatabaseID")),
                        Language: getLocal("Language"),
                        EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
                        SessionID: decryptStr(getLocal("SessionID")),
                        EquipPartNumber: Inventory.SelectedPartNumber,
                        WarehouseNumber: Inventory.SelectedWarehouseNumber,
                        BinNumber: Inventory.SelectedBinNumber,
                        Quantity: quantity,
                        CostPerUnit: price,
                        CurrencyCode: currencyCode,
                        SerialNumber: serialNumber,
                        WorkOrderNumber: getLocal("WorkOrderNumber"),
                        GPSLocation: GlobalLat + "," + GlobalLong
                    };

                    Inventory.PostMaterialPOToWorkOrder(jsondata)
                    .done(function (subWO) {
                        results.status = "SUCCESS";
                        results.name = "MaterialPOCreated";
                        results.message = subWO.WorkOrderNumber;
                        submissionProgress.resolve(results);
                    })
                    .fail(function (error) {
                        if (error !== null && typeof error === 'object') {

                            results.message = error.SelectMessage;
                        } else {
                            results.message = error;
                        }

                        submissionProgress.resolve(results);
                    });
                } else {
                    results.message = GetCommonTranslatedValue("NoNetworkCommon");
                    submissionProgress.resolve(results);
                }
            } else {
                submissionProgress.reject(results);
            }
        } else {
            results.message = GetTranslatedValue("AllFieldsRequiredMessage");
            submissionProgress.reject(results);
        }
    }
    catch (e) {
        results.name = e.name;
        results.message = e.message;
        submissionProgress.reject(results);
    }

    return submissionProgress.promise();
};

/**
* Take the form data formatted as a json object and provide it to the server to 
* post a material PO to the work order.
* @param [object] jsonData - The json object that contains the submitted form contents to create a Material PO.
* @returns promise - The status of the query will be resolved from the promise.
*/
Inventory.PostMaterialPOToWorkOrder = function (jsonData) {
    var transactionStatus = new $.Deferred();
    var updateURL = standardAddress + "Inventory.ashx?methodname=MaterialPO";

    if (navigator.onLine) {
        $.postJSON(updateURL, jsonData, function (data) {
            transactionStatus.resolve(data);
        });
    } else {

        // Provide error message for failure.
        transactionStatus.reject(GetTranslatedValue("NoNetworkCommon"));
    }

    return transactionStatus.promise();
};