import { ITimeStampedDocument } from '../plugins/timestamp-plugin';

export interface IUser extends ITimeStampedDocument {
  name: string;
  email: string;
  password: string;
  tenant: string,
  userNumber: number,
  userType: string,
  fullName: string,
  phoneNumber: [string],
  accountBalance: number,
  address: { phoneNumber: string, countryCode: string },
  businessAddress: { phoneNumber: string, countryCode: string },
  history: [object],
  isActive: boolean,
  isVerified: boolean,
  status: boolean,
  countryCode: string
}