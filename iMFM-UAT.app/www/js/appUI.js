///<reference path="/jqm/appDB.js" />
/// <reference path="jquery.js" />
/// <reference path="jquery.mobile-1.3.0.js" />

function CO() {
    try {
        return navigator.onLine;
    } catch (e) {
        log(e);
    }
}

function setNull(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return value;
}


function goBack() {
    try {
        var pageIDArray = $("body").attr('data-prevPage').split('::');
        var pageID = pageIDArray[pageIDArray.length - 1];
        var prevsPage = 'undefined';

        for (var i = 1; i < pageIDArray.length - 1; i++) {
            log(pageIDArray[i]);
            prevsPage = prevsPage + "::" + pageIDArray[i];
        }

        $("body").attr('data-prevPage', prevsPage);
        $.mobile.changePage($("#" + pageID), { reverse: true, transition: "none" });
    } catch (e) {
        log(e);
    }
}


function goNext(newPageUrl) {
    var id;
    var pageID;
    try {
        // showLoad();
        var pID = newPageUrl.split("=")[1];
        if (newPageUrl == $.mobile.activePage.data('url') || pID.indexOf($.mobile.activePage.attr('data-url')) != -1) {
            return false;
        }
        
        setLocal("WOListReload", 'true');
        if ((newPageUrl.indexOf("PdaSearch") != -1 || newPageUrl.indexOf("DispatchBoard") != -1) && (!navigator.onLine)) {
            showError(GetCommonTranslatedValue("NoNetworkCommon"));
            return false;
        }
        if (newPageUrl.indexOf("PdaSearch") != -1) {
            setLocal("Online", "true");
        }
        else {
            setLocal("Online", "false");
        }
        //    else {
        if (navigator.onLine) {
            if ($("#general").find("[data-url='" + newPageUrl + "']").length === 0) {
                $("body").attr("data-PdaRequestedScreen", newPageUrl.split("=")[1]);
                 id = $("body").attr("data-PdaRequestedScreen");
                $("#" + id + ":first").remove();
                $.mobile.changePage(newPageUrl, { reverse: false, transition: "none" });
            }
            else if ($("#general").find("[data-url='" + newPageUrl + "']").length > 0) {
                $("[data-url='" + newPageUrl + "']").remove();
                $("body").attr("data-PdaRequestedScreen", newPageUrl.split("=")[1]);
                 id = $("body").attr("data-PdaRequestedScreen");
                $("#" + id + ":first").remove();
                $.mobile.changePage(newPageUrl, { reverse: false, transition: "none" });
            }
            else {
                 pageID = $("#general").find("[data-url='" + newPageUrl + "']").attr('id');
                $("body").attr("data-PdaRequestedScreen", newPageUrl.split("=")[1]);
                 id = $("body").attr("data-PdaRequestedScreen");
                $("#" + id + ":first").remove();
                $.mobile.changePage($("#" + pageID), { reverse: false, transition: "none" });
            }
        }
        else {            
            $("body").attr("data-PdaRequestedScreen", newPageUrl.split("=")[1]);
             pageID = $("body").attr("data-PdaRequestedScreen");
            $.mobile.changePage($("#" + pageID), { reverse: false, transition: "none" });
        }
        // }
    } catch (e) {
        log(e);
    }
}

function loadPage(pageurl) {
    try {
        if ($("#general").find("[data-url='" + pageurl + "']").length === 0) {
            $.mobile.loadPage(pageurl);
        }
    } catch (e) {
        log(e);
    }
}


function setItem(sKey, sValue) {
    try {
        sessionStorage.setItem(sKey, sValue);
    } catch (e) {
        log(e);
    }
}

function getItem(sKey) {
    try {
        return sessionStorage.getItem(sKey);
    } catch (e) {
        log(e);
    }
}

//**===To fill the date text box to current date==**//
function getTodayDate() {
    try {
        var now = new Date();
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear() + "-" + (month) + "-" + (day);
        return today;
    } catch (e) {
        log(e);
    }
}


function getDateString(timeStamp) {
    try {
        var dateStr = '';
        if (timeStamp !== null) {
            var date = new Date(+timeStamp.substr(6, 13) + (1000 * 3600));
            var day = ("0" + date.getDate()).slice(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            dateStr = date.getFullYear() + "-" + (month) + "-" + (day);
        }
        return dateStr;
    } catch (e) {
        log(e);
    }
}

function getDate(sType) {
    try {
        var sDate = new Date();

        if (sType === null || sType === undefined) {
            sDate = sDate.getFullYear() + "-" + parseInt(sDate.getMonth() + 1) + "-" + sDate.getDate() + " " + sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getSeconds();
            return sDate;
        }

        sType = sType.toUpperCase();

        switch (sType) {
            case "DATE":
                sDate = sDate.getFullYear() + "-" + parseInt(sDate.getMonth() + 1) + "-" + sDate.getDate();
                break;
            case "TIME":
                sDate = sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getSeconds();
                break;
            default:
                sDate = sDate.getFullYear() + "-" + parseInt(sDate.getMonth() + 1) + "-" + sDate.getDate() + " " + sDate.getHours() + ":" + sDate.getMinutes() + ":" + sDate.getSeconds();
                break;
        }

        return sDate;
    } catch (e) {
        log(e);
    }
}

