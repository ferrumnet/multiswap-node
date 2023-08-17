import axios from 'axios';
import dotenv from 'dotenv';
var CryptoJS = require('crypto-js');
import { BEARER, RANDOM_KEY } from '../constants/constants';
dotenv.config();

export let getTransactions = async function () {
  try {
    let baseUrl = process.env.GATEWAY_BACKEND_URL;
    if (process.env.ENVIRONMENT == 'local') {
      baseUrl = 'http://localhost:8080';
    }
    let url = `${baseUrl}/api/v1/transactions/list?status=validatorSignatureCreated&isPagination=false&limit=1`;
    let res = await axios.get(url);
    return res.data.body.transactions;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTransactionJobStatus = async (txHash: string, body: any) => {
  let baseUrl = process.env.GATEWAY_BACKEND_URL;
  if (process.env.ENVIRONMENT == 'local') {
    baseUrl = 'http://localhost:8080';
  }
  let config = {
    headers: {
      Authorization: getGatewayBackendToken(),
    },
  };
  return axios.put(
    `${baseUrl}/api/v1/transactions/update/swap/and/withdraw/job/${txHash}`,
    body,
    config,
  );
};

const getGatewayBackendToken = () => {
  return BEARER + doEncryption();
};

const doEncryption = () => {
  try {
    const privateKey = process.env.PRIVATE_KEY as string;
    const publicKey = process.env.PUBLIC_KEY
      ? process.env.PUBLIC_KEY
      : RANDOM_KEY;
    var ciphertext = CryptoJS.AES.encrypt(publicKey, privateKey);
    return ciphertext;
  } catch (e) {
    console.log(e);
    return '';
  }
};
