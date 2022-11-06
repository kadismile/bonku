import Tenant from './TenantsModel';

const TenantAfterUpdate = async ( model: any, next: any) => {

  const oldDoc: any = await Tenant.findById(model._conditions._id);
  const newDoc: any = model._update
};


export default TenantAfterUpdate;