const mongoose = require("mongoose");

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  nip: {
    type: String,
    required: false,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  postal: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
});

const ParamSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  value: {
    type: String,
    required: false,
  },
});

const OrderSchema = mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  product_id: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  parameters: [ParamSchema],
  files: {
    type: [String],
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  multiplier: {
    type: Number,
    required: false,
  },
  placed: {
    type: Date,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  payment: {
    type: String,
    required: false,
  },
  client: ClientSchema,
});

module.exports = mongoose.model("Orders", OrderSchema);
