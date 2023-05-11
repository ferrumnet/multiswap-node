import { Worker } from 'bullmq';
import { web3Service, axiosService, cosmWasmService } from './services';

const worker = new Worker(
  process.env.QUEUE as string,
  async job => {
    if (job.data.isSourceNonEVM != null && job.data.isSourceNonEVM) {
      console.log('isSourceNonEVM', true);
      await cosmWasmService.getTransactionReceipt(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    } else {
      console.log('isSourceNonEVM', false);
      await web3Service.getTransactionReceipt(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST as string,
      port: Number(process.env.REDIS_PORT) as number,
    },
  },
);
worker.on('completed', async job => {
  try {
    let decodedData;
    let tx: any = {};
    let signedData;
    console.info(`${job.id} has completed!`);
    if (job.data.isSourceNonEVM != null && job.data.isSourceNonEVM) {
      job.returnvalue = await cosmWasmService.getTransactionReceipt(
        job.data.txId,
        job.data.sourceRpcURL,
      );
      // this needs to change
      decodedData = cosmWasmService.getLogsFromTransactionReceipt(job);
      tx.from = decodedData.from;
    } else {
      if (job && !job.returnvalue) {
        console.info(`Get latest receipt`);
        job.returnvalue = await web3Service.getTransactionReceipt(
          job.data.txId,
          job.data.sourceRpcURL,
        );
      }
      decodedData = web3Service.getLogsFromTransactionReceipt(job);
      tx = await web3Service.getTransactionByHash(
        job.data.txId,
        job.data.sourceRpcURL,
      );
    }
    console.info('decodedData', decodedData);

    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      signedData = await cosmWasmService.signedTransaction(
        job,
        decodedData,
        tx,
      );
    } else {
      signedData = await web3Service.signedTransaction(job, decodedData, tx);
    }

    console.log('signedData', signedData);
    // axiosService.updateTransactionJobStatus(tx.hash, {
    //   signedData,
    //   transaction: tx,
    //   transactionReceipt: job?.returnvalue,
    // });
  } catch (error) {
    console.error('error occured', error);
  }
});

worker.on('failed', async (job: any, err) => {
  console.info(`${job.id} has failed with ${err.message}`);
  const tx = await web3Service.getTransactionByHash(
    job.data.txId,
    job.data.sourceRpcURL,
  );
  axiosService.updateTransactionJobStatus(tx.hash, {
    transaction: tx,
    transactionReceipt: job?.returnvalue,
  });
});

export default worker;
