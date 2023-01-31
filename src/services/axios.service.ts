import axios from 'axios';
import dotenv from 'dotenv';
import { Transaction } from '../interfaces';
dotenv.config();

export const updateTransactionJobStatus = async (
  txHash: string,
  body: Transaction,
) => {
  const url = process.env.GATEWAY_BACKEND_URL;
  return axios.put(
    `${url}/api/v1/transactions/update/swap/and/withdraw/job/${txHash}`,
    body,
  );
};
