import bcrypt from "bcryptjs";
import { ITenant } from './tenantTypes';
import Tenant from './TenantsModel';
import ApplicationError from '../../errors/application-error';

const TenantBeforeSave = async (doc: ITenant ) => {
  return doc
}

const getNextSequenceValue = async () => {
  let tenant: any = await Tenant.findOne({}, {}, {sort: { createdAt : -1 }});
  if (!tenant) {
    return 1000;
  } else {
    return tenant.tenantNumber+=1
  }
}

export default TenantBeforeSave