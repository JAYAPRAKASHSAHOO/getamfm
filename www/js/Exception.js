/// <summary>
/// Method to navigate to Exception.
/// </summary>
/// <param name="tableName">Holds name of the table. </param>
function NavigateTOExcepTion(tableName) {   
    $.mobile.changePage("Exception.html");
    setLocal("ErrorTable", tableName);
}

/// <summary>
/// Method to get Exception.
/// </summary>
/// <param name="tableName">Holds name of the table. </param>
function getExceptionData(tableName) {    
    if (tableName == "ExceptionLogTable") {
        selectQuery = "SELECT * FROM RequestLogTable";
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql(selectQuery, [], function (ts, result) {
                if (result.rows.length > 0) {
                    var exceptionData;
                    for (i = 0; i < result.rows.length; i++) {
                        var data = result.rows.item(i);
                        exceptionData = exceptionData + '<P style="font-size: 12px;white-space:normal;word-break: break-word;">' +
                                    decryptStr(data.FuncName) + '</p>' +
                          '<P style="font-size: 12px;white-space:normal;word-break: break-word;">' + decryptStr(data.JsonData) + '</p>' +
                                    '<P style="font-size: 12px;white-space:normal;word-break: break-word;">' + decryptStr(data.CurrentDateTime) + '</p><hr />';

                    }
                    $("#exceptionData").html(exceptionData);
                }
            },
        function (e, m, s) {
            fillExceptionTable(e);
        });
        });
    }
    else {
        selectQuery = "SELECT * FROM ErrorLogTable";
        openDB();
        dB.transaction(function (tx) {
            tx.executeSql(selectQuery, [], function (ts, result) {
                if (result.rows.length > 0) {
                    var exceptionData;
                    for (i = 0; i < result.rows.length; i++) {
                        var data = result.rows.item(i);
                        exceptionData = exceptionData + '<P>' +
                                    data.Error + '-----------' + data.CurrentDateTime + '-----------' + data.EmployeeNumber + '</p>';

                    }
                    $("#exceptionData").html(exceptionData);
                }
            },
        function (e, m, s) {
            log(e.status);
        });
        });
    }
}