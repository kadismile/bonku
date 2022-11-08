import { Router } from 'express';
import * as authController from '../controllers/authController';

const auth_routes = Router();

// Auth routes
auth_routes.post('/create', authController.createUsers);

export default auth_routes;