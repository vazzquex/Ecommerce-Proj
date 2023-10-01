import { Router } from 'express';
const router = Router();
import productController from '../controllers/product.controller.js';
import { isAdmin, isPremium } from '../middleware/auth.middleware.js';
import nodemailer from 'nodemailer';

// custom errors
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { ProductErrorInfo } from '../tools/EErrorInfo.js';

//logger
import logger from '../middleware/logger.middleware.js';
import { productService, userService } from '../services/index.js';
import mailingController from '../controllers/mailing.controller.js';

const email_env = process.env.EMAIL
const email_pass = process.env.EMAIL_PASS

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

                logger.debug(JSON.stringify(productToDelete))
                logger.debug("Product owner: ", product.owner)

                logger.debug(email)

                if (product.owner === email) {
                    await productService.deleteById(id);
                    socket.emit('deleteResult', { success: true, message: 'Product deleted' });
                    logger.info("Product deleted");
                } else if (!email) {
                    await productService.deleteById(id);

                    //Enviamos correo al dueño del producto
                    console.log("Sending email...")
                    try {
                        let productListHTML = '';

                        logger.debug(JSON.stringify(product))
                        let userEmail = product.owner
                        logger.debug(userEmail)

                        const user = await userService.getByEmail(product.owner);
                        logger.debug("Get user")

                        if (!user) {
                            req.logger.error(`User ${user} does not exist`);
                            return res.status(404).json({ error: "User not found" });
                        }

                        logger.debug("Verify product")

                        if (product) {
                            logger.debug("Hay producto")
                            logger.debug(JSON.stringify(product))

                            const id = product._id;
                            const title = product.title;
                            const description = product.description;

                            productListHTML += `
                                <div id="order-details">
                                    <div class="row mb-3">   
                                        <div class="col-md-6">
                                            <h5>${title}</h5>
                                            <p>${description}</p>
                                        </div>
                                        <hr>
                                    </div>
                                </div>
                            `;
                        }
                        const emailHTML = `
                        <h1>Your account has been deleted!</h1>
                        <hr>
                        <section id="order-confirmation" class="container mt-5">
                                <h1 class="text-center">Product Detail</h1>
                                <hr>
                                <h3>Products removed from your account</h3>
                                ${productListHTML}
                        </section>
                    `;
                        
                    logger.debug("Transport...")
                        const trasport = nodemailer.createTransport({
                            service: 'gmail',
                            port: 587,
                            auth: {
                                user: `${email_env}`,
                                pass: `${email_pass}`
                            }
                        });

                    logger.debug("Sending email...")
                        
                        let mailOptions = await trasport.sendMail({
                            from: `Coder Test <${email}>`,
                            to: userEmail,
                            subject: 'Your Product has been removed',
                            html: emailHTML,
                        });
                        logger.debug("Email sent")

                        socket.emit('deleteResult', { success: true, message: 'Product deleted, the seller will be notified by email.' });
                        logger.info("Product deleted");

                    } catch (error) {
                        socket.emit('deleteResult', { success: false, message: 'An error occurred trying to delete the product.' });
                        logger.info("Erorr trying to delete the product: ", error);
                    }


                } else {
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