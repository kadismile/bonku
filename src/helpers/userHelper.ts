import { IUser } from './../models/Users/usertypes';
import User from '../models/Users/UsersModel';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const matchPassword = async (enteredPassword: string, userPassword: string) => {
  return await bcrypt.compare(enteredPassword, userPassword);
}

export const getSignedJwtToken = async (user: IUser) => {
  const JWT_SECRET = process.env.JWT_SECRET || ''
  return jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}