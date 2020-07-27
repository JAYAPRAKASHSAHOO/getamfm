function InspectionAttachmentPageSecutiry(SgstCollection) {
    var pageID = "#" + $.mobile.activePage.attr("id");
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 2, "InspectionTakePictureButton", "CanAccess")) {
        $(pageID).find("#InspectionTakePictureButton").hide();
    }
    if (!$.GetOnlineSecuritySubTokensBit(SgstCollection, 2, "InspectionDeletePictureButton", "CanAccess")) {
        $(pageID).find("#InspectionDeletePictureButton").hide();
    }
}

function checkBoxCheck(obj) {
    var id = obj.id;

    var imgAttr = $('#' + id).attr('data-img'); // DefaultDeleteIcon
    var imgDel = $('#' + id).attr('data-del');

    if (imgAttr == 'DefaultDeleteIcon') {
        $('#' + id).find('span .ui-icon-custom').css('background-image', 'url(' + AlterDeleteIcon + ')');
        $('#' + id).attr('data-img', 'AlterDeleteIcon');
        $('#' + id).attr('data-del', 'true');
        $('savedImagesList').find('#' + id).attr('checked', 'checked');
    }

    else if (imgAttr == 'AlterDeleteIcon') {
        $('#' + id).find('span .ui-icon-custom').css('background-image', 'url(' + DefaultDeleteIcon + ')');
        $('#' + id).attr('data-img', 'DefaultDeleteIcon');
        $('#' + id).attr('data-del', 'false');
        $('savedImagesList').find('#' + id).removeAttr('checked');
    }
}

function trigFileUpload() {
    $('#ImageDescription').blur();
    $('#inspectionAttachmentFile').val('');
    $('#ImageDescription').val('');
    $('#clearAttachmentSource').hide();
    $('#inspectionAttachmentFile').hide();
    $('#noImage').hide();
    $('#smallImage').attr('src', '');
    $("#InspAttachmentpopup").popup('open');
}

function deleteImages() {
    if (navigator.onLine) {
        var savedImgID = "";
        var totalLi = ("#savedImagesList li").length;
        for (i = 0; i < totalLi; i++) {
            var delImag = $('#savedImagesList #' + i).find('.deleteIcon').attr('data-del');
            if (delImag == 'true') {
                savedImgID += $('#savedImagesList #' + i).find('.deleteIcon').attr('id');
            }
        }
        if (savedImgID === "") {
            ////showError("Images not selected for deleting");
            showError(GetTranslatedValue("DeleteImageAlert"));
        }
        else {
            $("#AttachmentDeletePopUp").popup("open");
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function confirmDelete() {
    LoadMyLocation();
    var savedImgID = "";
    var Sequence;
    var totalLi = ("#savedImagesList li").length;
    for (i = 0; i < totalLi; i++) {
        var delImag = $('#savedImagesList #' + i).find('.deleteIcon').attr('data-del');
        if (delImag == 'true') {
            savedImgID += $('#savedImagesList #' + i).find('.deleteIcon').attr('id') + ',';
        }
    }
    savedImgID = savedImgID.substring(0, savedImgID.length - 1);
    if (getLocal("TableName") == "InspectionAsset") {
        Sequence = getLocal("EquipTagSequence");
    }
    else {
        Sequence = getLocal("Sequence");
    }

    var data = iMFMJsonObject({
        "InspectionAttachmentOperation": "3",
        "ID1": getLocal("InspectionWorkOrderNumber"),
        "ID2": Sequence,
        "ID3": getLocal("TableName"),
        tableName: "WorkOrder",
        "ImageFileSeq": savedImgID,
        "Username": decryptStr(getLocal("Username")),
        "GPSLocation": GlobalLat + "," + GlobalLong
    });

    var url = standardAddress + "Inspection.ashx?methodname=DeleteAttachmentPictures";
    InspectionDeleteSuccess(url, data);
}

function InspectionDeleteSuccess(url, data) {
    $.postJSON(url, data, function (resultData) {
        if (resultData[0].Status == 'success') {
            $('#DeleteSuccessPopup').popup("open");
        }
        else {
            ////showError("Failed to delete saved images, please try again");
            showError(GetTranslatedValue("FailedToDelete"));
        }
    });
}

function InspectionDeletePostError() {
    showError(GetTranslatedValue("ErrorInDeleting"));
}

function cancelDelete() {
    savedImgID = "";
}

function native(str) {
    var base64Data = str.split(',');
    return base64Data[1];
}

function successSave() {
    var prevPage = getLocal("TableName");
    if (prevPage == "InspectionItem") {
        removePageFromBreadcrumb();
        ////        $.mobile.changePage("InspectionEditItem.html");
        $.mobile.changePage("NewInspectionItems.html");
    }
}

function successDelete() {
    savedImgID = "";
    var prevPage = getLocal("TableName");
    removePageFromBreadcrumb();
    if (prevPage == "InspectionItem") {
        ////        $.mobile.changePage("InspectionEditItem.html");
        $.mobile.changePage("NewInspectionItems.html");
    }
    else if (prevPage == "InspectionAsset") {
        $.mobile.changePage("InspectionAssets.html");
    }
    else if (prevPage == "InspectionCapital") {
        $.mobile.changePage("InspectionCapital.html");
    }
    else if (prevPage == "InspectionVendor") {
        $.mobile.changePage("InspectionVendor.html");
    }
}

function InspectionGetAttachmentPostError() {
    $.mobile.loading("hide");
    showError(GetCommonTranslatedValue("ErrorMessage"));
}

//////////////////////////////////////////////////////////////////////////////////////inspection picture script//////////////////////////////////////////////////////

function inspectionPictureInitialisation() {
    var Sequence;
    var data;
    if (getLocal("TableName") == "InspectionAsset") {
        Sequence = getLocal("EquipTagSequence");
    }
    else {
        Sequence = getLocal("Sequence");
    }

    if (getLocal("TableName") == "InspectionCapital") {
        data = iMFMJsonObject({
            "InspectionAttachmentOperation": "1",
            "ID1": "",
            "ID2": getLocal("CapSeq"),
            "ID3": getLocal("TableName"),
            "Username": decryptStr(getLocal("Username"))
        });
    }
    else {
        data = iMFMJsonObject({
            "InspectionAttachmentOperation": "1",
            "ID1": getLocal("InspectionWorkOrderNumber"),
            "ID2": Sequence,
            "ID3": getLocal("TableName"),
            "Username": decryptStr(getLocal("Username"))
        });
    }
    var inspectionPictureURL = standardAddress + "Inspection.ashx?methodname=GetInspectionPictures";
    InspectionPicturesSuccess(inspectionPictureURL, data);
}

function InspectionPicturesSuccess(inspectionPicturesUrl, inspectionPictureDetails) {
    $.postJSON(inspectionPicturesUrl, inspectionPictureDetails, function (resultData) {
        if (resultData.length === 0) {
            $('#savedImagesList').hide();
        }
        else {
            $("#savedImagesList").empty();
            $('#savedImagesList').show();
            var imagesList = '';
            var length = resultData.length;
            var ImageNameLabel = GetTranslatedValue("ImageLabel");
            var DescriptionLabel = GetTranslatedValue("DescriptionLabel");
            for (var index = 0; index < resultData.length; index++) {
                var fileName = resultData[index].FileName;
                var imageDescription = resultData[index].Description;
                if (fileName === null) {
                    fileName = "Image";
                }
                if (imageDescription === null) {
                    imageDescription = GetTranslatedValue("DescriptionNotAvail");
                }
                imagesList = imagesList + ' <li  data-icon=custom  id=' + index + ' data-liSeq=' + resultData[index].FileSeq + ' >' +
                                        '<a href="#" id=saved' + resultData[index].FileSeq + ' data-fileSeq=' + resultData[index].FileSeq + ' onclick="getImageBaseCode(this)" >' +
                                        '<h4>' + ImageNameLabel + ' ' + fileName + '</h4>' +
                                        '<p>' + DescriptionLabel + ' ' + imageDescription + ' </p>' +
                                        '</a>' +
                                        '<a href="#" data-del="false" data-img="DefaultDeleteIcon" class="deleteIcon" id =' + resultData[index].FileSeq + ' onclick="checkBoxCheck(this);">' +
                                        ' </a>' +
                                        '</li>';
            }

            var url = $('.deleteIcon').find('span .ui-icon-custom').css('background-image');
            $('#savedImagesList').append(imagesList);
            $('#savedImagesList').listview('refresh');
            $('#savedImagesList').find('.deleteCheckBox').hide();
            $('.deleteIcon').find('span .ui-icon-custom').css('background-image', 'url(' + DefaultDeleteIcon + ')');
            $('a.deleteIcon').find('span').removeClass('ui-btn-up-b ui-shadow ui-btn-corner-all');
            $("#inspectionAttachmentPage").find("#inspectionAttachTrigger").addClass("ui-disabled");
        }
    });
}

function InspectionPicturesPostError() {
    showError(GetTranslatedValue("ErrorInAdding"));
}

function getImageBaseCode(obj) {
    var Sequence;
    var fetchImageData;
    if (navigator.onLine) {
        showActionPopupLoading();
        var fileSequence = $('#' + obj.id).attr('data-fileSeq');

        if (getLocal("TableName") == "InspectionAsset") {
            Sequence = getLocal("EquipTagSequence");
        }
        else {
            Sequence = getLocal("Sequence");
        }
        if (IsCapitalScreenFlag != 1) {
            fetchImageData = iMFMJsonObject({
                "InspectionAttachmentOperation": "4",
                "ID1": getLocal("InspectionWorkOrderNumber"),
                "ID2": Sequence,
                "ID3": getLocal("TableName"),
                "ImageFileSeq": fileSequence,
                "Username": decryptStr(getLocal("Username"))
            });
        }
        else {
            fetchImageData = iMFMJsonObject({
                "InspectionAttachmentOperation": "4",
                "ID1": "",
                "ID2": getLocal("CapSeq"),
                "ID3": getLocal("TableName"),
                "ImageFileSeq": fileSequence,
                "Username": decryptStr(getLocal("Username"))
            });
        }

        var showImageUrl = standardAddress + "Inspection.ashx?methodname=GetShowImageData";
        InspectionGetAttachmentSuccess(showImageUrl, fetchImageData);
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}

function InspectionGetAttachmentSuccess(showImageUrl, fetchImageData) {
    $.postJSON(showImageUrl, fetchImageData, function (resultData) {
        $.when(closeActionPopupLoading()).done(function() {

            $("#inspectionAttachmentImage").attr('src', "");
            $("#inspectionAttachmentImage").attr('src', resultData[0].DefaultValueStr);
        });
    });
}

function inspectionImgpopup() {
    var imgPopupHeight = $("#inspectionImagePopup-popup").height();
    var imgPopupWidth = $("#inspectionImagePopup-popup").width();
    $("#inspectionImagePopup").popup("open");
}

function inspectionAddAttachment(form) {
    $('#ImageDescription').blur();
    $("#SessionID").val(decryptStr(getLocal("SessionID")));
    $("#gpsLocation").val(GlobalLat + "," + GlobalLong);
    if (navigator.onLine) {
        ////var file = inspectionAttachmentFile.files;
        var file = inspectionAttachmentFile.value;
        if (file.length >= 1) {
            LoadMyLocation();
            if (form.ID3.value == 'InspectionItem') {
                InspectionItemImg = 1;
            }
            else if (form.ID3.value == 'InspectionAsset') {
                InspectionAssetsImg = 1;
            }
            else if (form.ID3.value == 'InspectionCapital') {
                InspectionCapitalImg = 1;
            }
            else {
                InspectionVendorImg = 1;
            }
            $('#gpsLocation').val(GlobalLat + "," + GlobalLong);
            $("#InspAttachmentpopup").popup('close');
            $("#imageUploadIdentifier").show();

            $.ajax({
                processData: false,
                contentType: false,
                //cache: false,
                url: standardAddress + "Inspection.ashx?methodname=SaveAttachmentPictures",
                type: "POST",
                headers: { "Origin": ORIGIN_HEADER },
                datatype: "json",
                data: new FormData(form),
                success: function (resultData) {
                   if (resultData === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                       LogoutCompletely();
                   } else {
                        var jData = JSON.parse(resultData);
                        if (jData[0].Status == "InspectionItemsuccess") {
                            InspectionItemImg = 0;
                            if (getLocal("TableName") == "InspectionItem" && $.mobile.activePage.attr("id") == "inspectionAttachmentPage") {
                                $("#imageUploadIdentifier").hide();
                                inspectionPictureInitialisation();
                            }
                        }
                        else if (jData[0].Status == "InspectionAssetsuccess") {
                            InspectionAssetsImg = 0;
                            if (getLocal("TableName") == "InspectionAsset" && $.mobile.activePage.attr("id") == "inspectionAttachmentPage") {
                                $("#imageUploadIdentifier").hide();
                                inspectionPictureInitialisation();
                            }
                        }
                        else if (jData[0].Status == "InspectionCapitalsuccess") {
                            InspectionCapitalImg = 0;
                            if (getLocal("TableName") == "InspectionCapital" && $.mobile.activePage.attr("id") == "inspectionAttachmentPage") {
                                $("#imageUploadIdentifier").hide();
                                inspectionPictureInitialisation();
                            }
                        }
                        else if (jData[0].Status == "InspectionVendorsuccess") {
                            InspectionVendorImg = 0;
                            if (getLocal("TableName") == "InspectionVendor" && $.mobile.activePage.attr("id") == "inspectionAttachmentPage") {
                                $("#imageUploadIdentifier").hide();
                                inspectionPictureInitialisation();
                            }
                        }
                    }
                },
                error: function (xhr, textStatus, jqXHR) {
                   if (xhr.responseText === "U2FsdGVkX1+YH7CqGKzCGVqdpPqPxYRq8T2miWs+NcY=") {
                       LogoutCompletely();
                   } else {
                       if ($.mobile.activePage.attr("id") == "inspectionAttachmentPage") {
                            $("#imageUploadIdentifier").hide();
                        }
                    ////showError("Error in adding Attachment");
                        showError(GetTranslatedValue("ErrorInAdding"));

                   }
                }
            });
        }
        else {
            $('#noImage').show();
            return false;
        }
    }
    else {
        ////showError("No network connection. Please try again when network is available.");
        showError(GetCommonTranslatedValue("NoNetworkCommon"));
    }
}
