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
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '56',
    fundManagerAddress: '0xF44a80eAe2E93b435D62967663701AD5F2Ec7650',
    fiberRouterAddress: '0x99d3Fa0Cf0a5C748F357028De4AdF50072098e72',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0xB9f5302D6b271FBa79f9415ACe14E127Ad17e3aE',
    fiberRouterAddress: '0x04d4E91bb4C4c1d90149CFf98894a27b487470fA',
    foundaryTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '0x99452be41556b4e8E265b764A06676AAE90B12D5',
  },
  {
    chainId: '10',
    fundManagerAddress: '0x7655eE1bd794b0Fe4b9B4D477B0F5cCABD78137c',
    fiberRouterAddress: '0x6a34da798839964e14850F585187f3d28079a500',
    foundaryTokenAddress: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x41eFd89cbeaCeCdf72d3fD8321C53A69A132CC1a',
    fiberRouterAddress: '0x9cc84e262E3A2A6b8C257d493E3d3487495fb5a2',
    foundaryTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    aggregateRouterContractAddress: '',
  },
  {
    chainId: '8453',
    fundManagerAddress: '0x6C2aEfE5E6BF22F238E2142b3f539Ee40fbE0288',
    fiberRouterAddress: '0xb4748e06367FA8ee1d616a668649643605Fac3d5',
    foundaryTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    aggregateRouterContractAddress:
      '0x111111125421ca6dc452d289314280a0f8842a65',
    cctpFundManager: '0xbE6E744400C1398D9Aa88Cd89588f82687444D8c',
  },
  {
    chainId: '324',
    fundManagerAddress: '0x09a3078fdb233e3De911cFba3D49D6902d29E36F',
    fiberRouterAddress: '0x60ACb601eaE3ec5F9BC7679F20128b07Fc703Dbd',
    foundaryTokenAddress: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    aggregateRouterContractAddress:
      '0x6fd4383cb451173d5f9304f041c7bcbf27d561ff',
  },
  {
    chainId: '534352',
    fundManagerAddress: '0x7022a2dE2434AbA5985e87A84E93E5C9Cc3AB05F',
    fiberRouterAddress: '0x17BD1758A7d954AD3a0BD7Cf530932397374273f',
    foundaryTokenAddress: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    aggregateRouterContractAddress:
      '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
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
