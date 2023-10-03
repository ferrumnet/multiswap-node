import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
let authorizationError = 'Authorization header missing';
let invalidToken = 'Invalid token';
import { decrypt } from '../constants/constants';

const auth =
  (...requiredRights: string[]) =>
  async (req: any, res: any, next: NextFunction) => {
    if (!req.headers.authorization) {
      return res.http401(authorizationError);
    } else {
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (validateAuth(token, req)) {
          next();
        } else {
          return res.http401(invalidToken);
        }
      } catch (error) {
        (global as any).log.error(error);
        return res.http401(invalidToken);
      }
    }
  };

function validateAuth(token: string, req: any): boolean {
  if (req.originalUrl.includes('securityKey')) {
    return authSecurityKeyApis(token);
  } else {
    return authJobApis(token);
  }
}

function authSecurityKeyApis(token: string): boolean {
  const privateKey = process.env.PRIVATE_KEY as string;
  if (token && decrypt(token, privateKey) == privateKey) {
    return true;
  }
  return false;
}

function authJobApis(token: string): boolean {
  if (
    token &&
    isAuthJobTokenValid(token, (global as any).AWS_ENVIRONMENT.API_KEY)
  ) {
    return true;
  }
  return false;
}

function isAuthJobTokenValid(token: any, key: string): boolean {
  let isValid = false;
  try {
    let decryptedToken = decrypt(token, key);
    if (decryptedToken) {
      let tokenIntoJsonObject = JSON.parse(decryptedToken);
      if (tokenIntoJsonObject) {
        let isDateValid = validateDates(tokenIntoJsonObject);
        if (isDateValid) {
          isValid = true;
        }
      }
    }
  } catch (e: any) {
    console.log(e);
    isValid = false;
  }

  return isValid;
}

function validateDates(data: any): boolean {
  try {
    if (data.startDateTime && data.endDateTime) {
      let currentDate = moment().utc();
      let startDate = moment(data.startDateTime).utc();
      let endDate = moment(data.endDateTime).utc();
      return currentDate.isBetween(startDate, endDate);
    }
  } catch (e: any) {
    console.log(e);
  }

  return false;
}
export default auth;
