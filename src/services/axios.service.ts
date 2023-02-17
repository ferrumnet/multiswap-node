import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const updateTransactionJobStatus = async (txHash: string, body: any) => {
  const url = process.env.GATEWAY_BACKEND_URL;
  return axios.put(
    `${url}/api/v1/transactions/update/swap/and/withdraw/job/${txHash}`,
    body,
  );
};
