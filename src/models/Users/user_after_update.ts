import { NextFunction } from 'express';
import { IUser } from './usertypes';
import bcrypt from "bcryptjs";
import User from './UsersModel';

const UserAfterUpdate = async ( model: any, next: NextFunction) => {

  const oldDoc: any  = await User.findById(model._conditions._id);
  const newDoc: IUser = model._update

  if (newDoc.fullName && oldDoc.fullName !== newDoc.fullName  ) {
    try{
      await User.updateOne({ _id: oldDoc._id },
        { $addToSet: {history: {
          event: "NAME_CHANGE",
          oldValue: oldDoc.fullName,
          newValue: newDoc.fullName,
          createdAt: new Date()
      }}})
    }catch (e) {
      return next(e);
    }
  }

  if (newDoc.address && addressChanged (oldDoc.address, newDoc.address)){
    try{
      await User.updateOne({ _id: oldDoc._id },
        {$addToSet: {history: {
          event: "ADDRESS_CHANGE",
          oldValue: oldDoc.address,
          newValue: newDoc.address,
          createdAt: new Date()
        }}
        })
    }catch (e) {
      return next(e);
    }
  }

  if (newDoc.password && oldDoc.password !== newDoc.password){
    try{
      const salt = await bcrypt.genSalt(10);
      newDoc.password = await bcrypt.hash(newDoc.password, salt);
      await User.updateOne({ _id: oldDoc._id },
        {
          password: newDoc.password,
          $addToSet: {
            history: {
              event: "PASSWORD_CHANGE",
              createdAt: new Date()
            }
          }
        })
    }catch (e) {
      return next(e);
    }
  }
};

const addressChanged: any = (oldDAddress: any, newAddress: any) => {
  let oldValues = Object.values(oldDAddress)
  let newValues = Object.values(newAddress)
  let change = false
  for (let i = 0; i < oldValues.length; i++) {
    change = oldValues.includes(newValues[i]);
  }
  return change
}

export default UserAfterUpdate;