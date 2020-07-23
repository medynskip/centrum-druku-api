const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
    name: {
        type: String,
        reuired: false
    },
    nip: {
        type: String,
        reuired: false
    },
    street: {
        type: String,
        reuired: false
    },
    city: {
        type: String,
        reuired: false
    },
    postal: {
        type: String,
        reuired: false
    },
    email: {
        type: String,
        reuired: false
    }
})

const ParamSchema = mongoose.Schema({
    name: {
        type: String,
        reuired: false
    },
    value: {
        type: String,
        reuired: false
    }
})


const OrderSchema = mongoose.Schema({
    product: {
        type: String,
        required: false
    },
    product_id: {
        type: String,
        required: false
    },
    volume: {
        type: Number,
        required: false
    },
    parameters: [ParamSchema],
    files: {
        type: [String],
        reuired: false
    },
    price: {
        type: Number,
        required: false
    },
    multiplier: {
        type: Number,
        required: false
    },
    placed: {
        type: Date,
        required: false
    },
    deadline: {
        type: Number,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    payment: {
        type: String,
        required: false
    },
    client: ClientSchema
})

module.exports = mongoose.model('Orders', OrderSchema);