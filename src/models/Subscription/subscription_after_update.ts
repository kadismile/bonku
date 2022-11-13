import { NextFunction } from 'express';
import { ISubscription } from './subscriptionTypes';
import User from './SubscriptionModel';

const UserAfterUpdate = async ( model: any, next: any) => {

  const oldDoc: any  = await User.findById(model._conditions._id);
  const newDoc: ISubscription = model._update

};

export default UserAfterUpdate;