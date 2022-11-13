import { Router } from 'express';
import * as subController from '../controllers/subscriptionsController';

const sub_routes = Router();

// Auth routes
sub_routes.post('/', subController.manageSubscriptions);

export default sub_routes;