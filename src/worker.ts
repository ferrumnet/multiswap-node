import { Worker } from 'bullmq';
import { web3Service, axiosService } from './services';

const worker = new Worker(
  process.env.QUEUE as string,
  async job =>
    await web3Service.getTransactionReceipt(job.data.txId, job.data.rpcURL),
);
worker.on('completed', async job => {
  console.info(`${job.id} has completed!`);
  const tx = await web3Service.getTransactionByHash(
    job.data.txId,
    job.data.rpcURL,
  );
  axiosService.updateTransactionJobStatus(tx.hash, tx);
});

worker.on('failed', async (job: any, err) => {
  console.info(`${job.id} has failed with ${err.message}`);
  const tx = await web3Service.getTransactionByHash(
    job.data.txId,
    job.data.rpcURL,
  );
  axiosService.updateTransactionJobStatus(tx.hash, tx);
});

export default worker;
