# index.ts

The `index.ts` file within the `src/interfaces` directory of the `ferrumnet/multiswap-node` repository serves as a central point for exporting modules. This file essentially organizes and makes accessible the defined modules in the project for periodic tasks.

# job.interface.ts

### 1\. `JobRequestBody`

This interface is used for defining the structure of a job request body. It contains the following properties:

-   name: `string` - The name of the job.
-   isSourceNonEVM: `boolean` - Indicates if the source is a non-EVM (Ethereum Virtual Machine) chain.
-   destinationRpcURL: `string` - The RPC URL of the destination chain.
-   isDestinationNonEVM: `boolean` - Indicates if the destination is a non-EVM chain.
-   bridgeAmount: `string` - The amount to bridge.
-   txId: `string` - Transaction ID associated with the job.
-   threshold: `number` - The threshold value for the job to be considered successful.
-   sourceAssetType: `string` - The type of asset at the source.
-   destinationAssetType: `string` - The type of asset at the destination.
-   destinationAmountIn: `string` - The input amount at the destination.
-   destinationAmountOut: `string` - The output amount at the destination.
-   sourceOneInchData: `string` - Data related to one inch service at the source.
-   destinationOneInchData: `string` - Data related to one inch service at the destination.
-   expiry: `number` - Expiry time for the job.
-   withdrawalData: `string` - Data related to the withdrawal process.
-   sourceChainId: `string` - Chain ID of the source.
-   destinationChainId: `string` - Chain ID of the destination.
-   slippage: `number` - Slippage percentage allowed for the transaction.

### 2\. `SignatureData`

This interface defines the structure for signature data used in transactions:

-   from: `string` - The originating address.
-   token: `string` - The token involved in the transaction.
-   amount: `string` - The amount of the token.
-   sourceChainId: `string` - The chain ID of the source.
-   targetChainId: `string` - The chain ID of the target.
-   targetToken: `string` - The target token in the swap.
-   sourceAddress: `string` - The address at the source.
-   targetAddress: `string` - The address at the target.
-   swapBridgeAmount: `string` - The amount for the bridge swap.
-   settledAmount: `string` - The amount that was settled in the transaction.
-   withdrawalData: `string` - Data related to the withdrawal process.

### 3\. `UpdateJobRequestBody`

This interface is utilized for updating a job request with transaction details:

-   transaction: `Transaction` - The transaction details.
-   transactionReceipt: `TransactionReceipt` - The receipt of the transaction.

### 4\. `RpcNode`

Defines the basic structure of an RPC node:

-   url: `string` - URL of the RPC node.
-   chainId: `string` - Chain ID associated with the RPC node.

This interface file helps in managing various aspects of job processing, signature verification, and RPC node interaction within the `multiswap-node` project.

# web3.interface.ts

### Interface: `Transaction`

-   hash: A string representing the hash of the transaction.
-   nonce: A number indicating the nonce of the transaction, which is a counter of the number of transactions sent from the sender's address.
-   blockHash: A string or null, representing the hash of the block in which this transaction was included.
-   blockNumber: A number or null, indicating the block number in which this transaction was included.
-   transactionIndex: A number or null, representing the transaction's index position in the block.
-   from: A string indicating the address from which the transaction was sent.
-   to: A string or null, representing the recipient's address of the transaction.
-   value: A string representing the value transferred in the transaction, in wei.
-   gasPrice: A string representing the gas price set by the sender, in wei.
-   maxPriorityFeePerGas: An optional number, string, or any, representing the maximum priority fee per gas that can be added to the transaction fee.
-   maxFeePerGas: An optional number, string, or any, indicating the maximum fee per gas that the sender is willing to pay.
-   gas: A number indicating the amount of gas used by the transaction.
-   input: A string representing additional data sent along with the transaction.

### Interface: `TransactionReceipt`

-   status: A boolean indicating whether the transaction was successful.
-   transactionHash: A string representing the hash of the transaction.
-   transactionIndex: A number representing the transaction's index within the block.
-   blockHash: A string representing the hash of the block in which the transaction was included.
-   blockNumber: A number indicating the block number of the transaction.
-   from: A string indicating the sender's address.
-   to: A string representing the recipient's address.
-   contractAddress: An optional string representing the contract address created, if the transaction was a contract creation.
-   cumulativeGasUsed: A number representing the total gas used in the block up until this transaction.
-   gasUsed: A number indicating the amount of gas used by this specific transaction.
-   effectiveGasPrice: A number representing the effective gas price paid for the transaction.
-   logs: An array of `Log` objects representing the logs generated by the transaction.
-   logsBloom: A string representing the bloom filter for the logs.
-   events: An optional object mapping event names to `EventLog` objects, representing events triggered during the transaction.

### Interface: `EventLog`

-   event: A string representing the name of the event.
-   address: A string indicating the address where the event occurred.
-   returnValues: Any type representing the values returned by the event.
-   logIndex: A number indicating the log's index in the block.
-   transactionIndex: A number representing the transaction's index within the block.
-   transactionHash: A string representing the hash of the transaction.
-   blockHash: A string representing the hash of the block.
-   blockNumber: A number indicating the block number.
-   raw: An optional object containing raw data (`data` as a string and `topics` as an array) associated with the event.

### Interface: `Log`

-   address: A string representing the address where the log originated.
-   data: A string representing the data contained in the log.
-   topics: An array of strings representing the topics associated with the log.
-   logIndex: A number indicating the log's index within the block.
-   transactionIndex: A number representing the transaction's index within the block.
-   transactionHash: A string representing the hash of the transaction.
-   blockHash: A string representing the hash of the block.
-   blockNumber: A number indicating the block number.
-   removed: A boolean indicating whether the log was removed from the blockchain (due to chain reorganization).