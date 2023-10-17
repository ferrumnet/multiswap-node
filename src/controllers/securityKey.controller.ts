import { Request, Response } from "express";
import { securityKeyService } from "../services";

export const setSecurityKey = async (req: any, res: any): Promise<any> => {
  try {
    if (!req.body.securityKey) {
      return res.http401("securityKey is required");
    }
    securityKeyService.setSecurityKeyForEncryption(req.body.securityKey);
    return res.http200({});
  } catch (err) {
    console.error(err);
  }
};
