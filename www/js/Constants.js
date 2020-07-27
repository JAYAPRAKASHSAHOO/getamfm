$.constants = {};

// Constant for identifying the host of the backend services.
//$.constants.STANDARDADDRESS_STRING = "http://localhost:49501/";
$.constants.STANDARDADDRESS_STRING = "https://tst.mainstreamsasp.com/";
//$.constants.STANDARDADDRESS_STRING = "https://icrs.mainstreamsasp.com/";

// Local
//$.constants.SETTINGS_STRING = "http://localhost:49501/";
//Production
//$.constants.SETTINGS_STRING = "https://icrs.mainstreamsasp.com/";
//UAT
$.constants.SETTINGS_STRING = "https://tst.mainstreamsasp.com/";

// Identifies the database/platform that iMFM connects to.
//$.constants.DB_STRING = "TST00";
// For UAT
$.constants.DB_STRING = "UAT00";
// For Prodction
//$.constants.DB_STRING = "MOB00";

// Identifies the expected origin for all ajax calls.
const ORIGIN_HEADER = "tst.mainstreamsasp.com";

// Constant for identifying the Demand order screen on initial load
$.constants.DEMANDORDERS = "DemandOrders";

// Constant for identifying the Intelligent dispatch order screen on initial load
$.constants.INTDISPORDERS = "IntDispOrders";

// Constant for identifying the Past due order screen on initial load
$.constants.PASTDUEORDERS = "PastDueorder";

// Constant for identifying the PM order screen on initial load
$.constants.PMORDERS = "PMOrders";
// HTML structure for the contents of the Notification Panel.
$.constants.NOTIFICATIONHTML = "" +
    "<a id='WorkOrderNumber'  href=\"#\" data-payload='[PAYLOAD]' onclick=\"javascript:handleNotificationFromDashboard(this)\">" +
    "<span class=\"topic-header\" style=\"font-size: 0.9em\">[TITLE]</span><br />" +
    "<span class=\"topic\" style=\"font-size: 0.7em\">[MESSAGE]</span>" +
    "</a>" +
    "<a id=\"Delete\" class=\"delete\" href=\"#\" ></a>" +
    "";

// Freeze the object to make the values within immutable
Object.freeze($.constants);
