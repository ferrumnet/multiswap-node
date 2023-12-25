import { Transaction, TransactionReceipt } from '../interfaces';

export interface JobRequestBody {
  name: string;
  sourceRpcURL: string;
  isSourceNonEVM: boolean;
  destinationRpcURL: string;
  isDestinationNonEVM: boolean;
  txId: string;
  threshold: number;
}

export interface UpdateJobRequestBody {
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
}
