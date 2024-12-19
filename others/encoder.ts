import CryptoJS from 'crypto-js';

const SEED_ID = '075dd577f208bf6e082dd0f98f188929d4d3da920dec494547cc5acd59a6a0e0';

const encode = (value) => {
  const hmac = CryptoJS.HmacSHA256( value, SEED_ID ); 
  const md5  = CryptoJS.MD5( hmac).toString(CryptoJS.enc.Hex); 
  const arr  = md5.match(/.{1,4}/g).join('-').split('-');

  const result = `${arr[0]}-${arr[2]}-${arr[4]}-${arr[6]}`;
  console.log("encode result:",result)
  return result;
};

export default encode;