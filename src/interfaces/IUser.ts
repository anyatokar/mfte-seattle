import { accountTypeEnum } from "../types/enumTypes";

interface IBaseSignupAuthData {
  email: string;
  name: string;
  uid: string;
  password: string;
}

export interface IManagerSignupAuthData extends IBaseSignupAuthData {
  accountType: accountTypeEnum.MANAGER;
  companyName: string;
  jobTitle: string;
}

export interface IUserSignupAuthData extends IBaseSignupAuthData {
  accountType: accountTypeEnum.RENTER;
}

export type SignupAuthData = IManagerSignupAuthData | IUserSignupAuthData;
