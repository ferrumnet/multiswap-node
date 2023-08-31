import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';
import { abi as contractABI } from '../constants/FiberRouter.json';
import {
  NAME,
  VERSION,
  NETWORKS,
  CUDOS_CHAIN_ID,
  THRESHOLD,
} from '../constants/constants';
import { ecsign, toRpcSig } from 'ethereumjs-util';
import { AbiItem } from 'web3-utils';
import { amountToHuman, amountToMachine } from '../constants/utils';

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
  tries = 0,
): Promise<TransactionReceipt> => {
  const web3 = new Web3(rpcURL);
  const transaction: TransactionReceipt = await web3.eth.getTransactionReceipt(
    txId,
  );
  console.log('transaction', transaction?.status, txId, tries);
  if (tries < THRESHOLD) {
    tries += 1;
    if (!transaction || transaction === null || transaction.status === null) {
      await getTransactionReceipt(txId, rpcURL, tries);
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
  decodedData: any,
  transaction: any,
): Promise<any> => {
  try {
    const web3 = new Web3(job.data.sourceRpcURL);
    const destinationAmountToMachine = await getDestinationAmount(job.data);
    const txData = {
      transactionHash: job.returnvalue.transactionHash,
      from: transaction.from,
      token: decodedData.sourceToken,
      amount: decodedData.sourceAmount,
      contractAddress: getFundManagerAddress(decodedData.targetChainId),
      fiberRouterAddress: getFiberRouterAddress(decodedData.targetChainId),
      chainId: decodedData.sourceChainId,
      targetChainId: decodedData.targetChainId,
      targetToken: getFoundaryTokenAddress(
        decodedData.sourceChainId,
        decodedData.targetChainId,
        decodedData.targetToken,
      ),
      targetAddress: decodedData.targetAddress,
      signatures: [],
      salt: '',
    };

    txData.salt = Web3.utils.keccak256(
      txData.transactionHash.toLocaleLowerCase(),
    );
    const payBySig0 = createSignedPayment(
      txData.targetChainId,
      txData.targetAddress,
      destinationAmountToMachine,
      txData.targetToken,
      txData.contractAddress,
      txData.salt,
      web3,
    );

    const payBySig1 = createSignedPayment(
      txData.targetChainId,
      txData.fiberRouterAddress,
      destinationAmountToMachine,
      txData.targetToken,
      txData.contractAddress,
      txData.salt,
      web3,
    );
    return {
      ...txData,
      signatures: [payBySig0.signatures, payBySig1.signatures],
      hash: payBySig0.hash,
    };
  } catch (error) {
    console.error('Error occured while decoding transaction', error);
  }
};

const createSignedPayment = (
  chainId: string,
  address: string,
  amount: string,
  token: string,
  contractAddress: string,
  salt: string,
  web3: Web3,
) => {
  const payBySig = produceSignatureWithdrawHash(
    web3,
    chainId,
    contractAddress,
    token,
    address,
    amount,
    salt,
  );
  const privateKey = process.env.PRIVATE_KEY as string;
  const ecSign = ecsign(
    Buffer.from(payBySig.hash.replace('0x', ''), 'hex'),
    Buffer.from(privateKey.replace('0x', ''), 'hex'),
  );
  const sign = fixSig(toRpcSig(ecSign.v, ecSign.r, ecSign.s));
  payBySig.signatures = [sign];
  return payBySig;
};

const produceSignatureWithdrawHash = (
  web3: Web3,
  chainId: string,
  contractAddress: string,
  token: string,
  payee: string,
  amount: string,
  swapTxId: string,
): any => {
  const methodHash = Web3.utils.keccak256(
    Web3.utils.utf8ToHex(
      'WithdrawSigned(address token,address payee,uint256 amount,bytes32 salt)',
    ),
  );
  const params = ['bytes32', 'address', 'address', 'uint256', 'bytes32'];
  const structure = web3.eth.abi.encodeParameters(params, [
    methodHash,
    token,
    payee,
    amount,
    swapTxId,
  ]);
  const structureHash = Web3.utils.keccak256(structure);
  const ds = domainSeparator(web3, chainId, contractAddress);
  const hash = Web3.utils.soliditySha3('\x19\x01', ds, structureHash);
  return {
    contractName: NAME,
    contractVersion: VERSION,
    contractAddress: contractAddress,
    amount,
    payee,
    signatures: [],
    token,
    swapTxId,
    sourceChainId: 0,
    toToken: '',
    hash,
  };
};

const domainSeparator = (
  web3: Web3,
  chainId: string,
  contractAddress: string,
) => {
  const hashedName = Web3.utils.keccak256(Web3.utils.utf8ToHex(NAME));
  const hashedVersion = Web3.utils.keccak256(Web3.utils.utf8ToHex(VERSION));
  const typeHash = Web3.utils.keccak256(
    Web3.utils.utf8ToHex(
      'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)',
    ),
  );
  return Web3.utils.keccak256(
    web3.eth.abi.encodeParameters(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [typeHash, hashedName, hashedVersion, chainId, contractAddress],
    ),
  );
};

export const getLogsFromTransactionReceipt = (job: any) => {
  let logDataAndTopic = undefined;

  if (job?.returnvalue?.logs?.length) {
    for (const log of job.returnvalue.logs) {
      if (log?.topics?.length) {
        const topicIndex = findSwapEvent(log.topics, job);
        if (topicIndex !== undefined && topicIndex >= 0) {
          logDataAndTopic = {
            data: log.data,
            topics: log.topics,
          };
          break;
        }
      }
    }

    let swapEventInputs = contractABI.find(
      abi => abi.name === 'Swap' && abi.type === 'event',
    )?.inputs;

    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      swapEventInputs = contractABI.find(
        abi => abi.name === 'NonEvmSwap' && abi.type === 'event',
      )?.inputs;
    }

    if (logDataAndTopic?.data && logDataAndTopic.topics) {
      const web3 = new Web3(job.data.sourceRpcURL);

      const decodedLog = web3.eth.abi.decodeLog(
        swapEventInputs as any,
        logDataAndTopic.data,
        logDataAndTopic.topics.slice(1),
      );

      return decodedLog;
    }
  }
};

const findSwapEvent = (topics: any[], job: any) => {
  let swapEventHash = Web3.utils.sha3(
    'Swap(address,address,uint256,uint256,uint256,address,address)',
  );
  if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
    swapEventHash = Web3.utils.sha3(
      'NonEvmSwap(address,string,uint256,string,uint256,address,string)',
    );
  }

  if (topics?.length) {
    return topics.findIndex(topic => topic === swapEventHash);
  } else {
    return undefined;
  }
};

const fixSig = (sig: any) => {
  const rs = sig.substring(0, sig.length - 2);
  let v = sig.substring(sig.length - 2);
  if (v === '00' || v === '37' || v === '25') {
    v = '1b';
  } else if (v === '01' || v === '38' || v === '26') {
    v = '1c';
  }
  return rs + v;
};

const getFundManagerAddress = (chainId: string) => {
  if (NETWORKS && NETWORKS.length > 0) {
    let item = NETWORKS.find((item: any) => item.chainId === chainId);
    return item ? item.fundManagerAddress : '';
  }
  return '';
};

const getFiberRouterAddress = (chainId: string) => {
  if (NETWORKS && NETWORKS.length > 0) {
    let item = NETWORKS.find((item: any) => item.chainId === chainId);
    return item ? item.fiberRouterAddress : '';
  }
  return '';
};

const getFoundaryTokenAddress = (
  sourceChainId: string,
  targetChainId: string,
  targetAddress: string,
) => {
  if (sourceChainId == CUDOS_CHAIN_ID) {
    if (NETWORKS && NETWORKS.length > 0) {
      let item = NETWORKS.find((item: any) => item.chainId === targetChainId);
      return item ? item.foundaryTokenAddress : '';
    }
    return '';
  } else {
    return targetAddress;
  }
};

const getDestinationAmount = async (data: any) => {
  console.log('data.bridgeAmount', data.bridgeAmount);
  return data.bridgeAmount;
};
