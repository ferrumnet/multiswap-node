import { setSecurityKey, getSecurityKey } from "../constants/constants";

export const setSecurityKeyForEncryption = (securityKey: string) => {
  setSecurityKey(getSecurityKey() + securityKey);
};
