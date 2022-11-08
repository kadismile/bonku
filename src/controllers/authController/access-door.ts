import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import ApplicationError from '../../errors/application-error';
import User from '../../models/Users/UsersModel';
import Tenant from '../../models/Tenants/TenantsModel';

export const LoginSchema = Joi.object().keys({
  userId: Joi.string(),
  tenantId: Joi.string()
});

const access_door: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { userId, tenantId } = req.body;
  if (!userId) {
    res.status(400).send({
      status: "failed",
      error: "false"
    });
  }

  if (userId) {
    try {
      const user:any = await User.findById(userId);
      const tenant:any = await Tenant.findById(tenantId) || 'wA54jYWqLWfCI4MO8jar462Q8';
      if (user && tenant) {
        res.status(200).send(true);
      } else {
        res.status(404).send(false);
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }

};

export default requestMiddleware(access_door, { validation: { query: LoginSchema } });