import axios from 'axios';
import dotenv from 'dotenv';
var CryptoJS = require('crypto-js');
import {
  BEARER,
  RANDOM_KEY,
  createAuthTokenForMultiswapBackend,
} from '../constants/constants';
dotenv.config();

export let getTransactions = async function () {
  try {
    let baseUrl = process.env.GATEWAY_BACKEND_URL;
    let config = {
      headers: {
        Authorization: BEARER + createAuthTokenForMultiswapBackend(),
      },
    };
    let url = `${baseUrl}/api/v1/transactions/list?status=validatorSignatureCreated&limit=20&nodeType=master`;
    let res = await axios.get(url, config);
    return res.data.body.transactions;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateTransaction = async (
  txHash: string,
  body: any,
  isValidationFailed: boolean,
) => {
  let baseUrl = process.env.GATEWAY_BACKEND_URL;
  let config = {
    headers: {
      Authorization: BEARER + createAuthTokenForMultiswapBackend(),
    },
  };
  return axios.put(
    `${baseUrl}/api/v1/transactions/update/from/master/${txHash}?address=${
      process.env.PUBLIC_KEY
    }&isValidationFailed=${isValidationFailed ? true : ''}`,
    body,
    config,
  );
};
