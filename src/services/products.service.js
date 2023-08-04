import productModel from '../dao/models/products.model.js';


class ProductModel {
	constructor() {
		this.model = productModel;
	}


	async getById(id) {
		return await this.model.findById(id);
	}


}

const productService = new ProductModel();
export default productService;
