function syncPropertyData() {
    CheckDisable("propertyList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "PropertyData",
    { "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "LastSyncDate": localStorage.getItem("LastSyncDate"),
        "OfflineDataType": "1",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Property data");
        $('#propertySyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#propertySyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsL) {
            try {
                // Fill Locations
                FillProperyTable(tsL, result.AllLevelsDataSet.Table);
                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });

    });
}

function syncFloorData() {
    CheckDisable("floorList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "FloorData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "LastSyncDate": localStorage.getItem("LastSyncDate"),
        "OfflineDataType": "6",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Floor data");
        $('#floorSyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#floorSyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsF) {
            try {
                // Fill Locations                                
                FillFloorTable(tsF, result.AllLevelsDataSet.Table);
                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });

    });
}

function syncRoomData() {
    CheckDisable("roomList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "RoomData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "LastSyncDate": localStorage.getItem("LastSyncDate"),
        "OfflineDataType": "7",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Room data");
        $('#roomSyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#roomSyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsR) {
            try {
                // Fill Locations                               
                FillRoomTable(tsR, result.AllLevelsDataSet.Table);
                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });

    });
}

function syncAssignmentData() {
    CheckDisable("assignmentList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "AssignmentData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "OfflineDataType": "2",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //    $(DashBoardsynchronizingPopup).find('h1').text("Filled Assignment data");
        $('#assignmentSyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#assignmentSyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsA) {
            try {
                // Fill Assignments
                FillAssignmentTable(tsA, result.AssignmentTable);
                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });
    });
}

function syncSecurityData() {
    CheckDisable("securityList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "SecurityData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "OfflineDataType": "3",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Security data");
        $('#securitySyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#securitySyncStaus').css("color", "Green");
        // Action Subtokens
        setLocal('actionTok', JSON.stringify(result.ActionToken));
        setLocal('SgtCollection', JSON.stringify(result.SgtCollection));
        allCallsComplete++;
        CloseSyncPopup(allCallsComplete);
    });
}

function syncWorkorderData() {
    CheckDisable("workOrderList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "WorkorderData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "OfflineDataType": "4",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        var PastDueWorkOrderOfflineData = result.PastDueWorkOrderOfflineData;
        var DemandOrderWorkOrderOfflineData = result.DemandOrderWorkOrderOfflineData;
        var PMOrderWorkOrderOfflineData = result.PMOrderWorkOrderOfflineData;

        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Workorder data");
        $('#workOrderSyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#workOrderSyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsW) {
            try {
                // Fill Workorders 
                if (isEmptyObject(PastDueWorkOrderOfflineData)) {
                    FillDetailsTable(tsW, PastDueWorkOrderOfflineData, 1);
                }
                if (isEmptyObject(DemandOrderWorkOrderOfflineData)) {
                    FillDetailsTable(tsW, DemandOrderWorkOrderOfflineData, 2);
                }
                if (isEmptyObject(PMOrderWorkOrderOfflineData)) {
                    FillDetailsTable(tsW, PMOrderWorkOrderOfflineData, 3);
                }
                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });

    });
}

function syncAdditionalOfflineData() {
    CheckDisable("offlineList");
    $.postSyncJSON(standardAddress + "VendorSearch.ashx?method=GetOfflineData", "AdditionalOfflineData",
    {
        "DatabaseID":decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID") ?decryptStr(localStorage.getItem("DatabaseID")) ? decryptStr(localStorage.getItem("DatabaseID")) : localStorage.getItem("DatabaseID") : localStorage.getItem("DatabaseID"),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")) ? decryptStr(localStorage.getItem("EmployeeNumber")) : localStorage.getItem("EmployeeNumber"),
        "LastSyncDate": localStorage.getItem("LastSyncDate"),
        "OfflineDataType": "5",
        "SessionID": decryptStr(localStorage.getItem("SessionID")) ? decryptStr(localStorage.getItem("SessionID")) : localStorage.getItem("SessionID")
    }, function (result) {
        //        $(DashBoardsynchronizingPopup).find('h1').text("Filled Additional Offline data");        
        $('#offlineSyncStaus').text(GetTranslatedValue("syncSuccess"));
        $('#offlineSyncStaus').css("color", "Green");
        openDB();
        var d = new Date();
        dB.transaction(function (tsO) {
            try {
                //setLocal('iMFMOfflineEncryption', result.OffLineDataSet.Table5[0].iMFMOfflineEncryption);
                // Fill Assignments
                FillProblemTable(tsO, result.OffLineDataSet.Table);
                FillCommentsTabel(tsO, result.OffLineDataSet.Table1);
                FillResolutionCodeTable(tsO, result.OffLineDataSet.Table7);
                setLocal('CurrencyCollection', JSON.stringify(result.OffLineDataSet.Table2));
                // Site Labels
                setLocal('SiteLabels', result.OffLineDataSet.Table3[0].SiteLabels);
                FillServiceContractTable(tsO, result.OffLineDataSet.Table4);
                // CompanyDefault
                setLocal('MSIClientCode', result.OffLineDataSet.Table5[0].MSIClientCode);
                setLocal('FilterSCValue', result.OffLineDataSet.Table5[0].FilterSCValue);
                setLocal('CompanyCoveredIsBillable', result.OffLineDataSet.Table5[0].CompanyCoveredIsBillable);
                setLocal('OrderListingGroupBy', result.OffLineDataSet.Table5[0].OrderListingGroup);
                setLocal('SearchResultThreshold', result.OffLineDataSet.Table5[0].SearchResultThreshold);
                setLocal('ApprovalDashboardStartsWith', result.OffLineDataSet.Table5[0].ApprovalDashboardStartsWith);
                setLocal('ApprovalLogStartsWith', result.OffLineDataSet.Table5[0].ApprovalLogStartsWith);
                setLocal('SelfGenPriority', result.OffLineDataSet.Table5[0].SelfGenPriority);
                setLocal('HoldStatus', result.OffLineDataSet.Table5[0].HoldStatus);
                setLocal('WOClose_ResCodeFilterByGroup', result.OffLineDataSet.Table5[0].WOClose_ResCodeFilterByGroup);
                setLocal('iMFM_TextFieldMaximumLimit', result.OffLineDataSet.Table5[0].iMFM_TextFieldMaximumLimit);
                setLocal('TechnicianStatus', IsStringNullOrEmpty(result.OffLineDataSet.Table5[0].CurrentEmployeeStatus) ? 1 : result.OffLineDataSet.Table5[0].CurrentEmployeeStatus);
                setLocal('JobStepsPickList', result.OffLineDataSet.Table5[0].JobStepsPickList);
                if (result.OffLineDataSet.Table6.length != 0) {
                    var source = JSON.stringify(result.OffLineDataSet.Table6);
                    setLocal('Source', source);
                }
                if (result.OffLineDataSet.Table8.length != 0) {
                    var orderType = JSON.stringify(result.OffLineDataSet.Table8);
                    setLocal('OrderType', orderType);
                }
                setLocal('CompleteTime', result.OffLineDataSet.Table5[0].CompleteTime);
                setLocal('DateEnteredValidDays', result.OffLineDataSet.Table5[0].DateEnteredValidDays);
                setLocal('iMFM_NoOfDaysToExpireSSO', result.OffLineDataSet.Table5[0].iMFM_NoOfDaysToExpireSSO);
                setLocal('AdditionalCommentsTextBox', result.OffLineDataSet.Table5[0].AdditionalCommentsTextBox);
                setLocal('iMFM_FetchNTEConfig', result.OffLineDataSet.Table5[0].iMFM_FetchNTEConfig);

                // Ravi - Adding 3 new company defaults - Backward compatible. SIC-91, SIC-2631
                if (result.OffLineDataSet.Table5[0].iMFM_AttachmentsOnFieldPO != undefined) {
                    setLocal("iMFM_AttachmentsOnFieldPO", result.OffLineDataSet.Table5[0].iMFM_AttachmentsOnFieldPO);
                } else {
                    setLocal("iMFM_AttachmentsOnFieldPO", 0);
                }

                if (result.OffLineDataSet.Table5[0].Approval_ShowApprovalReason != undefined && result.OffLineDataSet.Table5[0].Approval_ShowRejectionReason != undefined) {
                    setLocal("Approval_ShowApprovalReason", result.OffLineDataSet.Table5[0].Approval_ShowApprovalReason);
                    setLocal("Approval_ShowRejectionReason", result.OffLineDataSet.Table5[0].Approval_ShowRejectionReason);
                } else {
                    setLocal("Approval_ShowApprovalReason", 0);
                    setLocal("Approval_ShowRejectionReason", 1);
                }

                allCallsComplete++;
                CloseSyncPopup(allCallsComplete);
            }
            catch (ex) {
            }
        });
    });
}

function syncErrorMethod(ErrorID) {
    switch (ErrorID) {
        case "PropertyData":
            $('#propertySyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#propertySyncStaus').css("color", "Red");
            $('#propertyList').removeClass('ui-disabled');
            break;
        case "FloorData":
            $('#floorSyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#floorSyncStaus').css("color", "Red");
            $('#floorList').removeClass('ui-disabled');
            break;
        case "RoomData":
            $('#roomSyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#roomSyncStaus').css("color", "Red");
            $('#roomList').removeClass('ui-disabled');
            break;
        case "AssignmentData":
            $('#assignmentSyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#assignmentSyncStaus').css("color", "Red");
            $('#assignmentList').removeClass('ui-disabled');
            break;
        case "SecurityData":
            $('#securitySyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#securitySyncStaus').css("color", "Red");
            $('#securityList').removeClass('ui-disabled');
            break;
        case "WorkorderData":
            $('#workOrderSyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#workOrderSyncStaus').css("color", "Red");
            $('#workOrderList').removeClass('ui-disabled');
            break;
        case "AdditionalOfflineData":
            $('#offlineSyncStaus').text(GetTranslatedValue("syncFailed"));
            $('#offlineSyncStaus').css("color", "Red");
            $('#offlineList').removeClass('ui-disabled');
            break;
    }
}

function CheckDisable(listID) {
    switch (listID) {
        case "propertyList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "floorList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "roomList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "assignmentList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "securityList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "workOrderList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
        case "offlineList":
            if (!$("#" + listID).hasClass("ui-disabled")) {
                $("#" + listID).addClass("ui-disabled")
            }
            break;
    }
}
