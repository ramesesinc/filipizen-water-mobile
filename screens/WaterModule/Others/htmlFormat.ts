import { UserType } from '../../WaterModule/Others/types'

export const htmlFormat = (imageUrl: string, dataUri: unknown, user: UserType, headers) => {
  const newMeterNo = user.meterno ? user.meterno.substring(0, user.meterno.indexOf(':')) : null;
  const { header1, header2, header3 } = headers;

  return (
    `
                <html lang="en">
                <head>
                    <style>
                      @media print {
                        .divider-line {
                            border-top: 2px dotted black;
                          }
                      }

                      body {
                      font-size: 14px;
                      }
                      .divider-line {
                        border-top: 2px dotted black;
                        }                  
                      .header-items {
                        text-align: center;
                        margin: 1;
                        padding: 1;
                      }
                      .img-container {
                      display: flex;
                      justify-content: center;
                       align-items: center;
                       margin: 8px;
                      }
                      
                        .grid-container1 {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 2fr 3fr;
                      }
                        .grid-container2 {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                      }
                        .grid-container3 {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                      }
                        .grid-container4 {
                        width: 100%;
                        display: grid;
                        grid-template-columns: 9fr 1fr 2fr;
                      }
                        .name {
                        margin-left: 1px;
                        margin-right: 1px;
                        margin-top: 3px;
                        margin-bottom: 3px;
                      }
                        .acct {
                        margin: 1px
                      }
                        .meter{
                        margin: 1px;
                      }
                        .billing {
                        margin: 20px;
                      }
                        .notice {
                        font-size: 20px;
                        text-align: center;
                        margin: 1px;
                      }
                        .date {
                        text-align: center;
                        margin: 1px;
                      }
                        .reading {
                        margin: 3px;
                      }
                        .bill {
                        margin: 3px;
                      }
                      .bill-num, .due-num {
                        text-align: end;
                      }
                        .due {
                        margin: 3px;
                      }
                        .data {
                      text-align: end;
                    }
     
                        .info {
                        display: flex;
                        justify-content: space-between;
                        margin: 1px;
                      }
                    </style>
                </head>
                <body>
                  ${(header1 || header2 || header3 !== "") ?
      "<div class='header-container' >"
      + (header1 !== "" ? `<p class='header-items'>${header1}</p>` : "")
      + (header2 !== "" ? `<p class='header-items'>${header2}</p>` : "")
      + (header3 !== "" ? `<p class='header-items'>${header3}</p>` : "")
      // `<p class='header-items'>${header1 !== null || undefined ? header1 : ''}<p>` +
      // `<p class='header-items'>${header2 !== null || undefined ? header2 : ''}<p>` +
      // `<p class='header-items'>${header3 !== null || undefined ? header3 : ''}<p>` +
      + "</div>" :
      "<div></div>"
    }
                  <div class="img-container">
                    <img src="${imageUrl}" alt="Image Alt Text" style="width: 150px; height: 100;">
                  </div>
                   <p class="name" style="font-weight: bold">${user.acctname}</p>
                   <p class="name">Mabolo Cebu City</p>
                  <div class="grid-container1">
                    <p class="acct">Acct No</p>
                    <p class="acct">:${user.acctno}</p>
                  </div>
                   <hr class="divider-line">
                  <div class="billing">
                    <p class="notice">BILLING NOTICE</p>
                    <p class="date">${user.billdate}</p>
                  </div>
                  <div class="grid-container1">
                    <p class="meter">Meter Brand</p>
                    <p class="meter">:${user.brand}</p>
                    <p class="meter">Meter No</p>
                    <p class="meter">:${newMeterNo}</p>
                  </div>
                  <hr class="divider-line">
                  <div class="grid-container4">
                    <p class="bill">Classification</p>
                    <p class="bill">:</p>
                    <p class="bill bill-num">${user.classification}</p>
                    <p class="bill">Capacity</p>
                    <p class="bill">:</p>
                    <p class="bill bill-num">${user.capacity}</p>
                  </div>
                  <hr class="divider-line">
                  <div class="info">
                    <p style="margin: 1px"></p>
                    <p style="margin: 1px">Reading: </p>
                  </div>
                  <div class="info">
                    <p style="margin: 1px">Present</p>
                    <p style="margin: 1px">${user.reading}</p>
                  </div>
                  <div class="info">
                    <p style="margin: 1px">Previous</p>
                    <p style="margin: 1px">${user.prevreading}</p>
                  </div>
                   <hr class="divider-line">
                   <div class="info">
                    <p style="margin: 1px">Volume</p>
                    <p style="margin: 1px">${user.volume}</p>
                  </div>
                  <hr class="divider-line">
                  <div class="grid-container4">
                    <p class="due">Penalty</p>
                    <p class="due">:</p>
                    <p class="due due-num">${user.penalty}</p>
                    <p class="due">Discount</p>
                    <p class="due">:</p>
                    <p class="due due-num">${user.discount}</p>
                    <p class="due">Bill Amount</p>
                    <p class="due">:</p>
                    <p class="due due-num">${user.amount}</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p class="due">Due Date</p>
                    <p class="due">:</p>
                    <p class="due">${user.duedate}</p>
                    <p class="due">Disconnection Date</p>
                    <p class="due">:</p>
                    <p class="due">${user.discdate ? user.discdate : ""}</p>
                  </div>
                  <hr class="divider-line">
                  <p style="text-align: center; margin: 1px;">Pay your bills on time to avoid disconnection of your water service</p>
                  <hr class="divider-line">
                  <div class="img-container">
                    <img src="${dataUri}" alt="Image Alt Text" style="width: 100px; height: 100;">
                  </div>
                  <p style="text-align: center">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </body>
              </html>
              `
  )
}

