function navigateToLog() {
    $.mobile.changePage("LogPage.html");    
}


function LogDetails() {    
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "Username": decryptStr(localStorage.getItem("Username")),
        "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
        "WorkOrdernumber": localStorage.getItem("WorkOrderNumber"),
        "RecordsPerPage": localStorage.getItem("RecordsPerPage"),
        "SessionID": decryptStr(getLocal("SessionID"))
    };
    var logDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=LogPage";
    getLogdetails(logDetailsURL, myJSONobject);
}
var logData = "";

function getLogdetails(logDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(logDetailsURL, myJSONobject, function (data) {            
            logData = data;
            bindLogData(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function bindLogData(data) {
    try {
        var d;
        if (data.length === 0) {
            $('#NoLogDiv').show();
        }
        else {
            var logitem = "";
            for (var i = 0; i < data.length; i++) {
                d = data[i];
                var dt = d.DateOfUpdateStr + " " + d.TimeZone;
                logitem = logitem + '<li data-role="list-divider"><p class="ui-li-aside">'+
               '<strong>' + GetTranslatedValue("StatusLabel") + d.Status + '</strong></p><span style="font-size: 12px">' + GetTranslatedValue("TransactionTypeLabel") + d.TransType + '</span></li>'+
               '<li><p style="font-size: 12px"><strong>' + GetTranslatedValue("DateLabel") + dt + '</strong></p>'+
               '<p style="font-size: 12px;white-space:normal;word-break: break-word;"><strong>' + d.Comment + '</strong></p> </li>';
            }

            $("#LogList").append(logitem);
            $("#LogList").listview("refresh");
            $("#LogWONum").html(GetTranslatedValue('LogWONum') + ' ' + localStorage.getItem("WorkOrderNumber"));
            $("#LogWONum").append('<span class="badge">' + d.TotalRecords + '</span>');
            if ($("#LogList li").length / 2 == parseInt(d.TotalRecords)) {
                $("#logNextButton").hide();
            }
        }
    }

    catch (e) {
        // log(e);
    }
}

function GetNextList(tag) {
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr('id');
            var id = tag.id;
            var pageNum = parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1;
            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "Username": decryptStr(localStorage.getItem("Username")),
                "WorkOrdernumber": localStorage.getItem("WorkOrderNumber"),
                "PageNumber": pageNum,
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                "RecordsPerPage": localStorage.getItem("RecordsPerPage"),
                "SessionID": decryptStr(getLocal("SessionID"))
            };
            $("#" + pageID).find("#" + id).attr('data-nextPage', parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1);
            var logDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=GetNextList";
            getLogdetails(logDetailsURL, myJSONobject);
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
