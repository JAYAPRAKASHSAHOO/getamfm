/**
 * This is a declaration of an application wide object that will handle
 * initializing and handling of push notifications and other plugin related tasks.
 */
var iMFM = {
    // Constructor
    initialize: function () {
        this.bindEvents();
    },

    // Bind event listeners that are supposed to handle pushes.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('online', this.Online, false);
        document.addEventListener('offline', this.Offline, false);
    },
    Online: function() { navigator.Online = true; },        
    Offline: function() {  navigator.Online = false; },
    
    /**
     * This handles the deviceready event.
     * 
     * The scope of 'this' here will be the event. If using app.x calls, 
     * they will need to be made manually.
     */
    onDeviceReady: function() {    
        // Set up the barcode scanner here.
        //iMFM.scanner = cordova.require("com.phonegap.plugins.barcodescanner.BarcodeScanner");
        iMFM.scanner = cordova.require("phonegap-plugin-barcodescanner.BarcodeScanner");

        // Initialize the push notification instance
        iMFM.push = PushNotification.init({
            "android": {
                "senderID":"899478179670"
            },
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true,
                "categories":{
                    "invite": {
                        "yes": {
                            "callback": "app.accept",
                            "title": "Accept",
                            "foreground": true,
                            "destructive":false
                        }
                    }
                }
            },
            "windows": {}
        });
        
        iMFM.push.on('registration', function(data) {
            console.log("registration event:" + data.registrationId);
            // Do some data storage and/or submission to the database.
            var OldDeviceID = getLocal('RegistrationID');
            if (OldDeviceID !== data.registrationId) {
                setLocal('RegistrationID', data.registrationId);
            
                // Post registration ID to the database.
                var myJSONobject = iMFMJsonObject({
                    RegistrationID: getLocal('RegistrationID'),
                    OldRegistrationID: OldDeviceID});
                if (!IsStringNullOrEmpty(OldDeviceID)) {
                    updateRegistration(myJSONobject);
                }
            }
        });
        
        iMFM.push.on('error', function(e) {
            // Log the error.
            console.log("error : " + e.message);
        });
        
        iMFM.push.on('notification', function(data) {
            console.log('notification event');
                     
            handleNotification(data);
            console.log(data);
            console.log(getLocal("SessionID"));
                     
            iMFM.push.finish(function () {
                console.log('success call');
            }, function () {
                console.log('error occurred');
            });
        });
    },
    onResume: function () {
        cordova.getAppVersion.getPackageName(function (package) {
            setLocal("Module", package);
////            var myJSONobject = iMFMJsonObject({
////                                  Module: getLocal('Module'),
////                                  RegistrationID: getLocal('RegistrationID')});
                
            var Databasename = IsStringNullOrEmpty(getLocal("PlainDatabaseID")) ? decryptResponse(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");
        
            standardAddress = getLocal("URL_STANDARDADDRESS_STRING"); //$.constants.STANDARDADDRESS_STRING;
			standardAddress += $.constants.DB_STRING + Databasename + 'iMFM/'; 
            var accessURL = VerifyDatabaseID(standardAddress) + "Dashboard.ashx?methodname=GetBackgroundNotifications";
            
            var myJSONobject = {
                                  "Module": getLocal('Module'),
                                  "RegistrationID": getLocal('RegistrationID'),
                                  "DatabaseID": Databasename,
                                  "Application": getLocal("Module")
                                  };
//// Push notification not yet implemented and to avoid getting blank/internal server error pop up commenting the below code block,
////            if (navigator.onLine) {
////                // This transaction will set the DateViewed to clear the notification from the queue.
////                $.postJSON(accessURL, myJSONobject, function (data) {
////                    data.Table.forEach(function (entity) {
////                        var noteToStore = {};
////                        noteToStore.title = entity.Title;
////                        noteToStore.message = entity.AlertMessage;
////                        noteToStore.additionalData = JSON.parse(entity.AdditionalData);
////                        noteToStore.additionalData.notId = entity.Seq;
////                        noteToStore.additionalData.foreground = true;
////                                 
////                        handleNotification(noteToStore);
////                    });
////                });
////            } else {
////                GetCommonTranslatedValue('NoNetworkCommon');
////            }
        });
    },
    accept: function () {
        alert('Accepted');
    },
};

iMFM.initialize();
