/// <summary>
/// Method to navigate to attachment.
/// </summary>
function navigateToAttachments(mode) {
    setLocal("RequestedAction", mode);
    //setBreadcrumb($.mobile.activePage.attr('id'), false);
    $.mobile.changePage("Attachment.html");
}

/// <summary>
/// Method to get attachment details.
/// </summary>
function AttacmentDetails() {
    var myJSONobject = {
        "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
        "Language": localStorage.getItem("Language"),
        "WorkOrdernumber": localStorage.getItem("WorkOrderNumber"),
        "EquipTagNumber": localStorage.getItem("TagNumber"),
        "RequestedScreen": getLocal("RequestedAction"),
        "RecordsPerPage": localStorage.getItem("RecordsPerPage"),
        "FeatureList": getLocal("featuresListAll"),
        "SessionID": decryptStr(getLocal("SessionID")),
        "EmployeeNumber": decryptStr(getLocal("EmployeeNumber"))
    };

    var AttacmentDetailsURL = standardAddress + "iMFMOrderDetails.ashx?methodname=AttachmentDetails";
    getAttacmentDetails(AttacmentDetailsURL, myJSONobject);
}
var attachmentData = "";

/// <summary>
/// Method to get attachment details.
/// </summary>
/// <param name="AttacmentDetailsURL">Holds URL. </param>
/// <param name="myJSONobject">Entity which holds the value. </param>
function getAttacmentDetails(AttacmentDetailsURL, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(AttacmentDetailsURL, myJSONobject, function (data) {

            attachmentData = data;
            bindAttachments(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to bind attachment.
/// </summary>
/// <param name="data">Holds the value. </param>
function bindAttachments(data) {
    var pageID = $.mobile.activePage.attr('id');
    var headerText = GetTranslatedValue("AttWONum") + ' ' + localStorage.getItem("WorkOrderNumber");

    if (getLocal("RequestedAction") == "Tag") {
        headerText = GetTranslatedValue("AttTagNum") + ' ' + localStorage.getItem("TagNumber");
    }

    if (data.length === 0) {
        $("#" + pageID).find("#AttWONum").html(headerText);
        if ($("#" + pageID).find("#AttWONum .badge").length > 0) {
            $("#" + pageID).find("#AttWONum .badge").text = "0";
        } else {
            $("#" + pageID).find("#AttWONum").append('<span class="badge">' + 0 + '</span>');
        }
        $("#" + pageID).find("#AttachmentMoreButton").hide();
        $("#" + pageID).find("#NoAttacmentsDIV").show();
        $("#" + pageID).find("#AttachmentList").hide();
        return false;
    }

    else {
        var attachment = "";
        for (var i = 0; i < data.length; i++) {
            attachment = attachment + '<li data-corners="false" data-theme="c" >' +
                '<a id="' + data[i].FileSeq + '" onclick="javascript:ShowAttachment(this)" data-fileseq="' + data[i].FileSeq + '" data-filename="' + data[i].FileName + '">' +
                '<p><strong>' +
                data[i].DateOfUpdateStr + '</strong></p><p>' + data[i].FileName + '</p><p style="font-size: 12px">' + GetTranslatedValue("DescriptionLabel") + ' ' + data[i].Description + '</p>' +
                '<p style="font-size: 12px;word-break: break-word">' + data[i].Comments + '</p> </a></li>';
        }
        $("#" + pageID).find("#AttachmentList").empty();
        $("#" + pageID).find("#AttachmentList").append(attachment);
        $("#" + pageID).find("#AttachmentList").listview("refresh");
        $("#" + pageID).find("#AttWONum").html(headerText);
        if ($("#" + pageID).find("#AttWONum .badge").length > 0) {
            $("#" + pageID).find("#AttWONum .badge").text = data[0].TotalRecords;
        } else {
            $("#" + pageID).find("#AttWONum").append('<span class="badge">' + data[0].TotalRecords + '</span>');
        }
        $("#" + pageID).find("#NoAttacmentsDIV").hide();
        $("#" + pageID).find("#AttachmentList").show();
        if (data[0].TotalRecords <= $("#" + pageID).find("#AttachmentList li").length) {
            $("#" + pageID).find("#AttachmentMoreButton").hide();
        }
    }
}

/// <summary>
/// Method to show attachment.
/// </summary>
/// <param name="tag">Holds the value. </param>
function ShowAttachment(tag) {
    $("#attachmentImage").attr('src', '');
    if (navigator.onLine) {
        var tagId = tag.id;
        var fileSeq = $("#" + tagId).attr("data-fileseq");
        var fileName = $("#" + tagId).attr("data-filename");
        var first = fileName.split('.');
        var fileextension = first[first.length - 1];
        fileextension = fileextension.toLowerCase();
        switch (fileextension) {
            case "jpg":
            case "bmp":
            case "ico":
            case "gif":
            case "png":
            case "jpeg":
            case "xlsx":
            case "xls":
            case "doc":
            case "docx":
            case "txt":
            case "csv":
                //case "tif":
                //case "tiff":
            case "pdf":
                var myJSONobject = {
                    "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                    "Language": localStorage.getItem("Language"),
                    "FileSeq": fileSeq,
                    "SessionID": decryptStr(getLocal("SessionID")),
                    "EmployeeNumber": decryptStr(getLocal("EmployeeNumber"))
                };
                var getImageURL = standardAddress + "iMFMOrderDetails.ashx?methodname=ShowImage";
                // var getImageURL = "http://10.10.220.107/iMFM/iMFMOrderDetails.ashx?methodname=ShowImage";
                getImage(getImageURL, myJSONobject, fileextension);
                break;
            default: showError(GetTranslatedValue("FileNotSupportedMessage")); break;
        }
        //return false;
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to get image.
/// </summary>
/// <param name="getImageURL">Holds the URL. </param>
/// <param name="myJSONobject">Holds the resultant value. </param>
/// <param name="fileextension">Holds the type of file. </param>
function getImage(getImageURL, myJSONobject, fileextension) {
    if (navigator.onLine) {
        $.mobile.loading("show");
        $.postJSON(getImageURL, myJSONobject, function (data) {
            LoadAttachment(data, fileextension);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to add more attachments.
/// </summary>
/// <param name="getImageURL">Holds the value. </param>
function AddMoreAttachments(tag) {
    try {
        if (navigator.onLine) {
            var pageID = $.mobile.activePage.attr('id');
            var id = tag.id;
            var pageNum = parseInt($("#" + pageID).find("#" + id).attr('data-pagenum')) + 1;
            var myJSONobject = {
                "DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
                "Language": localStorage.getItem("Language"),
                "Username": decryptStr(localStorage.getItem("Username")),
                "WorkOrdernumber": localStorage.getItem("WorkOrderNumber"),
                "EquipTagNumber": localStorage.getItem("TagNumber"),
                "RequestedScreen": getLocal("RequestedAction"),
                "PageNumber": pageNum,
                "SessionID": decryptStr(getLocal("SessionID")),
                "EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber"))
            };
            $("#" + pageID).find("#" + id).attr('data-pagenum', parseInt($("#" + pageID).find("#" + id).attr('data-pagenum')) + 1);
            var moreAttachmentDetails = standardAddress + "iMFMOrderDetails.ashx?methodname=GetAttachments";
            getMoreAttachments(moreAttachmentDetails, myJSONobject);
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

/// <summary>
/// Method to get more attachments.
/// </summary>
/// <param name="moreAttachmentDetails">Holds attachment details. </param>
/// <param name="myJSONobject">Holds the resultant value. </param>
function getMoreAttachments(moreAttachmentDetails, myJSONobject) {
    if (navigator.onLine) {
        $.postJSON(moreAttachmentDetails, myJSONobject, function (data) {
            bindAttachments(data);
        });
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

/// <summary>
/// Method to load attachment.
/// </summary>
/// <param name="imgData">Holds data of image. </param>
/// <param name="fileextension">Holds the type of file. </param>
function LoadAttachment(imgData, fileExtension) {
    switch (fileExtension) {
        case "xlsx":
        case "xls":
        case "doc":
        case "docx":
        case "msg":
        case "txt":
        case "csv":
        case "pdf":

            // To do : iOS is pending to test
            //Window.open not opening base 64 string/content
            if (navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|IEMobile)/)) {
                window.open(imgData.Data, '_blank', 'location=no');
                ref.close();
            } else if (navigator.userAgent.match(/(Android)/)) {
                // For Android 07/18/2019 Open file using fileOpener2 and FileOpener plugins
                SaveFileBeforeOpen(imgData.Data.split('base64,')[1], fileExtension);
            } else {
                SaveFileBeforeOpen(imgData.Data.split('base64,')[1], fileExtension);
            }

            break;
        // Default for images. 
        default:
            $.mobile.loading("hide");
            $("#attachmentImage").attr('src', imgData.Data);
            break;
    }
}

var onSuccess = function (data) {
    $.mobile.loading("hide");
    console.log("File opened");
};

function onError(error) {
    $.mobile.loading("hide");
    showError("File Not Supported to Open");
    //showError(GetTranslatedValue("FileNotSupportedMessage"));
}

// File will open from this method
function OpenFileFromDevice(filePath, fileMIMEType) {
    // To open PDF file
    if (fileMIMEType == "pdf") {
        cordova.plugins.fileOpener2.open(filePath, 'application/pdf', {
            error: function () {
                $.mobile.loading("hide");
                showError("File Not Supported to Open");
                console.log("Unable to open");
            },
            success: function () {
                $.mobile.loading("hide");
                console.log("File opened");
            }
        });
    } else {
        window.cordova.plugins.FileOpener.openFile(filePath, onSuccess, onError);
    }
}

// Converting Base 64 string to Blob data type
function base64toBlob(base64DataAttachedPDFContent, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(base64DataAttachedPDFContent);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function savebase64AscontentType(pdffolderpath, pdfname, attachedPDFContent, contentType) {
    // Convert the base64 string in a Blob
    var DataBlob = base64toBlob(attachedPDFContent, contentType);

    window.resolveLocalFileSystemURL(pdffolderpath, function (dir) {
        dir.getFile(pdfname, { create: true }, function (file) {
            file.createWriter(function (fileWriter) {
                fileWriter.write(DataBlob);
                setTimeout(function () {
                    OpenFileFromDevice(pdffolderpath + pdfname, contentType);
                }, 3000);

            }, function () {
                console.log("save failed");
            });
        });
    });
}

function SaveFileBeforeOpen(attachedPDFContent, contentType) {
    // Android device file storing path
    var pdffolderpath = "file:///storage/emulated/0/";
    savebase64AscontentType(pdffolderpath, "document." + contentType, attachedPDFContent, contentType);
}