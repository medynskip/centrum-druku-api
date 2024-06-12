// const mongoose = require("mongoose");

import mongoose from "mongoose";

const InvoicesSchema = mongoose.Schema({
  id: {
    type: Number,
    required: false,
  },
  month: {
    type: Number,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
});

const ConfigurationSchema = mongoose.Schema({
  companyName: {
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
  phone: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  lastInvoice: InvoicesSchema,
  lastTempInvoice: InvoicesSchema,
});

export default ConfigurationSchema;

// module.exports = mongoose.model("Configuration", ConfigurationSchema);
