import { Router } from 'express';
const router = Router();
import productController from '../controllers/product.controller.js';
import { isAdmin, isPremium } from '../middleware/auth.middleware.js';

// custom errors
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { ProductErrorInfo } from '../tools/EErrorInfo.js';

//logger
import logger from '../middleware/logger.middleware.js';
import { productService } from '../services/index.js';

const realTimeProductsRouter = (socketServer) => {

    socketServer.on('connection', async (socket) => {
        logger.debug(`New connection: ${socket.id}`);
        // Load products
        try {
            const products = await productController.getProducts();
            await socketServer.emit('products', products);
        } catch (error) {
            logger.error(`Error has been occurred trying to load the products: ${error}`);
        };

        // Create Products
        socket.on('newProduct', async (newProduct) => {
            try {
                await productController.addProduct(newProduct);
                const products = await productController.getProducts();
                await socketServer.emit('products', products);
                logger.debug(`New product: ${newProduct}`)
                socket.emit('createdResoult', { success: true, message: 'Product Created' });
            } catch (error) {
                logger.error(`Error has been occurred trying to create a product: ${error}`);

                CustomErrors.createError(
                    "error creating products",
                    ProductErrorInfo(newProduct),
                    EErrors.PRODUCT_ERROR
                );
            };
        });

        // Delete Product 
        socket.on('deleteProduct', async (productToDelete) => {
            try {
                const { id, email } = productToDelete; // Extraemos el id y el email del objeto recibido

                let product = await productService.getById(id); // Utilizamos el id para obtener el producto

                logger.debug(productToDelete)
                logger.debug("Product owner: ", product.owner)

                logger.debug(email)


                if (product.owner === email) {
                    await productController.deleteProduct(id);
                    socket.emit('deleteResult', { success: true, message: 'Product deleted' });
                    logger.info("Product deleted");
                } else if (!email){
                    await productController.deleteProduct(id);
                    socket.emit('deleteResult', { success: true, message: 'Product deleted' });
                    logger.info("Product deleted");
                }  else {
                    socket.emit('deleteResult', { success: false, message: 'Insufficient Permissions' });
                    logger.error("Insufficient Permissions")
                }

                //await productController.deleteProduct(productToDelete);
                const products = await productController.getProducts();
                await socketServer.emit('products', products);

            } catch (error) {
                logger.error(`Error has been occurred trying to delete a product: ${error}`);
            };
        });
    });

    // Render view
    router.get('/', isPremium, (req, res) => {
        const { user } = req.session;
        delete user.password;

        res.status(200).render('realTimeProducts', {
            script: 'realTimeProducts',
            style: 'realtimeProducts',
            title: 'Productos en tiempo real',
            user

        });

    });


    return router;
};

export default realTimeProductsRouter;