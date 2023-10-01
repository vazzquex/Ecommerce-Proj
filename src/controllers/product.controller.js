import productModel from '../DAOs/models/products.model.js';
import mongoose from 'mongoose';
import { productRepository } from '../repositories/index.js';
import { productService } from '../services/index.js';

// custom errors
import CustomErrors from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';
import { ProductErrorInfo } from '../tools/EErrorInfo.js';


class ProductController {

  createProduct = async (req, res) => {
    if (!req.body) return;

    req.logger.debug(req.body)

    try {
      req.logger.debug('Entro en el try');

      const currentProduct = await productController.addProduct(req.body);

      if(!currentProduct){
        req.logger.error('The product cannot be created, parameters are missing');
        res.status(400).send('The product cannot be created, parameters are missing');
        return
      }

      req.logger.debug('Product created successfully');

      res.status(201).send({ currentProduct });

    } catch (error) {
      req.logger.error(`Error trying to create a product: ${error}`);
      res.status(500).send(`Error trying to create a product: ${error}`);
    };

  }

  getAllProducts = async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;

      const products = await productController.getProducts(limit, page, sort, query);
      res.status(200).send(products);
    } catch (error) {
      req.logger.error(`Error al obtener productos: ${error}`);
      res.status(500).send(`Error al obtener productos: ${error}`);
    };
  }


  // Read
  getProducts = async (limit, page, sort, query) => {
    let formatLimit = limit ? Number(limit) : 4;
    let formatPage = page ? Number(page) : 1;
    let formatQuery = query ? { category: query } : {};

    let formatSort;
    if (sort === "asc") {
      formatSort = "1";
    } else if (sort === "desc") {
      formatSort = "-1";
    } else if (sort && sort !== "asc" && sort !== "desc") {
      throw new Error('Error: Bad Request, just admit asc and desc');
    };

    try {
      const products = await productModel.paginate(formatQuery, { page: formatPage, limit: formatLimit, sort: { price: formatSort }, lean: true })
      return products;
    } catch (error) {
      console.error(`Error trying to fetch all products: ${error}`);
    };
  };


  getProductById = async (req, res) => {
    const pid = req.params.pid;

    req.logger.debug(`Product id: ${pid}`)

    try {
      req.logger.debug(`Entro en el try`)

      const product = await productService.getById(pid);

      req.logger.debug(product)

      res.status(200).send({ product });

    } catch (error) {

      CustomErrors.createError(
        "error creating products",
        ProductErrorInfo(error),
        "error creating products",
        EErrors.PRODUCT_ERROR
      );
      req.logger.error(`Error trying to fetch product by id: ${error}`);
    };
  };



  // Create
  addProduct = async (product) => {

    const title = product.title ? product.title.trim() : '';
    const description = product.description ? product.description.trim() : '';
    const price = product.price ? Number(product.price) : 0;
    const category = product.category ? product.category.trim() : '';
    const status = product.status ?? true;
    const stock = product.stock ? Number(product.stock) : 0;
    const owner = product.email || 'admin';
    const thumbnail = product.thumbnail;


    const formattedProduct = {
      title: title,
      description: description,
      price: price,
      category: category,
      status: status,
      stock: stock,
      owner: owner,
      thumbnail: thumbnail,
    };

    try {
      const newProduct = new productModel(formattedProduct);
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error(`Error trying to create a new product: ${error}`);
    };
  };


  // Delete
  deleteProductById = async (req, res) => {
    const pid = req.params.pid;

    try {
      const deletedProduct = await productModel.findByIdAndDelete(pid);

      if (!deletedProduct) {
        res.status(404).send({ message: 'Product to delete not found' });
      }

      req.logger.debug(`Product deleted successfully: ${deletedProduct}`);
      res.status(200).send(`Product deleted successfully: ${deletedProduct}`);

    } catch (error) {
      req.logger.error(`Error trying to delete a product: ${error}`);
      res.status(500).send(`Error trying to delete product: ${error}`);
    };
  };
}

const productController = new ProductController();

export default productController;