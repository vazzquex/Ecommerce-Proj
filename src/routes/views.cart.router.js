import { Router } from 'express';
import userService from '../services/user.service.js';

const router = Router();


router.post('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const { user: sessionUser } = req.session;
        delete sessionUser.password;


        const populatedUser = await userService.populateProductCart(userId);

        //verify user exists
        if (!populatedUser) {
            return res.status(404).render('error', {
                title: "Error",
                message: "User not found"
            });
        }


        res.status(201).render('cart', {
            title: "Cart",
            products: populatedUser.cart,
            user: sessionUser
        })

    } catch (error) {
        console.error(`Error trying to get cart: ${error}`);
        res.status(500).send(`Internal server error trying to get cart: ${error}`);
    };
});

export default router;