/**
 * Update the clear button and/or clear the entire dashboard of notifications.
 * @param {Object} entity - The html button that is being pressed.
 */
function removeAllNotifications(entity) {
    if ($(entity).text() !== "Clear") {
        $(entity).text("Clear");
        $(entity).removeClass("ui-icon ui-icon-delete");
    } else {
        $(entity).text("");
        $(entity).addClass("ui-icon ui-icon-delete");
        $('#list').find('li[data-role!="list-divider"]').each(function() {
            var listitem = $(this);
            removeNotificationDashboardEntity(listitem)
            .done(function () {
                listitem.remove();
            });
        });
        
        $("#list").listview("refresh").find(".border-bottom").removeClass("border-bottom");
    }
}

/**
 * Intermediary handler for reconstructing a note and removing it from the dashboard.
 * @param {Object} listitem - The html entity that is used to reconstruct the notification.
 * @returns {Object} Deferred promise that contains the notification or error message.
 */
function removeNotificationDashboardEntity(listitem) {
    var data = {};
    var status = $.Deferred();
    data.title = listitem.find(".topic-header").text();
    data.message = listitem.find(".topic").text();
    data.additionalData = JSON.parse(listitem.find('#WorkOrderNumber').attr('data-payload'));
    
    removeNotification(data)
    .done(function(response) {
        status.resolve(response);
    })
    .fail( function(ex) {
        status.reject(ex);
    });
    
    return status.promise();
}

/**
 * Document an incoming Notification on the offline database.
 * @param {Object} note - The notification object that we are attempting to log.
 * @param {string} note.title - The title of the notification that we are storing.
 * @param {string} note.message - The body of the notification that we are storing.
 * @param {Object} note.additionalData - The object of payload details to perform an action related to the notification.
 * @param {integer} note.additionalData.notId - The identification number of the notification.
 * @returns {Object} Deferred promise that contains an error message if an error occurred.
 */
function logIncomingNotification(note) {
    var status = $.Deferred();
    openDB();
    if (note.additionalData.hasOwnProperty('foreground')) {
        delete note.additionalData.foreground;
    }
    
    dB.transaction(function (ts) {
                   var dbColumn = [];
                   dbColumn.push('NoteID');
                   dbColumn.push('Title');
                   dbColumn.push('Message');
                   dbColumn.push('AdditionalData');
                   
                   var dbValue = [];
                   dbValue.push(note.additionalData.notId);
                   dbValue.push(note.title);
                   dbValue.push(note.message);
                   dbValue.push(JSON.stringify(note.additionalData));
                   
                   var insertQuery = '';
                   insertQuery = 'INSERT INTO NotificationTable (' + dbColumn + ') VALUES (?,?,?,?)';
                   ts.executeSql(insertQuery, dbValue, function () {
                                     status.resolve();
                                 },
                                 function (ts, error) {
                                     console.log(note.additionalData.notId + ":" + error.message);
                                     status.reject(error);
                                 });
                   });
    
    return status.promise();
}

/**
 * Intermediary handler for the Notification Dashboard to reconstruct the notification object prior to processing.
 * @param {Object} note - The html entity with which we will be attempting to construct a notification out of.
 */
function handleNotificationFromDashboard(note) {
    var data = {};
    data.title = $(note).find(".topic-header").first().text();
    data.message = $(note).find(".topic").first().text();
    data.additionalData = JSON.parse($(note).attr('data-payload'));
    
    handleNotification(data);
}

/**
 * Handle the processing of a selected notification.
 * @param {Object} notification - The notification that is being processed.
 * @param {Object} notification.additionalData - The handling information for the notification.
 */
function handleNotification(notification) {
    if (!notification.additionalData.foreground) {
        // Handle any notifications that need to be processed regardless of session state.
        if (notification.additionalData.Action && notification.additionalData.Action == "AppUpdate"){
            cordova.getAppVersion.getPackageName(function (package) {
                setLocal("Module", package);
                if (package.indexOf("amfm") > 0) {
                    window.open("market://details?id=com.mainstreamsasp.amfm", "_system");
                } else {
                    window.open("itms-apps://itunes.apple.com/app/iMFM/id710472063", "_system");
                }
                                                 
                removeNotification(notification);
            });
        }
        
        if (!IsStringNullOrEmpty(getLocal("SessionID")) && $.mobile.activePage.attr('id') !== 'Login') {
            switch(notification.additionalData.Action) {
                case "ViewWorkOrder":
                    if (!IsStringNullOrEmpty(notification.additionalData.WorkOrderNumber)) {
                        setLocal("WorkOrderNumber", notification.additionalData.WorkOrderNumber);
                        //$.mobile.changePage("WorkOrderDetails.html", {allowSamePageTransition: true, reloadPage: true});
                        //if ($.mobile.activePage == "WODetailsPage") {
                        //    $("#WODetailsPage").trigger("pagecreate");
                        //} else {
                        if ($.mobile.activePage.attr('id') != "DashBoard") {
                            $.mobile.changePage("Dashboard.html");
                        }
                        
                        $.mobile.changePage("WorkOrderDetails.html", {allowSamePageTransition: true});
                        //   }
                    }
                    break;
                default:
                    break;
            }
            
            removeNotification(notification);
        }
    } else {
        console.log("foreground");
        // Insert into table for logging.
        logIncomingNotification(notification)
        .done( function () {
            if ($.mobile.activePage.attr('id') == "DashBoard") {
                createNotification(notification.title, notification.message, notification.additionalData);
            }
        });
    }
}

/**
 * Retrieve the notifications from the database and process them.
 */
function getLocalNotifications() {
    var query = "SELECT Title, Message, AdditionalData FROM NotificationTable"
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, [], function (ts, result) {
            console.log(result);
            $("#list").find("li:gt(0)").remove();
            for (var i = 0; i < result.rows.length; i++) {
                // Process each note from the table.
                var row = result.rows.item(i);
                createNotification(row.Title, row.Message, row.AdditionalData);
            }
        });
    });
}

/**
 * Remove the notification from the offline database.
 * @param {Object} notification - The notification that we are removing from the database.
 * @param {integer} notification.additionalData.notId - The notification id for the note we are updating.
 * @returns {Object} Deferred promise that contains either the notification we removed or an error message.
 */
function removeNotification(notification) {
    var status = $.Deferred();
    var query = "DELETE FROM NotificationTable WHERE NoteID = ?"
    openDB();
    dB.transaction(function (ts) {
        ts.executeSql(query, [notification.additionalData.notId], function (ts) {
            console.log("Removed Note # " + notification.additionalData.notId);
            updateNotificationDates(notification)
            .done(function() {
                status.resolve(notification);
            })
            .fail(function(ex) {
                status.reject(ex);
            });
        }, function (ts) {
            status.reject(ts);
        });
    });
    
    return status.promise();
}

/** 
 * This function will update the notification date, either DateProcessed or DateViewed, dependent on the 
 * current status of the notification.
 * @param {Object} data - the payload of the notification.
 * @param {integer} data.additionalData.notId - The identification number of the notification that we are updating.
 * @returns {Object} deferred promise that will contain either the notification itself, or an error message.
 */
function updateNotificationDates(data) {
    var status = $.Deferred();
    var myJSONobject = iMFMJsonObject({
        "Username": decryptStr(getLocal("Username")),
        "NoteID": data.additionalData.notId
    });

    var accessURL = VerifyDatabaseID(standardAddress) + "Dashboard.ashx?methodname=UpdateNotification";
    
    if (navigator.onLine) {
        // This transaction will set the DateViewed to clear the notification from the queue.
        $.postJSON(accessURL, myJSONobject, function (data) {
            status.resolve(data);
        });
    } else {
        status.reject(GetCommonTranslatedValue('NoNetworkCommon'));
    }
    
    return status.promise();
}

/**
 * This function creates an html entity to append to the Notification panel and refresh the panel afterwards.
 * @param {string} title - The title of the notification.
 * @param {string} message - The body of the notification message.
 * @param {string|Object} payload - The payload of the notification used to enable processing related to the note.
 */
function createNotification(title, message, payload) {
    var entity = document.createElement('li');
    
    if (!title) {
        title = "";
    }
    
    if (!message) {
        message = "no message";
    }
    
    if (!payload) {
        payload = "";
    }
    
    if (typeof payload === "object") {
        payload = JSON.stringify(payload);
    }
    
    var html = $.constants.NOTIFICATIONHTML.replace("[PAYLOAD]",payload).replace("[MESSAGE]", message).replace("[TITLE]", title);
        
    entity.innerHTML = entity.innerHTML + html;
    $("#list").append(entity);
    
    $("#list").listview("refresh");
}

$( document ).on( "pagecreate", "#DashBoard", function() {
    // Swipe to remove list item
    $( document ).on( "swipeleft swiperight", "#list li", function( event ) {
        var listitem = $( this ),
        // These are the classnames used for the CSS transition
        dir = event.type === "swipeleft" ? "left" : "right",
        // Check if the browser supports the transform (3D) CSS transition
        transition = $.support.cssTransform3d ? dir : false;
        deleteAndEnableUndo( listitem, transition );
    });
    
    // If it's not a touch device...
    if ( ! $.mobile.support.touch ) {
        // Remove the class that is used to hide the delete button on touch devices
        $( "#list" ).removeClass( "touch" );
        // Click delete split-button to remove list item
        $( ".delete" ).on( "click", function() {
            var listitem = $( this ).parent( "li" );
            deleteAndEnableUndo( listitem );
        });
    }
     
});

/**
 * This method handles the delete of a notification entity and the associated database entry.
 * It will also enable the ability to undo the deletion.
 * @param {Object} listitem - The html entity & associated database item which we are removing.
 * @param {boolean} transition - Whether the device supports transform transitions, if not we have to handle this without.
 */
function deleteAndEnableUndo(listitem, transition) {
    if (transition) {
        listitem
        .addClass(transition)
        .on("webkitTransitionEnd transitionend otransitionend", function () {
            
            if (!IsObjectNullOrUndefined(listitem.find(".topic-header").attr('data-deleted-content'))) {
                listitem.remove();
                $("#list").listview("refresh").find(".border-bottom").removeClass("border-bottom");
            } else {
                removeNotificationDashboardEntity(listitem)
                .done(function (data) {
                    // Hide the data in case we need to undo the delete.
                    listitem.find('.topic-header').attr('data-deleted-content', data.title);
                    listitem.find('.topic').attr('data-deleted-content', data.message);
                    listitem.find('#WorkOrderNumber').attr('data-deleted-content', JSON.stringify(data.additionalData));
                    
                    // Update the list item and add the undo action.
                    listitem.find(".topic-header").text("Removed");
                    listitem.find(".topic").text("Swipe to remove this or click the button to undo.");
                    listitem.find("a.delete").show();
                    listitem.find("a.delete .ui-icon").toggleClass("ui-icon-delete ui-icon-refresh");
                    $("#list").listview("refresh");
                    listitem.removeClass(transition);
                    listitem.find("a.delete").on("click", function () {
                        var data = {};
                        data.title = listitem.find('.topic-header').attr('data-deleted-content');
                        data.message = listitem.find('.topic').attr('data-deleted-content');
                        data.additionalData = JSON.parse(listitem.find('#WorkOrderNumber').attr('data-deleted-content'));
                         
                        logIncomingNotification(data)
                        .done(function() {
                            listitem.find(".topic-header").text(data.title);
                            listitem.find(".topic").text(data.message);
                            listitem.find("#WorkOrderNumber").attr('data-payload', JSON.stringify(data.additionalData));
                            listitem.find('.topic-header').removeAttr('data-deleted-content');
                            listitem.find('.topic').removeAttr('data-deleted-content');
                            listitem.find('#WorkOrderNumber').removeAttr('data-deleted-content');
                            listitem.find("a.delete").hide();
                            listitem.find("a.delete .ui-icon").toggleClass("ui-icon-delete ui-icon-refresh");
                            $("#list").listview("refresh");
                            listitem.off("webkitTransitionEnd transitionend otransitionend");
                        });
                    });
                });
            }
        })
        .prev("li").children("a").addClass("border-bottom")
        .end().end().children(".ui-button").removeClass("ui-button-active");
    }
    else {
        if (!IsObjectNullOrUndefined(listitem.find(".topic-header").attr('data-deleted-content'))) {
            listitem.remove();
            $("#list").listview("refresh").find(".border-bottom").removeClass("border-bottom");
        } else {
            removeNotificationDashboardEntity(listitem)
            .done(function (data) {
                // Hide the data in case we need to undo the delete.
                listitem.find('.topic-header').attr('data-deleted-content', data.title);
                listitem.find('.topic').attr('data-deleted-content', data.message);
                listitem.find('#WorkOrderNumber').attr('data-deleted-content', JSON.stringify(data.additionalData));

                // Update the list item and add the undo action.
                listitem.find(".topic-header").text("Removed");
                listitem.find(".topic").text("Swipe to remove this or click the button to undo.");
                listitem.find("a.delete").show();
                listitem.find("a.delete .ui-icon").toggleClass("ui-icon-delete ui-icon-refresh");
                $("#list").listview("refresh");
 
                // This is the undo action handler.
                listitem.find("a.delete").on("click", function () {
                    var data = {};
                    data.title = listitem.find('.topic-header').attr('data-deleted-content');
                    data.message = listitem.find('.topic').attr('data-deleted-content');
                    data.additionalData = JSON.parse(listitem.find('#WorkOrderNumber').attr('data-deleted-content'));

                    logIncomingNotification(data)
                    .done(function() {
                        listitem.find(".topic-header").text(data.title);
                        listitem.find(".topic").text(data.message);
                        listitem.find("#WorkOrderNumber").attr('data-payload', JSON.stringify(data.additionalData));
                        listitem.find('.topic-header').removeAttr('data-deleted-content');
                        listitem.find('.topic').removeAttr('data-deleted-content');
                        listitem.find('#WorkOrderNumber').removeAttr('data-deleted-content');
                        listitem.find("a.delete").hide();
                        listitem.find("a.delete .ui-icon").toggleClass("ui-icon-delete ui-icon-refresh");
                        $("#list").listview("refresh");
                    });
                });
            });
        }
    }
}

/**
 * This method will update a user's registration information for push notifications.
 * @param {Object} jsonObject - This is a json object of the user's credentials to update.
 * @returns {Object} deferred promise that contains the status of the transaction.
 */
function updateRegistration(jsonObject) {
    // Create the database string and perform the ajax call.
    var status = $.Deferred();
    var accessURL = VerifyDatabaseID(standardAddress) + "LoginAuthentication.ashx?methodname=UpdatePushUser";
    
    if (navigator.onLine) {
        // This transaction will set the DateViewed to clear the notification from the queue.
        $.postJSON(accessURL, myJSONobject, function (data) {
                   status.resolve(data);
                   });
    } else {
        status.reject(GetCommonTranslatedValue('NoNetworkCommon'));
    }
    
    return status.promise();
}

