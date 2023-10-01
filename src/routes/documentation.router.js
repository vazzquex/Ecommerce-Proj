import { Router } from "express";
import { userService } from "../services/index.js";
import userController from "../controllers/user.controller.js";

const documentationRouter = Router();

documentationRouter.get('/', async (req, res) => {
    const { user } = req.session;
    const newUser = await userService.getById(user._id);

    req.logger.debug(`User documents = ${user.documents.length}`);

    req.logger.debug(JSON.stringify(user.documents.length));

    try {

        if (req.session.user.documents == true ){
            req.logger.debug('User have 3 documents uploaded!!!');

            if (user.rol == 'premium') {
                await userService.updateRolToUser(user._id);
                req.logger.info('User update to user');
                req.session.user.rol = 'user';
                await newUser.save();
                req.session.save()
                res.redirect('/');
            }

            if (user.rol == 'user') {
                await userService.updateRolToPremium(user._id);
                req.logger.info('User update to premium');
                req.session.user.rol = 'premium';
                await newUser.save();
                req.session.save()
                res.redirect('/');
            }

        } else {
            req.logger.debug('User does not have 3 documents uploaded');
            res.status(200).render('documentation', {
                title: 'Documentation',
                user,
            })
        }



    } catch (err) {
        req.logger.error(err);
        res.send(500).json({ error: 'server error', err });
    }

})

export default documentationRouter