
import { IUserInput } from './../models/Users/usertypes';
import User from '../models/Users/UsersModel';
import prepareValidPhoneNumber from '../helpers/prepareValidPhoneNumber';

export const createUserHelper = async (params: IUserInput) => {
  const body = {
    fullName: params.fullName,
    password: params.password,
    phoneNumber: params.phoneNumber, 
    userType: params.userType,
    email: params.email,
    address: params.address,
    tenant: params.tenantId
  };

  const phoneNumber = prepareValidPhoneNumber(params.address);
  const user = new User({...body, phoneNumber});
  await user.save();
  return user
}