function BindOfflineWorkOrderList(pageID) {
    var selectQuery;
    var orderByKey = localStorage.getItem(pageID + "GroupByValue");
    if (orderByKey == "PRIORITY") {
        //selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,CAST(SUBSTR(WOD.Priority, 2,length(WOD.Priority))AS INT) as myprior ,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber = WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY myprior";
        // Grouping the work orders based on Priority.
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.Priority as myprior ,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber = WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY myprior";
    }
    else if (orderByKey == "BUILDING") {
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.Location3 as BuildingName,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ  FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber =  WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY Location3";
    }
    else if (orderByKey == "TARGETDATE") {
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription,WOD.CompletionTarget as CompletionTarget, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber = WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY DiffDate DESC";
    }
    else if (orderByKey === null || orderByKey === "null") {
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ  FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber =  WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY L2TCCProjectNumber";
    }
    else if (orderByKey == "ETADATE") {
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETADate, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ  FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber =  WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY ETADate";
    }
    else if (orderByKey != "ENTEREDDATE") {
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ  FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber =  WOC.WorkOrderNumber and WOD.OrderKey = ? ORDER BY " + orderByKey;
    }
    else
        selectQuery = "SELECT WOD.WorkOrderNumber,WOD.Assignment_Name,WOD.EnteredDate,WOD.Status,WOD.StatusDesc,WOD.Priority,WOD.OrderKey,WOC.Location1 as Location,WOC.L2TCCProjectNumber as PropertyID, WOD.ProblemDesc as ProblemDescription, WOD.ETA AS DateNextArrivalSite, WOD.SiteTZ  FROM WorkOrderDetailsTable WOD,WorkOrderContactsTable WOC WHERE WOD.WorkOrderNumber =  WOC.WorkOrderNumber and WOD.OrderKey = ?";
    var valueArray = [];

    switch (pageID) {
        case "pastDueOrderPage": valueArray.push(1); break;
        case "demandOrdersPage": valueArray.push(2); break;
        case "PMOrdersPage": valueArray.push(3); break;
    }
    openDB();
    dB.transaction(function (tx) {
        tx.executeSql(selectQuery, valueArray, function (ts, results) {
            BindOfflineList(pageID, results);
        },
        function (e, m, s) {
            log(e.status);
        });
    });
}


function WorkOrderDetailsPage(WONumber, orderKey) {
    if (localStorage.getItem("SgtCollection") != "null" && localStorage.getItem("SgtCollection") !== null) {
        setLocal("showLoading", "false");
        setLocal("WorkOrderNumber", WONumber);
        setLocal("orderKey", orderKey);
        $.mobile.changePage("WorkOrderDetails.html");
    }
    else {
        ////showError("Please sync the data completely, to navigate to this screen.");
        showError(GetCommonTranslatedValue("SyncCompletely"));
    }
}

function BindOfflineList(pageID, result) {
    try {
        var listID = "#" + $("#" + pageID).find(".WOListDiv").attr('id');
        var groupBy = localStorage.getItem(pageID + "GroupByValue");
        $(listID).empty();
        var HTPriority = GetTranslatedValue("PriorityDropDownOption");
        var HTStatus = GetTranslatedValue("StatusDropDownOption");
        var HTAssignment = GetTranslatedValue("AssignmentLabel");
        var HTProblemDescription = GetTranslatedValue("ProblemDescriptionLabel");
        var HTETADate = GetTranslatedValue("DateNextArrivalSiteLabel");
        $("#" + pageID).find(".ordersPageTitle span.OrdersCount").html("(" + result.rows.length + ")");
        if (result.rows.length === 0) {
            var NoOrdersID = "#" + $("#" + pageID).find(".NoOrders").attr('id');
            $(NoOrdersID).show();
            closeLoading();
        }
        else {
            var datestr = "";
            var i = 0;
            var diva;
            var noEtaDiv;

            for (i = 0; i < result.rows.length; i++) {
                var data = result.rows.item(i);
                var ultag;
                var appending;
                var count;
                var useNoEtaDiv = false;
                var dynamicStr = "";

                if (groupBy == "PRIORITY") {
                    dynamicStr = data.Priority;
                }
                else if (groupBy == "STATUS") {
                    dynamicStr = data.Status;
                }
                else if (groupBy == "ENTEREDDATE") {
                    dynamicStr = (data.EnteredDate).substr(0, 12);
                }
                else if (groupBy == "BUILDING") {
                    dynamicStr = data.BuildingName;
                }
                else if (groupBy == "TARGETDATE") {
                    dynamicStr = (decryptStr(data.CompletionTarget)).substr(0, 12);
                }
                else if (groupBy == "ETADATE") {
                    if (!IsStringNullOrEmpty(decryptStr(data.DateNextArrivalSite))) {
                        dynamicStr = (decryptStr(data.DateNextArrivalSite)).substr(0, 12);
                    } else {
                        dynamicStr = GetTranslatedValue("NoDateNextArrivalSiteLabel");
                        useNoEtaDiv = true;
                    }
                }
                else {
                    if (data.PropertyID === "" || data.PropertyID === "null" || data.PropertyID === null) {
                        dynamicStr = GetTranslatedValue("NoPropertyIDLabel");
                    }
                    else
                        dynamicStr = data.PropertyID;
                }

                if (dynamicStr !== datestr) {
                    count = 0;
                    appending = '';
                    datestr = dynamicStr;
                    diva = document.createElement('div');
                    diva.setAttribute("data-role", "collapsible");
                    diva.setAttribute("data-theme", "b");
                    var h4 = document.createElement('h4');

                    if (groupBy == "STATUS") {
                        h4.innerHTML = data.Status + "-" + decryptStr(data.StatusDesc);
                    }
                    else
                        h4.innerHTML = datestr;
                    diva.appendChild(h4);
                    ultag = document.createElement('ul');
                    ultag.setAttribute("class", "ui-listview");
                    ultag.setAttribute("data-role", "listview");

                }
                var wo = "'" + data.WorkOrderNumber + "'";
                var key = "'" + data.OrderKey + "'";
                appending = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-up-d"><div class="ui-btn-inner ui-li">' +
                            '<div class="ui-btn-text" onclick="javascript:WorkOrderDetailsPage(' + wo + ',' + key + ')"><a id="' + data.WorkOrderNumber + '" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + HTPriority + ' : ' + data.Priority + '</strong></p> <span style="font-size: 14px">' + data.WorkOrderNumber + '</span><br />' +
                            '<span style="font-size: 12px">' + HTStatus + ' : ' + data.Status + '</span><br />' +
                            '<span style="font-size: 12px">' + HTAssignment + ' : ' + decryptStr(data.Assignment_Name) + '</span><br />' +
                            '<ETAPANEL>' +
                            '<span style="font-size: 12px">' + HTProblemDescription + ' : ' + decryptStr(data.ProblemDescription) + '</span><br />' +
                            '<span style="font-size: 12px">' + decryptStr(data.Location) + '</span></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';

                if (!IsNullOrUndefined(decryptStr(data.DateNextArrivalSite)) && !IsStringNullOrEmpty(decryptStr(data.DateNextArrivalSite))) {
                    var timeZoneStr = IsStringNullOrEmpty(data.SiteTZ) ? '' : ' ' + decryptStr(data.SiteTZ);
                    appending = appending.replace('<ETAPANEL>', '<span style="font-size: 0.8em">' + HTETADate + ' : ' + decryptStr(data.DateNextArrivalSite) + timeZoneStr + '</span><br />');
                } else {
                    appending = appending.replace('<ETAPANEL>', '');
                }
                ultag.innerHTML = ultag.innerHTML + appending;
                diva.appendChild(ultag);
                if (useNoEtaDiv) {
                    noEtaDiv = diva;
                } else {
                    $(listID).append(diva);
                }
            }
            if (noEtaDiv) {
                $(listID).append(noEtaDiv);
            }

            $(listID).collapsibleset("refresh");
        }
        closeLoading();
    }
    catch (e) {
        closeLoading();
    }
}


function BindOfflineWorkOrderDetails() {
    var selectQuery = '';
    selectQuery = "SELECT D.*,C.*,E.* FROM WorkOrderDetailsTable D INNER join WorkOrderContactsTable C on C.WorkOrderNumber = D.WorkOrderNumber LEFT JOIN WorkOrderEquipmentTagTable E on E.WorkOrderNumber = D.WorkOrderNumber WHERE D.WorkOrderNumber = ? and D.OrderKey = ?";
    var valuearray = [];
    valuearray.push(getLocal("WorkOrderNumber"));
    valuearray.push(getLocal("orderKey"));
    openDB();
    dB.transaction(function (tx) {
        tx.executeSql(selectQuery, valuearray, function (ts, results) {
            var HTWONum = GetTranslatedValue("WorkOrderNum");
            $('#WorkOrderNum ').html(HTWONum + ' ' + localStorage.getItem("WorkOrderNumber"));
            if (results.rows.length > 0) {
                FillOfflineDetails(results.rows.item(0));
            }
            else {
                $("#WOVbackButton").addClass("ui-disabled");
                $("#WODMenuButton").addClass("ui-disabled");
                $("#WorkOrderLinks").hide();
                $("#workOrderDetailsCollapsible").hide();
                $("#NodataImage").show();
            }
        },
        function (e, m, s) {
            log(e.status);
        });
    });

}

function FillOfflineDetails(data) {
    $("#DetOrderTypeVal").html(decryptStr(data.OrderType));
    $("#txtACMTag").html(decryptStr(data.ACMTag));
    $("#DetAssignNameVal").html(decryptStr(data.Assignment_Name));
    $("#DetRequestorVal").html(decryptStr(data.Requestor));
    if (data.EnteredDate !== null && data.EnteredDate !== '') {
        $("#DetEnteredDateVal").html(data.EnteredDate + " " + decryptStr(data.SiteTZ));
    }
    if (data.ETA !== null && data.ETA !== '' && data.ETA !== "undefined") {
        $("#DetETAVal").html(data.ETA + " " + decryptStr(data.SiteTZ));
    }
    if (decryptStr(data.ResponseTarget) !== null && decryptStr(data.ResponseTarget) !== '' && decryptStr(data.ResponseTarget) !== "undefined") {
        $("#ResponseTargetVal").html(decryptStr(data.ResponseTarget) + " " + decryptStr(data.SiteTZ));
    }
    if (decryptStr(data.CompletionTarget) !== null && decryptStr(data.CompletionTarget) !== '' && decryptStr(data.CompletionTarget) !== "undefined") {
        $("#CompletionTargetVal").html(decryptStr(data.CompletionTarget) + " " + decryptStr(data.SiteTZ));
    }

    $("#ResolutionCodeVal").html(IsNullOrUndefined(data.ResolutionCode) ? "" : decryptStr(data.ResolutionCode));
    $("#DetTechNotesVal").html(IsNullOrUndefined(data.TechNotes) ? "" : decryptStr(data.TechNotes));
    $("#DetStatusVal").html('(' + data.Status + ')' + ' ' + (IsNullOrUndefined(data.StatusDesc) ? "" : decryptStr(data.StatusDesc)));
    $("#DetPriorityVal").html('(' + data.Priority + ')' + ' ' + (IsNullOrUndefined(data.PriorityDesc) ? "" : decryptStr(data.PriorityDesc)));
    $("#DetProblemCodeVal").html(IsNullOrUndefined(data.ProblemCode) ? "" : decryptStr(data.ProblemCode));
    $("#DetProblemDescVal").html(IsNullOrUndefined(data.ProblemDesc) ? "" : decryptStr(data.ProblemDesc));

    $("#ConLocationVal").html((IsNullOrUndefined(data.Location1) ? "" : decryptStr(data.Location1)) + "<br/>" + (IsNullOrUndefined(data.Location2) ? "" : decryptStr(data.Location2)));
    $("#ConTCCProjectNumVal").html(data.L2TCCProjectNumber);
    $("#ConLocationPhoneVal").attr("href", "tel:" + (IsNullOrUndefined(data.LocationPhone) ? "" : decryptStr(data.LocationPhone)));
    $("#ConLocationPhoneVal").html(IsNullOrUndefined(data.LocationPhone) ? "" : decryptStr(data.LocationPhone));
    $("#ConAssignNameVal").html(IsNullOrUndefined(data.Assignment) ? "" : decryptStr(data.Assignment));
    $("#ConAssignPhoneVal").attr("href", "tel:" + (IsNullOrUndefined(data.AssignmentPhone) ? "" : decryptStr(data.AssignmentPhone)));
    $("#ConAssignPhoneVal").html(IsNullOrUndefined(data.AssignmentPhone) ? "" : decryptStr(data.AssignmentPhone));
    $("#ConContactNameVal").html(IsNullOrUndefined(data.Contact) ? "" : decryptStr(data.Contact));
    $("#ConContactPhoneVal").attr("href", "tel:" + (IsNullOrUndefined(data.ContactPhone) ? "" : decryptStr(data.ContactPhone)));
    $("#ConContactPhoneVal").html(IsNullOrUndefined(data.ContactPhone) ? "" : decryptStr(data.ContactPhone));
    $("#ConCallerNameVal").html(IsNullOrUndefined(data.Reference) ? "" : decryptStr(data.Reference));
    $("#ConCallerPhoneVal").attr("href", "tel:" + (IsNullOrUndefined(data.ReferencePhone) ? "" : decryptStr(data.ReferencePhone)));
    $("#ConCallerPhoneVal").html(IsNullOrUndefined(data.ReferencePhone) ? "" : decryptStr(data.ReferencePhone));
    $("#ConRFMNameVal").html(IsNullOrUndefined(data.RFM) ? "" : decryptStr(data.RFM));
    $("#ConFMNameVal").html(IsNullOrUndefined(data.FM) ? "" : decryptStr(data.FM));
    $("#TagCountVal").html(IsNullOrUndefined(data.TagNumber) ? "" : decryptStr(data.TagNumber));
    if (data.TagNumber === null) {
        $("#TagCountVal").html("None");
    }

    if (IsNullOrUndefined(data.TagNumber) ? "" : decryptStr(data.TagNumber) !== 'None' &&
        IsNullOrUndefined(data.TagNumber) ? "" : decryptStr(data.TagNumber) !== '' &&
        IsNullOrUndefined(data.TagNumber) ? "" : decryptStr(data.TagNumber) !== undefined &&
        IsNullOrUndefined(data.TagNumber) ? "" : decryptStr(data.TagNumber) !== null) {
        $("#TagDataTable").show();
        $("#TagEquipGroupVal").html(IsNullOrUndefined(data.EquipGroup) ? "" : decryptStr(data.EquipGroup));
        $("#TagEquipStyleVal").html(IsNullOrUndefined(data.EquipSubGroup) ? "" : decryptStr(data.EquipSubGroup));
        $("#TagPartNumVal").html(IsNullOrUndefined(data.Part) ? "" : decryptStr(data.Part));
        $("#TagModelVal").html(IsNullOrUndefined(data.Model) ? "" : decryptStr(data.Model));
        $("#TagPartDescVal").html(IsNullOrUndefined(data.PartDesc) ? "" : decryptStr(data.PartDesc));
        $("#TagInstallDescVal").html(IsNullOrUndefined(data.InstalledDesc) ? "" : decryptStr(data.InstalledDesc));
        $("#TagSerialVal").html(IsNullOrUndefined(data.Serial) ? "" : decryptStr(data.Serial));
        $("#TagDetailsVal").html(IsNullOrUndefined(data.TagDetails) ? "" : decryptStr(data.TagDetails));
        $("#TagNotesVal").html(IsNullOrUndefined(data.TagNotes) ? "" : decryptStr(data.TagNotes));
        $("#TagInstallDateVal").html(IsNullOrUndefined(data.InstalledDate) ? "" : decryptStr(data.InstalledDate));
        $("#TagPartWarrDateVal").html(IsNullOrUndefined(data.PartWarrantyDate) ? "" : decryptStr(data.PartWarrantyDate));
        $("#TagLaborWarrDateVal").html(IsNullOrUndefined(data.LaborWarrantyDate) ? "" : decryptStr(data.LaborWarrantyDate));
    }

    $("#NTEValue").val(IsNullOrUndefined(data.BidAmount) ? "" : decryptStr(data.BidAmount));
    $("#workOrderCurrencyCodeSelect").val(IsNullOrUndefined(data.CurrencyCode) ? "" : decryptStr(data.CurrencyCode));
    $('#workOrderCurrencyCodeSelect').selectmenu("refresh", true);

    if (data.ServiceContract === "false") {
        $('#serviceContractValue').attr('checked', false).checkboxradio('refresh');
        serviceContractValue = false;
    }
    else if (data.ServiceContract === "true") {
        $('#serviceContractValue').attr('checked', true).checkboxradio('refresh');
        serviceContractValue = true;
    }

    if ($('#serviceContractValue').is(":checked") == "true") {
        localStorage.setItem("CASServiceContract", "true");
    }
    else if ($('#serviceContractValue').is(":checked") == "false") {
        localStorage.setItem("CASServiceContract", "false");
    }

    $("#ExtAccountNumberTextBox").val(IsNullOrUndefined(data.ExtAccountNumber) ? "" : decryptStr(data.ExtAccountNumber));
    document.getElementById("hiddenStatus").value = data.Status;
    document.getElementById("hiddenEmployee").value = IsNullOrUndefined(data.EmployeeNumber) ? "" : decryptStr(data.EmployeeNumber);
    setLocal("DateModified", IsNullOrUndefined(data.DateModified) ? "" : decryptStr(data.DateModified));
    setLocal("SiteTZ", IsNullOrUndefined(data.SiteTZ) ? "" : decryptStr(data.SiteTZ));
    setLocal("PreStartPending", data.PreStartPending);
    PopupMenu('viewTasks');
    closeLoading();
}

function BindOfflinelogs() {
    try {
        var logSelectQuery = 'SELECT DISTINCT WOL.*, WOD.SiteTZ FROM WorkOrderLogTable WOL,WorkOrderDetailsTable WOD WHERE WOL.WorkOrderNumber = "' + $.trim(getLocal("WorkOrderNumber")) + '" AND WOL.WorkOrderNumber = WOD.WorkOrderNumber ORDER BY Row';
        executeQuery(logSelectQuery, function (ts, result) {
            try {
                $("#LogList").empty();
                $("#logNextButton").show();
                $("#LogWONum").html(GetTranslatedValue("LogWONum") + ' ' + $.trim(getLocal("WorkOrderNumber")));

                if (result.rows.length === 0) {
                    $("#LogTotalCount").val(result.rows.length).button("refresh");
                    //$("#LogWONum").html(GetTranslatedValue("LogWONum)" + $.trim(getLocal("WorkOrderNumber")));
                    $("#LogWONum").append('<span class="badge">0</span>');
                    $("#NoLogDiv").show();
                    $("#logNextButton").hide();
                }
                else {
                    var HTStatus = GetTranslatedValue("StatusLabel");
                    var HTTransType = GetTranslatedValue("TransactionTypeLabel");
                    var HTDate = GetTranslatedValue("DateLabel");

                    $("#LogTotalCount").val(decryptStr(result.rows.item(0).TotalRecords)).button("refresh");
                    //$("#LogWONum").html("WO# " + $.trim(getLocal("WorkOrderNumber")));
                    $("#LogWONum").append('<span class="badge">' + decryptStr(result.rows.item(0).TotalRecords) + '</span>');

                    for (var i = 0; i < result.rows.length; i++) {
                        var data = result.rows.item(i);
                        var date = decryptStr(data.Date) + " " + decryptStr(data.SiteTZ);

                        var logitem = '<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-b ui-first-child"><p class="ui-li-aside ui-li-desc">' +
                                       '<strong>' + HTStatus + ':' + data.Status + '</strong></p><span style="font-size: 12px">' + HTTransType + ':' + decryptStr(data.TransType) + '</span></li>' +
                                       '<li class="ui-li ui-li-static ui-btn-up-c"><span style="font-size: 12px">' + HTDate + ':' + date + '</span><br>' +
                                       '<span style="font-size: 12px;white-space:normal;word-break:break-word;">' + decryptStr(data.Comment) + '</span> </li>';
                        $("#LogList").append(logitem);
                    }
                    $("#LogList").listview("refresh");
                    if (parseInt($("#LogList li").length / 2) == parseInt(decryptStr(result.rows.item(0).TotalRecords))) {
                        $("#logNextButton").hide();
                    }
                    $("#LogHTSynchronizeMessage").show();
                }
            }
            catch (e) {
                $("#LogTotalCount").val(result.rows.length).button("refresh");
                $("#LogWONum").html($("#WorkOrderNum").html() + '<span class="badge">' + result.rows.length + '</span>');
                $("#NoLogDiv").show();
                $("#logNextButton").hide();
            }
        }, function (ts, error) { log(error); });
    }
    catch (e) {
    }
}


function BindOfflineAttachments() {
    $("#NoAttacmentsDIV").hide();
    var attachmentSelectQuery = 'SELECT DISTINCT WOA.*, WOD.SiteTZ FROM WorkOrderAttachmentsTable WOA,WorkOrderDetailsTable WOD WHERE WOA.WorkOrderNumber = "' + $.trim(getLocal("WorkOrderNumber")) + '" AND WOA.WorkOrderNumber = WOD.WorkOrderNumber ORDER BY Row';
    executeQuery(attachmentSelectQuery, function (ts, result) {
        $("#AttachmentList").empty();
        if (result.rows.length === 0) {
            $("#AttWONum").html(GetTranslatedValue("AttWONum") + ' ' + $.trim(getLocal("WorkOrderNumber")));
            if ($("#" + pageID).find("#AttWONum .badge").length > 0) {
                $("#" + pageID).find("#AttWONum .badge").text = "0";
            } else {
                $("#AttWONum").append('<span class="badge">0</span>');
            }
            $("#NoAttacmentsDIV").show();
            $("#AttachmentMoreButton").hide();
        }
        else {
            $("#AttWONum").html(GetTranslatedValue("AttWONum") + ' ' + $.trim(getLocal("WorkOrderNumber")));
            if ($("#" + pageID).find("#AttWONum .badge").length > 0) {
                $("#" + pageID).find("#AttWONum .badge").text = decryptStr(result.rows.item(0).TotalRecords);
            } else {
                $("#AttWONum").append('<span class="badge">' + decryptStr(result.rows.item(0).TotalRecords) + '</span>');

            }
            for (var i = 0; i < result.rows.length; i++) {
                var data = result.rows.item(i);
                var date = decryptStr(data.Date) + " " + decryptStr(data.SiteTZ);
                var attachment = '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-btn-hover-c ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a class="ui-link-inherit" id="' + decryptStr(data.FileSeq) + '" onclick="javascript:ShowAttachment(this)" data-fileseq="' + decryptStr(data.FileSeq) + '" data-filename="' + decryptStr(data.FileName) + '"><p class="ui-li-aside ui-li-desc">' +
                                    '<strong>' + date + '</strong></p><span>' + decryptStr(data.FileName) + '</span><br><span style="font-size: 12px">' + GetTranslatedValue("DescriptionLabel") + ' ' + decryptStr(data.Desc) + '</span><br>' +
                                    '<span style="font-size: 12px;word-break: break-word">' + decryptStr(data.Comment) + '</span> </a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';
                $("#AttachmentList").append(attachment);
            }
            $("#AttachmentList").listview("refresh");
            if ($("#AttachmentList li").length >= parseInt(decryptStr(result.rows.item(0).TotalRecords))) {
                $("#AttachmentMoreButton").hide();
            }
        }
    }, function (ts, error) { log(error); });
}

function BindOfflineLabors() {
    try {
        openDB();
        var query = 'SELECT * FROM WorkOrderLaborTable WHERE WorkOrderNumber = ?';
        var data = [];
        data.push($.trim(getLocal("WorkOrderNumber")));
        dB.transaction(function (ts) {
            ts.executeSql(query, data, function (ts, result) {
                $("#" + pageID).find("#OffLabourList").empty();
                var pageID = $.mobile.activePage.attr('id');
                if (result.rows.length === 0) {
                    $("#" + pageID).find("#OffLabourList").hide();
                    $("#" + pageID).find("#NoLabourList").show();
                }
                else {
                    $("#" + pageID).find("#OffLabourList").show();
                    $("#" + pageID).find("#NoLabourList").hide();
                    var HTName = GetTranslatedValue("NameLabel");

                    var HTTotalTime = GetTranslatedValue("TotalTimeLabel");
                    var HTTotalLabor = GetTranslatedValue("TotalLaborLabel");
                    var HTTotalDrive = GetTranslatedValue("TotalDriveLabel");
                    var HTMiles = GetTranslatedValue("MilesLabel");
                    var nameString = "";
                    var count = 0;


                    for (var i = 0; i < result.rows.length; i++) {
                        var labourData = result.rows.item(i);
                        var divA;
                        var RegularHours = decryptStr(labourData.RegularHours) + decryptStr(labourData.RegularDriveHours);
                        var OverTimeHours = decryptStr(labourData.OverTimeHours) + decryptStr(labourData.OverTimeDriveHours);
                        var PremiumHours = decryptStr(labourData.PremiumHours) + decryptStr(labourData.PremiumDriveHours);
                        var SpecialHours = decryptStr(labourData.SpecialHours) + decryptStr(labourData.SpecialDriveHours);
                        var total = RegularHours + OverTimeHours + PremiumHours + SpecialHours;
                        var totalDrv = decryptStr(labourData.RegularDriveHours) + decryptStr(labourData.OverTimeDriveHours) + decryptStr(labourData.SpecialDriveHours) + decryptStr(labourData.PremiumDriveHours);

                        var totalLab = decryptStr(labourData.RegularHours) + decryptStr(labourData.OverTimeHours) + decryptStr(labourData.SpecialHours) + decryptStr(labourData.PremiumHours);
                        // New Fields                        
                        var Arrival = decryptStr(labourData.ArrivalStringData);
                        var Departure = decryptStr(labourData.DepartureStringData);
                        var Miles = decryptStr(labourData.Miles);

                        var dynamicStr = decryptStr(labourData.EmployeeNameLNF);
                        if (dynamicStr != nameString) {
                            collapsibleTag = '';
                            nameString = dynamicStr;
                            count++;

                            divA = document.createElement('div');
                            divA.setAttribute("data-role", "collapsible");
                            if (i == 0) {
                                divA.setAttribute("data-collapsed", "false");
                            }

                            var h4 = document.createElement('h4');
                            h4.innerHTML = HTName + ' ' + data[i].EmployeeNameLNF;
                            divA.appendChild(h4);

                            ultag = document.createElement('ul');
                            ultag.setAttribute("class", "ui-listview");
                            ultag.setAttribute("data-role", "listview");
                        }

                        var collapsibleTag = '<li><a id="LaborListData href="#" onclick="WO_Edit(' + i + ')" class="ui-link-inherit">' +

                        //'<p class="ui-li-aside ui-li-desc">' + Departure + '</p>' +
                          '<p class="ui-li-desc" ="width:50%"><strong>' + Arrival + ' - ' + Departure + '</strong></p>' +
                        //'<p class="ui-li-aside ui-li-desc">' + 'Total Time: ' + total + '</p>'
                          '<div class="ui-grid-a"><span class="ui-block-a" style="font-size:0.9em">' + HTMiles + ' ' + Miles + '</br>' + HTTotalLabor + ' ' + totalLab + '</span>' +
                          '<span class="ui-block-b" style="font-size:0.9em">' + HTTotalTime + ' ' + total + '</br>' + HTTotalDrive + ' ' + totalDrv + '</span></div></a></li>';

                        ultag.innerHTML = ultag.innerHTML + collapsibleTag;

                        divA.appendChild(ultag);

                        $("#" + pageID).find("#OffLabourList").append(divA);
                    }
                    $("#" + pageID).find("#OffLabourList").trigger("create");
                }
            }, function (ts, e) { alert(e.message); });
        });
    }
    catch (e) {
    }
}

// This function will create the html and bind the WOSteps for a work order if it is in offline mode.
function BindOfflineSteps() {
    $("#NoStepsDiv").hide();
    var stepQuery = 'SELECT DISTINCT wos.* FROM WOStepTable wos WHERE wos.WorkOrderNumber = "' + $.trim(getLocal("WorkOrderNumber")) + '" ORDER BY Row';
    executeQuery(stepQuery, function (ts, result) {
        // This function will bind the list.
        var stepData;
        var stepitem = "";
        var HTStepWONum = GetTranslatedValue("StepWONum");
        $("#StepList").empty();
        $("#StepWONum").html(HTStepWONum + ' ' + $.trim(getLocal("WorkOrderNumber")));
        if (result.rows.length == 0) {
            $("#StepWONum").append('<span class="badge">0</span>');
            $("#NoStepsDiv").show();
            $("#StepsMoreButton").hide();
        }
        else {
            $("#StepWONum").append('<span class="badge">' + decryptStr(result.rows.item(0).TotalRecords) + '</span>');

            // Generate the dynamic html for the list.
            for (var i = 0; i < result.rows.length; i++) {
                stepData = result[i];

                //Decrypting table values
                stepData.StepID = decryptStr(stepData.StepID);
                stepData.MasterID = decryptStr(stepData.MasterID);
                stepData.Label = decryptStr(stepData.Label);
                stepData.Prompt = decryptStr(stepData.Prompt);
                stepData.Units = decryptStr(stepData.Units);
                stepData.DataType = decryptStr(stepData);
                stepData.DataValueDate = decryptStr(stepData.DataValueDate);
                stepData.DataValueDecimal = decryptStr(stepData.DataValueDecimal);
                stepData.MinVal = decryptStr(stepData.MinVal);
                stepData.MaxVal = decryptStr(stepData.MaxVal);
                stepData.DefaultValue = decryptStr(stepData.DefaultValue);
                stepData.Status = stepData.Status;
                stepData.LastValue = decryptStr(stepData.LastValue);
                stepData.TotalRecords = decryptStr(stepData.TotalRecords);
                stepData.Row = decryptStr(stepData.Row);

                stepitem = stepitem + generateStepCode(stepData);
            }
            $("#StepList").append(stepitem);
            $("#StepList").listview("refresh");
            if ($("#StepList li").length / 2 == parseInt(d.TotalRecords)) {
                $("#StepNextButton").hide();
            }
        }
    }, function (ts, error) { log(error); });
}

function GetOfflinePastDueOrderCount() {
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql("SELECT orderkey, COUNT(*) as Count FROM WorkOrderDetailsTable group by orderkey", [], function (ts, result) {
            var pageID = $.mobile.activePage.attr('id');
            var pastdueOrdercount = 0;
            var demandOrderCount = 0;
            var PMOrdercount = 0;
            if (result.rows.length > 0) {
                for (var i = 0; i < result.rows.length; i++) {
                    var rowitem = result.rows.item(i);
                    switch (rowitem.OrderKey) {
                        case 1: pastdueOrdercount = rowitem.Count;
                            break;
                        case 2: demandOrderCount = rowitem.Count;
                            break;
                        case 3: PMOrdercount = rowitem.Count;
                            break;
                    }
                }
                $("#" + pageID + "navigationPanel").find('#400001Count').html(' (' + pastdueOrdercount + ')');
                $("#" + pageID + "navigationPanel").find('#400008Count').html(' (' + demandOrderCount + ')');
                $("#" + pageID + "navigationPanel").find('#400012Count').html(' (' + PMOrdercount + ')');
                ////SR: Pentesting & JQM update
                $("#" + pageID + "navigationPanel").attr('style', 'display:block');
                $("#" + pageID + "navigationPanel").panel().panel("open");
            }

            else {
                $("#" + pageID + "navigationPanel").find('#400001Count').html(' (' + 0 + ')');
                $("#" + pageID + "navigationPanel").find('#400008Count').html(' (' + 0 + ')');
                $("#" + pageID + "navigationPanel").find('#400012Count').html(' (' + 0 + ')');
                ////SR: Pentesting & JQM update
                $("#" + pageID + "navigationPanel").attr('style', 'display:block');
                $("#" + pageID + "navigationPanel").panel().panel("open");
            }
        });
    });
}

function BindCurrencyDropDown(controlID) {
    var currencyCode = JSON.parse(getLocal("CurrencyCollection"));
    var pageID = "#" + $.mobile.activePage.attr('id');
    //$(pageID).find("#" + controlID + " option:gt(0)").remove();
    $(pageID).find("#" + controlID).html('<option value="-1">' + GetCommonTranslatedValue("SelectLabel") + '</option>');
    for (var i = 0; i < currencyCode.length; i++) {
        var option = '<option value="' + currencyCode[i].Currency + '">' + currencyCode[i].Currency + '</option>';
        $(pageID).find("#" + controlID).append(option);
    }
    $(pageID).find("#" + controlID).selectmenu("refresh");
}


function BindSiteLabels() {
    var pageID = "#" + $.mobile.activePage.attr('id');
    var SiteLabels = getLocal("SiteLabels").split('$');
    if (SiteLabels[0].length > 0) {
        $(pageID).find("#SStCityLabel").html(SiteLabels[0] + ' :');
    }
    if (SiteLabels[1].length > 0) {
        $(pageID).find("#BuildingSectionLabel").html(SiteLabels[1] + ' :');
    }
    if (SiteLabels[2].length > 0) {
        $(pageID).find("#SFloorLabel").html(SiteLabels[2] + ' :');
    }
    if (SiteLabels[3].length > 0) {
        $(pageID).find("#SRoomLabel").html(SiteLabels[3] + ' :');
    }
}
