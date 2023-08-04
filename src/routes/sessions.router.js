import { Router } from 'express';
import passport from 'passport';
import { filterCurrent } from '../middleware/current.middleware.js';


const sessionsRouter = Router();

sessionsRouter.get('/current', filterCurrent, (req, res) => {
	if(req.session.user){
		res.json(req.session.user);
	} else {
		res.status(401).json({ messsage: 'No se encontro el usuario autenticado'});
	}
});

sessionsRouter.get(
	'/github',
	passport.authenticate('github', { scope: ['user:email'] }),
	async (req, res) => {}
);

sessionsRouter.get(
	'/githubcallback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	(req, res) => {
		req.session.user = req.user;
		res.redirect('/');
	}
);

export default sessionsRouter;
