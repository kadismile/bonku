import { IUser } from './../models/Users/usertypes';
import { ITenant } from './../models/Tenants/tenantTypes';
import UserSubscription from '../models/Subscription/UserSubscriptionModel';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const sendWhatsappMessage = async (tenant: ITenant, user: IUser) => {
  //from must be from the tenant phone Number
  //to must be from the user phone Number
  const subcription = await UserSubscription.findOne({ userId: user._id })
  client.messages
    .create({
      from: `whatsapp:${tenant.phoneNumber}`,
      body: `Hello ${user.fullName}, Welcome to ${tenant.businessName}, your user number is ${user.userNumber} and you have just subscribed to a ${subcription?.name} subscription plan `,
      to: `whatsapp:${user.phoneNumber}`
    })
    .then((message: any) => console.log("MESSAGE =======================",message.sid));
}