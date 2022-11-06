import { Model, Schema, model } from 'mongoose';
import TimeStampPlugin from '../plugins/timestamp-plugin';
import { ITenant } from './tenantTypes';
import TenantBeforeSave from './tenant_before_save';
import TenantAfterUpdate from './tenant_after_update';

interface ITenantModel extends Model<ITenant> { }

const schema = new Schema<ITenant>({
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
    type : Array,
    default : [],
  },
  countryCode: {
    type: String,
    required: [true, 'Please Add Country Code']
  },
  tenantNumber: {
    type: Number,
    default : 1000,
    optional: true,
  },
  user: {
    type: String,
    ref: 'User',
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
  history: {
    type: Array,
    optional: true,
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
  await TenantAfterUpdate(this, next)
});

schema.pre("save", async function(this, next) {
  await TenantBeforeSave(this)
});



const Tenant: ITenantModel = model<ITenant, ITenantModel>('Tenant', schema);

export default Tenant;