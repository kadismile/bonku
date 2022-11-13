import { Router } from 'express';
import * as subController from '../controllers/subscriptionsController';

const sub_routes = Router();

// Auth routes
sub_routes.post('/', subController.manageSubscriptions);
sub_routes.get('/', subController.get_subscriptions);

export default sub_routes;