# constants.ts

### Constants

-   `NAME`: A string constant representing the name of the fund manager ('FUND_MANAGER').
-   `VERSION`: A string constant that holds the version number ('000.004').
-   `CONTRACT_ADDRESS`: Ethereum contract address as a string.
-   `BEARER`: Prefix for authorization headers as a string ('Bearer ').
-   `RANDOM_KEY`: A string key used for cryptographic operations.
-   `CUDOS_CHAIN_ID`: A string representing the chain ID for Cudos network ('cudos-1').
-   `FOUNDARY`, `ONE_INCH`: String constants representing specific service names.
-   `NUMBER_OF_VALIDATORS_SHOULD_BE`: Numeric constant defining the required number of validators (1).

### Networks Configuration

-   `NETWORKS`: An array of objects, each containing network-specific addresses and identifiers for different blockchain networks.

### Functions

-   `getAllowedPublicAddress()`: Retrieves a list of allowed public addresses from an environment variable and returns it as an array. If no addresses are provided, it returns an empty array.

-   `isAllowedPublicAddress(nodeAddress: string)`: Checks if a given node address is in the list of allowed addresses. It performs a case-insensitive comparison and returns `true` if the address is allowed, otherwise `false`.

-   `isUniqueAddressesArray(arr: [any])`: Verifies that all addresses in the given array are unique. Returns `true` if all addresses are unique, `false` otherwise.

-   `checkForNumberOfValidators(arr: any)`: Checks if the number of items in the provided array matches the number of allowed validators. Returns `true` if they match, otherwise `false`.

-   `createAuthTokenForMultiswapBackend()`: Generates a time-bound authentication token for the Multiswap backend. It uses cryptographic functions to ensure the token's integrity and confidentiality.

-   `getPrivateKey()`: Retrieves and decrypts a private key stored in environment variables using another security key.

-   `encrypt(data: string, key: String)`: Encrypts the given data using AES with the provided key and returns the ciphertext. If an error occurs during encryption, it logs the error and returns an empty string.

-   `decrypt(data: string, key: string)`: Decrypts the given data using AES with the provided key and returns the original text. If decryption fails, it logs the error and returns an empty string.

-   `delay()`: Returns a promise that resolves after 30 seconds. This function can be used to introduce artificial delays.

-   `getThreshold(threshold: number)`: Calculates and returns twice the value of the provided threshold.

-   `getRpcNodesData()`: Fetches RPC node data from environment variables, parses it from JSON, and returns it.

These constants and functions are essential for the operations of a fund management system on blockchain networks, providing functionalities like authentication, configuration, and data integrity.

# IERC20

The IERC20.json file defines the interface for a standard ERC20 token, adhering to the Ethereum token standard specification. This interface includes essential functionalities for token transactions, including transfers, approvals, and balance checks.

# FiberRouter.json
Overview

The FiberRouter.json file from the ferrumnet/multiswap-node repository contains a JSON object representing a smart contract interface for a "Fiber Router." This interface is likely used to interact with blockchain networks, facilitating operations such as swapping, liquidity provision, or routing transactions across different platforms.

Interface Details

Contract Name: The JSON is an interface for a contract named FiberRouter.

Compiler Version: The interface was compiled with Solidity version 0.8.0.

Optimization Enabled: Yes, with 200 runs.

EVM Version: The target EVM version for this contract is specified as Default.

Methods

1. swapExactTokensForTokens

Type: Function

Inputs:

amountIn: The amount of input tokens to swap.

amountOutMin: The minimum amount of output tokens that must be received for the transaction not to revert.

path: An array of token addresses used to determine the swap route.

to: The address to send the output tokens to.

deadline: A timestamp by which the transaction must be completed, or it will revert.

Outputs:

Array: Returns an array of numbers indicating the amounts of tokens received for each swap in the path.

State Mutability: Nonpayable

Details: This method facilitates a token swap operation, ensuring that the number of output tokens received is at least the amountOutMin specified, following the swap path provided.

2. swapTokensForExactTokens

Type: Function

Inputs:

amountOut: The exact amount of output tokens to receive.

amountInMax: The maximum amount of input tokens that can be swapped.

path: The route of token addresses for the swap.

to: The recipient address for the output tokens.

deadline: The transaction deadline.

Outputs:

Array: Outputs the amounts of tokens spent for each swap in the path.

State Mutability: Nonpayable

Details: Allows users to specify the exact amount of tokens they want to receive, the method calculates and limits the input to amountInMax.

Events

1. Swap

Inputs:

sender: The address initiating the swap.

amountIn: The amount of input tokens provided for the swap.

amountOut: The amount of output tokens received from the swap.

tokenIn: The address of the input token.

tokenOut: The address of the output token.

to: The recipient address.

Details: This event is emitted after a successful swap operation, detailing the swap amounts and the addresses involved.

Conclusion

The FiberRouter.json file defines an interface for a contract facilitating token swaps on a blockchain network, providing methods for exact or minimum token swaps along specified paths. It also includes an event to log swap operations. This documentation should assist auditors in understanding the contract's functionalities and intended behaviors.

# utils.ts

### Function: `amountToHuman`

-   Purpose: Converts a machine-readable token amount to a human-readable format by adjusting for the token's decimal places.
-   Parameters:
    -   `web3`: An instance of a web3 library to interact with Ethereum nodes.
    -   `token`: The contract address of the token.
    -   `amount`: The amount in machine format (usually in smallest unit, like wei).
-   Returns: The human-readable string of the amount, or null if conversion fails.

### Function: `amountToMachine`

-   Purpose: Converts a human-readable token amount to a machine-readable format by accounting for the token's decimal places.
-   Parameters:
    -   `web3`: An instance of a web3 library.
    -   `token`: The contract address of the token.
    -   `amount`: The amount in human-readable format.
-   Returns: The machine-readable string of the amount, adjusted for decimals.

### Function: `erc20`

-   Purpose: Creates a new ERC20 contract instance using the provided web3 instance and token address.
-   Parameters:
    -   `web3`: An instance of a web3 library.
    -   `token`: The contract address of the token.
-   Returns: An instance of the ERC20 contract.

### Function: `decimals`

-   Purpose: Fetches the number of decimal places for a given token using its contract.
-   Parameters:
    -   `web3`: An instance of a web3 library.
    -   `token`: The contract address of the token.
-   Returns: The number of decimals as a number, or null if unable to fetch.

### Function: `removeExponential`

-   Purpose: Converts a number from exponential format to a plain string without exponential notation.
-   Parameters:
    -   `n`: The number in exponential format.
-   Returns: The formatted number as a string.

### Function: `numberIntoDecimals`

-   Purpose: Converts a number into a string representation with a specified number of decimals.
-   Parameters:
    -   `amount`: The number to convert.
    -   `decimal`: The number of decimal places.
-   Returns: The number formatted as a string with the specified number of decimals.

### Function: `decimalsIntoNumber`

-   Purpose: Converts a string with decimals into a number format.
-   Parameters:
    -   `amount`: The string containing the number.
    -   `decimal`: The number of decimal places.
-   Returns: The number as a formatted string based on the specified decimals.

### Function: `withSlippage`

-   Purpose: Adjusts a given value by a specified percentage to account for potential slippage in transactions.
-   Parameters:
    -   `value`: The original value.
    -   `slippage`: The slippage percentage to apply.
-   Returns: The value adjusted for slippage as a string.

These utility functions are crucial for handling and formatting blockchain-related numerical values, ensuring accurate calculations and displays for end-users.