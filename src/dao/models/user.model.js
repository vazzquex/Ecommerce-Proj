import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
	age: Number,
	rol: {
		type: String,
		default: "user"
	},
	cart: [{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
		quantity: Number
	}],
	password: String,
	img: String,
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
