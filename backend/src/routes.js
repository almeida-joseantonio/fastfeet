import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStartController from './app/controllers/DeliveryStartController';
import DeliveryOpenController from './app/controllers/DeliveryOpenController';
import DeliveryEndController from './app/controllers/DeliveryEndController';
import DeliveryClosedController from './app/controllers/DeliveryClosedController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryCancelController from './app/controllers/DeliveryCancelController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.put(
  '/deliverymans/:id/deliveriesstart/',
  DeliveryStartController.update
);
routes.get('/deliverymans/:id/deliveriesopen/', DeliveryOpenController.index);

routes.put(
  '/deliverymans/:id/deliveriesend/',
  upload.single('file'),
  DeliveryEndController.update
);
routes.get(
  '/deliverymans/:id/deliveriesclosed/',
  DeliveryClosedController.index
);

routes.post('/delivery/:id/problems', DeliveryProblemController.store);
routes.get('/delivery/:id/problems', DeliveryProblemController.show);

routes.get('/deliveryman/:id', DeliverymanController.show);

routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.get('/recipient/:id', RecipientController.show);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.get('/deliveryman/', DeliverymanController.index);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);
routes.get('/deliveries/:id', DeliveryController.show);

routes.get('/delivery-problems', DeliveryProblemController.index);

routes.delete('/problem/:id/cancel-delivery', DeliveryCancelController.delete);

export default routes;
