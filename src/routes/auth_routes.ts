import { Router } from 'express';
import * as authController from '../controllers/authController';

const auth_routes = Router();

// Auth routes
auth_routes.post('/create', authController.createUsers);
auth_routes.post('/login', authController.login);
auth_routes.post('/access', authController.access);

export default auth_routes;