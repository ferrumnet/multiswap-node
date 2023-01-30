import { Request, Response } from 'express';
import { jobService } from '../services';

export const createJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const job = await jobService.addJobs(req.body);
    res.send(job.id);
  } catch (err) {
    console.error(err);
  }
};
