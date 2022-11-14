import { ITimeStampedDocument } from '../plugins/timestamp-plugin';

export interface IUser extends ITimeStampedDocument {
  _id: string;
  name: string;
  email: string;
  age?: string;
  sex?: string;
  weight?: string;
  password: string;
  tenant: string,
  userNumber: number,
  userType: string,
  fullName: string,
  phoneNumber: string,
  accountBalance: number,
  address: IAddress,
  history: [object],
  isActive: boolean,
  isVerified: boolean,
  status: boolean,
  countryCode: string
}

export interface IAddress {
  phoneNumber: string,
  countryCode: string
}

export interface IUserInput {
  _id? : string
  fullName: string,
  password: string,
  phoneNumber: string,
  userType: string,
  email: string,
  tenantId?: string,
  address: IAddress,
  age?: string;
  sex?: string;
  weight?: string;
}