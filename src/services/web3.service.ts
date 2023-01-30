import Web3 from 'web3';

export const getTransactionReceipt = async (txId: string, rpcURL: string) => {
  const web3 = new Web3(rpcURL);
  let transaction: any;
  while (
    transaction &&
    (transaction.status === null || transaction.status === 'pending')
  ) {
    transaction = await web3.eth.getTransactionReceipt(txId);
  }
  return transaction;
};
