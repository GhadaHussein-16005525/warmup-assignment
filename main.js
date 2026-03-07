const fs = require("fs");

// ============================================================
// Function 1: getShiftDuration(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getShiftDuration(startTime, endTime) {
    //splitting the time and am/pm parts
    let partsStart = startTime.split(" ");
    let timeStart = partsStart[0].split(":");
    let partsEnd = endTime.split(" ");
    let timeEnd = partsEnd[0].split(":");

    let hoursStart = parseInt(timeStart[0]);
    let minutesStart = parseInt(timeStart[1]);
    let secondsStart = parseInt(timeStart[2]);
    let hoursEnd = parseInt(timeEnd[0]);
    let minutesEnd = parseInt(timeEnd[1]);
    let secondsEnd = parseInt(timeEnd[2]);
    //converting to 24h format
    if (partsStart[1] === "pm" && hoursStart !== 12) {
        hoursStart += 12;
    } else if (partsStart[1] === "am" && hoursStart === 12) {
        hoursStart = 0;
    }
    if (partsEnd[1] === "pm" && hoursEnd !== 12) {
        hoursEnd += 12;
    } else if (partsEnd[1] === "am" && hoursEnd === 12) {
        hoursEnd = 0;
    }
    //calculating duration
    let startInSeconds = (hoursStart*3600) + (minutesStart*60) + secondsStart;
    let endInSeconds = (hoursEnd*3600) + (minutesEnd*60) + secondsEnd;
    let duration = endInSeconds - startInSeconds;
    if (duration < 0) { // it means shift went past midnight
        duration += 24 * 3600;
    }
    //converting back to h:mm:ss format
    let hours = Math.floor(duration / 3600);
    let minutes = Math.floor((duration % 3600) / 60);
    let seconds = duration % 60;
    if(minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    return hours+":"+minutes+":"+seconds;
}

// ============================================================
// Function 2: getIdleTime(startTime, endTime)
// startTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// endTime: (typeof string) formatted as hh:mm:ss am or hh:mm:ss pm
// Returns: string formatted as h:mm:ss
// ============================================================
function getIdleTime(startTime, endTime) {
    //splitting the time and am/pm parts
    let partsStart = startTime.split(" ");
    let timeStart = partsStart[0].split(":");
    let partsEnd = endTime.split(" ");
    let timeEnd = partsEnd[0].split(":");

    let hoursStart = parseInt(timeStart[0]);
    let minutesStart = parseInt(timeStart[1]);
    let secondsStart = parseInt(timeStart[2]);
    let hoursEnd = parseInt(timeEnd[0]);
    let minutesEnd = parseInt(timeEnd[1]);
    let secondsEnd = parseInt(timeEnd[2]);
    //Calculating idle time
    let idleDuration = 0;
    // Calculate idle time for the period before 8:00 AM
    if(partsStart[1]==="am" && hoursStart < 8){
        let idleStartInSeconds = (hoursStart*3600) + (minutesStart*60) + secondsStart;
        let idleEndInSeconds = (8*3600);
        idleDuration += idleEndInSeconds - idleStartInSeconds;
    }
    // Calculate idle time for the period after 10:00 PM
    if(partsEnd[1]==="pm" && hoursEnd > 10){
        let idleStartInSeconds = (10*3600);
        let idleEndInSeconds = (hoursEnd*3600) + (minutesEnd*60) + secondsEnd;
        idleDuration += idleEndInSeconds - idleStartInSeconds;
    }
    //converting back to h:mm:ss format
    let hours = Math.floor(idleDuration / 3600);
    let minutes = Math.floor((idleDuration % 3600) / 60);
    let seconds = idleDuration % 60;
    if(minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    return hours+":"+minutes+":"+seconds;
}

// ============================================================
// Function 3: getActiveTime(shiftDuration, idleTime)
// shiftDuration: (typeof string) formatted as h:mm:ss
// idleTime: (typeof string) formatted as h:mm:ss
// Returns: string formatted as h:mm:ss
// ============================================================
function getActiveTime(shiftDuration, idleTime) {
    let shiftParts = shiftDuration.split(":");
    let idleParts = idleTime.split(":");

    let shiftHours = parseInt(shiftParts[0]);
    let shiftMinutes = parseInt(shiftParts[1]);
    let shiftSeconds = parseInt(shiftParts[2]);
    let idleHours = parseInt(idleParts[0]);
    let idleMinutes = parseInt(idleParts[1]);
    let idleSeconds = parseInt(idleParts[2]);
    //Case idle time is 0
    if(idleSeconds === 0 && idleMinutes === 0 && idleHours === 0){
        return shiftDuration;
    }
    //Calculating active time
    let shiftInSeconds = (shiftHours*3600) + (shiftMinutes*60) + shiftSeconds;
    let idleInSeconds = (idleHours*3600) + (idleMinutes*60) + idleSeconds;
    let activeDuration = shiftInSeconds - idleInSeconds;
    // Converting back to h:mm:ss format
    let hours = Math.floor(activeDuration / 3600);
    let minutes = Math.floor((activeDuration % 3600) / 60);
    let seconds = activeDuration % 60;
    if(minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    return hours+":"+minutes+":"+seconds;
}

// ============================================================
// Function 4: metQuota(date, activeTime)
// date: (typeof string) formatted as yyyy-mm-dd
// activeTime: (typeof string) formatted as h:mm:ss
// Returns: boolean
// ============================================================
function metQuota(date, activeTime) {
    // TODO: Implement this function
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    // TODO: Implement this function
}

// ============================================================
// Function 6: setBonus(textFile, driverID, date, newValue)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// date: (typeof string) formatted as yyyy-mm-dd
// newValue: (typeof boolean)
// Returns: nothing (void)
// ============================================================
function setBonus(textFile, driverID, date, newValue) {
    // TODO: Implement this function
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 9: getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month)
// textFile: (typeof string) path to shifts text file
// rateFile: (typeof string) path to driver rates text file
// bonusCount: (typeof number) total bonuses for given driver per month
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getRequiredHoursPerMonth(textFile, rateFile, bonusCount, driverID, month) {
    // TODO: Implement this function
}

// ============================================================
// Function 10: getNetPay(driverID, actualHours, requiredHours, rateFile)
// driverID: (typeof string)
// actualHours: (typeof string) formatted as hhh:mm:ss
// requiredHours: (typeof string) formatted as hhh:mm:ss
// rateFile: (typeof string) path to driver rates text file
// Returns: integer (net pay)
// ============================================================
function getNetPay(driverID, actualHours, requiredHours, rateFile) {
    // TODO: Implement this function
}

module.exports = {
    getShiftDuration,
    getIdleTime,
    getActiveTime,
    metQuota,
    addShiftRecord,
    setBonus,
    countBonusPerMonth,
    getTotalActiveHoursPerMonth,
    getRequiredHoursPerMonth,
    getNetPay
};
