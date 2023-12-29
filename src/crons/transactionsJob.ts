export {};
var cron = require('node-cron');
import { axiosService, transactionService } from '../services/index';
let isProccessRunning = false;
let localTransactionHashes: any = [];

let transactionsJob = async function () {
  start();
};

async function start() {
  try {
    let task = cron.schedule('*/20 * * * * *', async () => {
      if (!isProccessRunning) {
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
      handleJob(transaction);
    }
    isProccessRunning = false;
  }
}

export function handleJob(transaction: any) {
  if (isHashInLocalList(transaction.receiveTransactionId) == false) {
    addTransactionHashInLocalList(transaction.receiveTransactionId);
    transactionService.prepareObjectsAndVerifySignatures(transaction);
  }
}

function addTransactionHashInLocalList(hash: any) {
  localTransactionHashes?.push(hash);
}

export function removeTransactionHashFromLocalList(hash: any) {
  localTransactionHashes = localTransactionHashes?.filter(
    (item: string) => item !== hash,
  );
}

function isHashInLocalList(hash: any): boolean {
  const found = localTransactionHashes?.find((item: any) => item == hash);
  if (found) {
    return true;
  } else {
    return false;
  }
}

export default transactionsJob;
