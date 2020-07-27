function PopupMenu(targetID) {    
    try {
        var actionTokens = JSON.parse(getLocal('actionTok'));
        var isMissionCritical = parseInt(getLocal('missionCriticalUser'));
        var sessionEmployee = parseInt(decryptStr(getLocal('loginUser')));
        var status;
        var assignment;
        var actionSecurity;
        var j;
        var nteApprovalCode;
        nteApprovalCode = document.getElementById("hiddenNEApprovalCode").getAttribute("value");
        status = document.getElementById("hiddenStatus").getAttribute("value");
        assignment = document.getElementById("hiddenEmployee").getAttribute("value");
        var systemSource = getLocal("WOSystemSource");
        var menuItem = document.getElementById(targetID);
        var menuChildren = menuItem.getElementsByTagName("li");
        
        if (actionTokens !== null) {
            actionSecurity = actionTokens.SgstCollection;
        }
        var attachmentOverride = false;
        var commentOverride = false;
        var modifyVendor = false;
        var modifyEmp = false;
        var preApproval = false;
        var invoiceApproval = false;
        var nteapproval = false;
        var nteincrease = false;

        //First get all overrides for the next loop
        for (i = 0; i < actionSecurity.length; i++) {
            // Special logic regarding Attachments
            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "attachmentoverride" && actionSecurity[i].CanAccess == 1) {
                attachmentOverride = true;
            }

            // Special logic regarding Comments
            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "commentoverride" && actionSecurity[i].CanAccess == 1) {
                commentOverride = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "modifyvendorassn" && actionSecurity[i].CanAccess == 1) {

                modifyVendor = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "modifyempassn" && actionSecurity[i].CanAccess == 1) {

                modifyEmp = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "preapproval" && actionSecurity[i].CanAccess == 1) {

                preApproval = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "invoiceapproval" && actionSecurity[i].CanAccess == 1) {

                invoiceApproval = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "nteapproval" && actionSecurity[i].CanAccess == 1) {

                nteapproval = true;
            }

            if (actionSecurity[i].SubTokenDescription.toLowerCase() == "nteincrease" && actionSecurity[i].CanAccess == 1) {

                nteincrease = true;
            }
        }

        //Now show All, then Hide menu items as needed
        for (j = 0; j < menuChildren.length; j++) {
            menuChildren[j].style.display = "block"; //Start by enabling

            // Check Security bits- hide all where CanAccess = 0
            for (i = 0; i < actionSecurity.length; i++) {

                if (menuChildren[j].attributes.id.value.toLowerCase() == "lnktasks" + actionSecurity[i].SubTokenDescription.toLowerCase().replace(/\s/g, "")) {
                    //showError(actionSecurity[i].CanAccess);

                    // Special logic regarding Attachments or comment
                    if ((actionSecurity[i].SubTokenDescription.toLowerCase() == "addattachment" && attachmentOverride) ||
        (actionSecurity[i].SubTokenDescription.toLowerCase() == "addcomment" && commentOverride)) {
                        menuChildren[j].style.display = "block";
                        break;
                    }
                    if (actionSecurity[i].CanAccess != 1) {
                        menuChildren[j].style.display = "none";
                    }
                    break;
                }

            }
            // Identify if the order is a vendor or employee order
            if (assignment === null) {
                // Disable items not allowed when user can not modify vendor orders
                if (modifyVendor === false || modifyEmp === false) {
                    if (menuChildren[j].attributes.id.value != "lnkTasksCancel" && menuChildren[j].attributes.id.value != "lnkTasksCancel_Manager" && menuChildren[j].attributes.id.value != "lnkTasksCancel_Tech" && menuChildren[j].attributes.id.value != "lnkTasksSetTag" && menuChildren[j].attributes.id.value != "lnkTasksDuplicate") {
                        menuChildren[j].style.display = "none";
                    }

                    if ((menuChildren[j].attributes.id.value == "lnkTasksAddAttachment" && attachmentOverride) ||
                        (menuChildren[j].attributes.id.value == "lnkTasksAddComment" && commentOverride)) {
                        menuChildren[j].style.display = "block";
                    }
                }
            }
            // Disable items not allowed when user is not the assignment
            else if (assignment != sessionEmployee && isMissionCritical === 0 && modifyEmp === false) {
                if (menuChildren[j].attributes.id.value != "lnkTasksCancel" && menuChildren[j].attributes.id.value != "lnkTasksCancel_Manager" && menuChildren[j].attributes.id.value != "lnkTasksCancel_Tech" && menuChildren[j].attributes.id.value != "lnkTasksSetTag" && menuChildren[j].attributes.id.value != "lnkTasksDuplicate") {
                    menuChildren[j].style.display = "none";
                }

                if ((menuChildren[j].attributes.id.value == "lnkTasksAddAttachment" && attachmentOverride) ||
                    (menuChildren[j].attributes.id.value == "lnkTasksAddComment" && commentOverride)) {
                    menuChildren[j].style.display = "block";
                }
            }
        }

        switch (status) {
            case "DEN":
                //Enroute, so only Arrived allowed
                for (j = 0; j < menuChildren.length; j++) {
                    if (menuChildren[j].attributes.id.value != "lnkTasksArrived" &&
                        menuChildren[j].attributes.id.value != "lnkTasksSetTag" &&
                        menuChildren[j].attributes.id.value != "lnkTasksReliabilityData" &&
                        menuChildren[j].attributes.id.value != "lnkTasksAddAttachment") {
                        menuChildren[j].style.display = "none";
                    }
                }
                break;

            case "DST":
                //Started, so only Stop allowed
                for (j = 0; j < menuChildren.length; j++) {
                    if (menuChildren[j].attributes.id.value != "lnkTasksStop" &&
                        menuChildren[j].attributes.id.value != "lnkTasksSetTag" &&
                        menuChildren[j].attributes.id.value != "lnkTasksReliabilityData" &&
                        menuChildren[j].attributes.id.value != "lnkTasksAddAttachment") {
                        menuChildren[j].style.display = "none";
                    }
                }
                break;

            default:
                if (status.substring(0, 1) == "C") {
                    //Complete or Canceled
                    for (j = 0; j < menuChildren.length; j++) {
                        if ((status == 'CMP' &&
                             menuChildren[j].attributes.id.value == "lnkTasksReliabilityData") ||
                            menuChildren[j].attributes.id.value != "lnkTasksReliabilityData" &&
                            menuChildren[j].attributes.id.value != "lnkTasksDuplicate") {
                            console.log('hiding: ' + menuChildren[j].attributes.id.value);
                            menuChildren[j].style.display = "none";
                        }
                        if ((menuChildren[j].attributes.id.value == "lnkTasksInvoiceApproval") && status != 'CAN' && status != 'CMP' && invoiceApproval == true) {
                            menuChildren[j].style.display = "block";
                        }
                    }

                    // Disable the CAS fields when the status of the WO is like C%
                    $('#NTEValue').attr('disabled', true);
                    $('#workOrderCurrencyCodeSelect').selectmenu('disable');
                    $('#serviceContractValue').attr('disabled', true);
                    $('#casSaveButton').addClass('ui-disabled');
                    $('#casCancelButton').addClass('ui-disabled');
                }
                else {
                    // Not Complete or Canceled, so Open
                    for (j = 0; j < menuChildren.length; j++) {
                        // If system source, disable the option.
                        if (systemSource === "true" && menuChildren[j].attributes.id.value == "lnkTasksSetSource") {
                            $(menuChildren[j]).addClass('ui-disabled');
                        }
                        if ((menuChildren[j].attributes.id.value == "lnkTasksArrived") || (menuChildren[j].attributes.id.value == "lnkTasksStop")) {
                            menuChildren[j].style.display = "none"; //Hide: Arrived, Stop
                        }
                        if ((menuChildren[j].attributes.id.value == "lnkTasksInvoiceApproval") && invoiceApproval == true) {
                            $(menuChildren[j]).addClass('ui-disabled');
                        }
                        if (status.substring(0, 2).toUpperCase() == "OA" && status.toUpperCase() != "OAD") {
                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEApproval") && nteapproval == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }
                        }
                        if (status.substring(0, 2).toUpperCase() == "QA") {
                            if ((menuChildren[j].attributes.id.value == "lnkTasksPreApproval") && preApproval == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }
                        }
                        ////Below condition to disable NTE attachment if the work order is awaiting for pre approval or invoice approval.                
                        if ((status.substring(0, 2).toUpperCase() == "OA" || status.substring(0, 2).toUpperCase() == "QA") && status.toUpperCase() != "OAD") {
                            ////                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEApproval")) {
                            ////                                $(menuChildren[j]).addClass('ui-disabled');
                            ////                            }
                            switch (menuChildren[j].attributes.id.value) {
                                case "lnkTasksCreateSubOrder":
                                case "lnkTasksComplete":
                                case "lnkTasksFieldPO":
                                case "lnkTasksETA":
                                case "lnkTasksEnroute":
                                case "lnkTasksStart":
                                case "lnkTasksHold":
                                case "lnkTasksLabor":
                                case "lnkTasksPhoneFix":
                                    $(menuChildren[j]).addClass('ui-disabled');
                                    break;
                                case "lnkTasksNTEIncrease":
                                    if (nteincrease == true) {
                                        $(menuChildren[j]).addClass('ui-disabled');
                                    }
                                    break;
                            }
                        }
                        else if (status.substring(0, 2).toUpperCase() == "CA") {
                            switch (menuChildren[j].attributes.id.value) {
                                case "lnkTasksCreateSubOrder":
                                case "lnkTasksComplete":
                                case "lnkTasksFieldPO":
                                case "lnkTasksETA":
                                case "lnkTasksEnroute":
                                case "lnkTasksStart":
                                case "lnkTasksHold":
                                case "lnkTasksLabor":
                                case "lnkTasksPhoneFix":
                                case "WODetailCancelLink":
                                case "lnkTasksSetTag":
                                case "lnkTasksNTEIncrease":
                                    $(menuChildren[j]).addClass('ui-disabled');
                                    break;
                                case "lnkTasksNTEIncrease":
                                    if (nteincrease == true) {
                                        $(menuChildren[j]).addClass('ui-disabled');
                                    }
                                    break;
                            }
                        }
                        else if ((status.substring(0, 2).toUpperCase() == "OA" || status.substring(0, 2).toUpperCase() == "QA") && status.toUpperCase() != "OAD") {
                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEApproval") && nteapproval == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }

                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEIncrease") && nteincrease == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }
                        }
                        else if (NTEDefaultValueInt == 1 && nteApprovalCode == null) {
                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEIncrease") && nteincrease == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }
                        }
                        else if (NTEDefaultValueInt == 0) {
                            if ((menuChildren[j].attributes.id.value == "lnkTasksNTEApproval") && nteapproval == true) {
                                $(menuChildren[j]).addClass('ui-disabled');
                            }                            
                        }
                    }
                }
        }

        //// SIC 3051 lock down of Reassign incase of WO is ExternalPO
        //// Added NTEApproval
        if (getLocal("IsExternalPO").toUpperCase() == "TRUE") {
            // SIC 3051 updated as per new changes
            $('#casSaveButton').addClass('ui-disabled');
            for (j = 0; j < menuChildren.length; j++) {
                switch (menuChildren[j].attributes.id.value) {
                    case "lnkTasksReassign":
                    case "lnkTasksReassign_CallCenter":
                    case "lnkTasksReassign_Manager":
                    case "lnkTasksReassign_Tech":
                    case "lnkTasksReassign_Vendor":
                    case "lnkTasksCancel":
                    case "lnkTasksCancel_Manager":
                    case "lnkTasksCancel_Tech":
                    case "lnkTasksNTEApproval":
                    case "lnkTasksNTEIncrease":
                       $(menuChildren[j]).addClass('ui-disabled');
                }
            }
        }

        //// SIC 3051 lock down of following incase work order is lockdown status "PRL"
       if (status.toUpperCase() == getLocal("MyBuySpecialStatus").toUpperCase()) {
            // SIC 3051 updated as per new changes
            $('#casSaveButton').addClass('ui-disabled');
            for (j = 0; j < menuChildren.length; j++) {
                switch (menuChildren[j].attributes.id.value) {
                    
                    case "lnkTasksETA":
                    case "lnkTasksEnroute":
                    case "lnkTasksArrived":
                    case "lnkTasksStart":
                    case "lnkTasksStop":
                    case "lnkTasksHold":
                    case "lnkTasksReassign":
                    case "lnkTasksReassign_CallCenter":
                    case "lnkTasksReassign_Manager":
                    case "lnkTasksReassign_Tech":
                    case "lnkTasksReassign_Vendor":
                    case "lnkTasksComplete":
                    case "lnkTasksCancel":
                    case "lnkTasksCancel_Manager":
                    case "lnkTasksCancel_Tech":
                    case "lnkTasksFieldPO":
                    case "lnkTasksStockMaterial_PO":
                    case "lnkTasksLabor":
                    case "lnkTasksPreApproval":
                    case "lnkTasksInvoiceApproval":
                    case "lnkTasksNTEApproval":
                    case "lnkTasksNTEIncrease":
                    case "lnkTasksSetSource":
                    $(menuChildren[j]).addClass('ui-disabled');
                }                                   
            }
        }

        // If all menu items are hidden, then hide the menu pane.
        var hiddenItem = parseInt(0);
        for (j = 0; j < menuChildren.length; j++) {
            if (menuChildren[j].style.display == "none") {
                hiddenItem++;
            }
        }

        if (menuChildren.length == hiddenItem) {
            var pageID = $.mobile.activePage.attr('id');
            $("#" + pageID).find("#WODMenuButton").addClass('ui-disabled');
        }        
        return false;
    }
    catch (e) {       
    }
}

function TagPopupMenu(targetID) {
    try {

        var pageId = $.mobile.activePage.attr('id');
        var actionTokens = JSON.parse(getLocal('SgtCollection'));
        var actionSecurity;
        var j;
        var menuItem = document.getElementById(targetID);
        var menuChildren = menuItem.getElementsByTagName("li");
        var disableCreateWO = false;
        
        if (actionTokens !== null) {
            for (i = 0; i < actionTokens.length; i++){
                if (actionTokens[i].Description.replace(/\s+/g, '') === pageId) {
                    actionSecurity = actionTokens[i].SgstCollection;
                }
                
                // Do logic for Create WO here because it's a master ID and not sub token.
                if (actionTokens[i].MasterID === 400040 && actionTokens[i].TokenID === 0 && actionTokens[i].CanAccess === 0) {
                    disableCreateWO = true;
                }
            }
        }
        
        //Now show All, then Hide menu items as needed
        for (j = 0; j < menuChildren.length; j++) {
            menuChildren[j].style.display = "block"; //Start by enabling
            
            // Check Security bits- hide all where CanAccess = 0
            for (i = 0; i < actionSecurity.length; i++) {
                
                if (menuChildren[j].attributes.id.value.toLowerCase() == "lnktasks" + actionSecurity[i].SubTokenDescription.toLowerCase()) {
                    //showError(actionSecurity[i].CanAccess);
                    
                    if (actionSecurity[i].CanAccess != 1) {
                        menuChildren[j].style.display = "none";
                    }
                    break;
                }
                
                if (menuChildren[j].attributes.id.value.toLowerCase() == "lnktaskscreatewo") {
                    if (disableCreateWO === true) {
                        menuChildren[j].style.display = "none";
                    }
                    break;
                }
            }
        }
        
        // If all menu items are hidden, then hide the menu pane.
        var hiddenItem = parseInt(0);
        for (j = 0; j < menuChildren.length; j++) {
            if (menuChildren[j].style.display == "none") {
                hiddenItem++;
            }
        }
        
        if (menuChildren.length == hiddenItem) {
            var pageID = $.mobile.activePage.attr('id');
            $("#" + pageID).find("#TagMenuButton").addClass('ui-disabled');
        }        
        return false;
    }
    catch (e) {       
    }
}

function CheckSecurityForFieldPO(SgtCollection) {
    var pageID = '#' + $.mobile.activePage.attr('id');
    // Hide or show PCard field
    if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "FieldPO_PCardNumber", "CanAccess")) {
        $(pageID).find("#FieldPOPCardNumberUI").hide();
    }
    else {
        // Required Check on PCard number field (should only be allowable if the field can be accessed.)
        if ($.GetSecuritySubTokensBit(SgtCollection, 0, "FieldPO_PCardNumber", "Required")) {
            // Rule - Override Read only.
            $(pageID + ' #FieldPOPCardNumberRequiredLabel').show();
            $(pageID + ' #FieldPOPCardNumber').attr("Requried", "true");
            $(pageID + ' #FieldPOPCardNumber').removeClass('ui-disabled');
        }
        else {
            $(pageID + ' #FieldPOPCardNumberRequiredLabel').hide();
            if (!$.GetSecuritySubTokensBit(SgtCollection, 0, "FieldPO_PCardNumber", "ReadOnly")) {
                $(pageID + ' #FieldPOPCardNumber').addClass('ui-disabled');
            }
        }
    }
}
