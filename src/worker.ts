import { Worker } from 'bullmq';
import { web3Service, axiosService } from './services';
import Web3 from 'web3';
import { abi as contractABI } from './constants/FiberRouter.json';
const swapEventHash = Web3.utils.sha3(
  'Swap(address,address,uint256,uint256,uint256,address,address)',
);
const swapEventInputs = contractABI.find(
  abi => abi.name === 'Swap' && abi.type === 'event',
)?.inputs;

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
  let logDataAndTopic = undefined;

  if (job?.returnvalue?.logs?.length) {
    for (const log of job.returnvalue.logs) {
      if (log?.topics?.length) {
        const topicIndex = findSwapEvent(log.topics);
        if (topicIndex !== undefined && topicIndex >= 0) {
          logDataAndTopic = {
            data: log.data,
            topics: log.topics,
          };
          break;
        }
      }
    }
    if (logDataAndTopic?.data && logDataAndTopic.topics) {
      const web3 = new Web3(job.data.rpcURL);

      console.log(logDataAndTopic);
      console.log(swapEventInputs);

      const decodedLog = web3.eth.abi.decodeLog(
        swapEventInputs as any,
        logDataAndTopic.data,
        logDataAndTopic.topics.slice(1),
      );

      console.log(decodedLog);
    }
  }

  // console.log(topics);
};

const findSwapEvent = (topics: any[]) => {
  if (topics?.length) {
    return topics.findIndex(topic => topic === swapEventHash);
  } else {
    return undefined;
  }
};

export default worker;
