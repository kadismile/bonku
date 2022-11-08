import User from '../models/Users/UsersModel';

export const findUserByEmailOrPhone = async (phoneNumber:string, email:string) => {
  if (phoneNumber?.startsWith('0')) {
    phoneNumber = '+234' + phoneNumber.split('').splice(1).join('');
  }
  const user: any = await User.findOne({
    $or: [ { email }, { phoneNumber }],
  }).select('+password');
  if (!user) {
    return null;
  }
  return user;
}