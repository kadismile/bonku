
import { IUserInput } from '../models/Users/usertypes';
import User from '../models/Users/UsersModel';
import prepareValidPhoneNumber from './prepareValidPhoneNumber';
import UserHistory from '../models/Users/UserHistoryModel';

export const createUserHelper = async (params: IUserInput) => {
  const body = {
    fullName: params.fullName,
    age: params.age,
    weight: params.weight,
    sex: params.sex,
    password: params.password,
    fingerPrintId: params.fingerPrintId, 
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

export const createUserHistory = async (params: IUserInput) => {
  const userHistory = new UserHistory({
    userId: params._id,
    tenant: params.tenantId,
    fullName: params.fullName,
    phoneNumber: params.phoneNumber,
    status: 'SUCCESSFUL',
  });
  await userHistory.save();
  return userHistory
}