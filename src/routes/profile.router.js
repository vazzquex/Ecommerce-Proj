import { Router } from 'express';
import { isAuth, isGuest } from '../middleware/auth.middleware.js';

import productController from '../controllers/product.controller.js';


const profileRouters = Router();

profileRouters.get('/', isAuth, (req, res) => {
    const { user } = req.session;
    delete user.password;

    res.render('index', {
        title: 'Perfil de Usuario',
        user
    });
});

profileRouters.get('/register', isGuest, (req, res) => {
    res.render('register', {
        style: 'style',
        title: 'Registrar Nuevo Usuario',
    });
});

profileRouters.get('/login', isGuest, (req, res) => {
    res.render('login', {
        style: 'style',
        title: 'Inicio de Sesión',
    });
});



profileRouters.get('/products', isAuth, async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const products = await productController.getProducts(limit, page, sort, query);

        const { user } = req.session;
        delete user.password;

        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : null;
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : null;

        if (products.totalPages > 1) {
            products.totalPagesArray = [];
            for (let i = 1; i <= products.totalPages; i++) {
                products.totalPagesArray.push(i);
            };
        };
        res.status(200).render('products', {
            script: 'index',
            style: 'index',
            title: 'Productos',
            products: products,
            user
        });

    } catch (error) {
        res.status(500).send(`Error trying to fetch all the products: ${error}`);
    };

});



profileRouters.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;


    try {
        const product = await productController.getProductById(pid);
        const { user } = req.session;
        delete user.password;

        res.status(200).render('product', {
            script: 'products',
            style: 'product',
            title: `${product.title}`,
            product,
            user

        });

    } catch (error) {
        res.status(500).send(`Error trying to fetch product by id: ${error}`);
    };
})

export default profileRouters;
