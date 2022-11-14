import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from '../plugins/timestamp-plugin';

import { ISubscription } from './subscriptionTypes';

interface IUserSubscriptionModel extends Model<ISubscription> { }

const schema = new Schema<ISubscription>({
  name: {
    type: String,
    required: [true, 'Please Add Subscription Name']
  },
  amount: {
    type: String,
    required: [true, 'Please Add Subscription Amount']
  },
  expiry: {
    type: String,
    required: [true, 'Please Add Full Name']
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
  userId: {
    type: String,
    optional: true,
  },

},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

schema.pre('findOne', async function() {
  this.where({ isActive: true })
});

schema.pre('find', async function() {
  this.where({ isActive: true })
});

const UserSubscription: IUserSubscriptionModel = model<ISubscription, IUserSubscriptionModel>('UserSubscription', schema);

export default UserSubscription;