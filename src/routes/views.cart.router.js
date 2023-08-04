import { Router } from 'express';
import userService from '../services/user.service.js';
import productController from '../controllers/product.controller.js'
const router = Router();
//finish purchase

router.get('/purchase/:userId', async (req, res) => {
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

        // Calcula el subtotal para cada producto y el total general
        let total = 0;
        populatedUser.cart = populatedUser.cart.map(item => {

            if (!item.productId) {
                // Maneja el caso en que el producto no existe
                console.error(`Producto no encontrado en el carrito: ${item._id}`);
                return item; // Aquí simplemente estamos omitiendo el producto
            }

            const subtotal = item.productId.price * item.quantity;

            total += subtotal;
            return {
                ...item,
                subtotal,
                product: item.productId
            };
        });


        res.status(201).render('checkout', {
            title: "Checkout",
            products: populatedUser.cart,
            user: sessionUser,
            total,
        })


    } catch (err) {
        console.error(`Error trying to get checkout: ${err}`);
        res.status(500).send(`Internal server error trying to get checkout: ${err}`);
    }


})



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