import { UserType } from '../../WaterModule/Others/types'

export const printFormat = (imageUrl: string, user: UserType, headers) => {
    const newMeterNo = user.meterno ? user.meterno.substring(0, user.meterno.indexOf(':')) : null;
    const { header1, header2, header3 } = headers;

    return (
        (header1 !== "" ? `[C]<font size='normal'>${header1}</font>\n`: "") +
        (header2 !== "" ? `[C]<font size='normal'>${header2}</font>\n`: "") +
        (header3 !== "" ? `[C]<font size='normal'>${header3}</font>\n`: "") +
        `[C]<img>${imageUrl}</img>\n` +
        `[L]<b>${user.acctname}</b>\n` +
        `[L]<font size='normal'>Mabolo Cebu City</font>\n`+
        `[L]<font size='normal'>Acct No:${user.acctno}</font>\n`+
        `[C]<b>================================</b>\n` +
        `[L]\n` +
        `[C]<b><font size='big'>BILLING NOTICE</font></b>\n` +
        `[C]<font size='normal'>${user.billdate}</font>\n` +
        `[L]\n` +
        `[L]\n` +
        `[L]<font size='normal'>Meter Brand</font>[L]<font size='normal'>:${user.brand}</font>\n` +
        `[L]<font size='normal'>Meter Number</font>[L]<font size='normal'>:${newMeterNo}</font>\n` +
        `[L]<font size='normal'>Classification</font>[L]<font size='normal'>:${user.classification}</font>\n` +
        `[L]<font size='normal'>Capacity</font>[L]<font size='normal'>:${user.capacity}</font>\n` +
        `[C]<b>================================</b>\n` +
        `[C]<b><font size='normal'>Reading</font></b>\n` +
        `[L]<font size='normal'>Current</font>[R]<font size='normal'>${user.reading}</font>\n` +
        `[L]<font size='normal'>Previous</font>[R]<font size='normal'>${user.prevreading}</font>\n` +
        `[C]<b>--------------------------------</b>\n` +
        `[L]<font size='normal'>Volume</font>[R]<font size='normal'>${user.volume}</font>\n` +
        `[L]<font size='normal'>Penalty</font>[R]<font size='normal'>${user.penalty}</font>\n` +
        `[L]<font size='normal'>Discount</font>[R]<font size='normal'>${user.discount}</font>\n` +
        `[L]\n` +
        `[L]\n` +
        `[L]<font size='normal'>Bill Amount</font>[R]<font size='normal'>PHP ${user.amount}</font>\n` +
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