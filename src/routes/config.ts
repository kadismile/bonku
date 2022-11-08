// @ts-ignore
import indexRouter from './index';
import tenant_routes from './tenant_routes';
import auth_routes from './auth_routes';

module.exports = [
  ['/', indexRouter],
  ['/api/v1/tenants', tenant_routes],
  ['/api/v1/users', auth_routes],
  ['/api/v1/auth', auth_routes],
];
