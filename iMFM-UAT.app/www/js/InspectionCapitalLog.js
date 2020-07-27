function navigateToCapitalLog() {
    $.mobile.changePage("InspectionCapitalLog.html");
}

function getCapitalLog() {    
    if (navigator.onLine) {
        var pageNum = 1;
        var data = {
            "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
            "Language": localStorage.getItem("Language"),
            "Username": decryptStr(localStorage.getItem("Username")),
            "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
            "CapSeq": localStorage.getItem("CapSeq"),
            "RecordsPerPage": localStorage.getItem("RecordsPerPage"),
            "PageNumber": pageNum,
            "ScreenName": "CapitalLog",
            "SessionID": decryptStr(getLocal("SessionID"))
        };
   
        var capitalLogURL = standardAddress + "Inspection.ashx?methodname=GetCapitalLog";
        CapitalLogHistory(capitalLogURL, data);
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function GetNextLogList(tag) {    
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr('id');
            var id = tag.id;
            var pageNum = parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1;
            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "Username": decryptStr(localStorage.getItem("Username")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
                "CapSeq": localStorage.getItem("CapSeq"),
                "PageNumber": pageNum,
                "ScreenName": "CapitalLog",
                "SessionID": decryptStr(getLocal("SessionID"))
            };
            $("#" + pageID).find("#" + id).attr('data-nextPage', parseInt($("#" + pageID).find("#" + id).attr('data-nextPage')) + 1);
            var logDetailsURL = standardAddress + "Inspection.ashx?methodname=GetNextList";
            CapitalLogHistory(logDetailsURL, myJSONobject);
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

function CapitalLogHistory(url, completeData) {
    var capitalLog = false;
    $.postJSON(url, completeData, function (resultData) {
        try {
            var length = resultData.length;
            var totalrecords;
            var dynamicList = '';
            var FieldChangedLabel = GetTranslatedValue("FieldChangedLabel");
            var OldDataLabel = GetTranslatedValue("OldDataLabel");
            var NewDataLabel = GetTranslatedValue("NewDataLabel");
            var ModifiedDateLabel = GetTranslatedValue("ModifiedDateLabel");
            var ModifiedByLabel = GetTranslatedValue("ModifiedByLabel");

            for (var index = 0; index < length; index++) {
                if (resultData[index].Tag == 15) {
                    capitalLog = true;
                    var oldData = "";
                    if (!resultData[index].OldData || resultData[index].OldData.toLowerCase() == "null" || resultData[index].OldData == null) {
                        oldData = "";
                    }
                    else {
                        oldData = resultData[index].OldData;
                    }

                    if (!resultData[index].NewData || resultData[index].NewData.toLowerCase() == "null") {
                        resultData[index].NewData = "";
                    }
                    dynamicList = dynamicList + '<li data-role="list-divider" class="lightTheme">' +
               '<span style="font-size: 12px;word-wrap: break-word;white-space: normal;">' + FieldChangedLabel + " " + resultData[index].FieldChanged + '</span></li>' +
               '<li><p style="font-size: 12px;word-wrap: break-word;white-space: normal;">' + OldDataLabel + " " + oldData + '</p>' +
               '<p style="font-size: 12px;word-wrap: break-word;white-space: normal;">' + NewDataLabel + " " + resultData[index].NewData + '</p>' +
               '<p style="font-size: 12px; word-wrap: break-word;white-space: normal;">' + ModifiedDateLabel + " " + resultData[index].DateOfChange + ' ' + getLocal("TZCommonName") + '</p>' +
               '<p style="font-size: 12px; word-wrap: break-word;white-space: normal;">' + ModifiedByLabel + " " + resultData[index].ModifiedByName + '</p></li>';

                    totalrecords = resultData[index].TotalRecords;
                }
            }

            $('#dynamicLogList').append(dynamicList);
            $('#dynamicLogList').listview('refresh');
            if (($("#dynamicLogList li").length / 2) == totalrecords) {
                $("#logNextButton").hide();
            }
        }
        catch (e) {
            //log(e);
        }
        if (capitalLog === false) {
            $('#NoCapitalLog').show();
            $("#logNextButton").hide();
        }
    });
}    
