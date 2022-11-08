import { ITimeStampedDocument } from '../plugins/timestamp-plugin';

export interface IUser extends ITimeStampedDocument {
  name: string;
  email: string;
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
}// 0005399308 Access Diamond Edmun 

export interface IUserInput {
    fullName: string,
    password: string,
    phoneNumber: string,
    userType: string,
    email: string,
    address: IAddress
}