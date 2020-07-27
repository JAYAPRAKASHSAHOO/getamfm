/// <summary>
/// Method to update table.
/// </summary>
/// <param name="tableName">Holds table name. </param>
/// <param name="updatecolumns">Holds value of column. </param>
function UpdateQuery(tableName, updatecolumns) {    
    var query = 'UPDATE ' + tableName + ' SET ';
    for (var i = 0; i < updatecolumns.length; i++) {
        query = query + updatecolumns[i] + ' = ?, ';
    }
    query = query + ':';
    query = query.replace('?, :', '? ');
    query = query + 'WHERE WorkOrderNumber = ?';
    return query;
}

/// <summary>
/// Method to update table in detail.
/// </summary>
/// <param name="ts">Holds table name. </param>
/// <param name="data">Holds property value. </param>
function DetailTableUpdate(ts, data) {    
    var columnName = [];
    columnName.push('OrderType');
    columnName.push('ACMTag');
    columnName.push('Assignment_Name');
    columnName.push('EmployeeNumber');
    columnName.push('Requestor');
    columnName.push('EnteredDate');
    columnName.push('DateModified');
    columnName.push('ETA');
    columnName.push('Status');
    columnName.push('StatusDesc');
    columnName.push('Priority');
    columnName.push('PriorityDesc');
    columnName.push('ProblemCode');
    columnName.push('ProblemDesc');
    columnName.push('TechNotes');

    var detailTableUpdate = UpdateQuery("WorkOrderDetailsTable", columnName);

    var values = [];
    var etaDateStr = getDateString(data.DateNextArrivalSite);
    values.push(encryptStr(data.OrderType));
    values.push(encryptStr(data.UserDef2));
    values.push(encryptStr(data.AssignName));
    values.push(encryptStr(data.EmployeeNumber));
    values.push(encryptStr(data.RequestedBy));
    values.push(data.DateEnteredStr);
    values.push(encryptStr(data.DateModifiedStr));
    values.push(encryptStr(data.DateNextArrivalSiteStr));
    values.push(data.Status);
    values.push(encryptStr(data.StatusDesc));
    values.push(data.Priority);
    values.push(encryptStr(data.PriorityDesc));
    values.push(encryptStr(data.ProblemCode));
    values.push(encryptStr(data.ProblemDescription));
    values.push(encryptStr(data.TechNotes));
    values.push(data.WorkOrderNumber);
    ContactTableUpdate(ts, data);
    ts.executeSql(detailTableUpdate, values, function () {  }, function (ts, error) { log(data.WorkOrderNumber + " " + error.message); });
}

/// <summary>
/// Method to update WorkOrderContactsTable.
/// </summary>
/// <param name="ts">Holds table name. </param>
/// <param name="data">Holds property value. </param>
function ContactTableUpdate(ts, data) {    
    var columnName = [];
    columnName.push('Location1');
    columnName.push('Location2');
    columnName.push('RFC');
    columnName.push('LocationPhone');
    columnName.push('Assignment');
    columnName.push('AssignmentPhone');
    columnName.push('Contact');
    columnName.push('ContactPhone');
    columnName.push('Reference');
    columnName.push('ReferencePhone');
    columnName.push('RFM');
    columnName.push('FM');
    var contactTableUpdate = UpdateQuery("WorkOrderContactsTable", columnName);
    var values = [];
    values.push(encryptStr(data.Location));
    values.push(encryptStr(data.L2Address));
    values.push(data.L2TCCProjectNumber);
    values.push(encryptStr(data.LocationPhone));
    values.push(encryptStr(data.AssignName));
    values.push(encryptStr(data.AssignPhone));
    values.push(encryptStr(data.SiteContactName));
    values.push(encryptStr(data.SiteContactPhone));
    values.push(encryptStr(data.Reference));
    values.push(encryptStr(data.ReferencePhone));
    values.push(encryptStr(data.FM));
    values.push(encryptStr(data.RFM));
    values.push(data.WorkOrderNumber);
    UpdateOtherTable(ts, data);
    ts.executeSql(contactTableUpdate, values, function () { }, function (ts, error) { log(data.WorkOrderNumber + " " + error.message); });
}

/// <summary>
/// Method to delete WorkOrderContactsTable.
/// </summary>
/// <param name="ts">Holds the condition. </param>
function DeleteWorkOrder(condition) {
    var deleteQuery;
    try {
        deleteQuery = "DELETE FROM WorkOrderLogTable WHERE WorkOrderNumber = '" + condition + "'";
        ts.executeSql(deleteQuery, [], function () { alert("s"); }, function (ts, error) { log(data.WorkOrderNumber + " " + error.message); });
        //executeQuery(deleteQuery);
        deleteQuery = "DELETE FROM WorkOrderAttachmentsTable WHERE WorkOrderNumber = '" + condition + "'";
        ts.executeSql(deleteQuery, [], function () { alert("s"); }, function (ts, error) {  log(data.WorkOrderNumber + " " + error.message); });
        //executeQuery(deleteQuery);
        deleteQuery = "DELETE FROM WorkOrderEquipmentTagTable WHERE WorkOrderNumber = '" + condition + "'";
        ts.executeSql(deleteQuery, [], function () { alert("s"); }, function (ts, error) { log(data.WorkOrderNumber + " " + error.message); });
        //executeQuery(deleteQuery);
    }
    catch (error) {
        //log(error);
    }
}

/// <summary>
/// Method to update other Table.
/// </summary>
/// <param name="ts">Holds table name. </param>
/// <param name="data">Holds property value. </param>
function UpdateOtherTable(ts, data) {    
    DeleteWorkOrder(ts, data.WorkOrderNumber);
    if (data.AttachmentList.length > 0) {
        FillAttachmentTable(ts, data);
    }
    if (data.LogList.length > 0) {
        FillLogTable(ts, data);
    }
    if (data.EquipTag !== null) {
        FillEquipmentTagTable(ts, data);
    }
}

/// <summary>
/// Method to update all Table.
/// </summary>
/// <param name="ts">Holds table name. </param>
/// <param name="data">Holds property value. </param>
function UpdateAllTables(ts, data, i) {
    if (i === null) {
        i = 0;
    }
    var workOrderDetail = data[i];
    var query = 'SELECT DateModified FROM WorkOrderDetailsTable WHERE WorkOrderNumber = ?';
    var ar = [];
    ar.push(workOrderDetail.WorkOrderNumber);
    ts.executeSql(query, ar, function (ts, result) {
        if (result.rows.length !== 0) {            
            if (decryptStr(result.rows.item(0).datemodified) != workOrderDetail.DateModifiedStr) {
                DetailTableUpdate(ts, workOrderDetail);
                if (i + 1 < data.length) {
                    UpdateAllTables(ts, data, i + 1);
                }
                else {
                    closeLoading();
                }
            }
        }
        else {
            var workorder = [];
            workorder.push(workOrderDetail);
            FillDetailsTable(workorder);
        }
    }, function (ts, error) {        
    });
}