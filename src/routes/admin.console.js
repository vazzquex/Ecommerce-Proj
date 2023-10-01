import { Router } from 'express';
import { userService } from '../services/index.js';
const adminConsoleRouter = Router();

adminConsoleRouter.get('/', async (req, res) => {
    const user = req.session.user;
    try {
        let users = []
        let allUsers = await userService.getAllUsers();

        res.status(201).render('admin-console', {
            title: "Admin Console",
            user,
            allUsers, 
        })

    } catch (err) {
        req.logger.error(`Error trying to get checkout: ${err}`);
        res.status(500).send(`Internal server error trying to get checkout: ${err}`);
    }


});

export default adminConsoleRouter;



