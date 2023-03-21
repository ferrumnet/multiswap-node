import axios from 'axios';
import dotenv from 'dotenv';
var CryptoJS = require("crypto-js");
import { BEARER } from '../constants/constants';
dotenv.config();

export const updateTransactionJobStatus = async (txHash: string, body: any) => {
  const url = process.env.GATEWAY_BACKEND_URL;
  let config = {
    headers: {
      Authorization: getGatewayBackendToken(),
    }
  };
  return axios.put(
    `${url}/api/v1/transactions/update/swap/and/withdraw/job/${txHash}`,
    body,
    config
  );
};

const getGatewayBackendToken = () => {
  return BEARER + doEncryption();
};

const doEncryption = () => {
  try {
    const privateKey = process.env.PRIVATE_KEY as string;
    const publicKey = process.env.PUBLIC_KEY as string;
    var ciphertext = CryptoJS.AES.encrypt(publicKey, privateKey);
    return ciphertext;
  } catch (e) {
    console.log(e);
    return '';
  }
};
