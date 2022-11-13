import { Request, RequestHandler, NextFunction } from 'express';
import { ISubscription } from './../../models/Subscription/subscriptionTypes';
import Joi from '@hapi/joi';
import logger from '../../logger';
import requestMiddleware from '../../middlewares/request-middleware';
import Subscription from '../../models/Subscription/SubscriptionModel';



export const subscriptionSchema = Joi.object().keys({
  name: Joi.string(),
  amount: Joi.string(),
  id: Joi.string(),
  expiry: Joi.string(),
  action: Joi.string().valid(...['update','create', 'delete', 'read']).required(),
});

const manage_subscription: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc:ISubscription = req.body;
  const { action, name, expiry, id, amount } = doc
  try {
    
    // for creating a subscription
    if (action === 'create') {
      const subscription = new Subscription({ name, expiry, amount });
      await subscription.save();
      res.status(201).json({
        status: "success",
        data: subscription?.toJSON(),
      });
    }

    // for deleting and updating a subscription
    if (action === 'delete' || action === 'update') {
      const foundSub = await Subscription.findById(id)
      if (foundSub) {
        if (action === 'delete') {
          await Subscription.findByIdAndUpdate( id, { isActive: false });
          res.status(200).json({
            status: "success",
            message: 'subscription successfully deleted',
          });
        } else {
          await Subscription.findByIdAndUpdate( id, { name, expiry, amount });
          const updatedSub = await Subscription.findById(id)
          res.status(200).json({
            status: "success",
            data: {
              data:updatedSub?.toJSON(),
            }
          });
        }
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'couldnt find a subscription'
        });
      }
    }
    
  } catch (e: any) {
    logger.log({
      level: 'debug',
      message: e.message,
      consoleLoggerOptions: { label: 'API' },
    });
    res.status(403).json({
      status: "failed",
      message: e.message
    });
  }
};

export default requestMiddleware(manage_subscription, { validation: { body: subscriptionSchema } });