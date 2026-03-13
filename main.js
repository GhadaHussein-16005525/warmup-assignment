const { time } = require("console");
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
    let dateParts = date.split("-");
    let year = parseInt(dateParts[0]);
    let month = parseInt(dateParts[1]);
    let day = parseInt(dateParts[2]);
    timeParts = activeTime.split(":");
    let activeHours = parseInt(timeParts[0]);
    let activeMinutes = parseInt(timeParts[1]);
    // During special period (Eid), quota is 6 hours
    if(month === 4 && (day >= 10 && day <= 30)){
        if(activeHours >= 6) return true;
    }
    // If the hour is 8, minutes is at least 24
    else if(activeHours === 8){
        if(activeMinutes >= 24) return true;
    }
    // If the hour is more than 8, quota is always met
    else if(activeHours > 8){
        return true;
    }
    return false;
}

// ============================================================
// Function 5: addShiftRecord(textFile, shiftObj)
// textFile: (typeof string) path to shifts text file
// shiftObj: (typeof object) has driverID, driverName, date, startTime, endTime
// Returns: object with 10 properties or empty object {}
// ============================================================
function addShiftRecord(textFile, shiftObj) {
    let fileData = fs.readFileSync(textFile, 'utf8').split("\n");
    //remove last empty line if exists
    if(fileData[fileData.length-1].trim() === ""){
        fileData.pop();
    }
    //check for duplicates
    for(let i=0; i<fileData.length; i++){
        let fields = fileData[i].split(",");
        if(fields[0] === shiftObj.driverID && fields[2] === shiftObj.date){
            return {};
        }
    }
    //add new record to file
    //Calculate required values
    let shiftDuration = getShiftDuration(shiftObj.startTime, shiftObj.endTime);
    let idleTime = getIdleTime(shiftObj.startTime, shiftObj.endTime);
    let activeTime = getActiveTime(shiftDuration, idleTime);
    let metQuotaVal = metQuota(shiftObj.date, activeTime);
    //default bonus is false
    let hasBonus = false;
    let newShift = {
        driverID: shiftObj.driverID,
        driverName: shiftObj.driverName,
        date: shiftObj.date,
        startTime: shiftObj.startTime,
        endTime: shiftObj.endTime,
        shiftDuration: shiftDuration,
        idleTime: idleTime,
        activeTime: activeTime,
        metQuota: metQuotaVal,
        hasBonus: hasBonus
    };
    // Append new line to file
    let newLine = `${newShift.driverID},${newShift.driverName},${newShift.date},${newShift.startTime},${newShift.endTime},${newShift.shiftDuration},${newShift.idleTime},${newShift.activeTime},${newShift.metQuota},${newShift.hasBonus}\n`;
    fs.appendFileSync(textFile, newLine, 'utf8');
    return newShift;
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
    let fileData = fs.readFileSync(textFile, 'utf8').split("\n");
    //remove last empty line if exists
    if(fileData[fileData.length-1].trim() === ""){ 
        fileData.pop();
    }
    //check the driverID and date to find the line to update
    for(let i=0; i<fileData.length; i++){
        let fields = fileData[i].split(",");
        if(fields[0] === driverID && fields[2] === date){
            fields[9] = newValue;
            //update the line
            fileData[i] = fields.join(",");
            //write back to file
            fs.writeFileSync(textFile, fileData.join("\n"), 'utf8');
        }
    }
}

// ============================================================
// Function 7: countBonusPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof string) formatted as mm or m
// Returns: number (-1 if driverID not found)
// ============================================================
function countBonusPerMonth(textFile, driverID, month) {
    let fileData = fs.readFileSync(textFile, 'utf8').split("\n");
    //remove last empty line if exists
    if(fileData[fileData.length-1].trim() === ""){
        fileData.pop();
    }
    let count = 0;
    //boolean to check driverID existence
    let driverExists = false;
    for(let i=0; i<fileData.length; i++){
        let fields = fileData[i].split(",");
        if(fields[0] === driverID){
            driverExists = true;
            // Extract month from date
            let dateParts = fields[2].split("-");
            let recordMonth = dateParts[1];
            if(recordMonth === month || (month.length === 1 && recordMonth === "0"+month)){
                if(fields[9].trim() === "true"){
                    count++;
                }
            }
        }
    }
    if(!driverExists){
        return -1;
    }
    return count;
}

// ============================================================
// Function 8: getTotalActiveHoursPerMonth(textFile, driverID, month)
// textFile: (typeof string) path to shifts text file
// driverID: (typeof string)
// month: (typeof number)
// Returns: string formatted as hhh:mm:ss
// ============================================================
function getTotalActiveHoursPerMonth(textFile, driverID, month) {
    let fileData = fs.readFileSync(textFile, 'utf8').split("\n");
    //remove last empty line if exists
    if(fileData[fileData.length-1].trim() === ""){
        fileData.pop();
    }
    let totalActiveSeconds = 0;
    let driverExists = false;
    for(let i=0; i<fileData.length; i++){
        let fields = fileData[i].split(",");
        if(fields[0] === driverID){
            driverExists = true;
            let dateParts = fields[2].split("-");
            let recordMonth = parseInt(dateParts[1]);
            //check if month matches, add active time to total
            if(recordMonth === month || (month.length === 1 && recordMonth === "0"+month)){
                let activeTimeParts = fields[7].split(":");
                let activeHours = parseInt(activeTimeParts[0]);
                let activeMinutes = parseInt(activeTimeParts[1]);
                let activeSeconds = parseInt(activeTimeParts[2]);
                totalActiveSeconds += (activeHours*3600) + (activeMinutes*60) + activeSeconds;
            }
        }
    }
    if(!driverExists){
        return -1;
    }
    // Converting back to h:mm:ss format
    let hours = Math.floor(totalActiveSeconds / 3600);
    let minutes = Math.floor((totalActiveSeconds % 3600) / 60);
    let seconds = totalActiveSeconds % 60;
    if(minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    return hours + ":" + minutes + ":" + seconds;
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
    let fileData = fs.readFileSync(textFile, 'utf8').split("\n");
    if(fileData[fileData.length-1].trim() === ""){
        fileData.pop();
    }
    let rateData = fs.readFileSync(rateFile, 'utf8').split("\n");
    if(rateData[rateData.length-1].trim() === ""){
        rateData.pop();
    }
    //excluding the day offs
    let dayOff = "";
    for(let i = 0; i < rateData.length; i++){
        let fields = rateData[i].split(",");
        if(fields[0] === driverID){
            dayOff = fields[1];
            break;
        }
    }
    let totalRequiredSeconds = 0;
    let driverExists = false;
    for(let i=0; i<fileData.length; i++){
        let fields = fileData[i].split(",");
        if(fields[0] === driverID){
            driverExists = true;
            //get the month and day
            let dateParts = fields[2].split("-");
            let recordMonth = parseInt(dateParts[1]);
            let recordDay = parseInt(dateParts[2]);
            //get the active seconds
            let activeParts = fields[7].split(":");
            let activeSeconds =
            (parseInt(activeParts[0])*3600)+
            (parseInt(activeParts[1])*60)+
            parseInt(activeParts[2]);
            if(recordMonth === month || (month.length === 1 && recordMonth === "0"+month)){
                //if the day is the day off, required hours is 0
                if(recordDay.toString() === dayOff){
                    continue;
                }
                let dailyQuotaSeconds;

                if(recordMonth === 4 && recordDay >= 10 && recordDay <= 30){
                    dailyQuotaSeconds = 6 * 3600; // Eid quota
                }
                else{
                    dailyQuotaSeconds = (8 * 3600) + (24 * 60); // normal quota (8:24)
                }

                totalRequiredSeconds += dailyQuotaSeconds;
            }
        }
    }
    if(!driverExists){
        return -1;
    }
    // apply bonus reduction
    totalRequiredSeconds -= bonusCount * 2 * 3600;

    if(totalRequiredSeconds < 0){
        totalRequiredSeconds = 0;
    }
    // Converting back to h:mm:ss format
    let hours = Math.floor(totalRequiredSeconds / 3600);
    let minutes = Math.floor((totalRequiredSeconds % 3600) / 60);
    let seconds = totalRequiredSeconds % 60;
    if(minutes < 10){minutes = "0"+minutes;}
    if(seconds < 10){seconds = "0"+seconds;}
    return hours + ":" + minutes + ":" + seconds;
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
    let rateData = fs.readFileSync(rateFile, 'utf8').split("\n");
    if(rateData[rateData.length-1].trim() === ""){
        rateData.pop();
    }
    let basePay = 0;
    let tier = 0;
    for(let i = 0; i < rateData.length; i++){
        let fields = rateData[i].split(",");
        if(fields[0] === driverID){
            basePay = parseInt(fields[2]);
            tier = parseInt(fields[3]);
            break;
        }
    }
    // Convert actualHours and requiredHours to seconds
    function timeToSeconds(time){
        let parts = time.split(":");
        return parseInt(parts[0])*3600 + parseInt(parts[1])*60 + parseInt(parts[2]);
    }
    let actualSeconds = timeToSeconds(actualHours);
    let requiredSeconds = timeToSeconds(requiredHours);
    //return base pay if actual hours meet or exceed required hours
    if(actualSeconds >= requiredSeconds){
        return basePay;
    }
    //calculate deduction if actual hours are less than required hours
    let missingSeconds = requiredSeconds - actualSeconds;
    let missingHours = missingSeconds / 3600;
    let allowed = 0;
    if(tier === 1){allowed = 50;}
    else if(tier === 2){allowed = 20;}
    else if(tier === 3){allowed = 10;}
    else {allowed = 3;}
    //billable missing hours is the missing hours that exceed the allowed hours
    let billableMissingHours = missingHours - allowed;
    if(billableMissingHours < 0){
        billableMissingHours = 0;
    }
    //round down billable missing hours to nearest whole number
    billableMissingHours = Math.floor(billableMissingHours);
    let deductionRatePerHour = Math.floor(basePay / 185);
    let salaryDeduction = billableMissingHours * deductionRatePerHour;
    return basePay - salaryDeduction;
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
