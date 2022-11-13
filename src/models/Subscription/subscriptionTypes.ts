import { ITimeStampedDocument } from '../plugins/timestamp-plugin';

export interface ISubscription extends ITimeStampedDocument {
  name: string;
  expiry: string;
  isActive: boolean;
  action: string;
  amount: string;
}