import CryptoJS from 'crypto-js';
import encode from './encoder';

function verifyKey(device_id, reg_key) {
  if (!device_id) {
    throw new Error('The "device_id" parameter is required.');
  }

  if (!reg_key) {
    throw new Error('The "reg_key" parameter is required.');
  }

  const key_1 = encode(device_id);
  return ( key_1 === reg_key );
}

export default verifyKey
