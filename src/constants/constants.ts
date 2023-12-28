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
    chainId: '56',
    fundManagerAddress: '0xbbf9c58D7fbfb3910ec3D22119c89715aca81Ae0',
    fiberRouterAddress: '0x956DC094C1Ca37CC22B2047b9Ab13FC6eC124900',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  {
    chainId: '250',
    fundManagerAddress: '0x354CBFc2894d45a584a9Fd0223cf58495cE3cF7F',
    fiberRouterAddress: '0xAA209557B51C28a8D050fB500e67498EB3d1d92b',
    foundaryTokenAddress: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  },
  {
    chainId: '137',
    fundManagerAddress: '0x1c0E4e27871162d350Ef66c275DFb02ca359f013',
    fiberRouterAddress: '0x6F40269932cdac97F977A89F69f939b1F0411308',
    foundaryTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0xf9d6a8918e41dc36cbd86b30c525401e1f45ce58',
    fiberRouterAddress: '0x11c7deb29d992b5deacb4c7b0e85d335e0178794',
    foundaryTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x81A536479Af0FE02Ec2aC6BB59Db305aa72a774f',
    fiberRouterAddress: '0x066599eD3abB7Eaf517119d376254af13871e5B1',
    foundaryTokenAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
  {
    chainId: '245022934',
    fundManagerAddress: '0xE6ff690CC7B91A2B626F7A76Fe507028bc1Eb12D',
    fiberRouterAddress: '0x2234157B16637AfA6f1A7C1C34b1b80D82b50D82',
    foundaryTokenAddress: '0xea6b04272f9f62f997f666f07d3a974134f7ffb9',
  },
];

export const isAllowedPublicAddress = function (nodeAddress: string): boolean {
  let allowedAddress = process.env.ALLOWED_VALIDATOR_ADDRESS;
  if (allowedAddress) {
    let allowedAddressInArray = JSON.parse(
      allowedAddress ? allowedAddress : '',
    );
    if (allowedAddressInArray?.length > 0) {
      for (let index = 0; index < allowedAddressInArray.length; index++) {
        let address = allowedAddressInArray[index];
        if (nodeAddress?.toLowerCase() == address?.toLowerCase()) {
          return true;
        }
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
  if (arr?.length > 0 && arr?.length == NUMBER_OF_VALIDATORS_SHOULD_BE) {
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
    console.log('decrypt error', e);
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
