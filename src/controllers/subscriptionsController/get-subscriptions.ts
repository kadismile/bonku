import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import Subscription from "../../models/Subscription/SubscriptionModel";
import { advancedResults } from '../../helpers/advancedResults'
import requestMiddleware from '../../middlewares/request-middleware';

export const subSchema = Joi.object().keys({
  in: Joi.string(),
  gt: Joi.string(),
  gte: Joi.string(),
  lt: Joi.string(),
  lte: Joi.string(),
});

const get_subscriptions: RequestHandler = async (req: Request, res) => {
  let subscription: any = await advancedResults(req, Subscription, [])
  if (subscription?.data) {
    res.status(200).json({
      status: "success",
      data: subscription
    });
  }
};
export default requestMiddleware(get_subscriptions, { validation: { query: subSchema } });