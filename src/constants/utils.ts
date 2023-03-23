import erc20Abi from '../constants/IERC20.json';
var { Big } = require("big.js");

export const amountToHuman = async (
    web3: any,
    token: string,
    amount: string
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
    amount: string
) => {
    let decimal = await decimals(web3, token);
    let decimalFactor = 10 ** decimal;
    return new Big(amount).times(decimalFactor).toFixed(0);
};

const erc20 = (
    web3: any,
    token: string
) => {
    return new web3.eth.Contract(erc20Abi as any, token);
};

const decimals = async (
    web3: any,
    token: string
) => {
    if (web3 && token) {
        let con = erc20(web3, token)
        if (con) {
            return await con.methods.decimals().call();
        }
    }
    return null;
}