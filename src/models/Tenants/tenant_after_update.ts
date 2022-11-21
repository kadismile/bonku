import Tenant from './TenantsModel';

const TenantAfterUpdate = async ( model: any, _next: any) => {

  const oldDoc: any = await Tenant.findById(model._conditions._id);
  const newDoc: any = model._update
  console.log(oldDoc, newDoc)
};


export default TenantAfterUpdate;