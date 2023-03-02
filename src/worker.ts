import { Worker } from 'bullmq';
import { web3Service, axiosService } from './services';

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
    const decodedData = web3Service.getLogsFromTransactionReceipt(job);
    const tx = await web3Service.getTransactionByHash(
      job.data.txId,
      job.data.rpcURL,
    );
    const signedData = await web3Service.signedTransaction(job, decodedData);
    axiosService.updateTransactionJobStatus(tx.hash, { signedData, tx });
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

export default worker;
