import { ITimeStampedDocument } from '../plugins/timestamp-plugin';
import { IAddress } from '../Users/usertypes';

export interface ITenant extends ITimeStampedDocument {
  name: string;
  email: string;
  tenantNumber: number,
  businessName: string,
  phoneNumber: string,
  accountBalance: number,
  password: string,
  businessAddress: IAddress,
  history: [object],
  isActive: boolean,
  isVerified: boolean,
  status: boolean,
  countryCode: string
  userType: string
}

/* export interface ITenantInputs extends ITenant {
  phoneNumber: string
} */