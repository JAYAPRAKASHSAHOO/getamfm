function CheckingPendingData() {
    if (navigator.onLine && (getLocal("CancelAutoSync") != "true")) {
        openDB();
        dB.transaction(function (ts) {
            ts.executeSql("SELECT COUNT(*) AS COUNT FROM JSONdataTable", [], function (te, result) {
                if (result.rows.length >= 1) {
                    if (result.rows.item(0).COUNT > 0 && syncInProgress == 1) {
                        ShowAutoSyncPopup();
                    }
                    else {
                    }
                }
                else {
                }
            });
        });
    }
    else {
    }
}

function Synchronize() {
    try {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID + "navigationPanel").panel("close");
        if (navigator.onLine) {
////            GoHome();
            ////            showsynchronizing();
            manualSync = true;
            $.mobile.changePage("InitialSync.html");
            /*var selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 1';
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql(selectJsonTable, [], function (te, result) {
                    try {
                        var jsonData = '';
                        var actionJsonData = [];
                        if (result.rows.length == 1) {
                            var row = result.rows.item(0);
                            var urlid = row.urlID;
                            jsonData = decryptStr(row.jsondata);
                            $.ajaxpostJSON(standardAddress + "CreateWO.ashx?method=SyncOfflineWOCreate", { WOData: jsonData }, function (createresult) {
                                selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 2';
                                openDB();
                                dB.transaction(function (ts) {
                                    ts.executeSql(selectJsonTable, [], function (te, result) {
                                        if (result.rows.length > 0) {
                                            for (var i = 0; i < result.rows.length; i++) {
                                                var row = result.rows.item(i);
                                                actionJsonData.push(JSON.parse(decryptStr(row.jsondata)));
                                            }
                                            if (actionJsonData.length > 0) {
                                                $.ajaxpostJSON(standardAddress + "WorkOrderActions.ashx?methodname=OfflineActions", { jsondata: JSON.stringify(actionJsonData) }, function (result) {
                                                    openDB();
                                                    dB.transaction(function (ts) {
                                                        var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                                        ts.executeSql(query, [], function (tx, result) {
                                                            if (result.rows.length > 0) {
                                                                var CASarrsy = [];
                                                                for (var i = 0; i < result.rows.length; i++) {
                                                                    CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                                                }
                                                                sessionData = {
                                                                    DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                                    Language: localStorage.getItem("Language"),
                                                                    EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                                    SessionID: decryptStr(getLocal("SessionID"))
                                                                };
                                                                $.ajaxpostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                                    openDB();
                                                                    dB.transaction(function (ts) {
                                                                        ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                            UpdateAllLocalTable();
                                                                        });
                                                                    });
                                                                },
                                                                        function (error) {
                                                                        }
                                                                        );
                                                            }
                                                            else {
                                                                openDB();
                                                                dB.transaction(function (ts) {
                                                                    ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                        UpdateAllLocalTable();
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                });
                                            }
                                        }
                                        else {
                                            openDB();
                                            dB.transaction(function (ts) {
                                                ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                    UpdateAllLocalTable();
                                                });
                                            });
                                        }
                                    });
                                });
                            });
                        }
                        else {
                            selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 2';
                            ts.executeSql(selectJsonTable, [], function (te, result) {
                                if (result.rows.length > 0) {
                                    for (var i = 0; i < result.rows.length; i++) {
                                        var row = result.rows.item(i);
                                        actionJsonData.push(JSON.parse(decryptStr(row.jsondata)));
                                    }
                                    if (actionJsonData.length > 0) {
                                        $.ajaxpostJSON(standardAddress + "WorkOrderActions.ashx?methodname=OfflineActions", { jsondata: JSON.stringify(actionJsonData) }, function (result) {
                                            openDB();
                                            dB.transaction(function (ts) {
                                                var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                                ts.executeSql(query, [], function (tx, result) {
                                                    if (result.rows.length > 0) {
                                                        var CASarrsy = [];
                                                        for (var i = 0; i < result.rows.length; i++) {
                                                            CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                                        }
                                                        sessionData = {
                                                            DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                            Language: localStorage.getItem("Language"),
                                                            EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                            GPSLocation: GlobalLat + "," + GlobalLong,
                                                            SessionID: decryptStr(getLocal("SessionID"))
                                                        };
                                                        $.ajaxpostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                            openDB();
                                                            dB.transaction(function (ts) {
                                                                ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                    UpdateAllLocalTable();
                                                                });
                                                            });
                                                        },
                                                                        function (error) {
                                                                        }
                                                                        );
                                                    }
                                                    else {
                                                        openDB();
                                                        dB.transaction(function (ts) {
                                                            ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                UpdateAllLocalTable();
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                                else {
                                    var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                    ts.executeSql(query, [], function (tx, result) {
                                        if (result.rows.length > 0) {
                                            var CASarrsy = [];
                                            for (var i = 0; i < result.rows.length; i++) {
                                                CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                            }
                                            sessionData = {
                                                DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                Language: localStorage.getItem("Language"),
                                                EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                SessionID: decryptStr(getLocal("SessionID"))
                                            };
                                            $.ajaxpostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                openDB();
                                                dB.transaction(function (ts) {
                                                    ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                        UpdateAllLocalTable();
                                                    });
                                                });
                                            },
                                                                        function (error) {
                                                                        }
                                                                        );
                                        }
                                        else {
                                            openDB();
                                            dB.transaction(function (ts) {
                                                ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                    UpdateAllLocalTable();
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    catch (e) {
                        closesynchronizing();
                        log(e);
                    }
                }, function (ts, error) { });
            });
            */
            UpdateAllLocalTable();
        }
        else {
            ////showError("No Network");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            return false;
        }
    }
    catch (e) {
        closesynchronizing();
    }
}

function AutoSynchronize() {
    try {
        var pageID = $.mobile.activePage.attr('id');
        $('div[id=' + pageID + "AutoSyncPopup" + ']').popup();
        $("#" + pageID + "AutoSyncPopup").popup("close");        
        $(".SyncNotification").show();
        if (navigator.onLine) {
            if (getLocal("LogoutCompletly") == "true") {
                setTimeout(showsynchronizing(), 1000);
            }
            autoSyncCompleted = 0;
            syncInProgress = 0;
            var selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 1';
            openDB();
            dB.transaction(function (ts) {
                ts.executeSql(selectJsonTable, [], function (te, result) {
                    try {
                        var jsonData = '';
                        var actionJsonData = [];
                        if (result.rows.length == 1) {
                            var row = result.rows.item(0);
                            var urlid = row.urlID;
                            jsonData = decryptStr(row.jsondata);
                            $.ajaxAutoSyncPostJSON(standardAddress + "CreateWO.ashx?method=SyncOfflineWOCreate", { WOData: jsonData }, function (createresult) {
                                selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 2';
                                openDB();
                                dB.transaction(function (ts) {
                                    ts.executeSql(selectJsonTable, [], function (te, result) {
                                        if (result.rows.length > 0) {
                                            for (var i = 0; i < result.rows.length; i++) {
                                                var row = result.rows.item(i);
                                                actionJsonData.push(JSON.parse(decryptStr(row.jsondata)));
                                            }
                                            if (actionJsonData.length > 0) {
                                                $.ajaxAutoSyncPostJSON(standardAddress + "WorkOrderActions.ashx?methodname=OfflineActions", { jsondata: JSON.stringify(actionJsonData) }, function (result) {
                                                    openDB();
                                                    dB.transaction(function (ts) {
                                                        var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                                        ts.executeSql(query, [], function (tx, result) {
                                                            if (result.rows.length > 0) {
                                                                var CASarrsy = [];
                                                                for (var i = 0; i < result.rows.length; i++) {
                                                                    CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                                                }
                                                                sessionData = {
                                                                    DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                                    Language: localStorage.getItem("Language"),
                                                                    EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                                    SessionID: decryptStr(getLocal("SessionID"))
                                                                };
                                                                $.ajaxAutoSyncPostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                                    openDB();
                                                                    dB.transaction(function (ts) {
                                                                        ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                            autoSyncCompleted = 1;
                                                                            syncInProgress = 1;
                                                                            $(".SyncNotification").hide();
                                                                            closesynchronizing();
                                                                        });
                                                                    });
                                                                },
                                                                        function (error) {
                                                                        }
                                                                        );
                                                            }
                                                            else {
                                                                openDB();
                                                                dB.transaction(function (ts) {
                                                                    ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                        autoSyncCompleted = 1;
                                                                        syncInProgress = 1;
                                                                        $(".SyncNotification").hide();
                                                                        closesynchronizing();
                                                                    });
                                                                });
                                                            }
                                                        });
                                                    });
                                                });
                                            }
                                        }
                                        else {
                                            var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID'; //Added to test CAS offline.
                                            ts.executeSql(query, [], function (tx, result) {
                                                if (result.rows.length > 0) {
                                                    var CASarrsy = [];
                                                    for (var i = 0; i < result.rows.length; i++) {
                                                        CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                                    }
                                                    sessionData = {
                                                        DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                        Language: localStorage.getItem("Language"),
                                                        EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                        SessionID: decryptStr(getLocal("SessionID"))
                                                    };
                                                    $.ajaxAutoSyncPostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                        openDB();
                                                        dB.transaction(function (ts) {
                                                            ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                autoSyncCompleted = 1;
                                                                syncInProgress = 1;
                                                                $(".SyncNotification").hide();
                                                                closesynchronizing();
                                                            });
                                                        });
                                                    },
                                                                        function (error) {
                                                                        }
                                                                        );
                                                }
                                                else {
                                                    openDB();
                                                    dB.transaction(function (ts) {
                                                        ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                            autoSyncCompleted = 1;
                                                            syncInProgress = 1;
                                                            $(".SyncNotification").hide();
                                                            closesynchronizing();
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        }
                        else {
                            selectJsonTable = 'SELECT * FROM JSONdataTable WHERE urlID = 2';
                            ts.executeSql(selectJsonTable, [], function (te, result) {
                                if (result.rows.length > 0) {
                                    for (var i = 0; i < result.rows.length; i++) {
                                        var row = result.rows.item(i);
                                        actionJsonData.push(JSON.parse(decryptStr(row.jsondata)));
                                    }
                                    if (actionJsonData.length > 0) {
                                        $.ajaxAutoSyncPostJSON(standardAddress + "WorkOrderActions.ashx?methodname=OfflineActions", { jsondata: JSON.stringify(actionJsonData) }, function (result) {
                                            openDB();
                                            dB.transaction(function (ts) {
                                                var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                                ts.executeSql(query, [], function (tx, result) {
                                                    if (result.rows.length > 0) {
                                                        var CASarrsy = [];
                                                        for (var i = 0; i < result.rows.length; i++) {
                                                            CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                                        }
                                                        sessionData = {
                                                            DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                            Language: localStorage.getItem("Language"),
                                                            EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                            SessionID: decryptStr(getLocal("SessionID"))
                                                        };
                                                        $.ajaxAutoSyncPostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                            openDB();
                                                            dB.transaction(function (ts) {
                                                                ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                    autoSyncCompleted = 1;
                                                                    syncInProgress = 1;
                                                                    $(".SyncNotification").hide();
                                                                    closesynchronizing();
                                                                });
                                                            });
                                                        },
                                                                        function (error) {
                                                                        }
                                                                        );
                                                    }
                                                    else {
                                                        openDB();
                                                        dB.transaction(function (ts) {
                                                            ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                                autoSyncCompleted = 1;
                                                                syncInProgress = 1;
                                                                $(".SyncNotification").hide();
                                                                closesynchronizing();
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                                else {
                                    var query = 'SELECT * FROM JSONdataTable WHERE urlID = 3 ORDER BY ROWID';
                                    ts.executeSql(query, [], function (tx, result) {
                                        if (result.rows.length > 0) {
                                            var CASarrsy = [];
                                            for (var i = 0; i < result.rows.length; i++) {
                                                CASarrsy.push(JSON.parse(decryptStr(result.rows.item(i).jsondata)));
                                            }
                                            sessionData = {
                                                DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                                                Language: localStorage.getItem("Language"),
                                                EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                                                SessionID: decryptStr(getLocal("SessionID"))
                                            };
                                            $.ajaxAutoSyncPostJSON(standardAddress + "CreateWO.ashx?method=SaveOfflineCASValues", { sessionObject: JSON.stringify(sessionData), CASData: JSON.stringify(CASarrsy) }, function (createresult) {
                                                openDB();
                                                dB.transaction(function (ts) {
                                                    ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                        autoSyncCompleted = 1;
                                                        syncInProgress = 1;
                                                        $(".SyncNotification").hide();
                                                        closesynchronizing();
                                                    });
                                                });
                                            },
                                                                        function (error) {
                                                                        }
                                                                        );
                                        }
                                        else {
                                            openDB();
                                            dB.transaction(function (ts) {
                                                ts.executeSql("DELETE FROM JSONdataTable", [], function () {
                                                    autoSyncCompleted = 1;
                                                    syncInProgress = 1;
                                                    $(".SyncNotification").hide();
                                                    closesynchronizing();
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }
                    catch (e) {
                        closesynchronizing();
                    }
                }, function (ts, error) { });
            });
        }
        else {
            ////showError("No Network");
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            return false;
        }
        $("#" + pageID + "navigationPanel").panel("close");
    }
    catch (e) {
        closesynchronizing();
    }
}

function UpdateAllLocalTable() {
    try {
        var queryArray = [];
        queryArray.push('DELETE FROM WorkOrderDetailsTable');
        queryArray.push('DELETE FROM WorkOrderContactsTable');
        queryArray.push('DELETE FROM WorkOrderEquipmentTagTable');
        queryArray.push('DELETE FROM WorkOrderAttachmentsTable');
        queryArray.push('DELETE FROM WorkOrderLogTable');
        queryArray.push('DELETE FROM AssignmentTable');
        queryArray.push('DELETE FROM PropertyTable');
        queryArray.push('DELETE FROM FloorTable');
        queryArray.push('DELETE FROM RoomTable');
        queryArray.push('DELETE FROM ProblemTable');
        queryArray.push('DELETE FROM WorkOrderLaborTable');
        queryArray.push('DELETE FROM EquipmentTagTable');
        queryArray.push('DELETE FROM ActionCommentsTable');
        queryArray.push('DELETE FROM JSONdataTable');
        queryArray.push('DELETE FROM RequestLogTable');
        openDB();
        var temp = 0;
        dB.transaction(function (ts) {
            for (var i = 0; i < queryArray.length; i++) {
                ts.executeSql(queryArray[i], [], function () {
                    if (temp == queryArray.length - 1) {
                        GetOfflineData();
                    }
                    temp = temp + 1;
                }, function () { log(queryArray[i]); });
            }

        });
    }
    catch (e) {
        log(e);
    }
}

function cleanDate(d, key) {
    key = key.toUpperCase();
    if (d !== null && d !== '') {
        var dt = new Date(+d.replace(/\/Date\((\d+)\)\//, '$1'));
        if (dt.toString() == "Invalid Date") {
            var s = d.split('T');
            s[0] = s[0].replace(/\-/g, '/');
            s[1] = s[1].substr(0, s[1].indexOf('.'));
            dt = new Date(s[0] + ' ' + s[1]);
        }
        switch (key) {
            case "LOCALSTRING".toUpperCase():
                return dt.toLocaleString();
            case "DATE":
                return dt.toDateString();
            case "TIME":
                return dt.toTimeString();
            case "LOCALDATE":
                return dt.toDateString();
            case "ISO":
                return dt.toISOString();
            case "UTC":
                return dt.toUTCString();
            case "DATETIME":
                return dt.toDateString() + " " + dt.toTimeString();
        }
    }
    else {
        return '';
    }
}

function GetMomentDate(datestamp, key) {
    key = key.toUpperCase();
    var dt;
    if (datestamp !== null && datestamp !== '') {
        if (datestamp.indexOf("Date") == -1) {
            dt = new moment(datestamp);
        }
        else {
            var newdate = new Date(+datestamp.substr(6, 13));
            dt = new moment(newdate);
        }
        switch (key) {
            case "LOCALSTRING".toUpperCase():
                return dt.toLocaleString();
            case "DATE":
                return dt.toDateString();
            case "TIME":
                return dt.toTimeString();
            case "LOCALDATE":
                return dt.toDateString();
            case "ISO":
                return dt.toISOString();
            case "UTC":
                return dt.toUTCString();
            case "DATETIME":
                return dt.format('MMMM Do YYYY, h:mm:ss a');
        }
    }
    else {
        return '';
    }
}

function DumpintoLocalDB(wod) {
    var values = [];
    var insertQuery;
    var query = "SELECT COUNT(*) AS COUNT FROM JSONdataTable";
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, [], function (tx, result) {
            var query = "SELECT jsonData AS jsonData FROM JSONdataTable WHERE urlID = 1";
            var count = parseInt(result.rows.item(0).COUNT) + 1;
            ts.executeSql(query, [], function (tx, results) {
                values = [];
                if (results.rows.length > 0) {
                    wod = decryptStr(results.rows.item(0).jsonData) + 'ì' + wod;
                    insertQuery = "UPDATE JSONdataTable SET jsonData = ? WHERE urlID = 1";
                    values.push(encryptStr(wod));
                    ts.executeSql(insertQuery, values, function () {
                        $.mobile.loading("hide");
                        ////showError("Will be processed Online");
                        showError(GetCommonTranslatedValue("WillBeProcessed"));
                        ResetFields();
                        setLocation();
                    },
                function (ts, error) { showError(GetCommonTranslatedValue("ErrorOffline")); }); ////showError("Saving error in Offline mode."); });
                }
                else {
                    insertQuery = "INSERT INTO JSONdataTable (Row,urlID,jsonData) VALUES (?,?,?)";
                    values.push(count);
                    values.push(1);
                    values.push(encryptStr(wod));
                    ts.executeSql(insertQuery, values, function () {
                        $.mobile.loading("hide");
                        ////showError("Will be processed Online");
                        showError(GetCommonTranslatedValue("WillBeProcessed"));
                        ResetFields();
                        setLocation();
                    }, function (ts, error) { });
                }
            });

        }, function () { showError(GetCommonTranslatedValue("ErrorMessage")); });
    });
}
