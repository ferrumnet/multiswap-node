import dotenv from 'dotenv';
import app from './app';
import transactionsJob from './crons/transactionsJob';
dotenv.config();

(async () => {
  transactionsJob();
})().catch(e => {
  console.log(e);
});

const server = app.listen(process.env.PORT, () => {
  console.info(`Listening to port ${process.env.PORT}`);
});
