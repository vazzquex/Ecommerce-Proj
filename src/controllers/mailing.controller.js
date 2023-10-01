import { productService, userService } from "../services/index.js";
import productController from "./product.controller.js";
import productModel from "../DAOs/models/products.model.js";
import nodemailer from 'nodemailer';

const email = process.env.EMAIL
const email_pass = process.env.EMAIL_PASS

const deleteUserInactiveMail = async (req, res) => {
    const { userEmails, products } = req.body;


    try {
        for (const userEmail of userEmails) {
            let productListHTML = '';

            const user = await userService.getByEmail(userEmail);
            req.logger.info("Get user Email")

            if (!user) {
                req.logger.error(`User ${userEmail} does not exist`);
                return res.status(404).json({ error: "User not found" });
            }

            if (products) {
                req.logger.debug("Hay productos")

                for (const product of products) {
                    const id = product.productId.id ?? "";
                    const title = product.productId.title ?? "";
                    const description = product.productId.description ?? "";

                    // encontrar producto en db
                    if (id != "") {
                        let dbproduct = await productService.getById(id)
                    }

                    if (!dbproduct) {
                        req.logger.error(`Product with ID ${id} not found)`);
                        return res.status(404).json({ error: `Product with ID ${id} not found.` });
                    } else {
                        req.logger.debug(`Product with ID ${id} is found`);

                        req.logger.debug("Deleting product...");
                        await productController.deleteProductById(id)
                        req.logger.debug("Product delete")
                    }

                    // Guarda el producto
                    await dbproduct.save();

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
            }


            // Generar el HTML completo del correo electrónico.
            const emailHTML = `
            <h1>Your account has been deleted due to inactivity!</h1>
            <hr>
            <section id="order-confirmation" class="container mt-5">
                    <h1 class="text-center">Product Detail</h1>
                    <hr>
                    <h3>Products removed from your account</h3>
                    ${productListHTML}
            </section>
        `;


            let mailOptions = await trasport.sendMail({
                from: `Coder Test <${email}>`,
                to: userEmail,
                subject: 'Your Account has been removed',
                html: emailHTML,
            });

            req.logger.debug(`Correo enviado a ${userEmail}`)

        }


        res.status(201).json(`The account deleted due to inactivity has been sending to:  ${userEmails}`);

    } catch (err) {
        req.logger.error("Error to send delete account email");
        res.send(500).json({ message: "Error to send deleted account email", err })
    }
}



const deleteProductMail = async (req, res) => {
    const { userEmail, products } = req.body;


    try {

        let productListHTML = '';

        const user = await userService.getByEmail(userEmail);
        req.logger.info("Get user Email")

        if (!user) {
            req.logger.error(`User ${userEmail} does not exist`);
            return res.status(404).json({ error: "User not found" });
        }

        if (products) {
            req.logger.debug("Hay producto")
            req.logger.debug(JSON.stringify(products))


            for (const product of products) {

                const id = product.id ?? "";
                const title = product.title ?? "";
                const description = product.description ?? "";

                // encontrar producto en db
                let dbproduct = await productService.getById(id)

                if (!dbproduct) {
                    req.logger.error(`Product with ID ${id} not found)`);
                    return res.status(404).json({ error: `Product with ID ${id} not found.` });
                } else {
                    req.logger.debug(`Product with ID ${id} is found`);
                    req.logger.debug("Deleting product...");
                    //await productService.deleteById(id)
                    req.logger.debug("Product delete")
                }

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
        }

        // Generar el HTML completo del correo electrónico.
        const emailHTML = `
            <h1>Your product has been deleted!</h1>
            <hr>
            <section id="order-confirmation" class="container mt-5">
                    <h1 class="text-center">Product Detail</h1>
                    <hr>
                    <h3>Products removed from your account</h3>
                    ${productListHTML}
            </section>
        `;

        req.logger.debug("Sending email...")
        let mailOptions = await trasport.sendMail({
            from: `Coder Test <${email}>`,
            to: userEmail,
            subject: 'Your Product has been removed',
            html: emailHTML,
        });

        req.logger.debug(`Correo enviado a ${userEmail}`)
        res.status(201).json(`The product deleted has been sending to:  ${userEmail}`);
    } catch (err) {
        req.logger.error("Error to send product deleted email");
        res.send(500).json({ message: "Error to send product deleted email", err })
    }
}

const trasport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: `${email}`,
        pass: `${email_pass}`
    }
});

export default {
    deleteUserInactiveMail,
    deleteProductMail
}