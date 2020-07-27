/// <reference path="_references.js" />

////==============Local Storage================////

function setLocal(key, value) {
	try {
		localStorage.setItem(key, value);
	}
	catch (e) {
		log(e);
	}
}


function getLocal(key) {
	try {
		return localStorage.getItem(key);
	}
	catch (e) {
		log(e);
	}
}

//=============This function will opens the DataBase if it already exits in the cache, else it will create DataBase=============//
var dB = null;
function openDB() {
	if (dB === null) {
		dB = openDatabase('iMFMDB', '1.0', 'iMFM DataBase', 5 * 1024 * 1024, function () { log("Success DB"); });
	}
}
var count = 0;
function executeQuery(query, success, error) {
	openDB();
	dB.transaction(function (ts) {
		ts.executeSql(query, [], success, error);
	});
}

function executeArrayQuery(queries, success, error) {
	var arrayQueryComplete = $.Deferred();
	openDB();
	dB.transaction(function (ts) {
		for (var i = 0; i < queries.length; i++) {
			ts.executeSql(queries[i], [], success, error);
		}
	    
        arrayQueryComplete.resolve();
	});
	return arrayQueryComplete.promise();
}

function executeInsertQuery(query, array) {
	openDB();
	dB.transaction(function (ts) {
		log(count++);
		ts.executeSql(query, array, success, error);
	});
}

function CreateTables() {

	var createTransComplete = $.Deferred();
	var createWorkOrderDeatilsTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderDetailsTable'+
 '(WorkOrderNumber nvarchar(50),'+
 'OrderType nvarchar(50) ,'+
 'ACMTag nvarchar(50) ,'+
 'Assignment_Name nvarchar(50) ,'+
 'EmployeeNumber int ,'+
 'Requestor nvarchar(50) ,'+
 'EnteredDate nvarchar(50),'+
 'DateModified nvarchar(50),'+
 'SortingDateEntered nvarchar(50),'+
    'ETADate int,' + 
 'ETA nvarchar(50),'+
 'Status nvarchar(12),'+
 'StatusDesc nvarchar(50),'+
 'Priority nvarchar(12),'+
 'PriorityDesc nvarchar(50),' +
 'ProblemCodeNumber int,' +
 'ProblemCode nvarchar(50),'+
 'ProblemDesc nvarchar(50),'+
 'TechNotes nvarchar(50),'+
 'OrderKey int,'+
 'SiteTZ nvarchar(10),'+
 'BidAmount nvarchar(10),'+
 'ServiceContract nvarchar(10),'+
 'CurrencyCode nvarchar(10),' +
 'ExtAccountNumber nvarchar(30),' + 
 'CompletionTarget nvarchar(50),' +
 'ResponseTarget nvarchar(50),' +
 'DiffDate int,' +
 'WOLaborHour nvarchar(50),' +
 'ProjectFixedCost nvarchar(10),' +
 'PreStartPending bit,' +
 'FlashText nvarchar(1000),'+
 'PRIMARY KEY(WorkOrderNumber,OrderKey))';

	var createWorkOrderContactsTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderContactsTable'+
 '(WorkOrderNumber nvarchar(60) PRIMARY KEY,'+
 'Location1 nvarchar(50),'+
 'Location2 nvarchar(50),'+
 'Location3 nvarchar(50),'+
 'L2TCCProjectNumber nvarchar(50),'+
 'LocationPhone nvarchar(50),'+
 'Assignment nvarchar(50),'+
 'AssignmentPhone nvarchar(50),'+
 'Contact	nvarchar(50),'+
 'ContactPhone nvarchar(50),'+
 'Reference nvarchar(50),'+
 'ReferencePhone nvarchar(50),'+
 'RFM	nvarchar(50),'+
 'FM	nvarchar(50))';

	var createWorkOrderEquipmentTagTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderEquipmentTagTable'+
 '(WorkOrderNumber nvarchar(60) PRIMARY KEY,'+
 'TagNumber 	int,'+
 'EquipGroup	nvarchar(50),'+
 'EquipSubGroup nvarchar(50),'+
 'Part	nvarchar(50),'+
 'PartDesc	nvarchar(50),'+
 'Model	nvarchar(50),'+
 'InstalledDate	nvarchar(30),'+
 'InstalledDesc 	nvarchar(50),'+
 'Serial	nvarchar(50),' +
 'TagDetails nvarchar(4000),' +
 'TagNotes	nvarchar(50),'+
 'PartWarrantyDate 	nvarchar(30),'+
 'LaborWarrantyDate 	nvarchar(30))';

	var createWorkOrderAttachmentsTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderAttachmentsTable'+
 '(WorkOrderNumber nvarchar(60),'+
 'FileSeq INT,'+
 'FileName nvarchar(50),'+
 'Date nvarchar(30),'+
 'Row int,'+
 'Desc nvarchar(50),'+
 'Comment	nvarchar(50),'+
 'TotalRecords	INT)';

	var createWorkOrderLogTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderLogTable'+
 '(WorkOrderNumber nvarchar(60),'+
 'Status nvarchar(12),'+
 'Date nvarchar(30),'+
 'Row int,'+
 'TransType nvarchar(50),'+
 'Comment	nvarchar(50),'+
 'TotalRecords int,'+
 'PRIMARY KEY(WorkOrderNumber,Row))';

	var createWorkOrderLaborTableQuery = 'CREATE TABLE IF NOT EXISTS WorkOrderLaborTable'+
 '(WorkOrderNumber nvarchar(60),'+
 'LaborHourNumber nvarchar(60),'+
 'EmployeeNameLNF nvarchar(60),'+
 'RegularHours REAL,'+
 'RegularDriveHours REAL,'+
 'OverTimeHours REAL,'+
 'OverTimeDriveHours REAL,'+
 'PremiumHours REAL,'+
 'PremiumDriveHours REAL,'+
 'SpecialHours REAL,'+
 'SpecialDriveHours REAL,' +
 'ArrivalDate nvarchar(42),' +
 'DepartureDate nvarchar(42),' +
 'Miles REAL,' +
 'PRIMARY KEY (LaborHourNumber))';

	var createAssignmentTableQuery = 'CREATE TABLE IF NOT EXISTS AssignmentTable (AssignmentTypeID nvarchar(50),AssignmentID nvarchar(50) PRIMARY KEY, AssignmentText nvarchar(50))';

	var createPropertyTableQuery = 'CREATE TABLE IF NOT EXISTS PropertyTable (PropertyID INTEGER,TCC_Project_Number nvarchar(250),AltKey nvarchar(50),PropertyText  nvarchar(50),RegionID INTEGER,RegionText nvarchar(50),CurrencyCode nvarchar(3), PRIMARY KEY(PropertyID,RegionID))';

	var createFloorTableQuery = 'CREATE TABLE IF NOT EXISTS FloorTable'+
 '(PropertyID INTEGER NOT NULL,'+
 'RegionID INTEGER NOT NULL,'+
 'FloorID	INTEGER NOT NULL,'+
 'FloorText	nvarchar(50),'+
 'PRIMARY KEY(PropertyID,RegionID,FloorID),'+
 'FOREIGN KEY(PropertyID) REFERENCES PropertyTable(PropertyID))';

	var createRoomTableQuery = 'CREATE TABLE IF NOT EXISTS RoomTable (PropertyID INTEGER NOT NULL, RegionID INTEGER NOT NULL,FloorID INTEGER NOT NULL, RoomID INTEGER nvarchar(50), RoomText nvarchar(50), PRIMARY KEY(PropertyID,FloorID,RoomID),FOREIGN KEY(PropertyID) REFERENCES PropertyTable(PropertyID),FOREIGN KEY(FloorID) REFERENCES FloorTable(FloorID))';

	//    var createRoomTableQuery = 'CREATE TABLE IF NOT EXISTS RoomTable'
	//+ '(PropetyID	INTEGER NOT NULL'
	//+ 'FloorID	INTEGER NOT NULL,'
	//+ 'RoomID	varchar(50) PRIMARY KEY,'
	//+ 'RoomText	nvarchar(80),'
	//+ 'PRIMARY KEY (PropetyID,FloorID,RoomID),'
	//+ 'FOREIGN KEY(FloorID) REFERENCES FloorTable(FloorID));'

	var createProblemTableQuery = 'CREATE TABLE IF NOT EXISTS ProblemTable'+
 '(ProblemCodeID	INTEGER,'+
 'ProblemCodeDescription nvarchar(50),'+
 'GroupID	INTEGER,'+
 'GroupDescription	nvarchar(50),'+
 'SubGroupID	INTEGER,'+
 'SubGroupDescription	nvarchar(50),'+
 'EstServiceCost nvarchar(50),'+
 'CurrencyCode nvarchar(10))';

	var createLogTable = 'CREATE TABLE IF NOT EXISTS LogTable' + '(CompletedTableName nvarchar(50),'+
						 'DateTimeTable nvarChar(100),'+
						 'SuccessFlag INTEGER)';

	var createJSONdataTableQuery = 'CREATE TABLE IF NOT EXISTS JSONdataTable (Row INTEGER, WorkOrderNumber nvarchar(60), SequenceNumber INTEGER, urlID INTEGER, jsondata nvarchar(500), Status nvarchar(250))';

	var createActionCommentsTableQuery = 'CREATE TABLE IF NOT EXISTS ActionCommentsTable (actionName nvarchar(30),Comments nvarchar(50))';

	var equipmentListTableQuery = 'CREATE TABLE IF NOT EXISTS EquipmentTagTable (WorkOrderNumber nvarchar(60), InstalledDescription nvarchar(250), TagNumber INTEGER, PartNumber nvarchar(250))';

	var createServiceContractTableQuery = 'CREATE TABLE IF NOT EXISTS ServiceContractTable (Description nvarchar(50),ServiceContractID nvarchar(50) PRIMARY KEY, VendorNumber nvarchar(50))';

	var createErrorLogTable = 'CREATE TABLE IF NOT EXISTS ErrorLogTable (Error nvarChar(2000), CurrentDateTime nvarchar(30), EmployeeNumber INTEGER)';

	//// create query for Exception table
	var createExceptionTable = 'CREATE TABLE IF NOT EXISTS ExceptionLogTable (ErrorMessage nvarChar(2000), CurrentDateTime nvarchar(30))';
	//// create query for Exception table

	//// create Request Log table
	var RequestLogTable = 'CREATE TABLE IF NOT EXISTS RequestLogTable (FuncName nvarChar(50), JsonData nvarChar(2000), CurrentDateTime nvarchar(30))';
	//// create Request Log table

	var createWorkOrderStepTableQuery = 'CREATE TABLE IF NOT EXISTS WOStepTable'
	+ '(WorkOrderNumber NVARCHAR(50),'
	+ 'StepID INTEGER,'
	+ 'MasterID INTEGER,'
	+ 'Label NVARCHAR(100),'
	+ 'Prompt NVARCHAR(150),'
	+ 'Units NVARCHAR(100),'
	+ 'DataType NVARCHAR(100),'
	+ 'DataValueStr NVARCHAR(2000),'
	+ 'DataValueInt INTEGER,'
	+ 'DataValueBit BIT,'
	+ 'DataValueDate DATETIME,'
	+ 'DataValueDecimal NUMERIC(15,2),'
	+ 'MinVal NUMERIC(8,2),'
	+ 'MaxVal NUMERIC(8,2),'
	+ 'DefaultValue NVARCHAR(2000),'
	+ 'Status NVARCHAR(50),'
	+ 'LastValue NVARCHAR(2000),'
	+ 'TotalRecords INTEGER,'
	+ 'Row INTEGER,'
	+ 'PRIMARY KEY (WorkOrderNumber, StepID))';

	var createWOMaterialTableQuery = 'CREATE TABLE IF NOT EXISTS WOMaterialTable' +
	'(WorkOrderNumber NVARCHAR(50) PRIMARY KEY,' +
	'GrandTotal  NVARCHAR(10),' +
	'CurrencyCode nvarchar(10),' +
	'ParentRelationship  NVARCHAR(50),' +
	'ParentWorkorder  NVARCHAR(50),' +
	'ConversionRate nvarchar(10),' +
	'ParentCurrency nvarchar(10),' +
	'ParentConversionRate nvarchar(10))';

	var createResolutionCodeTableQuery = 'CREATE TABLE IF NOT EXISTS ResolutionCodeTable' +
	'(ResolutionCodeNumber	INTEGER,' +
	 'DefaultText nvarchar(50),' +
	 'RCDescription	nvarchar(50),' +
	 'RCGroupID	INTEGER,' +
	 'RCGroupDescription nvarchar(50),' +
	 'RCSubGroupId INTEGER,' +
     'RCSubGroupDescription	nvarchar(50),' +
	
     'RCSubGroupSeq INTEGER)';


    var createNotificationTableQuery = 'CREATE TABLE IF NOT EXISTS NotificationTable' +
    '(NoteID INTEGER PRIMARY KEY,' +
    'Title NVARCHAR(250),' +
    'Message NVARCHAR(250),' +
    'AdditionalData NVARCHAR(5000))';

    var featureListTableuery = 'CREATE TABLE IF NOT EXISTS FeatureListTable' +
    '(Feature NVARCHAR(20), Enabled NVARCHAR(10))';
    
//    debugger;
    var queries = [];
    queries.push(featureListTableuery);
	queries.push(createJSONdataTableQuery);
	queries.push(createWorkOrderDeatilsTableQuery);
	queries.push(createWorkOrderContactsTableQuery);
	queries.push(createWorkOrderEquipmentTagTableQuery);
	queries.push(createWorkOrderAttachmentsTableQuery);
	queries.push(createWorkOrderLogTableQuery);
	queries.push(createAssignmentTableQuery);
	queries.push(createPropertyTableQuery);
	queries.push(createFloorTableQuery);
	queries.push(createRoomTableQuery);
	queries.push(createProblemTableQuery);
	queries.push(createActionCommentsTableQuery);
	queries.push(equipmentListTableQuery);
	queries.push(createWorkOrderLaborTableQuery);
	queries.push(createWorkOrderStepTableQuery);
	queries.push(createServiceContractTableQuery);
	//create WOMaterialTable
	queries.push(createWOMaterialTableQuery);
	queries.push(createLogTable);
	//create exception table
	queries.push(createErrorLogTable);
	queries.push(createExceptionTable);
	//create Resolution Code table  
	queries.push(createResolutionCodeTableQuery); 
    	queries.push(createNotificationTableQuery); //err
	//create Request Log table
	queries.push(RequestLogTable);
	//create Request Log table	

	$.when(executeArrayQuery(queries, CreateTableSuccess, CreateTableError)).done( function() {
	    createTransComplete.resolve();
	});
	return createTransComplete.promise();
	
	
}

function CreateInsertQuery(tableName, columnName, values) {
	var insertQuery = 'INSERT INTO ' + tableName + ' (' + columnName + ') VALUES (' + values + ')';
	return insertQuery;
}


function CreateTableSuccess(event, result) {
   // console.log("result " + result);
}

function InsertError(ts, error) {
	// log("InsertError");
}


function InsertSuccess(ts, result) {
}

function CreateTableError(event, result) {
   //console.log("CreateTableError");
}
