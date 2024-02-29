import { RpcNode } from '../interfaces/index';
import { getRpcNodesData } from '../constants/constants';

export const getRpcNodeByChainId = function (chainId: string): RpcNode {
  let rpcNodes: any = getRpcNodesData();
  let data = { chainId: chainId, url: '' };
  try {
    if (rpcNodes && rpcNodes.length) {
      let item = rpcNodes.find((item: any) => item.chainId === chainId);
      return item ? item : data;
    }
  } catch (e) {
    console.log(e);
  }
  return data;
};
