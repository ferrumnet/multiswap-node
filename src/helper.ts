import axios from 'axios';
import dotenv from 'dotenv';
import Web3 from 'web3';
import { queueMessage } from './queue';

dotenv.config();

export const getNetworkList = async () => {
  const baseUrl = process.env.BASE_URL;
  return axios
    .get(`${baseUrl}/api/v1/networks/list?isAllowedOnMultiSwap=true`)
    .then(response => response.data.body.networks);
};

export const getTransactionReceiptFromLogs = async (
  web3: Web3,
  logs: any[],
) => {
  for (let log of logs) {
    const transactionReceipt = await web3.eth.getTransactionReceipt(
      log.transactionHash,
    );
    console.log(transactionReceipt.transactionHash);
    queueMessage(transactionReceipt);
  }
};
