import { Transaction, TransactionReceipt } from '../interfaces';

export interface JobRequestBody {
  name: string;
  sourceRpcURL: string;
  destinationRpcURL: string;
  bridgeAmount: string;
  txId: string;
}

export interface UpdateJobRequestBody {
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
}
