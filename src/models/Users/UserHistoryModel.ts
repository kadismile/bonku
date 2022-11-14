import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from '../plugins/timestamp-plugin';
import { IUser } from './usertypes';

interface IUserHistoryModel extends Model<IUser> { }

const schema = new Schema<IUser>({
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'Please Add UserId']
  },
  fullName: {
    type: String,
    required: [true, 'Please Add Full Name']
  },
  phoneNumber: {
    type : String
  },
  tenant: {
    type: String,
    ref: 'Tenant',
  },
  status: {
    type: String,
    required: [true, 'Please Add Status']
  },

},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

const UserHistory: IUserHistoryModel = model<IUser, IUserHistoryModel>('UserHistory', schema);

export default UserHistory;