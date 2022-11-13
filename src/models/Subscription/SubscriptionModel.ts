import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from '../plugins/timestamp-plugin';
import  SubscriptionAfterUpdate   from './subscription_after_update'
import  SubscriptionBeforeSave   from './subscription_before_save'

import { ISubscription } from './subscriptionTypes';

interface ISubscriptionModel extends Model<ISubscription> { }

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
  history: {
    type: Array,
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

schema.pre('findOneAndUpdate', async function(this, next) {
  await SubscriptionAfterUpdate(this, next)
});

schema.pre("save", async function(this, next) {
  await SubscriptionBeforeSave(this)
});


const Subscription: ISubscriptionModel = model<ISubscription, ISubscriptionModel>('Subscription', schema);

export default Subscription;