import mongoose from "mongoose";
const { Schema } = mongoose;

const FieldSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
});

const ParameterSchema = new Schema({
  fieldName: {
    type: String,
    required: true,
  },
  fieldValues: [FieldSchema],
});

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },
  descriptionShort: {
    type: String,
    required: false,
  },
  descriptionLong: {
    type: String,
    required: false,
  },
  parameters: [ParameterSchema],
  // prices: [PriceSchema],
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
