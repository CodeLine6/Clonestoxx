// utils/upstox.js
import UpstoxMasterAccount from '../services/upstox/masterAccount.js';
import UpstoxChildAccount from '../services/upstox/childAccount.js';

export const createUpstoxMasterAccount = (masterAccountData) => {
  return new UpstoxMasterAccount(masterAccountData);
};

export const createUpstoxChildAccounts = (childAccountsData) => {
  return childAccountsData.map(({ account, modifierPercentage }) =>
    new UpstoxChildAccount({ ...account, modifierPercentage })
  );
};