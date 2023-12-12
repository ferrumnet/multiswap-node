import moment from 'moment';
var crypto = require('crypto');
var CryptoJS = require('crypto-js');

export const NAME = 'FERRUM_TOKEN_BRIDGE_POOL';
export const VERSION = '000.004';
export const CONTRACT_ADDRESS = '0x9aFe354fb34a6303a9b9C89fF43A509A5320ba2D';
export const BEARER = 'Bearer ';
export const RANDOM_KEY =
  'AnanlJwzC/5MKcsT5nMr25zLrXIBx13byMYNKcXDp0ppI4Dn5YTQtU2WNp9PAKGi';
export const CUDOS_CHAIN_ID = 'cudos-1';
export const THRESHOLD = 360;
export const NUMBER_OF_VALIDATORS_SHOULD_BE = 1;
let SECURITY_KEY = '';

export const getSecurityKey = function () {
  return SECURITY_KEY;
};

export const setSecurityKey = function (securityKey: string) {
  SECURITY_KEY = securityKey;
};
export const NETWORKS = [
  {
    chainId: '56',
    fundManagerAddress: '0x6697fA48f7335F4D59655aA4910F517ec4109987',
    fiberRouterAddress: '0x4826e896E39DC96A8504588D21e9D44750435e2D',
    foundaryTokenAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  },
  {
    chainId: '250',
    fundManagerAddress: '0x84e7D09522bC21DB1Ef6a6Ed4D49E8297249fec6',
    fiberRouterAddress: '0x4EdD64681098b42D777EC3D9C5c3339F91e009a1',
    foundaryTokenAddress: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  },
  {
    chainId: '137',
    fundManagerAddress: '0x2e3531220bE6781bbDb1E5F67eEB89A0F7108B8A',
    fiberRouterAddress: '0xda255aC784396C1f87629c140D79fa14B25B9b6F',
    foundaryTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  {
    chainId: '42161',
    fundManagerAddress: '0x0726d77Af8dF099426117C4912AB5Cc6490c280e',
    fiberRouterAddress: '0x55D97822F1F4e802250e6D2eF7770094572e571B',
    foundaryTokenAddress: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  },
  {
    chainId: '43114',
    fundManagerAddress: '0x9CdAe082309Fb2E5d76BeDAc15eE616d013C2c35',
    fiberRouterAddress: '0x8ae54Cc66eb2Ad5258D3AAD9e838500670dBaEA8',
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
  let encryptedSessionToken = encrypt(
    strTokenBody,
    (global as any).AWS_ENVIRONMENT.API_KEY,
  );
  return encryptedSessionToken;
};

export const getPrivateKey = function () {
  const privateKey = process.env.PRIVATE_KEY as string;
  return decrypt(privateKey, SECURITY_KEY);
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
