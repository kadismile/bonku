import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from '../plugins/timestamp-plugin';
import  UserAfterUpdate   from './user_after_update'
import  UserBeforeSave   from './user_before_save'
import { IUser } from './usertypes';

interface IUserModel extends Model<IUser> { }

const schema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ],
    required: [true, 'Please Add Email']
  },
  fullName: {
    type: String,
    required: [true, 'Please Add Full Name']
  },
  phoneNumber: {
    type : String,
    required: [true, 'Please Add Phone Number']
  },
  age: {
    type: String,
    required: [true, 'Please Add Your Age']
  },
  sex: {
    type: String,
    enum : ['Male','Female'],
    required: [true, 'Please Add Gender']
  },
  weight: {
    type: String,
    required: [true, 'Please Add Your weight in Kg']
  },
  userNumber: {
    type: Number,
    default : 1000,
    optional: true,
  },
  userType: {
    type: String,
    enum : ['customer','tenantAdmin'],
    default: 'user'
},
  tenant: {
    type: String,
    ref: 'Tenant',
  },
  accountBalance: {
    type: Number,
    default: function() {
      return 0.0;
    }
  },
  address: {
    type : Object,
    required: [true, 'Please add an address']
  },
  password: {
    type: String,
    select: false, //dont show the password
  },
  fingerPrintId: {
    type: String,
    optional: true,
  },
  resetPasswordToken: {
    type: String,
    optional: true,
  },
  resetPasswordExpire: {
    type: Date,
    optional: true,
  },
  verifyEmailToken: {
    type: String,
    optional: true,
  },
  roles: {
    type : Array,
    default : [],
    optional: true,
  },
  history: {
    type: Array,
    optional: true,
  },
  superAdmin: {
    type: Boolean,
    default: function() {
      return false;
    }
  },
  isAdmin: {
    type: Boolean,
    default: function () {
      return false;
    }
  },
  isActive: {
    type: Boolean,
    default: function() {
      return true;
    }
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return false;
    }
  },
  attachments: [{
    type: String,
    ref: 'Attachment'
  }],
  loginToken: {
    type: String,
    optional: true,
  }
},{versionKey: false});

// Add timestamp plugin for createdAt and updatedAt in miliseconds from epoch
schema.plugin(TimeStampPlugin);

schema.pre('findOne', async function() {
  this.where({ isActive: true })
});

schema.pre('find', async function() {
  this.where({ isActive: true })
});

schema.pre('findOneAndUpdate', async function(this, next) {
  await UserAfterUpdate(this, next)
});

schema.pre("save", async function(this, _next) {
  await UserBeforeSave(this)
});


const User: IUserModel = model<IUser, IUserModel>('User', schema);

export default User;