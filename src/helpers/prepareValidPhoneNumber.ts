import { IAddress } from './../models/Users/usertypes';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const PhoneNumberUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
import ApplicationError from '../errors/application-error';


const prepareValidPhoneNumber = (address: IAddress) =>{
  if (!isValidPhoneNumber(address)) {
    throw new ApplicationError(`An invalid phone number ${address.phoneNumber} was provided`, 406)
  }
  return preparePhoneNumber(address);
};

const preparePhoneNumber = (address: IAddress) => {
  const phoneUtil = PhoneNumberUtil;
  const countryCode = address.countryCode
  const phone = phoneUtil.parse(address.phoneNumber, countryCode);
  if (phoneUtil.isValidNumber(phone)) {
    return phoneUtil.format(phone, PNF.E164)
  } else {
    return false
  }
}

const isValidPhoneNumber = (address: IAddress) => {
  const phoneUtil = PhoneNumberUtil;
  const countryCode = address.countryCode
  const phone = phoneUtil.parse(address.phoneNumber, countryCode);
  return phoneUtil.isValidNumber(phone);
}

export default prepareValidPhoneNumber