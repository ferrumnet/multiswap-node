import { Worker } from 'bullmq';
import { web3Service, axiosService } from './services';
import Web3 from 'web3';
import { abi as contractABI } from './constants/FiberRouter.json';
const swapEventHash = Web3.utils.sha3(
  'Swap(address,address,uint256,uint256,uint256,address,address)',
);
console.log(swapEventHash, 'swapEventHash');
const worker = new Worker(
  process.env.QUEUE as string,
  async job =>
    await web3Service.getTransactionReceipt(job.data.txId, job.data.rpcURL),
  {
    connection: {
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT) as number,
    },
  },
);
worker.on('completed', async job => {
  try {
    console.info(`${job.id} has completed!`);

    getLogsFromTransactionReceipt(job);
    // const tx = await web3Service.getTransactionByHash(
    //   job.data.txId,
    //   job.data.rpcURL,
    // );
    // const signedData = await web3Service.signedTransaction(job.data.rpcURL, tx);
    // axiosService.updateTransactionJobStatus(tx.hash, { signedData, tx });
  } catch (error) {
    console.error('error occured', error);
  }
});

worker.on('failed', async (job: any, err) => {
  console.info(`${job.id} has failed with ${err.message}`);
  const tx = await web3Service.getTransactionByHash(
    job.data.txId,
    job.data.rpcURL,
  );
  axiosService.updateTransactionJobStatus(tx.hash, {
    transaction: tx,
    transactionReceipt: job?.returnvalue,
  });
});

const getLogsFromTransactionReceipt = (job: any) => {
  let topics: any[][] = [];
  if (job?.returnvalue?.logs?.length) {
    for (const log of job.returnvalue.logs) {
      topics = [...topics, getAllTopics(log)];
    }
  }
  if (topics?.length) {
    for (const topic of topics) {
      const topicIndex = findSwapEvent(topic);
      if (topicIndex !== undefined && topicIndex >= 0) {
        // console.log(topic, topicIndex);
      }
    }
  }
  console.log(topics);
};

const getAllTopics = (log: any) => {
  if (log?.topics?.length) {
    return log.topics;
  } else {
    return [];
  }
};

const findSwapEvent = (topics: any[]) => {
  if (topics?.length) {
    return topics.findIndex(topic => topic === swapEventHash);
  } else {
    return undefined;
  }
};

export default worker;
