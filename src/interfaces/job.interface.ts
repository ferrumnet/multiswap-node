import { Transaction, TransactionReceipt } from '../interfaces';

export interface JobRequestBody {
  name: string;
  sourceRpcURL: string;
  isSourceNonEVM: boolean;
  destinationRpcURL: string;
  isDestinationNonEVM: boolean;
  bridgeAmount: string;
  txId: string;
}

export interface UpdateJobRequestBody {
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
}
