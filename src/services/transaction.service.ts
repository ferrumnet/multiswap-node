import { axiosService, web3Service, signatureService } from './index';
import { removeTransactionHashFromLocalList } from '../crons/transactionsJob';
import { JobRequestBody, SignatureData } from '../interfaces/index';
import { getThreshold } from '../constants/constants';

export async function prepareObjectsAndVerifySignatures(tx: any) {
  if (tx) {
    let sourceNetwork = tx.sourceNetwork;
    let destinationNetwork = tx.destinationNetwork;
    let sourceRpc = sourceNetwork.multiswapNetworkFIBERInformation.rpcUrl;
    let destinationRpc =
      destinationNetwork.multiswapNetworkFIBERInformation.rpcUrl;

    let data: JobRequestBody = {
      name: '',
      isSourceNonEVM: sourceNetwork.isNonEVM,
      destinationRpcURL: destinationRpc,
      isDestinationNonEVM: destinationNetwork.isNonEVM,
      bridgeAmount: tx.bridgeAmount,
      txId: tx.receiveTransactionId,
      threshold: sourceNetwork.threshold,
      sourceAssetType: tx.sourceAssetType,
      destinationAssetType: tx.destinationAssetType,
      destinationAmountIn: tx.destinationAmountIn,
      destinationAmountOut: tx.destinationAmountOut,
      sourceOneInchData: tx.sourceOneInchData,
      destinationOneInchData: tx.destinationOneInchData,
      expiry: tx.signatureExpiry,
      withdrawalData: tx.withdrawalData,
      sourceChainId: sourceNetwork.chainId,
      destinationChaibId: destinationNetwork.chainId,
      slippage: tx.slippage,
    };

    let signatureData: SignatureData = {
      from: tx.sourceWalletAddress,
      token: tx.sourceToken,
      amount: tx.sourceAmountInMachine,
      sourceChainId: sourceNetwork.chainId,
      targetChainId: destinationNetwork.chainId,
      targetToken: tx.targetToken,
      sourceAddress: tx.sourceWalletAddress,
      targetAddress: tx.destinationWalletAddress,
      swapBridgeAmount: tx.sourceBridgeAmount,
      settledAmount: tx.settledAmount,
      withdrawalData: tx.withdrawalData,
    };
    let job: any = {
      data: data,
      transaction: tx,
      signatureData: signatureData,
    };
    await verifySignatures(job);
  }
}

export async function verifySignatures(job: any) {
  try {
    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      // let sd = await cosmWasmService.signedTransaction(job, decodedData, tx);
      // if (cosmWasmService.validateSignature(job, sd.signatures) == false) {
      //   await updateTransaction(job);
      // }
    } else {
      let sd = await web3Service.signedTransaction(
        job,
        getGeneratorHash(job.transaction),
      );
      if (
        (await signatureService.validateSignature(job, sd.signatures)) == false
      ) {
        await updateTransaction(job.data.txId, null, true);
        return;
      }
    }
    await createWithdrawalSignature(job);
  } catch (error) {
    console.error('error occured', error);
  }
}

export async function createWithdrawalSignature(job: any) {
  try {
    let tx: any = {};
    let signedData;
    if (job.data.isDestinationNonEVM != null && job.data.isDestinationNonEVM) {
      // signedData = await cosmWasmService.signedTransaction(
      //   job,
      //   decodedData,
      //   tx,
      // );
    } else {
      signedData = await web3Service.signedTransaction(job, '');
    }
    await updateTransaction(job.data.txId, signedData, false);
  } catch (error) {
    console.error('error occured', error);
  }
}

export async function updateTransaction(
  txId: string,
  signedData: any,
  isValidationFailed: boolean,
) {
  try {
    await axiosService.updateTransaction(
      txId,
      {
        signedData,
      },
      isValidationFailed,
    );
    removeTransactionHashFromLocalList(txId);
  } catch (error) {
    console.error('error occured', error);
  }
}

export const getGeneratorHash = (tx: any): string => {
  try {
    let signatures = tx?.generatorSig?.signatures;
    if (signatures?.length > 0) {
      let signature = signatures[0];
      return signature.hash;
    }
  } catch (e) {
    console.log(e);
  }
  return '';
};
