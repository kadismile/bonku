import { ISubscription } from './subscriptionTypes';
import Subscription from './SubscriptionModel';
import ApplicationError from '../../errors/application-error';

const UserBeforeSave = async (doc: ISubscription ) => {
  
  return doc
}

export default UserBeforeSave