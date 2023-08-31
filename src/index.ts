import dotenv from 'dotenv';
import app from './app';
import './worker';
dotenv.config();

const server = app.listen(process.env.PORT, () => {
  console.info(`Listening to port ${process.env.PORT}`);
});
