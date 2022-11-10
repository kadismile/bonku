import { IUser } from './../../models/Users/usertypes';
import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import ApplicationError from '../../errors/application-error';
import User from '../../models/Users/UsersModel';


export const LoginSchema = Joi.object().keys({
  userId: Joi.string(),
  tenantId: Joi.string()
});

const access_door: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { userId, tenantId } = req.query;
  if (!userId) {
    res.status(400).send({
      status: "failed",
      error: "false"
    });
  }

  if (userId) {
    try {
      const user: IUser | null = await User.findById(userId);
      //const tenant: ITenant | null = await Tenant.findById(tenantId) ;
      if (user) {
        res.status(200).send('SUCCESSFUL');
      } else {
        res.status(404).send('UNSUCCESSFUL');
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }

};

export default requestMiddleware(access_door, { validation: { query: LoginSchema } });