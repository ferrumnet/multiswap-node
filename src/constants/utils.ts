import erc20Abi from '../constants/IERC20.json';
const { Big } = require('big.js');
const { ethers } = require('ethers');

export const amountToHuman = async (
  web3: any,
  token: string,
  amount: string,
) => {
  let decimal = await decimals(web3, token);
  if (decimal) {
    let decimalFactor = 10 ** decimal;
    return new Big(amount).div(decimalFactor).toFixed();
  }
  return null;
};

export const amountToMachine = async (
  web3: any,
  token: string,
  amount: string,
) => {
  let decimal = await decimals(web3, token);
  let decimalFactor = 10 ** decimal;
  return new Big(amount).times(decimalFactor).toFixed(0);
};

const erc20 = (web3: any, token: string) => {
  return new web3.eth.Contract(erc20Abi as any, token);
};

export const decimals = async (web3: any, token: string) => {
  if (web3 && token) {
    let con = erc20(web3, token);
    if (con) {
      return await con.methods.decimals().call();
    }
  }
  return null;
};

export const removeExponential = function (n: any) {
  var sign = +n < 0 ? '-' : '',
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);
  return +pow < 0
    ? sign +
        '0.' +
        '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
        lead +
        decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + '.' + decimal.slice(+pow));
};

export const numberIntoDecimals = function (amount: any, decimal: any) {
  amount = Big(amount);
  decimal = Big(10 ** Number(decimal));
  let formattedValue = amount.mul(decimal);
  formattedValue = removeExponential(formattedValue.toString());
  formattedValue = parseInt(formattedValue);
  formattedValue = removeExponential(formattedValue.toString());
  return formattedValue;
};

export const decimalsIntoNumber = function (amount: any, decimal: any) {
  const bigNumberValue = ethers.BigNumber.from(amount.toString());
  let formattedValue = ethers.utils.formatUnits(bigNumberValue, decimal);
  formattedValue = removeExponential(formattedValue.toString());
  return formattedValue;
};

export const withSlippage = function (value: any, slippage: number) {
  let slippageProportion = 100 - slippage;
  let valueWithSlippage = (value * slippageProportion) / 100;
  valueWithSlippage = removeExponential(valueWithSlippage.toString());
  return valueWithSlippage;
};
