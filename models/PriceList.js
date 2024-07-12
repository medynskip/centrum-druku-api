import mongoose from "mongoose";
const { Schema } = mongoose;

const ValuesSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

const PriceListSchema = new Schema({
  productID: {
    type: String,
    required: true,
  },
  variants: [{
    configuration: [String],
    values: [ValuesSchema]
  }],
  values: [ValuesSchema]
});

const PriceList = mongoose.model('PriceList', PriceListSchema);

export default PriceList;
