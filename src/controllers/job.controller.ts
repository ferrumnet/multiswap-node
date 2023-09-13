import { Request, Response } from 'express';
import { jobService } from '../services';

export const createJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const job = await jobService.createJob(req.body.transaction);
    res.send({ message: 'success' });
  } catch (err) {
    console.error(err);
  }
};

export const getJob = async (req: Request, res: Response): Promise<any> => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.send(job);
  } catch (err) {
    console.error(err);
  }
};

export const getHealth = async (req: Request, res: Response): Promise<any> => {
  try {
    res.send('');
  } catch (err) {
    console.error(err);
  }
};
