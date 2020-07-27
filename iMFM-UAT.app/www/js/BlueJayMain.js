//$.bluejay = {};
////$.bluejay.scrubjay = device.uuid;
//document.addEventListener("deviceready", onBluejayReady, false);
//function onBluejayReady() {
//    $.bluejay.scrubjay = device.uuid;
//}

$.bluejay = {};
$.bluejay.scrubjay = '8080808080808080'; //device.uuid;

//****************** Function to Decrypt and Encrypt values *******************************//
function decryptStr(encryptVal) {
    if (getLocal('magpiejay') != null && getLocal('magpiejay').toLowerCase() === 'true') {
        if (!IsStringNullOrEmpty(encryptVal)) {

            if (!$.bluejay.scrubjay) {
                setTimeout(function () {
                    decryptStr(encryptVal);
                }, 1000);
            } else {
                return CryptoJS.AES.decrypt(encryptVal, $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Utf8);
            }
        }
        else {
            return "";
        }
    }
    else {
        return encryptVal;
    }
}

function decryptResponse(encryptVal) {
    try {
        var decrypted = CryptoJS.AES.decrypt(encryptVal, $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Utf8);
        if (!IsStringNullOrEmpty(decrypted)) {
            return decrypted;
        }
        else {
            return encryptVal;
        }
    }
    catch (ex) {
        return encryptVal;
    }
}

function encryptStr(plainValue) {
    try {
        if (getLocal('magpiejay').toLowerCase() === 'true') {
            if (!IsStringNullOrEmpty(plainValue)) {
                if (!isNaN(plainValue)) {
                    return CryptoJS.AES.encrypt(String(plainValue), $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8));
                }
                else {
                    return CryptoJS.AES.encrypt(plainValue, $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8));
                }
            }
            else {
                return "";
            }
        } else {
            return plainValue;
        }
    } catch (ex) {
        return plainValue;
    }
}

function encryptResponse(plainValue) {
    if (!IsStringNullOrEmpty(plainValue)) {
        if (!isNaN(plainValue)) {
            return CryptoJS.AES.encrypt(String(plainValue), $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8));
        }
        else {
            return CryptoJS.AES.encrypt(plainValue, $.bluejay.scrubjay.toString(CryptoJS.enc.Utf8));
        }
    }
    else {
        return "";
    }
}

function getEncryptedValue(plainText) {

    var key = CryptoJS.enc.Utf8.parse($.bluejay.scrubjay);
    var iv = CryptoJS.enc.Utf8.parse($.bluejay.scrubjay);

    var encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), key,
                {
                    keySize: 128 / 8,
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
    return encryptedlogin;
}

/*
To generate AES key for updating security questions.
*/
function EncryptKey() {
    var databaseName = decryptStr(getLocal("DatabaseName"));
    var employeeNumber = GetEmployeeNumber();
    var databaseId = decryptStr(getLocal("DatabaseID"));

    databaseName = gnirtsesrever(databaseName);
    employeeNumber = gnirtsesrever(employeeNumber);
    databaseId = gnirtsesrever(databaseId);

    key = databaseName + employeeNumber + databaseId;
    return key;
}

function gnirtsesrever(str) {
    return str.split("").reverse().join("");
}

////SR: BlueJaySesssion used for encryptioning of session id
function BlueJaySesssion() {

    var employeeNumber = isNaN(getLocal("EmployeeNumber")) ? GetEmployeeNumber() : getLocal("EmployeeNumber");
    var databaseId = isNaN(getLocal("DatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("DatabaseID");

    employeeNumber = gnirtsesrever(employeeNumber);
    databaseId = gnirtsesrever(databaseId);

    key = databaseId + employeeNumber + databaseId;
    return key;
}

/*
To generate AES key for SSO user.
*/
function EncryptKeyForSSO() {
    var databaseID = decryptStr(getLocal("DatabaseID")) ? decryptStr(getLocal("DatabaseID")) : getLocal("PlainDatabaseID");

    databaseID = gnirtsesrever(databaseID);
    key = databaseID + databaseID + databaseID;
    return key;
}
