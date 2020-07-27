function navigateToWODetails(obj) {
	if (navigator.onLine) {
		var WorkOrderID = obj.id;
		localStorage.setItem("WorkOrderNumber", WorkOrderID);
		$.mobile.changePage("WorkOrderDetails.html");
	}
	else {
		////showError("No network connection. Please try again when network is available.");
		showError(GetCommonTranslatedValue("NoNetworkCommon"));
	}
}

function WorkOrderDetails() {

    $.when(GetFeatureDatails("IsCloseSubSupported")).then(
          function (status) {
              //// setLocal("isCloseSubSupported", "true")
              var myJSONobject = {
                  DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
                  Language: localStorage.getItem("Language"),
                  //Username: decryptStr(localStorage.getItem("Username")),
                  EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
                  WorkOrdernumber: localStorage.getItem("WorkOrderNumber"),
                  SessionID: decryptStr(getLocal("SessionID")),
                  IsCloseSubSupported: decryptStr(getLocal("IsCloseSubSupported")),
                  IsMybuySpecialStatusSupported: decryptStr(getLocal("IsMybuySpecialStatusSupported"))
              };
              //// Added CloseSubSupported in json object
              var orderDetailsURL = standardAddress + "IMFMOrder.ashx?methodname=LoadWorkOrderDetails";
              getWorkOrderDetails(orderDetailsURL, myJSONobject);
          },
          function (status) {
              console.log("Failure");
          },
          function (status) {
              console.log("Sate");
          }
        );   
}

function ManageAllocation(woNumber) {
	var allocationJSONObject = {
		DatabaseID: decryptStr(localStorage.getItem("DatabaseID")),
		Language: localStorage.getItem("Language"),
		EmployeeNumber: decryptStr(localStorage.getItem("EmployeeNumber")),
		WorkOrdernumber: woNumber,
		//Username: decryptStr(localStorage.getItem("Username")),
		SessionID: decryptStr(getLocal("SessionID"))
	};

	var manageAllocationURL = standardAddress + "IMFMOrder.ashx?methodname=AllocationLocks";
    //	$.postAllocationJSON(manageAllocationURL, allocationJSONObject, function (data) {
    //	    console.log(data);
	//	});
	
    // SIC 2844 aMFM/iMFM allocation lock during work order view
	$.postJSON(manageAllocationURL, allocationJSONObject, function (data) {
	    // console.log(data);
        // Remove the locks once after navigate back from work order detail screen
	});
}

var orderDtails = "";
var serviceContractValue = "";
var companyCoveredValue = "";
function getWorkOrderDetails(orderDetailsURL, myJSONobject) {
	if (navigator.onLine) {
		$("#workOrderDetailsNotFound").hide();
		$("#workOrderDetailsCollapsible").show();
		$("#WorkOrderLinks").show();
		$.postWODetailsJSON(orderDetailsURL, myJSONobject, function (data) {
		    if (data.DetWONumberVal !== null) {
		        var HTWorkOrderNum = GetTranslatedValue("WorkOrderNum");
		        orderDtails = data;
		        setLocal("WorkOrderDetail", JSON.stringify(data));
		        setLocal("ProblemCodeNumber", data.DetProblemCodeVal);
		        setLocal("CustomerSiteNumber", data.CustomerSiteNumber);
		        //FillCASDetails(orderDtails);
		        FillDetails(orderDtails);
		        $('#WorkOrderNum').html(HTWorkOrderNum + ' ' + localStorage.getItem("WorkOrderNumber"));
		    }
		    else {
		        $("#workOrderDetailsNotFound").show();
		        $("#workOrderDetailsCollapsible").hide();
		        $("#WorkOrderLinks").hide();
		        $('#WorkOrderNum').hide();
		        $("#WODMenuButton").addClass("ui-disabled");
		        closeLoading();
		    }
		});
	}
}

/**
 * Take a given field and compare the contents to the company default for max length.
 * In the case of the value being larger than the default, truncate the value and provide
 * a link to a popup that will show the entire value.
 * @param [object] entity - the entity which is to be populated
 * @param [string] value - the value which is to be populated into the provided entity.
 */
function checkFieldLengthAndPopulate(entity, value) {
    var maximum = getLocal("iMFM_TextFieldMaximumLimit");
    if (value.length > maximum) {
        $(entity).attr("data-popup", value);
        $(entity).html(value.substring(0, maximum) + '... <br /><div style="text-align:center"><a href="#" style="text-decoration:none; background:transparent !important" onclick="showFullText(\'' + entity + '\');" > ' + GetCommonTranslatedValue("ShowFullText") + ' </a></div>');
    } else {
        $(entity).html(value);
    }
}

function showFullText(entity) {
    showFullTextPopup($(entity).attr("data-popup"));
}

function FillDetails(data) {
	//    To check allocation Locking

	if (data.IsLocked === true) {
	    var HTLockStatusValueLabel = GetTranslatedValue("LockStatusValueLabel");
		$("#LockStatusValueLabel").show();
		$("#LockStatusValueLabel").html(" < " + HTLockStatusValueLabel + " " + data.LockedEmployee + " >");
		$("#WODMenuButton").addClass("ui-disabled");
		$("#casSaveButton").addClass("ui-disabled");
	}
	
	if (IsStringNullOrEmpty(data.FlashText) ||data.WorkOrderShowACMTag == 2 || data.DetOrderTypeVal.toLowerCase() == "selfgen") {
        //$("#flashTextMessage").hide();
        //$("#warningImage").hide();
		//$("#flashDiv").hide();
		$("#txtACMTag").html(data.txtACMTag);
    } else {
        var rgba = "rgba(255,0,0)"; //Default color as RED
        if (!IsStringNullOrEmpty(data.FlashColor)) {
            rgba = "rgba(" + data.FlashColor.replace(/;/g, ",") + ")";
        }

        if (data.FlashRequired == 1) {
            $("#flashTextMessage").css("animation", "blink 1s linear infinite");
        }

        $("#flashTextMessage").css("background-color", rgba);
        $("#flashTextMessage").html(data.FlashText);
		$("#flashDiv").show();
		$("#txtACMTag").text('');
    }

    localStorage.setItem("closeSubs", data.closeSubSetting);
    setLocal("WorkOrderStatus", data.DetStatusVal);
    $("#DetOrderTypeVal").html(data.DetOrderTypeVal);
    $("#DetAssignNameVal").html(data.DetAssignNameVal);
    $("#DetRequestorVal").html(data.DetRequestorVal);
    setLocal("RequestedBy", data.DetRequestorVal);
    $("#DetEnteredDateVal").html(data.DetEnteredDateVal);
    $("#DetETAVal").html(data.DetETAVal);
	$("#DetStatusVal").html('(' + data.DetStatusVal + ')' + ' ' + data.DetStatusDescVal);
	$("#DetPriorityVal").html(data.DetPriorityVal);
	$("#DetProblemCodeVal").html(data.DetProblemCodeVal);
	$("#DetProblemDescVal").html(data.DetProblemDescVal);   
    checkFieldLengthAndPopulate("#DetTechNotesVal", data.DetTechNotesVal);
	$("#ConLocationVal").html(data.ConLocationVal + "<br/>" + data.ConBldgAddressVal);

	$("#ConTCCProjectNumVal").html(data.ConTCCProjectNumVal);
	$("#ConLocationPhoneVal").attr("href", "tel:" + data.ConLocationPhoneVal);
	$("#ConLocationPhoneVal").html(data.ConLocationPhoneVal);
	$("#ConAssignNameVal").html(data.ConAssignNameVal);
	$("#ConAssignPhoneVal").attr("href", "tel:" + data.ConAssignPhoneVal);
	$("#ConAssignPhoneVal").html(data.ConAssignPhoneVal);
	$("#ConContactNameVal").html(data.ConContactNameVal);
	$("#ConContactPhoneVal").attr("href", "tel:" + data.ConContactPhoneVal);
	$("#ConContactPhoneVal").html(data.ConContactPhoneVal);
	$("#ConCallerNameVal").html(data.ConCallerNameVal);
	$("#ConCallerPhoneVal").attr("href", "tel:" + data.ConCallerPhoneVal);
	$("#ConCallerPhoneVal").html(data.ConCallerPhoneVal);
	$("#ConRFMNameVal").html(data.ConRFMNameVal);
	$("#ConFMNameVal").html(data.ConFMNameVal);
    if (data.TagCountVal != "None"){
    $("#TagCountVal").html(data.TagCountVal);
    }
	$("#ResponseTargetVal").html(data.ResponseTarget);
	$("#CompletionTargetVal").html(data.CompletionTarget);
	$("#ResolutionCodeVal").html(data.ResolutionCode);

	/* Added for h Orders */
	if (data.DetWONumberVal.startsWith("H") || data.DetWONumberVal.startsWith("h")) {
	    $("#notes_for_h_order").show();
	    $("#notes_for_h_order_value").html(data.Notes);
	} else {
	    $("#notes_for_h_order").hide();
	}

	$("#NTEValue").val(data.BidAmount);
	$("#workOrderCurrencyCodeSelect").val(data.CurrencyCode);
	$('#workOrderCurrencyCodeSelect').selectmenu("refresh", true);
	localStorage.setItem("CASEstimatedCost", data.BidAmount);
	localStorage.setItem("CASCurrencyCode", data.CurrencyCode);
	localStorage.setItem("CASServiceContractID", data.ServiceCenterID);
	localStorage.setItem("CASCostCenter", data.CostCenter);
	localStorage.setItem("CASReference2", data.Reference2);
	localStorage.setItem("WOCustomerSiteNumber", data.CustomerSiteNumber);
	localStorage.setItem("WONumber", data.DetWONumberVal); 
	$("#ExtAccountNumberTextBox").val(data.ExtAccountNumber);
	localStorage.setItem("CASExtAccountNumber", data.ExtAccountNumber);
	if (data.WOAssignType == 'V') {
		localStorage.setItem("WOAssignedVendor", data.WOAssignedVendor);
		BindServiceContractDDL(data.ServiceCenterID);
	}
	else {
		localStorage.setItem("WOAssignedVendor", "null");
	}

//	if (data.CompanyCovered === false) {
//		$('#WODetailsPage #CompanyCoveredCheckBox').attr('checked', false).checkboxradio('refresh');
//		companyCoveredValue = false;
//	}
//	else if (data.CompanyCovered === true) {
//		$('#WODetailsPage #CompanyCoveredCheckBox').attr('checked', true).checkboxradio('refresh');
//		companyCoveredValue = true;
//	}

//	$("#WODetailsPage #CostCenterTextBox").val(data.CostCenter);

//	if (data.ServiceContract === false) {
//		$('#serviceContractValue').attr('checked', false).checkboxradio('refresh');
//		serviceContractValue = false;
//	}
//	else if (data.ServiceContract === true) {
//		$('#serviceContractValue').attr('checked', true).checkboxradio('refresh');
//		serviceContractValue = true;
//	}

//	if ($('#serviceContractValue').is(":checked") === true) {
//		localStorage.setItem("CASServiceContract", "true");
//	}
//	else if ($('#serviceContractValue').is(":checked") === false) {
//		localStorage.setItem("CASServiceContract", "false");
//	}

//	if ($('#CompanyCoveredCheckBox').is(":checked") === true) {
//		localStorage.setItem("CASCompanyCovered", "true");
//	}
//	else if ($('#CompanyCoveredCheckBox').is(":checked") === false) {
//		localStorage.setItem("CASCompanyCovered", "false");
//	}

//	$("#Reference2Value").html(data.Reference2);
//	CheckCostCenterRequired();

	if (data.TagCountVal != 'None') {
	    $("#TagCountVal").html(data.TagCountVal);
		$("#TagDataTable").show();
		$("#TagEquipGroupVal").html(data.TagEquipGroupVal);
		$("#TagEquipStyleVal").html(data.TagEquipStyleVal);
		$("#TagPartNumVal").html(data.TagPartNumVal);
		$("#TagModelVal").html(data.TagModelVal);
		$("#TagPartDescVal").html(data.TagPartDescVal);
		$("#TagInstallDescVal").html(data.TagInstallDescVal);
		$("#TagDetailsVal").html(data.TagDetailsVal);
		$("#TagNotesVal").html(data.TagNotesVal);
		$("#TagSerialVal").html(data.TagSerialVal);
		$("#TagInstallDateVal").html(data.TagInstallDateVal);
		$("#TagPartWarrDateVal").html(data.TagPartWarrDateVal);
		$("#TagLaborWarrDateVal").html(data.TagLaborWarrDateVal);
	}
	document.getElementById("hiddenStatus").value = data.DetStatusVal;
	document.getElementById("hiddenEmployee").value = data.EmployeeNumber;
	document.getElementById("hiddenNEApprovalCode").value = data.NTEApprovalCode;
	setLocal("DateModified", data.DateModified);
	setLocal("KeyFieldDateModified", data.KeyFieldDateModified);
	setLocal("SiteTZ", data.SiteTZ);
	setLocal("CustomerSiteNumber", data.CustomerSiteNumber);
	setLocal("IsInspectionPending", data.IsInspectionPending);
	setLocal("IsRefrigerantEligible", data.TagRefrigerantEligible);
	setLocal("NTEApprovalCodeVal", data.NTEApprovalCode);
	setLocal("TagNumber", data.TagCountVal);
    setLocal("WOSource", data.Source);
    setLocal("WOSystemSource", data.SystemSource);
    setLocal("PreStartPending", data.PreStartPending);
    setLocal("MyBuySpecialStatus", data.MyBuySpecialStatus ? data.MyBuySpecialStatus : "null");
    setLocal("IsExternalPO", data.IsExternalPO ? data.IsExternalPO : "null");
    if (data.MasterPM == true) {
        $("#ChildOrdersButton .ui-btn-text").text(GetTranslatedValue("ChildTagsButton"));
        $("#NoChildOrdersLabel .ui-btn-text").text(GetTranslatedValue("NoChildTagsLabel"));
    }
    
	NTEDefaultValueInt = data.NTEDefaultValueInt;
	PopupMenu('viewTasks');
        PushToLocalDB(data);
	closeLoading();
}


function LoadAssignTypeDDL(orderDetailsURL, myJSONobject) {
	try {
		if (navigator.onLine) {
		    $.postJSON(orderDetailsURL, myJSONobject, function (data) {
		        var selectLabel = GetCommonTranslatedValue("SelectLabel");
		        $('#ReassignAssignTypeDDL').empty();
		        $('#ReassignAssignTypeDDL').append("<option value='Select'>" + selectLabel + "</option>");
		        for (var i = 0; i < data.length; i++) {
		            $('#ReassignAssignTypeDDL').append("<option value='" + data[i].Value + "'>" + data[i].Text + "</option>");
		        }
		        $("#ReassignAssignTypeDDL").selectmenu("refresh");
		    });
		}
	}
	catch (e) {
		showError(e);
	}
}

function bindDetails(data) {
	var detailsContent = '<div id="DetailDataTableDiv" data-role="collapsible" data-theme="b" data-content-theme="d"  data-collapsed="false">' +
						 '<h3 id="DetailsButton">' +
						 'Details</h3>' +
						 '<table id="DetailDataTable" class="customTable"><tbody>' +
						 '<tr>' +
							 '<td id="DetOrderTypeLbl" class="LabelTD">Order Type</td>' +
							 '<td id="DetOrderTypeVal" class="ValueTD">' + data.DetOrderTypeVal + '</td>' +
						 '</tr>' +
						 '<tr>' +
							'<td id="lblACMTag">ACM</td>' +
							'<td id="txtACMTag">' + data.txtACMTag + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetAssignNameLbl">Assignment Name</td>' +
							'<td id="DetAssignNameVal">' + data.DetAssignNameVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetRequestorLbl">Requestor</td>' +
							'<td id="DetRequestorVal">' + data.DetRequestorVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetEnteredDateLbl">Entered Date</td>' +
							'<td id="DetEnteredDateVal">' + data.DetEnteredDateVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetETALbl">ETA</td>' +
							'<td id="DetETAVal">' + data.DetETAVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetStatusLbl">Status </td>' +
							'<td id="DetStatusVal">(' + data.DetStatusVal + ')' + '&nbsp;' + data.DetStatusDescVal + '</td>' +
							'<td id="DetStatusDescVal" style="display: none">' + data.DetStatusDescVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetPriorityLbl">Priority</td>' +
							'<td id="DetPriorityVal">' + data.DetPriorityVal + '</td>' +
							'<td id="DetPriorityDescVal" style="display: none">' + data.DetPriorityDescVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetProblemCodeLbl">ProblemCode</td>' +
							'<td id="DetProblemCodeVal">' + data.DetProblemCodeVal + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td id="DetProblemDescLbl">Problem Desc</td>' +
							'<td id="DetProblemDescVal" style="word-break: break-word; white-space: normal">' + data.DetProblemDescVal + '</tr>' +
						'<tr>' +
							'<td id="DetTechNotesLbl">TechNotes</td>' +
							'<td id="DetTechNotesVal">' + data.DetTechNotesVal + '</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
				'</div>';
	document.getElementById("hiddenStatus").value = data.DetStatusVal;
	document.getElementById("hiddenEmployee").value = data.EmployeeNumber;
	PopupMenu('viewTasks');
	return detailsContent;
}

function bindContacts(data) {
	var contactsContent = '<div id="ContactDataTableDiv" data-role="collapsible" data-collapsed="true" data-theme="b" data-content-theme="d">' +
						  '<h3 id="ContactsButton">Contacts</h3>' +
						  '<table id="ContactDataTable" class="customTable">' +
						  '<tbody>' +
						  '<tr>' +
								'<td id="ConLocationLbl" class="LabelTD">Location</td>' +
								'<td id="ConLocationVal" class="ValueTD">' + data.ConLocationVal + '</td>' +
								'</tr>' +
							'<tr>' +
							   '<td id="ConBldgAddressLbl"></td>' +
							   '<td id="ConBldgAddressVal">' + data.ConBldgAddressVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConTCCProjectNumLbl">RFC#</td>' +
								'<td id="ConTCCProjectNumVal">' + data.ConTCCProjectNumVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConLocationPhoneLbl">Location Phone</td>' +
								'<td><a id="ConLocationPhoneVal" href=tel:' + data.ConContactPhoneVal + '>' + data.ConContactPhoneVal + '</a></td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConAssignNameLbl">Assignment</td>' +
								'<td id="ConAssignNameVal">' + data.ConAssignNameVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConAssignPhoneLbl">Assignment Phone</td>' +
								'<td><a id="ConAssignPhoneVal" href=tel' + data.ConAssignPhoneVal + '>' + data.ConAssignPhoneVal + '</a></td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConContactNameLbl">Contact</td>' +
							   '<td id="ConContactNameVal">' + data.ConContactNameVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConContactPhoneLbl">Contact Phone</td>' +
								'<td><a id="ConContactPhoneVal" href=tel:' + data.ConContactPhoneVal + '>' + data.ConContactPhoneVal + '</a></td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConCallerNameLbl">Caller</td>' +
								'<td id="ConCallerNameVal">' + data.ConContactNameVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConCallerPhoneLbl">Caller Phone</td>' +
								'<td><a id="ConCallerPhoneVal" href=tel:' + data.ConCallerPhoneVal + '>' + data.ConCallerPhoneVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConRFMNameLbl">RFM</td>' +
								'<td id="ConRFMNameVal">' + data.ConRFMNameVal + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td id="ConFMNameLbl">FM</td>' +
								'<td id="ConFMNameVal">' + data.ConFMNameVal + '</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
					'</div>';
	return contactsContent;
}


function bindEuipTag(data) {
	var tableData;
	var equipContent = '<div id="TagDataTableDiv" data-role="collapsible" data-collapsed="true" data-theme="b" data-content-theme="d">' +
					   '<h3 id="TagButton">Equipment Tag</h3>';

	if (data.TagCountVal == "None") {
		$("#TagDataTable").hide();
		tableData = '<table class="customTable">' +
							'<tr>' +
								'<td id="TagCountLbl" class="LabelTD">Tag#</td>' +
								'<td id="TagCountVal" class="ValueTD">None</td>' +
							'</tr>' +
						'</table>';
	}
	else {
		tableData = '<table class="customTable">' +
							'<tr>' +
								'<td id="TagCountLbl" class="LabelTD">Tag#</td>' +
								'<td id="TagCountVal" class="ValueTD">' + data.TagCountVal + '</td>' +
							'</tr>' +
						'</table>' +
		 '<table id="TagDataTable" class="customTable">' +
		 '<tbody>' +
		 '<tr>' +
			  '<td id="TagEquipGroupLbl" class="LabelTD">Equip Group</td>' +
			  '<td id="TagEquipGroupVal" class="ValueTD">' + data.TagEquipGroupVal + '</td>' +
		 '</tr>' +
		 '<tr>' +
			'<td id="TagEquipStyleLbl">Equip Sub Group</td>' +
			'<td id="TagEquipStyleVal">' + data.TagEquipStyleVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagPartNumLbl">Part#</td>' +
			'<td id="TagPartNumVal">' + data.TagPartNumVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagModelLbl">Model#</td>' +
			'<td id="TagModelVal">' + data.TagModelVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagPartDescLbl">Part Desc</td>' +
			'<td id="TagPartDescVal">' + data.TagPartDescVal + '</td>' +
		'</tr>' +
		'<tr >' +
			'<td id="TagInstallDescLbl">Installed Desc</td>' +
			'<td id="TagInstallDescVal">' + data.TagInstallDescVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagNumberLbl">Tag#</td>' +
			'<td id="TagNumberVal">' + data.TagNumberVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagSerialLbl">Serial#</td>' +
			'<td id="TagSerialVal">' + data.TagSerialVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagNotesLbl">Tag Notes</td>' +
			'<td id="TagNotesVal">' + data.TagSerialVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagInstallDateLbl">Installed Date</td>' +
			'<td id="TagInstallDateVal">' + data.TagInstallDateVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagPartWarrDateLbl">Part Warranty Date</td>' +
			'<td id="TagPartWarrDateVal">' + data.TagPartWarrDateVal + '</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="TagLaborWarrDateLbl">Labor Warranty Date</td>' +
			'<td id="TagLaborWarrDateVal">' + data.TagLaborWarrDateVal + '</td>' +
		'</tr>' +

				'</tbody>' +
					'</table>';
	}
	equipContent = equipContent + tableData + '</div>';
	return equipContent;
}

// Added by Arpitha T S for CAS values
$('#serviceContractValue').click(function () {
	if ($('#serviceContractValue').is(":checked")) {
		serviceContractValue = true;
	}
	else {
		serviceContractValue = false;
	}
});

$('#CompanyCoveredCheckBox').click(function () {
	if ($('#CompanyCoveredCheckBox').is(":checked")) {
		companyCoveredValue = true;
	}
	else {
		companyCoveredValue = false;
	}
});


function SaveCASValues() {
    var secureNTEVal;
    var secureExtAccNum;
    var secureCostCenter;

    if ($("#NTEValue").val() !== "") {
        secureNTEVal = securityError($("#NTEValue"));
        $('#NTEValue').val(secureNTEVal);
        //        setLocal("secOldPwd", secureOldPwd);
        //        if (secureOldPwd == "") {
        //            return false;
        //        }
    }

    if ($("#ExtAccountNumberTextBox").val() !== "") {
        secureExtAccNum = securityError($("#ExtAccountNumberTextBox"));
        $('#ExtAccountNumberTextBox').val(secureExtAccNum);
        //        setLocal("secOldPwd", secureOldPwd);
        //        if (secureOldPwd == "") {
        //            return false;
        //        }
    }

    if ($("#CostCenterTextBox").val() !== "") {
        secureCostCenter = securityError($("#CostCenterTextBox"));
        $('#CostCenterTextBox').val(secureCostCenter);
        //        setLocal("secOldPwd", secureOldPwd);
        //        if (secureOldPwd == "") {
        //            return false;
        //        }
    }
	var pageID = "#" + $.mobile.activePage.attr("id");
	var regexestimatedServiceCost = new RegExp(/^[$]?([-][0-9]{1,2}([.][0-9]{1,2})?)$|^[$]?([0-9]{1,13})?([.][0-9]{1,2})$|^[$]?[0-9]{1,13}$/);
	//var estimatedServiceCostValue = regexestimatedServiceCost.test($('#NTEValue').val().trim());
	var estimatedServiceCostValue = regexestimatedServiceCost.test(secureNTEVal.trim());
	
    //// SIC 3051 displaying alert incase of wo PRL status and cancling work order in case of external po
	var statusPrl = document.getElementById("hiddenStatus").getAttribute("value") ? document.getElementById("hiddenStatus").getAttribute("value") : "null";

	if ((!estimatedServiceCostValue) && ($.trim($('#NTEValue').val()).length !== 0)) {
		////showError("Not To Exceed value given is invalid. Please enter valid currency value");
		showError(GetTranslatedValue("InvalidNTE"));
		return false;
	}
	else if ($.trim($('#NTEValue').val()).length === 0 && $(pageID).find('#NTEValue').attr("requried") == "true") {
		////showError("Please enter Not To Exceed value");
		showError(GetTranslatedValue("EnterNTE"));
		return false;
	}
	else if ($('#workOrderCurrencyCodeSelect').val() == "-1" && $(pageID).find('#workOrderCurrencyCodeSelect').attr("requried") == "true") {
		////showError("Please select the currency code");
		showError(GetTranslatedValue("SelectCurrency"));
		return false;
	}
	else if ($('#ServiceContractDropDownList').is(':visible') && $('#ServiceContractDropDownList').val() == "-1" && $(pageID).find('#ServiceContractDropDownList').attr("requried") == "true" && localStorage.getItem("WOAssignedVendor") != "null") {
		////showError("Please select the service contract");
		showError(GetTranslatedValue("SelectServiceContract"));
		return false;
	}
	else if ($('#CostCenterTextBox').is(':visible') && $.trim($('#CostCenterTextBox').val()).length === 0 && $(pageID).find('#CostCenterTextBox').attr("requried") == "true") {
		////showError("Please enter cost center value");
		showError(GetTranslatedValue("EnterCostCenter"));
		return false;
    } else if (getLocal("IsExternalPO").toUpperCase() == "TRUE" || (statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && getLocal("MyBuySpecialStatus").toUpperCase() == statusPrl)) {
        //// SIC 3051
        var alertMessage = alertMessage = GetTranslatedValue("CASExternalPOMessage") ? GetTranslatedValue("CASExternalPOMessage") : "This work order cannot be updated as it has an open PO against it.";
        
        if ((statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && getLocal("MyBuySpecialStatus").toUpperCase() == statusPrl)) {
            alertMessage = GetTranslatedValue("CASPRLMessage") ? GetTranslatedValue("CASPRLMessage").replace("xxx", getLocal("MyBuySpecialStatus")) : "This work order cannot be updated as it is in " + getLocal("MyBuySpecialStatus") + " status.";
        }
        if (getLocal("IsExternalPO").toUpperCase() == "TRUE" && (statusPrl != "null" && getLocal("MyBuySpecialStatus") != "null" && getLocal("MyBuySpecialStatus").toUpperCase() == statusPrl)) {
            alertMessage = GetTranslatedValue("CASPRLorExternalPOMessage") ? GetTranslatedValue("CASPRLorExternalPOMessage").replace("xxx", getLocal("MyBuySpecialStatus")) : "This work order cannot be phone fixed as it is in " + getLocal("MyBuySpecialStatus").toUpperCase() + " status or it has an open PO against it.";
        }
        
        OpenPRLPopup(alertMessage);
        return false;
    }

	if ($('#serviceContractValue').is(":checked") === true) {
		serviceContractValue = true;
	} else if ($('#serviceContractValue').is(":checked") === false) {
		serviceContractValue = false;
	}

	if ($('#CompanyCoveredCheckBox').is(":checked") === true) {
		companyCoveredValue = true;
	}
	else if ($('#CompanyCoveredCheckBox').is(":checked") === false) {
		companyCoveredValue = false;
	}

	var casDetailsURL = standardAddress + "CreateWO.ashx?method=SaveCASValues";
	var data = {
		"DatabaseID": decryptStr(localStorage.getItem("DatabaseID")),
		"Language": localStorage.getItem("Language"),
		"BidAmount": secureNTEVal,  //$("#NTEValue").val(),
		"CurrencyCode": $("#workOrderCurrencyCodeSelect").val(),
		"ServiceContractCovered": serviceContractValue,
		"CompanyCovered": companyCoveredValue,
		"CostCenter": secureCostCenter, //$("#CostCenterTextBox").val(),
		"ServiceContractID": $("#ServiceContractDropDownList").val(),
        "ExtAccountNumber": secureExtAccNum , //$.trim($("#ExtAccountNumberTextBox").val()),
		"WorkOrderNumber": localStorage.getItem("WorkOrderNumber"),
		"EmployeeNumber": decryptStr(localStorage.getItem("EmployeeNumber")),
		"GPSLocation": GlobalLat + "," + GlobalLong,
		"SessionID": decryptStr(getLocal("SessionID"))
	};

	$('#casSaveButton').addClass('ui-disabled');
	$('#casCancelButton').addClass('ui-disabled');
	if (navigator.onLine) {
		$.ajaxpostJSON(casDetailsURL, data, function (result) {
			if (result.indexOf("true") != -1) {
				var resultSet = JSON.parse(result);
				if (resultSet.CostCenter !== null) {
					$('#WODetailsPage #CostCenterTextBox').val(resultSet.CostCenter);
				}

				if (resultSet.Reference2) {
					$('#WODetailsPage #Reference2Value').text(resultSet.Reference2);
				}
				$('#casValueMessageParagraph').html(GetTranslatedValue("CASUpdateSuccess"));
				$("#casValuePopUp").popup("open");
			}
			else if (result.indexOf("false") != -1) {
			    $('#casValueMessageParagraph').html(GetTranslatedValue("CASUpdateFail"));

				$("#casValuePopUp").popup("open");
			}
			else {
			    showError(GetTranslatedValue("CASUpdateFail"));
			}
			$('#casSaveButton').removeClass('ui-disabled');
			$('#casCancelButton').removeClass('ui-disabled');
		});
	}
	else {
		var dataArry = [];
		openDB();
		dB.transaction(function (ts) {
			var query = 'SELECT COUNT(*) as ROWID FROM JSONdataTable';
			ts.executeSql(query, [], function (tx, rowresult) {
				var rowID = 0;
				if (rowresult.rows.length !== 0) {
					rowID = rowresult.rows.item(0).ROWID;
				}
				dataArry.push(rowID + 1);
				dataArry.push(3);
				dataArry.push(encryptStr(JSON.stringify(data)));
				var query = 'INSERT INTO JSONdataTable (ROW,urlID, jsondata) VALUES (?,?,?)';
				ts.executeSql(query, dataArry, function (tx) {
					////showError("Will be processed Online");
					showError(GetCommonTranslatedValue("WillBeProcessed"));
					$('#casSaveButton').removeClass('ui-disabled');
					$('#casCancelButton').removeClass('ui-disabled');
				}, function () {
					////showError("Will be processed Online");
					showError(GetCommonTranslatedValue("WillBeProcessed"));
					$('#casSaveButton').removeClass('ui-disabled');
					$('#casCancelButton').removeClass('ui-disabled');
				});
			});
		});
	}
}

function CASUpdateSuccess() {
	$("#casValuePopUp").popup("close");
	//localStorage.setItem("CASCostCenter", $("#CostCenterTextBox").val());
    //localStorage.setItem("CASCostCenter", securityError($("#CostCenterTextBox")));
	//localStorage.setItem("CASServiceContractID", $("#ServiceContractDropDownList").val());
}

function CASCancelFields() {
	var pageID = "#" + $.mobile.activePage.attr("id");
	$("#NTEValue").val(localStorage.getItem("CASEstimatedCost"));
	$("#workOrderCurrencyCodeSelect").val(localStorage.getItem("CASCurrencyCode"));
	$('#workOrderCurrencyCodeSelect').selectmenu("refresh", true);
	$(pageID + " #ServiceContractDropDownList").val(localStorage.getItem("CASServiceContractID"));
	$(pageID + ' #ServiceContractDropDownList').selectmenu("refresh", true);

	if (localStorage.getItem("CASCostCenter") != "null") {
		$(pageID + " #CostCenterTextBox").val(localStorage.getItem("CASCostCenter"));
	}
	else {
		$(pageID + " #CostCenterTextBox").val('');
	}

	if (localStorage.getItem("CASServiceContract") == "true") {
		if (!$(pageID + ' #serviceContractValue').is(":checked")) {
			$(pageID + ' #serviceContractValue').click().checkboxradio('refresh');
			serviceContractValue = true;
		}
	}
	else if (localStorage.getItem("CASServiceContract") == "false") {
		if ($(pageID + ' #serviceContractValue').is(":checked")) {
			$(pageID + ' #serviceContractValue').click().checkboxradio('refresh');
			serviceContractValue = false;
		}
	}

	if (localStorage.getItem("CASCompanyCovered") == "true") {
		if (!$(pageID + ' #CompanyCoveredCheckBox').is(":checked")) {
			$(pageID + ' #CompanyCoveredCheckBox').click().checkboxradio('refresh');
			serviceContractValue = true;
		}
	}
	else if (localStorage.getItem("CASCompanyCovered") == "false") {
		if ($(pageID + ' #CompanyCoveredCheckBox').is(":checked")) {
			$(pageID + ' #CompanyCoveredCheckBox').click().checkboxradio('refresh');
			serviceContractValue = false;
		}
	}
}

// Configure CreateSub popup translations.
function WorkOrderDetails_TranslationComplete() {
    var pageID = "#" + $.mobile.activePage.attr('id');

    var okButtonLabel = GetCommonTranslatedValue("OkLabel");
    var cancelButtonLabel = GetCommonTranslatedValue("CancelLabel");

    var createSubHeaderLabel = GetTranslatedValue("createSubPromptHeader");
    var offlineHeaderLabel = GetTranslatedValue("AlertLabel");
    var offlineBodyLabel = GetTranslatedValue("WillBeProcessedMessage");
    
    $(pageID).find("#CreateSubOKLabel .ui-btn-text").text(okButtonLabel);
    $(pageID).find("#CreateSubCancelLabel .ui-btn-text").text(cancelButtonLabel);
    $(pageID).find("#CreateSubSuccessOKLabel .ui-btn-text").text(okButtonLabel);
    $(pageID).find("#createSubPopupHeader").text(createSubHeaderLabel);
    $(pageID).find("#WOCreateSubSuccessPopup h1").text(createSubHeaderLabel);
    $(pageID).find("#casMessageDiv a").text(okButtonLabel);
    $(pageID).find("#CreateWithLaborErrorDiv a").text(okButtonLabel);
    $(pageID).find("#WillbeprocessedonsyncDiv a").text(okButtonLabel);
    $(pageID).find("#WillbeprocessedonsyncDiv h4").text(offlineHeaderLabel);
    $(pageID).find("#WillbeprocessedonsyncDiv div").text(offlineBodyLabel);
}


// This function will push work order data into the online DB if it does not exist already.
function PushToLocalDB(data) {
    try {
        if (decryptStr(getLocal("EmployeeNumber")) != data.EmployeeNumber) {
            // Bump this outside the array if we decide to update the Emp orders.
            var orderKey = 4;
            
            data.Table = [];
            data.Table1 = [];
            data.Table2 = [];
            data.Table3 = [];
            data.Table4 = [];
            data.Table5 = [];
            data.Table6 = [];
            
            var woData = {
                OrderKey: orderKey,
                WorkOrderNumber: getLocal("WorkOrderNumber"),
                OrderType: data.DetOrderTypeVal,
                ACMTag: data.txtACMTag,
                Assignment_Name: data.DetAssignNameVal,
                EmployeeNumber: data.EmployeeNumber,
                Requestor: data.DetRequestorVal,
                EnteredDate: data.DetEnteredDateVal,
                DateModified: data.DateModified,
                SortingDateEntered: null,
                ETA: data.DetETAVal,
                Status: data.DetStatusVal,
                StatusDesc: data.DetStatusDescVal,
                Priority: data.DetPriorityVal,
                PriorityDesc: data.DetPriorityDescVal,
                ProblemCodeNumber: data.ProblemCodeNumber,
                ProblemCode: data.DetProblemCodeVal,
                ProblemDesc: data.DetProblemDescVal,
                TechNotes: data.DetTechNotesVal,
                SiteTZ: data.SiteTZ,
                BidAmount: data.BidAmount,
                ServiceContract: data.ServiceCenterID,
                CurrencyCode: data.CurrencyCode,
                ExtAccountNumber: data.ExtAccountNumber,
                CompletionTarget:data.CompletionTarget,
                ResponseTarget: data.ResponseTarget,
                DiffDate: null,
                WOLaborHour: null,
                ProjectFixedCost: data.ProjectFixedCost,
                Location: data.ConLocationVal,
                Location2: data.ConBldgAddressVal,
                Location3: null,
                L2TCCProjectNumber: data.ConTCCProjectNumVal,
                LocationPhone: data.ConLocationPhoneVal,
                Assignment: data.ConAssignNameVal,
                AssignmentPhone: data.ConAssignPhoneVal,
                Contact: data.ConContactNameVal,
                ContactPhone: data.ConContactPhoneVal,
                Reference: data.Reference,
                ReferencePhone: data.ReferencePhone,
                RFM: data.ConRFMNameVal,
                FM: data.ConFMNameVal,
                FlashText: data.FlashText
            }
            
            data.Table.push(woData);
            
            if (data.TagCountVal != 'None') {
                var tagData = {
                    WorkOrderNumber: data.WorkOrderNumber,
                    TagNumber: data.TagCountVal,
                    EquipGroup: data.TagEquipGroupVal,
                    EquipSubGroup: data.TagequipStyleVal,
                    Part: data.TagPartNumVal,
                    PartDesc: data.TagPartDescVal,
                    Model: data.TagModelVal,
                    InstalledDate: data.TagInstallDateVal,
                    InstalledDesc: data.TagInstallDescVal,
                    Serial: data.TagSerialVal,
                    TagDetails: data.TagDetailsVal,
                    TagNotes: data.TagNotesVal,
                    PartWarrantyDate: data.TagPartWarrDateVal,
                    LaborWarrantyDate: data.TagLaborWarrDateVal
                }
                    
                data.Table1.push(tagData);
            }
            
            openDB();
            dB.transaction(function (ts) {
                   try {
                           ts.executeSql("SELECT COUNT(WorkOrderNumber) AS Count FROM WorkOrderDetailsTable WHERE WorkOrderNumber = ?", [getLocal("WorkOrderNumber")], function (ts, results) {
                                   if (results.rows.item(0).Count == 0) {
                                       FillDetailsTable(ts, data, orderKey);
                                   }
                               }, null);
                       
                   }
                   catch (e) {
                       ///Call the functionn to log Exception///////
                       fillExceptionTable(e.stack);
                   }
               });
        }
    }
    catch (e) {
        ///Call the functionn to log Exception///////
        fillExceptionTable(e.stack);
    }
}

/**
 * Prepares the resources to perform the async fetch of Child Orders for a given work order.
 * @param [int] pageNum - the specific page of the child order results
 * @returns $.Deferred() - Returns the promised state from the ajax transaction.
 */
function PrepareChildOrders(pageNum) {
    var functionStatus = new $.Deferred();
    localStorage.setItem("PageNumber", pageNum);
    var myJSONobject = {
    DatabaseID: decryptStr(getLocal("DatabaseID")),
    Language: getLocal("Language"),
    Username: decryptStr(getLocal("Username")),
    EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
    PageNumber: pageNum,
    WorkOrderNumber: getLocal("WorkOrderNumber"),
    SessionID: decryptStr(getLocal("SessionID"))
    };
    
    var ordersURL = standardAddress + "IMFMOrder.ashx?methodname=LoadChildOrders";
    
    if (navigator.onLine) {
        $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
                            BindChildOrders(data.Table, myJSONobject.PageNumber);
                            functionStatus.resolve();
                            });
    }
    else {
        functionStatus.reject();
    }
    
    return functionStatus.promise();
}

/**
 * Creates the HTML entities for the content generation of a specified childOrderWOListDiv entity
 * and updates that entity with the results.
 * @param Table result - The table of objects that will need to be added to the entity.
 * @param [int] pageNum - The specific page of child order results that is being created.
 */
function BindChildOrders(result, pageNum) {
    pageID = $.mobile.activePage.attr("id");
    
    try {
        var key = 0;
        var noOrders = true;
        var listID = "#" + $("#" + pageID).find(".childOrdersWOListDiv").attr('id');
        
        if (result.length > 0) {
            noOrders = false;
        }
        
        if (result.length === 1 && result[0].Comments === "This order has no children") {
            noOrders = true;
        }
        
        // This ultag element is necessary for formatting.
        var ultag;
        ultag = document.createElement('ul');
        ultag.setAttribute("class", "ui-listview");
        ultag.setAttribute("data-role", "listview");
        
        var appending;
        
        // Create the back button to traverse the previous pages of results.
        if (pageNum > 1) {
            appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
            + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
            + '<a data-enhanced="true" id="prev" href="javascript:PrepareChildOrders(' + (parseInt(localStorage.getItem("PageNumber")) - 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
            + '<span style="font-size: 0.9em" id="PreviousButton" >Prev</span></a></div></li>';
            ultag.innerHTML = ultag.innerHTML + appending;
        }
        
        if (!noOrders) {
            for (var i = 0; i < result.length; i++) {
                var count;
                
                if (result[i].isMasterPM === 0) {
                    // The output of the proc in this case is a list of orders.
                    var wo = "'" + result[i].WorkOrderNumber + "'";
                    
                    // Create the contents for the WO list entry.
                    appending = '<li>';
                    
                    if (result[i].Type) {
                        appending += '<p class="ui-li-aside ui-li-desc"><strong>' + result[i].Type + '</strong></p>';
                    }
                    
                    //appending = '<li><p class="ui-li-aside ui-li-desc"><strong>' + result[i].Type + '</strong></p>'
                    appending += '<span style="font-size: 0.9em">' + result[i].WorkOrderNumber + '</span><br />';
                    if (result[i].Entered_By) {
                        appending += '<span style="font-size: 0.9em">' + result[i].Entered_By + '</span><br />';
                    }
                    
                    if (result[i].Date) {
                        appending += '<span style="font-size: 0.8em">' + GetDateText(GetDateObjectFromInvariantDateString(result[i].Date)) + '</span><br />';
                    }
                    
                    if (result[i].Comments) {
                        appending += '<span style="font-size: 0.8em">' + result[i].Comments + '</span></li>';
                    }
                } else {
                    // The output in this case is a list of tags.
                    var location = result[i].DivisionDescription + "/<wbr>" + result[i].DistrictDescription + "/<wbr>" + result[i].SiteDescription;
                    //var HTSerialNumber = GetTranslatedValue("SerialNumber");
                    var HTSerialNumber = GetTranslatedValue("TagSerialLbl");
                    var HTTagNumber = GetTranslatedValue("TagCountLbl");
                    var HTPartDesc = GetTranslatedValue("TagPartDescLbl");
                    var HTBarcodeID = GetTranslatedValue("TagBarcodeLabel");
                    var HTCriticalDesc = GetTranslatedValue("TagCriticalDescLabel");
                    
                    // Create the contents for the WO list entry.
                    //appending = '<li style="padding:0px;"><a id="' + result[i].WorkOrderNumber + '"  href="#"  onclick="javascript:navigateToWorkOrderDetailsPage(' + wo + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + result[i].Status + '</strong></p>'
                    appending = '<li><span>' + HTTagNumber + ': <strong>' + result[i].EquipTagNumber + '</strong></span><br />'
                    + '<span style="font-size: 0.9em">' + result[i].InstalledDescription + '</span><br />';
                    
                    if (result[i].PODescription) {
                        appending += '<span style="font-size: 0.8em">' + HTPartDesc + ': ' + result[i].PODescription + '</span><br />';
                    }
                    
                    if (result[i].SerialNumber) {
                        appending += '<span style="font-size: 0.9em;text-decoration:none">' + HTSerialNumber + ' : ' + result[i].SerialNumber + '</span><br />';
                    }
                    
                    if (result[i].BarcodeID) {
                        appending += '<span style="font-size: 0.8em">' + HTBarcodeID + ': ' + result[i].BarcodeID + '</span><br />';
                    }
                    
                    var mfgModel;
                    if (result[i].MfgName) {
                        mfgModel = result[i].MfgName;
                    }
                    
                    if (result[i].ManufacturerPartModel) {
                        if (mfgModel) {
                            mfgModel += ' - ' + result[i].ManufacturerPartModel;
                        } else {
                            mfgModel = result[i].ManufacturerPartModel;
                        }
                    }
                    
                    if (mfgModel) {
                        appending += '<span style="font-size: 0.8em">' + mfgModel + '</span><br />';
                    }
                    
                    if (result[i].CriticalDescription) {
                        appending += '<span style="font-size: 0.8em">' + HTCriticalDesc + ': ' + result[i].CriticalDescription + '</span><br />';
                    }
                    
                    appending += '<span style="font-size: 0.8em">' + location + '</span></li>';
                }
                ultag.innerHTML = ultag.innerHTML + appending;
            }
        }
        
        // Add the more button if there's more.
        if (result[0].TotalRecords > 6 * pageNum) {
            //appending = '<li style="padding:0px;"><a id="next" href="javascript:PrepareOrderHistory(' + (parseInt(localStorage.getItem("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-next"><span style="font-size: 0.9em">More</span></a></li>';
            appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
            + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
            + '<a data-enhanced="true" id="next" href="javascript:PrepareChildOrders(' + (parseInt(localStorage.getItem("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
            + '<span style="font-size: 0.9em" id="NextButton">Next</span></a></div></li>';
            ultag.innerHTML = ultag.innerHTML + appending;
            
        }
        $(listID).empty();
        $(listID).append(ultag);
        $(listID).trigger('create');

        if (noOrders) {
            $("#" + pageID).find(".noChildOrdersDiv").show();
        }
        else {
            $("#" + pageID).find(".noChildOrdersDiv").hide();
        }
        $(listID).collapsibleset("refresh");
    } catch (ex) {
        $("#" + pageID).find(".noChildOrdersDiv").show();
    }
}

function PrepareComponents(pageNum) {
    var functionStatus = new $.Deferred();
    localStorage.setItem("PageNumber", pageNum);
    var myJSONobject = {
    DatabaseID: decryptStr(getLocal("DatabaseID")),
    Language: getLocal("Language"),
    Username: decryptStr(getLocal("Username")),
    EmployeeNumber: decryptStr(getLocal("EmployeeNumber")),
    PageNumber: pageNum,
    WorkOrderNumber: getLocal("WorkOrderNumber"),
    SessionID: decryptStr(getLocal("SessionID"))
    };
    
    var ordersURL = standardAddress + "IMFMOrder.ashx?methodname=LoadComponents";
    
    if (navigator.onLine) {
        $.ajaxpostOrderJSON(ordersURL, myJSONobject, function (data) {
                            BindComponents(data.Table, myJSONobject.PageNumber);
                            functionStatus.resolve();
                            });
    }
    else {
        functionStatus.reject();
    }
    
    return functionStatus.promise();
}

function BindComponents(result, pageNum) {
    pageID = $.mobile.activePage.attr("id");
    
    try {
        var key = 0;
        var noOrders = true;
        var listID = "#" + $("#" + pageID).find(".componentsListDiv").attr('id');
        
        if (result.length > 0) {
            noOrders = false;
        }
        
        // This ultag element is necessary for formatting.
        var ultag;
        ultag = document.createElement('ul');
        ultag.setAttribute("class", "ui-listview");
        ultag.setAttribute("data-role", "listview");
        
        var appending;
        if (pageNum > 1) {
            appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
            + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
            + '<a data-enhanced="true" id="prev" href="javascript:PrepareOrderHistory(' + (parseInt(localStorage.getItem("PageNumber")) - 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
            + '<span style="font-size: 0.9em" >Prev</span></a></div></li>';
            //<a id="prev" href="javascript:PrepareOrderHistory();" class="ui-link-inherit jscroll-prev"><span style="font-size: 0.9em">Prev</span></a></li>';
            ultag.innerHTML = ultag.innerHTML + appending;
        }
        for (var i = 0; i < result.length; i++) {
            //var appending;
            var count;
            var location = result[i].DivisionDescription + "/<wbr>" + result[i].DistrictDescription + "/<wbr>" + result[i].SiteDescription;
            var HTSerialNumber = GetTranslatedValue("TagSerialLbl");
            var HTTagNumber = GetTranslatedValue("TagCountLbl");
            var HTPartDesc = GetTranslatedValue("TagPartDescLbl");
            var HTBarcodeID = GetTranslatedValue("TagBarcodeLabel");
            var HTCriticalDesc = GetTranslatedValue("TagCriticalDescLabel");
            
            // Create the contents for the WO list entry.
            //appending = '<li style="padding:0px;"><a id="' + result[i].WorkOrderNumber + '"  href="#"  onclick="javascript:navigateToWorkOrderDetailsPage(' + wo + ')" class="ui-link-inherit"><p class="ui-li-aside ui-li-desc"><strong>' + result[i].Status + '</strong></p>'
            appending = '<li><span>' + HTTagNumber + ': <strong>' + result[i].EquipTagNumber + '</strong></span><br />'
            + '<span style="font-size: 0.9em">' + result[i].InstalledDescription + '</span><br />';
            
            if (result[i].PODescription) {
                appending += '<span style="font-size: 0.8em">' + HTPartDesc + ': ' + result[i].PODescription + '</span><br />';
            }
            
            if (result[i].SerialNumber) {
                appending += '<span style="font-size: 0.9em;text-decoration:none">' + HTSerialNumber + ' : ' + result[i].SerialNumber + '</span><br />';
            }
            
            if (result[i].BarcodeID) {
                appending += '<span style="font-size: 0.8em">' + HTBarcodeID + ': ' + result[i].BarcodeID + '</span><br />';
            }
            
            var mfgModel;
            if (result[i].MfgName) {
                mfgModel = result[i].MfgName;
            }
            
            if (result[i].ManufacturerPartModel) {
                if (mfgModel) {
                    mfgModel += ' - ' + result[i].ManufacturerPartModel;
                } else {
                    mfgModel = result[i].ManufacturerPartModel;
                }
            }
            
            if (mfgModel) {
                appending += '<span style="font-size: 0.8em">' + mfgModel + '</span><br />';
            }
            
            if (result[i].CriticalDescription) {
                appending += '<span style="font-size: 0.8em">' + HTCriticalDesc + ': ' + result[i].CriticalDescription + '</span><br />';
            }
            
            appending += '<span style="font-size: 0.8em">' + location + '</span></li>';
            
            ultag.innerHTML = ultag.innerHTML + appending;
        }
        
        // Add the more button if there's more.
        var appending;
        
        if (result[0].TotalRecords > 6 * pageNum) {
            //appending = '<li style="padding:0px;"><a id="next" href="javascript:PrepareOrderHistory(' + (parseInt(localStorage.getItem("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-next"><span style="font-size: 0.9em">More</span></a></li>';
            appending = '<li data-enhanced="true" style="padding:0px" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-theme="c" class="ui-btn ui-btn-up-c ui-li-has-arrow ui-li ui-first-child">'
            + '<div data-enhanced="true" class="ui-btn-inner ui-li" style="padding:0px"><div data-enhanced="true" class="ui-btn-text">'
            + '<a data-enhanced="true" id="next" href="javascript:PrepareOrderHistory(' + (parseInt(localStorage.getItem("PageNumber")) + 1) + ');" class="ui-link-inherit jscroll-prev" style="text-align:center">'
            + '<span style="font-size: 0.9em" >Next</span></a></div></li>';
            ultag.innerHTML = ultag.innerHTML + appending;
            
        }
        $(listID).empty();
        $(listID).append(ultag);
        $(listID).trigger('create');
        
        if (noOrders) {
            $("#" + pageID).find(".noComponentsDiv").show();
        }
        
        $(listID).collapsibleset("refresh");
    } catch (ex) {
        $("#" + pageID).find(".noComponentsDiv").show();
    }
}
