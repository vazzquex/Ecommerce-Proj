import { Router } from 'express';
import userService from '../services/user.service.js';
import { encriptPass, comparePass } from '../tools/encrypt.js';
import config from '../tools/config.js';
import { userRepository } from '../repositories/index.js';

const usersRouter = Router();

const admin = {
	email: config.adminUser,
	password: config.adminPassword
}


usersRouter.post('/', async (req, res) => {
	const userData = {
		...req.body,
		password: encriptPass(req.body.password),
		cart: [],
	};
	try {
		req.logger.info('Creating new user');

		const newUser = await userRepository.createUser(userData);

		req.logger.info('User created successfully');

		res.status(201).json(newUser);
	} catch (error) {
		req.logger.error(`Error creating user: ${error.message}`);
		res.status(400).json({ error: error.message });
	}
});


usersRouter.post('/premium/:uid', async (req, res) => {
	const uid = req.params.uid;
	console.log(uid);

	try {
		req.logger.info('Updating rol user...');
		const user = await userRepository.findById(uid);

		if (user.rol == 'premium') {
			req.logger.warning("You are already a premium user");
			return res.status(400).send("You are already a premium user");
		}

		if (user.rol == 'user') {
			await userRepository.updateRolToPremium(uid);
			req.logger.info('User rol updated to premium');

			// Actualiza el objeto de usuario en la sesión
			req.session.user.rol = 'premium';

			// Guarda los cambios en la sesión
			req.session.save(err => {
				if (err) {
					// Maneja el error
				} else {
					// Redirige al usuario
					res.redirect('/');
				}
			});
		}

	} catch (error) {
		req.logger.error('Error updating user rol:', error);
		return res.status(500).send('Error updating user rol');
	}
});



usersRouter.post('/auth', async (req, res) => {
	const { email, password } = req.body;
	try {
		req.logger.info('Authenticating user');

		const user = await userRepository.getByEmail(email);

		if (email !== admin.email || password !== admin.password) {

			if (!user) throw new Error('Invalid data'); // Comprobo si existe el usuario
			if (!comparePass(user, password)) throw new Error('Invalid data'); // Comprobo si la contraseña coincide

			req.logger.info('User authenticated successfully');

			// Guardo la session
			req.session.user = user;

			res.redirect('/');


		} else {

			req.logger.info('Admin authenticated successfully');

			const user = admin.email

			// Guardo la session
			req.session.user = user
			req.session.admin = true

			res.redirect('/');
		}


	} catch (error) {
		req.logger.error(`Authentication failed: ${error.message}`);
		res.status(400).json({ error: error.message });
	}
});

usersRouter.post('/logout', (req, res) => {
	req.logger.info('User logged out');

	req.session.destroy();

	res.redirect('/login');
});

export default usersRouter;
