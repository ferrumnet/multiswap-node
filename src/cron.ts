import { CronJob } from 'cron';
import Web3 from 'web3';
import { getNetworkList, getTransactionReceiptFromLogs } from './helper';

export const transactionPoolJob = () => {
  const job = new CronJob('*/10 * * * * *', async () => {
    const visitedNetworkBlocks: any = {};
    console.log('You will see this message every 10 second');
    const networks = await getNetworkList();
    // console.log(networks);
    for (const network of networks) {
      if (network?.chainId !== 'cudos-1') {
        console.log(network?.name);

        const web3 = new Web3(network.rpcUrl);
        const currentBlock = await web3.eth.getBlockNumber();
        let networkContractLogs;
        if (visitedNetworkBlocks[network?.name]) {
          networkContractLogs = await web3.eth.getPastLogs({
            fromBlock: visitedNetworkBlocks[network?.name],
            toBlock: currentBlock,
            address: network.contractAddress,
          });
        } else {
          networkContractLogs = await web3.eth.getPastLogs({
            fromBlock: currentBlock,
            toBlock: currentBlock,
            address: network.contractAddress,
          });
        }
        console.log(networkContractLogs.length);
        visitedNetworkBlocks[network?.name] = currentBlock;
        getTransactionReceiptFromLogs(web3, networkContractLogs);
      }
    }
  });
  job.start();
};
