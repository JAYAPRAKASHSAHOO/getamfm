/// <reference path="jquery.js" />
/// <reference path="_references.js" />

function success() {
    try {
        alert("Success");
    } catch (e) {
        log(e);
    }
}


function error() {
    try {
        alert("T error");
    } catch (e) {
        log(e);
    }
}

function errorlog(status, msg, error) {
    try {
        closesynchronizing();
        return;
        // console.log(status.status + " " + msg + " " + error);
    } catch (e) {
        log(e);
        closesynchronizing();
        return;
    }
}

function log(msg) {
    try {
        //console.log(msg);
    } catch (e) {
        log(e);
    }
}

function a(msg) {
    try {
        alert(msg);
    } catch (e) {
        log(e);
    }
}


function showLoad(pageID) {

    try {
        var pageID = $.mobile.activePage.attr('id');
        $("#" + pageID).append('<div style="display: none;"><!-- placeholder for testPopup --></div>' +
                            '<div class="ui-popup-screen ui-overlay-a in" id="testPopup-screen"></div>' +
                            '<div class="ui-popup-container ui-popup-active" id="testPopup-popup" tabindex="0"><div id="testPopup" data-role="popup" data-overlay-theme="a" data-dismissible="false" class="ui-popup ui-overlay-shadow ui-corner-all ui-body-c" aria-disabled="false" data-disabled="false" data-shadow="true" data-corners="true" data-transition="none" data-position-to="origin"> <h1> Loading...</h1></div></div>');

        var getTopPos = ($(window).height() / 2) - ($("#testPopup").height());
        var getLeftPos = ($(window).width() / 2) - ($("#testPopup").width());
        $("#testPopup - screen").attr('height', $(document).height());
        $("#testPopup - screen").attr('width', $(document).width());
        $("#testPopup").css("top", getTopPos);
        $("#testPopup").css("left", getLeftPos);
        $("#testPopup").popup();
        $("#testPopup").popup("open");
    }
    catch (e) { log(e); }
}

function closeLoad() {
    try {
        $("#testPopup-screen").remove();
        $("#testPopup").remove();
        $("#testPopup-popup").remove();
    }
    catch (e) { log(e); }
}
function AjaxGetFunction(url, successmethod) {
    try {
        $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            data: null,
            dataType: 'JSON',
            success: successmethod,
            error: errorlog
        });
    }
    catch (e) {
        log(e);
    }
}

function AjaxPostFunction(url, postData, successmethod) {
    try {
        $.ajax({
            url: url,
            type: 'POST',
            data: postData,
            dataType: 'JSON',
            success: successmethod,
            error: errorlog
        });
    }
    catch (e) {
        log(e);
    }
}
//Synchronous call
function SyncAjaxPostFunction(url, postData, successmethod) {
    try {
        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            cache: false,
            data: postData,
            dataType: 'JSON',
            success: successmethod,
            error: errorlog
        });
    }
    catch (e) {
        log(e);
    }
}