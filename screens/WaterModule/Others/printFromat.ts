import { UserType } from '../../WaterModule/Others/types'

export const printFormat = ( user: UserType, headers) => {
    const newMeterNo = user.meterno ? user.meterno.substring(0, user.meterno.indexOf(':')) : null;
    const { header1, header2, header3 } = headers;
    const newName = user.acctname.replace(/ñ/gi, (match) => {
        return match === 'ñ' ? 'n' : 'N';
    });
    const newLoc = user.location.replace(/\n/g, '').replace(/  +/g, ' ');

    function formatDate(inputDate) {
        // Parse the input date string
        const dateObj = new Date(inputDate);
    
        // Array of month names
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    
        // Extract components of the date
        const year = dateObj.getFullYear();
        const monthIndex = dateObj.getMonth();
        const day = dateObj.getDate();
    
        // Format the date as "MONTH day, year"
        const formattedDate = monthNames[monthIndex].toUpperCase() + ' ' + day + ', ' + year;
        
        return formattedDate;
    }

    const newBillDate = formatDate(user.billdate)
    const newFromDate = formatDate(user.fromdate)
    const newToDate = formatDate(user.todate)

    return (
        (header1 !== "" ? `[C]<font size='normal'>${header1}</font>\n`: "") +
        (header2 !== "" ? `[C]<font size='normal'>${header2}</font>\n`: "") +
        (header3 !== "" ? `[C]<font size='normal'>${header3}</font>\n`: "") +
        `[L]<font size='normal'>${user.acctno}</font>\n`+
        `[L]<font size='normal'>${newName}</font>\n` +
        `[L]<font size='normal'>${newLoc}</font>\n`+
        `[L]<font size='normal'>${user.acctgroup}</font>\n`+
        `[L]<font size='normal'>${user.classification}</font>\n`+
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[C]<b><font size='big'>BILLING NOTICE</font></b>\n` +
        `[C]<font size='normal'>${newBillDate}</font>\n` +
        `[L]\n` +
        `[C]<font size='normal'>${newFromDate} to ${newToDate}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Meter No: ${user.brand} / ${newMeterNo}</font>\n` +
        `[L]<font size='normal'>Capacity: ${user.capacity}</font>\n` +
        `[L]<font size='normal'>Reader: ${user.reader}</font>\n` +
        `[L]\n` +
        `[C]<b>================================</b>\n` +
        `[C]<b><font size='normal'>Reading</font></b>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Current</font>[R]<font size='normal'>${user.reading}</font>\n` +
        `[L]<font size='normal'>Previous</font>[R]<font size='normal'>${user.prevreading}</font>\n` +
        `[C]<b>--------------------------------</b>\n` +
        `[L]<font size='normal'>Consumption</font>[R]<font size='normal'>${user.volume}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Amount Due</font>[R]<font size='normal'>${user.rate ? user.rate : 0}</font>\n` +
        `[L]<font size='normal'>Prev Balance</font>[R]<font size='normal'>${user.balance ? user.balance : ""}</font>\n` +
        `[L]<font size='normal'>Other Charges</font>[R]<font size='normal'></font>\n` +
        `[L]\n` +
        `[L]\n` +
        `[L]<font size='normal'>Total Amount Due</font>[R]<font size='normal'>PHP ${user.rate + user.balance}</font>\n` +
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Due Date</font>[R]<font size='normal'>:${user.duedate}</font>\n` +
        `[L]<font size='normal'>Disconnection Date</font>[R]<font size='normal'>${user.discdate ? (":" + user.discdate) : ""}</font>\n` +
        `[L]\n` +
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[C]<qrcode size='25'>${user.acctname}</qrcode>\n` +
        `[L]\n` +
        `[C]<font size='normal'>Pay your bills on time to avoid</font>\n` +
        `[C]<font size='normal'>disconnection of your water</font>\n` +
        `[C]<font size='normal'>service</font>`

    )
}