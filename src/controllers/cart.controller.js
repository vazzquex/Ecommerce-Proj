import cartsModel from "../DAOs/models/carts.model.js"
import CartDto from "../DTOs/CartDto.js";
import { userService, productService } from "../services/index.js";

import userModel from "../DAOs/models/user.model.js";

class CartController {

  getCart = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await userService.findById(userId);
      // Me quedo solo con el carrito
      if (user) {
        delete user.password;
        delete user.age;
        delete user.img;
        delete user.rol;
        delete user.first_name;
        delete user.last_name;
      }
      console.log(user);

      res.status(200).json({ user });
    } catch (error) {
      req.logger.error(`Error trying to get carts: ${error}`);
      res.status(500).send(`Internal server error trying to get carts: ${error}`);
    };
  }


  addProductToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    try {

      req.logger.debug("Enter in try")

      let user = await userService.getById(userId);
      req.logger.debug(`Product Id ${productId}`);
      let product = await productService.getById(productId);
      req.logger.debug(`User Id: ${userId}`)

      req.logger.debug("Check user")
      if (!user) {
        req.logger.error(`User ${userId} does not exist`);
        return res.status(404).send({ error: 'User not found' });
      }

      req.logger.debug("Check product owner")
      req.logger.debug(product.owner)
      req.logger.debug(user.email)

      req.logger.debug("Check user email and product owner")
      if (user.email === product.owner) {
        req.logger.warning("You cannot add your own product to the cart!")
        return res.status(400)
      }

      user.cart.push({ productId, quantity });
      user.markModified('cart');
      user.save();

      req.logger.debug("updateUser");

      req.logger.debug("populate user");
      await userModel.findById(userId).populate('cart.productId');

      req.logger.debug("respond status")
      // Respond with the populated user.
      return res.status(200).send({ message: `Product added successfully: ${product}` });


    } catch (error) {
      req.logger.error(error);
      req.logger.error("No se puedo añadir producto al carrito");
      res.status(400).send({ error: error.message });
    }
  }

  deleteProductCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
      const user = await userService.getById(userId);
  
      // Filtra los productos en el carrito para excluir el producto que deseas eliminar
      req.logger.debug("Filtro los productos en el carrito");
      user.cart = user.cart.filter(item => item.productId.toString() !== productId);
  
      // save user
      await user.save();
  
      const populateUser = await userService.findById(userId);
      req.logger.info("Product deleted cart")

      res.status(200).json(populateUser)
      
    } catch (error) {
      req.logger.error(`Error removing product from cart: ${error}`);
      res.status(500).send(`Internal server error removing product from cart: ${error}`);
    }
  } 


};

const cartController = new CartController();

export default cartController;