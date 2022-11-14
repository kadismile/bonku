import { Router } from 'express';
import * as authController from '../controllers/authController';

const auth_routes = Router();

// Auth routes
auth_routes.post('/create', authController.createUsers);
auth_routes.post('/login', authController.login);
auth_routes.get('/access', authController.access);
auth_routes.get('/access/history', authController.userHistory);

export default auth_routes;