import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import User from '../../models/Users/UsersModel';
import prepareValidPhoneNumber from '../../helpers/prepareValidPhoneNumber';
//import kue from "kue";
//import Mailer from "../../helpers/mailer";
//import {authenticateUser} from "../../helpers/authenticateUser";

export const addUserSchema = Joi.object().keys({
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
    try {
      doc.phoneNumber = [prepareValidPhoneNumber(doc)];
      const user = new User(req.body);
      await user.save();
      /* const queues = kue.createQueue();
      const type = "WelcomeEmailJob"
      queues
        .create(type, {
          email: user.email,
          fullName: user.fullName,
          subject: 'Welcome To Next-Handle',
        })
        .priority("high")
        .save();
      let loggedInUser
      if (user) {
        loggedInUser = await authenticateUser(doc)
      }
      await Mailer.sendMail(type, 'welcome-email') */
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
};

export default requestMiddleware(create_user, { validation: { body: addUserSchema } });