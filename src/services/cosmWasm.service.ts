import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';
const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
): Promise<TransactionReceipt> => {
  let client = await SigningCosmWasmClient.connectWithSigner(rpcURL);
  let transaction = await client.getTx(txId);
  console.log('transaction', transaction);
  if (!transaction || transaction === null) {
    await getTransactionReceipt(txId, rpcURL);
  }
  return transaction;
};
