import { Router } from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get('/:userId/cart', cartController.getCart)
router.post('/:userId/cart', cartController.addProductToCart)
router.post('/:userId/:productId', cartController.deleteProductCart)

export default router;