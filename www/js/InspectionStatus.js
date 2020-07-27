var jsonChartData = '';
function InspectionStatusSuccess(statusURL, statusData) {
    $.postJSON(statusURL, statusData, function (countdata) {
        jsonChartData = countdata;
        var value = 0;
        setTimeout(function () {
            DrawChart(value);
        }, 500);
    });
}

function InspectionStatusPostError() {
    showError(GetCommonTranslatedValue("ErrorLoading"));
}

function DrawChart(value) {
    var statusData = [];
    var HTClosed = GetTranslatedValue("ClosedInspectionLabel");
    var HTOpen = GetTranslatedValue("OpenInspectionLabel");
    var HTError = GetTranslatedValue("NoDataForGraph");
    if (value == 0) {
        statusData[0] = { label: HTClosed, data: jsonChartData[0].Closed }
        statusData[1] = { label: HTOpen, data: jsonChartData[0].Open }
    }
    else if (value == 1) {
        statusData[0] = { label: HTClosed, data: jsonChartData[1].Closed }
        statusData[1] = { label: HTOpen, data: jsonChartData[1].Open }
    }
    if (statusData[0].data == 0 && statusData[1].data == 0) {
        $('#noGraph').show();
        $('#noGraph').html(HTError);
        $('#graph1').hide();
    }

    else {
        $('#graph1').show();
        $('#noGraph').hide();
        $.plot($("#graph1"), statusData,
            {
                series: {
                    pie: {
                        show: true
                    }
                },
                legend: {
                    show: true
                }
            });
    }
}

function changeChartData() {
    DrawChart($('#inspectionPercentage').val());
}

function InspStatusPageBindDropdown() {
    var pageID = $.mobile.activePage.attr("id");
    var CurrentMonthLabel = GetTranslatedValue("CurrentMonth");
    var YTDLabel = GetTranslatedValue("YearToDate");

    $("#" + pageID).find("#inspectionPercentage").html('<option value="0">' + CurrentMonthLabel + '</option>' +
        '<option value="1">' + YTDLabel + '</option>');
    $("#" + pageID).find("#inspectionPercentage").selectmenu("refresh");
}