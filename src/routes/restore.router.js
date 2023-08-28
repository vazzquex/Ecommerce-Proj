import { Router } from "express";
import { userRepository } from "../repositories/index.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";

const emailOwn = process.env.EMAIL
const email_pass = process.env.EMAIL_PASS

const restoreRouter = Router();

restoreRouter.get('/', (req, res) => {
    req.logger.info('Cargando página de restauración');
    res.render('restore', {
        title: 'Restore',
    });
});

restoreRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        req.logger.debug(`Solicitud de restablecimiento de contraseña para ${email}`);
        const user = await userRepository.getByEmail(email);
        if (!user) {
            req.logger.warning(`Usuario no encontrado: ${email}`);
            return res.status(400).json({ success: false, message: 'User not Found' });
        }

        // Generar token
        const token = crypto.randomBytes(20).toString('hex');

        //const expires = Date.now() + 10000;   // 10 segundos test

        const expires = Date.now() + 3600000; //Expira en 1 hora

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: emailOwn,
                pass: email_pass
            }
        });

        const mailOptions = {
            to: email,
            from: `Reset Password <${emailOwn}>`,
            subject: 'Restablecimiento de contraseña',
            text: `Por favor, haz clic en el siguiente enlace para completar el proceso:\n\nhttp://${req.headers.host}/restore/reset-password/${token}\n\nSi no solicitaste esto, por favor ignora este mensaje.`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                req.logger.error(`Error al enviar correo: ${err.message}`);
                return res.status(500).send(err.message);
            }
            req.logger.info('Mail sent successfully');
            res.json({ success: true, message: 'Mail sent successfully' });
        });
    } catch (error) {
        req.logger.error(`Error en la solicitud de restablecimiento de contraseña: ${error.message}`);
        res.status(500).send(error.message);
    }
});

restoreRouter.get('/reset-password/:token', (req, res) => {
    req.logger.info('Cargando página de restablecimiento de contraseña');
    res.render('reset-password', { token: req.params.token });
});

restoreRouter.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        req.logger.info(`Solicitud para cambiar la contraseña con el token: ${token}`);

        const user = await userRepository.findTokenAndExpiraton(token);
        const now = Date.now();
        if (!user || user.resetPasswordExpires < now) {
            req.logger.warning('Invalid or expired token');
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }


        // La contraseña nueva no puede ser igual a la del usuario

        if (await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ success: false, message: 'The new password cannot match the current one' });
        }

        user.password = bcrypt.hashSync(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.logger.info('Password updated successfully');

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        req.logger.error(`Failed to update password: ${error.message}`);
        res.status(500).send(error.message);
    }
});

export default restoreRouter;
