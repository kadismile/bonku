import { ITimeStampedDocument } from '../plugins/timestamp-plugin';

export interface ITenant extends ITimeStampedDocument {
  name: string;
  email: string;
  tenantNumber: number,
  fullName: string,
  phoneNumber: [string],
  accountBalance: number,
  address: string,
  businessAddress: string,
  history: [object],
  isActive: boolean,
  isVerified: boolean,
  status: boolean,
  countryCode: string
}