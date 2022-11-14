import { IUser } from './../../models/Users/usertypes';
import { Request, RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middlewares/request-middleware';
import ApplicationError from '../../errors/application-error';
import User from '../../models/Users/UsersModel';
import UserHistory from '../../models/Users/UserHistoryModel';
import moment from 'moment'


export const userHistorySchema = Joi.object().keys({
  userId: Joi.string(),
  tenantId: Joi.string()
});

const user_history: RequestHandler = async (req: Request<{}, {}>, res) => {
  let { userId } = req.query;
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
        const userHistory = await UserHistory.find({ userId})
        if (userHistory.length) {
          let data = userHistory.map((uh) => {
            return {
              name: uh.fullName,
              phoneNumber: uh.phoneNumber,
              loggedInAt: moment(uh.createdAt).format('MMMM D, YYYY, h:mma') 
            }
          })
          res.status(200).json({
            status: "success",
            attempts: data.length,
            data
          });
        }
      } else {
        res.status(404).send(`User not found with Id ${userId}`);
      }
    } catch (e: any) {
      throw new ApplicationError(e.message, 500)
    }
  }

};

export default requestMiddleware(user_history, { validation: { query: userHistorySchema } });