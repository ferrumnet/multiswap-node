import moment from 'moment';
var crypto = require('crypto');
var CryptoJS = require('crypto-js');

export const NAME = 'FUND_MANAGER';
export const VERSION = '000.004';
export const CONTRACT_ADDRESS = '0x9aFe354fb34a6303a9b9C89fF43A509A5320ba2D';
export const BEARER = 'Bearer ';
export const RANDOM_KEY =
  'AnanlJwzC/5MKcsT5nMr25zLrXIBx13byMYNKcXDp0ppI4Dn5YTQtU2WNp9PAKGi';
export const CUDOS_CHAIN_ID = 'cudos-1';
export const FOUNDARY = 'Foundary';
export const ONE_INCH = '1Inch';
export const NUMBER_OF_VALIDATORS_SHOULD_BE = 1;
export const NETWORKS = [
  {
    chainId: '1',
    fundManagerAddress: '0x5eBeF0bD015e4fAfe64172Ae00b9bB46a05906a7',
    fiberRouterAddress: '0x4B87Ab46B56990Aff03dAD1caFEb33e760879d97',
    foundaryTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  {
    chainId: '56',
    fundManagerAddress: '0xBFE96b3524a5d31B803BA133844C002Beaa79373',
    fiberRouterAddress: '0x4B87Ab46B56990Aff03dAD1caFEb33e760879d97',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0x4Ba81924a6D7DaF6Dba27783168E5b6345D6A896',
    fiberRouterAddress: '0xb73A2a6cd7297844B1CbfcFfEb2884bEaf4C22B1',
    foundaryTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  {
    chainId: '10',
    fundManagerAddress: '0x7655eE1bd794b0Fe4b9B4D477B0F5cCABD78137c',
    fiberRouterAddress: '0x6a34da798839964e14850F585187f3d28079a500',
    foundaryTokenAddress: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x41eFd89cbeaCeCdf72d3fD8321C53A69A132CC1a',
    fiberRouterAddress: '0x9cc84e262E3A2A6b8C257d493E3d3487495fb5a2',
    foundaryTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
];

const getAllowedPublicAddress = function (): [] {
  let allowedAddress = process.env.ALLOWED_VALIDATOR_ADDRESSES;
  if (allowedAddress) {
    let allowedAddressInArray: [] = JSON.parse(
      allowedAddress ? allowedAddress : '',
    );
    return allowedAddressInArray;
  }
  return [];
};

export const isAllowedPublicAddress = function (nodeAddress: string): boolean {
  let allowedAddress = getAllowedPublicAddress();
  if (allowedAddress && allowedAddress?.length > 0) {
    for (let index = 0; index < allowedAddress.length; index++) {
      let address: string = allowedAddress[index];
      if (nodeAddress?.toLowerCase() == address?.toLowerCase()) {
        return true;
      }
    }
  }
  return false;
};

export const isUniqueAddressesArray = function (arr: [any]): boolean {
  var tmpArr = [];
  if (arr?.length > 0) {
    for (var obj in arr) {
      if (tmpArr.indexOf(arr[obj]?.address?.toLowerCase()) < 0) {
        tmpArr.push(arr[obj]?.address?.toLowerCase());
      } else {
        return false;
      }
    }
  }
  return true;
};

export const checkForNumberOfValidators = function (arr: any): boolean {
  if (arr?.length > 0 && arr?.length == getAllowedPublicAddress().length) {
    return true;
  }
  return false;
};

export const createAuthTokenForMultiswapBackend = function () {
  let timelapse = 1;
  let currentTime = new Date();
  let startDateTime = moment(currentTime)
    .subtract('minutes', timelapse)
    .utc()
    .format();
  let endDateTime = moment(currentTime)
    .add('minutes', timelapse)
    .utc()
    .format();
  let randomKey = crypto.randomBytes(512).toString('hex');
  let tokenBody: any = {};
  tokenBody.startDateTime = startDateTime;
  tokenBody.endDateTime = endDateTime;
  tokenBody.randomKey = randomKey;

  let strTokenBody = JSON.stringify(tokenBody);
  let apiKey = process.env.API_KEY as string;
  let encryptedSessionToken = encrypt(strTokenBody, apiKey);
  return encryptedSessionToken;
};

export const getPrivateKey = function () {
  const privateKey = process.env.PRIVATE_KEY as string;
  const securityKey = process.env.SECURITY_KEY as string;
  return decrypt(privateKey, securityKey);
};

export const encrypt = function (data: string, key: String) {
  try {
    var ciphertext = CryptoJS.AES.encrypt(data, key).toString();
    return ciphertext;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const decrypt = function (data: string, key: string) {
  try {
    var bytes = CryptoJS.AES.decrypt(data, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const delay = function () {
  return new Promise(resolve => {
    setTimeout(resolve, 30000);
  });
};

export const getThreshold = function (threshold: number) {
  return threshold * 2;
};

export const getRpcNodesData = function () {
  let data = process.env.RPC_NODES;
  if (data) {
    data = JSON.parse(data ? data : '');
  }
  return data;
};
