import { ISubscription } from './subscriptionTypes';
import User from './SubscriptionModel';

const UserAfterUpdate = async ( model: any, _next: any) => {

  const oldDoc: any  = await User.findById(model._conditions._id);
  const newDoc: ISubscription = model._update
  console.log(oldDoc, newDoc)

};

export default UserAfterUpdate;