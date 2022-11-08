import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import ApplicationError from '../../errors/application-error';
import { findUserByEmailOrPhone } from '../../helpers/userHelper';

export const LoginSchema = Joi.object().keys({
  password: Joi.string().required(),
  phoneNumber: Joi.string(),
  isAdmin: Joi.boolean(),
  email: Joi.string().email({ tlds: { allow: false } }),
});

const login: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { email, phoneNumber, password, isAdmin } = req.body;
  if (!email && !phoneNumber) {
    res.status(400).json({
      status: "failed",
      error: "Please Login with  your phone-number or email"
    });
  }

  if (phoneNumber || email) {
    try {
      const user:any = await findUserByEmailOrPhone(phoneNumber, email);
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401).json({
          status: "failed",
          data: "this user is not currently registered"
        });
      } else {
        const token = user.getSignedJwtToken();
        delete user.password;
        res.status(200).json({
          status: "success",
          token,
          user
        });
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }

};

export default requestMiddleware(login, { validation: { body: LoginSchema } });