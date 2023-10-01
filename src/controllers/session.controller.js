class SessionController {
    getCurrentUser = async (req, res) => {
        if (req.session.user) {
            req.logger.info('Fetching current authenticated user');
            res.json(req.session.user);
        } else {
            req.logger.error('No authenticated user found');
            res.status(401).json({ messsage: 'No se encontro el usuario autenticado' });
        }
    }
}

const sessionController = new SessionController();
export default sessionController