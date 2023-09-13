export {};
var cron = require('node-cron');
import moment from 'moment';
import {
  axiosService,
  web3Service,
  cosmWasmService,
} from './../../services/index';
import { JobRequestBody } from './../../interfaces/index';
import { workerOnCompleted } from '../../worker';
let isProccessRunning = false;
let localTransactionHashes: any = [];

let transactionsJob = async function () {
  start();
};

async function start() {
  try {
    let task = cron.schedule('*/20 * * * * *', async () => {
      console.log(moment().utc(), ':::');
      if (!isProccessRunning) {
        console.log('getTransaction cron triggered:::');
        triggerJobs();
      }
    });

    task.start();
  } catch (e) {
    console.log(e);
  }
}

async function triggerJobs() {
  let transactions = await axiosService.getTransactions();
  console.log(transactions?.length);
  if (transactions && transactions?.length > 0) {
    isProccessRunning = true;
    for (const transaction of transactions) {
      addWorker(transaction);
    }
    isProccessRunning = false;
  }
}

export function addWorker(transaction: any) {
  if (isHashInLocalList(transaction.receiveTransactionId) == false) {
    addTransactionHashInLocalList(transaction.receiveTransactionId);
    workerForFetchChainDataFromNetwork(transaction);
  }
}

async function workerForFetchChainDataFromNetwork(tx: any) {
  if (tx) {
    let sourceNetwork = tx.sourceNetwork;
    let destinationNetwork = tx.destinationNetwork;
    let sourceRpc = sourceNetwork.multiswapNetworkFIBERInformation.rpcUrl;
    let destinationRpc =
      destinationNetwork.multiswapNetworkFIBERInformation.rpcUrl;

    let data: JobRequestBody = {
      name: '',
      sourceRpcURL: sourceRpc,
      isSourceNonEVM: sourceNetwork.isNonEVM,
      destinationRpcURL: destinationRpc,
      isDestinationNonEVM: destinationNetwork.isNonEVM,
      bridgeAmount: tx.bridgeAmount,
      txId: tx.receiveTransactionId,
    };

    let job: any = { data: data, transaction: tx };
    await workerForSignatureVarification(job);
  }
}

async function workerForSignatureVarification(job: any) {
  try {
    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      if (cosmWasmService.validateSignature(job)) {
        await updateTransaction(job);
      }
    } else {
      if (web3Service.validateSignature(job) == false) {
        await updateTransaction(job);
      }
    }
    workerOnCompleted(job);
    removeTransactionHashFromLocalList(job?.data?.txId);
  } catch (error) {
    console.error('error occured', error);
  }
}

async function updateTransaction(job: any) {
  try {
    await axiosService.updateTransactionJobStatus(
      job?.data?.txId,
      {
        signedData: {},
        transaction: {},
        transactionReceipt: {},
      },
      'masterValidatorError',
    );
  } catch (error) {
    console.error('error occured', error);
  }
}

function addTransactionHashInLocalList(hash: any) {
  localTransactionHashes?.push(hash);
  console.log(localTransactionHashes?.length);
}

function removeTransactionHashFromLocalList(hash: any) {
  localTransactionHashes = localTransactionHashes?.filter(
    (item: string) => item !== hash,
  );
  console.log(localTransactionHashes?.length);
}

function isHashInLocalList(hash: any): boolean {
  const found = localTransactionHashes?.find((item: any) => item == hash);
  console.log(found);
  if (found) {
    return true;
  } else {
    return false;
  }
}

export default transactionsJob;
