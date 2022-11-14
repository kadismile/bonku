import { ITenant } from './../../models/Tenants/tenantTypes';
import { Request, RequestHandler, NextFunction } from 'express';
import Joi from '@hapi/joi';
import logger from '../../logger';
import requestMiddleware from '../../middlewares/request-middleware';
import { createUserHelper } from '../../helpers/createEntity';
import Tenant from '../../models/Tenants/TenantsModel';
import User from '../../models/Users/UsersModel';


export const addTenantSchema = Joi.object().keys({
  email: Joi.string().required().email({ tlds: { allow: false } }),
  password: Joi.string().min(6).max(50).required(),
  phoneNumber: Joi.string().required(),
  userType: Joi.string().valid(...['customer','tenantAdmin']).required(),
  businessName: Joi.string().required(),
  businessOwner: Joi.string().required(),
  businessAddress: Joi.object({
    country: Joi.string().required(),
    landMark: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    fullAddress: Joi.string().required(),
    countryCode: Joi.string().required(),
    longitude: Joi.string().required(),
    latitude: Joi.string().required(),
  }).required(),
});

const create_tenant: RequestHandler = async (req: Request<{}, {}>, res) => {
  let doc:ITenant = req.body;
  try {
    const params = {
      fullName: doc.businessName,
      password: doc.password,
      phoneNumber: doc.phoneNumber,
      userType: doc.userType,
      email: doc.email,
      address: {...doc.businessAddress, phoneNumber: doc.phoneNumber}
    }
    let newUser = await createUserHelper(params);

    if (!newUser) {
      res.status(403).json({
        status: 'newUser.status',
        message: `User couldnt be created for Tenant ${doc.businessName}`
      });
    }
    if (newUser.email) {
      req.body.user = newUser._id
      const tenant = new Tenant(req.body);
      await tenant.save();
      //update the user to have a tenantId
      const user = await User.findByIdAndUpdate(newUser._id, { tenant: tenant._id }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
      });
      res.status(201).json({
        status: "success",
        data: {
          tenant: tenant.toJSON(),
          user
        }
      });
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

export default requestMiddleware(create_tenant, { validation: { body: addTenantSchema } });