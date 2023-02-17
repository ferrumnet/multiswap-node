import Web3 from 'web3';
import { TransactionReceipt, Transaction } from '../interfaces';
import { abi as contractABI } from '../constants/FiberRouter.json';
import { NAME, VERSION } from '../constants/constants';
import { ethers } from 'ethers';

export const getTransactionReceipt = async (
  txId: string,
  rpcURL: string,
): Promise<TransactionReceipt> => {
  const web3 = new Web3(rpcURL);
  const transaction: TransactionReceipt = await web3.eth.getTransactionReceipt(
    txId,
  );
  if (transaction === null || transaction.status === null) {
    getTransactionReceipt(txId, rpcURL);
  }
  return transaction;
};

export const getTransactionByHash = async (
  txHash: string,
  rpcURL: string,
): Promise<Transaction> => {
  const web3 = new Web3(rpcURL);
  return web3.eth.getTransaction(txHash);
};

export const signedTransaction = async (
  rpcURL: string,
  tx: any,
): Promise<any> => {
  try {
    const web3 = new Web3(rpcURL);
    const inter = new ethers.utils.Interface(contractABI);
    const decodedInput = inter.parseTransaction({
      data: tx.input,
      value: tx.value,
    });
    const txData = {
      transactionHash: tx.hash,
      from: tx.from,
      token: decodedInput.args[0],
      amount: decodedInput.args[1].toString(),
      contractAddress: tx.to,
      chainId: web3.utils.hexToNumberString(tx.chainId.toString()),
      targetChainId: decodedInput.args[2].toString(),
      targetToken: decodedInput.args[3],
      targetAddress: decodedInput.args[4],
      signatures: [],
      salt: '',
    };

    txData.salt = Web3.utils.keccak256(
      txData.transactionHash.toLocaleLowerCase(),
    );
    const payBySig = createSignedPayment(
      txData.chainId,
      txData.from,
      txData.amount,
      txData.token,
      txData.contractAddress,
      txData.salt,
      web3,
    );
    return { ...txData, signatures: payBySig.signatures, hash: payBySig.hash };
  } catch (error) {
    console.error('Error occured while decoding transaction', error);
  }
};

const createSignedPayment = (
  chainId: string,
  address: string,
  amount: string,
  token: string,
  contractAddress: string,
  salt: string,
  web3: Web3,
) => {
  const payBySig = produceSignatureWithdrawHash(
    web3,
    chainId,
    contractAddress,
    token,
    address,
    amount,
    salt,
  );
  const privateKey = process.env.PRIVATE_KEY as string;
  const sign = web3.eth.accounts.sign(payBySig.hash, privateKey);
  payBySig.signatures = [{ signature: sign.signature } as any];
  return payBySig;
};
const produceSignatureWithdrawHash = (
  web3: Web3,
  chainId: string,
  contractAddress: string,
  token: string,
  payee: string,
  amount: string,
  swapTxId: string,
): any => {
  const methodHash = Web3.utils.keccak256(
    Web3.utils.utf8ToHex(
      'WithdrawSigned(address token,address payee,uint256 amount,bytes32 salt)',
    ),
  );
  const params = ['bytes32', 'address', 'address', 'uint256', 'bytes32'];
  const structure = web3.eth.abi.encodeParameters(params, [
    methodHash,
    token,
    payee,
    amount,
    swapTxId,
  ]);
  const structureHash = Web3.utils.keccak256(structure);
  const ds = domainSeparator(web3, chainId, contractAddress);
  const hash = Web3.utils.soliditySha3('\x19\x01', ds, structureHash);
  return {
    contractName: NAME,
    contractVersion: VERSION,
    contractAddress: contractAddress,
    amount,
    payee,
    signatures: [],
    token,
    swapTxId,
    sourceChainId: 0,
    toToken: '',
    hash,
  };
};

const domainSeparator = (
  web3: Web3,
  chainId: string,
  contractAddress: string,
) => {
  const hashedName = Web3.utils.keccak256(Web3.utils.utf8ToHex(NAME));
  const hashedVersion = Web3.utils.keccak256(Web3.utils.utf8ToHex(VERSION));
  const typeHash = Web3.utils.keccak256(
    Web3.utils.utf8ToHex(
      'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)',
    ),
  );
  return Web3.utils.keccak256(
    web3.eth.abi.encodeParameters(
      ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
      [typeHash, hashedName, hashedVersion, chainId, contractAddress],
    ),
  );
};
