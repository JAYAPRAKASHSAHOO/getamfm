function NavigateToWorkOrderDetailsScreen(obj) {
    setLocal("ScreenName", "InspectionViewWorkOrders");
    if (obj.id != "parentWorkOrder") {
        var workOrderNumber = $('#' + obj.id).attr("data-SubWorkOrder");
        setLocal("WorkOrderNumber", workOrderNumber);
    }
    else {
        var parentWorkOrderNumber = $('#' + obj.id).attr("data-ParentWorkOrderNumber");
        setLocal("WorkOrderNumber", getLocal("InspectionWorkOrderNumber"));
    }
    if (navigator.onLine) {
        $.mobile.changePage("WorkOrderDetails.html");
    }
    else {
        ////showError("Inspection works only online.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function ViewWorkOrders(viewWorkOrderUrl, viewWorkOrderData) {
    $.postJSON(viewWorkOrderUrl, viewWorkOrderData, function (result) {
        var length = result.length;
        var dynamicOrderList = '';
        var HTParent = GetTranslatedValue("ParentWorkOrder");
        var HTRelated = GetTranslatedValue("RelatedWorkOrders");
        $('#dynamicCollapsible').empty();
        dynamicOrderList = dynamicOrderList + '<li data-role="list-divider" data-theme="f" class="listDividerBackground">' + HTParent + '</li>' +
                        '<li><a id="parentWorkOrder" href="#" data-ParentWorkOrderNumber =' + getLocal("InspectionWorkOrderNumber") + ' onclick="NavigateToWorkOrderDetailsScreen(this)">' + getLocal("InspectionWorkOrderNumber") + '</a></li>' +
                        '<li data-role="list-divider" data-theme="g" class="listDividerBackground">' + HTRelated + '</li>';

        for (var workOrder = 0; workOrder < length; workOrder++) {
            if (result[workOrder].Tag == 6) {
                dynamicOrderList = dynamicOrderList + '<li><a id=' + workOrder + ' href="#"  data-SubWorkOrder =' + result[workOrder].WorkOrderNumber + '  onclick="NavigateToWorkOrderDetailsScreen(this)">' +
                                   result[workOrder].WorkOrderNumber + '</a></li>';
            }
        }
        $('#dynamicWorkOrdersList').append(dynamicOrderList);
        $('#dynamicWorkOrdersList').listview('refresh');
    });
}
