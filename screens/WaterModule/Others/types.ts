export type UserType = {
    id? : number,
    batchid: string,
    acctno: string,
    prevreading: number,
    reading: number,
    volume: number,
    rate: number,
    acctname: string,
    capacity: number,
    brand: string,
    meterno: string,
    billdate: string,
    duedate: string,
    discdate: string,
    amount?: number,
    classification: string,
    penalty: number,
    discount: number,
    acctgroup: string,
    fromdate: string,
    todate: string,
    location:string,
    reader: string,
    balance: number,
    pageNum: number,
    note: string,
    uploaded: number,
    sigData: string,
    receiver: string,
    receiveDate: string,
    noteDate: string,
    qrcode: string,
    othercharge: number,
    disconnectiondate: string
}

export type DataUserType = {
    batchid: string,
    acctno: string,
    prevreading: number,
    reading: number,
    volume: number,
    rate: number,
    acctname: string,
    capacity: number,
    brand: string,
    meterno: string,
    billdate: string,
    duedate: string,
    discdate: string,
    amount?: number,
    classification: string,
    penalty: number,
    discount: number,
    acctgroup: string
}