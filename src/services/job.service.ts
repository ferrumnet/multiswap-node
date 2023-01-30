import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

const queue = new Queue(process.env.QUEUE as string);

export const addJobs = async (jobBody: any) => {
  const job = await queue.add(jobBody.name, jobBody.data);
  return job;
};
