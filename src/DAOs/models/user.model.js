import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		//required: true,
	},
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
		productId: { type: mongoose.Schema.Types.ObjectId, 
		ref: 'products' },
		quantity: Number
	}],
	password: {
		type: String,
		//required: true,
	},
	img: {
		default: "https://www.carsaludable.com.ar/wp-content/uploads/2014/03/default-placeholder.png",
		type: String
	},

	documents: [{
		name: String,
		reference: String,
	}],

	last_connection: {
		type: Date,
	},

	resetPasswordToken: String,
	resetPasswordExpires: Date

});

const userModel = mongoose.model('users', userSchema);

export default userModel;
