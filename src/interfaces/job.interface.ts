import { Transaction, TransactionReceipt } from '../interfaces';

export interface JobRequestBody {
  name: string;
  rpcURL: string;
  txId: string;
}

export interface UpdateJobRequestBody {
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
}
