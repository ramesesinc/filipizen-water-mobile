import { UserType } from '../../WaterModule/Others/types'
import ensureFourDecimalPlaces from './ensureFourDecimalPlaces';

const replaceñ = (name) => {
    if (name !== null && typeof name === 'string') {
        console.log("replaced", name)
        return name.replace(/ñ/gi, (match) => {
            return match === 'ñ' ? 'n' : 'N';
        });
    } else {
        console.log("Not replaced", name)
        return ""
    }
}

export const printFormat = (user: UserType, headers, imageUrl, signatureData, receiver, computedRate, qrcode, discdate) => {
    const newMeterNo = user.meterno ? user.meterno.substring(0, user.meterno.indexOf(':')) : null;
    const { header1, header2, header3 } = headers;
    const newName = replaceñ(user.acctname)
    const newReader = replaceñ(user.reader)
    const newLoc = replaceñ(user.location?.replace(/\n/g, '').replace(/  +/g, ' '));

    let extraName = "";

    // if (newName.length > 23) {
    //     extraName = newName.substring(23)
    //     newName = newName.substring(0, 23)
    // }

    function formatDate(inputDate) {
        // Parse the input date string
        const dateObj = new Date(inputDate);

        // Array of month names
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Extract components of the date
        const year = dateObj.getFullYear();
        const monthIndex = dateObj.getMonth();
        const day = dateObj.getDate();

        // Format the date as "MONTH day, year"
        const formattedDate = monthNames[monthIndex] + ' ' + day + ', ' + year;

        return formattedDate;
    }

    const newBillDate = formatDate(user.billdate)
    const newFromDate = formatDate(user.fromdate)
    const newToDate = formatDate(user.todate)

    const formatVal = (num) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    }

    const prevBal = formatVal(user.balance ? user.balance.toFixed(2) : "0.00")
    const amountDue = formatVal(user.rate > 0 ? user.rate.toFixed(2) : computedRate.toFixed(2))
    const otherchargeTotal = formatVal(user.othercharge ? user.othercharge.toFixed(2) : "0.00")

    const toAddRate = Number(computedRate);
    const toAddBalance = Number(user.balance);
    const toAddOtherCharge = Number(user.othercharge);

    const totalAmount = formatVal(Number((toAddRate + toAddBalance + toAddOtherCharge).toFixed(2)))

    return (
        (header1 !== "" ? `[C]<b><font size='normal'>${header1}</b></font>\n` : "") +
        (header2 !== "" ? `[C]<b><font size='normal'>${header2}</b></font>\n` : "") +
        (header3 !== "" ? `[C]<b><font size='normal'>${header3}</b></font>\n` : "") +
        `[C]<img>${imageUrl}</img>\n` +
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[C]<b><font size='big'>BILLING NOTICE</font></b>\n` +
        `[L]\n` +
        `[C]<font size='normal'>${newBillDate}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Account No: ${user.acctno}</font>\n` +
        (
            newName.length > 20 ?
                `[L]<font size='normal'>Name:</font>\n[L]<font size='normal'>${newName}</font>\n` :
                `[L]<font size='normal'>Name: ${newName}</font>\n`
        ) +
        `[L]<font size='normal'>Address:</font>\n` +
        `[L]<font size='normal'>${newLoc}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Account Group:</font>\n` +
        `[L]<font size='normal'>${user.acctgroup}</font>\n` +
        `[L]<font size='normal'>Classification: ${user.classification}</font>\n` +
        `[L]<font size='normal'>Meter No: ${user.brand} / ${user.meterno}</font>\n` +
        `[L]<font size='normal'>Capacity: ${user.capacity}</font>\n` +
        (
            newReader.length > 20 ?
                `[L]<font size='normal'>Reader:</font>\n[L]<font size='normal'>${newReader}</font>\n` :
                `[L]<font size='normal'>Reader: ${newReader}</font>\n`
        ) +
        `[L]\n` +
        `[C]<b>================================</b>\n` +
        `[C]<b><font size='normal'>Reading Information</font></b>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Coverage:</font>\n` +
        `[L]<font size='normal'>${newFromDate} to ${newToDate}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Current</font>[R]<font size='normal'>${ensureFourDecimalPlaces(user.reading)}</font>\n` +
        `[L]<font size='normal'>Previous</font>[R]<font size='normal'>${ensureFourDecimalPlaces(user.prevreading)}</font>\n` +
        `[C]<b>--------------------------------</b>\n` +
        `[L]<font size='normal'>Consumption</font>[R]<font size='normal'>${ensureFourDecimalPlaces(user.volume)}</font>\n` +
        `[L]\n` +
        `[C]<b><font size='normal'>Billing</font></b>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Amount Due</font>[R]<font size='normal'>${amountDue ? amountDue : 0}</font>\n` +
        `[L]<font size='normal'>Prev Balance</font>[R]<font size='normal'>${prevBal}</font>\n` +
        `[L]<font size='normal'>Other Charges</font>[R]<font size='normal'>${otherchargeTotal}</font>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Total Amount Due</font>[R]<font size='normal'>PHP ${totalAmount}</font>\n` +
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[L]<font size='normal'>Due Date</font>[R]<font size='normal'>:${user.duedate}</font>\n` +
        `[L]<font size='normal'>Disconnection Date</font>[R]<font size='normal'>${discdate ? `:${discdate}` : ""}</font>\n` +
        `[L]\n` +
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[C]<qrcode size='40'>${qrcode}</qrcode>\n` +
        `[L]\n` +
        `[C]<font size='normal'>Pay your bills on time to avoid</font>\n` +
        `[C]<font size='normal'>disconnection of your water</font>\n` +
        `[C]<font size='normal'>service</font>\n` +
        `[L]\n` +
        `[L]\n` +
        (
            signatureData && `[C]<img>${signatureData}</img>\n`
        ) +
        `[L]\n`
        // (
        //     receiver.length > 15 ?
        //         `[L]<font size='normal'>Recevied by:</font>\n[L]<font size='normal'>${receiver}</font>\n` :
        //         `[L]<font size='normal'>Recevied by: ${receiver}</font>\n`
        // )
    )
}