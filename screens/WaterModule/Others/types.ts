export type UserType = {
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
    discount: number
}