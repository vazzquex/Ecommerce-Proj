import { userService } from "../services/index.js";
import { encriptPass, comparePass } from "../tools/encrypt.js";
import config from '../tools/config.js';
import mongoose from "mongoose";

const admin = {
    email: config.adminUser,
    password: config.adminPassword
}


const createUser = async (req, res) => {
    const userData = {
        ...req.body,
        password: encriptPass(req.body.password),
        cart: [],
    };
    try {
        req.logger.info('Creating new user');

        const newUser = await userService.createUser(userData);
        newUser.last_connection = new Date();
        newUser.save();

        req.logger.info('User created successfully');

        res.status(201).json(newUser);
    } catch (error) {
        req.logger.error(`Error creating user: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        req.logger.info('Authenticating user');

        const user = await userService.getByEmail(email);

        if (email !== admin.email || password !== admin.password) {

            if (!user) throw new Error('Invalid data'); // Comprobo si existe el usuario
            if (!comparePass(user, password)) throw new Error('Invalid data'); // Comprobo si la contraseña coincide

            req.logger.debug('User authenticated successfully');

            // Guardo la session
            req.session.user = user;
            user.last_connection = new Date();
            await user.save();


            res.status(200).redirect('/');
            //res.redirect('/')


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
}

const logOut = async (req, res) => {
    req.logger.info('User logged out');

    if (!req.session.admin) {
        const user = await userService.getById(req.session.user._id);
        user.last_connection = new Date();
        user.save();

    }
    req.session.destroy();

    res.redirect('/login');
}

const updateRol = async (req, res) => {
    const uid = req.params.uid;
    req.logger.debug(`User ID ${uid}`)

    try {
        req.logger.info('Updating rol...');
        const user = await userService.getById(uid);

        if (user.documents.length < 3) {
            res.status(400).json({ message: "missing data" });
        }

        if (user.rol == 'premium') {

            await userService.updateRolToUser(uid);
            req.logger.info('User update to user');

            // Actualiza el objeto de usuario en la sesión
            if (!req.session.admin) {
                req.session.user.rol = 'user';

                // Guarda los cambios en la sesión
                await user.save();
                await req.session.save()
                res.redirect('/');

            }



        }

        if (user.rol == 'user') {

            await userService.updateRolToPremium(uid);
            req.logger.info('User update to premium');

            // Actualiza el objeto de usuario en la sesión
            if (!req.session.admin) {
                req.session.user.rol = 'premium';
                req.session.user.documents = true


                // Guarda los cambios en la sesión
                await req.session.save()
                await user.save();

                res.status(200).json({ message: "User updated to premium" });

            }
        }

    } catch (error) {
        req.logger.error('Error updating rol:', error);
        return res.status(500).send('Error updating user rol');
    }
};

const deleteUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        console.log(uid)

        if (!mongoose.isValidObjectId(uid)) {
            res.status(404).send('The user id to be deleted was not found')
        }

        await userService.deleteUserById(uid);

        req.logger.debug(`User with ID ${uid} deleted successfully`);
        res.status(200).json({ success: true, message: `User with ID ${uid} delete successfully` });
    } catch (error) {
        req.logger.error(`Error deleting user: ${error.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const uploadDocuments = async (req, res) => {
    const uid = req.params.uid;
    try {
        const user = await userService.getById(uid);
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        const uploadedDocuments = req.files;
        req.logger.debug(`Req Files = ${req.files}`)

        //actualizo el status para indicar que se seubieron documentos
        user.documents = uploadedDocuments.map(doc => ({
            name: doc.originalname,
            reference: `../data/documents/${doc.originalname}`,
        }))

        await req.session.save();
        await user.save();


        return res.status(200).json({ message: 'Documents uploaded successfully', user })
    } catch (error) {
        req.logger.error(`Error uploading documents: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()

        res.status(201).json(users)
    } catch (err) {
        req.logger.error(`Rrror getting users ${err}`)
        res.status(500).send(`Rrror getting users ${err}`)
    }
}

const deleteInactiveUsers = async (req, res) => {
    const userCleanupIntervalInSeconds = process.env.USER_CLEANUP_INTERVAL;
    let countUserDeleted = 0;

    try {
        const inactiveUser = await userService.getInactiveUsers();
        const actualDate = new Date();

        for (const user of inactiveUser) {
            const userLastConnectionDate = new Date(user.last_connection);

            // Eliminar el usuario si está inactivo durante más de "userCleanupIntervalInSeconds" segundos
            const timeDifferenceInSeconds = (actualDate - userLastConnectionDate) / 1000;
            if (timeDifferenceInSeconds > userCleanupIntervalInSeconds) {
                await userService.deleteUserById(user._id);
                req.logger.debug(`The user ${user._id} was deleted because it has been inactive for more than ${userCleanupIntervalInSeconds} seconds.`);
                countUserDeleted++;
            }

        }

        res.status(200).json({ message: `Deleted inactivity users: ${countUserDeleted}` });

    } catch (err) {
        req.logger.error(`Error getting inactive users: ${err}`);
        res.status(500).send(`Error getting inactive users: ${err}`);
    }

    countUserDeleted = 0;
};


export default {
    deleteInactiveUsers,
    getAllUsers,
    createUser,
    authUser,
    logOut,
    updateRol,
    deleteUser,
    uploadDocuments,
}