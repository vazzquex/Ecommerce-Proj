import { Router } from 'express';
import productController from '../controllers/product.controller.js';

const router = Router();

// Get
router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', productController.createProduct);
router.delete('/:pid', productController.deleteProductById);


export default router;