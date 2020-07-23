const mongoose = require('mongoose');

const FieldSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    multiplier: {
        type: Number,
        required: true
    }
})

const ParameterSchema = mongoose.Schema({
    fieldName: {
        type: String,
        reuired: true
    },
    fieldValues: [FieldSchema]
})

PriceSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        reuired: false
    },
    icon: {
        type: String,
        required: false
    },
    duration: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    parameters: [ParameterSchema],
    prices: [PriceSchema]
})

module.exports = mongoose.model('Products', ProductSchema);