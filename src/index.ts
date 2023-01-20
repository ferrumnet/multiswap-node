import express, { Application } from 'express';
import { transactionPoolJob } from './cron';

const app: Application = express();

app.listen(process.env.PORT, () => {
  console.log('Multiswap Cron is Running!');
  transactionPoolJob();
});
