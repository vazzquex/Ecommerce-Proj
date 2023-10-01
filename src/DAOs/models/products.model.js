import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "products";
const productSchema = new mongoose.Schema({
  title:{ 
    type: String, 
    required: true 
  },
  description:{ 
    type: String, 
    required: true
  },
  price:{ 
    type: Number,
    required: true 
  },
  status: {
    type: Boolean,
    default: true
  },
  stock:{
    type: Number, 
    required: true
  },
  category:{
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: 'https://www.carsaludable.com.ar/wp-content/uploads/2014/03/default-placeholder.png'
    //required: true
  },
  owner: {
    type: String,
    ref: 'users',
    default: 'admin'
  }

});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;