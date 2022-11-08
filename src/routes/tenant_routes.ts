import { Router } from 'express';
import * as tenantController from '../controllers/tenantController';

const tenant_routes = Router();

// Category routes
tenant_routes.post('/create', tenantController.createTenants);

export default tenant_routes;