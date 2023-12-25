import { web3Service, axiosService, cosmWasmService } from './services';
import { getThreshold } from '../src/constants/constants';
export async function workerOnCompleted(job: any) {
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
      decodedData = cosmWasmService.getLogsFromTransactionReceipt(job);
      tx.from = decodedData.from;
      tx.hash = job.returnvalue.transactionHash;
    } else {
      if (job && !job.returnvalue) {
        console.info(`Get latest receipt`);
        job.returnvalue = await web3Service.getTransactionReceipt(
          job.data.txId,
          job.data.sourceRpcURL,
          getThreshold(job.data.threshold),
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

    console.log('signedData', job.returnvalue.status, signedData);
    axiosService.updateTransactionJobStatus(
      tx.hash,
      {
        signedData,
        transaction: tx,
        transactionReceipt: job?.returnvalue,
      },
      'master',
    );
  } catch (error) {
    console.error('error occured', error);
  }
}
