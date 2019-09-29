import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileControlle';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificarionController from './app/controllers/NotificarionController';
import AvaliableController from './app/controllers/AvaliableController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/*Com uso da class userController*/
routes.post('/users', UserController.store);

/*Session de autenticação */
routes.post('/sessions', SessionController.store);

/*Aplica validação para todas rotes abaixo*/
routes.use(authMiddleware);

/*Para atualizar dados cadastro*/
routes.put('/users', UserController.update);

/*Para listar clientes prestadores de serviço*/
routes.get('/providers', ProviderController.index);

/*Lista de horários disponíveis */
routes.get('/providers/:providerId/avaliable', AvaliableController.index);

/*Lista agendamento de usuario*/
routes.get('/appointments', AppointmentController.index);

/*Para criar agendamento de serviços*/
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

/*Agendamento */
routes.get('/schedule', ScheduleController.index);

/*Lista Notificações*/
routes.get('/notifications', NotificarionController.index);
routes.put('/notifications/:id', NotificarionController.update);

/*Para uploade de arquivos de avatar do cliente*/
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
