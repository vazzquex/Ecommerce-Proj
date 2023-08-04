import userModel from '../dao/models/user.model.js';
import UserDto from './dto/UserDto.js';

class UserService {
	constructor() {
		this.model = userModel;
	}

	async populateProductCart(userId){
		const user = await this.model.findById(userId).populate('cart.productId').lean();
		return new UserDto(
			user.first_name,
			user.last_name,
			user.email,
			user.age,
			user.rol,
			user.cart,
			user.img
		);
	};

	async updateUser(user) {
		user.markModified('cart');
		await user.save();
	  
		//populate the user cart after saving
		return await this.populateProductCart(user._id);
	  }

	// async getAll() {
	// 	return await this.model.find();
	// }


	async getAll() {
		const users = await this.model.find();
		return users.map(user => new UserDto(
			user.first_name,
			user.last_name,
			user.email,
			user.age,
			user.rol,
			user.cart,
			user.img
		));
	}


	async getCartUser(userId) {
		return await this.model.findOne(
			{
				_id: userId
			},
			{
				_id: 0,
				cart: 1
			}
		);
	}

	async getByEmail(email) {
		return await this.model.findOne({ email: email });
	}

	async createUser(userData) {
		return await this.model.create(userData);
	}

	async getById(id) {
		return await this.model.findById(id);
	}

	async getByAge(age) {
		return await this.model.findOne({ age: age });
	}

}

const userService = new UserService();
export default userService;
