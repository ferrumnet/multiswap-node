import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';
import { NETWORKS, CUDOS_CHAIN_ID, delay } from '../constants/constants';
import { transactionService, signatureService } from './index';

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
  threshold: number,
  tries = 0,
): Promise<TransactionReceipt> => {
  const web3 = new Web3(rpcURL);
  const transaction: TransactionReceipt = await web3.eth.getTransactionReceipt(
    txId,
  );
  console.log('transaction', transaction?.status, txId, tries);
  if (tries < threshold) {
    tries += 1;
    if (!transaction || transaction === null || transaction.status === null) {
      await delay();
      await getTransactionReceipt(txId, rpcURL, threshold, tries);
    }
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

export const signedTransaction = async (
  job: any,
  hash: string,
): Promise<any> => {
  try {
    const web3 = new Web3(job.data.sourceRpcURL);
    let decodedData = job.signatureData;
    const destinationAmountToMachine = await getDestinationAmount(decodedData);
    let txData = await signatureService.getDataForSignature(job);

    txData.salt = Web3.utils.keccak256(
      signatureService.getDataForSalt(hash, txData),
    );
    console.log(txData);
    const signature = signatureService.createSignedPayment(
      txData.targetChainId,
      txData.targetAddress,
      destinationAmountToMachine,
      txData.targetToken,
      txData.fundManagerContractAddress,
      txData.salt,
      txData.destinationAssetType,
      txData.destinationAmountIn,
      txData.destinationAmountOut,
      txData.targetFoundaryToken,
      txData.destinationOneInchData,
      txData.expiry,
      web3,
    );

    return {
      ...txData,
      signatures: [{ signature: signature.signature, hash: signature.hash }],
      hash: signature.hash,
      address: process.env.PUBLIC_KEY,
    };
  } catch (error) {
    console.error('Error occured while decoding transaction', error);
  }
};

export const getFundManagerAddress = (chainId: string) => {
  if (NETWORKS && NETWORKS.length > 0) {
    let item = NETWORKS.find((item: any) => item.chainId === chainId);
    return item ? item.fundManagerAddress : '';
  }
  return '';
};

export const getFiberRouterAddress = (chainId: string) => {
  if (NETWORKS && NETWORKS.length > 0) {
    let item = NETWORKS.find((item: any) => item.chainId === chainId);
    return item ? item.fiberRouterAddress : '';
  }
  return '';
};

export const getFoundaryTokenAddress = (targetChainId: string): string => {
  if (NETWORKS && NETWORKS.length > 0) {
    let item = NETWORKS.find((item: any) => item.chainId === targetChainId);
    return item ? item.foundaryTokenAddress : '';
  }
  return '';
};

const getDestinationAmount = async (data: any) => {
  console.log('data.bridgeAmount', data.swapBridgeAmount);
  return data.swapBridgeAmount;
};
