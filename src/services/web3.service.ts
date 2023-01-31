import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
): Promise<TransactionReceipt> => {
  const web3 = new Web3(rpcURL);
  const transaction: TransactionReceipt = await web3.eth.getTransactionReceipt(
    txId,
  );
  if (transaction === null || transaction.status === null) {
    getTransactionReceipt(txId, rpcURL);
  }
  return transaction;
};

export const getTransactionByHash = async (
  txHash: string,
  rpcURL: string,
): Promise<Transaction> => {
  const web3 = new Web3(rpcURL);
  return web3.eth.getTransaction(txHash);
};
