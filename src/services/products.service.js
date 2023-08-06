import productModel from '../DAOs/models/products.model.js';
import ProductDto from '../DTOs/ProductsDto.js';

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
