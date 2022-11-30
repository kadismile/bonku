import { ISubscription } from './../../models/Subscription/subscriptionTypes';
import { ITenant } from './../../models/Tenants/tenantTypes';
import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import { createUserHelper } from '../../helpers/createEntity';
import Tenant from '../../models/Tenants/TenantsModel';
import Subscription from '../../models/Subscription/SubscriptionModel';
import UserSubscription from '../../models/Subscription/UserSubscriptionModel';
import { sendWhatsappMessage } from '../../integrations/twilio'

export const addUserSchema = Joi.object().keys({
  tenant: Joi.string().required(),
  fullName: Joi.string().required(),
  age: Joi.string().required(),
  sex: Joi.string().valid(...['male','female']).required(),
  weight: Joi.string().required(),
  fingerPrintId: Joi.string().required(),
  password: Joi.string().min(6).max(50).required(),
  phoneNumber: Joi.string().required(),
  subscriptionId: Joi.string().required(),
  userType: Joi.string().valid(...['customer','tenantAdmin']).required(),
  email: Joi.string().required().email({ tlds: { allow: false } }),
  address: Joi.object({
    country: Joi.string().required(),
    fullAddress: Joi.string().required(),
    landMark: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    countryCode: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }).required(),
});

const create_user: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc = req.body
  const tenant: ITenant | null = await Tenant.findById(doc.tenant)
  if (tenant) {
    try {
      const params = {
        fullName: doc.fullName,
        age: doc.age,
        sex: doc.sex,
        weight: doc.weight,
        password: doc.password,
        fingerPrintId: doc.fingerPrintId,
        phoneNumber: doc.phoneNumber,
        userType: doc.userType,
        email: doc.email,
        tenantId: tenant._id,
        address: {...doc.address, phoneNumber: doc.phoneNumber}
      }
      const user = await createUserHelper(params)
      if (user && user.userType === 'customer') {
        //attach a subscription 
        const subscription = await Subscription.findById(doc.subscriptionId)
        if (subscription) {
          const userSubscription : ISubscription = new UserSubscription({
            name: subscription.name,
            userId: user._id,
            amount: subscription.amount,
            expiry: subscription.expiry,
            isActive: subscription.isActive,
          });
          await userSubscription.save();
        }
        //send Welcome whatsapp message to customer
        sendWhatsappMessage(tenant, user)
      }
      res.send({
        status: "success",
        data: {user}
      });
    } catch (e: any) {
      res.status(400).json({
        status: "failed",
        message: e.message
      });
    }
  } else {
    res.status(404).json({
      status: "failed",
      message: 'Tenant not found'
    });
  }
  
};

export default requestMiddleware(create_user, { validation: { body: addUserSchema } });