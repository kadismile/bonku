import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import { createUserHelper } from '../../helpers/createUser';
import Tenant from '../../models/Tenants/TenantsModel';

export const addUserSchema = Joi.object().keys({
  tenant: Joi.string().required(),
  fullName: Joi.string().required(),
  password: Joi.string().min(6).max(50).required(),
  phoneNumber: Joi.string().required(),
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
  const tenant = await Tenant.findById(doc.tenant)
  if (tenant) {
    try {
      const params = {
        fullName: doc.fullName,
        password: doc.password,
        phoneNumber: doc.phoneNumber,
        userType: doc.userType,
        email: doc.email,
        address: {...doc.address, phoneNumber: doc.phoneNumber}
      }
      const user = await createUserHelper(params)
      res.send({
        status: "success",
        data: user
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