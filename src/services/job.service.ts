import { Queue, Job } from 'bullmq';
import { JobRequestBody } from '../interfaces';
import dotenv from 'dotenv';
dotenv.config();

const queue = new Queue(process.env.QUEUE as string);

export const addJobs = async (jobBody: JobRequestBody): Promise<Job> => {
  const job = await queue.add(jobBody.name, jobBody);
  return job;
};

export const getJobById = async (jobId: string): Promise<any> => {
  const job = await queue.getJob(jobId);
  return job;
};
