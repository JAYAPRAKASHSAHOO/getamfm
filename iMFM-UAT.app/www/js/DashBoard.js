function log(msg) {
}

function FillLocalDB(result) {
    try {
        if (result === null) {
            closesynchronizing();
            return;
        }
        var PastDueWorkOrderOfflineData = result.PastDueWorkOrderOfflineData;
        var DemandOrderWorkOrderOfflineData = result.DemandOrderWorkOrderOfflineData;
        var PMOrderWorkOrderOfflineData = result.PMOrderWorkOrderOfflineData;
        openDB();
        var d = new Date();

        dB.transaction(function (ts) {
            try {
                FillAssignmentTable(ts, result.AssignmentTable);
                FillProperyTable(ts, result.PropertyTable);
                FillProblemTable(ts, result.ProblemTable);
                FillCommentsTabel(ts, result.CommentDDL);
                FillDetailsTable(ts, PastDueWorkOrderOfflineData, 1);
                FillDetailsTable(ts, DemandOrderWorkOrderOfflineData, 2);
                FillDetailsTable(ts, PMOrderWorkOrderOfflineData, 3);
                FillServiceContractTable(ts, result.ServiceContractCollection);
                setLocal('actionTok', JSON.stringify(result.ActionToken));
                setLocal('SgtCollection', JSON.stringify(result.SgtCollection));
                setLocal('CurrencyCollection', JSON.stringify(result.CurrencyCollection));
                setLocal('SiteLabels', result.SiteLabels);
                setLocal('MSIClientCode', result.MSIClientCode);
                setLocal('FilterSCValue', result.FilterSCValue);
                setLocal('CompanyCoveredIsBillable', result.CompanyCoveredIsBillable);
                setLocal('OrderListingGroupBy', result.OrderListingGroupBy);
                setLocal('SearchResultThreshold', result.SearchResultThreshold);
            }
            catch (e) {
                ///Call the functionn to log Exception///////
                fillExceptionTable(e.stack);
                ///Call the functionn to log Exception///////
                closesynchronizing();
            }
        });
    }
    catch (e) {
        ///Call the functionn to log Exception///////
        fillExceptionTable(e.stack);
        ///Call the functionn to log Exception///////
        closesynchronizing();
    }
}

function setLocation() {
    var pageID = $.mobile.activePage.attr('id');
    $("#" + pageID).find("#SFloorValue").selectmenu("disable");
    $("#" + pageID).find("#SRoomValue").selectmenu("disable");
    var propertyID = getLocal('LocID');
    var regionID = getLocal('RegionID');

    if (propertyID && propertyID.length !== 0) {
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT RegionID, RegionText, PropertyID, PropertyText, CurrencyCode  FROM PropertyTable WHERE propertyID = ? and regionID = ? COLLATE NOCASE", [propertyID, regionID], BindStcityLocal, function (e, m, s) { log(e.status); });
        });
    }
}

function SetLocLocal() {
    var pageID = $.mobile.activePage.attr('id');
    var locID = $.trim($("#" + pageID).find("#SBuildingValue").attr('data-value'));
    var regionID = $.trim($("#" + pageID).find('#SStCityValue').attr("data-value"));
    setLocal('LocID', locID);
    setLocal('RegionID', regionID);
    if (locID.length !== 0) {
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql("SELECT TCC_Project_Number,PropertyText,RegionText  FROM PropertyTable WHERE PropertyID = ? and Regionid = ?", [locID, regionID], function (ts, results) {
                setLocal('LocName', results.rows.item(0).TCC_Project_Number);
                setLocal('LocationNameFull', "@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                $("#DashBoard").find("#LocationLabel").html("@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                $("#" + pageID).find("#setLocLocal").hide();
            },
                        function (e, m, s) { log(e.status); });
        });
    }
}

function setLoc(data) {
    if (data == 1) {
        var pageID = $.mobile.activePage.attr('id');
        var locID = $.trim($("#" + pageID).find("#SBuildingValue").attr('data-value'));
        var regionID = $.trim($("#" + pageID).find('#SStCityValue').attr("data-value"));
        setLocal('LocID', locID);
        setLocal('RegionID', regionID);
        if (locID !== '') {
            openDB();
            dB.transaction(function (tx) {
                tx.executeSql("SELECT TCC_Project_Number,PropertyText,RegionText  FROM PropertyTable WHERE PropertyID = ? and regionID = ?", [locID, regionID], function (ts, results) {
                    setLocal('LocName', results.rows.item(0).TCC_Project_Number);
                    setLocal('LocationNameFull', "@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                    $("#Home").find("#LocationLabel").html("@" + results.rows.item(0).RegionText + '/' + results.rows.item(0).PropertyText);
                    $("#" + pageID).find("#setLocLocal").hide();
                },
                        function (e, m, s) { log(e.status); });
            });
        }
    }
    else {
        //Error in setting the page.
    }
}

////////////////////////////////////////////////////////// DashBoard HTML ////////////////////////////////////
function DashBoard_SyncTranslationComplete() {
    //Sync the translations for CommonString all over the application.
    LoadTranslation("Common", null);
    LoadTranslation("DashBoard", null);
}

function ExecuteDropQuery(ts, query) {
    ts.executeSql(query, [], function () { }, function (e, m, s) { log(e.status); });
}

function DropandExecute() {
    var transactionCompleted = $.Deferred();
    var queryArray = new Array();
    queryArray.push('DROP TABLE IF EXISTS WorkOrderDetailsTable');
    queryArray.push('DROP TABLE IF EXISTS WorkOrderContactsTable');
    queryArray.push('DROP TABLE IF EXISTS WorkOrderEquipmentTagTable');
    queryArray.push('DROP TABLE IF EXISTS WorkOrderAttachmentsTable');
    queryArray.push('DROP TABLE IF EXISTS WorkOrderLogTable');
    queryArray.push('DROP TABLE IF EXISTS AssignmentTable');
    queryArray.push('DROP TABLE IF EXISTS PropertyTable');
    queryArray.push('DROP TABLE IF EXISTS FloorTable');
    queryArray.push('DROP TABLE IF EXISTS RoomTable');
    queryArray.push('DROP TABLE IF EXISTS ProblemTable');
    queryArray.push('DROP TABLE IF EXISTS WorkOrderLaborTable');
    queryArray.push('DROP TABLE IF EXISTS EquipmentTagTable');
    queryArray.push('DROP TABLE IF EXISTS ActionCommentsTable');
    queryArray.push('DROP TABLE IF EXISTS JSONdataTable');
    queryArray.push('DROP TABLE IF EXISTS RequestLogTable');
    queryArray.push('DROP TABLE IF EXISTS ResolutionCodeTable');
    //queryArray.push('DROP TABLE IF EXISTS NotificationTable');
    queryArray.push('DROP TABLE IF EXISTS FeatureListTable');
    openDB();

    dB.transaction(function (ts) {
        var i = 0;
        for (i = 0; i <= queryArray.length; i++) {
            if (i == queryArray.length) {
                $.when(CreateTables()).done(function () {
                    transactionCompleted.resolve();
                });
            } else {
                ExecuteDropQuery(ts, queryArray[i]);
            }
        }
    });
    return transactionCompleted.promise();
}

////function drawChart(a, b, c) {
////    if (a == 0 && b == 0 && c == 0) {
////        $('#container').html("Records Not Found.");
////    }
////    else {
////        $('#container').css("min-width", "310px");
////        $('#container').css("height", "350px");
////        $('#container').css("margin", "0 auto");

////        $('#container').highcharts({
////            chart: {
////                type: 'column'
////            },
////            title: {
////                text: ''
////            },
////            xAxis: {
////                categories: ['Past Due Orders', 'Demand Orders', 'PM Orders']
////            },
////            yAxis: {
////                min: 0,
////                title: {
////                    text: ''
////                }
////            },
////            legend: {
////                backgroundColor: '#FFFFFF',
////                reversed: true,
////                enabled: false
////            },
////            plotOptions: {
////                series: {
////                    stacking: 'normal'
////                }
////            },
////            series: [{
////                data: [a, b, c]
////            }]
////        });
////    }
////}

function drawChart(a, b, c) {
    if (a == 0 && b == 0 && c == 0) {
        $('#container').html(GetCommonTranslatedValue("NoRecordFound"));
    }
    else {
        $('#container').css("min-width", "310px");
        $('#container').css("height", "250px");
        $('#container').css("margin", "0 auto");
        var aLabel = GetTranslatedValue('dashBoardpastDueOrderLabel');
        var bLabel = GetTranslatedValue('dashBoardDemandOrderLabel');
        var cLabel = GetTranslatedValue('dashBoardPMOrderLabel');

        // A Bar chart from a single series will have all the bar colors the same.
        var line1 = [[aLabel, a], [bLabel, b], [cLabel, c]];

        plotTest = $('#container').jqplot([line1], {
            // Provide a custom seriesColors array to override the default colors.
            seriesColors: ['#2f7ed8', '#2f7ed8', '#2f7ed8'],
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                rendererOptions: {
                    // Set varyBarColor to tru to use the custom colors on the bars.
                    varyBarColor: true,
                    barWidth: 50
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer
                }
            }
        });
    }
}

function dashBoardNavigation(obj) {
    var navFromDashBoard = obj.id.replace("dashBoard", "");
    NavigateToWorkOrderPage(navFromDashBoard, true);
}

function logTableDataCompletion(tablename) {
    var values = [];
    values.push(tablename);
    values.push(new Date());
    values.push("Success");
    var logInsertQuery = 'INSERT OR REPLACE INTO LogTable (CompletedTableName,DateTimeTable,SuccessFlag) VALUES(?,?,?)';
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(insertQuery, values, function () { }, function (ts, error) { console.log(data.WorkOrderNumber + " " + error.message); });
    });
}

function GetOfflineData() {
    setTimeout(function () {
        syncAdditionalOfflineData();
        syncPropertyData();
        syncFloorData();
        syncRoomData();
        syncAssignmentData();
        syncSecurityData();
        syncWorkorderData();
    }, 1500);
}

function CloseSyncPopup(localDBCallCompleted) {
    if (localDBCallCompleted == 7) {
        ////        getBarChartData();
        closesynchronizing();
        allCallsComplete = 0;
        // For the SyncData
        var lastSync = new Date();
        var dd = lastSync.getDate();
        var mm = lastSync.getMonth() + 1;
        var yyyy = lastSync.getFullYear();
        var completeDate = mm + "/" + dd + "/" + yyyy;
        setLocal("LastSyncDate", completeDate);
        setLocal("IsSyncSuccessfull", 1);
        isAlreadySynced = getLocal("IsSyncSuccessfull");
        if ($('#DashBoard').length == 1) {
            $('#DashBoard').remove();
        }
        $.mobile.changePage("Dashboard.html");
    }
}

function FillProperyTable(ts, data) {
    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillProperyTable');

    setLocal("NumOFProperty", 0);
    setLocal("NumOFPropertyTotal", data.length);
    var Propertycolumn = [];
    Propertycolumn.push('PropertyID');
    Propertycolumn.push('TCC_Project_Number');
    Propertycolumn.push('AltKey');
    Propertycolumn.push('PropertyText');
    Propertycolumn.push('RegionID');
    Propertycolumn.push('RegionText');
    Propertycolumn.push('CurrencyCode');
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var PropertyValue = [];
        PropertyValue.push(item.PropertyID);
        PropertyValue.push(item.TCC_Project_Number);
        PropertyValue.push(item.AltKey);
        PropertyValue.push(item.PropertyText);
        PropertyValue.push(item.RegionNumber);
        PropertyValue.push(item.RegionText);
        PropertyValue.push(item.CurrencyCode);

        var propertyInsertQuery = '';

        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            propertyInsertQuery = 'INSERT OR REPLACE INTO PropertyTable (' + Propertycolumn + ') VALUES (?,?,?,?,?,?,?)';
            ts.executeSql(propertyInsertQuery, PropertyValue, function () { }, function (ts, error) { log(item.PropertyID + ":" + error.message); });
        }
        else {
            var deletePropertyQuery = 'Delete from PropertyTable Where PropertyID = ' + item.PropertyID + ' and RegionID = ' + item.RegionNumber;
            ts.executeSql(deletePropertyQuery, [], function () { }, function (ts, error) { log(item.PropertyID + ":" + error.message); });

            // Insert the updated record. 
            propertyInsertQuery = 'INSERT OR REPLACE INTO PropertyTable (' + Propertycolumn + ') VALUES (?,?,?,?,?,?,?)';
            ts.executeSql(propertyInsertQuery, PropertyValue, function () { }, function (ts, error) { log(item.PropertyID + ":" + error.message); });
        }

    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Complete FillProperyTable');
}

function FillFloorTable(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillFloorTable');

    var FloorColumn = [];
    FloorColumn.push('PropertyID');
    FloorColumn.push('RegionID');
    FloorColumn.push('FloorID');
    FloorColumn.push('FloorText');
    for (var i = 0; i < data.length; i++) {
        var floor = data[i];
        var FloorValue = [];
        FloorValue.push(floor.PropertyId);
        FloorValue.push(floor.RegionID);
        FloorValue.push(encryptStr(floor.FloorValue));
        FloorValue.push(encryptStr(floor.FloorText));
        // var floorInsertQuery = 'INSERT OR REPLACE INTO FloorTable(' + FloorColumn + ') VALUES (?,?,?,?)';
        // ts.executeSql(floorInsertQuery, FloorValue, function () { }, function () { });

        var floorInsertQuery = '';
        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            floorInsertQuery = 'INSERT OR REPLACE INTO FloorTable(' + FloorColumn + ') VALUES (?,?,?,?)';
            ts.executeSql(floorInsertQuery, FloorValue, function () { }, function () { });
        }
        else {
            var deleteFloorQuery = 'Delete from FloorTable Where PropertyID = ' + floor.PropertyId + ' and RegionID = ' + floor.RegionID + ' and FloorID = ' + floor.FloorValue;
            ts.executeSql(deleteFloorQuery, [], function () { }, function (ts, error) { log(item.FloorValue + ":" + error.message); });

            // Insert the updated record. 
            floorInsertQuery = 'INSERT OR REPLACE INTO FloorTable(' + FloorColumn + ') VALUES (?,?,?,?)';
            ts.executeSql(floorInsertQuery, FloorValue, function () { }, function () { });
        }

    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillFloorTable');
}

function FillRoomTable(ts, data, floorID, propertyID, RegionID) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillRoomTable');

    var RoomColumn = [];
    RoomColumn.push('PropertyID');
    RoomColumn.push('RegionID');
    RoomColumn.push('FloorID');
    RoomColumn.push('RoomID');
    RoomColumn.push('RoomText');
    for (var k = 0; k < data.length; k++) {
        var room = data[k];
        var RoomValue = [];
        RoomValue.push(room.PropertyId);
        RoomValue.push(room.RegionID);
        RoomValue.push(room.floorID);
        RoomValue.push(encryptStr(room.RoomValue));
        RoomValue.push(encryptStr(room.RoomText));

        //        var roomInsertQuery = 'INSERT OR REPLACE INTO RoomTable(' + RoomColumn + ') VALUES (?,?,?,?,?)';
        //        ts.executeSql(roomInsertQuery, RoomValue, function () { }, function () { });

        var roomInsertQuery = '';

        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            roomInsertQuery = 'INSERT OR REPLACE INTO RoomTable(' + RoomColumn + ') VALUES (?,?,?,?,?)';
            ts.executeSql(roomInsertQuery, RoomValue, function () { }, function () { });
        }
        else {
            var deleteRoomQuery = 'Delete from RoomTable Where PropertyID = ' + room.PropertyId + ' and RegionID = ' + room.RegionID + ' and FloorID = ' + room.floorID + ' and RoomID = ' + "'" + room.RoomValue + "'";
            ts.executeSql(deleteRoomQuery, [], function () { }, function (ts, error) { log(item.FloorValue + ":" + error.message); });

            // Insert the updated record. 
            roomInsertQuery = 'INSERT OR REPLACE INTO RoomTable(' + RoomColumn + ') VALUES (?,?,?,?,?)';
            ts.executeSql(roomInsertQuery, RoomValue, function () { }, function () { });
        }
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillRoomTable');
}

function FillAssignmentTable(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillAssignmentTable');

    var columnName = [];
    columnName.push('AssignmentTypeID'); // FK to identify Employee, Vendor, Manager
    columnName.push('AssignmentID');
    columnName.push('AssignmentText');

    for (var i = 0; i < data.length; i++) {
        item = data[i];
        var values = [];
        values.push(item.AssignmentTypeID);
        values.push(item.AssignmentID);
        values.push(item.AssignmentText);
        var insertQuery = 'INSERT OR REPLACE INTO AssignmentTable(' + columnName + ') VALUES (?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, InsertError);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillAssignmentTable');
}

function FillDetailsTable(ts, workorders, OrderKey) {
    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillDetailsTable');

    var DemandworkOrderData = workorders.Table;
    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('OrderType');
    columnName.push('ACMTag');
    columnName.push('Assignment_Name');
    columnName.push('EmployeeNumber');
    columnName.push('Requestor');
    columnName.push('EnteredDate');
    columnName.push('DateModified');
    columnName.push('SortingDateEntered');
    columnName.push('ETADate');
    columnName.push('ETA');
    columnName.push('Status');
    columnName.push('StatusDesc');
    columnName.push('Priority');
    columnName.push('PriorityDesc');
    columnName.push('ProblemCodeNumber');
    columnName.push('ProblemCode');
    columnName.push('ProblemDesc');
    columnName.push('TechNotes');
    columnName.push('OrderKey');
    columnName.push('SiteTZ');
    columnName.push('BidAmount');
    columnName.push('ServiceContract');
    columnName.push('CurrencyCode');
    columnName.push('ExtAccountNumber');
    columnName.push('CompletionTarget');
    columnName.push('ResponseTarget');
    columnName.push('DiffDate');
    columnName.push('WOLaborHour');
    columnName.push('ProjectFixedCost');

    columnName.push('PreStartPending');
    columnName.push('FlashText');
    for (var i = 0; i < DemandworkOrderData.length; i++) {
        var data = DemandworkOrderData[i];
        var values = [];
        if (data.WOLaborHour != undefined) {
            data.WOLaborHour = (data.WOLaborHour).toFixed(2);
        }

        if (data.ProblemCodeNumber == null) {
            data.ProblemCodeNumber = data.ProblemCode;
        }

        values.push(data.WorkOrderNumber);
        values.push(encryptStr(data.OrderType));
        values.push(encryptStr(data.UserDef2));
        values.push(encryptStr(data.AssignName));
        values.push(encryptStr(data.EmployeeNumber));
        values.push(encryptStr(data.RequestedBy));
        values.push(data.DateEnteredStr);
        values.push(encryptStr(data.DateModified));
        values.push(encryptStr(data.SortingDateEntered));
        values.push(Date.parse(data.DateNextArrivalSite));
        values.push(encryptStr(data.DateNextArrivalSiteStr));
        values.push(data.Status);
        values.push(encryptStr(data.StatusDesc));
        values.push(data.Priority);
        values.push(encryptStr(data.PriorityDesc));
        values.push(data.ProblemCodeNumber);
        values.push(encryptStr(data.ProblemCode));
        values.push(encryptStr(data.ProblemDescription));
        values.push(encryptStr(data.TechNotes));
        values.push(OrderKey);       ////---If key ==>  1 => PastDueOrders, 2 => DemandOrders, 3 => PM Orders. DB column => WorkOrderDeatilsTable(OrderKey)---////
        values.push(encryptStr(data.SiteTZ));
        values.push(encryptStr(data.BidAmount));
        values.push(encryptStr(data.ServiceContract));
        values.push(encryptStr(data.CurrencyCode));
        values.push(encryptStr(data.ExtAccountNumber));
        values.push(encryptStr(data.CompletionTarget));
        values.push(encryptStr(data.ResponseTarget));
        values.push(data.DiffDate);
        values.push(encryptStr(data.WOLaborHour));
        values.push(encryptStr(data.ProjectFixedCost));
        values.push(encryptStr(data.PreStartPending));
        values.push(encryptStr(data.FlashText));
        var insertQuery = 'INSERT OR REPLACE INTO WorkOrderDetailsTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, function (ts, error) { console.log(data.WorkOrderNumber + " " + error.message); });

        FillContactsTable(ts, data);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillDetailsTable');

    if (workorders.Table1.length > 0) {
        FillEquipmentTagTable(ts, workorders.Table1);
    }

    if (workorders.Table2.length > 0) {
        FillAttachmentTable(ts, workorders.Table2);
    }

    if (workorders.Table4.length > 0) {
        FillLogTable(ts, workorders.Table4);
    }
    if (workorders.Table3.length !== 0) {
        FillLaborTable(ts, workorders.Table3);
    }
    if (workorders.Table5.length !== 0) {
        FillStepTable(ts, workorders.Table5);
    }
    if (workorders.Table6.length !== 0) {
        //// fill work order materials table.
        FillMaterialTable(ts, workorders.Table6);
    }
    closeLoading();
}

function FillLaborTable(ts, data) {
    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillLaborTable');

    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('LaborHourNumber');
    columnName.push('EmployeeNameLNF');
    columnName.push('RegularHours');
    columnName.push('RegularDriveHours');
    columnName.push('OverTimeHours');
    columnName.push('OverTimeDriveHours');
    columnName.push('PremiumHours');
    columnName.push('PremiumDriveHours');
    columnName.push('SpecialHours');
    columnName.push('SpecialDriveHours');
    columnName.push('ArrivalDate');
    columnName.push('DepartureDate');
    columnName.push('Miles');

    for (var j = 0; j < data.length; j++) {
        var labor = data[j];
        var values = [];
        values.push(labor.WorkOrderNumber);
        values.push(encryptStr(labor.LaborHourNumber));
        values.push(encryptStr(labor.EmployeeNameLNF));
        values.push(encryptStr(labor.regularhours));
        values.push(encryptStr(labor.regulardrivehours));
        values.push(encryptStr(labor.overtimehours));
        values.push(encryptStr(labor.overtimedrivehours));
        values.push(encryptStr(labor.premiumhours));
        values.push(encryptStr(labor.premiumdrivehours));
        values.push(encryptStr(labor.specialhours));
        values.push(encryptStr(labor.specialdrivehours));
        values.push(encryptStr(labor.ArrivalDate));
        values.push(encryptStr(labor.DepartureDate));
        values.push(encryptStr(labor.miles));

        var insertQuery = 'INSERT OR REPLACE INTO WorkOrderLaborTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () {
            //console.log("Success" + data.WorkOrderNumber);
        }, function () {
            //console.log("Error" + data.WorkOrderNumber);
        });
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillLaborTable');
}

function FillContactsTable(ts, data) {
    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('Location1');
    columnName.push('Location2');
    columnName.push('Location3');
    columnName.push('L2TCCProjectNumber');
    columnName.push('LocationPhone');
    columnName.push('Assignment');
    columnName.push('AssignmentPhone');
    columnName.push('Contact');
    columnName.push('ContactPhone');
    columnName.push('Reference');
    columnName.push('ReferencePhone');
    columnName.push('RFM');
    columnName.push('FM');

    var values = [];
    var building = data.Location;
    building = building.split('/');
    values.push(data.WorkOrderNumber);
    values.push(encryptStr(data.Location));
    values.push(encryptStr(data.L2Address));
    values.push(building[1]);
    values.push(data.L2TCCProjectNumber);
    values.push(encryptStr(data.LocationPhone));
    values.push(encryptStr(data.AssignName));
    values.push(encryptStr(data.AssignPhone));
    values.push(encryptStr(data.SiteContactName));
    values.push(encryptStr(data.SiteContactPhone));
    values.push(encryptStr(data.Reference));
    values.push(encryptStr(data.ReferencePhone));
    values.push(encryptStr(data.SDVEmployee1));
    values.push(encryptStr(data.SDVEmployee2));

    var insertQuery = 'INSERT OR REPLACE INTO WorkOrderContactsTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    ts.executeSql(insertQuery, values, function () { }, function (ts, error) { });
}

function FillAttachmentTable(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillAttachmentTable');

    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('FileSeq');
    columnName.push('FileName');
    columnName.push('Date');
    columnName.push('Row');
    columnName.push('Desc');
    columnName.push('Comment');
    columnName.push('TotalRecords');
    for (var j = 0; j < data.length; j++) {
        var attachment = data[j];
        var values = [];
        values.push(attachment.WorkOrderNumber);
        values.push(encryptStr(attachment.FileSeq));
        values.push(encryptStr(attachment.FileName));
        values.push(encryptStr(attachment.DateOfUpdateStr));
        values.push(encryptStr(attachment.Row));
        values.push(encryptStr(attachment.Description));
        values.push(encryptStr(attachment.Comments));
        values.push(encryptStr(attachment.TotalRecords));
        var insertQuery = 'INSERT OR REPLACE INTO WorkOrderAttachmentsTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, InsertError);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillAttachmentTable');
}

function FillLogTable(ts, data) {
    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillLogTable');

    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('Status');
    columnName.push('Date');
    columnName.push('Row');
    columnName.push('TransType');
    columnName.push('Comment');
    columnName.push('TotalRecords');

    for (var j = 0; j < data.length; j++) {
        var log = data[j];
        ////var date = getDateString(log.DateOfUpdate);
        var values = [];
        values.push(log.WorkOrderNumber);
        values.push(encryptStr(log.Status));
        values.push(encryptStr(log.DateOfUpdateStr));
        values.push(encryptStr(log.Row));
        values.push(encryptStr(log.TransType));
        values.push(encryptStr(log.Comment));
        values.push(encryptStr(log.TotalRecords));
        var insertQuery = 'INSERT OR REPLACE INTO WorkOrderLogTable (' + columnName + ') VALUES (?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, InsertError);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillLogTable');
}

function FillEquipmentTagTable(ts, result) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillEquipmentTagTable');

    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('TagNumber');
    columnName.push('EquipGroup');
    columnName.push('EquipSubGroup');
    columnName.push('Part');
    columnName.push('PartDesc');
    columnName.push('Model');
    columnName.push('InstalledDate');
    columnName.push('InstalledDesc');
    columnName.push('Serial');
    columnName.push('TagDetails');
    columnName.push('TagNotes');
    columnName.push('PartWarrantyDate');
    columnName.push('LaborWarrantyDate');
    var data = null;
    for (var i = 0; i < result.length; i++) {
        data = result[i];
        var values = [];
        values.push(data.WorkOrderNumber);
        values.push(encryptStr(data.TagNumber));
        values.push(encryptStr(data.GroupDescription));
        values.push(encryptStr(data.SubGroupDescription));
        values.push(encryptStr(data.PartNumber));
        values.push(encryptStr(data.PartDescription));
        values.push(encryptStr(data.ManufacturerPartModel));
        values.push(encryptStr(data.DateInstalled));
        values.push(encryptStr(data.InstalledDescription));
        values.push(encryptStr(data.SerialNumber));
        values.push(encryptStr(data.TagDetails));
        values.push(encryptStr(data.Notes));
        values.push(encryptStr(data.DateWarrParts));
        values.push(encryptStr(data.DateWarrService));
        var insertQuery = 'INSERT OR REPLACE INTO WorkOrderEquipmentTagTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, InsertError);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillEquipmentTagTable');
}

function FillEquipmentTagListTable(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillEquipmentTagListTable');

    var columnName = [];
    columnName.push('WorkOrderNumber'); // FK to identify Employee, Vendor, Manager
    columnName.push('InstalledDescription');
    columnName.push('TagNumber');
    columnName.push('PartNumber');
    for (var i = 0; i < data.length; i++) {
        item = data[i];
        var values = [];
        values.push(item.WorkOrderNumber);
        values.push(item.InstalledDescription);
        values.push(item.TagNumber);
        values.push(item.PartNumber);
        var insertQuery = 'INSERT OR REPLACE INTO EquipmentTagTable(' + columnName + ') VALUES (?,?,?,?)';
        ts.executeSql(insertQuery, values, function () { }, InsertError);
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillEquipmentTagListTable');
}

function FillProblemTable(ts, data) {
    ////var ProblemCodeData = data.Table;

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillProblemTable');

    var problemColumn = [];
    problemColumn.push("ProblemCodeID");
    problemColumn.push("ProblemCodeDescription");
    problemColumn.push("GroupID");
    problemColumn.push("GroupDescription");
    problemColumn.push("SubGroupID");
    problemColumn.push("SubGroupDescription");
    problemColumn.push("EstServiceCost");
    problemColumn.push("CurrencyCode");

    for (var j = 0; j < data.length; j++) {
        var problem = data[j];
        var probemValue = [];
        probemValue.push(problem.ProblemCodeNumber);
        probemValue.push(problem.ProblemCodeDescription);
        probemValue.push(problem.GroupNumber);
        probemValue.push(problem.GroupDescription);
        probemValue.push(problem.SubGroupNumber);
        probemValue.push(problem.SubGroupDescription);
        probemValue.push(encryptStr(problem.EstimatedServiceCost));
        probemValue.push(problem.CurrencyCode);
        //var propertyInsertQuery = 'INSERT OR REPLACE INTO ProblemTable (' + problemColumn + ') VALUES (?,?,?,?,?,?,?,?)';
        //ts.executeSql(propertyInsertQuery, probemValue, function () { }, function (ts, error) { log(error.message); });

        var problemInsertQuery = '';

        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            problemInsertQuery = 'INSERT OR REPLACE INTO ProblemTable (' + problemColumn + ') VALUES (?,?,?,?,?,?,?,?)';
            ts.executeSql(problemInsertQuery, probemValue, function () { }, function (ts, error) { log(error.message); });
        }
        else {
            var deleteProblemQuery = 'Delete from ProblemTable Where ProblemCodeID = ' + problem.ProblemCodeNumber + ' and CurrencyCode = ' + problem.CurrencyCode;
            ts.executeSql(deleteProblemQuery, [], function () { }, function (ts, error) { log(problem.ProblemCodeNumber + ":" + error.message); });

            // Insert the updated record. 
            problemInsertQuery = 'INSERT OR REPLACE INTO ProblemTable (' + problemColumn + ') VALUES (?,?,?,?,?,?,?,?)';
            ts.executeSql(problemInsertQuery, probemValue, function () { }, function (ts, error) { log(error.message); });
        }
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillProblemTable');
}

function FillCommentsTabel(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillCommentsTabel');

    var column = [];
    column.push('actionName');
    column.push('Comments');
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var Value = [];
        Value.push(item.ScreenName);
        Value.push(encryptStr(item.Comments));

        //var commentInsertQuery = 'INSERT OR REPLACE INTO ActionCommentsTable (' + column + ') VALUES (?,?)';
        //ts.executeSql(commentInsertQuery, Value, function () { }, function (ts, error) { log(item.ScreenName + ":" + error.message); });

        var commentInsertQuery = '';

        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            commentInsertQuery = 'INSERT OR REPLACE INTO ActionCommentsTable (' + column + ') VALUES (?,?)';
            ts.executeSql(commentInsertQuery, Value, function () { }, function (ts, error) { log(item.ScreenName + ":" + error.message); });
        }
        else {
            var deleteCommentQuery = 'Delete from ActionCommentsTable Where actionName = ' + item.ScreenName + ' and Comments = ' + item.Comments;
            ts.executeSql(deleteCommentQuery, [], function () { }, function (ts, error) { log(item.Comments + ":" + error.message); });

            // Insert the updated record. 
            commentInsertQuery = 'INSERT OR REPLACE INTO ActionCommentsTable (' + column + ') VALUES (?,?)';
            ts.executeSql(commentInsertQuery, Value, function () { }, function (ts, error) { log(item.ScreenName + ":" + error.message); });
        }
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillCommentsTabel');
}

function FillServiceContractTable(ts, data) {

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillServiceContractTable');

    var serviceContractcolumn = [];
    serviceContractcolumn.push('Description');
    serviceContractcolumn.push('ServiceContractID');
    serviceContractcolumn.push('VendorNumber');

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var Value = [];
        Value.push(encryptStr(item.Description));
        Value.push(encryptStr(item.ServiceContractId));
        Value.push(item.VendorNumber);
        ////var serviceContractInsertQuery = 'INSERT OR REPLACE INTO ServiceContractTable (' + serviceContractcolumn + ') VALUES (?,?,?)';
        ////ts.executeSql(serviceContractInsertQuery, Value, function () { }, function (ts, error) { log(item.ServiceContractID + ":" + error.message); });

        var serviceContractInsertQuery = '';
        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            serviceContractInsertQuery = 'INSERT OR REPLACE INTO ServiceContractTable (' + serviceContractcolumn + ') VALUES (?,?,?)';
            ts.executeSql(serviceContractInsertQuery, Value, function () { }, function (ts, error) { log(item.ServiceContractID + ":" + error.message); });
        }
        else {
            var deleteServiceContractQuery = 'Delete from ServiceContractTable Where ServiceContractID = ' + "'" + item.ServiceContractId + "'";
            ts.executeSql(deleteServiceContractQuery, [], function () { }, function (ts, error) { log(item.ServiceContractId + ":" + error.message); });

            // Insert the updated record. 
            serviceContractInsertQuery = 'INSERT OR REPLACE INTO ServiceContractTable (' + serviceContractcolumn + ') VALUES (?,?,?)';
            ts.executeSql(serviceContractInsertQuery, Value, function () { }, function (ts, error) { log(item.ServiceContractID + ":" + error.message); });
        }
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillServiceContractTable');
}

// ********************************************************
// Populate the WOStep table in the offline DB 
// ********************************************************
function FillStepTable(ts, data) {
    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillStepTable');

    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('StepID');
    columnName.push('MasterID');
    columnName.push('Label');
    columnName.push('Prompt');
    columnName.push('Units');
    columnName.push('DataType');
    columnName.push('DataValueStr');
    columnName.push('DataValueInt');
    columnName.push('DataValueBit');
    columnName.push('DataValueDate');
    columnName.push('DataValueDecimal');
    columnName.push('MinVal');
    columnName.push('MaxVal');
    columnName.push('DefaultValue');
    columnName.push('Status');
    columnName.push('LastValue');
    columnName.push('TotalRecords');
    columnName.push('Row');

    for (var j = 0; j < data.length; j++) {
        var step = data[j];
        var values = [];
        values.push(step.WorkOrderNumber);
        values.push(encryptStr(step.StepID));
        values.push(encryptStr(step.MasterID));
        values.push(encryptStr(step.Label));
        values.push(encryptStr(step.Prompt));
        values.push(encryptStr(step.Units));
        values.push(encryptStr(step.DataType));
        values.push(encryptStr(step.DataValueStr));
        values.push(encryptStr(step.DataValueInt));
        values.push(encryptStr(step.DataValueBit));
        values.push(encryptStr(step.DataValueDate));
        values.push(encryptStr(step.DataValueDecimal));
        values.push(encryptStr(step.MinVal));
        values.push(encryptStr(step.MaxVal));
        values.push(encryptStr(step.DefaultValue));
        values.push(encryptStr(step.Status));
        values.push(encryptStr(step.LastValue));
        values.push(encryptStr(step.TotalRecords));
        values.push(encryptStr(step.Row));

        var insertQuery = 'INSERT OR REPLACE INTO WOStepTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () {
            //console.log("Success" + data.WorkOrderNumber);
        }, function () {
            //console.log("Error" + data.WorkOrderNumber);
        });
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillStepTable');
}

///******************************************************
/// Fill wor order materials table
function FillMaterialTable(ts, data) {
    var columnName = [];
    columnName.push('WorkOrderNumber');
    columnName.push('GrandTotal');
    columnName.push('CurrencyCode');
    columnName.push('ParentRelationship');
    columnName.push('ParentWorkorder');
    columnName.push('ConversionRate');
    columnName.push('ParentCurrency');
    columnName.push('ParentConversionRate');

    for (var j = 0; j < data.length; j++) {
        var WOMaterial = data[j];
        var values = [];
        WOMaterial.GrandTotal = (WOMaterial.GrandTotal).toFixed(2);
        values.push(WOMaterial.WorkOrderNumber);
        values.push(encryptStr(WOMaterial.GrandTotal));
        values.push(encryptStr(WOMaterial.CurrencyCode));
        values.push(encryptStr(WOMaterial.ParentRelationship));
        values.push(WOMaterial.ParentWorkorder);
        values.push(encryptStr(WOMaterial.ConversionRate));
        values.push(encryptStr(WOMaterial.ParentCurrency));
        values.push(encryptStr(WOMaterial.ParentConversionRate));

        var insertQuery = 'INSERT OR REPLACE INTO WOMaterialTable (' + columnName + ') VALUES (?,?,?,?,?,?,?,?)';
        ts.executeSql(insertQuery, values, function () {

        }, function (ts, error) {
            ////log(item.ScreenName + ":" + error.message); 
        });
    }
}


function FillResolutionCodeTable(ts, data) {
    ////var ProblemCodeData = data.Table;

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Into FillResolutionCodeTable');

    var resolutionCodeColumn = [];
    resolutionCodeColumn.push("ResolutionCodeNumber");
    resolutionCodeColumn.push("DefaultText");
    resolutionCodeColumn.push("RCDescription");
    resolutionCodeColumn.push("RCGroupID");
    resolutionCodeColumn.push("RCGroupDescription");
    resolutionCodeColumn.push("RCSubGroupId");
    resolutionCodeColumn.push("RCSubGroupDescription");

    resolutionCodeColumn.push("RCSubGroupSeq");
    for (var j = 0; j < data.length; j++) {
        var resolutionCode = data[j];
        var resolutionCodeValue = [];
        resolutionCodeValue.push(resolutionCode.ResolutionCodeNumber);
        resolutionCodeValue.push(encryptStr(resolutionCode.DefaultText));
        resolutionCodeValue.push(encryptStr(resolutionCode.RCDescription));
        resolutionCodeValue.push(resolutionCode.RCGroupID);
        resolutionCodeValue.push(encryptStr(resolutionCode.RCGroupDescription));
        resolutionCodeValue.push(resolutionCode.RCSubGroupId);
        resolutionCodeValue.push(resolutionCode.RCSubGroupDescription);
        resolutionCodeValue.push(resolutionCode.RCSubGroupSeq);
        //var propertyInsertQuery = 'INSERT OR REPLACE INTO ProblemTable (' + problemColumn + ') VALUES (?,?,?,?,?,?,?,?)';
        //ts.executeSql(propertyInsertQuery, probemValue, function () { }, function (ts, error) { log(error.message); });

        var resolutionCodeInsertQuery = '';


        if (isAlreadySynced == 0 || isAlreadySynced == null) {
            resolutionCodeInsertQuery = 'INSERT OR REPLACE INTO ResolutionCodeTable (' + resolutionCodeColumn + ') VALUES (?,?,?,?,?,?,?,?)';
            ts.executeSql(resolutionCodeInsertQuery, resolutionCodeValue, function () { }, function (ts, error) { log(error.message); });
        }
        else {
            var deleteResolutionCodeQuery = 'Delete from ResolutionCodeTable Where ResolutionCodeNumber = ' + resolutionCode.ResolutionCodeNumber;
            ts.executeSql(deleteResolutionCodeQuery, [], function () { }, function (ts, error) { log(resolutionCode.ResolutionCodeNumber + ":" + error.message); });

            // Insert the updated record. 
            resolutionCodeInsertQuery = 'INSERT OR REPLACE INTO ResolutionCodeTable (' + resolutionCodeColumn + ') VALUES (?,?,?,?,?,?,?,?)';
            ts.executeSql(resolutionCodeInsertQuery, resolutionCodeValue, function () { }, function (ts, error) { log(error.message); });
        }
    }

    // Fill the Error Log if isDebugMode = True;
    LogErrors('Completed FillProblemTable');
}

function FillFeatureListTable(ts, data) {
    var columnName = [];
    columnName.push('Feature');
    columnName.push('Enabled');

    for (var j = 0; j < data.length; j++) {
        var supportedFeature = data[j];
        var values = [];
        values.push(supportedFeature.Feature);
        values.push(supportedFeature.Enabled);
        var insertQuery = 'INSERT OR REPLACE INTO FeatureListTable(' + columnName + ') VALUES (?,?)';
        ts.executeSql(insertQuery, values, function () { /* Inserted successfully in FeatureListTable */ }, function (ts, error) { console.log(error); });
    }

    // Fill all the features into a local storage for easy access later.
    FillAllFeatures();

}

function GetFeatureDatails(feature) {
    var dfd = jQuery.Deferred();
    openDB();
    dB.transaction(function (tx) {
        tx.executeSql("SELECT * FROM FeatureListTable WHERE Feature = ? ", [feature],
        function (ts, result) {
            dfd.resolve(FeatureSaveLocal(ts, result, feature))
        },
        function (ts, error) {
            dfd.reject(e.error);
        });
    });
    return dfd.promise();
}

function FeatureSaveLocal(ts, results, feature) {
    if (results && results.rows.length > 0 && results.rows.item(0)) {
        setLocal(feature, results.rows.item(0).Enabled);
    }
    else {
        setLocal(feature, false);
    }
}

function FillAllFeatures() {
    try {
        var featureSelectQuery = "SELECT feature FROM FeatureListTable";
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql(featureSelectQuery, [], function (te, result) {
                var item;
                var listOfFeatures = '';
                for (var i = 0; i < result.rows.length; i++) {
                    listOfFeatures = listOfFeatures + "," + result.rows.item(i).Feature;
                    setLocal("featuresListAll", listOfFeatures);

                }

            },
    function () {

    });
        });
    }
    catch (e) {
    }
}
