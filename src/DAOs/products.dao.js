import productModel from "./models/products.model.js";

export default class Product {

	async getById(id) {
		const product = await productModel.getById(id);
		return product;
	}

}