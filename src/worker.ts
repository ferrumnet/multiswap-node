import { Worker } from 'bullmq';
import { web3Service } from './services';

const worker = new Worker(
  process.env.QUEUE as string,
  async job =>
    await web3Service.getTransactionReceipt(job.data.txId, job.data.rpcURL),
);
worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
  //   return job.data;
});

worker.on('failed', (job: any, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

export default worker;
