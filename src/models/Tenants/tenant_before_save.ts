import { ITenant } from './tenantTypes';
//import Tenant from './TenantsModel';

const TenantBeforeSave = async (doc: ITenant ) => {
  return doc
}

/* const getNextSequenceValue = async () => {
  let tenant: ITenant | null = await Tenant.findOne({}, {}, {sort: { createdAt : -1 }});
  if (!tenant) {
    return 1000;
  } else {
    return tenant.tenantNumber+=1
  }
} */

export default TenantBeforeSave