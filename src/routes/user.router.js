import { Router } from 'express';
import userController from '../controllers/user.controller.js';

//import multer middleware
import { upload } from '../middleware/multer.middleware.js';

const usersRouter = Router();

//Requisitos entrega final
usersRouter.get('/', userController.getAllUsers)

//Delete users who had no connection in the last days
usersRouter.delete('/', userController.deleteInactiveUsers);

usersRouter.post('/', userController.createUser)
usersRouter.post('/premium/:uid', userController.updateRol);
usersRouter.post('/auth', userController.authUser);
usersRouter.post('/logout', userController.logOut);
usersRouter.delete('/:uid', userController.deleteUser);
usersRouter.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments);

export default usersRouter;
