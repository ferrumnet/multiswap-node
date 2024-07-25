# index.ts

The `index.ts` file within the `src/crons` directory of the `ferrumnet/multiswap-node` repository serves as a central point for exporting cron job modules. This file essentially organizes and makes accessible the cron jobs defined in the project for periodic tasks.

Here's a detailed documentation of each function in the file `transactionsJob.ts` from the repository:

# transactionsJob.ts

1.  Module Imports and Initializations:

    -   `node-cron` is required for scheduling tasks.
    -   Services like `axiosService` and `transactionService` are imported from the `../services` directory.
    -   `isProccessRunning` is a boolean flag to prevent overlapping job executions.
    -   `localTransactionHashes` stores transaction hashes locally to avoid reprocessing.
2.  `transactionsJob` Function:

    -   An asynchronous function that triggers the `start` function to initiate the job.
3.  `start` Function:

    -   Schedules a recurring task every 5 seconds.
    -   If `isProccessRunning` is false, it calls `triggerJobs` to process transactions.
    -   Handles errors by logging them.
4.  `triggerJobs` Function:

    -   Retrieves transactions through `axiosService.getTransactions()`.
    -   If transactions are present, sets `isProccessRunning` to true, processes each transaction via `handleJob`, and then sets `isProccessRunning` to false.
5.  `handleJob` Function:

    -   Processes an individual transaction.
    -   Checks if the transaction hash is in the local list using `isHashInLocalList`.
    -   If not, adds it to the list with `addTransactionHashInLocalList` and then processes the transaction using `transactionService.prepareObjectsAndVerifySignatures`.
6.  `addTransactionHashInLocalList` Function:

    -   Adds a new hash to the `localTransactionHashes` array to keep track of processed transactions.
7.  `removeTransactionHashFromLocalList` Function:

    -   Removes a hash from the `localTransactionHashes` array, used when a transaction no longer needs to be tracked.
8.  `isHashInLocalList` Function:

    -   Checks if a given hash is already in the `localTransactionHashes` array.

Each function is designed to handle specific aspects of transaction processing within a job that runs every few seconds, ensuring that transactions are not processed multiple times and handling errors gracefully.