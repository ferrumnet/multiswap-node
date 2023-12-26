import { Transaction, TransactionReceipt } from '../interfaces';

export interface JobRequestBody {
  name: string;
  sourceRpcURL: string;
  isSourceNonEVM: boolean;
  destinationRpcURL: string;
  isDestinationNonEVM: boolean;
  bridgeAmount: string;
  txId: string;
  threshold: number;
  sourceAssetType: string;
  destinationAssetType: string;
  destinationAmountIn: string;
  destinationAmountOut: string;
  sourceOneInchData: string;
  destinationOneInchData: string;
  expiry: number;
  withdrawalData: string;
}

export interface SignatureData {
  from: string;
  token: string;
  amount: string;
  sourceChainId: string;
  targetChainId: string;
  targetToken: string;
  targetAddress: string;
  swapBridgeAmount: string;
}

export interface UpdateJobRequestBody {
  transaction: Transaction;
  transactionReceipt: TransactionReceipt;
}
