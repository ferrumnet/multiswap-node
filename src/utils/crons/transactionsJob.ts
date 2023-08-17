export {};
var cron = require('node-cron');
import moment from 'moment';
import {
  axiosService,
  web3Service,
  cosmWasmService,
} from './../../services/index';
import { JobRequestBody } from './../../interfaces/index';
let isProccessRunning = false;

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
      // await workerForFetchChainDataFromNetwork(transaction);
    }
    isProccessRunning = false;
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

    if (job.data.isSourceNonEVM) {
      console.log('======================');
      console.log('source is Non EVM');
      job.returnvalue = await cosmWasmService.getTransactionReceipt(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    } else {
      console.log('======================');
      console.log('source is EVM');
      job.returnvalue = await web3Service.getTransactionReceipt(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    }

    if (job?.returnvalue?.status == true) {
      await workerForSignatureVarification(job);
    } else {
      console.info(`failed!`);
    }
  }
}

async function workerForSignatureVarification(job: any) {
  try {
    let decodedData;
    let tx: any = {};
    let signedData;
    console.info(`completed!`);
    if (job.data.isSourceNonEVM != null && job.data.isSourceNonEVM) {
      decodedData = cosmWasmService.getLogsFromTransactionReceipt(job);
      tx.from = decodedData.from;
      tx.hash = job.returnvalue.transactionHash;
    } else {
      decodedData = web3Service.getLogsFromTransactionReceipt(job);
      tx = await web3Service.getTransactionByHash(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    }
    console.info('decodedData', decodedData);

    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      // if (cosmWasmService.validateSignature(job)) {
      //   signedData = await cosmWasmService.signedTransaction(
      //     job,
      //     decodedData,
      //     tx
      //   );
      // }
    } else {
      // if (web3Service.validateSignature(job)) {
      //   signedData = await web3Service.signedTransaction(job, decodedData, tx);
      // }
    }

    await updateTransaction(job, signedData, tx);
  } catch (error) {
    console.error('error occured', error);
  }
}

async function updateTransaction(job: any, signedData: any, tx: any) {
  try {
    console.log('signedData', job.returnvalue.status, signedData);
    await axiosService.updateTransactionJobStatus(job?.data?.txId, {
      signedData,
      transaction: tx,
      transactionReceipt: job?.returnvalue,
    });
  } catch (error) {
    console.error('error occured', error);
  }
}

export default transactionsJob;
